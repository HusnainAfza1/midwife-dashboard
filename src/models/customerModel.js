import mongoose from "mongoose"

const customerSchema = new mongoose.Schema(
  {
    customerId: {
      type: String,
      required: true,
      unique: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    midwifeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Midwife",
      required: true,
    },
    midwifeName: {
      type: String,
      required: true,
    },
    et: {
      type: Date,
      required: true,
    },
    totalAppointments: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Completed"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  },
)

const Customer = mongoose.models.Customer || mongoose.model("Customer", customerSchema)

export default Customer
