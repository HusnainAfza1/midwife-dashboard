"use client"

import React, { useState, useEffect, useRef } from "react"
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { PrivateServiceItem, CloudinaryImage } from "@/types"
import { X, ArrowUpFromLine, Loader2, ChevronLeft, ChevronRight, Calendar, Clock, MapPin } from "lucide-react"
import Image from "next/image"
import axios from "axios"

interface EditPrivateServiceDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    serviceData: PrivateServiceItem | null
    onSave: (updatedData: PrivateServiceItem) => void
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


interface ServiceFormData {
    // Step 1 fields
    name: string
    tagline: string
    type: string
    turnover: string
    image: CloudinaryImage | null

    // Step 2 fields
    duration: string
    appointments: string
    frequency: string
    frequencyPeriod: string // NEW: "per Week" or "per Month"
    serviceMode: "Group" | "Individual"
    maxParticipants: string
    startDate: string
    selectedDays: string[]
}


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

const generateSimpleAppointments = (formData: ServiceFormData): SimpleAppointment[] => {
    // Check required fields
    if (!formData.startDate || !formData.frequency || !formData.duration || !formData.appointments || formData.selectedDays.length === 0) {
        return []
    }

    const results: SimpleAppointment[] = []
    const startDate = new Date(formData.startDate)
    const totalAppointments = parseInt(formData.appointments)
    const appointmentsPerPeriod = parseInt(formData.frequency)
    const isWeekly = formData.frequencyPeriod === "per Week"

    // Day mapping
    const dayMap: { [key: string]: number } = {
        'sunday': 0, 'monday': 1, 'tuesday': 2, 'wednesday': 3,
        'thursday': 4, 'friday': 5, 'saturday': 6
    }

    const selectedDayNumbers = formData.selectedDays.map(day => dayMap[day]).sort((a, b) => a - b)
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

    let appointmentsCreated = 0
    let appointmentId = 1

    if (isWeekly) {
        // WEEKLY LOGIC (unchanged)
        let currentWeek = 0

        while (appointmentsCreated < totalAppointments) {
            const remainingAppointments = totalAppointments - appointmentsCreated
            const appointmentsThisWeek = Math.min(appointmentsPerPeriod, remainingAppointments)

            const weekAppointments: Array<{ date: Date, targetDay: number, appointmentInWeek: number }> = []

            for (let apt = 0; apt < appointmentsThisWeek; apt++) {
                const dayIndex = apt % selectedDayNumbers.length
                const targetDay = selectedDayNumbers[dayIndex]

                const weekStartDate = new Date(startDate)
                weekStartDate.setDate(startDate.getDate() + (currentWeek * 7))

                const aptDate = new Date(weekStartDate)
                const currentDayOfWeek = weekStartDate.getDay()
                const daysToAdd = (targetDay - currentDayOfWeek + 7) % 7
                aptDate.setDate(weekStartDate.getDate() + daysToAdd)

                if (apt >= selectedDayNumbers.length) {
                    const extraDays = Math.floor(apt / selectedDayNumbers.length)
                    aptDate.setDate(aptDate.getDate() + (extraDays * 7))
                }

                weekAppointments.push({
                    date: aptDate,
                    targetDay: targetDay,
                    appointmentInWeek: apt + 1
                })
            }

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
        // NEW MONTHLY LOGIC - 30-day periods starting from start date
        const targetDayOfWeek = selectedDayNumbers[0] // Only one day for monthly

        let currentMonthPeriod = 0

        while (appointmentsCreated < totalAppointments) {
            const remainingAppointments = totalAppointments - appointmentsCreated
            const appointmentsThisMonth = Math.min(appointmentsPerPeriod, remainingAppointments)

            // Calculate 30-day period starting from start date
            const periodStartDate = new Date(startDate)
            periodStartDate.setDate(startDate.getDate() + (currentMonthPeriod * 30))

            const periodEndDate = new Date(periodStartDate)
            periodEndDate.setDate(periodStartDate.getDate() + 29) // 30-day period

            // Find all occurrences of target day in this 30-day period
            const targetDaysInPeriod: Date[] = []

            // Start searching from period start date
            const searchDate = new Date(periodStartDate)

            // Find first occurrence of target day in this period
            while (searchDate <= periodEndDate) {
                if (searchDate.getDay() === targetDayOfWeek) {
                    targetDaysInPeriod.push(new Date(searchDate))
                }
                searchDate.setDate(searchDate.getDate() + 1)
            }

            // Take the required number of appointments for this period
            const monthAppointments: Array<{ date: Date, appointmentInMonth: number }> = []

            for (let i = 0; i < appointmentsThisMonth && i < targetDaysInPeriod.length; i++) {
                monthAppointments.push({
                    date: targetDaysInPeriod[i],
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

    // Final sort by date
    return results.sort((a, b) => {
        const dateA = new Date(a.date).getTime()
        const dateB = new Date(b.date).getTime()
        return dateA - dateB
    })
}



const EditPrivateServiceDialog: React.FC<EditPrivateServiceDialogProps> = ({
    open,
    onOpenChange,
    serviceData,
    onSave
}) => {
    const [currentStep, setCurrentStep] = useState(1)
    const [formData, setFormData] = useState<ServiceFormData>({
        // Step 1
        name: "",
        tagline: "",
        type: "",
        turnover: "",
        image: null,

        // Step 2
        duration: "",
        appointments: "",
        frequency: "",
        frequencyPeriod: "per Week", // Default value
        serviceMode: "Individual",
        maxParticipants: "",
        startDate: "",
        selectedDays: []
    })

    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleImageClick = () => {
        fileInputRef.current?.click()
    }


    // Update form data when serviceData changes - Get values from props
    useEffect(() => {
        if (serviceData && open) {
            // Reset to step 1
            setCurrentStep(1)
            setFormData({
                // Step 1 - Get from props
                name: serviceData.name || "",
                tagline: serviceData.tagline || "",
                type: serviceData.type || "",
                turnover: serviceData.turnover || "",
                image: serviceData.image || null,

                // Step 2 - Get from props (you'll need to add these to your PrivateServiceItem type)
                duration: serviceData.duration?.replace(" min", "") || "",
                appointments: serviceData.appointments || "",
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                frequency: (serviceData as any).frequency || "",
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                frequencyPeriod: (serviceData as any).frequencyPeriod || "per Week",
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                serviceMode: (serviceData as any).serviceMode || "Individual",
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                maxParticipants: (serviceData as any).maxParticipants || "",
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                startDate: (serviceData as any).startDate || "",
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                selectedDays: (serviceData as any).selectedDays || []
            })
        }
    }, [serviceData, open])

    const handleChange = (field: keyof ServiceFormData, value: string | string[]) => {
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
            // Validate frequency limits based on period
            const numValue = parseInt(value)
            const totalAppointments = parseInt(formData.appointments)

            // Check if frequency exceeds total appointments
            if (totalAppointments && numValue > totalAppointments) {
                toast.error(`Frequency (${numValue}) cannot be greater than total appointments (${totalAppointments})`)
                return
            }
            const maxFrequency = formData.frequencyPeriod === "per Month" ? 4 : 3

            if (value === "" || numValue <= maxFrequency) {
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
        if (formData.frequencyPeriod === "per Month") {
            // If trying to add a day and we already have one selected
            if (!formData.selectedDays.includes(day) && formData.selectedDays.length >= 1) {
                toast.error("For monthly frequency, you can only select one day")
                return
            }

            // If deselecting the current day, allow it
            // If selecting a new day when none selected, allow it
            const updatedDays = formData.selectedDays.includes(day)
                ? formData.selectedDays.filter(d => d !== day)
                : [day] // Replace with new single day

            handleChange("selectedDays", updatedDays)
            return
        }

        // If trying to add a day
        if (!formData.selectedDays.includes(day)) {
            // Check if frequency is set and if adding this day would exceed the limit
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


    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = event.target
        if (!files || files.length === 0) return

        const file = files[0]

        if (!file.type.startsWith('image/')) {
            toast.error("Please select a valid image file")
            return
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size should be less than 5MB")
            return
        }

        const reader = new FileReader()

        try {
            setIsUploading(true)

            reader.onloadend = async () => {
                try {
                    const response = await axios.post("/api/upload", {
                        image: reader.result,
                        folder: "midwife-dash/private-services",
                    })

                    if (response.data.success) {
                        const newImage: CloudinaryImage = {
                            url: response.data.url,
                            public_id: response.data.public_id,
                            name: file.name,
                        }

                        setFormData(prev => ({
                            ...prev,
                            image: newImage
                        }))

                        toast.success("Service image uploaded successfully!")
                    } else {
                        toast.error("Failed to upload service image")
                    }
                } catch (error) {
                    console.error("Error uploading image:", error)
                    toast.error("Error uploading service image")
                } finally {
                    setIsUploading(false)
                }
            }

            reader.readAsDataURL(file)
        } catch (error) {
            console.error("Error processing image:", error)
            toast.error("Error processing service image")
            setIsUploading(false)
        }
    }

    const handleRemoveImage = () => {
        setFormData(prev => ({
            ...prev,
            image: null
        }))
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    // Image upload handler (same as before)

    // Step validation
    const validateStep = (step: number): boolean => {
        switch (step) {
            case 1:
                if (!formData.name.trim()) {
                    toast.error("Service name is required")
                    return false
                }
                if (!formData.tagline.trim()) {
                    toast.error("Service tagline is required")
                    return false
                }
                if (!formData.type.trim()) {
                    toast.error("Service type is required")
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

                // NEW: Check frequency and days match   
                const totalAppointments = parseInt(formData.appointments)
                const currentFrequency = parseInt(formData.frequency)
                if (totalAppointments && currentFrequency && totalAppointments < currentFrequency) {
                    toast.error(`Total appointments (${totalAppointments}) cannot be less than frequency (${currentFrequency})`)
                    return false
                }


                if (formData.frequencyPeriod === "per Month") {
                    // For monthly: exactly 1 day should be selected
                    if (formData.selectedDays.length !== 1) {
                        toast.error("Please select exactly one day for monthly frequency")
                        return false
                    }
                } else {
                    // For weekly: days should match frequency
                    if (currentFrequency && formData.selectedDays.length !== currentFrequency) {
                        toast.error(`Please select exactly ${currentFrequency} days to match your frequency setting`)
                        return false
                    }
                }

                if (formData.serviceMode === "Group" && !formData.maxParticipants.trim()) {
                    toast.error("Max participants is required for group services")
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
                return true

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
        if (serviceData) {
            setFormData({
                name: serviceData.name || "",
                tagline: serviceData.tagline || "",
                type: serviceData.type || "",
                turnover: serviceData.turnover || "",
                image: serviceData.image || null,
                duration: serviceData.duration?.replace(" min", "") || "",
                appointments: serviceData.appointments || "",
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                frequency: (serviceData as any).frequency || "",
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                frequencyPeriod: (serviceData as any).frequencyPeriod || "per Week",
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                serviceMode: (serviceData as any).serviceMode || "Individual",
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                maxParticipants: (serviceData as any).maxParticipants || "",
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                startDate: (serviceData as any).startDate || "",
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                selectedDays: (serviceData as any).selectedDays || []
            })
        }

        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
        onOpenChange(false)
    }

    // Final submit handler (commented out the save logic as requested)
    const handleSubmit = () => {
        // Create the complete form data object
        const completeFormData = {
            // Step 1 data
            name: formData.name.trim(),
            tagline: formData.tagline.trim(),
            type: formData.type,
            turnover: formData.turnover,
            image: formData.image,

            // Step 2 data
            duration: `${formData.duration} min`,
            appointments: formData.appointments,
            frequency: formData.frequency,
            frequencyPeriod: formData.frequencyPeriod,
            serviceMode: formData.serviceMode,
            maxParticipants: formData.maxParticipants,
            startDate: formData.startDate,
            selectedDays: formData.selectedDays,

            // Generated schedule
            schedule: generateSimpleAppointments(formData)
        }

        console.log("Complete Form Data Object:", completeFormData)

        // Commented out the save logic as requested

        const updatedService = {
            // Original fields
            id: serviceData?.id || "",
            name: formData.name.trim(),
            tagline: formData.tagline.trim(),
            type: formData.type,
            duration: `${formData.duration} min`,
            appointments: formData.appointments,
            turnover: formData.turnover,
            image: formData.image,

            // NEW FIELDS
            frequency: formData.frequency,
            frequencyPeriod: formData.frequencyPeriod,
            serviceMode: formData.serviceMode,
            maxParticipants: formData.maxParticipants,
            startDate: formData.startDate,
            selectedDays: formData.selectedDays,
            schedule: generateSimpleAppointments(formData) // Generated appointments
        }
        onSave(updatedService)


        // Close dialog and reset step
        setCurrentStep(1)
        onOpenChange(false)
        toast.success("Private service added successfully!")
    }

    // Render step content
    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="grid gap-6">
                        {/* Name */}
                        <div className="space-y-2">
                            <Label htmlFor="service-name" className="text-sm font-medium">
                                Name*
                            </Label>
                            <Input
                                id="service-name"
                                value={formData.name}
                                onChange={(e) => handleChange("name", e.target.value)}
                                placeholder="e.g., Private Consultation"
                                className="w-full"
                            />
                        </div>

                        {/* Tagline */}
                        <div className="space-y-2">
                            <Label htmlFor="service-tagline" className="text-sm font-medium">
                                Tagline*
                            </Label>
                            <Input
                                id="service-tagline"
                                value={formData.tagline}
                                onChange={(e) => handleChange("tagline", e.target.value)}
                                placeholder="e.g., One-on-one consultation session"
                                className="w-full"
                            />
                        </div>

                        {/* Type and Turnover */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* Type */}
                            <div className="space-y-2">
                                <Label htmlFor="service-type" className="text-sm font-medium">
                                    Type*
                                </Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={(value) => handleChange("type", value)}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select service type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="In persona">In persona</SelectItem>
                                        <SelectItem value="Videocall">Videocall</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Turnover */}
                            <div className="space-y-2">
                                <Label htmlFor="service-turnover" className="text-sm font-medium">
                                    Turnover
                                </Label>
                                <div className="flex items-center space-x-2">
                                    <Input
                                        id="service-turnover"
                                        value={formData.turnover}
                                        onChange={(e) => handleTurnoverChange(e.target.value)}
                                        placeholder="e.g., 150,00"
                                        className="flex-1"
                                    />
                                    <span className="text-sm font-medium text-gray-600">€</span>
                                </div>
                            </div>
                        </div>

                        {/* Image Upload */}
                        <div className="space-y-3">
                            <Label className="text-sm font-medium">
                                Service Image
                            </Label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 transition-colors hover:border-gray-400">
                                {isUploading ? (
                                    <div className="flex flex-col items-center justify-center space-y-3">
                                        <Loader2 className="h-8 w-8 text-primary animate-spin" />
                                        <p className="text-sm text-gray-600">Uploading image...</p>
                                    </div>
                                ) : formData.image?.url ? (
                                    <div className="flex flex-col items-center space-y-4">
                                        <div className="relative">
                                            <div className="w-24 h-24 overflow-hidden rounded-lg border-2 border-gray-200">
                                                <Image
                                                    src={formData.image.url}
                                                    alt="Service preview"
                                                    width={96}
                                                    height={96}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={handleRemoveImage}
                                                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center transition-colors shadow-sm"
                                                title="Remove image"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-medium text-gray-700 truncate max-w-xs">
                                                {formData.image.name}
                                            </p>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={handleImageClick}
                                                className="mt-2"
                                            >
                                                Change Image
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center space-y-3">
                                        <ArrowUpFromLine className="h-8 w-8 text-gray-400" />
                                        <div className="text-center">
                                            <p className="text-sm text-gray-600 mb-2">
                                                Drop your image here, or click to browse
                                            </p>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={handleImageClick}
                                                disabled={isUploading}
                                            >
                                                Upload Image
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                            </div>
                            <p className="text-xs text-gray-500">
                                Optional. Max size: 5MB. Formats: JPG, PNG, GIF
                            </p>
                        </div>
                    </div>
                )

            case 2:
                return (
                    <div className="grid gap-6">
                        {/* Duration and Appointments */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="service-duration" className="text-sm font-medium">
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
                                        <SelectItem value="90">90 min</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="service-appointments" className="text-sm font-medium">
                                    Appointments*
                                </Label>
                                <Input
                                    id="service-appointments"
                                    type="number"
                                    max={10} // Limit to 10 appointments
                                    value={formData.appointments}
                                    onChange={(e) => handleAppointmentsChange(e.target.value)}
                                    placeholder="e.g., 1"
                                    className="w-full"
                                />
                            </div>
                        </div>

                        {/* UPDATED: Frequency with Number + Dropdown */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Frequency*</Label>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Input
                                        id="service-frequency"
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
                                        onValueChange={handleFrequencyPeriodChange} // Use the new handler
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

                        {/* Service Mode Radio */}
                        <div className="space-y-3">
                            <Label className="text-sm font-medium">Service Mode*</Label>
                            <RadioGroup
                                value={formData.serviceMode}
                                onValueChange={(value: "Group" | "Individual") => handleChange("serviceMode", value)}
                                className="flex space-x-6"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Individual" id="individual" />
                                    <Label htmlFor="individual" className="text-sm">Individual</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="Group" id="group" />
                                    <Label htmlFor="group" className="text-sm">Group</Label>
                                </div>
                            </RadioGroup>
                        </div>

                        {/* Max Participants (conditional) */}
                        {formData.serviceMode === "Group" && (
                            <div className="space-y-2">
                                <Label htmlFor="max-participants" className="text-sm font-medium">
                                    Max Participants*
                                </Label>
                                <Input
                                    id="max-participants"
                                    value={formData.maxParticipants}
                                    onChange={(e) => handleMaxParticipantsChange(e.target.value)}
                                    placeholder="e.g., 8"
                                    className="w-full"
                                />
                            </div>
                        )}

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
                                Review Your Service Details
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
                                    <p className="text-sm font-medium text-gray-700">Service Mode:</p>
                                    <p className="text-sm text-gray-900">{formData.serviceMode}</p>
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
                            </div>
                        </div>
                    </div>
                )

            case 4:
                // Generate dynamic appointments based on form data (NO TIME, just dates)
                const generatedAppointments = generateSimpleAppointments(formData)

                return (
                    <div className="space-y-6">
                        <div className="text-center">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                Generated Appointments
                            </h3>
                            <p className="text-sm text-gray-600">
                                Based on your service configuration: {formData.frequency} {formData.frequencyPeriod}
                            </p>
                        </div>

                        {generatedAppointments.length > 0 ? (
                            <>
                                {/* <div className="bg-blue-50 rounded-lg p-4 mb-4">
                                    <div className="flex items-center justify-center space-x-3">
                                        <div className="text-blue-600">
                                            <Calendar className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-blue-900">
                                                Total Generated Appointments: {generatedAppointments.length}
                                            </p>
                                            <p className="text-xs text-blue-700">
                                                Schedule: {formData.selectedDays.map(day => 
                                                    DAYS_OF_WEEK.find(d => d.key === day)?.label
                                                ).join(', ')} - {formData.frequency} {formData.frequencyPeriod}
                                            </p>
                                        </div>
                                    </div>
                                </div> */}

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
                                                                {/* <Calendar className="w-4 h-4" /> */}
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
                            </>
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
                        Edit Private Service - Step {currentStep} of 4
                    </DialogTitle>
                    <DialogDescription>
                        {currentStep === 1 && "Enter basic service information"}
                        {currentStep === 2 && "Configure service details and schedule"}
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
                            <Button onClick={handleNext} disabled={isUploading}>
                                Next
                                <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        ) : (
                            <Button onClick={handleSubmit} disabled={isUploading}>
                                Save Changes
                            </Button>
                        )}
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default EditPrivateServiceDialog