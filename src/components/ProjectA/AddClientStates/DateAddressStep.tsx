// components/AddClient/DateAddressStep.tsx
"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { SlCalender } from "react-icons/sl"
import { de } from "date-fns/locale"
import { toast } from "sonner"
import GoogleAddressAutocomplete from "@/components/GoogleAddressAutocomplete"
import type { SelectedAddress } from "@/types/google-places"
import type { AddMidwifeFormData } from "@/types"
import { ClientFormData } from "./types"
import { GetAllMidwivesApi, GetmidwifeA1bookingAppointmentCountApi ,getMidwifeBookingApi } from "@/endpoints/getEndpoints"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Loader2, AlertCircle } from "lucide-react"

interface DateAddressStepProps {
    data: ClientFormData
    updateData: (field: Partial<ClientFormData>) => void
    onNext: () => void
    onBack: () => void
}

interface Location {
    lat: number
    lng: number
}

// Custom error class for location availability
class LocationAvailabilityError extends Error {
    code: string
    constructor(message: string, code: string) {
        super(message)
        this.name = 'LocationAvailabilityError'
        this.code = code
    }
}

const PLACES_DETAILS_API_URL = '/api/places/details'

const DateAddressStep = ({ data, updateData, onNext, onBack }: DateAddressStepProps) => {
    const [calendarOpen, setCalendarOpen] = useState(false)
    const [midwives, setMidwives] = useState<AddMidwifeFormData[]>([])
    const [isLoadingMidwives, setIsLoadingMidwives] = useState(false)
    const [isCheckingAvailability, setIsCheckingAvailability] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    // Fetch all midwives when component mounts
    useEffect(() => {
        const fetchMidwives = async () => {
            setIsLoadingMidwives(true)
            try {
                const response = await GetAllMidwivesApi()
                if (response.status === 200) {
                    setMidwives(response.data.data || [])
                } else {
                    toast.error("Failed to fetch midwives")
                }
            } catch (error) {
                console.error("Error fetching midwives:", error)
                toast.error("Failed to fetch midwives")
            } finally {
                setIsLoadingMidwives(false)
            }
        }

        fetchMidwives()
    }, [])

    // Clear error message when data changes
    useEffect(() => {
        if (errorMessage) {
            setErrorMessage("")
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.expectedDate, data.googleAddress, data.selectedMidwife])

    // Parse DD/MM/YYYY string to Date object
    const parseStringToDate = (dateString: string): Date | null => {
        if (!dateString) return null
        const [day, month, year] = dateString.split('/').map(Number)
        return new Date(year, month - 1, day)
    }

    // Format Date object to DD/MM/YYYY string
    const formatDateToString = (date: Date): string => {
        const day = String(date.getDate()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const year = date.getFullYear()
        return `${day}/${month}/${year}`
    }

    const handleDateSelect = (date: Date | undefined) => {
        if (date) {
            const formattedDate = formatDateToString(date)
            updateData({ expectedDate: formattedDate })
            setCalendarOpen(false)
        }
    }

    const handleGoogleAddressSelect = (addressData: SelectedAddress | null) => {
        if (addressData) {
            updateData({ googleAddress: addressData })
            toast.success("Address selected successfully!")
        } else {
            updateData({ googleAddress: null })
        }
    }

    const handleMidwifeSelect = (midwifeId: string) => {
        const selectedMidwife = midwives.find(m => m.userId === midwifeId)
        
        if (selectedMidwife) {
            updateData({ selectedMidwife: selectedMidwife })
            toast.success(`Midwife ${selectedMidwife.personalInfo.firstName} ${selectedMidwife.personalInfo.lastName} selected`)
        }
    }

    // Helper function to validate coordinates
    const isValidCoordinate = (coord: Location): boolean => {
        return (
            typeof coord.lat === 'number' &&
            typeof coord.lng === 'number' &&
            coord.lat >= -90 && coord.lat <= 90 &&
            coord.lng >= -180 && coord.lng <= 180 &&
            !isNaN(coord.lat) && !isNaN(coord.lng)
        )
    }

    // Haversine formula to calculate distance between two coordinates
    const haversineKm = (coord1: Location, coord2: Location): number => {
        const toRad = (value: number) => (value * Math.PI) / 180
        const R = 6371 // Earth's radius in kilometers

        const dLat = toRad(coord2.lat - coord1.lat)
        const dLng = toRad(coord2.lng - coord1.lng)

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(coord1.lat)) *
            Math.cos(toRad(coord2.lat)) *
            Math.sin(dLng / 2) *
            Math.sin(dLng / 2)

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        return R * c
    }

    // Check if midwife has available slots for the selected date
    const checkAvailability = async (midwifeId: string, expectedDeliveryDate: string, midwifeIntensity: number): Promise<boolean> => {
        try {
            const response = await GetmidwifeA1bookingAppointmentCountApi(midwifeId, expectedDeliveryDate)
            console.log("GetmidwifeA1bookingAppointmentCountApi::", response.data)
            
            if (!response.data?.success || !response.data.data) return false

            const total = Number(response.data.data.totalCount) || 0
            const capacity = Number(midwifeIntensity) || 0
            
            console.log("Total appointments for this month:", total)
            console.log("Midwife capacity for this month:", capacity)

            return total < capacity
        } catch (error) {
            console.error("Error fetching appointment count:", error)
            return false
        }
    }

    // Check if client address is within midwife's service radius
    const checkMidwifeLocationAvailability = async (midwifePlaceId: string, serviceRadius: string): Promise<boolean> => {
        // Input validation
        if (!midwifePlaceId?.trim()) {
            throw new LocationAvailabilityError('Midwife place ID is required', 'INVALID_INPUT')
        }

        if (!data.googleAddress?.details?.geometry?.location) {
            throw new LocationAvailabilityError(
                'Selected address details or geometry location is missing',
                'MISSING_ADDRESS_DATA'
            )
        }

        const serviceRadiusKm = parseFloat(String(serviceRadius))
        if (isNaN(serviceRadiusKm) || serviceRadiusKm <= 0) {
            throw new LocationAvailabilityError(
                'Service radius must be a positive number',
                'INVALID_RADIUS'
            )
        }

        try {
            // Fetch midwife's place details
            const response = await fetch(`${PLACES_DETAILS_API_URL}/${encodeURIComponent(midwifePlaceId)}`)

            if (!response.ok) {
                const errorText = await response.text()
                throw new LocationAvailabilityError(
                    `Failed to fetch place details: ${response.status} ${errorText}`,
                    'API_ERROR'
                )
            }

            const responseData = await response.json()
            const locationDetails = responseData.details

            if (!locationDetails?.geometry?.location) {
                throw new LocationAvailabilityError(
                    'Invalid response or missing location data from API',
                    'INVALID_API_RESPONSE'
                )
            }

            // Extract coordinates
            const midwifeLocation = locationDetails.geometry.location
            const clientLocation = data.googleAddress.details.geometry.location

            // Validate coordinates
            if (!isValidCoordinate(midwifeLocation) || !isValidCoordinate(clientLocation)) {
                throw new LocationAvailabilityError(
                    'Invalid coordinates received',
                    'INVALID_COORDINATES'
                )
            }

            // Calculate distance
            const distanceKm = haversineKm(midwifeLocation, clientLocation)

            console.log(`Distance: ${distanceKm.toFixed(2)}km (max: ${serviceRadiusKm}km)`)

            // Check if within radius
            const isWithinRadius = distanceKm <= serviceRadiusKm

            if (!isWithinRadius) {
                console.warn(`Location outside service area: ${distanceKm.toFixed(2)}km > ${serviceRadiusKm}km`)
            } else {
                console.log('Location is within service area')
            }

            return isWithinRadius

        } catch (error) {
            if (error instanceof LocationAvailabilityError) {
                throw error
            }

            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
            throw new LocationAvailabilityError(
                `Error checking location availability: ${errorMessage}`,
                'UNEXPECTED_ERROR'
            )
        }
    }

    const handleAvailabilityCheck = async () => {
    setErrorMessage("")
    setIsCheckingAvailability(true)

    try {
        // Validate midwife selection
        if (!data.selectedMidwife) {
            setErrorMessage("Please select a midwife")
            return
        }

        // Validate expected delivery date
        if (!data.expectedDate) {
            setErrorMessage("Bitte wählen Sie ein Datum aus")
            return
        }

        // Validate address
        if (!data.googleAddress?.address) {
            setErrorMessage("Bitte geben Sie Ihre Adresse ein")
            return
        }

        // Convert string date to Date object for validation
        const deliveryDate = parseStringToDate(data.expectedDate)
        if (!deliveryDate) {
            setErrorMessage("Ungültiges Datum ausgewählt")
            return
        }

        // ← NEW: Check if existing client already has a plan with this midwife
        if (data.clientId) {
            console.log("🔍 Checking if existing client has a plan with this midwife...")
            try {
                const bookingResponse = await getMidwifeBookingApi(
                    data.selectedMidwife._id || "",
                    data.clientId
                )  
                console.log("midiwfie ID", data.selectedMidwife._id)
                console.log("midiwfie ID", data.clientId)

                console.log("getMidwifeBookingApi response:", bookingResponse.data.data)

                // If booking exists, show error and stop
                if (bookingResponse.data?.success && bookingResponse.data?.data.length >0) {
                    setErrorMessage("This client already has a plan with this midwife")
                    return
                }

                console.log("✅ No existing booking found, proceeding...")
            } catch (error) {
                console.error("Error checking existing booking:", error)
                // If error is 404 or similar, it means no booking exists - continue
                // For other errors, you might want to handle differently
                console.log("✅ No existing booking found (or error checking), proceeding...")
            }
        }

        // Check basic availability (slot capacity)
        const midwifeIntensity = data.selectedMidwife.identity?.totalWeeklyHours || 0
        const isAvailable = await checkAvailability(
            data.selectedMidwife.userId, 
            data.expectedDate,
            midwifeIntensity
        )

        if (isAvailable === false) {
            setErrorMessage(
                `There are no slots available for ${data.selectedMidwife.personalInfo.firstName} on the selected date.`
            )
            return
        }

        // Validate midwife has location data
        if (!data.selectedMidwife.personalInfo.googleAddress?.placeId) {
            setErrorMessage("Diese Hebamme hat keine gültige Adresse konfiguriert.")
            return
        }

        // Validate client address has place ID
        if (!data.googleAddress.placeId) {
            setErrorMessage("Bitte wählen Sie eine gültige Adresse aus.")
            return
        }

        // Check location availability (service radius)
        try {
            const midwifeLocationAvailable = await checkMidwifeLocationAvailability(
                data.selectedMidwife.personalInfo.googleAddress.placeId,
                data.selectedMidwife.personalInfo.serviceRadius || "0"
            )

            if (!midwifeLocationAvailable) {
                setErrorMessage("Diese Hebamme ist für die ausgewählte Adresse nicht verfügbar.")
                return
            }

            // All checks passed - move to next step
            console.log("✅ All availability checks passed")
            toast.success("Availability confirmed! Proceeding to next step...")
            onNext()

        } catch (error) {
            if (error instanceof LocationAvailabilityError) {
                console.error(`Location check failed [${error.code}]:`, error.message)

                switch (error.code) {
                    case 'MISSING_ADDRESS_DATA':
                        setErrorMessage("Bitte geben Sie eine gültige Adresse ein")
                        break
                    case 'INVALID_RADIUS':
                        setErrorMessage("Servicebereich-Konfigurationsfehler. Bitte versuchen Sie es später erneut.")
                        break
                    case 'API_ERROR':
                        setErrorMessage("Service vorübergehend nicht verfügbar. Bitte versuchen Sie es später erneut.")
                        break
                    case 'INVALID_COORDINATES':
                        setErrorMessage("Ungültige Adressdaten. Bitte wählen Sie eine andere Adresse.")
                        break
                    default:
                        setErrorMessage("Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.")
                        break
                }
            } else {
                console.error('Unexpected error:', error)
                setErrorMessage("Ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut.")
            }
        }

    } finally {
        setIsCheckingAvailability(false)
    }
}

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-semibold mb-2">Expected Date & Address</h2>
                <p className="text-gray-500 text-sm">Select the expected delivery date, address, and assign a midwife</p>
            </div>
            
            {/* Expected Date */}
            <div className="space-y-2">
                <Label className="text-sm font-medium">
                    Voraussichtlicher Liefertermin *
                </Label>
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                    <PopoverTrigger asChild>
                        <div className="flex items-center mt-2 bg-gray-50 border rounded-lg p-3 cursor-pointer hover:border-gray-400 transition-colors border-gray-300">
                            <SlCalender className="h-5 w-5 text-gray-400 mr-3" />
                            <span className={`${data.expectedDate ? 'text-gray-900' : 'text-gray-500'} w-full outline-none`}>
                                {data.expectedDate || "Wählen Sie ein Datum aus"}
                            </span>
                        </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-white" align="start">
                        <Calendar
                            mode="single"
                            selected={data.expectedDate ? parseStringToDate(data.expectedDate) || undefined : undefined}
                            onSelect={handleDateSelect}
                            disabled={(date) => {
                                const today = new Date();
                                const tenMonthsFromNow = new Date();
                                tenMonthsFromNow.setMonth(today.getMonth() + 10);
                                return date < today || date > tenMonthsFromNow;
                            }}
                            initialFocus
                            locale={de}
                        />
                    </PopoverContent>
                </Popover>
            </div>

            {/* Address */}
            <div className="space-y-2">
                <Label className="text-sm font-medium">
                    Address *
                </Label>
                <GoogleAddressAutocomplete
                    onAddressSelect={handleGoogleAddressSelect}
                    selectedAddress={data.googleAddress}
                    placeholder="Search for your precise location using Google..."
                    className="w-full"
                />
            </div>

            {/* Midwife Selection */}
            <div className="space-y-2">
                <Label className="text-sm font-medium">
                    Assign Midwife *
                </Label>
                <Select
                    value={data.selectedMidwife?.userId || ""}
                    onValueChange={handleMidwifeSelect}
                    disabled={isLoadingMidwives}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder={isLoadingMidwives ? "Loading midwives..." : "Select a midwife"} />
                    </SelectTrigger>
                    <SelectContent>
                        {midwives.map((midwife) => (
                            <SelectItem key={midwife.userId} value={midwife.userId}>
                                {midwife.personalInfo.firstName} {midwife.personalInfo.lastName}
                                {midwife.personalInfo.midwifeTitle && ` (${midwife.personalInfo.midwifeTitle})`}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {data.selectedMidwife && (
                    <div className="text-xs text-gray-500 mt-2 p-2 bg-gray-50 rounded">
                        <p><strong>Email:</strong> {data.selectedMidwife.personalInfo.email}</p>
                        <p><strong>Phone:</strong> {data.selectedMidwife.personalInfo.phone}</p>
                        {data.selectedMidwife.personalInfo.address && (
                            <p><strong>Address:</strong> {data.selectedMidwife.personalInfo.address}</p>
                        )}
                        <p><strong>Service Radius:</strong> {data.selectedMidwife.personalInfo.serviceRadius || 0} km</p>
                    </div>
                )}
            </div>

            {/* Error Message */}
            {errorMessage && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-600">{errorMessage}</p>
                </div>
            )}

            <div className="flex gap-2 mt-6">
                <Button variant="outline" onClick={onBack} className="flex-1" disabled={isCheckingAvailability}>
                    Back
                </Button>
                <Button 
                    onClick={handleAvailabilityCheck} 
                    className="flex-1"
                    disabled={isCheckingAvailability || !data.expectedDate || !data.googleAddress || !data.selectedMidwife}
                >
                    {isCheckingAvailability ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Checking Availability...
                        </>
                    ) : (
                        "Check Availability & Continue"
                    )}
                </Button>
            </div>
        </div>
    )
}

export default DateAddressStep