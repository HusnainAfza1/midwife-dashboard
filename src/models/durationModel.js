// models/durationModel.js
import mongoose from "mongoose";

const DurationSchema = new mongoose.Schema({
    duration: {
        type: Number,
        required: true,
    },
});

const Duration = mongoose.models.Duration || mongoose.model("Duration", DurationSchema);

export default Duration;