// components/AddClient/CareTypeStep.tsx
"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { ClientFormData } from "./types"
import { Baby, Heart, Loader2 } from "lucide-react"
import { clientRegisterApi, MidwifeBookingApi, preBirthBookingsApi, postBirthBookingsApi } from "@/endpoints/postEndpoints"
import { PreBirthBookingEngine } from "@/utils/preBirthBooking-engine"
import { PostBirthBookingEngine } from "@/utils/postBirthBookings-engine"
import type { SelectedAddress } from "@/types/google-places"

interface CareTypeStepProps {
    data: ClientFormData
    updateData: (field: Partial<ClientFormData>) => void
    onBack: () => void
    onSubmit: (clientId: string) => void
    setIsSubmitting: (value: boolean) => void
}

const CareTypeStep = ({ data, updateData, onBack, onSubmit, setIsSubmitting }: CareTypeStepProps) => {
    const [isLoading, setIsLoading] = useState(false)

    const handleCareTypeSelect = (careType: "prebirth" | "postbirth") => {
        updateData({ careType })
    }

    // Helper to get yesterday's date in DD/MM/YYYY format
    const getYesterdayDate = (): string => {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        const day = String(yesterday.getDate()).padStart(2, '0')
        const month = String(yesterday.getMonth() + 1).padStart(2, '0')
        const year = yesterday.getFullYear()
        return `${day}/${month}/${year}`
    }

    // Helper to convert DD/MM/YYYY to Date object
    const convertGermanDateToISO = (dateString: string): Date | null => {
        if (!dateString) return null
        const [day, month, year] = dateString.split('/').map(Number)
        return new Date(year, month - 1, day)
    }

    const handleFinalSubmit = async () => {
        if (!data.careType) {
            toast.error("Please select a care type")
            return
        }

        if (!data.selectedMidwife) {
            toast.error("Midwife data is missing")
            return
        }

        setIsSubmitting(true)
        setIsLoading(true)

        try {
            let clientId: string

            // Step 1: Register the client OR use existing clientId
            if (data.clientId) {
                // User already exists, skip registration
                console.log("✅ Using existing client ID:", data.clientId)
                clientId = data.clientId
            } else {
                // New user, register client
                console.log("📝 Step 1: Registering new client...")
                const signUpResponse = await clientRegisterApi({
                    username: data.username,
                    fullName: data.fullName,
                    email: data.email,
                    password: data.password
                })

                if (!signUpResponse.data?.success || !signUpResponse.data?.user?.id) {
                    throw new Error("Failed to create client account")
                }

                clientId = signUpResponse.data.user.id
                console.log("✅ Client registered successfully. ID:", clientId)
            }

            // Step 2: Create A1 Booking
            console.log("📝 Step 2: Creating A1 booking...")
            const a1BookingData = {
                userId: clientId,
                midwifeId: data.selectedMidwife._id,
                fullName: data.fullName,
                email: data.email,
                phoneNumber: data.phoneNumber,
                insuranceNumber: data.insuranceNumber,
                insuranceCompany: data.insuranceCompany,
                insuranceType: data.insuranceType,
                date: getYesterdayDate(),
                expectedDeliveryDate: data.expectedDate,
                selectedAddressDetails: data.googleAddress as SelectedAddress,
                selectedSlot: "13:50-14:40",
                clientStatus: "converted",
                status: "cancelled"
            }

            const a1Response = await MidwifeBookingApi(a1BookingData)

            if (!a1Response.data?.success) {
                throw new Error("Failed to create A1 booking")
            }

            console.log("✅ A1 Booking created successfully")

            // Step 3: Generate and save appointments based on care type
            const midwifeId = data.selectedMidwife._id
            const timeTable = data.selectedMidwife.identity?.timetable
            const allEnabledServices = Object.keys(data.selectedMidwife.services ?? {})
            const clientET = convertGermanDateToISO(data.expectedDate)

            if (!clientET) {
                throw new Error("Invalid expected delivery date")
            }

            if (data.careType === "prebirth") {
                // Generate PreBirth Appointments
                console.log("📝 Step 3: Generating prebirth appointments...")

                const preBirthServices = ["B1", "B2", "E1"] as const
                const enabledPreBirthServices = allEnabledServices.filter(s =>
                    preBirthServices.includes(s as typeof preBirthServices[number])
                )

                if (enabledPreBirthServices.length === 0) {
                    console.warn("⚠️ No pre-birth services enabled for this midwife")
                    toast.warning("Midwife has no prebirth services enabled, but booking created successfully")
                } else {
                    const engine = new PreBirthBookingEngine(timeTable, enabledPreBirthServices)

                    const appointments = await engine.generatePreBirthAppointments({
                        clientET: clientET,
                        clientId: clientId,
                        midwifeId: midwifeId ? midwifeId : "",
                        timetable: timeTable,
                        enabledServices: enabledPreBirthServices,
                        apiUrl: "api/public/PostBirthAppointments/monthly-view"
                    })

                    console.log("📅 Generated prebirth appointments:", appointments)

                    // Save prebirth appointments
                    await preBirthBookingsApi({
                        midwifeId,
                        clientId,
                        clientET,
                        appointments
                    })

                    console.log("✅ Prebirth appointments saved successfully")
                }

            } else if (data.careType === "postbirth") {
                console.log("📝 Step 3: Generating postbirth workflow...")

                // STEP 3A: Generate PreBirth Appointments as CANCELLED
                const preBirthServices = ["B1", "B2", "E1"] as const
                const enabledPreBirthServices = allEnabledServices.filter(s =>
                    preBirthServices.includes(s as typeof preBirthServices[number])
                )

                if (enabledPreBirthServices.length > 0) {
                    console.log("📝 Step 3A: Generating cancelled prebirth appointments...")

                    const preBirthEngine = new PreBirthBookingEngine(timeTable, enabledPreBirthServices)

                    const preBirthAppointments = await preBirthEngine.generatePreBirthAppointments({
                        clientET: clientET,
                        clientId: clientId,
                        midwifeId: midwifeId ? midwifeId : "",
                        timetable: timeTable,
                        enabledServices: enabledPreBirthServices,
                        apiUrl: "api/public/PostBirthAppointments/monthly-view"
                    })

                    console.log("📅 Generated prebirth appointments (to be cancelled):", preBirthAppointments)

                    // Mark ALL individual appointments as cancelled
                    const cancelledAppointments = {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        B1: preBirthAppointments.B1?.map((apt: any) => ({
                            ...apt,
                            status: "cancelled"
                        })) || [],
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        B2: preBirthAppointments.B2?.map((apt: any) => ({
                            ...apt,
                            status: "cancelled"
                        })) || [],
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        E1: preBirthAppointments.E1?.map((apt: any) => ({
                            ...apt,
                            status: "cancelled"
                        })) || []
                    }

                    // Save cancelled prebirth appointments with main bookingStatus as "cancelled"
                    await preBirthBookingsApi({
                        midwifeId,
                        clientId,
                        clientET,
                        appointments: cancelledAppointments,
                        bookingStatus: "active"
                    })

                    console.log("✅ Cancelled prebirth appointments saved successfully")
                }

                // STEP 3B: Generate PostBirth Appointments NORMALLY
                console.log("📝 Step 3B: Generating postbirth appointments...")

                const postBirthServices = ["C1", "C2", "D1", "D2", "F1"] as const
                const enabledPostBirthServices = allEnabledServices.filter(s =>
                    postBirthServices.includes(s as typeof postBirthServices[number])
                )

                if (enabledPostBirthServices.length === 0) {
                    console.warn("⚠️ No post-birth services enabled for this midwife")
                    toast.warning("Midwife has no postbirth services enabled, but booking created successfully")
                } else {
                    // For postbirth, use today's date
                    const today = new Date()
                    const utcDate = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()))

                    const engine = new PostBirthBookingEngine(timeTable, enabledPostBirthServices)

                    const appointments = await engine.generatePostBirthAppointments({
                        clientET: utcDate,
                        clientId: clientId,
                        midwifeId: midwifeId ? midwifeId : "",
                        timetable: timeTable,
                        enabledServices: enabledPostBirthServices,
                        apiUrl: "api/public/PostBirthAppointments/monthly-view"
                    })

                    console.log("📅 Generated postbirth appointments:", appointments)

                    // Save postbirth appointments
                    await postBirthBookingsApi({
                        midwifeId,
                        clientId,
                        clientET: utcDate,
                        appointments
                    })

                    console.log("✅ Postbirth appointments saved successfully")
                }
            }

            // Success!
            toast.success("Client created successfully with appointments!")
            onSubmit(clientId)

        } catch (error) {
            console.error("❌ Error creating client:", error)
            const errorMessage = error instanceof Error ? error.message : "Failed to create client"
            toast.error(errorMessage)
            setIsSubmitting(false)
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-semibold mb-2">Select Care Type</h2>
                <p className="text-gray-500 text-sm">Choose the type of care for this client</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {/* Prebirth Button */}
                <button
                    onClick={() => handleCareTypeSelect("prebirth")}
                    disabled={isLoading}
                    className={`relative p-6 rounded-lg border-2 transition-all duration-200 ${data.careType === "prebirth"
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-gray-300 hover:border-primary/50 hover:shadow-sm"
                        } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                    <div className="flex flex-col items-center text-center space-y-3">
                        <div className={`p-4 rounded-full ${data.careType === "prebirth"
                            ? "bg-primary/10"
                            : "bg-gray-100"
                            }`}>
                            <Heart className={`h-8 w-8 ${data.careType === "prebirth"
                                ? "text-primary"
                                : "text-gray-600"
                                }`} />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Prebirth Care</h3>
                            <p className="text-sm text-gray-500 mt-1">
                                Prenatal care and support before delivery
                            </p>
                        </div>
                        {data.careType === "prebirth" && (
                            <div className="absolute top-3 right-3">
                                <div className="bg-primary text-white rounded-full p-1">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        )}
                    </div>
                </button>

                {/* Postbirth Button */}
                <button
                    onClick={() => handleCareTypeSelect("postbirth")}
                    disabled={isLoading}
                    className={`relative p-6 rounded-lg border-2 transition-all duration-200 ${data.careType === "postbirth"
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-gray-300 hover:border-primary/50 hover:shadow-sm"
                        } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                    <div className="flex flex-col items-center text-center space-y-3">
                        <div className={`p-4 rounded-full ${data.careType === "postbirth"
                            ? "bg-primary/10"
                            : "bg-gray-100"
                            }`}>
                            <Baby className={`h-8 w-8 ${data.careType === "postbirth"
                                ? "text-primary"
                                : "text-gray-600"
                                }`} />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Postbirth Care</h3>
                            <p className="text-sm text-gray-500 mt-1">
                                Postnatal care and support after delivery
                            </p>
                        </div>
                        {data.careType === "postbirth" && (
                            <div className="absolute top-3 right-3">
                                <div className="bg-primary text-white rounded-full p-1">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                        )}
                    </div>
                </button>
            </div>

            <div className="flex gap-2 mt-8">
                <Button
                    variant="outline"
                    onClick={onBack}
                    className="flex-1"
                    disabled={isLoading}
                >
                    Back
                </Button>
                <Button
                    onClick={handleFinalSubmit}
                    className="flex-1"
                    disabled={!data.careType || isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating Client...
                        </>
                    ) : (
                        "Create Client"
                    )}
                </Button>
            </div>
        </div>
    )
}

export default CareTypeStep