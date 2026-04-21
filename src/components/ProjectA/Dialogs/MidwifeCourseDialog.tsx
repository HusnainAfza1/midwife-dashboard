"use client"

import React, { useState, useEffect } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ServiceItem } from "@/types"
import { ChevronLeft, ChevronRight, Calendar, Clock, MapPin } from "lucide-react"

interface EditCourseDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    courseData: ServiceItem | null
    onSave: (updatedData: ServiceItem) => void
}

interface CourseFormData {
    // Step 1 fields
    name: string
    tagline: string
    type: string
    turnover: string

    // Step 2 fields
    duration: string
    appointments: string
    frequency: string
    frequencyPeriod: string // "per Week" or "per Month"
    maxParticipants: string
    startDate: string
    selectedDays: string[]
}

const DAYS_OF_WEEK = [
    { key: 'monday', label: 'Mon' },
    { key: 'tuesday', label: 'Tue' },
    { key: 'wednesday', label: 'Wed' },
    { key: 'thursday', label: 'Thu' },
    { key: 'friday', label: 'Fri' },
    { key: 'saturday', label: 'Sat' },
    { key: 'sunday', label: 'Sun' }
]

// Define appointment type
// Define appointment type
interface SimpleAppointment {
    id: number
    appointmentNumber: number
    date: string
    day: string
    duration: string
    type: string
    week?: number
    appointmentInWeek?: number
    month?: number
    appointmentInMonth?: number
}

