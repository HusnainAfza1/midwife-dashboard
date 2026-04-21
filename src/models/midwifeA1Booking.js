import mongoose from "mongoose";

const midwifeA1BookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    // ref: "User",
    required: true
  },
  midwifeId: {
    type: mongoose.Schema.Types.ObjectId,
    // ref: "Users",
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  insuranceNumber: {
    type: String,
    required: true
  },
  insuranceCompany: {
    type: String,
    required: true
  },
  insuranceType: {
    type: String,
    enum: ["government", "private"],
    required: true
  },
  date: {
    type: String,
    required: true,
    validate: {
      validator: function (v) { // Removed ': string'
        return /^\d{2}\/\d{2}\/\d{4}$/.test(v);
      },
      message: 'Date must be in DD/MM/YYYY format'
    }
  },
  expectedDeliveryDate: {
    type: String,
    required: true,
    validate: {
      validator: function (v) { // Removed ': string'
        return /^\d{2}\/\d{2}\/\d{4}$/.test(v);
      },
      message: 'Expected delivery date must be in DD/MM/YYYY format'
    }
  },
  selectedAddressDetails: {
    type: Object,
    required: true
  },
  selectedSlot: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "active", "cancelled"],
    default: "active"
  },
  clientStatus: {
    type: String,
    enum: ["pending", "converted", "cancelled"],
    default: "pending"
  },
  CurrentPlan: {
    type: String,
    enum: ["Prebirth", "Postbirth"],
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add indexes for better query performance
midwifeA1BookingSchema.index({ midwifeId: 1, date: 1, selectedSlot: 1 });
midwifeA1BookingSchema.index({ userId: 1 });
midwifeA1BookingSchema.index({ date: 1 });

const MidwifeA1Booking =
  mongoose.models.MidwifeA1Bookings ||
  mongoose.model("MidwifeA1Bookings", midwifeA1BookingSchema);

export default MidwifeA1Booking;