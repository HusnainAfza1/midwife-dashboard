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
}, { _id: false }); // Disable automatic _id for subdocuments   

const appointmentF1DetailSchema = new mongoose.Schema({
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

// Define the main Post-birth appointments schema
const PostBirthAppointmentsSchema = new mongoose.Schema({
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
        C1: {
            type: [appointmentDetailSchema],
            default: []
        },
        C2: {
            type: [appointmentDetailSchema],
            default: []
        },
        D1: {
            type: [appointmentDetailSchema],
            default: []
        },
        D2: {
            type: [appointmentDetailSchema],
            default: []
        },
        F1: {
            type: [appointmentF1DetailSchema],
            default: []
        },

        // C1, C2, D1, D2, F1 
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

const PostBirthAppointments = mongoose.models.PostBirthAppointments ||
    mongoose.model("PostBirthAppointments", PostBirthAppointmentsSchema);

export default PostBirthAppointments;