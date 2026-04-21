"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, ChevronLeft, ChevronRight, X, Calendar, List, Edit2, Clock } from "lucide-react"
import { PostBirthApproval } from "./Tables/columns"
import { toast } from "sonner"
import { useState, useEffect } from "react"
import { UpdateAppointmentStatusApi } from "@/endpoints/patchEndpoints"
import { GetMidiwfeByIdApi } from "@/endpoints/getEndpoints"
import { getBookedAppointmentsApi, updateClientPlanApi } from "@/endpoints/postEndpoints"
import { changeAppointmentSlotsApi } from "@/endpoints/putEndpoints"
import { DeleteAppointmentApi } from "@/endpoints/deleteEndpoints"
import { removeClientFromClassesApi } from "@/endpoints/deleteEndpoints"
import { createNewAppointmentApi } from "@/endpoints/postEndpoints"
import { assignClassesToClientApi } from "@/endpoints/postEndpoints"
import { SERVICES_DURATIONS } from "@/config/constants"
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameMonth,
    parseISO,
    parse,
    isSameDay,
    startOfWeek,
    endOfWeek,
    isWeekend,
    getDay,
} from "date-fns"

interface ClientPostbirthPendingAppointmentsProps {
    approval: PostBirthApproval
    onBack: () => void
}

interface TransformedAppointment {
    id: string
    type: string
    typeCode: string
    color: string
    patient: string
    date: string
    time: string
    duration: number
    status: string
    classNo?: string
    clientId?: string
    classId?: string
}

interface TimeSlot {
    startTime: string
    endTime: string
}

interface MidwifeTimetable {
    [day: string]: {
        slots: {
            [serviceCode: string]: TimeSlot[]
        }
    }
}

interface MidwifeData {
    identity: {
        timetable: MidwifeTimetable
    }
    midwifeType: {
        midwifeType: string
    }
}

interface BookedAppointment {
    appointmentId: string
    appointmentDate: string
    startTime: string
    endTime: string
    duration: number
    status: string
    clientId?: string
    serviceCode?: string
}

interface BookedAppointmentsData {
    [monthYear: string]: {
        [serviceCode: string]: BookedAppointment[]
    }
}

const POSTBIRTH_APPOINTMENT_LIMITS = {
    ESSENTIAL: { C1: 10, C2: 10, D1: 8, D2: 8, F1: 0 },
    PRO: { C1: 10, C2: 10, D1: 8, D2: 8, F1: 8 },
    ADVANCED: { C1: 10, C2: 10, D1: 8, D2: 8, F1: 0 },
    ULTIMATE: { C1: 10, C2: 10, D1: 8, D2: 8, F1: 8 }
}
// Service colors mapping
const SERVICE_COLORS: { [key: string]: string } = {
    C1: "bg-red-600",
    C2: "bg-orange-500",
    D1: "bg-yellow-600",
    D2: "bg-amber-500",
    F1: "bg-purple-700",
}
// Service border colors mapping 
const SERVICE_BORDER_COLORS: { [key: string]: string } = {
    C1: "border-red-600",
    C2: "border-orange-500",
    D1: "border-yellow-600",
    D2: "border-amber-500",
    F1: "border-purple-700",
}

// Service names mapping
const SERVICE_NAMES: { [key: string]: string } = {
    C1: "Early Care Visit",
    C2: "Early Care Video",
    D1: "Late Care Visit",
    D2: "Late Care Video",
    F1: "After Birth Gym",
}

const CLASS_RANGES = {
    class1: { start: 1, end: 2, label: "January - February" },
    class2: { start: 3, end: 4, label: "March - April" },
    class3: { start: 5, end: 6, label: "May - June" },
    class4: { start: 7, end: 8, label: "July - August" },
    class5: { start: 9, end: 10, label: "September - October" },
    class6: { start: 11, end: 12, label: "November - December" }
}

// Day names mapping
const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

