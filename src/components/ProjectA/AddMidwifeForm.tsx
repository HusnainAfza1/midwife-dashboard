"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreateMidwifeApi } from "@/endpoints/postEndpoints"
import { UpdateMidwifeApi } from "@/endpoints/putEndpoints"
//import { GetAllslogansApi } from "@/endpoints/getEndpoints"
import type { AddMidwifeFormData } from "@/types"
import type React from "react"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import IntensityTab from "./Tabs/intensityTab"
import MidwifeTypeTab from "./Tabs/MidwifeTypeTab"
import MoreInfoTab from "./Tabs/MoreInfoTab"
import PersonalInfoTab from "./Tabs/PersonalInfoTab"
import ServicesInfoTab from "./Tabs/ServicesInfoTab"
import SimulationTab from "./Tabs/SimulationTab"
import { ApiMidwife } from "./Tables/columns"
import { validateProfileCompletion } from "@/utils/validationUtils"
import { MidwifeRegisterApi, e1ClassesApi, f1ClassesApi } from "@/endpoints/postEndpoints"

interface AddMidwifeFormProps {
    onCancel: () => void
    onSuccess?: (midwifeId: string) => void
    midwifeData?: ApiMidwife | null // New prop for editing existing midwife
}

// const DEFAULT_FAQS = [
//     {
//         question: "How do I book a consultation?",
//         answer: "Simply click on 'Check Availability', enter your expected delivery date and address, and we'll let you know about our required support.",
//     },
//     {
//         question: "What areas do you cover?",
//         answer: "We provide services in select metropolitan areas. Please check availability for your location.",
//     },
//     {
//         question: "Do I need even if I am not pregnant yet?",
//         answer: "Yes, pre-pregnancy consultation can help you prepare better for your journey ahead.",
//     },
// ];     
const DEFAULT_FAQS = [
    {
        question: "Wie buche ich eine Beratung?",
        answer: "Klicken Sie einfach auf 'Verfügbarkeit prüfen', geben Sie Ihren voraussichtlichen Entbindungstermin und Ihre Adresse ein – wir melden uns mit den notwendigen Unterstützungsdetails.",
    },
    {
        question: "Welche Regionen decken Sie ab?",
        answer: "Wir bieten unsere Dienste in ausgewählten Metropolregionen an. Bitte prüfen Sie die Verfügbarkeit für Ihren Standort.",
    },
    {
        question: "Benötige ich eine Beratung, auch wenn ich noch nicht schwanger bin?",
        answer: "Ja, eine Beratung vor der Schwangerschaft kann Ihnen helfen, sich besser auf Ihre bevorstehende Reise vorzubereiten.",
    },
];


