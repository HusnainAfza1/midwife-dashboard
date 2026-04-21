import mongoose from "mongoose"

const privateServiceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Service name is required"],
        trim: true
    },
    tagline: {
        type: String,
        required: [true, "Service tagline is required"],
        trim: true
    },
    type: {
        type: String,
        enum: ["In persona", "Videocall"],
        required: [true, "Service type is required"]
    },
    duration: {
        type: String,
        required: [true, "Duration is required"],
        trim: true
    },
    appointments: {
        type: String,
        default: ""
    },
    turnover: {
        type: String,
        default: ""
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const PrivateService = mongoose.models.PrivateServices || mongoose.model("PrivateServices", privateServiceSchema)

export default PrivateService