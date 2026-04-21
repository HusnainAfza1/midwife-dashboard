// utils/privateServiceValidation.ts

export interface TimeSlot {
    startTime: string;
    endTime: string;
}

export interface Appointment {
    id: number;
    appointmentNumber: number;
    date: string;
    day: string;
    duration: string;
    type: string;
    week?: number;
    appointmentInWeek?: number;
    month?: number;
    appointmentInMonth?: number;
}

export interface PrivateServiceItem {
    id: string;
    name: string;
    tagline: string;
    type: string;
    duration: string;
    appointments: string;
    turnover: string;
    image?: {
        url: string;
        public_id: string;
        name: string;
    } | null;
    frequency: string;
    frequencyPeriod: string;
    serviceMode: string;
    maxParticipants: string;
    startDate: string;
    selectedDays: string[];
    schedule?: Appointment[];
}

const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// ==================== HELPER FUNCTIONS ====================

const showError = (
    message: string,
    setToasterMessage: (message: string) => void,
    setShowToaster: (show: boolean) => void,
    timeout = 7000
) => {
    setToasterMessage(message);
    setShowToaster(true);
    setTimeout(() => {
        setShowToaster(false);
    }, timeout);
};

const getWeeklyAppointments = (frequency: string, frequencyPeriod: string): number => {
    const appointmentCount = parseInt(frequency);

    if (frequencyPeriod === "per Week") {
        return appointmentCount;
    } else if (frequencyPeriod === "per Month") {
        // Convert monthly to weekly (1 month = 4.33 weeks)
        return Math.ceil(appointmentCount / 4.33);
    }
    return appointmentCount;
};

const getDurationInMinutes = (durationStr: string): number => {
    return parseInt(durationStr.replace(/[^\d]/g, ''));
};

const isReasonableDate = (dateStr: string): boolean => {
    const date = new Date(dateStr);
    const now = new Date();
    const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    const twoYearsFromNow = new Date(now.getFullYear() + 2, now.getMonth(), now.getDate());
    return date >= oneYearAgo && date <= twoYearsFromNow;
};

