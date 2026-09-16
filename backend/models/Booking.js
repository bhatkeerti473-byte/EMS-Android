const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    client_id: {
      type: String,
      required: true,
      unique: false,
    },
    phone_number: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
    },
    clientName: {
      type: String,
    },
    clientEmail: {
      type: String,
    },
    bookingReference: {
      type: String,
      unique: true,
      sparse: true,
    },
    event_type: {
      type: String,
      required: true,
    },
    event_date: {
      type: Date,
      required: true,
    },
    time_slot: {
      type: String,
      required: true,
    },
    venue_id: {
      type: String,
    },
    venueId: {
      type: String,
    },
    venueName: {
      type: String,
    },
    isOwnVenue: {
      type: Boolean,
      default: false,
    },
    ownVenueDetails: {
      name: String,
      location: String,
      capacity: Number,
      address: String,
      contactPerson: String,
      phone: String,
      photos: [String],
    },
    packageId: {
      type: String,
    },
    eventTitle: {
      type: String,
    },
    catering_details: {
      type: {
        type: String,
        required: true,
      },
      guest_count: {
        type: Number,
        required: true,
      },
    },
    staff_requirements: {
      type: Map,
      of: Number,
      default: {},
    },
    hallType: {
      type: String,
    },
    decorationPackage: {
      type: String,
    },
    cateringPackage: {
      type: String,
    },
    cakeName: {
      type: String,
      default: "None"
    },
    cakePrice: {
      type: Number,
      default: 0
    },
    cakeText: {
      type: String,
      default: ""
    },
    cakeEggless: {
      type: String,
      default: "No"
    },
    cakeWeight: {
      type: String,
      default: ""
    },
    additionalServices: {
      photography: { type: Boolean, default: false },
      videography: { type: Boolean, default: false },
      dj: { type: Boolean, default: false },
      travel: { type: Boolean, default: false },
      rooms: { type: Boolean, default: false }
    },
    seatingArrangement: {
      seatingType: { type: String },
      diningSetup: { type: String },
      additionalRequirements: {
        extraChairs: { type: Number, default: 0 },
        highChairs: { type: Number, default: 0 },
        childrenChairs: { type: Number, default: 0 },
        vipSofa: { type: Number, default: 0 }
      }
    },
    selectedServices: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },
    total_cost: {
      type: Number,
      required: true,
    },
    advance_paid: {
      type: Number,
      default: 0,
    },
    remainingAmount: {
      type: Number,
      default: 0,
    },
    booking_status: {
      type: String,
      enum: ["Temporarily Held", "Pending Approval", "Approved - Awaiting Payment", "Confirmed", "Cancelled", "Rejected"],
      default: "Pending Approval",
    },
    holdExpiresAt: {
      type: Date,
    },
    instantBooking: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    guests: {
      type: Number,
    },
    amount: {
      type: Number,
      default: 0,
    },
    taxRate: {
      type: Number,
      default: 18,
    },
    location: {
      type: String,
    },
    notes: {
      type: String,
    },
    rejectionReason: {
      type: String,
      default: "",
    },
    approvedAt: {
      type: Date,
    },
    rejectedAt: {
      type: Date,
    },
    cancellation_reason: {
      type: String,
    },
    cancelled_at: {
      type: Date,
    },
    cancelled_by: {
      type: String,
    },
    cancellation_fee: {
      type: Number,
      default: 0,
    },
    fee_percentage: {
      type: Number,
      default: 0,
    },
    days_remaining: {
      type: Number,
      default: 0,
    },
    refundable_amount: {
      type: Number,
      default: 0,
    },
    refund_status: {
      type: String,
      enum: ["Not Applicable", "Pending", "Processing", "Completed", "Failed"],
      default: "Not Applicable",
    },
    refund_id: {
      type: String,
    },
    refund_processed_at: {
      type: Date,
    },
    paymentConfirmedAt: {
      type: Date,
    },
    image: {
      type: String,
    },
    payment_method: {
      type: String,
    },
    payment_id: {
      type: String,
    },
    assignedStaff: [{
      type: String
    }],
    assignedVendors: [{
      type: String
    }],
    vendorAssignments: [{
      vendorId: { type: String },
      vendorName: { type: String },
      serviceType: { type: String },
      workStatus: { type: String, enum: ["Pending", "Working", "Completed"], default: "Pending" },
      paymentStatus: { type: String, enum: ["Unpaid", "Paid"], default: "Unpaid" },
      paymentId: { type: mongoose.Schema.Types.ObjectId, ref: "Finance" }
    }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Booking", bookingSchema);
