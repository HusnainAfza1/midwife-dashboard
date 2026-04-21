export interface TimetableSlot {
  startTime: string;
  endTime: string;
}

export interface DaySlots {
  [service: string]: TimetableSlot[]; 
}

export interface DayTimetable {
  slots: DaySlots;
}


export interface Timetable {
  [day: string]: DayTimetable; 
}

export interface IntensityData {
  weeklyHours: number;
  monthlyTurnover: number;  
  totalSlots: number;
  defaultTimeTable: Timetable;
}

export interface TimetableCategory {
  [intensity: string]: IntensityData; 
}

export interface TimetableConfig {
  "ESSENTIAL": TimetableCategory;
  "ADVANCED": TimetableCategory;
  "ULTIMATE": TimetableCategory;  
  "PRO" : TimetableCategory;  
  // REMOTE: TimetableCategory; 
  
}