// ==================== TIMETABLE ANALYSIS ====================
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const calculateMaxIServiceDuration = (timetable: any): number => {
    const iServiceDurations: number[] = [];
    weekDays.forEach((day: string) => {
        const dayData = timetable?.[day];
        if (dayData?.slots?.["I"]) {
            const iSlots = dayData.slots["I"] as TimeSlot[];
            if (Array.isArray(iSlots)) {
                iSlots.forEach((slot: TimeSlot) => {
                    if (slot.startTime && slot.endTime) {
                        const [startHours, startMinutes] = slot.startTime.split(':').map(Number);
                        const [endHours, endMinutes] = slot.endTime.split(':').map(Number);
                        const startTotalMinutes = startHours * 60 + startMinutes;
                        const endTotalMinutes = endHours * 60 + endMinutes;
                        const slotDuration = endTotalMinutes - startTotalMinutes;
                        iServiceDurations.push(slotDuration);
                    }
                });
            }
        }
    });
    return iServiceDurations.length > 0 ? Math.max(...iServiceDurations) : 0;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const initializeDailySlotTracking = (timetable: any): { 
    dailyISlotsNeeded: { [day: string]: number },
    dailyISlotsAvailable: { [day: string]: number }
} => {
    const dailyISlotsNeeded: { [day: string]: number } = {};
    const dailyISlotsAvailable: { [day: string]: number } = {};

    // Initialize daily I-slots needed tracking
    weekDays.forEach(day => {
        dailyISlotsNeeded[day] = 0;
    });

    // Count total available I-slots per day in timetable
    weekDays.forEach((day: string) => {
        const dayData = timetable?.[day];
        dailyISlotsAvailable[day] = 0;
        if (dayData?.slots?.["I"]) {
            const iSlots = dayData.slots["I"] as TimeSlot[];
            if (Array.isArray(iSlots)) {
                dailyISlotsAvailable[day] = iSlots.length;
            }
        }
    });

    return { dailyISlotsNeeded, dailyISlotsAvailable };
};

// ==================== SCHEDULE TYPE DETECTION ====================

const detectScheduleType = (privateService: PrivateServiceItem): boolean => {
    // Determine if this service uses weekly or monthly scheduling
    const isMonthlySchedule = privateService.frequencyPeriod === "per Month";
    console.log(`Is Monthly Schedule: ${isMonthlySchedule}`);

    // Auto-detect schedule type based on actual data structure
    const firstAppointment = privateService.schedule?.[0];
    let actuallyIsMonthly = isMonthlySchedule;

    if (firstAppointment) {
        const hasMonthProperty = firstAppointment.month !== undefined;
        const hasWeekProperty = firstAppointment.week !== undefined;

        if (hasMonthProperty && !hasWeekProperty) {
            actuallyIsMonthly = true;
            console.log("Detected monthly schedule from data structure");
        } else if (hasWeekProperty && !hasMonthProperty) {
            actuallyIsMonthly = false;
            console.log("Detected weekly schedule from data structure");
        }
    }

    console.log(`Final schedule type: ${actuallyIsMonthly ? 'MONTHLY' : 'WEEKLY'}`);
    return actuallyIsMonthly;
};

// ==================== INDIVIDUAL SERVICE VALIDATIONS ====================

const validateServiceBasics = (
    privateService: PrivateServiceItem,
    setToasterMessage: (message: string) => void,
    setShowToaster: (show: boolean) => void
): boolean => {
    // CHECK 2: Service Type Validation
    if (!privateService.type || privateService.type.trim() === '') {
        showError(`Private service "${privateService.name}" has invalid or missing service type.`, setToasterMessage, setShowToaster);
        return false;
    }

    // CHECK 3: Service Name Validation
    if (!privateService.name || privateService.name.trim() === '') {
        showError(`Private service has invalid or missing name.`, setToasterMessage, setShowToaster);
        return false;
    }

    return true;
};

const validateServiceDuration = (
    privateService: PrivateServiceItem,
    maxIServiceDuration: number,
    setToasterMessage: (message: string) => void,
    setShowToaster: (show: boolean) => void
): boolean => {
    // CHECK 4: Duration Format Validation
    const serviceDuration = getDurationInMinutes(privateService.duration);
    if (isNaN(serviceDuration) || serviceDuration <= 0) {
        showError(`Private service "${privateService.name}" has invalid duration format: ${privateService.duration}`, setToasterMessage, setShowToaster);
        return false;
    }

    // CHECK 5: Service duration must not exceed max "I" slot duration
    if (serviceDuration > maxIServiceDuration) {
        showError(`Private service "${privateService.name}" has duration (${privateService.duration}) that exceeds the maximum I service slot duration (${maxIServiceDuration} min). Please adjust your I service slots or service duration.`, setToasterMessage, setShowToaster);
        return false;
    }

    return true;
};

const validateServiceFrequency = (
    privateService: PrivateServiceItem,
    setToasterMessage: (message: string) => void,
    setShowToaster: (show: boolean) => void
): boolean => {
    // CHECK 6: Frequency Period Validation
    if (!['per Week', 'per Month'].includes(privateService.frequencyPeriod)) {
        showError(`Private service "${privateService.name}" has invalid frequency period: ${privateService.frequencyPeriod}. Must be "per Week" or "per Month".`, setToasterMessage, setShowToaster);
        return false;
    }

    // CHECK 7: Frequency Value Validation
    const frequencyValue = parseInt(privateService.frequency);
    if (isNaN(frequencyValue) || frequencyValue <= 0) {
        showError(`Private service "${privateService.name}" has invalid frequency value: ${privateService.frequency}`, setToasterMessage, setShowToaster);
        return false;
    }

    // CHECK 7a: Maximum Frequency Limits Validation
    if (privateService.frequencyPeriod === "per Month") {
        if (frequencyValue > 5) {
            showError(`Private service "${privateService.name}" has frequency ${frequencyValue} per month, but maximum allowed is 5 appointments per month.`, setToasterMessage, setShowToaster);
            return false;
        }
    } else if (privateService.frequencyPeriod === "per Week") {
        if (frequencyValue > 3) {
            showError(`Private service "${privateService.name}" has frequency ${frequencyValue} per week, but maximum allowed is 3 appointments per week.`, setToasterMessage, setShowToaster);
            return false;
        }
    }

    return true;
};

const validateServiceMisc = (
    privateService: PrivateServiceItem,
    setToasterMessage: (message: string) => void,
    setShowToaster: (show: boolean) => void
): boolean => {
    // CHECK 8: Start Date Validation
    if (!privateService.startDate || !isReasonableDate(privateService.startDate)) {
        showError(`Private service "${privateService.name}" has invalid or unreasonable start date: ${privateService.startDate}`, setToasterMessage, setShowToaster);
        return false;
    }

    // CHECK 9: Service Mode Validation
    if (!['individual', 'group'].includes(privateService.serviceMode?.toLowerCase())) {
        showError(`Private service "${privateService.name}" has invalid service mode: ${privateService.serviceMode}. Must be "individual" or "group".`, setToasterMessage, setShowToaster);
        return false;
    }

    // CHECK 10 & 11: Max Participants Validation (CONDITIONAL BASED ON SERVICE MODE)
    if (privateService.serviceMode?.toLowerCase() === 'group') {
        const maxParticipants = parseInt(privateService.maxParticipants);
        if (isNaN(maxParticipants) || maxParticipants <= 0) {
            showError(`Private service "${privateService.name}" is a group service but has invalid max participants: ${privateService.maxParticipants}. Group services must specify a valid number of maximum participants.`, setToasterMessage, setShowToaster);
            return false;
        }

        if (maxParticipants === 1) {
            showError(`Private service "${privateService.name}" is set as group service but allows only 1 participant. Consider changing to individual service or increase max participants.`, setToasterMessage, setShowToaster);
            return false;
        }
    } else if (privateService.serviceMode?.toLowerCase() === 'individual') {
        if (privateService.maxParticipants && privateService.maxParticipants.trim() !== '') {
            const maxParticipants = parseInt(privateService.maxParticipants);
            if (!isNaN(maxParticipants) && maxParticipants > 1) {
                showError(`Private service "${privateService.name}" is set as individual service but allows ${maxParticipants} participants. Individual services should have max 1 participant.`, setToasterMessage, setShowToaster);
                return false;
            }
        }
    }

    // CHECK 12: Image Validation (if present)
    if (privateService.image && privateService.image !== null) {
        if (!privateService.image.url || !privateService.image.public_id || !privateService.image.name) {
            showError(`Private service "${privateService.name}" has incomplete image information. Missing url, public_id, or name.`, setToasterMessage, setShowToaster);
            return false;
        }
    }

    return true;
};

// ==================== SCHEDULE VALIDATIONS ====================

const validateScheduleBasics = (
    privateService: PrivateServiceItem,
    actuallyIsMonthly: boolean,
    setToasterMessage: (message: string) => void,
    setShowToaster: (show: boolean) => void
): boolean => {
    // CHECK 13: Schedule Validation
    if (!privateService.schedule || !Array.isArray(privateService.schedule)) {
        showError(`Private service "${privateService.name}" is missing schedule information.`, setToasterMessage, setShowToaster);
        return false;
    }

    if (privateService.schedule.length === 0) {
        showError(`Private service "${privateService.name}" has empty schedule. Please add appointments.`, setToasterMessage, setShowToaster);
        return false;
    }

    // Validate schedule structure based on actual detected type
    const firstAppointment = privateService.schedule?.[0];
    if (actuallyIsMonthly) {
        if (!firstAppointment?.month || !firstAppointment?.appointmentInMonth) {
            showError(`Private service "${privateService.name}" appears to be monthly but is missing month (${firstAppointment?.month}) or appointmentInMonth (${firstAppointment?.appointmentInMonth}) properties.`, setToasterMessage, setShowToaster);
            return false;
        }
    } else {
        if (!firstAppointment?.week || !firstAppointment?.appointmentInWeek) {
            showError(`Private service "${privateService.name}" appears to be weekly but is missing week (${firstAppointment?.week}) or appointmentInWeek (${firstAppointment?.appointmentInWeek}) properties.`, setToasterMessage, setShowToaster);
            return false;
        }
    }

    return true;
};

const validateScheduleDuplicates = (
    privateService: PrivateServiceItem,
    actuallyIsMonthly: boolean,
    setToasterMessage: (message: string) => void,
    setShowToaster: (show: boolean) => void
): boolean => {
    // CHECK 14: No more than one appointment per day per period (same service)   
    // eslint-disable-next-line @typescript-eslint/no-explicit-any 
    const periodDayGroups: { [key: string]: any[] } = {};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
    privateService.schedule!.forEach((appointment: any) => {
        if (actuallyIsMonthly) {
            // FOR MONTHLY: Allow multiple appointments on same day in same month
            // Only check for duplicate appointments on the SAME DATE
            const key = `month${appointment.month}-${appointment.date}`; // Use date instead of day
            if (!periodDayGroups[key]) {
                periodDayGroups[key] = [];
            }
            periodDayGroups[key].push(appointment);
        } else {
            // FOR WEEKLY: Keep original logic
            const key = `week${appointment.week}-${appointment.day}`;
            if (!periodDayGroups[key]) {
                periodDayGroups[key] = [];
            }
            periodDayGroups[key].push(appointment);
        }
    });

    // Check for duplicates
    for (const [periodDay, appointments] of Object.entries(periodDayGroups)) {
        if (appointments.length > 1) {
            if (actuallyIsMonthly) {
                // For monthly: Error only if same exact date
                const [date] = periodDay.replace(/^month/, '').split('-');
                showError(`Private service "${privateService.name}" has multiple appointments on the same date (${date}). Only one appointment per date is allowed.`, setToasterMessage, setShowToaster);
            } else {
                // For weekly: Error if same day in same week
                const [period, day] = periodDay.replace(/^week/, '').split('-');
                showError(`Private service "${privateService.name}" has multiple appointments (${appointments.length}) on ${day} in week ${period}. Only one appointment per day per week is allowed.`, setToasterMessage, setShowToaster);
            }
            return false;
        }
    }

    return true;
};

const validateScheduleFrequencyMatch = (
    privateService: PrivateServiceItem,
    actuallyIsMonthly: boolean,
    setToasterMessage: (message: string) => void,
    setShowToaster: (show: boolean) => void
): boolean => {
    // CHECK 19: Frequency validation with conversion
    const weeklyAppointments = getWeeklyAppointments(
        privateService.frequency,
        privateService.frequencyPeriod
    );

    let actualAppointmentsInFirstPeriod = 0;

    if (actuallyIsMonthly) {
        // For monthly schedule, count appointments in month 1
        actualAppointmentsInFirstPeriod = privateService.schedule! 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .filter((apt: any) => apt.month === 1).length;

        // For monthly services, validate against the actual frequency count
        const monthlyFrequency = parseInt(privateService.frequency);
        if (actualAppointmentsInFirstPeriod !== monthlyFrequency) {
            showError(`Private service "${privateService.name}" frequency mismatch. Expected ${monthlyFrequency} appointments per month, but found ${actualAppointmentsInFirstPeriod} appointments in month 1.`, setToasterMessage, setShowToaster);
            return false;
        }
    } else {
        // For weekly schedule, count appointments in week 1
        actualAppointmentsInFirstPeriod = privateService.schedule! 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .filter((apt: any) => apt.week === 1).length;

        // Allow some tolerance for rounding (±1 appointment)
        const tolerance = 1;
        if (Math.abs(actualAppointmentsInFirstPeriod - weeklyAppointments) > tolerance) {
            const expectedRange = `${Math.max(0, weeklyAppointments - tolerance)}-${weeklyAppointments + tolerance}`;
            showError(`Private service "${privateService.name}" frequency mismatch. Expected ${weeklyAppointments} appointments per week (${privateService.frequency} ${privateService.frequencyPeriod}), but found ${actualAppointmentsInFirstPeriod} appointments in week 1. Expected range: ${expectedRange} appointments.`, setToasterMessage, setShowToaster);
            return false;
        }
    }

    return true;
};

const validateAppointmentDurations = (
    privateService: PrivateServiceItem,
    setToasterMessage: (message: string) => void,
    setShowToaster: (show: boolean) => void
): boolean => {
    const serviceDuration = getDurationInMinutes(privateService.duration);

    // CHECK 20: Each appointment duration should match service duration
    for (const appointment of privateService.schedule!) {
        if (appointment.duration) {
            const appointmentDuration = getDurationInMinutes(appointment.duration);

            if (appointmentDuration !== serviceDuration) {
                showError(`Private service "${privateService.name}" has inconsistent durations. Service duration: ${privateService.duration}, but appointment on ${appointment.day} has duration: ${appointment.duration}.`, setToasterMessage, setShowToaster);
                return false;
            }
        }
    }

    return true;
};

const validateSequenceNumbers = (
    privateService: PrivateServiceItem,
    actuallyIsMonthly: boolean,
    setToasterMessage: (message: string) => void,
    setShowToaster: (show: boolean) => void
): boolean => {
    // CHECK 24: Period Number Sequence Validation  
    if (actuallyIsMonthly) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const monthNumbers = Array.from(new Set(privateService.schedule!.map((apt: any) => apt.month))).sort((a, b) => a - b);
        for (let i = 0; i < monthNumbers.length; i++) {
            if (monthNumbers[i] !== i + 1) {
                showError(`Private service "${privateService.name}" has non-sequential month numbers. Expected month ${i + 1}, but found month ${monthNumbers[i]}.`, setToasterMessage, setShowToaster);
                return false;
            }
        }

        // CHECK 25a: Appointment In Month Sequence Validation
        for (const month of monthNumbers) {
            const monthAppointments = privateService.schedule! 
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .filter((apt: any) => apt.month === month) 
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .sort((a: any, b: any) => a.appointmentInMonth - b.appointmentInMonth);

            for (let i = 0; i < monthAppointments.length; i++) {
                if (monthAppointments[i].appointmentInMonth !== i + 1) {
                    showError(`Private service "${privateService.name}" has incorrect appointmentInMonth numbering in month ${month}. Expected ${i + 1}, but found ${monthAppointments[i].appointmentInMonth}.`, setToasterMessage, setShowToaster);
                    return false;
                }
            }
        }
    } else {
        // For weekly schedule - validate week numbers 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const weekNumbers = Array.from(new Set(privateService.schedule!.map((apt: any) => apt.week))).sort((a, b) => a - b);
        for (let i = 0; i < weekNumbers.length; i++) {
            if (weekNumbers[i] !== i + 1) {
                showError(`Private service "${privateService.name}" has non-sequential week numbers. Expected week ${i + 1}, but found week ${weekNumbers[i]}.`, setToasterMessage, setShowToaster);
                return false;
            }
        }

        // CHECK 25b: Appointment In Week Sequence Validation
        for (const week of weekNumbers) {
            const weekAppointments = privateService.schedule! 
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .filter((apt: any) => apt.week === week) 
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .sort((a: any, b: any) => a.appointmentInWeek - b.appointmentInWeek);

            for (let i = 0; i < weekAppointments.length; i++) {
                if (weekAppointments[i].appointmentInWeek !== i + 1) {
                    showError(`Private service "${privateService.name}" has incorrect appointmentInWeek numbering in week ${week}. Expected ${i + 1}, but found ${weekAppointments[i].appointmentInWeek}.`, setToasterMessage, setShowToaster);
                    return false;
                }
            }
        }
    }

    return true;
};

