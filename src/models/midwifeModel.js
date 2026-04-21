import mongoose from "mongoose";
const scheduleItemSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  appointmentNumber: { type: Number, required: true },
  date: { type: String, required: true },  // or Date type if you want
  day: { type: String, required: true },
  duration: { type: String, required: true },
  type: { type: String, required: true },
  week: { type: Number, required: true },
  appointmentInWeek: { type: Number, required: true },
}, { _id: false });

const privateServiceSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  tagline: { type: String, required: true },
  type: { type: String, required: true },
  duration: { type: String, required: true },
  appointments: { type: String, required: true },
  turnover: { type: String, required: true },
  image: {
    url: { type: String },
    public_id: { type: String },
    name: { type: String },
  }, // Image field only for private services    
  frequency: { type: String },          // new
  frequencyPeriod: { type: String },    // new
  serviceMode: { type: String },        // new
  maxParticipants: { type: String },    // new, optional
  startDate: { type: String },          // or Date, new
  selectedDays: [{ type: String }],     // array of strings, new
  schedule: [scheduleItemSchema],
}, { _id: false });

// Define CourseServiceItem schema (without image)
const courseServiceSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  tagline: { type: String, required: true },
  type: { type: String, required: true },
  duration: { type: String, required: true },
  appointments: { type: String, required: true },
  turnover: { type: String, required: true },
  frequency: { type: String },
  frequencyPeriod: { type: String },
  maxParticipants: { type: String },
  startDate: { type: String },
  selectedDays: [{ type: String }],
  // No image field for courses
}, { _id: false });

const midwifeSchema = new mongoose.Schema({  
  userId: {
      type: mongoose.Schema.Types.ObjectId,
      // ref: "User",
      required: true
    },
  isProfileComplete: { type: Boolean, required: true },
  midwifeStatus: { type: Boolean, required: true }, // ACTIVE, INACTIVE, PENDING
  personalInfo: {
    firstName: { type: String, required: true },
    lastName: { type: String },
    midwifeTitle: { type: String, },
    username: { type: String, required: true, unique: true },
    slogan: { type: String, required: true },
    personalStatement: { type: String },
    about: { type: String },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    address: { type: String },
    serviceRadius: { type: String },
    profileImage: {
      url: { type: String },
      public_id: { type: String },
      name: { type: String },
    },
    logo: {
      url: { type: String },
      public_id: { type: String },
      name: { type: String },
    },
    googleAddress: {
      fullAddress: { type: String },
      placeId: { type: String },
      mainText: { type: String },
      secondaryText: { type: String },
      types: [{ type: String }],
      details: { type: Object },
    }
  },
  midwifeType: {
    midwifeType: { type: String }, // ESSENTIAL, PRO, ADVANCED, ULTIMATE
    services: {
      "private-services": [privateServiceSchema], // Array of private services with images
      "courses-classes": [courseServiceSchema],   // Array of courses without images
    },
  },
  identity: {
    intensity: { type: String },
    totalWeeklyHours: { type: Number },
    monthlyTurnover: { type: Number },
    timetable: { type: Object },
  },
  services: { type: Object },
  bankInfo: {
    accountHolderName: { type: String },
    bankName: { type: String },
    accountNumber: { type: String },
    routingNumber: { type: String },
  },
  moreInfo: {
    acupuncture: { type: String },
    professionalExperience: { type: String },
    message: { type: String },
    supportedPregnancies: { type: Number }
  },
  testimonials: [
    {
      name: { type: String },
      designation: { type: String },
      description: { type: String },
      profileImage: {
        url: { type: String },
        public_id: { type: String },
        name: { type: String },
      },
    }
  ],
  socialLinks: {
    facebook: { type: String },
    twitter: { type: String },
    instagram: { type: String },
    linkedin: { type: String },
  },
  faqs: [
    {
      question: { type: String },
      answer: { type: String },
    }
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Create a compound index for email and username to ensure uniqueness
midwifeSchema.index({ "personalInfo.email": 1, "personalInfo.username": 1 }, { unique: true })

// Update the updatedAt field on save
midwifeSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Midwife = mongoose.models.Midwife || mongoose.model("Midwife", midwifeSchema)

export default Midwife;