// Generate appointments function - FIXED VERSION
const generateSimpleAppointments = (formData: CourseFormData): SimpleAppointment[] => {
    // Check required fields
    if (!formData.startDate || !formData.frequency || !formData.duration || !formData.appointments || formData.selectedDays.length === 0) {
        return []
    }

    const results: SimpleAppointment[] = []
    const startDate = new Date(formData.startDate)
    const totalAppointments = parseInt(formData.appointments)
    const appointmentsPerPeriod = parseInt(formData.frequency)
    const isWeekly = formData.frequencyPeriod === "per Week"

    // Day mapping with proper TypeScript typing
    const dayMap: { [key: string]: number } = {
        'sunday': 0, 'monday': 1, 'tuesday': 2, 'wednesday': 3,
        'thursday': 4, 'friday': 5, 'saturday': 6
    }

    const selectedDayNumbers = formData.selectedDays.map(day => dayMap[day]).sort((a, b) => a - b) // Sort days by week order
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

    let appointmentsCreated = 0
    let appointmentId = 1

    if (isWeekly) {
        // WEEKLY LOGIC - FIXED
        let currentWeek = 0

        while (appointmentsCreated < totalAppointments) {
            // Calculate appointments for this week - ensure exact frequency in first weeks
            const remainingAppointments = totalAppointments - appointmentsCreated
            const appointmentsThisWeek = Math.min(appointmentsPerPeriod, remainingAppointments)

            // Generate appointments for current week
            const weekAppointments: Array<{ date: Date, targetDay: number, appointmentInWeek: number }> = []

            for (let apt = 0; apt < appointmentsThisWeek; apt++) {
                const dayIndex = apt % selectedDayNumbers.length
                const targetDay = selectedDayNumbers[dayIndex]

                // Calculate base date for this week
                const weekStartDate = new Date(startDate)
                weekStartDate.setDate(startDate.getDate() + (currentWeek * 7))

                // Find the target day in this week
                const aptDate = new Date(weekStartDate)
                const currentDayOfWeek = weekStartDate.getDay()
                const daysToAdd = (targetDay - currentDayOfWeek + 7) % 7
                aptDate.setDate(weekStartDate.getDate() + daysToAdd)

                // If we need multiple appointments on same day (when frequency > selected days)
                if (apt >= selectedDayNumbers.length) {
                    const extraDays = Math.floor(apt / selectedDayNumbers.length)
                    aptDate.setDate(aptDate.getDate() + (extraDays * 7)) // Move to next week for same day
                }

                weekAppointments.push({
                    date: aptDate,
                    targetDay: targetDay,
                    appointmentInWeek: apt + 1
                })
            }

            // Sort week appointments by date and add to results
            weekAppointments.sort((a, b) => a.date.getTime() - b.date.getTime())

            weekAppointments.forEach((apt) => {
                results.push({
                    id: appointmentId,
                    appointmentNumber: appointmentId,
                    date: apt.date.toISOString().split('T')[0],
                    day: dayNames[apt.date.getDay()],
                    duration: `${formData.duration} min`,
                    type: formData.type || "In persona",
                    week: currentWeek + 1,
                    appointmentInWeek: apt.appointmentInWeek
                })

                appointmentId++
                appointmentsCreated++
            })

            currentWeek++
        }
    } else {
        // MONTHLY LOGIC - FIXED (Date-based periods, not calendar months)
        let currentMonthPeriod = 0

        while (appointmentsCreated < totalAppointments) {
            const remainingAppointments = totalAppointments - appointmentsCreated
            const appointmentsThisMonth = Math.min(appointmentsPerPeriod, remainingAppointments)

            // Generate appointments for current month period
            const monthAppointments: Array<{ date: Date, appointmentInMonth: number }> = []

            // Calculate the start and end of current month period (30-day periods from start date)
            const periodStartDate = new Date(startDate)
            periodStartDate.setDate(startDate.getDate() + (currentMonthPeriod * 30))

            const periodEndDate = new Date(periodStartDate)
            periodEndDate.setDate(periodStartDate.getDate() + 29) // 30-day period

            // Find all valid dates in this period for selected days
            const validDatesInPeriod: Date[] = []

            // Scan through the 30-day period
            for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
                const testDate = new Date(periodStartDate)
                testDate.setDate(periodStartDate.getDate() + dayOffset)

                // Check if this day is one of the selected days
                if (selectedDayNumbers.includes(testDate.getDay())) {
                    validDatesInPeriod.push(new Date(testDate))
                }
            }

            // Sort valid dates
            validDatesInPeriod.sort((a, b) => a.getTime() - b.getTime())

            // Take required number of appointments for this month period
            for (let i = 0; i < appointmentsThisMonth && i < validDatesInPeriod.length; i++) {
                const aptDate = validDatesInPeriod[i]

                monthAppointments.push({
                    date: aptDate,
                    appointmentInMonth: i + 1
                })
            }

            // Add month appointments to results
            monthAppointments.forEach((apt) => {
                results.push({
                    id: appointmentId,
                    appointmentNumber: appointmentId,
                    date: apt.date.toISOString().split('T')[0],
                    day: dayNames[apt.date.getDay()],
                    duration: `${formData.duration} min`,
                    type: formData.type || "In persona",
                    month: currentMonthPeriod + 1,
                    appointmentInMonth: apt.appointmentInMonth
                })

                appointmentId++
                appointmentsCreated++
            })

            currentMonthPeriod++
        }
    }

    // FINAL SORT - This ensures proper chronological order
    return results.sort((a, b) => {
        const dateA = new Date(a.date).getTime()
        const dateB = new Date(b.date).getTime()
        return dateA - dateB
    })
}

