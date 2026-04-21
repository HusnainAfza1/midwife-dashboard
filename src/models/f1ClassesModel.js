import mongoose from "mongoose";

// Schema for individual class details
const classDetailSchema = new mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
        // ref: "Users", // Uncomment when you have the Users model
        required: true,
        // unique: true
    },
    startDate: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^\d{2}\/\d{2}\/\d{4}$/.test(v);
            },
            message: 'Start date must be in DD/MM/YYYY format'
        }
    },
    startTime: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
            },
            message: 'Start time must be in HH:MM format'
        }
    },
    endTime: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
            },
            message: 'End time must be in HH:MM format'
        }
    },
    duration: {
        type: Number,
        required: true,
        min: 1
    },
    clients: [{
        type: mongoose.Schema.Types.ObjectId,
        // ref: "User" // Assuming you have a User model
    }],
    exceptional: [{  // NEW FIELD
        classNo: { type: String, required: true },
        startDate: { type: String, required: true },
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        duration: { type: Number, required: true }
    }],
    cancelExceptional: [
        { type: String }
    ]
}, { _id: false }); // Disable _id for subdocuments if not needed

// Schema for classes organized by year
const f1ClassesSchema = new mongoose.Schema({
    midwifeId: {
        type: mongoose.Schema.Types.ObjectId,
        // ref: "Users", // Uncomment when you have the Users model
        required: true,
        unique: true // Each midwife should have only one classes document
    },
    classes: {
        type: Map,
        of: {
            type: Map,
            of: classDetailSchema
        },
        default: () => new Map()
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field before saving
f1ClassesSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

// Add indexes for better query performance
// f1ClassesSchema.index({ midwifeId: 1 });

const f1ClassesModel =
    mongoose.models.f1Classes ||
    mongoose.model("f1Classes", f1ClassesSchema);

export default f1ClassesModel;
