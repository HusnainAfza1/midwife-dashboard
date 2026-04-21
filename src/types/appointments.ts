export interface Appointment {
    id: number
    name: string
    selectedDate: string
    startTime: string
    meetingLink: string
    phone: string
    createdAt: Date
    email: string
    timezone: string
    challengeOptions: string
    challengeDescription: string
    location: string 
    username: string 
    endTime : string
  }
export interface ScheduleAppointment {
    day: string;
    startHour: string | null;
    endHour: string | null;
    repeats: string;
    offDay: boolean;
    unavailableSlots: { from: string; to: string }[];
    
}

// email: "sohaibuni7@gmail.com",
// timezone: "GMT+5",
// performance: 5,
// preferenceQuestion: 