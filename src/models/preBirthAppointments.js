import mongoose from "mongoose";

// Define the individual appointment subdocument schema
const appointmentDetailSchema = new mongoose.Schema({
    appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    appointmentDate: {
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
    duration: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled", "completed", "active"],
        default: "pending"
    }
}, { _id: false });

const appointmentE1DetailSchema = new mongoose.Schema({
    appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    appointmentDate: {
        type: String,
        required: true
    },
    classId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    classNo: {
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
    duration: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "confirmed", "cancelled", "completed", "active"],
        default: "pending"
    }
}, { _id: false });// Disable automatic _id for subdocuments

// Define the main pre-birth appointments schema
const preBirthAppointmentsSchema = new mongoose.Schema({
    midwifeId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        // index: true
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        // index: true
    },
    clientET: {
        type: Date,
        required: true
    },
    appointments: {
        B1: {
            type: [appointmentDetailSchema],
            default: []
        },
        B2: {
            type: [appointmentDetailSchema],
            default: []
        },
        E1: {
            type: [appointmentE1DetailSchema],
            default: []
        },
        // You can add more appointment types as needed
        // B3: {
        //     type: [appointmentDetailSchema],
        //     default: []
        // },
        // E2: {
        //     type: [appointmentDetailSchema],
        //     default: []
        // }
    },
    bookingStatus: {
        type: String,
        enum: ["pending", "active", "completed", "cancelled", "on-hold"],
        default: "pending"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// OPTIONAL: Add compound index for efficient querying
// midwifeAppointmentsSchema.index({ midwifeId: 1, clientId: 1 }, { unique: true });

// OPTIONAL: Helper methods - you can remove these if you don't need them
// midwifeAppointmentsSchema.methods.addAppointment = function(appointmentType, appointmentData) {
//     if (!this.appointments[appointmentType]) {
//         throw new Error(`Invalid appointment type: ${appointmentType}`);
//     }
//     this.appointments[appointmentType].push(appointmentData);
//     return this.save();
// };

const PreBirthAppointments = mongoose.models.PreBirthAppointments ||
    mongoose.model("PreBirthAppointments", preBirthAppointmentsSchema);

export default PreBirthAppointments;