// ==================== SLOT CALCULATIONS ====================

const calculateSlotRequirements = (
    privateService: PrivateServiceItem,
    actuallyIsMonthly: boolean,
    dailyISlotsNeeded: { [day: string]: number }
): void => {
    // NEW: Use schedule to find which days need I-slots for this service
    if (actuallyIsMonthly) { 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const month1Appointments = privateService.schedule!.filter((apt: any) => apt.month === 1); 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const uniqueDaysInMonth1 = Array.from(new Set(month1Appointments.map((apt: any) => apt.day)));
        uniqueDaysInMonth1.forEach(day => {
            dailyISlotsNeeded[day] += 1;
        });

        console.log(`Monthly service "${privateService.name}" needs 1 I-slot on: ${uniqueDaysInMonth1.join(', ')}`);
    } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const week1Appointments = privateService.schedule!.filter((apt: any) => apt.week === 1);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const uniqueDaysInWeek1 = Array.from(new Set(week1Appointments.map((apt: any) => apt.day)));
        uniqueDaysInWeek1.forEach(day => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const appointmentsOnThisDay = week1Appointments.filter((apt: any) => apt.day === day).length;
            dailyISlotsNeeded[day] += appointmentsOnThisDay;
        });

        console.log(`Weekly service "${privateService.name}" needs I-slots on: ${uniqueDaysInWeek1.join(', ')}`);
    }
};