export default function ClientPostbirthPendingAppointments({
    approval,
    onBack
}: ClientPostbirthPendingAppointmentsProps) {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar")
    const [selectedAppointment, setSelectedAppointment] = useState<TransformedAppointment | null>(null)
    const [transformedAppointments, setTransformedAppointments] = useState<TransformedAppointment[]>([])
    const [isApproving, setIsApproving] = useState(false)
    const [selectedOtherClientAppointment, setSelectedOtherClientAppointment] = useState<TransformedAppointment | null>(null)
    const [expectedTotal, setExpectedTotal] = useState(0)
    const [currentTotal, setCurrentTotal] = useState(0)

    // Edit modal states
    const [showEditModal, setShowEditModal] = useState(false)
    const [editingAppointment, setEditingAppointment] = useState<TransformedAppointment | null>(null)
    const [midwifeData, setMidwifeData] = useState<MidwifeData | null>(null)
    const [loadingMidwife, setLoadingMidwife] = useState(false)
    const [editCalendarDate, setEditCalendarDate] = useState(new Date())

    // Edit flow states
    const [editStep, setEditStep] = useState<"selectDate" | "selectTime">("selectDate")
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null)
    const [isUpdating, setIsUpdating] = useState(false)

    // Booked appointments states
    const [bookedAppointmentsData, setBookedAppointmentsData] = useState<BookedAppointmentsData | null>(null)
    const [otherClientsAppointments, setOtherClientsAppointments] = useState<TransformedAppointment[]>([])
    const [loadingBookedAppointments, setLoadingBookedAppointments] = useState(false)
    // delete flow 
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [deletingAppointment, setDeletingAppointment] = useState<TransformedAppointment | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    // Create appointment states
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [createStep, setCreateStep] = useState<"selectService" | "selectDate" | "selectTime">("selectService")
    const [selectedServiceCode, setSelectedServiceCode] = useState<string | null>(null)
    const [createSelectedDate, setCreateSelectedDate] = useState<Date | null>(null)
    const [createSelectedTimeSlot, setCreateSelectedTimeSlot] = useState<TimeSlot | null>(null)
    const [isCreating, setIsCreating] = useState(false)
    const [createCalendarDate, setCreateCalendarDate] = useState(new Date())

    // E1/F1 class assignment states
    const [createClassStep, setCreateClassStep] = useState<"checkExisting" | "selectYear" | "selectClass">("checkExisting")
    const [selectedYear, setSelectedYear] = useState<string | null>(null)
    const [selectedClass, setSelectedClass] = useState<string | null>(null)
    const [isAssigningClass, setIsAssigningClass] = useState(false)

    // Custom time slot states
    const [showCustomTimeOption, setShowCustomTimeOption] = useState(false)
    const [customStartTime, setCustomStartTime] = useState<string>("")
    const [customEndTime, setCustomEndTime] = useState<string>("")
    const [availableTimeRanges, setAvailableTimeRanges] = useState<string[]>([])
    const [customSlotDate, setCustomSlotDate] = useState<Date | null>(null)



    // Transform appointments data   
    console.log("Approvals::", approval)
    useEffect(() => {
        const transformed: TransformedAppointment[] = []

        if (approval.appointments) {
            Object.entries(approval.appointments).forEach(([serviceCode, appointments]) => {
                if (Array.isArray(appointments)) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    appointments.forEach((apt: any) => {
                        const parsedDate = parse(apt.appointmentDate, "dd/MM/yyyy", new Date())
                        const isoDate = format(parsedDate, "yyyy-MM-dd")

                        transformed.push({
                            id: apt.appointmentId,
                            type: SERVICE_NAMES[serviceCode] || serviceCode,
                            typeCode: serviceCode,
                            color: SERVICE_COLORS[serviceCode] || "bg-gray-500",
                            patient: approval.clientName,
                            date: isoDate,
                            time: apt.startTime,
                            duration: apt.duration,
                            status: apt.status,
                            classNo: apt.classNo,
                            clientId: approval.clientId,
                            classId: apt.classId,
                        })
                    })
                }
            })
        }

        transformed.sort((a, b) => {
            const dateCompare = a.date.localeCompare(b.date)
            if (dateCompare !== 0) return dateCompare
            return a.time.localeCompare(b.time)
        })

        setTransformedAppointments(transformed)
    }, [approval])

    // Update appointment counts when data changes
    useEffect(() => {
        setExpectedTotal(calculateExpectedTotal())
        setCurrentTotal(calculateCurrentTotal())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [transformedAppointments, midwifeData])

    // Fetch booked appointments
    const fetchBookedAppointments = async () => {
        setLoadingBookedAppointments(true)
        try {
            const response = await getBookedAppointmentsApi(approval.midwifeId, approval.clientET)

            if (!response.data.success) {
                throw new Error('Failed to fetch booked appointments')
            }

            const bookedData = response.data.data as BookedAppointmentsData
            console.log("Booked Appointments Data:", bookedData)
            setBookedAppointmentsData(bookedData)

            const otherClientsTransformed: TransformedAppointment[] = []

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            Object.entries(bookedData).forEach(([monthYear, services]) => {
                Object.entries(services as Record<string, BookedAppointment[]>).forEach(([serviceCode, appointments]) => {
                    if (Array.isArray(appointments)) {
                        appointments.forEach((apt: BookedAppointment) => {
                            if (apt.clientId && apt.clientId !== approval.clientId) {
                                const parsedDate = parse(apt.appointmentDate, "dd/MM/yyyy", new Date())
                                const isoDate = format(parsedDate, "yyyy-MM-dd")

                                otherClientsTransformed.push({
                                    id: apt.appointmentId,
                                    type: SERVICE_NAMES[serviceCode] || serviceCode,
                                    typeCode: serviceCode,
                                    color: SERVICE_COLORS[serviceCode] || "bg-gray-500",
                                    patient: "Other Client",
                                    date: isoDate,
                                    time: apt.startTime,
                                    duration: apt.duration,
                                    status: apt.status,
                                    clientId: apt.clientId,
                                })
                            }
                        })
                    }
                })
            })

            setOtherClientsAppointments(otherClientsTransformed)

        } catch (error) {
            console.error("Error fetching booked appointments:", error)
            toast.error("Failed to load booked appointments")
        } finally {
            setLoadingBookedAppointments(false)
        }
    }

    useEffect(() => {
        if (approval.midwifeId) {
            fetchMidwifeData(approval.midwifeId)
        }
        if (approval.midwifeId && approval.clientET) {
            fetchBookedAppointments()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [approval.midwifeId, approval.clientET])


    // Generate available dates for dropdown (next 30 days) - EDIT flow
    const generateAvailableDates = (serviceCode: string): Date[] => {
        const dates: Date[] = []
        const today = new Date()

        for (let i = 0; i < 30; i++) {
            const date = new Date(today)
            date.setDate(date.getDate() + i)

            if (isDateAvailable(date, serviceCode)) {
                dates.push(date)
            }
        }

        return dates
    }

    // Generate available dates for dropdown (next 30 days) - CREATE flow
    const generateCreateAvailableDates = (serviceCode: string): Date[] => {
        const dates: Date[] = []
        const today = new Date()

        for (let i = 0; i < 30; i++) {
            const date = new Date(today)
            date.setDate(date.getDate() + i)

            if (isCreateDateAvailable(date, serviceCode)) {
                dates.push(date)
            }
        }

        return dates
    }

    // Handle date change in custom time slot - EDIT flow
    const handleCustomDateChange = (newDate: Date) => {
        setCustomSlotDate(newDate)
        setCustomStartTime("")
        setCustomEndTime("")
        const ranges = findAvailableTimeRanges(newDate)
        setAvailableTimeRanges(ranges)
    }

    // Handle date change in custom time slot - CREATE flow
    const handleCreateCustomDateChange = (newDate: Date) => {
        setCustomSlotDate(newDate)
        setCustomStartTime("")
        setCustomEndTime("")
        const ranges = findAvailableTimeRanges(newDate)
        setAvailableTimeRanges(ranges)
    }

    const fetchMidwifeData = async (midwifeId: string) => {
        setLoadingMidwife(true)
        try {
            const response = await GetMidiwfeByIdApi(midwifeId)

            if (!response.data.success) {
                throw new Error('Failed to fetch midwife data')
            }

            console.log("Midwife Data:", response.data.data)
            setMidwifeData(response.data.data)

        } catch (error) {
            console.error("Error fetching midwife:", error)
            toast.error("Failed to load midwife availability")
        } finally {
            setLoadingMidwife(false)
        }
    }

    const handleEditClick = async (appointment: TransformedAppointment) => {
        setEditingAppointment(appointment)
        setShowEditModal(true)
        setEditStep("selectDate")
        setSelectedDate(null)
        setSelectedTimeSlot(null)

        if (!midwifeData && approval.midwifeId) {
            await fetchMidwifeData(approval.midwifeId)
        }
    }

    const handleDeleteClick = (appointment: TransformedAppointment) => {
        setDeletingAppointment(appointment)
        setShowDeleteConfirm(true)
    }

    const handleConfirmDelete = async () => {
        if (!deletingAppointment) return
        setIsDeleting(true)
        try {
            // Check if it's F1 class-based appointment
            if (deletingAppointment.typeCode === 'F1') {
                const payload = {
                    data: {
                        serviceCode: deletingAppointment.typeCode,
                        clientId: approval.clientId,
                        midwifeId: approval.midwifeId,
                        classId: deletingAppointment.classId
                    }
                }

                const response = await removeClientFromClassesApi(payload)

                if (!response.data.success) {
                    throw new Error(response.data.error || 'Failed to remove client from class')
                }

                toast.success("Client removed from F1 class successfully!")
                setTransformedAppointments(prev => prev.filter(apt => apt.typeCode !== 'F1'))

            } else {
                const payload = {
                    data: {
                        serviceCode: deletingAppointment.typeCode,
                        appointmentId: deletingAppointment.id,
                        clientId: approval.clientId,
                        midwifeId: approval.midwifeId
                    }
                }

                const response = await DeleteAppointmentApi(payload)

                if (!response.data.success) {
                    throw new Error(response.data.error || 'Failed to delete appointment')
                }

                toast.success("Appointment deleted successfully!")
                setTransformedAppointments(prev => prev.filter(apt => apt.id !== deletingAppointment.id))
            }

            await fetchBookedAppointments()
            setShowDeleteConfirm(false)
            setSelectedAppointment(null)
            setDeletingAppointment(null)

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error("Error deleting appointment:", error)
            toast.error(error.message || "Failed to delete appointment")
        } finally {
            setIsDeleting(false)
        }
    }

    const handleCancelDelete = () => {
        setShowDeleteConfirm(false)
        setDeletingAppointment(null)
    }

    const isDateAvailable = (date: Date, serviceCode: string): boolean => {
        if (!midwifeData?.identity?.timetable) return false

        const dayName = DAY_NAMES[getDay(date)]
        const daySlots = midwifeData.identity.timetable[dayName]

        if (!daySlots?.slots?.[serviceCode]) return false

        return daySlots.slots[serviceCode].length > 0
    }

    const isTimeSlotBooked = (date: Date, timeSlot: TimeSlot): boolean => {
        if (!bookedAppointmentsData) return false

        const dateStr = format(date, "dd/MM/yyyy")
        const monthYear = format(date, "M/yyyy")

        const monthData = bookedAppointmentsData[monthYear]
        if (!monthData) return false

        for (const serviceCode in monthData) {
            const appointments = monthData[serviceCode]
            if (Array.isArray(appointments)) {
                for (const apt of appointments) {
                    if (apt.appointmentDate === dateStr) {
                        if (timeSlotsOverlap(timeSlot.startTime, timeSlot.endTime, apt.startTime, apt.endTime)) {
                            return true
                        }
                    }
                }
            }
        }

        return false
    }

    const timeSlotsOverlap = (start1: string, end1: string, start2: string, end2: string): boolean => {
        const startTime1 = parseTime(start1)
        const endTime1 = parseTime(end1)
        const startTime2 = parseTime(start2)
        const endTime2 = parseTime(end2)

        return startTime1 < endTime2 && endTime1 > startTime2
    }

    const parseTime = (time: string): number => {
        const [hours, minutes] = time.split(':').map(Number)
        return hours * 60 + minutes
    }

    const getAvailableTimeSlots = (date: Date, serviceCode: string): TimeSlot[] => {
        if (!midwifeData?.identity?.timetable) return []

        const dayName = DAY_NAMES[getDay(date)]
        const daySlots = midwifeData.identity.timetable[dayName]

        if (!daySlots?.slots?.[serviceCode]) return []

        return daySlots.slots[serviceCode] || []
    }

    const generateEditCalendarDays = () => {
        const monthStart = startOfMonth(editCalendarDate)
        const monthEnd = endOfMonth(editCalendarDate)
        const startDate = startOfWeek(monthStart)
        const endDate = endOfWeek(monthEnd)

        return eachDayOfInterval({ start: startDate, end: endDate })
    }

    const handleDateSelect = (date: Date) => {
        if (!editingAppointment) return

        const isPast = date < new Date()
        const isAvailable = isDateAvailable(date, editingAppointment.typeCode)

        if (!isPast && isAvailable) {
            setSelectedDate(date)
        }
    }

    const handleNextToTimeSelection = () => {
        if (!selectedDate) {
            toast.error("Please select a date first")
            return
        }
        setEditStep("selectTime")
    }

    const handleBackToDateSelection = () => {
        setEditStep("selectDate")
        setSelectedTimeSlot(null)
    }

    const handleTimeSlotSelect = (timeSlot: TimeSlot) => {
        setSelectedTimeSlot(timeSlot)

        setShowCustomTimeOption(false)
        setCustomStartTime("")
        setCustomEndTime("")

        if (!editingAppointment || !selectedDate) return

        const payload = {
            midwifeId: approval.midwifeId,
            clientId: approval.clientId,
            serviceCode: editingAppointment.typeCode,
            appointmentId: editingAppointment.id,
            updatedDate: format(selectedDate, "dd/MM/yyyy"),
            updatedStartTime: timeSlot.startTime,
            updatedEndTime: timeSlot.endTime
        }

        console.log("Time slot selected. Payload:", payload)
    }

    const handleUpdateAppointment = async () => {
        if (showCustomTimeOption) {
            if (!customStartTime || !customEndTime || !selectedDate) {
                toast.error("Please select start time for custom slot")
                return
            }

            if (!isCustomTimeValid(customStartTime, customEndTime, selectedDate)) {
                return
            }

            setIsUpdating(true)
            try {
                const payload = {
                    midwifeId: approval.midwifeId,
                    clientId: approval.clientId,
                    serviceCode: editingAppointment!.typeCode,
                    appointmentId: editingAppointment!.id,
                    // updatedDate: format(selectedDate, "dd/MM/yyyy"),  
                    updatedDate: format(customSlotDate || selectedDate, "dd/MM/yyyy"),
                    updatedStartTime: customStartTime,
                    updatedEndTime: customEndTime
                }

                const response = await changeAppointmentSlotsApi(payload)
                if (!response.data.success) {
                    throw new Error(response.data.error || 'Failed to update appointment')
                }

                toast.success("Appointment updated successfully!")
                setTransformedAppointments(prev => prev.map(apt =>
                    apt.id === editingAppointment!.id
                        ? { ...apt, date: format(customSlotDate || selectedDate, "yyyy-MM-dd"), time: customStartTime, duration: apt.duration }
                        : apt
                ))

                await fetchBookedAppointments()
                setShowEditModal(false)
                setEditingAppointment(null)
                setEditStep("selectDate")
                setSelectedDate(null)
                setSelectedTimeSlot(null)
                setShowCustomTimeOption(false)
                setCustomStartTime("")
                setCustomEndTime("")
                setSelectedAppointment(null)
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                console.error("Error updating appointment:", error)
                toast.error(error.message || "Failed to update appointment")
            } finally {
                setIsUpdating(false)
            }
        } else {
            if (!editingAppointment || !selectedDate || !selectedTimeSlot) {
                toast.error("Please select a date and time slot")
                return
            }

            setIsUpdating(true)
            try {
                const payload = {
                    midwifeId: approval.midwifeId,
                    clientId: approval.clientId,
                    serviceCode: editingAppointment.typeCode,
                    appointmentId: editingAppointment.id,
                    updatedDate: format(selectedDate, "dd/MM/yyyy"),
                    updatedStartTime: selectedTimeSlot.startTime,
                    updatedEndTime: selectedTimeSlot.endTime
                }

                const response = await changeAppointmentSlotsApi(payload)
                if (!response.data.success) {
                    throw new Error(response.data.error || 'Failed to update appointment')
                }

                toast.success("Appointment updated successfully!")
                setTransformedAppointments(prev => prev.map(apt =>
                    apt.id === editingAppointment.id
                        ? { ...apt, date: format(selectedDate, "yyyy-MM-dd"), time: selectedTimeSlot.startTime, duration: apt.duration }
                        : apt
                ))

                await fetchBookedAppointments()
                setShowEditModal(false)
                setEditingAppointment(null)
                setEditStep("selectDate")
                setSelectedDate(null)
                setSelectedTimeSlot(null)
                setSelectedAppointment(null)
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                console.error("Error updating appointment:", error)
                toast.error(error.message || "Failed to update appointment")
            } finally {
                setIsUpdating(false)
            }
        }
    }

    // Calculate total expected appointments based on midwife type
    const calculateExpectedTotal = () => {
        if (!midwifeData?.midwifeType?.midwifeType) return 0

        const midwifeType = midwifeData.midwifeType.midwifeType.toUpperCase()
        const limits = POSTBIRTH_APPOINTMENT_LIMITS[midwifeType as keyof typeof POSTBIRTH_APPOINTMENT_LIMITS]

        if (!limits) return 0

        return Object.values(limits).reduce((sum, count) => sum + count, 0)
    }

    // Calculate current appointment count
    const calculateCurrentTotal = () => {
        return transformedAppointments.length
    }

    // Get breakdown of appointments by service type
    const getServiceBreakdown = () => {
        const breakdown: { [key: string]: { current: number; expected: number } } = {}

        if (!midwifeData?.midwifeType?.midwifeType) return breakdown

        const midwifeType = midwifeData.midwifeType.midwifeType.toUpperCase()
        const limits = POSTBIRTH_APPOINTMENT_LIMITS[midwifeType as keyof typeof POSTBIRTH_APPOINTMENT_LIMITS]

        if (!limits) return breakdown

        // Initialize breakdown with expected counts
        Object.entries(limits).forEach(([serviceCode, expectedCount]) => {
            breakdown[serviceCode] = {
                current: 0,
                expected: expectedCount
            }
        })

        // Count current appointments by service type
        transformedAppointments.forEach(apt => {
            if (breakdown[apt.typeCode]) {
                breakdown[apt.typeCode].current++
            }
        })

        return breakdown
    }

    const getMonthAppointments = () => {
        const monthStart = startOfMonth(currentDate)
        const monthEnd = endOfMonth(currentDate)

        return transformedAppointments.filter((apt) => {
            const aptDate = parseISO(apt.date)
            return aptDate >= monthStart && aptDate <= monthEnd
        })
    }

    const getOtherClientsMonthAppointments = () => {
        const monthStart = startOfMonth(currentDate)
        const monthEnd = endOfMonth(currentDate)

        return otherClientsAppointments.filter((apt) => {
            const aptDate = parseISO(apt.date)
            return aptDate >= monthStart && aptDate <= monthEnd
        })
    }

    const generateCalendarDays = () => {
        const monthStart = startOfMonth(currentDate)
        const monthEnd = endOfMonth(currentDate)
        const startDate = startOfWeek(monthStart)
        const endDate = endOfWeek(monthEnd)

        return eachDayOfInterval({ start: startDate, end: endDate })
    }

    const getAppointmentsForDay = (date: Date) => {
        const dateString = format(date, "yyyy-MM-dd")
        const currentClientApts = getMonthAppointments().filter((appointment) => appointment.date === dateString)
        const otherClientsApts = getOtherClientsMonthAppointments().filter((appointment) => appointment.date === dateString)

        return {
            currentClient: currentClientApts,
            otherClients: otherClientsApts
        }
    }

    const groupAppointmentsByDate = () => {
        const grouped: { [date: string]: TransformedAppointment[] } = {}
        const monthAppointments = getMonthAppointments()

        monthAppointments.forEach((appointment) => {
            if (!grouped[appointment.date]) {
                grouped[appointment.date] = []
            }
            grouped[appointment.date].push(appointment)
        })

        return Object.keys(grouped)
            .sort()
            .map((date) => ({
                date,
                appointments: grouped[date].sort((a, b) => a.time.localeCompare(b.time)),
            }))
    }

    const goToPreviousMonth = () => setCurrentDate(subMonths(currentDate, 1))
    const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1))
    const goToToday = () => setCurrentDate(new Date())

    const goToEditPreviousMonth = () => setEditCalendarDate(subMonths(editCalendarDate, 1))
    const goToEditNextMonth = () => setEditCalendarDate(addMonths(editCalendarDate, 1))

    const monthAppointments = getMonthAppointments()

    const handleApproveAll = async () => {
        setIsApproving(true)
        try {
            console.log("Appointment ID:", approval._id)
            const response = await UpdateAppointmentStatusApi(approval._id, "postbirth")
            if (!response.data.success) {
                throw new Error('Failed to approve appointments')
            }

            const result = response.data.data
            console.log("Results:", result)
            const updateclientResponse = await updateClientPlanApi(approval.clientId, approval.midwifeId, "Postbirth")
            console.log("updateclientResponse", updateclientResponse)
            toast.success("Approved Successfully!")

            onBack();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error("Error approving appointments:", error)
            toast.error(error.message)
        } finally {
            setIsApproving(false)
        }
    }

    const allAppointmentsActive = transformedAppointments.every(apt => apt.status === "active")

    // Get available service codes (exclude E1 and F1 for now)
    const getAvailableServiceCodes = () => {
        if (!midwifeData?.midwifeType?.midwifeType) return []

        const midwifeType = midwifeData.midwifeType.midwifeType.toUpperCase()
        const limits = POSTBIRTH_APPOINTMENT_LIMITS[midwifeType as keyof typeof POSTBIRTH_APPOINTMENT_LIMITS]

        if (!limits) return []

        // Return only non-class services (B1, B2 for prebirth)
        // return Object.keys(limits).filter(code => code !== 'E1')
        return Object.keys(limits)
    }

    // Check if date is available for create flow
    const isCreateDateAvailable = (date: Date, serviceCode: string): boolean => {
        if (!midwifeData?.identity?.timetable) return false
        const dayName = DAY_NAMES[getDay(date)]
        const daySlots = midwifeData.identity.timetable[dayName]
        if (!daySlots?.slots?.[serviceCode]) return false
        return daySlots.slots[serviceCode].length > 0
    }

    // Get available time slots for create flow
    const getCreateAvailableTimeSlots = (date: Date, serviceCode: string): TimeSlot[] => {
        if (!midwifeData?.identity?.timetable) return []
        const dayName = DAY_NAMES[getDay(date)]
        const daySlots = midwifeData.identity.timetable[dayName]
        if (!daySlots?.slots?.[serviceCode]) return []
        return daySlots.slots[serviceCode] || []
    }

    // Generate calendar days for create modal
    const generateCreateCalendarDays = () => {
        const monthStart = startOfMonth(createCalendarDate)
        const monthEnd = endOfMonth(createCalendarDate)
        const startDate = startOfWeek(monthStart)
        const endDate = endOfWeek(monthEnd)
        return eachDayOfInterval({ start: startDate, end: endDate })
    }

    const goToCreatePreviousMonth = () => setCreateCalendarDate(subMonths(createCalendarDate, 1))
    const goToCreateNextMonth = () => setCreateCalendarDate(addMonths(createCalendarDate, 1))

    // Handle service selection
    const handleServiceSelect = (serviceCode: string) => {
        setSelectedServiceCode(serviceCode)

        // Check if it's E1 or F1 (class-based service)
        if (serviceCode === 'E1' || serviceCode === 'F1') {
            // Check if client already has appointments for this service
            const hasExistingClass = transformedAppointments.some(apt => apt.typeCode === serviceCode)

            if (hasExistingClass) {
                // Show warning and don't proceed
                toast.error(`Client is already enrolled in a ${serviceCode} class. Please delete existing ${serviceCode} appointments first to change class.`)
                return
            }

            // Proceed to year selection
            setCreateClassStep("selectYear")
        } else {
            // Regular appointment flow
            setCreateStep("selectDate")
        }
    }

    // Handle date selection in create flow
    const handleCreateDateSelect = (date: Date) => {
        if (!selectedServiceCode) return
        const isPast = date < new Date()
        const isAvailable = isCreateDateAvailable(date, selectedServiceCode)
        if (!isPast && isAvailable) {
            setCreateSelectedDate(date)
        }
    }

    // Handle next to time selection
    const handleCreateNextToTime = () => {
        if (!createSelectedDate) {
            toast.error("Please select a date first")
            return
        }
        setCreateStep("selectTime")
    }

    // Handle time slot selection
    const handleCreateTimeSlotSelect = (timeSlot: TimeSlot) => {
        setCreateSelectedTimeSlot(timeSlot)

        setShowCustomTimeOption(false)
        setCustomStartTime("")
        setCustomEndTime("")
    }

    // Handle back button
    const handleCreateBackToDate = () => {
        setCreateStep("selectDate")
        setCreateSelectedTimeSlot(null)
    }

    const handleCreateBackToService = () => {
        setCreateStep("selectService")
        setCreateSelectedDate(null)
        setCreateSelectedTimeSlot(null)
    }

    // Handle create appointment
    const handleCreateAppointment = async () => {
        if (showCustomTimeOption) {
            if (!customStartTime || !customEndTime || !createSelectedDate) {
                toast.error("Please select start time for custom slot")
                return
            }

            if (!isCustomTimeValid(customStartTime, customEndTime, createSelectedDate)) {
                return
            }

            setIsCreating(true)
            try {
                const payload = {
                    data: {
                        serviceCode: selectedServiceCode!,
                        clientId: approval.clientId,
                        midwifeId: approval.midwifeId,
                        // appointmentDate: format(createSelectedDate, "dd/MM/yyyy"),  
                        appointmentDate: format(customSlotDate || createSelectedDate, "dd/MM/yyyy"),
                        startTime: customStartTime,
                        endTime: customEndTime
                    }
                }

                const response = await createNewAppointmentApi(payload)
                if (!response.data.success) {
                    throw new Error(response.data.error || 'Failed to create appointment')
                }

                toast.success("Appointment created successfully!")

                const newAppointmentData = response.data.appointment
                const parsedDate = parse(newAppointmentData.appointmentDate, "dd/MM/yyyy", new Date())
                const isoDate = format(parsedDate, "yyyy-MM-dd")

                const newTransformedAppointment: TransformedAppointment = {
                    id: newAppointmentData.appointmentId,
                    type: SERVICE_NAMES[newAppointmentData.serviceCode] || newAppointmentData.serviceCode,
                    typeCode: newAppointmentData.serviceCode,
                    color: SERVICE_COLORS[newAppointmentData.serviceCode] || "bg-gray-500",
                    patient: approval.clientName,
                    date: isoDate,
                    time: newAppointmentData.startTime,
                    duration: newAppointmentData.duration,
                    status: "pending",
                    clientId: approval.clientId,
                }

                setTransformedAppointments(prev => {
                    const updated = [...prev, newTransformedAppointment]
                    updated.sort((a, b) => {
                        const dateCompare = a.date.localeCompare(b.date)
                        if (dateCompare !== 0) return dateCompare
                        return a.time.localeCompare(b.time)
                    })
                    return updated
                })

                setShowCreateModal(false)
                setCreateStep("selectService")
                setSelectedServiceCode(null)
                setCreateSelectedDate(null)
                setCreateSelectedTimeSlot(null)
                setShowCustomTimeOption(false)
                setCustomStartTime("")
                setCustomEndTime("")
                setSelectedAppointment(null)

                await fetchBookedAppointments()
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                console.error("Error creating appointment:", error)
                toast.error(error.message || "Failed to create appointment")
            } finally {
                setIsCreating(false)
            }
        } else {
            if (!selectedServiceCode || !createSelectedDate || !createSelectedTimeSlot) {
                toast.error("Please complete all steps")
                return
            }

            setIsCreating(true)
            try {
                const payload = {
                    data: {
                        serviceCode: selectedServiceCode,
                        clientId: approval.clientId,
                        midwifeId: approval.midwifeId,
                        appointmentDate: format(createSelectedDate, "dd/MM/yyyy"),
                        startTime: createSelectedTimeSlot.startTime,
                        endTime: createSelectedTimeSlot.endTime
                    }
                }

                const response = await createNewAppointmentApi(payload)
                if (!response.data.success) {
                    throw new Error(response.data.error || 'Failed to create appointment')
                }

                toast.success("Appointment created successfully!")

                const newAppointmentData = response.data.appointment
                const parsedDate = parse(newAppointmentData.appointmentDate, "dd/MM/yyyy", new Date())
                const isoDate = format(parsedDate, "yyyy-MM-dd")

                const newTransformedAppointment: TransformedAppointment = {
                    id: newAppointmentData.appointmentId,
                    type: SERVICE_NAMES[newAppointmentData.serviceCode] || newAppointmentData.serviceCode,
                    typeCode: newAppointmentData.serviceCode,
                    color: SERVICE_COLORS[newAppointmentData.serviceCode] || "bg-gray-500",
                    patient: approval.clientName,
                    date: isoDate,
                    time: newAppointmentData.startTime,
                    duration: newAppointmentData.duration,
                    status: "pending",
                    clientId: approval.clientId,
                }

                setTransformedAppointments(prev => {
                    const updated = [...prev, newTransformedAppointment]
                    updated.sort((a, b) => {
                        const dateCompare = a.date.localeCompare(b.date)
                        if (dateCompare !== 0) return dateCompare
                        return a.time.localeCompare(b.time)
                    })
                    return updated
                })

                setShowCreateModal(false)
                setCreateStep("selectService")
                setSelectedServiceCode(null)
                setCreateSelectedDate(null)
                setCreateSelectedTimeSlot(null)
                // setSelectedAppointment(null)

                await fetchBookedAppointments()
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (error: any) {
                console.error("Error creating appointment:", error)
                toast.error(error.message || "Failed to create appointment")
            } finally {
                setIsCreating(false)
            }
        }
    }

    // Get available years (current and next)
    const getAvailableYears = () => {
        const currentYear = new Date().getFullYear()
        return [currentYear.toString(), (currentYear + 1).toString()]
    }

    // Handle year selection
    const handleYearSelect = (year: string) => {
        setSelectedYear(year)
        setCreateClassStep("selectClass")
    }

    // Handle class selection
    const handleClassSelect = (className: string) => {
        setSelectedClass(className)
    }

    // Handle back to year selection
    const handleBackToYear = () => {
        setCreateClassStep("selectYear")
        setSelectedClass(null)
    }

    // Handle assign class
    const handleAssignClass = async () => {
        if (!selectedServiceCode || !selectedYear || !selectedClass || !midwifeData?.identity?.timetable) {
            toast.error("Please complete all selections")
            return
        }

        setIsAssigningClass(true)
        try {
            const payload = {
                data: {
                    serviceCode: selectedServiceCode,
                    midwifeId: approval.midwifeId,
                    clientId: approval.clientId,
                    year: selectedYear,
                    class: selectedClass,
                    timetable: midwifeData.identity.timetable
                }
            }

            console.log("Assigning class with payload:", payload)
            const response = await assignClassesToClientApi(payload)

            if (!response.data.success) {
                throw new Error(response.data.error || 'Failed to assign class')
            }

            toast.success(`Successfully enrolled in ${selectedServiceCode} ${selectedClass}!`)

            // Transform and add all appointments from the response
            const appointmentsArray = response.data.data.appointments

            if (Array.isArray(appointmentsArray)) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const newAppointments: TransformedAppointment[] = appointmentsArray.map((apt: any) => {
                    const parsedDate = parse(apt.appointmentDate, "dd/MM/yyyy", new Date())
                    const isoDate = format(parsedDate, "yyyy-MM-dd")

                    return {
                        id: apt.appointmentId,
                        type: SERVICE_NAMES[selectedServiceCode] || selectedServiceCode,
                        typeCode: selectedServiceCode,
                        color: SERVICE_COLORS[selectedServiceCode] || "bg-gray-500",
                        patient: approval.clientName,
                        date: isoDate,
                        time: apt.startTime,
                        duration: apt.duration,
                        status: apt.status,
                        classNo: apt.classNo,
                        clientId: approval.clientId,
                        classId: apt.classId
                    }
                })

                // Add all new appointments and sort
                setTransformedAppointments(prev => {
                    const updated = [...prev, ...newAppointments]
                    updated.sort((a, b) => {
                        const dateCompare = a.date.localeCompare(b.date)
                        if (dateCompare !== 0) return dateCompare
                        return a.time.localeCompare(b.time)
                    })
                    return updated
                })
            }

            // Close modal and reset
            setShowCreateModal(false)
            setCreateStep("selectService")
            setCreateClassStep("checkExisting")
            setSelectedServiceCode(null)
            setSelectedYear(null)
            setSelectedClass(null)

            // Refresh booked appointments
            await fetchBookedAppointments()

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error("Error assigning class:", error)
            toast.error(error.message || "Failed to assign class")
        } finally {
            setIsAssigningClass(false)
        }
    }

    // Get duration for a service code
    const getServiceDuration = (serviceCode: string): number => {
        const service = SERVICES_DURATIONS.find(s => s.id === serviceCode)
        return service ? service.duration : 60
    }

    // Generate time options in 15-minute intervals
    const generateTimeOptions = (): string[] => {
        const times: string[] = []
        for (let hour = 0; hour < 24; hour++) {
            for (let minute = 0; minute < 60; minute += 15) {
                const h = hour.toString().padStart(2, '0')
                const m = minute.toString().padStart(2, '0')
                times.push(`${h}:${m}`)
            }
        }
        return times
    }

    // Calculate end time based on start time and duration
    const calculateEndTime = (startTime: string, durationMinutes: number): string => {
        const [hours, minutes] = startTime.split(':').map(Number)
        const totalMinutes = hours * 60 + minutes + durationMinutes
        const endHours = Math.floor(totalMinutes / 60) % 24
        const endMinutes = totalMinutes % 60
        return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`
    }

    // Find available time ranges on a specific date
    const findAvailableTimeRanges = (date: Date): string[] => {
        if (!midwifeData?.identity?.timetable) return []

        const dayName = DAY_NAMES[getDay(date)]
        const daySlots = midwifeData.identity.timetable[dayName]

        if (!daySlots?.slots) return ["00:00 - 23:59 available"]

        const busySlots: { start: number; end: number }[] = []

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Object.values(daySlots.slots).forEach((serviceSlots: any) => {
            if (Array.isArray(serviceSlots)) {
                serviceSlots.forEach((slot: TimeSlot) => {
                    busySlots.push({
                        start: parseTime(slot.startTime),
                        end: parseTime(slot.endTime)
                    })
                })
            }
        })

        const dateStr = format(date, "dd/MM/yyyy")
        const monthYear = format(date, "M/yyyy")

        if (bookedAppointmentsData && bookedAppointmentsData[monthYear]) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            Object.values(bookedAppointmentsData[monthYear]).forEach((appointments: any) => {
                if (Array.isArray(appointments)) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    appointments.forEach((apt: any) => {
                        if (apt.appointmentDate === dateStr) {
                            busySlots.push({
                                start: parseTime(apt.startTime),
                                end: parseTime(apt.endTime)
                            })
                        }
                    })
                }
            })
        }

        const isoDateStr = format(date, "yyyy-MM-dd")
        transformedAppointments.forEach(apt => {
            if (apt.date === isoDateStr) {
                const duration = getServiceDuration(apt.typeCode)
                const endTime = calculateEndTime(apt.time, duration)
                busySlots.push({
                    start: parseTime(apt.time),
                    end: parseTime(endTime)
                })
            }
        })

        busySlots.sort((a, b) => a.start - b.start)
        const mergedBusy: { start: number; end: number }[] = []

        busySlots.forEach(slot => {
            if (mergedBusy.length === 0) {
                mergedBusy.push(slot)
            } else {
                const last = mergedBusy[mergedBusy.length - 1]
                if (slot.start <= last.end) {
                    last.end = Math.max(last.end, slot.end)
                } else {
                    mergedBusy.push(slot)
                }
            }
        })

        const freeRanges: string[] = []
        let currentTime = 0

        mergedBusy.forEach(busy => {
            if (currentTime < busy.start) {
                const startHour = Math.floor(currentTime / 60)
                const startMin = currentTime % 60
                const endHour = Math.floor(busy.start / 60)
                const endMin = busy.start % 60

                freeRanges.push(
                    `${startHour.toString().padStart(2, '0')}:${startMin.toString().padStart(2, '0')} - ${endHour.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')} available`
                )
            }
            currentTime = busy.end
        })

        if (currentTime < 24 * 60) {
            const startHour = Math.floor(currentTime / 60)
            const startMin = currentTime % 60
            freeRanges.push(
                `${startHour.toString().padStart(2, '0')}:${startMin.toString().padStart(2, '0')} - 23:59 available`
            )
        }

        return freeRanges.length > 0 ? freeRanges : ["No free time available"]
    }

    // Validate custom time slot
    const isCustomTimeValid = (startTime: string, endTime: string, date: Date): boolean => {
        const startMinutes = parseTime(startTime)
        const endMinutes = parseTime(endTime)

        if (endMinutes <= startMinutes) {
            toast.error("End time must be after start time")
            return false
        }

        const ranges = findAvailableTimeRanges(date)

        if (ranges[0] === "No free time available") {
            toast.error("No free time available on this date")
            return false
        }

        for (const range of ranges) {
            const match = range.match(/(\d{2}):(\d{2}) - (\d{2}):(\d{2})/)
            if (match) {
                const rangeStart = parseInt(match[1]) * 60 + parseInt(match[2])
                const rangeEnd = parseInt(match[3]) * 60 + parseInt(match[4])

                if (startMinutes >= rangeStart && endMinutes <= rangeEnd) {
                    return true
                }
            }
        }

        toast.error("Selected time is not within available time ranges")
        return false
    }

    return (
        <div className="container mx-auto bg-white p-6 rounded-lg">
            <Button variant="ghost" onClick={onBack} className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Pending Approvals
            </Button>
            <div className="mb-6 flex gap-6">
                {/* Left Side - Client Info */}
                <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2">Client Postbirth Pending Appointments</h2>
                    <div className="text-sm text-gray-600 space-y-1">
                        <p><span className="font-medium">Client:</span> {approval.clientName}</p>
                        <p><span className="font-medium">Midwife:</span> {approval.midwifeName}</p>
                        <p><span className="font-medium">Total Appointments:</span> {approval.totalAppointments}</p>
                        <p>
                            <span className="font-medium">Status:</span>{" "}
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">{approval.bookingStatus}</span>
                        </p>
                        <p>
                            <span className="font-medium">Appointments:</span>{" "}
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${currentTotal === expectedTotal
                                ? 'bg-green-100 text-green-800'
                                : currentTotal < expectedTotal
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                {currentTotal} / {expectedTotal}
                            </span>
                        </p>
                    </div>
                </div>

                {/* Right Side - Service Breakdown */}
                <div className="flex-1 border-l pl-6">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-semibold">Service Breakdown</h3>
                        <Button
                            size="sm"
                            onClick={() => {
                                setShowCreateModal(true)
                                setCreateStep("selectService")
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            + Add Appointment
                        </Button>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {Object.entries(getServiceBreakdown()).map(([serviceCode, counts]) => (
                            <div
                                key={serviceCode}
                                className={`px-3 py-2 rounded-md border-2 ${counts.current === counts.expected
                                    ? 'bg-green-50 border-green-300'
                                    : counts.current < counts.expected
                                        ? 'bg-yellow-50 border-yellow-300'
                                        : 'bg-red-50 border-red-300'
                                    }`}
                            >
                                <div className="text-xs font-medium text-gray-600">{serviceCode}</div>
                                <div className={`text-sm font-bold ${counts.current === counts.expected
                                    ? 'text-green-700'
                                    : counts.current < counts.expected
                                        ? 'text-yellow-700'
                                        : 'text-red-700'
                                    }`}>
                                    {counts.current} / {counts.expected}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center mb-4">
                <div className="flex gap-2 border rounded-lg p-1">
                    <Button
                        variant={viewMode === "calendar" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("calendar")}
                        className="flex items-center gap-2"
                    >
                        <Calendar className="h-4 w-4" />
                        Calendar View
                    </Button>
                    <Button
                        variant={viewMode === "list" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("list")}
                        className="flex items-center gap-2"
                    >
                        <List className="h-4 w-4" />
                        List View
                    </Button>
                </div>
            </div>

            {loadingBookedAppointments && (
                <div className="text-sm text-blue-600 mb-4">Loading other appointments...</div>
            )}

            {viewMode === "calendar" && (
                <div className="border rounded-md overflow-hidden">
                    <div className="p-4 border-b flex flex-col md:flex-row justify-between items-center gap-4">
                        <h3 className="text-lg font-semibold">Appointments Calendar</h3>
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex gap-2">
                                <button className="px-3 py-1 text-sm border rounded hover:bg-gray-100" onClick={goToPreviousMonth}>
                                    <ChevronLeft className="h-4 w-4" />
                                </button>
                                <button className="px-3 py-1 text-sm border rounded bg-gray-100" onClick={goToToday}>
                                    Today
                                </button>
                                <button className="px-3 py-1 text-sm border rounded hover:bg-gray-100" onClick={goToNextMonth}>
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                            <span className="font-medium">{format(currentDate, "MMMM yyyy")}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 text-center border-b">
                        <div className="p-2 border-r font-medium">Sun</div>
                        <div className="p-2 border-r font-medium">Mon</div>
                        <div className="p-2 border-r font-medium">Tue</div>
                        <div className="p-2 border-r font-medium">Wed</div>
                        <div className="p-2 border-r font-medium">Thu</div>
                        <div className="p-2 border-r font-medium">Fri</div>
                        <div className="p-2 font-medium">Sat</div>
                    </div>

                    <div className="grid grid-cols-7">
                        {generateCalendarDays().map((day, index) => {
                            const { currentClient, otherClients } = getAppointmentsForDay(day)
                            const isCurrentMonth = isSameMonth(day, currentDate)
                            const isToday = isSameDay(day, new Date())
                            const isWeekendDay = isWeekend(day)

                            return (
                                <div
                                    key={index}
                                    className={`min-h-[100px] border-r border-b p-1 ${isCurrentMonth ? "" : "bg-gray-50 text-gray-400"
                                        } ${isToday ? "bg-blue-50" : ""} ${isWeekendDay ? "bg-gray-100" : ""}`}
                                    style={{ borderRight: index % 7 === 6 ? "none" : undefined }}
                                >
                                    <div className={`text-right p-1 ${isToday ? "font-bold text-blue-600" : ""}`}>
                                        {format(day, "d")}
                                    </div>
                                    <div className="space-y-1 overflow-y-auto max-h-[80px]">
                                        {currentClient.map((appointment) => (
                                            <div
                                                key={appointment.id}
                                                className={`${appointment.color} text-white text-xs p-1 rounded cursor-pointer truncate hover:opacity-90`}
                                                onClick={() => setSelectedAppointment(appointment)}
                                                title={`${appointment.typeCode} - ${appointment.type}`}
                                            >
                                                {appointment.typeCode} - {appointment.time}
                                            </div>
                                        ))}
                                        {otherClients.map((appointment) => (
                                            <div
                                                key={appointment.id}
                                                // className={`${appointment.color} text-white text-xs p-1 rounded cursor-pointer truncate opacity-60 hover:opacity-80`} 
                                                className={`border-2 ${SERVICE_BORDER_COLORS[appointment.typeCode] || 'border-gray-400'} bg-white text-gray-700 text-xs p-1 rounded cursor-pointer truncate hover:bg-gray-50`}
                                                onClick={() => setSelectedOtherClientAppointment(appointment)}
                                                title={`${appointment.typeCode} - Booked by another client`}
                                            >
                                                {appointment.typeCode} - {appointment.time}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {viewMode === "list" && (
                <div className="border rounded-md overflow-hidden">
                    <div className="p-4 border-b flex flex-col md:flex-row justify-between items-center gap-4">
                        <div>
                            <h3 className="text-lg font-semibold">Appointments List</h3>
                            <p className="text-sm text-gray-600 mt-1">
                                {monthAppointments.length} appointment{monthAppointments.length !== 1 ? "s" : ""} in{" "}
                                {format(currentDate, "MMMM yyyy")}
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex gap-2">
                                <button className="px-3 py-1 text-sm border rounded hover:bg-gray-100" onClick={goToPreviousMonth}>
                                    <ChevronLeft className="h-4 w-4" />
                                </button>
                                <button className="px-3 py-1 text-sm border rounded bg-gray-100" onClick={goToToday}>
                                    Today
                                </button>
                                <button className="px-3 py-1 text-sm border rounded hover:bg-gray-100" onClick={goToNextMonth}>
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                            <span className="font-medium">{format(currentDate, "MMMM yyyy")}</span>
                        </div>
                    </div>

                    <div className="max-h-[600px] overflow-y-auto">
                        {monthAppointments.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                <p>No appointments scheduled for {format(currentDate, "MMMM yyyy")}</p>
                            </div>
                        ) : (
                            groupAppointmentsByDate().map(({ date, appointments: dayAppointments }) => (
                                <div key={date} className="border-b last:border-b-0">
                                    <div className="bg-gray-50 px-4 py-3 border-b">
                                        <h4 className="font-semibold text-gray-800">{format(parseISO(date), "EEEE, MMMM d, yyyy")}</h4>
                                        <span className="text-sm text-gray-600">
                                            {dayAppointments.length} appointment{dayAppointments.length !== 1 ? "s" : ""}
                                        </span>
                                    </div>

                                    <div className="space-y-0">
                                        {dayAppointments.map((appointment) => (
                                            <div
                                                key={appointment.id}
                                                className="p-4 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 transition-colors"
                                                onClick={() => setSelectedAppointment(appointment)}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`w-4 h-4 rounded ${appointment.color}`}></div>
                                                        <div>
                                                            <div className="font-medium text-gray-900">
                                                                {appointment.typeCode} - {appointment.type}
                                                            </div>
                                                            <div className="text-sm text-gray-600">
                                                                Status: <span className="capitalize">{appointment.status}</span>
                                                                {appointment.classNo && ` • Class: ${appointment.classNo}`}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-medium text-gray-900">{appointment.time}</div>
                                                        <div className="text-sm text-gray-600">{appointment.duration} min</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2">
                <div className="flex items-center gap-1 text-xs">
                    <div className="w-3 h-3 bg-red-600 rounded"></div>
                    <span>C1 - Early Care Visit</span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                    <div className="w-3 h-3 bg-orange-500 rounded"></div>
                    <span>C2 - Early Care Video</span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                    <div className="w-3 h-3 bg-yellow-600 rounded"></div>
                    <span>D1 - Late Care Visit</span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                    <div className="w-3 h-3 bg-amber-500 rounded"></div>
                    <span>D2 - Late Care Video</span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                    <div className="w-3 h-3 bg-purple-700 rounded"></div>
                    <span>F1 - After Birth Gym</span>
                </div>
            </div>

            <div className="flex justify-between pt-6">
                <Button type="button" variant="outline" onClick={onBack}>
                    Back
                </Button>
                {!allAppointmentsActive && (
                    <Button
                        type="button"
                        onClick={handleApproveAll}
                        disabled={isApproving}
                        className="bg-green-600 hover:bg-green-700 text-white"
                    >
                        {isApproving ? "Approving..." : "Approve All Appointments"}
                    </Button>
                )}
            </div>

            {selectedAppointment && !showEditModal && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                    <div className="bg-white rounded-md shadow-lg w-full max-w-md relative">
                        <button
                            onClick={() => setSelectedAppointment(null)}
                            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
                        >
                            <X size={20} />
                        </button>

                        <div className="p-6">
                            {/* <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-700">
                                    {selectedAppointment.typeCode} - {selectedAppointment.type}
                                </h3>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleEditClick(selectedAppointment)}
                                    className="flex items-center gap-2"
                                >
                                    <Edit2 className="h-4 w-4" />
                                    Edit
                                </Button>
                            </div> */}

                            <div className="space-y-3">
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="font-medium">Patient:</div>
                                    <div className="col-span-2">{selectedAppointment.patient}</div>
                                </div>

                                <div className="grid grid-cols-3 gap-2">
                                    <div className="font-medium">Date:</div>
                                    <div className="col-span-2">
                                        {format(parseISO(selectedAppointment.date), "EEEE, MMMM d, yyyy")}
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-2">
                                    <div className="font-medium">Time:</div>
                                    <div className="col-span-2">{selectedAppointment.time}</div>
                                </div>

                                <div className="grid grid-cols-3 gap-2">
                                    <div className="font-medium">Duration:</div>
                                    <div className="col-span-2">{selectedAppointment.duration} minutes</div>
                                </div>

                                <div className="grid grid-cols-3 gap-2">
                                    <div className="font-medium">Status:</div>
                                    <div className="col-span-2">
                                        <span className={`px-2 py-1 rounded text-xs capitalize ${selectedAppointment.status === 'active'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {selectedAppointment.status}
                                        </span>
                                    </div>
                                </div>

                                {selectedAppointment.classNo && (
                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="font-medium">Class No:</div>
                                        <div className="col-span-2">{selectedAppointment.classNo}</div>
                                    </div>
                                )}

                                <div className="grid grid-cols-3 gap-2">
                                    <div className="font-medium">Midwife:</div>
                                    <div className="col-span-2">{approval.midwifeName}</div>
                                </div>
                                <div className={`flex ${selectedAppointment.typeCode === 'F1' ? 'justify-end' : 'justify-between'} items-center mt-6 pt-4 border-t`}>
                                    <Button
                                        variant="outline"
                                        onClick={() => handleDeleteClick(selectedAppointment)}
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-300"
                                    >
                                        Delete
                                    </Button>
                                    {selectedAppointment.typeCode !== 'F1' && (
                                        <Button
                                            variant="default"
                                            onClick={() => handleEditClick(selectedAppointment)}
                                        >
                                            <Edit2 className="h-4 w-4 mr-2" />
                                            Edit
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showDeleteConfirm && deletingAppointment && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Deletion</h3>
                        <p className="text-gray-600 mb-4">
                            {deletingAppointment.typeCode === 'F1'
                                ? 'Are you sure you want to remove the client from this F1 class? This will remove all F1 appointments.'
                                : 'Are you sure you want to delete this appointment?'
                            }
                        </p>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                            <p className="text-sm text-red-800 font-medium">
                                {deletingAppointment.typeCode} - {deletingAppointment.type}
                            </p>
                            <p className="text-sm text-red-700 mt-1">
                                {format(parseISO(deletingAppointment.date), "EEEE, MMMM d, yyyy")} at {deletingAppointment.time}
                            </p>
                            {deletingAppointment.classNo && (
                                <p className="text-sm text-red-700 mt-1">
                                    Class: {deletingAppointment.classNo}
                                </p>
                            )}
                        </div>
                        <p className="text-sm text-gray-600 mb-6">This action cannot be undone.</p>
                        <div className="flex justify-end gap-3">
                            <Button variant="outline" onClick={handleCancelDelete} disabled={isDeleting}>
                                Cancel
                            </Button>
                            <Button onClick={handleConfirmDelete} disabled={isDeleting} className="bg-red-600 hover:bg-red-700 text-white">
                                {isDeleting ? "Processing..." : deletingAppointment.typeCode === 'E1' ? "Remove from Class" : "Delete Appointment"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
            {selectedOtherClientAppointment && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                    <div className="bg-white rounded-md shadow-lg w-full max-w-md relative">
                        <button
                            onClick={() => setSelectedOtherClientAppointment(null)}
                            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
                        >
                            <X size={20} />
                        </button>
                        <div className="p-6">
                            <div className="bg-blue-50 border-l-4 border-blue-500 p-3 mb-4">
                                <p className="text-sm text-blue-800 font-medium">
                                    This appointment is booked by another client
                                </p>
                            </div>

                            <h3 className="text-lg font-semibold mb-4 text-gray-700">
                                {selectedOtherClientAppointment.typeCode} - {selectedOtherClientAppointment.type}
                            </h3>

                            <div className="space-y-3">
                                <div className="grid grid-cols-3 gap-2">
                                    <div className="font-medium">Date:</div>
                                    <div className="col-span-2">
                                        {format(parseISO(selectedOtherClientAppointment.date), "EEEE, MMMM d, yyyy")}
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-2">
                                    <div className="font-medium">Time:</div>
                                    <div className="col-span-2">{selectedOtherClientAppointment.time}</div>
                                </div>

                                <div className="grid grid-cols-3 gap-2">
                                    <div className="font-medium">Duration:</div>
                                    <div className="col-span-2">{selectedOtherClientAppointment.duration} minutes</div>
                                </div>

                                {/* <div className="grid grid-cols-3 gap-2">
                                    <div className="font-medium">Status:</div>
                                    <div className="col-span-2">
                                        <span className="px-2 py-1 rounded text-xs capitalize bg-gray-100 text-gray-800">
                                            Booked
                                        </span>
                                    </div>
                                </div> */}

                                {selectedOtherClientAppointment.classNo && (
                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="font-medium">Class No:</div>
                                        <div className="col-span-2">{selectedOtherClientAppointment.classNo}</div>
                                    </div>
                                )}

                                <div className="grid grid-cols-3 gap-2">
                                    <div className="font-medium">Midwife:</div>
                                    <div className="col-span-2">{approval.midwifeName}</div>
                                </div>
                            </div>

                            <div className="flex justify-end mt-6 pt-4 border-t">
                                <Button
                                    variant="default"
                                    onClick={() => setSelectedOtherClientAppointment(null)}
                                >
                                    Close
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showEditModal && editingAppointment && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between z-10">
                            <div>
                                <h3 className="text-xl font-semibold">
                                    {editStep === "selectDate" ? "Step 1: Select Date" : "Step 2: Select Time Slot"}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    {editingAppointment.typeCode} - {editingAppointment.type}
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    setShowEditModal(false)
                                    setEditingAppointment(null)
                                    setEditStep("selectDate")
                                    setSelectedDate(null)
                                    setSelectedTimeSlot(null)

                                    setShowCustomTimeOption(false)
                                    setCustomStartTime("")
                                    setCustomEndTime("")
                                }}
                                className="text-gray-500 hover:text-gray-700"
                                disabled={isUpdating}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6">
                            {loadingMidwife ? (
                                <div className="text-center py-12">
                                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
                                    <p className="mt-4 text-gray-600">Loading midwife availability...</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <h4 className="font-medium text-blue-900 mb-2">Current Appointment Details</h4>
                                        <div className="text-sm text-blue-800 space-y-1">
                                            <p><span className="font-semibold">Date:</span> {format(parseISO(editingAppointment.date), "EEEE, MMMM d, yyyy")}</p>
                                            <p><span className="font-semibold">Time:</span> {editingAppointment.time}</p>
                                            <p><span className="font-semibold">Duration:</span> {editingAppointment.duration} minutes</p>
                                        </div>
                                    </div>

                                    {editStep === "selectDate" && (
                                        <>
                                            <div className="border rounded-lg overflow-hidden">
                                                <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
                                                    <div>
                                                        <h4 className="font-semibold text-lg">Select a Date</h4>
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            Click on any available date
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={goToEditPreviousMonth}
                                                            className="p-2 hover:bg-gray-200 rounded transition-colors"
                                                        >
                                                            <ChevronLeft className="h-5 w-5" />
                                                        </button>
                                                        <span className="font-medium min-w-[150px] text-center">
                                                            {format(editCalendarDate, "MMMM yyyy")}
                                                        </span>
                                                        <button
                                                            onClick={goToEditNextMonth}
                                                            className="p-2 hover:bg-gray-200 rounded transition-colors"
                                                        >
                                                            <ChevronRight className="h-5 w-5" />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-7 text-center border-b bg-gray-100">
                                                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                                                        <div key={day} className="p-3 font-medium text-sm border-r last:border-r-0">
                                                            {day}
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="grid grid-cols-7">
                                                    {generateEditCalendarDays().map((day, index) => {
                                                        const isCurrentMonth = isSameMonth(day, editCalendarDate)
                                                        const isAvailable = isDateAvailable(day, editingAppointment.typeCode)
                                                        const isPast = day < new Date()
                                                        const isSelected = selectedDate && isSameDay(day, selectedDate)

                                                        return (
                                                            <button
                                                                key={index}
                                                                onClick={() => handleDateSelect(day)}
                                                                disabled={!isAvailable || isPast}
                                                                className={`
                                                                    min-h-[80px] p-2 border-r border-b text-center transition-all
                                                                    ${!isCurrentMonth ? "bg-gray-50 text-gray-400" : ""}
                                                                    ${isAvailable && !isPast ? "hover:bg-blue-100 cursor-pointer" : ""}
                                                                    ${!isAvailable || isPast ? "cursor-not-allowed opacity-40" : ""}
                                                                    ${isSelected ? "bg-blue-500 text-white font-bold ring-2 ring-blue-600" : ""}
                                                                    ${index % 7 === 6 ? "border-r-0" : ""}
                                                                `}
                                                            >
                                                                <div className="text-lg">{format(day, "d")}</div>
                                                            </button>
                                                        )
                                                    })}
                                                </div>
                                            </div>

                                            {selectedDate && (
                                                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                                    <p className="text-green-800 font-medium">
                                                        Selected Date: {format(selectedDate, "EEEE, MMMM d, yyyy")}
                                                    </p>
                                                </div>
                                            )}

                                            <div className="flex justify-between items-center pt-4 border-t">
                                                <Button
                                                    variant="outline"
                                                    onClick={() => {
                                                        setShowEditModal(false)
                                                        setEditingAppointment(null)
                                                        setEditStep("selectDate")
                                                        setSelectedDate(null)
                                                    }}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    onClick={handleNextToTimeSelection}
                                                    disabled={!selectedDate}
                                                    className="bg-blue-600 hover:bg-blue-700"
                                                >
                                                    Next: Select Time
                                                </Button>
                                            </div>
                                        </>
                                    )}

                                    {editStep === "selectTime" && selectedDate && (
                                        <>
                                            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                                <p className="text-green-800 font-medium">
                                                    Selected Date: {format(selectedDate, "EEEE, MMMM d, yyyy")}
                                                </p>
                                            </div>

                                            <div className="border rounded-lg p-6">
                                                <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                                    <Clock className="h-5 w-5" />
                                                    Available Time Slots
                                                </h4>

                                                {getAvailableTimeSlots(selectedDate, editingAppointment.typeCode).length === 0 ? (
                                                    <p className="text-center text-gray-500 py-8">No time slots available for this date</p>
                                                ) : (
                                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                                        {getAvailableTimeSlots(selectedDate, editingAppointment.typeCode).map((slot, idx) => {
                                                            const isBooked = isTimeSlotBooked(selectedDate, slot)
                                                            const isSelectedSlot = selectedTimeSlot?.startTime === slot.startTime

                                                            return (
                                                                <button
                                                                    key={idx}
                                                                    onClick={() => !isBooked && handleTimeSlotSelect(slot)}
                                                                    disabled={isBooked}
                                                                    className={`
                                                                        p-4 border-2 rounded-lg text-center transition-all font-medium
                                                                        ${isBooked
                                                                            ? "bg-gray-200 text-gray-500 cursor-not-allowed opacity-50 border-gray-300"
                                                                            : isSelectedSlot
                                                                                ? "bg-blue-500 text-white border-blue-600 ring-2 ring-blue-400"
                                                                                : "hover:bg-blue-50 hover:border-blue-300 border-gray-300"
                                                                        }
                                                                    `}
                                                                    title={isBooked ? "This time slot is already booked" : ""}
                                                                >
                                                                    <div className="text-base">
                                                                        {slot.startTime}
                                                                    </div>
                                                                    <div className="text-xs mt-1 opacity-80">
                                                                        to {slot.endTime}
                                                                    </div>
                                                                    {isBooked && (
                                                                        <div className="text-xs mt-1 font-semibold">
                                                                            Booked
                                                                        </div>
                                                                    )}
                                                                </button>
                                                            )
                                                        })}
                                                    </div>
                                                )}
                                            </div>

                                            {selectedTimeSlot && (
                                                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                                    <p className="text-green-800 font-medium">
                                                        Selected Time: {selectedTimeSlot.startTime} - {selectedTimeSlot.endTime}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Custom Time Slot Option - EDIT */}
                                            <div className="mt-6 pt-6 border-t">
                                                <button
                                                    onClick={() => {
                                                        const newState = !showCustomTimeOption;
                                                        setShowCustomTimeOption(newState);

                                                        if (newState) {
                                                            setSelectedTimeSlot(null);
                                                            setCustomSlotDate(selectedDate); // ADD THIS LINE
                                                            const ranges = findAvailableTimeRanges(selectedDate);
                                                            setAvailableTimeRanges(ranges);
                                                        } else {
                                                            setCustomStartTime("");
                                                            setCustomEndTime("");
                                                            setCustomSlotDate(null); // ADD THIS LINE
                                                        }
                                                    }}
                                                    className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
                                                >
                                                    {showCustomTimeOption ? "- Hide" : "+ Book"} custom time slot
                                                </button>

                                                {showCustomTimeOption && (
                                                    <div className="mt-4 p-4 border-2 border-blue-200 rounded-lg bg-blue-50">
                                                        <h5 className="font-semibold text-gray-900 mb-3">Custom Time Slot</h5>

                                                        {/* NEW: Date Selection Dropdown */}
                                                        <div className="mb-4">
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                Select Date
                                                            </label>
                                                            <select
                                                                value={customSlotDate ? format(customSlotDate, "yyyy-MM-dd") : ""}
                                                                onChange={(e) => {
                                                                    const newDate = new Date(e.target.value)
                                                                    handleCustomDateChange(newDate)
                                                                }}
                                                                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                                                            >
                                                                {editingAppointment && generateAvailableDates(editingAppointment.typeCode).map((date) => (
                                                                    <option
                                                                        key={format(date, "yyyy-MM-dd")}
                                                                        value={format(date, "yyyy-MM-dd")}
                                                                    >
                                                                        {format(date, "EEEE, MMMM d, yyyy")}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>

                                                        <div className="mb-4 p-3 bg-white rounded border">
                                                            <p className="text-sm font-medium text-gray-700 mb-2">
                                                                Available Time for {customSlotDate ? format(customSlotDate, "MMM d, yyyy") : "Selected Date"}:
                                                            </p>
                                                            <div className="space-y-1">
                                                                {availableTimeRanges.map((range, idx) => (
                                                                    <p key={idx} className="text-sm text-green-700">{range}</p>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        <div className="mb-3">
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                                                            <select
                                                                value={customStartTime}
                                                                onChange={(e) => {
                                                                    const start = e.target.value
                                                                    setCustomStartTime(start)
                                                                    if (start && editingAppointment) {
                                                                        const duration = getServiceDuration(editingAppointment.typeCode)
                                                                        const end = calculateEndTime(start, duration)
                                                                        setCustomEndTime(end)
                                                                    }
                                                                }}
                                                                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                                                            >
                                                                <option value="">Select start time</option>
                                                                {generateTimeOptions().map(time => (
                                                                    <option key={time} value={time}>{time}</option>
                                                                ))}
                                                            </select>
                                                        </div>

                                                        <div className="mb-3">
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">End Time (Auto-calculated)</label>
                                                            <input
                                                                type="text"
                                                                value={customEndTime}
                                                                readOnly
                                                                className="w-full px-3 py-2 border rounded-md bg-gray-100 cursor-not-allowed"
                                                                placeholder="Will be calculated automatically"
                                                            />
                                                        </div>

                                                        {customStartTime && customEndTime && editingAppointment && (
                                                            <p className="text-sm text-gray-600 mt-2">
                                                                Duration: {getServiceDuration(editingAppointment.typeCode)} minutes
                                                            </p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex justify-between items-center pt-4 border-t">
                                                <Button
                                                    variant="outline"
                                                    onClick={handleBackToDateSelection}
                                                    disabled={isUpdating}
                                                >
                                                    Back to Date Selection
                                                </Button>
                                                <Button
                                                    onClick={handleUpdateAppointment}
                                                    // disabled={!selectedTimeSlot || isUpdating}  
                                                    disabled={
                                                        isUpdating ||
                                                        (!showCustomTimeOption && !selectedTimeSlot) ||
                                                        (showCustomTimeOption && !customStartTime)
                                                    }
                                                    className="bg-green-600 hover:bg-green-700 text-white"
                                                >
                                                    {isUpdating ? "Updating..." : "Update Appointment"}
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {/* Create Appointment Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between z-10">
                            <div>
                                <h3 className="text-xl font-semibold">
                                    {createStep === "selectService" && "Step 1: Select Service"}
                                    {createStep === "selectDate" && "Step 2: Select Date"}
                                    {createStep === "selectTime" && "Step 3: Select Time"}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">Create New Appointment</p>
                            </div>
                            <button
                                onClick={() => {
                                    setShowCreateModal(false)
                                    setCreateStep("selectService")
                                    setCreateClassStep("checkExisting")
                                    setSelectedServiceCode(null)
                                    setSelectedYear(null)
                                    setSelectedClass(null)
                                    setCreateSelectedDate(null)
                                    setCreateSelectedTimeSlot(null)
                                }}
                                className="text-gray-500 hover:text-gray-700"
                                disabled={isCreating}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="space-y-6">
                                {/* Step 1: Select Service */}
                                {createStep === "selectService" && (
                                    <>
                                        <div className="border rounded-lg p-6">
                                            <h4 className="font-semibold text-lg mb-4">Select Service Type</h4>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                {getAvailableServiceCodes().map((code) => (
                                                    <button
                                                        key={code}
                                                        onClick={() => handleServiceSelect(code)}
                                                        className="p-4 border-2 rounded-lg text-center transition-all hover:border-blue-500 hover:bg-blue-50"
                                                    >
                                                        <div className="font-semibold text-gray-900">{code}</div>
                                                        <div className="text-sm text-gray-600 mt-1">
                                                            {SERVICE_NAMES[code]}
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Step: Select Year (for E1/F1) */}
                                {createStep === "selectService" && createClassStep === "selectYear" && selectedServiceCode && (
                                    <>
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                            <p className="text-blue-900 font-medium">
                                                Selected Service: {selectedServiceCode} - {SERVICE_NAMES[selectedServiceCode]}
                                            </p>
                                        </div>

                                        <div className="border rounded-lg p-6">
                                            <h4 className="font-semibold text-lg mb-4">Select Year</h4>
                                            <div className="grid grid-cols-2 gap-4">
                                                {getAvailableYears().map((year) => (
                                                    <button
                                                        key={year}
                                                        onClick={() => handleYearSelect(year)}
                                                        className={`p-6 border-2 rounded-lg text-center transition-all hover:border-blue-500 hover:bg-blue-50 ${selectedYear === year ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                                                            }`}
                                                    >
                                                        <div className="text-2xl font-bold text-gray-900">{year}</div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center pt-4 border-t">
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    setCreateClassStep("checkExisting")
                                                    setSelectedServiceCode(null)
                                                }}
                                            >
                                                Back to Service Selection
                                            </Button>
                                        </div>
                                    </>
                                )}

                                {/* Step: Select Class (for E1/F1) */}
                                {createStep === "selectService" && createClassStep === "selectClass" && selectedServiceCode && selectedYear && (
                                    <>
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                            <p className="text-blue-900 font-medium">
                                                Selected Service: {selectedServiceCode} - {SERVICE_NAMES[selectedServiceCode]}
                                            </p>
                                            <p className="text-blue-800 text-sm mt-1">Year: {selectedYear}</p>
                                        </div>

                                        <div className="border rounded-lg p-6">
                                            <h4 className="font-semibold text-lg mb-4">Select Class</h4>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                {Object.entries(CLASS_RANGES).map(([className, range]) => (
                                                    <button
                                                        key={className}
                                                        onClick={() => handleClassSelect(className)}
                                                        className={`p-4 border-2 rounded-lg transition-all hover:border-blue-500 hover:bg-blue-50 ${selectedClass === className ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-400' : 'border-gray-300'
                                                            }`}
                                                    >
                                                        <div className="font-bold text-gray-900 mb-1">{className}</div>
                                                        <div className="text-sm text-gray-600">{range.label}</div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {selectedClass && (
                                            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                                <p className="text-green-800 font-medium">
                                                    Selected: {selectedClass} ({CLASS_RANGES[selectedClass as keyof typeof CLASS_RANGES].label})
                                                </p>
                                            </div>
                                        )}

                                        <div className="flex justify-between items-center pt-4 border-t">
                                            <Button variant="outline" onClick={handleBackToYear}>
                                                Back to Year Selection
                                            </Button>
                                            <Button
                                                onClick={handleAssignClass}
                                                disabled={!selectedClass || isAssigningClass}
                                                className="bg-green-600 hover:bg-green-700 text-white"
                                            >
                                                {isAssigningClass ? "Assigning..." : "Assign to Class"}
                                            </Button>
                                        </div>
                                    </>
                                )}

                                {/* Step 2: Select Date */}
                                {createStep === "selectDate" && selectedServiceCode && (
                                    <>
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                            <p className="text-blue-900 font-medium">
                                                Selected Service: {selectedServiceCode} - {SERVICE_NAMES[selectedServiceCode]}
                                            </p>
                                        </div>

                                        <div className="border rounded-lg overflow-hidden">
                                            <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
                                                <h4 className="font-semibold text-lg">Select a Date</h4>
                                                <div className="flex items-center gap-2">
                                                    <button onClick={goToCreatePreviousMonth} className="p-2 hover:bg-gray-200 rounded">
                                                        <ChevronLeft className="h-5 w-5" />
                                                    </button>
                                                    <span className="font-medium min-w-[150px] text-center">
                                                        {format(createCalendarDate, "MMMM yyyy")}
                                                    </span>
                                                    <button onClick={goToCreateNextMonth} className="p-2 hover:bg-gray-200 rounded">
                                                        <ChevronRight className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-7 text-center border-b bg-gray-100">
                                                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                                                    <div key={day} className="p-3 font-medium text-sm border-r last:border-r-0">{day}</div>
                                                ))}
                                            </div>

                                            <div className="grid grid-cols-7">
                                                {generateCreateCalendarDays().map((day, index) => {
                                                    const isCurrentMonth = isSameMonth(day, createCalendarDate)
                                                    const isAvailable = isCreateDateAvailable(day, selectedServiceCode)
                                                    const isPast = day < new Date()
                                                    const isSelected = createSelectedDate && isSameDay(day, createSelectedDate)

                                                    return (
                                                        <button
                                                            key={index}
                                                            onClick={() => handleCreateDateSelect(day)}
                                                            disabled={!isAvailable || isPast}
                                                            className={`
                                                    min-h-[80px] p-2 border-r border-b text-center transition-all
                                                    ${!isCurrentMonth ? "bg-gray-50 text-gray-400" : ""}
                                                    ${isAvailable && !isPast ? "hover:bg-blue-100 cursor-pointer" : ""}
                                                    ${!isAvailable || isPast ? "cursor-not-allowed opacity-40" : ""}
                                                    ${isSelected ? "bg-blue-500 text-white font-bold ring-2 ring-blue-600" : ""}
                                                    ${index % 7 === 6 ? "border-r-0" : ""}
                                                `}
                                                        >
                                                            <div className="text-lg">{format(day, "d")}</div>
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        </div>

                                        {createSelectedDate && (
                                            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                                <p className="text-green-800 font-medium">
                                                    Selected Date: {format(createSelectedDate, "EEEE, MMMM d, yyyy")}
                                                </p>
                                            </div>
                                        )}

                                        <div className="flex justify-between items-center pt-4 border-t">
                                            <Button variant="outline" onClick={handleCreateBackToService}>
                                                Back to Service Selection
                                            </Button>
                                            <Button
                                                onClick={handleCreateNextToTime}
                                                disabled={!createSelectedDate}
                                                className="bg-blue-600 hover:bg-blue-700"
                                            >
                                                Next: Select Time
                                            </Button>
                                        </div>
                                    </>
                                )}

                                {/* Step 3: Select Time */}
                                {createStep === "selectTime" && selectedServiceCode && createSelectedDate && (
                                    <>
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                            <p className="text-blue-900 font-medium">
                                                Selected Service: {selectedServiceCode} - {SERVICE_NAMES[selectedServiceCode]}
                                            </p>
                                            <p className="text-blue-800 text-sm mt-1">
                                                Date: {format(createSelectedDate, "EEEE, MMMM d, yyyy")}
                                            </p>
                                        </div>

                                        <div className="border rounded-lg p-6">
                                            <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                                <Clock className="h-5 w-5" />
                                                Available Time Slots
                                            </h4>

                                            {getCreateAvailableTimeSlots(createSelectedDate, selectedServiceCode).length === 0 ? (
                                                <p className="text-center text-gray-500 py-8">No time slots available</p>
                                            ) : (
                                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                                    {getCreateAvailableTimeSlots(createSelectedDate, selectedServiceCode).map((slot, idx) => {
                                                        const isBooked = isTimeSlotBooked(createSelectedDate, slot)
                                                        const isSelected = createSelectedTimeSlot?.startTime === slot.startTime

                                                        return (
                                                            <button
                                                                key={idx}
                                                                onClick={() => !isBooked && handleCreateTimeSlotSelect(slot)}
                                                                disabled={isBooked}
                                                                className={`
                                                        p-4 border-2 rounded-lg text-center transition-all font-medium
                                                        ${isBooked ? "bg-gray-200 text-gray-500 cursor-not-allowed opacity-50 border-gray-300" :
                                                                        isSelected ? "bg-blue-500 text-white border-blue-600 ring-2 ring-blue-400" :
                                                                            "hover:bg-blue-50 hover:border-blue-300 border-gray-300"}
                                                    `}
                                                            >
                                                                <div className="text-base">{slot.startTime}</div>
                                                                <div className="text-xs mt-1 opacity-80">to {slot.endTime}</div>
                                                                {isBooked && <div className="text-xs mt-1 font-semibold">Booked</div>}
                                                            </button>
                                                        )
                                                    })}
                                                </div>
                                            )}
                                        </div>

                                        {createSelectedTimeSlot && (
                                            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                                <p className="text-green-800 font-medium">
                                                    Selected Time: {createSelectedTimeSlot.startTime} - {createSelectedTimeSlot.endTime}
                                                </p>
                                            </div>
                                        )}

                                        {/* Custom Time Slot Option - create */}
                                        <div className="mt-6 pt-6 border-t">
                                            <button
                                                onClick={() => {
                                                    const newState = !showCustomTimeOption;
                                                    setShowCustomTimeOption(newState);

                                                    if (newState) {
                                                        setCreateSelectedTimeSlot(null);
                                                        setCustomSlotDate(createSelectedDate); // ADD THIS LINE
                                                        const ranges = findAvailableTimeRanges(createSelectedDate);
                                                        setAvailableTimeRanges(ranges);
                                                    } else {
                                                        setCustomStartTime("");
                                                        setCustomEndTime("");
                                                        setCustomSlotDate(null); // ADD THIS LINE
                                                    }
                                                }}
                                                className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
                                            >
                                                {showCustomTimeOption ? "- Hide" : "+ Book"} custom time slot
                                            </button>

                                            {showCustomTimeOption && (
                                                <div className="mt-4 p-4 border-2 border-blue-200 rounded-lg bg-blue-50">
                                                    <h5 className="font-semibold text-gray-900 mb-3">Custom Time Slot</h5>

                                                    {/* NEW: Date Selection Dropdown */}
                                                    <div className="mb-4">
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Select Date
                                                        </label>
                                                        <select
                                                            value={customSlotDate ? format(customSlotDate, "yyyy-MM-dd") : ""}
                                                            onChange={(e) => {
                                                                const newDate = new Date(e.target.value)
                                                                handleCreateCustomDateChange(newDate)
                                                            }}
                                                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                                                        >
                                                            {selectedServiceCode && generateCreateAvailableDates(selectedServiceCode).map((date) => (
                                                                <option
                                                                    key={format(date, "yyyy-MM-dd")}
                                                                    value={format(date, "yyyy-MM-dd")}
                                                                >
                                                                    {format(date, "EEEE, MMMM d, yyyy")}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    <div className="mb-4 p-3 bg-white rounded border">
                                                        <p className="text-sm font-medium text-gray-700 mb-2">
                                                            Available Time for {customSlotDate ? format(customSlotDate, "MMM d, yyyy") : "Selected Date"}:
                                                        </p>
                                                        <div className="space-y-1">
                                                            {availableTimeRanges.map((range, idx) => (
                                                                <p key={idx} className="text-sm text-green-700">{range}</p>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="mb-3">
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                                                        <select
                                                            value={customStartTime}
                                                            onChange={(e) => {
                                                                const start = e.target.value
                                                                setCustomStartTime(start)
                                                                if (start && selectedServiceCode) {
                                                                    const duration = getServiceDuration(selectedServiceCode)
                                                                    const end = calculateEndTime(start, duration)
                                                                    setCustomEndTime(end)
                                                                }
                                                            }}
                                                            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                                                        >
                                                            <option value="">Select start time</option>
                                                            {generateTimeOptions().map(time => (
                                                                <option key={time} value={time}>{time}</option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    <div className="mb-3">
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">End Time (Auto-calculated)</label>
                                                        <input
                                                            type="text"
                                                            value={customEndTime}
                                                            readOnly
                                                            className="w-full px-3 py-2 border rounded-md bg-gray-100 cursor-not-allowed"
                                                            placeholder="Will be calculated automatically"
                                                        />
                                                    </div>

                                                    {customStartTime && customEndTime && editingAppointment && (
                                                        <p className="text-sm text-gray-600 mt-2">
                                                            Duration: {getServiceDuration(editingAppointment.typeCode)} minutes
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex justify-between items-center pt-4 border-t">
                                            <Button variant="outline" onClick={handleCreateBackToDate} disabled={isCreating}>
                                                Back to Date Selection
                                            </Button>
                                            <Button
                                                onClick={handleCreateAppointment}
                                                // disabled={!createSelectedTimeSlot || isCreating}  
                                                disabled={isCreating ||
                                                    (!showCustomTimeOption && !createSelectedTimeSlot) ||
                                                    (showCustomTimeOption && !customStartTime)
                                                }
                                                className="bg-green-600 hover:bg-green-700 text-white"
                                            >
                                                {isCreating ? "Creating..." : "Create Appointment"}
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}