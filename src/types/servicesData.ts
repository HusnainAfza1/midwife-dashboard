export interface ServiceData {
    code: string
    title: string
    description: string
    serviceType: string
    duration: string
    startingAt: string
    interval: string
    appointments: string | null
    turnover: string | null
    category: string
}

// export interface ServiceApiData {
//     code: string
//     title: string
//     description: string
//     serviceType: string
//     duration: string
//     startingAt: string
//     interval: string
//     appointments: string | null
//     turnover: string | null
// }
export interface ServiceApiData {
    code?: string;
    title?: string;
    tagline?: string;
    description?: string;
    serviceType?: string;
    frequency?: string;
    frequencyPeriod?: string;
    serviceMode?: string;
    maxParticipants?: string;
    duration?: string;
    startDate?: string;
    interval?: string;
    startingAt?: string;
    appointments?: string | number | null;
    turnover?: string | number | null;
    selectedDays?: Record<string, { slots?: string }>;
}