const validateSlotAvailability = (
    dailyISlotsNeeded: { [day: string]: number },
    dailyISlotsAvailable: { [day: string]: number },
    privateServicesArray: PrivateServiceItem[],
    setToasterMessage: (message: string) => void,
    setShowToaster: (show: boolean) => void
): boolean => {
    // CHECK 21: Day-by-Day I-Slots Validation
    for (const day of weekDays) {
        const needed = dailyISlotsNeeded[day];
        const available = dailyISlotsAvailable[day];

        if (needed > 0) {
            console.log(`${day}: ${needed} I-slots needed, ${available} I-slots available`);

            if (needed > available) {
                // Find which services need I-slots on this day for better error message
                const servicesOnThisDay: string[] = [];

                privateServicesArray.forEach(service => {
                    if (service.schedule && Array.isArray(service.schedule)) {
                        const serviceSchedule = service.frequencyPeriod === "per Month" 
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            ? service.schedule.filter((apt: any) => apt.month === 1) 
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            : service.schedule.filter((apt: any) => apt.week === 1); 
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const hasAppointmentOnThisDay = serviceSchedule.some((apt: any) => apt.day === day);
                        if (hasAppointmentOnThisDay) {
                            servicesOnThisDay.push(service.name);
                        }
                    }
                });

                showError(`${day} requires ${needed} I-service slots but only ${available} available. Private services needing I-slots on ${day}: ${servicesOnThisDay.join(', ')}. Please add more "I" service slots for ${day}.`, setToasterMessage, setShowToaster);
                return false;
            }
        }
    }

    return true;
};