const EditCourseDialog: React.FC<EditCourseDialogProps> = ({
    open,
    onOpenChange,
    courseData,
    onSave
}) => {
    const [currentStep, setCurrentStep] = useState(1)
    const [formData, setFormData] = useState<CourseFormData>({
        // Step 1
        name: "",
        tagline: "",
        type: "",
        turnover: "",

        // Step 2
        duration: "",
        appointments: "",
        frequency: "",
        frequencyPeriod: "per Week", // Default value
        maxParticipants: "",
        startDate: "",
        selectedDays: []
    })

    // Update form data when courseData changes
    useEffect(() => {
        if (courseData && open) {
            // Reset to step 1  
            setCurrentStep(1)
            setFormData({
                // Step 1 - Get from props
                name: courseData.name || "",
                tagline: courseData.tagline || "",
                type: courseData.type || "",
                turnover: courseData.turnover || "",

                // Step 2 - Get from props with type assertions
                duration: courseData.duration?.replace(" min", "") || "",
                appointments: courseData.appointments || "",
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                frequency: (courseData as any).frequency || "",
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                frequencyPeriod: (courseData as any).frequencyPeriod || "per Week",
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                maxParticipants: (courseData as any).maxParticipants || "",
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                startDate: (courseData as any).startDate || "",
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                selectedDays: (courseData as any).selectedDays || []
            })
        }
    }, [courseData, open])

    const handleChange = (field: keyof CourseFormData, value: string | string[]) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleAppointmentsChange = (value: string) => {
        const regex = /^[0-9]*$/
        if (regex.test(value) || value === "") {
            const numValue = parseInt(value)
            const currentFrequency = parseInt(formData.frequency)

            // If current frequency is greater than new appointment count, reset frequency
            if (currentFrequency && numValue && currentFrequency > numValue) {
                handleChange("frequency", "")
                toast.error(`Frequency reset because it was greater than appointments (${numValue})`)
            }

            handleChange("appointments", value)
        }
    }

    const handleFrequencyChange = (value: string) => {
        const regex = /^[0-9]*$/
        if (regex.test(value) || value === "") {
            const numValue = parseInt(value)
            const totalAppointments = parseInt(formData.appointments)

            // Check if frequency exceeds total appointments
            if (totalAppointments && numValue > totalAppointments) {
                toast.error(`Frequency (${numValue}) cannot be greater than total appointments (${totalAppointments})`)
                return
            }

            // Validate frequency limits based on period
            const maxFrequency = formData.frequencyPeriod === "per Month" ? 5 : 3

            if (value === "" || numValue <= maxFrequency) {
                // Check if current selected days exceed new frequency
                if (numValue && formData.selectedDays.length > numValue) {
                    toast.error(`Please reduce selected days to ${numValue} or less`)
                    return
                }

                handleChange("frequency", value)
            } else {
                toast.error(`Maximum frequency for ${formData.frequencyPeriod.toLowerCase()} is ${maxFrequency}`)
            }
        }
    }

    const handleFrequencyPeriodChange = (value: string) => {
        const maxFrequency = value === "per Month" ? 5 : 3
        const currentFrequency = parseInt(formData.frequency)

        // If current frequency exceeds new limit, reset it
        if (currentFrequency > maxFrequency) {
            handleChange("frequency", "")
            toast.error(`Frequency reset. Maximum for ${value.toLowerCase()} is ${maxFrequency}`)
        }

        handleChange("frequencyPeriod", value)
    }

    const handleTurnoverChange = (value: string) => {
        const regex = /^[0-9]*(?:,[0-9]*)?$/
        if (regex.test(value) || value === "") {
            handleChange("turnover", value)
        }
    }

    const handleMaxParticipantsChange = (value: string) => {
        const regex = /^[0-9]*$/
        if (regex.test(value) || value === "") {
            handleChange("maxParticipants", value)
        }
    }

    const handleDayToggle = (day: string) => {

        const currentFrequency = parseInt(formData.frequency)
        if (!formData.selectedDays.includes(day)) {
            if (currentFrequency && formData.selectedDays.length >= currentFrequency) {
                toast.error(`You can only select ${currentFrequency} days based on your frequency setting`)
                return
            }
        }
        const updatedDays = formData.selectedDays.includes(day)
            ? formData.selectedDays.filter(d => d !== day)
            : [...formData.selectedDays, day]

        handleChange("selectedDays", updatedDays)
    }

    // Step validation
    const validateStep = (step: number): boolean => {
        switch (step) {
            case 1:
                if (!formData.name.trim()) {
                    toast.error("Course name is required")
                    return false
                }
                if (!formData.tagline.trim()) {
                    toast.error("Course tagline is required")
                    return false
                }
                if (!formData.type.trim()) {
                    toast.error("Course type is required")
                    return false
                }
                return true

            case 2:
                if (!formData.duration.trim()) {
                    toast.error("Duration is required")
                    return false
                }
                if (!formData.appointments.trim()) {
                    toast.error("Appointments is required")
                    return false
                }
                if (!formData.frequency.trim()) {
                    toast.error("Frequency is required")
                    return false
                }
                if (!formData.frequencyPeriod.trim()) {
                    toast.error("Frequency period is required")
                    return false
                }
                if (!formData.startDate.trim()) {
                    toast.error("Start date is required")
                    return false
                }
                if (formData.selectedDays.length === 0) {
                    toast.error("Please select at least one day")
                    return false
                }
                const currentFrequency = parseInt(formData.frequency)
                if (currentFrequency && formData.selectedDays.length !== currentFrequency) {
                    toast.error(`Please select exactly ${currentFrequency} days to match your frequency setting`)
                    return false
                }    

                

                // if (formData.serviceMode === "Group" && !formData.maxParticipants.trim()) {
                //     toast.error("Max participants is required for group services")
                //     return false
                // }
                // if (!formData.startDate.trim()) {
                //     toast.error("Start date is required")
                //     return false
                // }
                if (formData.selectedDays.length === 0) {
                    toast.error("Please select at least one day")
                    return false
                }

            case 3:
            case 4:
                return true

            default:
                return true
        }
    }

    // Navigation handlers
    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, 4))
        }
    }

    const handlePrevious = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1))
    }

    const handleCancel = () => {
        // Reset to step 1
        setCurrentStep(1)

        // Reset form data to original values
        if (courseData) {
            setFormData({
                name: courseData.name || "",
                tagline: courseData.tagline || "",
                type: courseData.type || "",
                turnover: courseData.turnover || "",
                duration: courseData.duration?.replace(" min", "") || "",
                appointments: courseData.appointments || "",
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                frequency: (courseData as any).frequency || "",
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                frequencyPeriod: (courseData as any).frequencyPeriod || "per Week",
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                maxParticipants: (courseData as any).maxParticipants || "",
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                startDate: (courseData as any).startDate || "",
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                selectedDays: (courseData as any).selectedDays || []
            })
        }

        onOpenChange(false)
    }

    // Final submit handler
    const handleSubmit = () => {
        const updatedCourse = {
            // Original fields
            id: courseData?.id || "",
            name: formData.name.trim(),
            tagline: formData.tagline.trim(),
            type: formData.type,
            duration: `${formData.duration} min`,
            appointments: formData.appointments,
            turnover: formData.turnover,

            // NEW FIELDS
            frequency: formData.frequency,
            frequencyPeriod: formData.frequencyPeriod,
            maxParticipants: formData.maxParticipants,
            startDate: formData.startDate,
            selectedDays: formData.selectedDays,
            schedule: generateSimpleAppointments(formData) // Generated appointments
        }

        onSave(updatedCourse)

        // Close dialog and reset step
        setCurrentStep(1)
        onOpenChange(false)
        toast.success("Course updated successfully!")
    }

    // Render step content
    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="grid gap-6">
                        {/* Name */}
                        <div className="space-y-2">
                            <Label htmlFor="course-name" className="text-sm font-medium">
                                Name*
                            </Label>
                            <Input
                                id="course-name"
                                value={formData.name}
                                onChange={(e) => handleChange("name", e.target.value)}
                                placeholder="e.g., Prenatal Yoga Class"
                                className="w-full"
                            />
                        </div>

                        {/* Tagline */}
                        <div className="space-y-2">
                            <Label htmlFor="course-tagline" className="text-sm font-medium">
                                Tagline*
                            </Label>
                            <Input
                                id="course-tagline"
                                value={formData.tagline}
                                onChange={(e) => handleChange("tagline", e.target.value)}
                                placeholder="e.g., Gentle stretching for expectant mothers"
                                className="w-full"
                            />
                        </div>

                        {/* Type and Turnover */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* Type */}
                            <div className="space-y-2">
                                <Label htmlFor="course-type" className="text-sm font-medium">
                                    Type*
                                </Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={(value) => handleChange("type", value)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select course type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="In persona">In persona</SelectItem>
                                        <SelectItem value="Videocall">Videocall</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Turnover */}
                            <div className="space-y-2">
                                <Label htmlFor="course-turnover" className="text-sm font-medium">
                                    Turnover
                                </Label>
                                <div className="flex items-center space-x-2">
                                    <Input
                                        id="course-turnover"
                                        value={formData.turnover}
                                        onChange={(e) => handleTurnoverChange(e.target.value)}
                                        placeholder="e.g., 500,00"
                                        className="flex-1"
                                    />
                                    <span className="text-sm font-medium text-gray-600">€</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )

            case 2:
                return (
                    <div className="grid gap-6">
                        {/* Duration and Appointments */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="course-duration" className="text-sm font-medium">
                                    Duration*
                                </Label>
                                <Select
                                    value={formData.duration}
                                    onValueChange={(value) => handleChange("duration", value)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select duration" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="20">20 min</SelectItem>
                                        <SelectItem value="30">30 min</SelectItem>
                                        <SelectItem value="40">40 min</SelectItem>
                                        <SelectItem value="50">50 min</SelectItem>
                                        <SelectItem value="60">60 min</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="course-appointments" className="text-sm font-medium">
                                    Appointments*
                                </Label>
                                <Input
                                    id="course-appointments"
                                    value={formData.appointments}
                                    onChange={(e) => handleAppointmentsChange(e.target.value)}
                                    placeholder="e.g., 10"
                                    className="w-full"
                                />
                            </div>
                        </div>

                        {/* Frequency */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Frequency*</Label>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Input
                                        id="course-frequency"
                                        value={formData.frequency}
                                        onChange={(e) => handleFrequencyChange(e.target.value)}
                                        placeholder="e.g., 2"
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <Select
                                        value={formData.frequencyPeriod}
                                        // onValueChange={(value) => handleChange("frequencyPeriod", value)}   
                                        onValueChange={handleFrequencyPeriodChange}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select period" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="per Week">per Week</SelectItem>
                                            <SelectItem value="per Month">per Month</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {/* Max Participants */}
                        <div className="space-y-2">
                            <Label htmlFor="max-participants" className="text-sm font-medium">
                                Max Participants
                            </Label>
                            <Input
                                id="max-participants"
                                value={formData.maxParticipants}
                                onChange={(e) => handleMaxParticipantsChange(e.target.value)}
                                placeholder="e.g., 10 (maximum number of participants)"
                                className="w-full"
                            />
                        </div>

                        {/* Start Date */}
                        <div className="space-y-2">
                            <Label htmlFor="start-date" className="text-sm font-medium">
                                Start Date*
                            </Label>
                            <Input
                                id="start-date"
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => handleChange("startDate", e.target.value)}
                                min={new Date().toISOString().split("T")[0]} // Prevent past dates
                                className="w-full"
                            />
                        </div>

                        {/* Days of Week */}
                        <div className="space-y-3">
                            <Label className="text-sm font-medium">Select Days*</Label>
                            <div className="flex flex-wrap gap-2">
                                {DAYS_OF_WEEK.map((day) => (
                                    <Button
                                        key={day.key}
                                        type="button"
                                        variant={formData.selectedDays.includes(day.key) ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => handleDayToggle(day.key)}
                                        className="min-w-[60px]"
                                    >
                                        {day.label}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                )

            case 3:
                return (
                    <div className="space-y-6">
                        <div className="text-center">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Review Your Course Details
                            </h3>
                            <p className="text-sm text-gray-600">
                                Please review the information below before saving
                            </p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Name:</p>
                                    <p className="text-sm text-gray-900">{formData.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Type:</p>
                                    <p className="text-sm text-gray-900">{formData.type}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Duration:</p>
                                    <p className="text-sm text-gray-900">{formData.duration} min</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Max Participants:</p>
                                    <p className="text-sm text-gray-900">{formData.maxParticipants || 'Not set'}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Frequency:</p>
                                    <p className="text-sm text-gray-900">
                                        {formData.frequency} {formData.frequencyPeriod}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Selected Days:</p>
                                    <p className="text-sm text-gray-900">
                                        {formData.selectedDays.length > 0
                                            ? DAYS_OF_WEEK
                                                .filter(day => formData.selectedDays.includes(day.key))
                                                .map(day => day.label)
                                                .join(', ')
                                            : 'None'
                                        }
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Start Date:</p>
                                    <p className="text-sm text-gray-900">{formData.startDate || 'Not set'}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Turnover:</p>
                                    <p className="text-sm text-gray-900">{formData.turnover ? `${formData.turnover} €` : 'Not set'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )

            case 4:
                // Generate appointments based on form data
                const generatedAppointments = generateSimpleAppointments(formData)

                return (
                    <div className="space-y-6">
                        <div className="text-center">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Generated Appointments
                            </h3>
                            <p className="text-sm text-gray-600">
                                Based on your course configuration: {formData.frequency} {formData.frequencyPeriod}
                            </p>
                        </div>

                        {generatedAppointments.length > 0 ? (
                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                {generatedAppointments.map((appointment) => (
                                    <div
                                        key={appointment.id}
                                        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow mr-2"
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <Calendar className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-gray-900">
                                                        Appointment {appointment.appointmentNumber}
                                                    </h4>
                                                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                                                        <div className="flex items-center space-x-1">
                                                            <span>{appointment.date} ({appointment.day})</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between text-sm">
                                                <div className="flex flex-col items-right space-y-1">
                                                    <div className="flex items-center space-x-1 text-gray-600">
                                                        <Clock className="w-4 h-4" />
                                                        <span>{appointment.duration}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-1 text-gray-600">
                                                        <MapPin className="w-4 h-4" />
                                                        <span>{appointment.type}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Calendar className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No Appointments Generated</h3>
                                <p className="text-sm text-gray-600">
                                    Please complete all required fields in Step 2 to generate appointments.
                                </p>
                            </div>
                        )}
                    </div>
                )

            default:
                return null
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        Edit Course/Class - Step {currentStep} of 4
                    </DialogTitle>
                    <DialogDescription>
                        {currentStep === 1 && "Enter basic course information"}
                        {currentStep === 2 && "Configure course details and schedule"}
                        {currentStep === 3 && "Review and confirm your changes"}
                        {currentStep === 4 && "View related appointments"}
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    {renderStepContent()}
                </div>

                <DialogFooter className="flex justify-between">
                    {currentStep === 1 && (
                        <Button variant="outline" onClick={handleCancel}>
                            Cancel
                        </Button>
                    )}
                    {currentStep > 1 && <div></div>} {/* Empty div for spacing when no cancel button */}

                    <div className="flex gap-2">
                        {currentStep > 1 && (
                            <Button variant="outline" onClick={handlePrevious}>
                                <ChevronLeft className="w-4 h-4 mr-1" />
                                Previous
                            </Button>
                        )}

                        {currentStep < 4 ? (
                            <Button onClick={handleNext}>
                                Next
                                <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        ) : (
                            <Button onClick={handleSubmit}>
                                Save Changes
                            </Button>
                        )}
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default EditCourseDialog