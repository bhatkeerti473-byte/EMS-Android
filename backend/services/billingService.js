const crypto = require("crypto");

const Booking = require("../models/Booking");
const Invoice = require("../models/Invoice");
const Payment = require("../models/Payment");
const Transaction = require("../models/Transaction");
const Notification = require("../models/Notification");
const Venue = require("../models/Venue");

const DEFAULT_GST_RATE = Number(process.env.GST_RATE || 18);

const roundMoney = (value) => Math.round((Number(value) || 0) * 100) / 100;

const buildInvoiceNumber = () => {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomPart = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `INV-${datePart}-${randomPart}`;
};

const buildReceiptNumber = () => {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomPart = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `RCT-${datePart}-${randomPart}`;
};

const calculateTotals = (baseAmount, taxRate = DEFAULT_GST_RATE) => {
  const taxableAmount = roundMoney(baseAmount);
  const taxAmount = roundMoney((taxableAmount * Number(taxRate || 0)) / 100);
  return {
    baseAmount: taxableAmount,
    taxRate: Number(taxRate || 0),
    taxAmount,
    totalAmount: roundMoney(taxableAmount + taxAmount),
  };
};

const resolveBookingAmount = async (booking) => {
  if (Number(booking.amount) > 0) return Number(booking.amount);

  const venue = booking.venueId ? await Venue.findById(booking.venueId).catch(() => null) : null;
  if (Number(venue?.price) > 0) return Number(venue.price);

  return Math.max(Number(booking.guests) || 1, 1) * Number(process.env.DEFAULT_GUEST_RATE || 500);
};

const createInvoiceForBooking = async (bookingOrId, overrideAmount) => {
  const booking =
    typeof bookingOrId === "string"
      ? await Booking.findById(bookingOrId)
      : bookingOrId;

  if (!booking) {
    throw new Error("Booking not found");
  }

  const existingInvoice = await Invoice.findOne({ bookingId: booking._id });
  if (existingInvoice) return existingInvoice;

  const amount = Number(overrideAmount) > 0 ? Number(overrideAmount) : await resolveBookingAmount(booking);
  const totals = calculateTotals(amount, booking.taxRate);
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + Number(process.env.INVOICE_DUE_DAYS || 7));

  const invoice = await Invoice.create({
    invoiceNumber: buildInvoiceNumber(),
    bookingId: booking._id,
    userId: booking.userId,
    clientName: booking.clientName,
    clientEmail: booking.clientEmail,
    eventTitle: booking.eventTitle,
    venueName: booking.venueName,
    eventDate: booking.eventDate,
    ...totals,
    dueDate,
  });

  await Transaction.create({
    invoiceId: invoice._id,
    bookingId: booking._id,
    userId: booking.userId,
    type: "Invoice Generated",
    amount: invoice.totalAmount,
    status: "Pending",
    description: `Invoice ${invoice.invoiceNumber} generated for ${booking.eventTitle}`,
  });

  return invoice;
};

const markInvoicePaid = async ({ invoice, payment, method, metadata = {} }) => {
  const receiptNumber = payment.receiptNumber || buildReceiptNumber();

  payment.status = "Paid";
  payment.receiptNumber = receiptNumber;
  await payment.save();

  invoice.paidAmount = (invoice.paidAmount || 0) + payment.amount;
  if (invoice.paidAmount >= invoice.totalAmount) {
    invoice.status = "Paid";
    invoice.paidAmount = invoice.totalAmount;
  } else {
    invoice.status = "Partially Paid";
  }
  invoice.receiptNumber = receiptNumber;
  invoice.receiptGeneratedAt = new Date();
  await invoice.save();

  if (invoice.bookingId) {
    const booking = await Booking.findById(invoice.bookingId);
    if (booking) {
      booking.booking_status = "Confirmed";
      booking.status = "Approved"; // Keep consistent with standard statuses
      booking.paymentConfirmedAt = new Date();
      booking.advance_paid = (booking.advance_paid || 0) + payment.amount;
      booking.payment_method = method;
      booking.payment_id = payment.razorpayPaymentId || payment._id;
      await booking.save();
    }
  }

  await Transaction.create({
    invoiceId: invoice._id,
    paymentId: payment._id,
    bookingId: invoice.bookingId,
    userId: invoice.userId,
    type: method === "Cash" ? "Cash Payment" : "Payment Captured",
    amount: payment.amount,
    status: "Success",
    description: `${method} payment received for ${invoice.invoiceNumber}`,
    metadata,
  });

  // Create Admin Notification
  await Notification.create({
    receiverRole: "Admin",
    title: "Payment Received",
    message: `A payment of ${payment.amount} was received via ${method} for Invoice ${invoice.invoiceNumber}.`,
    type: "In-App",
    metadata: {
      bookingId: invoice.bookingId,
      clientId: invoice.userId,
      clientName: "Client", // Can fetch from booking if needed, but keeping simple
      phone: "N/A",
      eventSelected: invoice.eventTitle,
      venueSelected: invoice.venueName,
      messageType: "Payment Received",
      amountPaid: payment.amount
    }
  });

  return { invoice, payment };
};

module.exports = {
  buildReceiptNumber,
  calculateTotals,
  createInvoiceForBooking,
  markInvoicePaid,
};
