// In @/types.ts or wherever your types are defined   
import { PlaceDetails } from "@/types"
export interface CloudinaryImage {
    url: string
    public_id: string
    name: string
}
export interface PersonalInfo {
    firstName: string;
    lastName: string;
    midwifeTitle: string;
    username: string;
    slogan: string;
    personalStatement: string;
    about: string;
    email: string;
    phone: string;
    address: string;
    serviceRadius: string;
    profileImage: CloudinaryImage | null
    logo: CloudinaryImage | null
    googleAddress?: {
        fullAddress: string;
        placeId: string;
        mainText: string;
        secondaryText: string;
        types: string[];
        details?: PlaceDetails;
    } | null;
}
// export interface PersonalInfo {
//     firstName: string;
//     lastName: string;
//     midwifeTitle: string;
//     username: string;
//     slogan: string;
//     personalStatement: string;
//     about: string;
//     email: string;
//     phone: string;
//     address: string;
//     serviceRadius: string;
// }       

// interface PrivateService {
//     id: string;
//     name: string;
//     tagline: string;
//     type: string;
//     duration: string;
//     appointments: string;
//     turnover: string;
//     image?: {
//         url: string;
//         public_id: string;
//         name: string;
//     };
//     frequency: string;
//     frequencyPeriod: string;
//     serviceMode: string;
//     maxParticipants: string;
//     startDate: string;
//     selectedDays: string[];
//     schedule: Appointment[];
// }

// export interface AppointmentP {
//     id: number;
//     appointmentNumber: number;
//     date: string;
//     day: string;
//     duration: string;
//     type: string;
//     week: number;
//     appointmentInWeek: number;
// }

export interface PrivateServiceItem {
    id: string;
    name: string;
    tagline: string;
    type: string;
    duration: string;
    appointments: string;
    turnover: string;
    image?: CloudinaryImage | null;
    frequency: string
    frequencyPeriod: string
    serviceMode: string
    maxParticipants: string
    startDate: string
    selectedDays: string[]
    // schedule: Appointment[];
}

// Interface specifically for Courses/Classes (without image)
export interface CourseServiceItem {
    id: string;
    name: string;
    tagline: string;
    type: string;
    duration: string;
    appointments: string;
    turnover: string;
    frequency: string
    frequencyPeriod: string
    maxParticipants: string
    startDate: string
    selectedDays: string[]

}

// Union type for backward compatibility
export type ServiceItem = PrivateServiceItem | CourseServiceItem;

// Updated MidwifeTypeData interface
export interface MidwifeTypeData {
    midwifeType: string;
    remoteType?: string;
    services: {
        "private-services"?: PrivateServiceItem[];
        "courses-classes"?: CourseServiceItem[];
    };
}

// Type guards for type safety
// export const isPrivateService = (item: ServiceItem): item is PrivateServiceItem => {
//     return 'image' in item;
// };

// export const isCourseService = (item: ServiceItem): item is CourseServiceItem => {
//     return !('image' in item);
// };


// You can expand this type as per your timetable structure
export interface IdentityData {
    intensity: string;
    totalWeeklyHours: number;
    monthlyTurnover: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    timetable: any;
}

export interface BankInfo {
    accountHolderName: string;
    bankName: string;
    accountNumber: string;
    routingNumber: string;
}

export interface MoreInfo {
    acupuncture: string;
    professionalExperience: string;
    message: string;
    supportedPregnancies: number
}
interface ServiceApiData {
    code: string;
    title: string;
    description: string;
    serviceType: string;
    duration: string;
    startingAt: string;
    interval: string;
    appointments: string | null;
    turnover: string | null;
}
export interface Testimonial {
    name: string;
    profileImage: CloudinaryImage | null;
    designation: string;
    description: string;
}
export interface SocialLinks {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
}

export interface FAQ {
    question: string;
    answer: string;
}

export interface AddMidwifeFormData {    
    _id? :string
    userId :string
    isProfileComplete: boolean;
    midwifeStatus: boolean; // "active" | "inactive"
    personalInfo: PersonalInfo;
    midwifeType: MidwifeTypeData;
    identity: IdentityData;
    services: Record<string, ServiceApiData>;
    bankInfo: BankInfo;
    moreInfo: MoreInfo;
    testimonials: Testimonial[];
    socialLinks: SocialLinks;
    faqs: FAQ[];
}

export type MidwifeTypeKey = "ESSENTIAL" | "PRO" | "ADVANCED" | "ULTIMATE";

export interface CourseData {
    id: string;
    name: string;
    tagline: string;
    type: string;
    duration: string;
    appointments: string;
    turnover: string;
}

export interface PrivateServiceData {
    id: string;
    name: string;
    tagline: string;
    type: string;
    duration: string;
    appointments: string;
    turnover: string;
}