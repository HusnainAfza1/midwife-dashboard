"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreateCustomerApi } from "@/endpoints/postEndpoints"
import { GetAllMidwivesApi } from "@/endpoints/getEndpoints"
import { toast } from "sonner"
import type { CustomerFormData } from "@/types/customers"

interface AddCustomerFormProps {
    onBack: () => void
    onCustomerAdded: () => void
}

interface Midwife {
    _id: string
    personalInfo: {
        firstName: string
        lastName: string
    }
}

export default function AddCustomerForm({ onBack, onCustomerAdded }: AddCustomerFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [activeTab, setActiveTab] = useState("personal-info")
    const [midwives, setMidwives] = useState<Midwife[]>([])
    const [loadingMidwives, setLoadingMidwives] = useState(true)

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        trigger,
        formState: { errors },
    } = useForm<CustomerFormData>({
        defaultValues: {
            customerName: "",
            email: "",
            phone: "",
            dateOfBirth: "",
            address: "",
            midwifeId: "",
            et: "",
            status: "Active",
        },
    })

    const watchedValues = watch()

    // Fetch midwives on component mount
    useEffect(() => {
        const fetchMidwives = async () => {
            try {
                const response = await GetAllMidwivesApi()
                setMidwives(response.data.data || [])
            } catch (error) {
                console.error("Error fetching midwives:", error)
                toast.error("Failed to load midwives")
            } finally {
                setLoadingMidwives(false)
            }
        }

        fetchMidwives()
    }, [])

    const validatePersonalInfoTab = async () => {
        const fieldsToValidate = ["customerName", "email", "phone", "dateOfBirth", "address"]
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const isValid = await trigger(fieldsToValidate as any)

        if (!isValid) {
            toast.error("Please fill in all required fields before proceeding")
            return false
        }
        return true
    }

    const handleNextTab = async () => {
        const isValid = await validatePersonalInfoTab()
        if (isValid) {
            setActiveTab("midwife-assignment")
        }
    }

    const onSubmit = async (data: CustomerFormData) => {
        setIsLoading(true)
        try {
            await CreateCustomerApi(data)
            toast.success("Customer added successfully!")
            onCustomerAdded()
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error("Error creating customer:", error)
            toast.error(error.response?.data?.error || "Failed to add customer")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col items-start gap-y-4">
                    <Button variant="outline" size="sm" onClick={onBack}>
                        <ArrowLeft className="h-4 w-4" />
                        Back to Customers
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Add New Customer</h1>
                    </div>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)}>
                <Card>
                    <CardHeader>
                        <CardTitle>Customer Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="personal-info">Personal Information</TabsTrigger>
                                <TabsTrigger value="midwife-assignment">Midwife Assignment</TabsTrigger>
                            </TabsList>

                            {/* Personal Information Tab */}
                            <TabsContent value="personal-info" className="mt-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="customerName">Full Name *</Label>
                                        <Input
                                            id="customerName"
                                            placeholder="Enter full name"
                                            {...register("customerName", {
                                                required: "Full name is required",
                                                minLength: {
                                                    value: 2,
                                                    message: "Name must be at least 2 characters",
                                                },
                                            })}
                                        />
                                        {errors.customerName && <p className="text-sm text-red-500">{errors.customerName.message}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email *</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="Enter email address"
                                            {...register("email", {
                                                required: "Email is required",
                                                pattern: {
                                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                    message: "Invalid email address",
                                                },
                                            })}
                                        />
                                        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number *</Label>
                                        <Input
                                            id="phone"
                                            placeholder="Enter phone number"
                                            {...register("phone", {
                                                required: "Phone number is required",
                                                minLength: {
                                                    value: 10,
                                                    message: "Phone number must be at least 10 digits",
                                                },
                                            })}
                                        />
                                        {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                                        <Input
                                            id="dateOfBirth"
                                            type="date"
                                            {...register("dateOfBirth", {
                                                required: "Date of birth is required",
                                            })}
                                        />
                                        {errors.dateOfBirth && <p className="text-sm text-red-500">{errors.dateOfBirth.message}</p>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="address">Address *</Label>
                                    <Textarea
                                        id="address"
                                        placeholder="Enter full address"
                                        {...register("address", {
                                            required: "Address is required",
                                        })}
                                    />
                                    {errors.address && <p className="text-sm text-red-500">{errors.address.message}</p>}
                                </div>

                                <div className="flex justify-end">
                                    <Button type="button" onClick={handleNextTab}>
                                        Next: Midwife Assignment
                                    </Button>
                                </div>
                            </TabsContent>

                            {/* Midwife Assignment Tab */}
                            <TabsContent value="midwife-assignment" className="mt-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="midwifeId">Assigned Midwife *</Label>
                                        <Select
                                            onValueChange={(value) => setValue("midwifeId", value)}
                                            value={watchedValues.midwifeId}
                                            disabled={loadingMidwives}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder={loadingMidwives ? "Loading midwives..." : "Select a midwife"} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {midwives.map((midwife) => (
                                                    <SelectItem key={midwife._id} value={midwife._id}>
                                                        {`${midwife.personalInfo.firstName} ${midwife.personalInfo.lastName}`}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.midwifeId && <p className="text-sm text-red-500">Please select a midwife</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="et">Expected Term (ET) Date *</Label>
                                        <Input
                                            id="et"
                                            type="date"
                                            {...register("et", {
                                                required: "ET date is required",
                                            })}
                                        />
                                        {errors.et && <p className="text-sm text-red-500">{errors.et.message}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="status">Status</Label>
                                        <Select
                                            onValueChange={(value) => setValue("status", value as "Active" | "Inactive" | "Completed")}
                                            value={watchedValues.status}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Active">Active</SelectItem>
                                                <SelectItem value="Inactive">Inactive</SelectItem>
                                                <SelectItem value="Completed">Completed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="flex justify-between">
                                    <Button type="button" variant="outline" onClick={() => setActiveTab("personal-info")}>
                                        Previous: Personal Info
                                    </Button>
                                    <Button type="submit" disabled={isLoading}>
                                        {isLoading ? "Creating Customer..." : "Create Customer"}
                                    </Button>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </form>
        </div>
    )
}
