const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const paymentController = require("../controllers/paymentController");
const Booking = require("../models/Booking");
const Invoice = require("../models/Invoice");
const Payment = require("../models/Payment");
const Transaction = require("../models/Transaction");
const { createInvoiceForBooking, markInvoicePaid } = require("../services/billingService");
const { sendEmail } = require("../services/emailService");

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const getRemainingAmount = (invoice) =>
  Math.max(Number(invoice.totalAmount || 0) - Number(invoice.paidAmount || 0), 0);

const normalizeGatewayMethod = (method) => {
  const value = String(method || "").trim().toLowerCase();
  if (value === "upi") return "UPI";
  if (value === "net banking" || value === "netbanking") return "Net Banking";
  if (value === "debit/credit card" || value === "card") return "Debit/Credit Card";
  return "Razorpay";
};

const formatINR = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

const sendPaidInvoiceEmail = async ({ invoice, payment }) => {
  if (!invoice?.clientEmail) return;

  const subject = `Payment received - ${invoice.invoiceNumber}`;
  const text = [
    `Dear ${invoice.clientName || "Client"},`,
    "",
    "Thank you. Your payment has been received and your booking details have been updated.",
    "",
    `Invoice: ${invoice.invoiceNumber}`,
    `Event: ${invoice.eventTitle || invoice.venueName || "Event Booking"}`,
    `Total Amount: ${formatINR(invoice.totalAmount)}`,
    `Amount Paid: ${formatINR(payment.amount)}`,
    `Receipt: ${payment.receiptNumber || invoice.receiptNumber || "Generated"}`,
    "",
    "Regards,",
    "Event Management System",
  ].join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; color: #0f172a; max-width: 640px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px;">
      <h2 style="margin: 0 0 12px; color: #059669;">Payment Received</h2>
      <p>Dear ${invoice.clientName || "Client"},</p>
      <p>Thank you. Your payment has been received and your booking details have been updated.</p>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">Invoice</td><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;"><strong>${invoice.invoiceNumber}</strong></td></tr>
        <tr><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">Event</td><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${invoice.eventTitle || invoice.venueName || "Event Booking"}</td></tr>
        <tr><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">Total Amount</td><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${formatINR(invoice.totalAmount)}</td></tr>
        <tr><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">Amount Paid</td><td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${formatINR(payment.amount)}</td></tr>
        <tr><td style="padding: 10px;">Receipt</td><td style="padding: 10px;">${payment.receiptNumber || invoice.receiptNumber || "Generated"}</td></tr>
      </table>
      <p>Regards,<br/><strong>Event Management System</strong></p>
    </div>
  `;

  await sendEmail(invoice.clientEmail, subject, text, html);
};

router.get("/health", (req, res) => {
  res.json({ success: true, message: "Payments API running" });
});

router.get("/razorpay-key", (req, res) => {
  const keyId = process.env.RAZORPAY_KEY_ID || "";
  res.json({ success: true, key: keyId, keyId });
});

const authMiddleware = require("../middleware/auth");

router.post("/create-order", paymentController.createOrder);
router.post("/verify-payment", paymentController.verifyPayment);
router.post("/create-remaining-order", authMiddleware.isAuthenticated, paymentController.createRemainingOrder);

router.post("/create-payout-order", async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount) {
      return res.status(400).json({ message: "Amount is required" });
    }
    const amountInPaise = Math.min(Math.round(Number(amount) * 100), 100000); // Bypasses Razorpay test payment limit of 1000 INR
    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `payout_rcpt_${Date.now()}`,
      payment_capture: 1,
    });
    res.status(201).json({
      success: true,
      order_id: order.id,
      amount: order.amount,
    });
  } catch (error) {
    console.error("Error creating payout order:", error);
    res.status(500).json({ message: "Failed to create payout order", error: error.message });
  }
});

router.post("/verify-payout", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      payoutType,
      email,
      name,
      amount,
      roleOrCategory,
      bankAccount,
      upiId,
    } = req.body;

    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Signature verification failed" });
    }

    if (email) {
      const isStaff = payoutType === "staff";
      const subject = isStaff ? "Salary Credited - Event Management System" : "Contract Payment Settled - Event Management System";
      
      const emailText = isStaff 
        ? `Dear ${name},\n\nCongratulations! Your salary has been credited successfully.\n\nDetails:\nRole: ${roleOrCategory}\nAmount: ₹${Number(amount).toLocaleString("en-IN")}\nTransaction ID: ${razorpay_payment_id}\n\nThank you,\nEvent Management System`
        : `Dear ${name},\n\nCongratulations! Your contract payment has been settled successfully.\n\nDetails:\nCategory: ${roleOrCategory}\nAmount: ₹${Number(amount).toLocaleString("en-IN")}\nTransaction ID: ${razorpay_payment_id}\n\nThank you,\nEvent Management System`;

      const html = `
        <div style="font-family: Arial, sans-serif; color: #0f172a; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; text-align: left;">
          <h2 style="margin: 0 0 12px; color: #16a34a;">Congratulations! Payment Credited</h2>
          <p>Dear <strong>${name}</strong>,</p>
          <p>Your payment from <strong>Event Management System</strong> has been processed successfully through Razorpay.</p>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 10px; color: #64748b;">Payout Type</td><td style="padding: 10px; font-weight: bold; color: #0f172a;">${isStaff ? "Staff Salary" : "Vendor Settlement"}</td></tr>
            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 10px; color: #64748b;">${isStaff ? "Role" : "Category"}</td><td style="padding: 10px; color: #0f172a;">${roleOrCategory}</td></tr>
            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 10px; color: #64748b;">Amount Paid</td><td style="padding: 10px; font-weight: bold; color: #16a34a; font-size: 16px;">₹${Number(amount).toLocaleString("en-IN")}</td></tr>
            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 10px; color: #64748b;">Razorpay Payment ID</td><td style="padding: 10px; font-family: monospace; font-size: 13px; color: #0f172a;">${razorpay_payment_id}</td></tr>
            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 10px; color: #64748b;">Bank A/C Paid To</td><td style="padding: 10px; color: #0f172a;">${bankAccount || "N/A"}</td></tr>
            <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 10px; color: #64748b;">UPI ID Paid To</td><td style="padding: 10px; color: #0f172a;">${upiId || "N/A"}</td></tr>
          </table>
          <p style="margin-top: 24px;">Thank you for your service.</p>
          <p style="margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 16px; font-size: 12px; color: #94a3b8;">This is a system-generated receipt. Please contact the administrator for any concerns.</p>
        </div>
      `;

      await sendEmail(email, subject, emailText, html);
      console.log("payout email notification sent successfully to " + email);
    }

    res.status(200).json({ success: true, message: "Payout payment verified and email notification sent" });
  } catch (error) {
    console.error("Error verifying payout:", error);
    res.status(500).json({ success: false, message: "Verification failed", error: error.message });
  }
});
router.get("/booking/:bookingId", paymentController.getPaymentByBooking);
router.post("/refund", paymentController.refundPayment);

router.post("/invoices/generate", async (req, res) => {
  try {
    const { bookingId, baseAmount } = req.body;

    if (!bookingId) {
      return res.status(400).json({ message: "bookingId is required" });
    }

    const invoice = await createInvoiceForBooking(bookingId, baseAmount);
    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).json({ message: "Unable to generate invoice", error: error.message });
  }
});

router.get("/invoices/:invoiceId/pdf", async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.invoiceId);

    if (!invoice) {
      return res.status(404).send("Invoice not found");
    }

    res.type("html").send(`<!doctype html>
<html>
  <head>
    <title>${escapeHtml(invoice.invoiceNumber)}</title>
    <style>
      body { font-family: Arial, sans-serif; color: #0f172a; padding: 32px; }
      .invoice { max-width: 760px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 28px; }
      h1 { margin: 0 0 8px; }
      table { width: 100%; border-collapse: collapse; margin-top: 24px; }
      td, th { padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: left; }
      .total { font-size: 20px; font-weight: 700; }
    </style>
  </head>
  <body>
    <main class="invoice">
      <h1>Invoice ${escapeHtml(invoice.invoiceNumber)}</h1>
      <p>Status: ${escapeHtml(invoice.status)}</p>
      <table>
        <tr><th>Client</th><td>${escapeHtml(invoice.clientName || invoice.userId)}</td></tr>
        <tr><th>Event</th><td>${escapeHtml(invoice.eventTitle || invoice.venueName || "Booking")}</td></tr>
        <tr><th>Base Amount</th><td>INR ${Number(invoice.baseAmount || 0).toFixed(2)}</td></tr>
        <tr><th>GST (${Number(invoice.taxRate || 0)}%)</th><td>INR ${Number(invoice.taxAmount || 0).toFixed(2)}</td></tr>
        <tr><th>Total</th><td class="total">INR ${Number(invoice.totalAmount || 0).toFixed(2)}</td></tr>
        <tr><th>Paid</th><td>INR ${Number(invoice.paidAmount || 0).toFixed(2)}</td></tr>
        <tr><th>Receipt</th><td>${escapeHtml(invoice.receiptNumber || "Not generated")}</td></tr>
      </table>
    </main>
  </body>
</html>`);
  } catch (error) {
    res.status(500).send(`Unable to render invoice: ${escapeHtml(error.message)}`);
  }
});

router.get("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const userFilter =
      userId && userId !== "guest"
        ? { $or: [{ userId }, { client_id: userId }, { phone_number: userId }, { clientEmail: userId }] }
        : {};

    const bookings = await Booking.find(userFilter).select("_id");
    const bookingIds = bookings.map((booking) => booking._id);
    const invoiceFilter =
      userId && userId !== "guest"
        ? { $or: [{ userId }, { clientEmail: userId }, { bookingId: { $in: bookingIds } }] }
        : {};
    const paymentFilter =
      userId && userId !== "guest"
        ? { $or: [{ userId }, { client_id: userId }, { bookingId: { $in: bookingIds } }] }
        : {};

    const [invoices, payments, transactions] = await Promise.all([
      Invoice.find(invoiceFilter).populate("bookingId").sort({ createdAt: -1 }),
      Payment.find(paymentFilter).populate("bookingId").sort({ createdAt: -1 }),
      Transaction.find(invoiceFilter).sort({ createdAt: -1 }).limit(20),
    ]);

    res.json({ invoices, payments, transactions });
  } catch (error) {
    res.status(500).json({ message: "Unable to load billing records", error: error.message });
  }
});

router.get("/dashboard", async (req, res) => {
  try {
    const [invoices, payments, dailyTransactions] = await Promise.all([
      Invoice.find().sort({ createdAt: -1 }).limit(50),
      Payment.find().populate("bookingId").sort({ createdAt: -1 }).limit(50),
      Transaction.find({
        createdAt: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      }).sort({ createdAt: -1 }),
    ]);

    const summary = await Invoice.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$paidAmount" },
          pendingAmount: { $sum: { $subtract: ["$totalAmount", "$paidAmount"] } },
          paidInvoiceCount: { $sum: { $cond: [{ $eq: ["$status", "Paid"] }, 1, 0] } },
        },
      },
    ]);

    res.json({
      summary: {
        totalRevenue: summary[0]?.totalRevenue || 0,
        pendingAmount: summary[0]?.pendingAmount || 0,
        paidInvoiceCount: summary[0]?.paidInvoiceCount || 0,
        dailyTransactionCount: dailyTransactions.length,
      },
      invoices,
      payments,
      dailyTransactions,
    });
  } catch (error) {
    res.status(500).json({ message: "Unable to load billing dashboard", error: error.message });
  }
});

router.post("/razorpay/order", async (req, res) => {
  try {
    const { invoiceId, paymentAmount, paymentMethod } = req.body;
    const invoice = await Invoice.findById(invoiceId);

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    let amount = getRemainingAmount(invoice);
    if (paymentAmount && Number(paymentAmount) > 0 && Number(paymentAmount) <= amount) {
      amount = Number(paymentAmount);
    }

    if (amount <= 0) {
      return res.status(400).json({ message: "Invoice is already paid" });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: invoice.currency || "INR",
      receipt: invoice.invoiceNumber,
      payment_capture: 1,
      notes: {
        invoiceId: String(invoice._id),
        bookingId: String(invoice.bookingId),
        userId: invoice.userId,
        paymentMethod: normalizeGatewayMethod(paymentMethod),
      },
    });

    res.status(201).json({ keyId: process.env.RAZORPAY_KEY_ID || "", order });
  } catch (error) {
    res.status(500).json({ message: "Unable to create Razorpay order", error: error.message });
  }
});

router.post("/razorpay/verify", async (req, res) => {
  try {
    const { invoiceId, razorpay_order_id, razorpay_payment_id, razorpay_signature, method } = req.body;

    if (!invoiceId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Missing payment verification details" });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    const rpOrder = await razorpay.orders.fetch(razorpay_order_id);
    const actualAmount = rpOrder.amount / 100;
    const paymentMethod = normalizeGatewayMethod(method || rpOrder.notes?.paymentMethod);

    const payment = await Payment.create({
      invoiceId: invoice._id,
      bookingId: invoice.bookingId,
      userId: invoice.userId,
      amount: actualAmount,
      method: paymentMethod,
      payment_method: paymentMethod,
      status: "Success",
      razorpayOrderId: razorpay_order_id,
      razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      razorpay_signature,
    });

    const result = await markInvoicePaid({ invoice, payment, method: paymentMethod });
    await sendPaidInvoiceEmail(result);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Unable to verify payment", error: error.message });
  }
});

router.post("/cash", async (req, res) => {
  try {
    const { invoiceId, notes, paymentAmount } = req.body;
    const invoice = await Invoice.findById(invoiceId);

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    let amount = getRemainingAmount(invoice);
    if (paymentAmount && Number(paymentAmount) > 0 && Number(paymentAmount) <= amount) {
      amount = Number(paymentAmount);
    }

    if (amount <= 0) {
      return res.status(400).json({ message: "Invoice is already paid" });
    }

    const payment = await Payment.create({
      invoiceId: invoice._id,
      bookingId: invoice.bookingId,
      userId: invoice.userId,
      amount,
      method: "Cash",
      payment_method: "Cash",
      status: "Success",
      notes,
    });

    const result = await markInvoicePaid({ invoice, payment, method: "Cash" });
    await sendPaidInvoiceEmail(result);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: "Unable to record cash payment", error: error.message });
  }
});

module.exports = router;
