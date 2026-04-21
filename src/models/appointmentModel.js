import mongoose from "mongoose"

const appointmentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },
    selectedDate: {
        type: String,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    timezone: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    challengeOptions: {
        type: String,
        required: true
    },
    challengeDescription: {
        type: String,
        default: ""
    },
    meetingLink: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled", "completed"],
        default: "pending"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Appointment = mongoose.models.Appointments || mongoose.model("Appointments", appointmentSchema)

export default Appointment