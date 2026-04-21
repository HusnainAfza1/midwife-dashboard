import mongoose from "mongoose";

const unavailableSlotSchema = new mongoose.Schema({
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    }
}, { _id: false });

const scheduleSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    day: {
        type: String,
        required: true,
        enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    },
    isOffDay: {
        type: Boolean,
        default: false,
    },
    startHour: {
        type: String,
        required: function () { return !this.isOffDay; }
    },
    endHour: {
        type: String,
        required: function () { return !this.isOffDay; }
    },
    repeat: {
        type: String,
        enum: ["weekly", "biweekly", "monthly"],
        default: "weekly",
    },
    unavailableSlots: {
        type: [unavailableSlotSchema],
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const Schedule = mongoose.models.Schedule || mongoose.model("Schedule", scheduleSchema);

export default Schedule;