// components/AddClient/InsuranceDetailsStep.tsx
"use client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { ClientFormData } from "./types"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface InsuranceDetailsStepProps {
    data: ClientFormData
    updateData: (field: Partial<ClientFormData>) => void
    onNext: () => void
    onBack: () => void
}

const InsuranceDetailsStep = ({ data, updateData, onNext, onBack }: InsuranceDetailsStepProps) => {
    const handleNext = () => {
        // Validation
        if (!data.phoneNumber.trim()) {
            toast.error("Phone number is required")
            return
        }
        // Basic phone validation (adjust regex based on your requirements)
        const phoneRegex = /^[0-9+\s()-]{10,}$/
        if (!phoneRegex.test(data.phoneNumber)) {
            toast.error("Please enter a valid phone number")
            return
        }
        if (!data.insuranceNumber.trim()) {
            toast.error("Insurance number is required")
            return
        }
        if (!data.insuranceCompany.trim()) {
            toast.error("Insurance company is required")
            return
        }
        if (!data.insuranceType) {
            toast.error("Insurance type is required")
            return
        }
        
        onNext()
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-semibold mb-2">Insurance Details</h2>
                <p className="text-gray-500 text-sm">Enter the client&lsquo;s insurance and contact information</p>
            </div>
            
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number *</Label>
                    <Input
                        id="phoneNumber"
                        type="tel"
                        value={data.phoneNumber}
                        onChange={(e) => updateData({ phoneNumber: e.target.value })}
                        placeholder="Enter phone number"
                        className="w-full"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="insuranceNumber">Insurance Number *</Label>
                    <Input
                        id="insuranceNumber"
                        value={data.insuranceNumber}
                        onChange={(e) => updateData({ insuranceNumber: e.target.value })}
                        placeholder="Enter insurance number"
                        className="w-full"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="insuranceCompany">Insurance Company *</Label>
                    <Input
                        id="insuranceCompany"
                        value={data.insuranceCompany}
                        onChange={(e) => updateData({ insuranceCompany: e.target.value })}
                        placeholder="Enter insurance company name"
                        className="w-full"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="insuranceType">Insurance Type *</Label>
                    <Select
                        value={data.insuranceType}
                        onValueChange={(value) => updateData({ insuranceType: value as "private" | "government" })}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select insurance type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="private">
                                Private Insurance
                            </SelectItem>
                            <SelectItem value="government">
                                Government Insurance
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="flex gap-2 mt-6">
                <Button variant="outline" onClick={onBack} className="flex-1">
                    Back
                </Button>
                <Button onClick={handleNext} className="flex-1">
                    Next: Select Care Type
                </Button>
            </div>
        </div>
    )
}

export default InsuranceDetailsStep