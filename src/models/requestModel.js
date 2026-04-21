import mongoose from "mongoose"

const requestSchema = new mongoose.Schema({
    requestType: {
        type: String,
        enum: ["edit", "cancelled"],
        required: true
    },
    midwifeId: {
        type: mongoose.Schema.Types.ObjectId,
        // ref: "Midwifes", // Adjust this to match your midwife model name
        required: true
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        // ref: "Users",
        required: true
    },
    serviceCode: {
        type: String,
        required: true
    },
    appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        // ref: "Appointments", // Adjust this to match your appointment model name
        required: true
    },
    currentDate: {
        type: String,
        required: true

    },
    currentStartTime: {
        type: String,
        required: true
    },
    currentEndTime: {
        type: String,
        required: true
    },
    suggestedDate: {
        type: String,
        default: null // Will be null when requestType is "cancelled"
    },
    suggestedStartTime: {
        type: String,
        default: null // Will be null when requestType is "cancelled"
    },
    suggestedEndTime: {
        type: String,
        default: null // Will be null when requestType is "cancelled"
    },
    note: {
        type: String,
        // default: null // Will be null when requestType is "cancelled"
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})

// Update the updatedAt timestamp before saving
requestSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

const Request = mongoose.models.Requests || mongoose.model("Requests", requestSchema)

export default Request