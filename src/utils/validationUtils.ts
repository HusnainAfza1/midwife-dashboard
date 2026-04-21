import type { AddMidwifeFormData, BankInfo, MoreInfo } from "@/types"

export const validateProfileCompletion = (formData: AddMidwifeFormData) => {
    const requiredFieldsMap = {
        "personal-info": [
            { field: "firstName", label: "First Name" },
            { field: "lastName", label: "Last Name" },
            { field: "email", label: "Email" },
            { field: "phone", label: "Phone" },
            { field: "address", label: "Address" },
            { field: "googleAddress", label: "Google Address" }, // Added googleAddress validation
            { field: "serviceRadius", label: "Service Radius" }
        ],
        "midwife-type": [
            { field: "midwifeType", label: "Midwife Type" },
        ],
        "intensity": [
            { field: "intensity", label: "Intensity" },
        ],
        "more-info": [
            { field: "accountHolderName", label: "Account Holder Name", section: "bankInfo" },
            { field: "bankName", label: "Bank Name", section: "bankInfo" },
            { field: "accountNumber", label: "Account Number", section: "bankInfo" },
            { field: "routingNumber", label: "Routing Number", section: "bankInfo" },
            { field: "professionalExperience", label: "Professional Experience", section: "moreInfo" },
            { field: "message", label: "Message", section: "moreInfo" },
            { field: "supportedPregnancies", label: "Supported Pregnancies", section: "moreInfo" }
        ]
    };

    const missingFields: Array<{ tabName: string, fieldName: string }> = [];

    // Check personal info fields
    requiredFieldsMap["personal-info"].forEach(({ field, label }) => {
        if (field === "googleAddress") {
            // Special validation for googleAddress object
            const googleAddress = formData.personalInfo[field as keyof typeof formData.personalInfo];
            if (!googleAddress ||
                typeof googleAddress === 'string' ||
                !('fullAddress' in googleAddress) ||
                !('placeId' in googleAddress) ||
                !googleAddress.fullAddress ||
                !googleAddress.placeId) {
                missingFields.push({ tabName: "Personal Info", fieldName: label });
            }
        } else {
            // Regular field validation
            if (!formData.personalInfo[field as keyof typeof formData.personalInfo]) {
                missingFields.push({ tabName: "Personal Info", fieldName: label });
            }
        }
    });

    // Check midwife type fields
    requiredFieldsMap["midwife-type"].forEach(({ field, label }) => {
        if (!formData.midwifeType[field as keyof typeof formData.midwifeType]) {
            missingFields.push({ tabName: "Midwife Type", fieldName: label });
        }
    });

    // Check intensity fields
    requiredFieldsMap["intensity"].forEach(({ field, label }) => {
        if (!formData.identity[field as keyof typeof formData.identity]) {
            missingFields.push({ tabName: "Intensity", fieldName: label });
        }
    });

    // Check more-info fields
    requiredFieldsMap["more-info"].forEach(({ field, label, section }) => {
        if (section === "bankInfo" && !formData.bankInfo[field as keyof BankInfo]) {
            missingFields.push({ tabName: "More Information", fieldName: label });
        } else if (section === "moreInfo" && !formData.moreInfo[field as keyof MoreInfo]) {
            missingFields.push({ tabName: "More Information", fieldName: label });
        }
    });

    // Check FAQs - NEW VALIDATION
    if (!formData.faqs || formData.faqs.length < 3) {
        missingFields.push({
            tabName: "More Information",
            fieldName: "Minimum 3 FAQs required"
        });
    } else {
        // Check each FAQ for required fields
        formData.faqs.forEach((faq, index) => {
            if (!faq.question || !faq.question.trim()) {
                missingFields.push({
                    tabName: "More Information",
                    fieldName: `FAQ ${index + 1}: Question is required`
                });
            }
            if (!faq.answer || !faq.answer.trim()) {
                missingFields.push({
                    tabName: "More Information",
                    fieldName: `FAQ ${index + 1}: Answer is required`
                });
            }
        });
    }

    // Check testimonials
    if (!formData.testimonials || formData.testimonials.length < 3) {
        missingFields.push({
            tabName: "More Information",
            fieldName: "Minimum 3 testimonials required"
        });
    } else {
        // Check each testimonial for required fields
        formData.testimonials.forEach((testimonial, index) => {
            if (!testimonial.name) {
                missingFields.push({
                    tabName: "More Information",
                    fieldName: `Testimonial ${index + 1}: Name is required`
                });
            }
            if (!testimonial.profileImage?.url) {
                missingFields.push({
                    tabName: "More Information",
                    fieldName: `Testimonial ${index + 1}: Profile Image is required`
                });
            }
            if (!testimonial.designation) {
                missingFields.push({
                    tabName: "More Information",
                    fieldName: `Testimonial ${index + 1}: Designation is required`
                });
            }
            if (!testimonial.description) {
                missingFields.push({
                    tabName: "More Information",
                    fieldName: `Testimonial ${index + 1}: Description is required`
                });
            }
        });
    }

    return {
        isProfileComplete: missingFields.length === 0,
        missingFields: missingFields
    };
};