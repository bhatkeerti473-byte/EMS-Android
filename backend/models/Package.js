const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema(
  {
    // 1. Basic Information
    name: { type: String, required: true },
    packageCode: { type: String },
    eventType: { type: String, default: "Wedding" },
    category: { type: String, default: "Standard" },
    shortDescription: { type: String },
    description: { type: String },
    status: { type: String, enum: ["Active", "Inactive", "Draft"], default: "Active" },

    // 2. Package Images
    image: { type: String }, // Main Banner
    coverImage: { type: String },
    galleryImages: [{ type: String }],
    previewVideo: { type: String },

    // 3. Pricing
    originalPrice: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    offerPrice: { type: Number, required: true },
    advancePayment: { type: Number, default: 0 },
    securityDeposit: { type: Number, default: 0 },
    gstIncluded: { type: Boolean, default: false },

    // 4. Offer Settings
    offerEnabled: { type: Boolean, default: false },
    offerTitle: { type: String },
    offerBadge: { type: String },
    badgeBg: { type: String, default: "#fff1f2" },
    badgeColor: { type: String, default: "#e11d48" },
    offerStartDate: { type: Date },
    offerEndDate: { type: Date },
    countdownEnabled: { type: Boolean, default: false },

    // 5-10. Package Components (Venue, Catering, Photography, etc.)
    components: [
      {
        name: { type: String, required: true },
        category: { type: String }, // e.g., "Venue", "Photography", "Decoration"
        basePrice: { type: Number, default: 0 },
        isRequired: { type: Boolean, default: false },
        isRemovable: { type: Boolean, default: true },
        description: { type: String }
      }
    ],

    // Detailed Catering Setup
    cateringDetails: {
      foodItems: [
        {
          name: { type: String, required: true },
          type: { type: String, enum: ["Veg", "Non-Veg", "Both"], default: "Veg" },
          category: { type: String }, // e.g., "Starters", "Main Course", "Sweet", "Drinks"
          price: { type: Number, default: 0 },
          isIncluded: { type: Boolean, default: false } // True if part of base package, False if extra
        }
      ]
    },

    // Detailed Venue Setup
    venueOptions: [
      {
        venueId: { type: mongoose.Schema.Types.ObjectId, ref: "Venue" },
        name: { type: String },
        type: { type: String, enum: ["AC", "Non-AC", "Premium"] },
        price: { type: Number, default: 0 },
        isDefault: { type: Boolean, default: false }
      }
    ],

    // 11. Package Availability
    maxBookings: { type: Number, default: 20 },
    remainingSlots: { type: Number, default: 10 },
    bookingStartDate: { type: Date },
    bookingEndDate: { type: Date },
    availabilityStatus: { type: String, default: "Available" },
    eligibleCities: [{ type: String }],
    eligibleVenues: [{ type: String }],
    minGuests: { type: Number },
    maxGuests: { type: Number },

    // 12. Event Timing
    duration: { type: String, default: "Full Day" },
    setupTime: { type: String },
    startTime: { type: String },
    endTime: { type: String },
    cleanupTime: { type: String },

    // 13. Cancellation Policy
    cancellationPolicy: { type: String, default: "Free Cancellation" },
    termsAndConditions: { type: String },

    // 14. Highlights
    features: [{ type: String }],
    guests: { type: String }, // Legacy/Quick view

    // 15. Notes
    specialInstructions: { type: String },
    internalNotes: { type: String },
    customerNotes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Package", packageSchema);