const validateFinalScheduleMatch = (
    privateServicesArray: PrivateServiceItem[],
    setToasterMessage: (message: string) => void,
    setShowToaster: (show: boolean) => void
): boolean => {
    // CHECK 22: Validate schedule days match private service requirements
    for (const privateService of privateServicesArray) {
        let actualScheduledSlots = 0;
        if (privateService.frequencyPeriod === "per Month") { 
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const month1Appointments = privateService.schedule?.filter((apt: any) => apt.month === 1) || [];
            actualScheduledSlots = month1Appointments.length;

            const monthlyFrequency = parseInt(privateService.frequency);
            if (actualScheduledSlots !== monthlyFrequency) {
                showError(`Private service "${privateService.name}" schedule mismatch. Expected ${monthlyFrequency} appointments but schedule shows ${actualScheduledSlots} appointments.`, setToasterMessage, setShowToaster);
                return false;
            }
        } else { 
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const week1Appointments = privateService.schedule?.filter((apt: any) => apt.week === 1) || [];
            actualScheduledSlots = week1Appointments.length;

            const weeklyFrequency = parseInt(privateService.frequency);
            if (actualScheduledSlots !== weeklyFrequency) {
                showError(`Private service "${privateService.name}" schedule mismatch. Expected ${weeklyFrequency} appointments but schedule shows ${actualScheduledSlots} appointments.`, setToasterMessage, setShowToaster);
                return false;
            }
        }
    }

    return true;
};

