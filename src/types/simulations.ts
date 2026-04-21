export interface AppointmentRule {
  code: string
  title: string
  duration: number
  color: string
  type: "pregnancy" | "early" | "late" | "course" | "private"
  rules: {
    startOffset?: number // days from ET (negative = before ET)
    endOffset?: number // days from ET
    maxPerDay?: number
    maxTotal?: number
    totalQuota?: number // Total appointments for this type
    weekdaysOnly?: boolean
    weekendsAllowed?: boolean
    gapBetweenSame?: { min: number; max: number } // days
    slotsPerWeek?: { weeks: string; count: number }[]
    slotsPerMonth?: number // Exactly N slots per calendar month
    alternateWith?: string // appointment code to alternate with
    mustBeFirst?: boolean
    mustStartWith?: boolean // Series should start with this type
    canCombineWith?: string[]
    courseSize?: number // max participants for courses
    courseSessions?: number // number of sessions per client
    consecutiveDays?: boolean // Must be scheduled on consecutive days
  }
}

export interface SimulationAppointment {
  id: string
  customerId: string
  customerName: string
  appointmentType: string
  appointmentCode: string
  date: string
  startTime: string
  endTime: string
  duration: number
  color: string
  et: string
  isWeekend: boolean
  isHoliday: boolean
  courseId?: string
  sessionNumber?: number
  canCombineWith?: string[]
}

export interface CustomerSimulationData {
  customerId: string
  customerName: string
  et: Date
  contractDate: Date
  birthNotificationDate?: Date
  appointments: SimulationAppointment[]
  quotas: {
    pregnancyB1: number // B1 visits
    pregnancyB2: number // B2 videos
    earlyC1: number // C1 visits
    earlyC2: number // C2 videos
    lateD1: number // D1 visits
    lateD2: number // D2 videos
    birthPrepSessions: number
    ruckbildungSessions: number
  }
}
