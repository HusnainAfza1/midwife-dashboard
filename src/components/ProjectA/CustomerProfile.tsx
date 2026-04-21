"use client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GetCustomerAppointmentsApi } from "@/endpoints/getEndpoints"
import type { Customer, CustomerAppointment } from "@/types/customers"
import { ArrowLeft, Calendar, List } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

interface CustomerProfileProps {
    customer: Customer
    onBack: () => void
}

export default function CustomerProfile({ customer, onBack }: CustomerProfileProps) {
    const [appointments, setAppointments] = useState<CustomerAppointment[]>([])
    const [loading, setLoading] = useState(true)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [calendarDate, setCalendarDate] = useState<Date>(new Date())
    const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar")

    useEffect(() => {
        fetchAppointments()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customer._id])

    const fetchAppointments = async () => {
        try {
            setLoading(true)
            const response = await GetCustomerAppointmentsApi(customer._id)
            setAppointments(response.data.appointments || [])
        } catch (err) {
            console.error("Error fetching appointments:", err)
            toast.error("Failed to fetch appointments")
        } finally {
            setLoading(false)
        }
    }

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
    }

    const getAppointmentColor = (serviceCode: string) => {
        const colors: Record<string, string> = {
            "A1/A2": "bg-blue-500",
            B1: "bg-green-500",
            B2: "bg-green-400",
            C1: "bg-red-500",
            C2: "bg-red-400",
            D1: "bg-purple-500",
            D2: "bg-purple-400",
            E1: "bg-yellow-500",
            E2: "bg-yellow-400",
            F1: "bg-pink-500",
            F2: "bg-pink-400",
            G: "bg-orange-500",
            H: "bg-gray-500",
            I: "bg-indigo-500",
        }
        return colors[serviceCode] || "bg-gray-400"
    }

    const getAppointmentsForDate = (date: Date) => {
        const dateStr = date.toISOString().split("T")[0]
        return appointments.filter((apt) => apt.date.startsWith(dateStr))
    }

    const renderCalendarView = () => (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Input placeholder="01/01/2025" className="w-32" value={calendarDate.toLocaleDateString()} readOnly />
                    <span>to</span>
                    <Input
                        placeholder="12/31/2025"
                        className="w-32"
                        value={new Date(calendarDate.getFullYear(), 11, 31).toLocaleDateString()}
                        readOnly
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant={viewMode === "calendar" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewMode("calendar")}
                    >
                        <Calendar className="h-4 w-4 mr-2" />
                        Calendar View
                    </Button>
                    <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
                        <List className="h-4 w-4 mr-2" />
                        List View
                    </Button>
                </div>
            </div>

            {viewMode === "calendar" ? (
                <div className="grid grid-cols-7 gap-2">
                    {/* Calendar header */}
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                        <div key={day} className="p-2 text-center font-medium text-sm text-gray-600">
                            {day}
                        </div>
                    ))}

                    {/* Calendar days */}
                    {Array.from({ length: 35 }, (_, i) => {
                        const date = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), i - 6)
                        const dayAppointments = getAppointmentsForDate(date)
                        const isCurrentMonth = date.getMonth() === calendarDate.getMonth()

                        return (
                            <div
                                key={i}
                                className={`min-h-[100px] p-2 border rounded-lg ${isCurrentMonth ? "bg-white" : "bg-gray-50"}`}
                            >
                                <div className={`text-sm ${isCurrentMonth ? "text-gray-900" : "text-gray-400"}`}>{date.getDate()}</div>
                                <div className="space-y-1 mt-1">
                                    {dayAppointments.map((apt) => (
                                        <div
                                            key={apt._id}
                                            className={`text-xs p-1 rounded text-white ${getAppointmentColor(apt.serviceCode || apt.serviceType)}`}
                                        >
                                            {apt.startTime || apt.time} {apt.serviceCode || apt.serviceType}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className="space-y-2">
                    {appointments.map((apt) => (
                        <Card key={apt._id}>
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div
                                            className={`w-3 h-3 rounded-full ${getAppointmentColor(apt.serviceCode || apt.serviceType)}`}
                                        />
                                        <div>
                                            <p className="font-medium">{apt.serviceTitle || apt.serviceType}</p>
                                            <p className="text-sm text-gray-600">
                                                {new Date(apt.date).toLocaleDateString()} at {apt.startTime || apt.time}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge
                                        variant={
                                            apt.status === "Completed" ? "secondary" : apt.status === "Scheduled" ? "default" : "destructive"
                                        }
                                    >
                                        {apt.status}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Legend */}
            <div className="mt-6">
                <h4 className="font-medium mb-2">Service Legend</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    {[
                        { code: "A1/A2", name: "Onboarding" },
                        { code: "B1", name: "Pre-birth (in person)" },
                        { code: "B2", name: "Pre-birth (video)" },
                        { code: "C1", name: "Early Care (in person)" },
                        { code: "C2", name: "Early Care (video)" },
                        { code: "D1", name: "Late Care (in person)" },
                        { code: "D2", name: "Late Care (video)" },
                        { code: "G", name: "Consultation" },
                        { code: "H", name: "Emergency" },
                        { code: "I", name: "Private Services" },
                    ].map((service) => (
                        <div key={service.code} className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${getAppointmentColor(service.code)}`} />
                            <span>{service.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col items-start gap-4">
                <Button variant="outline" size="sm" onClick={onBack}>
                    <ArrowLeft className="h-4 w-4" />
                    Back to Customers
                </Button>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold">Customer Profile</h1>
                </div>
            </div>

            {/* Customer Info Card */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                            {getInitials(customer.customerName)}
                        </div>
                        <div className="flex-1">
                            <h2 className="text-xl font-bold">{customer.customerName}</h2>
                            <div className="flex items-center space-x-6 mt-2 text-sm text-gray-600">
                                <span>📧 ID: {customer.customerId}</span>
                                <span>📧 {customer.email}</span>
                                <span>📞 {customer.phone}</span>
                                <span>📅 ET: {new Date(customer.et).toLocaleDateString()}</span>
                                <Badge
                                    variant={
                                        customer.status === "Active"
                                            ? "default"
                                            : customer.status === "Completed"
                                                ? "secondary"
                                                : "destructive"
                                    }
                                >
                                    {customer.status}
                                </Badge>
                                <span>👩‍⚕️ Midwife: {customer.midwifeName}</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="appointments">Appointments</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <span>👤</span>
                                <span>Personal Information</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-gray-600">Full Name:</label>
                                    <p className="font-medium">{customer.customerName}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-600">Date of Birth:</label>
                                    <p className="font-medium">{new Date(customer.dateOfBirth).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-600">Email:</label>
                                    <p className="font-medium">{customer.email}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-600">Phone:</label>
                                    <p className="font-medium">{customer.phone}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-600">Address:</label>
                                    <p className="font-medium">{customer.address}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="appointments" className="space-y-4">
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                        </div>
                    ) : (
                        renderCalendarView()
                    )}
                </TabsContent>
            </Tabs>
        </div>
    )
}