const validateTurnover = (
    privateServicesArray: PrivateServiceItem[],
    setToasterMessage: (message: string) => void,
    setShowToaster: (show: boolean) => void
): boolean => {
    // CHECK 28: Turnover Validation (if applicable)
    for (const privateService of privateServicesArray) {
        if (privateService.turnover && privateService.turnover.trim() !== '') {
            const statedTurnover = parseFloat(privateService.turnover.replace(/[^\d.]/g, ''));
            if (isNaN(statedTurnover)) {
                showError(`Private service "${privateService.name}" has invalid turnover format: ${privateService.turnover}`, setToasterMessage, setShowToaster);
                return false;
            }
        }
    }

    return true;
};

// ==================== MAIN VALIDATION FUNCTION ====================

export const validatePrivateServicesDuration = ( 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any    
    midwifeType: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    timetable: any,
    setToasterMessage: (message: string) => void,
    setShowToaster: (show: boolean) => void
): boolean => {
    const services = midwifeType?.services;
    const privateServicesArray = services?.["private-services"] as PrivateServiceItem[] | undefined;

    const hasSelectedPrivateServices = privateServicesArray &&
        Array.isArray(privateServicesArray) &&
        privateServicesArray.length > 0;

    if (!hasSelectedPrivateServices) {
        return true; // No private services selected, validation passes
    }

    // Calculate max I-service duration
    const maxIServiceDuration = calculateMaxIServiceDuration(timetable);

    if (maxIServiceDuration === 0) {
        showError("You have selected private services but haven't scheduled any 'I' service slots. Please add 'I' slots to your timetable.", setToasterMessage, setShowToaster);
        return false;
    }

    // Initialize slot tracking
    const { dailyISlotsNeeded, dailyISlotsAvailable } = initializeDailySlotTracking(timetable);

    // Loop through each private service for validation
    for (const privateService of privateServicesArray!) {

        // Debug: Log service details to help identify the issue
        console.log(`Validating service: "${privateService.name}"`);
        console.log(`Frequency Period: "${privateService.frequencyPeriod}"`);
        console.log(`Schedule sample:`, privateService.schedule?.[0]);

        // Detect schedule type
        const actuallyIsMonthly = detectScheduleType(privateService);

        // Basic validations
        if (!validateServiceBasics(privateService, setToasterMessage, setShowToaster)) return false;
        if (!validateServiceDuration(privateService, maxIServiceDuration, setToasterMessage, setShowToaster)) return false;
        if (!validateServiceFrequency(privateService, setToasterMessage, setShowToaster)) return false;
        if (!validateServiceMisc(privateService, setToasterMessage, setShowToaster)) return false;

        // Schedule validations
        if (!validateScheduleBasics(privateService, actuallyIsMonthly, setToasterMessage, setShowToaster)) return false;
        if (!validateScheduleDuplicates(privateService, actuallyIsMonthly, setToasterMessage, setShowToaster)) return false;
        if (!validateScheduleFrequencyMatch(privateService, actuallyIsMonthly, setToasterMessage, setShowToaster)) return false;
        if (!validateAppointmentDurations(privateService, setToasterMessage, setShowToaster)) return false;

        // Calculate slot requirements for this service
        calculateSlotRequirements(privateService, actuallyIsMonthly, dailyISlotsNeeded);

        // Sequence validations
        if (!validateSequenceNumbers(privateService, actuallyIsMonthly, setToasterMessage, setShowToaster)) return false;
    }

    // Global validations after all services processed
    
    // Validate slot availability
    if (!validateSlotAvailability(dailyISlotsNeeded, dailyISlotsAvailable, privateServicesArray!, setToasterMessage, setShowToaster)) {
        return false;
    }

    // Final schedule match validation
    if (!validateFinalScheduleMatch(privateServicesArray!, setToasterMessage, setShowToaster)) return false;

    // Turnover validation
    if (!validateTurnover(privateServicesArray!, setToasterMessage, setShowToaster)) return false;

    return true; // All validations passed
};