"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { SpinnerButton } from "@/components/uiUtils/SpinnerButton"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import type { AddMidwifeFormData, BankInfo, MoreInfo, Testimonial, SocialLinks, FAQ } from "@/types/addMidwifes"
import { validateProfileCompletion } from "@/utils/validationUtils"
import type React from "react"
import { useState, useRef } from "react"
import { Plus, Trash2, ArrowUpFromLine, Loader2, Facebook, Twitter, Instagram, Linkedin, HelpCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import axios from "axios"
import { toast } from "sonner"
import Image from "next/image"

interface MoreInfoTabProps {
    formData: AddMidwifeFormData
    onBankInfoChange: (data: Partial<BankInfo>) => void
    onMoreInfoChange: (data: Partial<MoreInfo>) => void
    onFormDataChange: (data: Partial<AddMidwifeFormData>) => void
    onBack: () => void
    onSubmit: (e: React.FormEvent) => void
    isSubmitting?: boolean
    isEditMode?: boolean
}

// Remove DEFAULT_FAQS from here since it's now handled in the main form

const MoreInfoTab = ({
    formData,
    onBankInfoChange,
    onMoreInfoChange,
    onFormDataChange,
    onBack,
    onSubmit,
    isSubmitting = false,
}: MoreInfoTabProps) => {
    // Initialize local state from props
    const [localBankInfo, setLocalBankInfo] = useState<BankInfo>(formData.bankInfo)
    const [localMoreInfo, setLocalMoreInfo] = useState<MoreInfo>(formData.moreInfo)
    const [localTestimonials, setLocalTestimonials] = useState<Testimonial[]>(
        formData.testimonials || []
    )
    const [localSocialLinks, setLocalSocialLinks] = useState<SocialLinks>(
        formData.socialLinks || {
            facebook: "",
            twitter: "",
            instagram: "",
            linkedin: ""
        }
    )
    // Initialize FAQs directly from formData (defaults are handled in main form)
    const [localFAQs, setLocalFAQs] = useState<FAQ[]>(formData.faqs || [])
    const [showDialog, setShowDialog] = useState(false)
    const [validationResult, setValidationResult] = useState<{
        isProfileComplete: boolean;
        missingFields: Array<{ tabName: string, fieldName: string }>
    }>({ isProfileComplete: true, missingFields: [] })
    const [submissionEvent, setSubmissionEvent] = useState<React.FormEvent | null>(null)

    // Upload states
    const [uploadingImageIndex, setUploadingImageIndex] = useState<number | null>(null)
    const fileInputRefs = useRef<(HTMLInputElement | null)[]>([])

    // Immediately update parent state when local state changes
    const handleBankInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        const updatedBankInfo = { ...localBankInfo, [name]: value }
        setLocalBankInfo(updatedBankInfo)
        // Immediately update parent state
        onBankInfoChange({ [name]: value })
    }

    const handleMoreInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        const updatedMoreInfo = { ...localMoreInfo, [name]: value }
        setLocalMoreInfo(updatedMoreInfo)
        // Immediately update parent state
        onMoreInfoChange({ [name]: value })
    }

    // Handle social links changes
    const handleSocialLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target

        // Update local state
        const updatedSocialLinks = { ...localSocialLinks, [name]: value }
        setLocalSocialLinks(updatedSocialLinks)

        // Update parent state directly with the formData
        onFormDataChange({ socialLinks: updatedSocialLinks })
    }

    // Handle testimonial changes
    const handleTestimonialChange = (index: number, field: keyof Testimonial, value: string) => {
        const updatedTestimonials = [...localTestimonials]
        updatedTestimonials[index] = {
            ...updatedTestimonials[index],
            [field]: value
        }
        setLocalTestimonials(updatedTestimonials)
        // Update parent state
        onFormDataChange({ testimonials: updatedTestimonials })
    }

    // Add a new testimonial
    const addTestimonial = () => {
        const newTestimonial: Testimonial = {
            name: "",
            profileImage: {
                url: "",
                public_id: "",
                name: ""
            },
            designation: "",
            description: ""
        }
        const updatedTestimonials = [...localTestimonials, newTestimonial]
        setLocalTestimonials(updatedTestimonials)
        onFormDataChange({ testimonials: updatedTestimonials })
    }

    // Remove a testimonial
    const removeTestimonial = (index: number) => {
        const updatedTestimonials = localTestimonials.filter((_, i) => i !== index)
        setLocalTestimonials(updatedTestimonials)
        onFormDataChange({ testimonials: updatedTestimonials })
    }

    // FAQ handling functions
    const handleFAQChange = (index: number, field: keyof FAQ, value: string) => {
        const updatedFAQs = [...localFAQs]
        updatedFAQs[index] = {
            ...updatedFAQs[index],
            [field]: value
        }
        setLocalFAQs(updatedFAQs)
        // Update parent state
        onFormDataChange({ faqs: updatedFAQs })
    }

    // Add a new FAQ
    const addFAQ = () => {
        const newFAQ: FAQ = {
            question: "",
            answer: ""
        }
        const updatedFAQs = [...localFAQs, newFAQ]
        setLocalFAQs(updatedFAQs)
        onFormDataChange({ faqs: updatedFAQs })
    }

    // Remove an FAQ
    const removeFAQ = (index: number) => {
        const updatedFAQs = localFAQs.filter((_, i) => i !== index)
        setLocalFAQs(updatedFAQs)
        onFormDataChange({ faqs: updatedFAQs })
    }

    // Handle image upload click
    const handleImageClick = (index: number) => {
        if (fileInputRefs.current[index]) {
            fileInputRefs.current[index]?.click()
        }
    }

    // Handle image file change
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { files } = e.target
        if (files && files.length > 0) {
            const file = files[0]
            const reader = new FileReader()

            try {
                setUploadingImageIndex(index)

                reader.onloadend = async () => {
                    try {
                        // Upload to Cloudinary via API
                        const response = await axios.post("/api/upload", {
                            image: reader.result,
                            folder: `midwife-dash/testimonials`,
                        })

                        if (response.data.success) {
                            // Update the testimonial with image info
                            const updatedTestimonials = [...localTestimonials]
                            updatedTestimonials[index] = {
                                ...updatedTestimonials[index],
                                profileImage: {
                                    url: response.data.url,
                                    public_id: response.data.public_id,
                                    name: file.name,
                                }
                            }

                            setLocalTestimonials(updatedTestimonials)
                            onFormDataChange({ testimonials: updatedTestimonials })
                            toast.success("Image uploaded successfully")
                        } else {
                            toast.error("Failed to upload image")
                        }
                    } catch (error) {
                        console.error("Error uploading image:", error)
                        toast.error("Error uploading image")
                    } finally {
                        setUploadingImageIndex(null)
                    }
                }

                reader.readAsDataURL(file)
            } catch (error) {
                console.error("Error processing image:", error)
                toast.error("Error processing image")
                setUploadingImageIndex(null)
            }
        }
    }

    const handleSubmitForm = async (e: React.FormEvent) => {
        e.preventDefault()

        // No need to call handleSave since changes are already synchronized

        // Call validation function with current formData
        const result = validateProfileCompletion(formData)

        // Update the isProfileComplete field in the parent state
        onFormDataChange({ isProfileComplete: result.isProfileComplete })
        console.log("Setting isProfileComplete to:", result.isProfileComplete);

        if (result.isProfileComplete) {
            // If profile is complete, submit normally
            onSubmit(e)
        } else {
            // If profile is incomplete, show dialog
            setValidationResult(result)
            setSubmissionEvent(e) // Store the event for later use
            setShowDialog(true)
        }
    }

    return (
        <>
            <form onSubmit={handleSubmitForm} className="space-y-8">
                <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Bank Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="accountHolderName">Account Holder Name</Label>
                            <Input
                                id="accountHolderName"
                                name="accountHolderName"
                                value={localBankInfo.accountHolderName}
                                onChange={handleBankInfoChange}
                                placeholder="Enter account holder name"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bankName">Bank Name</Label>
                            <Input
                                id="bankName"
                                name="bankName"
                                value={localBankInfo.bankName}
                                onChange={handleBankInfoChange}
                                placeholder="Enter bank name"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="accountNumber">Account Number</Label>
                            <Input
                                id="accountNumber"
                                name="accountNumber"
                                value={localBankInfo.accountNumber}
                                onChange={handleBankInfoChange}
                                placeholder="Enter account number"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="routingNumber">Routing Number</Label>
                            <Input
                                id="routingNumber"
                                name="routingNumber"
                                value={localBankInfo.routingNumber}
                                onChange={handleBankInfoChange}
                                placeholder="Enter routing number"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Professional Background & Experience </h2>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="acupuncture">Acupuncture</Label>
                            <Input
                                id="acupuncture"
                                name="acupuncture"
                                value={localMoreInfo.acupuncture}
                                onChange={handleMoreInfoChange}
                                placeholder="Enter acupuncture information"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="professionalExperience">Professional Experience</Label>
                            <Textarea
                                id="professionalExperience"
                                name="professionalExperience"
                                value={localMoreInfo.professionalExperience}
                                onChange={handleMoreInfoChange}
                                placeholder="Describe your professional experience"
                                rows={4}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="message">Additional Message</Label>
                            <Textarea
                                id="message"
                                name="message"
                                value={localMoreInfo.message}
                                onChange={handleMoreInfoChange}
                                placeholder="Any additional information you'd like to share"
                                rows={4}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="supportedPregnancies">Supported Pregnancies</Label>
                            <Input
                                id="supportedPregnancies"
                                name="supportedPregnancies"
                                type="number"
                                value={localMoreInfo.supportedPregnancies ?? ""}
                                onChange={handleMoreInfoChange}
                                placeholder="Enter number of supported pregnancies"
                                min={0}
                            />
                        </div>

                    </div>
                </div>

                <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Social Media Links</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label
                                htmlFor="facebook"
                                className="flex items-center gap-2"
                            >
                                <Facebook className="h-4 w-4 text-blue-600" />
                                Facebook
                            </Label>
                            <Input
                                id="facebook"
                                name="facebook"
                                value={localSocialLinks.facebook}
                                onChange={handleSocialLinkChange}
                                placeholder="https://facebook.com/your-profile"
                                type="url"
                                pattern="https?://.+"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label
                                htmlFor="twitter"
                                className="flex items-center gap-2"
                            >
                                <Twitter className="h-4 w-4 text-blue-400" />
                                Twitter
                            </Label>
                            <Input
                                id="twitter"
                                name="twitter"
                                value={localSocialLinks.twitter}
                                onChange={handleSocialLinkChange}
                                placeholder="https://twitter.com/your-handle"
                                type="url"
                                pattern="https?://.+"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label
                                htmlFor="instagram"
                                className="flex items-center gap-2"
                            >
                                <Instagram className="h-4 w-4 text-pink-600" />
                                Instagram
                            </Label>
                            <Input
                                id="instagram"
                                name="instagram"
                                value={localSocialLinks.instagram}
                                onChange={handleSocialLinkChange}
                                placeholder="https://instagram.com/your-handle"
                                type="url"
                                pattern="https?://.+"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label
                                htmlFor="linkedin"
                                className="flex items-center gap-2"
                            >
                                <Linkedin className="h-4 w-4 text-blue-700" />
                                LinkedIn
                            </Label>
                            <Input
                                id="linkedin"
                                name="linkedin"
                                value={localSocialLinks.linkedin}
                                onChange={handleSocialLinkChange}
                                placeholder="https://linkedin.com/in/your-profile"
                                type="url"
                                pattern="https?://.+"
                            />
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <HelpCircle className="h-5 w-5 text-blue-600" />
                            Frequently Asked Questions
                        </h2>
                        <Button
                            type="button"
                            onClick={addFAQ}
                            size="sm"
                            className="flex items-center gap-1"
                        >
                            <Plus className="h-4 w-4" /> Add FAQ
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {localFAQs.length === 0 && (
                            <div className="text-center py-8 bg-muted/50 rounded-lg">
                                <p className="text-muted-foreground">No FAQs added yet. Add some frequently asked questions.</p>
                            </div>
                        )}

                        {localFAQs.map((faq, index) => (
                            <Card key={index} className="relative">
                                <button
                                    type="button"
                                    onClick={() => removeFAQ(index)}
                                    className="absolute top-3 right-3 p-1 rounded-full bg-white shadow-md hover:bg-muted z-10"
                                    aria-label="Remove FAQ"
                                >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </button>

                                <CardContent className="p-6 pr-12">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor={`faq-${index}-question`}>Question</Label>
                                            <Input
                                                id={`faq-${index}-question`}
                                                value={faq.question}
                                                onChange={(e) => handleFAQChange(index, 'question', e.target.value)}
                                                placeholder="Enter your question"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor={`faq-${index}-answer`}>Answer</Label>
                                            <Textarea
                                                id={`faq-${index}-answer`}
                                                value={faq.answer}
                                                onChange={(e) => handleFAQChange(index, 'answer', e.target.value)}
                                                placeholder="Enter the answer to this question"
                                                rows={3}
                                                className="resize-none"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {localFAQs.length > 0 && localFAQs.length < 3 && (
                            <p className="text-sm text-amber-600">
                                Please add at least {3 - localFAQs.length} more FAQ(s) (minimum 3 required).
                            </p>
                        )}
                    </div>
                </div>

                {/* Testimonials Section */}
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Testimonials</h2>
                        <Button
                            type="button"
                            onClick={addTestimonial}
                            size="sm"
                            className="flex items-center gap-1"
                        >
                            <Plus className="h-4 w-4" /> Add Testimonial
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {localTestimonials.length === 0 && (
                            <div className="text-center py-8 bg-muted/50 rounded-lg">
                                <p className="text-muted-foreground">No testimonials added yet. Add a minimum of 3 testimonials.</p>
                            </div>
                        )}

                        {localTestimonials.map((testimonial, index) => (
                            <Card key={index} className="relative overflow-hidden">
                                <button
                                    type="button"
                                    onClick={() => removeTestimonial(index)}
                                    className="absolute top-3 right-3  rounded-full bg-white shadow-md hover:bg-muted z-10"
                                    aria-label="Remove testimonial"
                                >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </button>

                                <CardContent className="p-0">
                                    <div className="flex flex-col">
                                        {/* Image Upload Section - Takes full width at top with proper padding */}
                                        <div className="w-full p-9 ">
                                            <div className="border-2 border-dashed rounded-md p-4 flex flex-col items-center justify-center">
                                                {uploadingImageIndex === index ? (
                                                    <div className="flex flex-col items-center py-6">
                                                        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
                                                        <p className="text-sm text-gray-600">Uploading image...</p>
                                                    </div>
                                                ) : testimonial.profileImage?.url ? (
                                                    <div className="flex flex-col items-center py-2">
                                                        <div className="w-28 h-28 mb-3 overflow-hidden rounded-md">
                                                            <Image
                                                                src={testimonial.profileImage.url || "/placeholder.svg"}
                                                                width={200}
                                                                height={200}
                                                                alt="Profile preview"
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <p className="text-xs text-gray-600 truncate max-w-full">{testimonial.profileImage.name}</p>
                                                    </div>
                                                ) : (
                                                    <div className="py-6 flex flex-col items-center">
                                                        <ArrowUpFromLine className="h-8 w-8 text-gray-400 mb-3" />
                                                        <p className="text-sm text-gray-500">Upload testimonial image</p>
                                                    </div>
                                                )}

                                                <input
                                                    ref={el => { fileInputRefs.current[index] = el; }}
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => handleFileChange(e, index)}
                                                    className="hidden"
                                                />

                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleImageClick(index)}
                                                    className="mt-2"
                                                    disabled={uploadingImageIndex === index}
                                                >
                                                    {testimonial.profileImage?.url ? "Change Image" : "Upload Image"}
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Bottom section with two columns */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 pt-4">
                                            {/* Left Column - Name and Designation */}
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor={`testimonial-${index}-name`}>Name</Label>
                                                    <Input
                                                        id={`testimonial-${index}-name`}
                                                        value={testimonial.name}
                                                        onChange={(e) => handleTestimonialChange(index, 'name', e.target.value)}
                                                        placeholder="Enter name"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor={`testimonial-${index}-designation`}>Designation</Label>
                                                    <Input
                                                        id={`testimonial-${index}-designation`}
                                                        value={testimonial.designation}
                                                        onChange={(e) => handleTestimonialChange(index, 'designation', e.target.value)}
                                                        placeholder="Enter designation"
                                                    />
                                                </div>
                                            </div>

                                            {/* Right Column - Description */}
                                            <div className="space-y-2">
                                                <Label htmlFor={`testimonial-${index}-description`}>Description</Label>
                                                <Textarea
                                                    id={`testimonial-${index}-description`}
                                                    value={testimonial.description}
                                                    onChange={(e) => handleTestimonialChange(index, 'description', e.target.value)}
                                                    placeholder="Enter testimonial description"
                                                    rows={5}
                                                    className="resize-none"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {localTestimonials.length > 0 && localTestimonials.length < 3 && (
                            <p className="text-sm text-amber-600">
                                Please add at least {3 - localTestimonials.length} more testimonials (minimum 3 required).
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex justify-between pt-4">
                    <Button type="button" variant="outline" onClick={onBack}>
                        Back
                    </Button>
                    <SpinnerButton
                        state={isSubmitting}
                        name="Submit"
                    />
                </div>
            </form>

            {/* Dialog for incomplete profile */}
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Incomplete Profile</DialogTitle>
                        <DialogDescription>
                            Some required fields are missing. You can either continue with incomplete information or go back and fill in the missing fields.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4 max-h-60 overflow-y-auto">
                        <h3 className="font-semibold mb-2">Missing fields:</h3>
                        {validationResult.missingFields.map((item, index) => (
                            <div key={index} className="mb-2">
                                <span className="font-medium">{item.tabName}:</span> {item.fieldName}
                            </div>
                        ))}
                    </div>

                    <DialogFooter className="flex sm:justify-between">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowDialog(false)}
                        >
                            Complete Now
                        </Button>
                        <Button
                            type="button"
                            onClick={() => {
                                setShowDialog(false);
                                if (submissionEvent) {
                                    // We're submitting with incomplete profile, so we need to ensure 
                                    // isProfileComplete is set to false
                                    onFormDataChange({ isProfileComplete: false });
                                    onSubmit(submissionEvent); // Proceed with submission despite missing fields
                                }
                            }}
                        >
                            Complete later
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default MoreInfoTab