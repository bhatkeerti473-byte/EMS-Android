const Razorpay = require("razorpay");
const crypto = require("crypto");
const Booking = require("../models/Booking");
const Payment = require("../models/Payment");
const Notification = require("../models/Notification");
const { createInvoiceForBooking, markInvoicePaid } = require("../services/billingService");
const { sendEmail } = require("../services/emailService");
const { generateBookingConfirmationEmail } = require("../utils/emailTemplates");
const Venue = require("../models/Venue");
const mongoose = require("mongoose");

// Initialize Razorpay instance with credentials from environment variables
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// --- Helper Functions ---

const formatINR = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

const formatDate = (value) => {
  if (!value) return "To be confirmed";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString("en-IN");
};

const sendBookingConfirmationEmail = async ({ booking, payment, invoice }) => {
  const clientEmailAddress = booking?.clientEmail || booking?.client_email;
  if (!clientEmailAddress) {
    console.warn("Booking confirmation email skipped because client email is missing.");
    return;
  }

  let bookingData = booking.toObject ? booking.toObject() : booking;

  // Add payment details to booking data if not already present
  if (payment) {
    bookingData.payment_method = payment.method || payment.payment_method || "Razorpay";
    bookingData.payment_id = payment.razorpay_payment_id || payment.razorpayPaymentId || payment._id;
  }

  // Fetch venue image if not present in booking
  if (!bookingData.image && (bookingData.venue_id || bookingData.venueId || bookingData.venueName)) {
    try {
      const vId = bookingData.venue_id || bookingData.venueId;
      let venue = null;
      if (vId && mongoose.Types.ObjectId.isValid(vId)) {
        venue = await Venue.findById(vId).lean();
      }
      if (!venue && bookingData.venueName) {
        venue = await Venue.findOne({ name: bookingData.venueName }).lean();
      }
      if (venue && venue.images && venue.images.length > 0) {
        bookingData.image = venue.images[0];
      }
    } catch (err) {
      console.error("Error fetching venue for email image:", err.message);
    }
  }

  const subject = `Booking confirmed - ${booking.eventTitle || booking.event_type || booking.event_title || "Event Booking"}`;
  const text = "Your event booking has been confirmed. Please view the HTML version of this email for full details.";
  
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  const html = generateBookingConfirmationEmail(bookingData, frontendUrl);

  await sendEmail(clientEmailAddress, subject, text, html);
};

// --- Controller Endpoints ---

/**
 * POST /api/payments/create-order
 * Create a Razorpay order for payment
 */
