"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type React from "react"
import { useState } from "react"

interface PersonalInfoTabProps {
    onBack: () => void
    onContinue: () => void
}

interface PersonalInfo {
    accountHolderName: string
    bankName: string
    accountNumber: string
    routingNumber: string
}

const BankInfoTab = ({ onBack , onContinue }: PersonalInfoTabProps) => {

    const [formData, setFormData] = useState<PersonalInfo>({
        accountHolderName: "",
        bankName: "",
        accountNumber: "",
        routingNumber: "",
    })
    const [errors, setErrors] = useState<Record<string, boolean>>({})

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: false
            }))
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const newErrors: Record<string, boolean> = {}
        let hasError = false

        // Check each required field
        const requiredFields = [
            'accountHolderName', 'bankName', 'accountNumber', 'routingNumber'
        ] as const

        requiredFields.forEach(field => {
            if (!formData[field].trim()) {
                newErrors[field] = true
                hasError = true
            }
        })    

        console.log("Form Data:", formData)
        // If there are errors, show them and don't continue
        if (hasError) {
            setErrors(newErrors)
            return
        }
        onContinue()
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="block text-sm font-medium mb-1">Account Holder Name</label>
                    <Input
                        name="accountHolderName"
                        value={formData.accountHolderName}
                        onChange={handleChange}
                        className={errors.accountHolderName ? "border-red-500" : ""}
                        placeholder="Ayaza" />
                    {errors.accountHolderName && (
                        <p className="text-red-500 text-sm mt-1">Account Holder Name is required</p>)}
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Bank Name</label>
                    <Input
                        name="bankName"
                        value={formData.bankName}
                        onChange={handleChange}
                        className={errors.bankName ? "border-red-500" : ""}
                        placeholder="bank 22" />
                    {errors.bankName && (
                        <p className="text-red-500 text-sm mt-1">Bank Name is required</p>)}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="block text-sm font-medium mb-1">Account Number/IBAN</label>
                    <Input
                        name="accountNumber"
                        value={formData.accountNumber}
                        onChange={handleChange}
                        className={errors.accountNumber ? "border-red-500" : ""}
                        placeholder="031012222332" />
                    {errors.accountNumber && (
                        <p className="text-red-500 text-sm mt-1">Account Number is required</p>)}
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Routing Number</label>
                    <Input
                        name="routingNumber"
                        value={formData.routingNumber}
                        onChange={handleChange}
                        className={errors.routingNumber ? "border-red-500" : ""}
                        placeholder="951" />
                    {errors.routingNumber && (
                        <p className="text-red-500 text-sm mt-1">Routing Number is required</p>)}
                </div>
            </div>

            <div className="flex justify-between pt-6">
                <Button type="button" variant="outline" onClick={onBack}>
                    Back
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                    Continue
                </Button>
            </div>
        </form>
    )
}

export default BankInfoTab