const AddMidwifeForm = ({ onCancel, onSuccess, midwifeData }: AddMidwifeFormProps) => {
    const [activeTab, setActiveTab] = useState("personal-info")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [password, setPassword] = useState(String);
    const [formData, setFormData] = useState<AddMidwifeFormData>({
        userId: "",
        isProfileComplete: false,
        midwifeStatus: true, // "active" | "inactive"
        personalInfo: {
            firstName: "",
            lastName: "",
            midwifeTitle: "",
            username: "",
            slogan: "",
            personalStatement: "",
            about: "",
            email: "",
            phone: "",
            address: "",
            serviceRadius: "",
            profileImage: null,
            logo: null,
            googleAddress: null
        },
        midwifeType: {
            midwifeType: "",
            services: {}, // Changed from [] to {}
        },
        identity: {
            intensity: "",
            totalWeeklyHours: 0,
            monthlyTurnover: 0,
            timetable: {},
        },
        services: {},
        bankInfo: {
            accountHolderName: "",
            bankName: "",
            accountNumber: "",
            routingNumber: "",
        },
        moreInfo: {
            acupuncture: "",
            professionalExperience: "",
            message: "",
            supportedPregnancies: 0
        },
        testimonials: [],
        socialLinks: {
            facebook: "",
            twitter: "",
            instagram: "",
            linkedin: ""
        },
        faqs: DEFAULT_FAQS
    })


    const isEditMode = !!midwifeData
    useEffect(() => {
        if (midwifeData) {
            setFormData({
                userId: midwifeData.userId || "",
                isProfileComplete: midwifeData.isProfileComplete || false,
                midwifeStatus: midwifeData.midwifeStatus ?? true, // "active" | "inactive"
                personalInfo: midwifeData.personalInfo || {},
                midwifeType: midwifeData.midwifeType || {
                    midwifeType: "",
                    services: {} // Changed from [] to {}
                },
                identity: midwifeData.identity || { intensity: "", totalWeeklyHours: 0, monthlyTurnover: 0, timetable: {} },
                services: midwifeData.services || {},
                bankInfo: midwifeData.bankInfo || {
                    accountHolderName: "",
                    bankName: "",
                    accountNumber: "",
                    routingNumber: "",
                },
                moreInfo: midwifeData.moreInfo || {
                    acupuncture: "",
                    professionalExperience: "",
                    message: "",
                    supportedPregnancies: 0
                },
                testimonials: midwifeData.testimonials || [],
                socialLinks: midwifeData.socialLinks || {
                    facebook: "",
                    twitter: "",
                    instagram: "",
                    linkedin: ""
                },
                faqs: midwifeData.faqs && midwifeData.faqs.length > 0 ? midwifeData.faqs : DEFAULT_FAQS

            })
        }
    }, [midwifeData])

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleFormChange = (section: keyof AddMidwifeFormData, data: any) => {
        setFormData((prev) => ({
            ...prev,
            [section]: { ...(typeof prev[section] === "object" && prev[section] !== null ? prev[section] : {}), ...data },
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            setIsSubmitting(true)

            const dataToSubmit = { ...formData };

            // Get the current value of isProfileComplete from the form
            // This ensures we use the latest value after validation
            const validateResult = validateProfileCompletion(dataToSubmit);
            dataToSubmit.isProfileComplete = validateResult.isProfileComplete;
            if (!dataToSubmit.isProfileComplete) {
                dataToSubmit.midwifeStatus = false; // Set midwifeStatus to true if profile is complete
            }

            console.log("Form data before submission:", dataToSubmit)

            let response;
            if (
                !dataToSubmit.personalInfo.email ||
                !dataToSubmit.personalInfo.slogan ||
                !dataToSubmit.personalInfo.firstName ||
                !dataToSubmit.personalInfo.username
            ) {
                toast.error("Please fill out all required personal information to UPdate a midwife");
                return;
            }

            if (isEditMode && midwifeData) {
                // Update existing midwife
                response = await UpdateMidwifeApi(midwifeData._id, dataToSubmit)
                toast.success("Midwife profile updated successfully!")
                console.log("Updating midwife profile...", midwifeData)
            }
            else {
                // Create new midwife     

                // SalesPersonRegisterApi({
                //             email: data.email,
                //             password: data.password,
                //             username: data.name,
                //         })    


                console.log("This is the data before Registration", {
                    email: dataToSubmit.personalInfo.email,
                    password: password,
                    username: dataToSubmit.personalInfo.username
                })

                if (
                    !dataToSubmit.personalInfo.email ||
                    !dataToSubmit.personalInfo.slogan ||
                    !dataToSubmit.personalInfo.firstName ||
                    !dataToSubmit.personalInfo.username
                ) {
                    toast.error("Please fill out all required personal information to create a midwife");
                    return;
                }

                const midwifeRegistration = await MidwifeRegisterApi({
                    email: dataToSubmit.personalInfo.email,
                    password: password,
                    username: dataToSubmit.personalInfo.username
                })

                console.log("user is succsess fully register", midwifeRegistration.data.user)

                if (midwifeRegistration.data.user.id) {
                    console.log("Midwife's registration response: ", response);
                    dataToSubmit.userId = midwifeRegistration.data.user.id
                    if (!dataToSubmit.userId) {
                        toast.error("Midiwfe UsersId is not Found");
                    }
                    // const finalData = {
                    //     ...dataToSubmit, 
                    //     userId :midwifeRegistration.data.data.id
                    // }
                    response = await CreateMidwifeApi(dataToSubmit)
                    toast.success("Midwife profile created successfully!")

                    if (response.data.data._id && ["ULTIMATE", "PRO"].includes(formData.midwifeType.midwifeType)) {
                        try {
                            await e1ClassesApi(response.data.data._id, {})
                            await f1ClassesApi(response.data.data._id, {})
                            console.log("Classes document created successfully")
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        } catch (classesError: any) {
                            // If classes already exist, that's okay - just log it
                            if (classesError.response?.status === 400 &&
                                classesError.response?.data?.message?.includes("already exists")) {
                                console.log("Classes document already exists for this midwife - skipping creation")
                            } else {
                                // If it's a different error, handle it appropriately
                                console.error("Error creating classes document:", classesError)
                                // You might want to show a warning toast here instead of an error
                                toast.warning("Midwife created successfully, but there was an issue setting up classes")
                            }
                        }
                    }

                }



                // if (response?.data?.data?._id) {

                //     console.log("Midwife is Register Succesfully,", midwifeRegistration.data)
                // }




            }
            const responseID = response?.data?.data?._id;

            // Call the onSuccess callback if provided
            if (onSuccess && responseID) {
                onSuccess(responseID)
            } else {
                // Otherwise just close the form
                onCancel()
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error("Error submitting form:", error)
            toast.error(error.response.data.message
                || `Failed to ${isEditMode ? 'update' : 'create'} midwife profile`)
        } finally {
            setIsSubmitting(false)
        }
    }

    const changeTab = (tab: string) => {
        setActiveTab(tab)
        document.getElementById("midwife-profile-form")?.scrollIntoView({ behavior: "smooth" })
        console.log("Form data")
        console.log(formData)
    }

    return (
        <div className="mx-auto bg-white p-6 rounded-lg">
            <div className="flex items-center mb-6">
                <h1 className="text-2xl font-bold" id="midwife-profile-form">
                    {isEditMode ? "Edit Midwife Profile" : "Create Midwife Profile"}
                </h1>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-7 mb-8">
                    <TabsTrigger value="personal-info">Personal Info</TabsTrigger>
                    <TabsTrigger value="midwife-type">Midwife Type</TabsTrigger>
                    <TabsTrigger value="intensity">Intensity</TabsTrigger>
                    <TabsTrigger value="services-info">Services Info</TabsTrigger>
                    <TabsTrigger value="simulation-tab">Simulation Tab</TabsTrigger>
                    {/* <TabsTrigger value="bank-info">Bank Info</TabsTrigger> */}
                    <TabsTrigger value="more-info">More Information</TabsTrigger>
                </TabsList>

                <TabsContent value="personal-info" className="space-y-6">
                    <PersonalInfoTab
                        data={formData.personalInfo}
                        onChange={(data) => handleFormChange("personalInfo", data)}
                        onContinue={() => {
                            changeTab("midwife-type")
                        }}
                        onCancel={onCancel}
                        isEditMode={isEditMode}
                        setPassword={setPassword}
                        password={password}
                    />
                </TabsContent>

                <TabsContent value="midwife-type">
                    <MidwifeTypeTab
                        data={formData.midwifeType}
                        onChange={(data) => handleFormChange("midwifeType", data)}
                        onBack={() => changeTab("personal-info")}
                        onContinue={() => {
                            changeTab("intensity")
                        }}
                        isEditMode={isEditMode}
                    />
                </TabsContent>

                <TabsContent value="intensity">
                    <IntensityTab
                        data={formData.identity}
                        midwifeType={formData.midwifeType}
                        onChange={(data) => handleFormChange("identity", data)}
                        onBack={() => changeTab("midwife-type")}
                        onContinue={() => changeTab("services-info")}
                        isEditMode={isEditMode}
                    />
                </TabsContent>

                <TabsContent value="services-info">
                    <ServicesInfoTab
                        midwifeServices={formData.services}
                        midwifeType={formData.midwifeType}
                        midwifeIntensity={formData.identity}
                        onChange={(data) => handleFormChange("services", data)}
                        onBack={() => changeTab("intensity")}
                        onContinue={() => changeTab("simulation-tab")}
                        isEditMode={isEditMode}
                    />
                </TabsContent>

                <TabsContent value="simulation-tab">
                    <SimulationTab
                        data={formData}
                        onBack={() => changeTab("services-info")}
                        onContinue={() => changeTab("more-info")}
                        isEditMode={isEditMode}
                    />
                </TabsContent>

                <TabsContent value="more-info">
                    <MoreInfoTab
                        formData={formData}
                        onBankInfoChange={(data) => handleFormChange("bankInfo", data)}
                        onMoreInfoChange={(data) => handleFormChange("moreInfo", data)}
                        onFormDataChange={(data) => setFormData(prev => ({ ...prev, ...data }))}
                        onBack={() => changeTab("services-info")}
                        onSubmit={handleSubmit}
                        isSubmitting={isSubmitting}
                        isEditMode={isEditMode}
                    />
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default AddMidwifeForm