exports.createOrder = async (req, res) => {
  try {
    const { booking_id, client_id, phone_number, event_type } = req.body;

    if (!booking_id) {
      return res.status(400).json({
        message: "Missing booking_id",
      });
    }

    const booking = await Booking.findById(booking_id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Use authoritative amount: 30% of total_cost
    const authoritativeAmount = Math.round(booking.total_cost * 0.3);

    // Amount in paise (multiply by 100)
    let amountInPaise = authoritativeAmount * 100;

    // IMPORTANT: Razorpay test mode has limits on transaction size for some accounts
    // To allow testing large bookings without breaking the UI, we cap the Razorpay order amount 
    // to a safe test limit (1,000 INR = 100000 paise) only for the gateway, 
    // but the system still tracks the authoritativeAmount.
    const TEST_LIMIT_PAISE = 100000; // 1,000 INR
    if (amountInPaise > TEST_LIMIT_PAISE) {
      amountInPaise = TEST_LIMIT_PAISE;
      console.log(`Test mode: capping Razorpay order amount from ₹${authoritativeAmount} to ₹1,000`);
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${booking_id}`,
      payment_capture: 1, // Auto-capture payment
      notes: {
        booking_id,
        client_id,
        phone_number,
        event_type,
        amount_inr: authoritativeAmount, // Save real amount in notes
      },
    });

    return res.status(201).json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      message: "Order created successfully",
    });
  } catch (error) {
    console.error("----- RAZORPAY CREATE ORDER ERROR -----");
    console.error("Message:", error.message);
    if (error.error) console.error("Razorpay Details:", error.error);
    console.error("---------------------------------------");
    res.status(500).json({
      message: "Failed to create payment order",
      error: error.message,
    });
  }
};

/**
 * POST /api/payments/create-remaining-order
 * Create a Razorpay order for the remaining balance
 */
exports.createRemainingOrder = async (req, res) => {
  try {
    const { booking_id } = req.body;

    if (!booking_id) {
      return res.status(400).json({ message: "Missing booking_id" });
    }

    const booking = await Booking.findById(booking_id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Verify ownership
    const bookingOwnerId = booking.userId || booking.client_id;
    if (req.user && req.user.id && bookingOwnerId && String(req.user.id) !== String(bookingOwnerId)) {
      return res.status(403).json({ message: "Not authorized to pay for this booking" });
    }

    if (booking.booking_status === "Cancelled" || booking.booking_status === "Rejected") {
       return res.status(400).json({ message: "Cannot pay for a cancelled or rejected booking" });
    }

    const totalCost = Number(booking.total_cost || 0);
    const advancePaid = Number(booking.advance_paid || booking.amount_paid || 0);
    const remainingAmount = Math.max(0, totalCost - advancePaid);

    if (remainingAmount <= 0) {
      return res.status(400).json({ message: "Booking is already fully paid" });
    }

    // Amount in paise (multiply by 100)
    let amountInPaise = remainingAmount * 100;

    const TEST_LIMIT_PAISE = 100000; // 1,000 INR
    if (amountInPaise > TEST_LIMIT_PAISE) {
      amountInPaise = TEST_LIMIT_PAISE;
      console.log(`Test mode: capping Razorpay order amount from ₹${remainingAmount} to ₹1,000`);
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `rem_receipt_${booking_id}_${Date.now()}`,
      payment_capture: 1,
      notes: {
        booking_id,
        client_id: booking.client_id || booking.userId,
        amount_inr: remainingAmount,
        payment_type: "remaining"
      },
    });

    return res.status(201).json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      message: "Remaining balance order created successfully",
    });
  } catch (error) {
    console.error("----- RAZORPAY CREATE REMAINING ORDER ERROR -----");
    console.error("Message:", error.message);
    if (error.error) console.error("Razorpay Details:", error.error);
    res.status(500).json({
      message: "Failed to create remaining payment order",
      error: error.message,
    });
  }
};

/**
 * POST /api/payments/verify-payment
 * Verify Razorpay payment signature and update booking status
 */
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      booking_id,
      client_id,
      amount_paid,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        message: "Missing payment verification details",
      });
    }

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed. Invalid signature.",
        error: "INVALID_SIGNATURE",
      });
    }

    // Check if booking is already confirmed to prevent duplicate processing
    let booking = await Booking.findById(booking_id);
    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    if (booking.booking_status === "Confirmed" && booking.payment_id === razorpay_payment_id) {
      // Already processed
      return res.status(200).json({
        success: true,
        message: "Payment already verified successfully.",
        booking: booking
      });
    }

    // Fetch the actual order to verify the amount, preventing frontend spoofing
    const rpOrder = await razorpay.orders.fetch(razorpay_order_id);
    const actualAmountPaid = rpOrder.amount / 100;

    // Signature is valid - Update booking status and advance_paid incrementally
    const oldAdvancePaid = Number(booking.advance_paid || booking.amount_paid || 0);
    const newAdvancePaid = oldAdvancePaid + actualAmountPaid;

    booking = await Booking.findByIdAndUpdate(
      booking_id,
      {
        booking_status: "Confirmed",
        status: "Approved",
        advance_paid: newAdvancePaid,
        amount_paid: newAdvancePaid,
        paymentConfirmedAt: new Date(),
        payment_method: "Razorpay",
        payment_id: razorpay_payment_id,
      },
      { new: true }
    );

    // Save payment record
    const payment = new Payment({
      invoiceId: undefined,
      bookingId: booking._id,
      booking_id: booking_id,
      client_id: client_id,
      userId: booking.userId || client_id,
      razorpay_order_id: razorpay_order_id,
      razorpay_payment_id: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      amount: actualAmountPaid,
      status: "Success",
      method: "Razorpay",
      payment_method: "Razorpay",
    });

    await payment.save();

    // Auto-generate invoice and mark it as partially/fully paid
    try {
      const invoice = await createInvoiceForBooking(booking);
      if (invoice) {
        payment.invoiceId = invoice._id;
        await payment.save();
        if (actualAmountPaid >= invoice.totalAmount) {
          // Fully paid
          await markInvoicePaid({ invoice, payment, method: "Razorpay" });
        } else {
          // Partially paid
          invoice.status = "Partially Paid";
          invoice.paidAmount = actualAmountPaid;
          invoice.receiptNumber = payment.receiptNumber || `RCT-${Date.now()}`;
          invoice.receiptGeneratedAt = new Date();
          await invoice.save();
        }
        await sendBookingConfirmationEmail({ booking, payment, invoice });
      }
    } catch (invoiceError) {
      console.error("Error generating invoice during payment verification:", invoiceError);
      // We don't fail the payment if invoice generation fails, just log it
    }

    // Create real notifications for BOTH Client and Admin
    try {
      // 1. Client Notification
      await Notification.create({
        receiverId: booking.userId || client_id || booking.client_id,
        receiverRole: "Client",
        category: "Payment",
        title: "Payment Successful",
        message: "Your payment has been successfully received.",
        bookingId: booking_id,
        sender: "System"
      });

      // 1b. Booking Confirmed Notification (since status is now Confirmed)
      await Notification.create({
        receiverId: booking.userId || client_id || booking.client_id,
        receiverRole: "Client",
        category: "Booking",
        title: "Booking Confirmed",
        message: "Your event booking has been confirmed.",
        bookingId: booking_id,
        sender: "System"
      });

      // 2. Admin Notification
      await Notification.create({
        receiverRole: "Admin",
        category: "Payment",
        title: "Payment Received & Booking Confirmed 💳",
        message: `Payment of ₹${actualAmountPaid} received for booking ${booking_id} from ${booking.clientName || "Client"}. Status updated to Confirmed.`,
        bookingId: booking_id,
        sender: "Client",
        metadata: {
          clientName: booking.clientName || "Client",
          paidAmount: `₹${actualAmountPaid}`,
          transactionId: razorpay_payment_id
        }
      });
    } catch (notifErr) {
      console.error("Error creating payment notifications:", notifErr);
    }

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully. Booking confirmed and invoice generated.",
      booking: booking,
      payment,
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({
      message: "Payment verification error",
      error: error.message,
    });
  }
};

/**
 * GET /api/payments/booking/:bookingId
 * Get payment details for a booking
 */
exports.getPaymentByBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const payment = await Payment.findOne({ booking_id: bookingId });

    if (!payment) {
      return res.status(404).json({
        message: "No payment found for this booking",
      });
    }

    return res.status(200).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    console.error("Error fetching payment:", error);
    res.status(500).json({
      message: "Error fetching payment details",
      error: error.message,
    });
  }
};

/**
 * POST /api/payments/refund
 * Process refund for a booking
 */
exports.refundPayment = async (req, res) => {
  try {
    const { booking_id, reason } = req.body;

    if (!booking_id) {
      return res.status(400).json({
        message: "Booking ID is required",
      });
    }

    // Find payment record
    const payment = await Payment.findOne({ booking_id: booking_id });

    if (!payment) {
      return res.status(404).json({
        message: "No payment found for this booking",
      });
    }

    // Process refund through Razorpay
    try {
      const refund = await razorpay.payments.refund(payment.razorpay_payment_id, {
        amount: Math.round(payment.amount * 100), // Amount in paise
        notes: {
          reason: reason || "Cancellation by user",
        },
      });

      // Update payment status
      payment.status = "Refunded";
      payment.refund_id = refund.id;
      await payment.save();

      // Update booking status
      await Booking.findByIdAndUpdate(booking_id, {
        booking_status: "Cancelled",
      });

      return res.status(200).json({
        success: true,
        message: "Refund processed successfully",
        refund: refund,
      });
    } catch (refundError) {
      console.error("Refund error:", refundError);
      return res.status(400).json({
        message: "Failed to process refund",
        error: refundError.message,
      });
    }
  } catch (error) {
    console.error("Error in refund endpoint:", error);
    res.status(500).json({
      message: "Error processing refund",
      error: error.message,
    });
  }
};