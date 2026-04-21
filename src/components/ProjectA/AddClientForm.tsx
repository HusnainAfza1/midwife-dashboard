
"use client"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { ClientFormData } from "./AddClientStates/types"
import SignUpStep from "./AddClientStates/SignUpStep"
import DateAddressStep from "./AddClientStates/DateAddressStep"
import InsuranceDetailsStep from "./AddClientStates/InsuranceDetailsStep"
import CareTypeStep from "./AddClientStates/CareTypeStep"

interface AddClientFormProps {
    onCancel: () => void
    onSuccess?: (clientId: string) => void
}

const AddClientForm = ({ onCancel, onSuccess }: AddClientFormProps) => {
    const [currentStep, setCurrentStep] = useState(1)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState<ClientFormData>({
        username: "",
        fullName: "",
        email: "",
        password: "",
        expectedDate: "",
        googleAddress: null,
        selectedMidwife: null,
        phoneNumber: "",
        insuranceNumber: "",
        insuranceCompany: "",
        insuranceType: "",
        careType: ""
    })

    const updateFormData = (field: Partial<ClientFormData>) => {
        setFormData(prev => ({ ...prev, ...field }))
    }

    const handleNext = () => {
        setCurrentStep(prev => prev + 1)
    }

    const handleBack = () => {
        setCurrentStep(prev => prev - 1)
    }

    const handleSubmit = async (clientId: string) => {
        setIsSubmitting(false)
        onSuccess?.(clientId)
    }

    const steps = [
        { number: 1, label: "Sign Up" },
        { number: 2, label: "Details" },
        { number: 3, label: "Insurance" },
        { number: 4, label: "Care Type" }
    ]

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-sm">
            {/* Progress Stepper */}
            <div className="mb-8">
                {/* Step circles and connecting lines */}
                <div className="flex items-center justify-between mb-4">
                    {steps.map((step, index) => (
                        <div key={step.number} className="flex items-center" style={{ width: index === steps.length - 1 ? 'auto' : '100%' }}>
                            {/* Step Circle */}
                            <div className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-semibold transition-colors ${
                                step.number <= currentStep 
                                    ? "bg-primary text-white" 
                                    : "bg-gray-200 text-gray-600"
                            }`}>
                                {step.number}
                            </div>
                            
                            {/* Connecting Line (not after last step) */}
                            {index !== steps.length - 1 && (
                                <div className={`h-1 flex-1 mx-3 transition-colors ${
                                    step.number < currentStep ? "bg-primary" : "bg-gray-200"
                                }`} />
                            )}
                        </div>
                    ))}
                </div>

                {/* Step Labels */}
                <div className="flex justify-between">
                    {steps.map((step) => (
                        <div 
                            key={step.number} 
                            className="flex justify-center" 
                            style={{ width: '80px' }}
                        >
                            <span className={`text-sm text-center transition-colors ${
                                currentStep === step.number 
                                    ? "font-semibold text-gray-900" 
                                    : "text-gray-500"
                            }`}>
                                {step.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Step content */}
            {currentStep === 1 && (
                <SignUpStep 
                    data={formData} 
                    updateData={updateFormData}
                    onNext={handleNext}
                />
            )}
            
            {currentStep === 2 && (
                <DateAddressStep 
                    data={formData} 
                    updateData={updateFormData}
                    onNext={handleNext}
                    onBack={handleBack}
                />
            )}
            
            {currentStep === 3 && (
                <InsuranceDetailsStep 
                    data={formData} 
                    updateData={updateFormData}
                    onNext={handleNext}
                    onBack={handleBack}
                />
            )}
            
            {currentStep === 4 && (
                <CareTypeStep 
                    data={formData} 
                    updateData={updateFormData}
                    onBack={handleBack}
                    onSubmit={handleSubmit}
                    setIsSubmitting={setIsSubmitting}
                />
            )}

            {/* Cancel button */}
            <div className="mt-6 pt-6 border-t">
                <Button 
                    variant="ghost" 
                    onClick={onCancel}
                    disabled={isSubmitting}
                    className="w-full"
                >
                    Cancel
                </Button>
            </div>
        </div>
    )
}

export default AddClientForm