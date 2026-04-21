import mongoose from "mongoose"

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Course name is required"],
        trim: true
    },
    tagline: {
        type: String,
        required: [true, "Course tagline is required"],
        trim: true
    },
    type: {
        type: String,
        enum: ["In persona", "Videocall"],
        required: [true, "Course type is required"]
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

const Course = mongoose.models.Courses || mongoose.model("Courses", courseSchema)

export default Course