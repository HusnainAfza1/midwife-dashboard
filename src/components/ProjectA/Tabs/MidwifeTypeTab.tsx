"use client"

import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import React, { useState, useEffect } from "react"
import { MIDWIFE_TYPES } from "@/config/constants"
import { CourseData, PrivateServiceItem, CourseServiceItem, MidwifeTypeData, CloudinaryImage } from "@/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { ImageIcon } from "lucide-react"
import AddCourseDialog from "../Dialogs/AddCourseDialog"
import AddPrivateServiceDialog from "../Dialogs/AddPrivateServiceDialog"
import EditCourseDialog from "../Dialogs/MidwifeCourseDialog"
import EditPrivateServiceDialog from "../Dialogs/MidwifePrivateServiceDialog"
import { AddPrivateServicesApi, AddCourseApi } from "@/endpoints/postEndpoints"
import { GetAllCoursesApi, GetAllPrivateServicesApi } from "@/endpoints/getEndpoints"

interface MidwifeService {
    serviceTitle: string;
    privateServices?: PrivateServiceItem[];
    courses?: CourseServiceItem[];
}

interface MidwifeTypeTabProps {
    data: MidwifeTypeData
    onChange: (data: Partial<MidwifeTypeData>) => void
    onBack: () => void
    onContinue: () => void
    isEditMode?: boolean
}

const MidwifeTypeTab: React.FC<MidwifeTypeTabProps> = ({ data, onChange, onBack, onContinue, isEditMode }) => {
    const selectedType = MIDWIFE_TYPES.find(t => t.title === data.midwifeType)?.id || null
    const selectedRemoteLevel = data.remoteType || "ESSENTIAL"

    // State for storing API data with separate types
    const [privateServices, setPrivateServices] = useState<PrivateServiceItem[]>([]);
    const [courses, setCourses] = useState<CourseServiceItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // State for edit dialogs
    const [editCourseDialogOpen, setEditCourseDialogOpen] = useState(false)
    const [editPrivateServiceDialogOpen, setEditPrivateServiceDialogOpen] = useState(false)
    const [selectedCourseForEdit, setSelectedCourseForEdit] = useState<CourseServiceItem | null>(null)
    const [selectedServiceForEdit, setSelectedServiceForEdit] = useState<PrivateServiceItem | null>(null)

    // Fetch data on component mount
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                // Fetch private services
                const privateServicesResponse = await GetAllPrivateServicesApi();
                if (!privateServicesResponse || !privateServicesResponse.data) {
                    throw new Error("Failed to fetch private services");
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const transformedPrivateServices: PrivateServiceItem[] = privateServicesResponse.data.privateServices.map((item: any) => ({
                    id: item._id,
                    name: item.name,
                    tagline: item.tagline,
                    type: item.type,
                    duration: item.duration + " min",
                    appointments: item.appointments,
                    turnover: item.turnover,
                    image: item.image || null // Add image field for private services
                }));
                setPrivateServices(transformedPrivateServices);

                // Fetch courses
                const coursesResponse = await GetAllCoursesApi();
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const transformedCourses: CourseServiceItem[] = coursesResponse.data.courses.map((item: any) => ({
                    id: item._id,
                    name: item.name,
                    tagline: item.tagline,
                    type: item.type,
                    duration: item.duration + " min",
                    appointments: item.appointments,
                    turnover: item.turnover
                    // No image field for courses
                }));
                setCourses(transformedCourses);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load services. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Handle midwife type selection
    const handleTypeSelect = (typeId: string) => {
        const selectedTypeInfo = MIDWIFE_TYPES.find(t => t.id === typeId)
        if (selectedTypeInfo) {
            const newData: Partial<MidwifeTypeData> = {
                midwifeType: selectedTypeInfo.title,
                services: {} // Reset services when type changes
            }
            if (selectedTypeInfo.title === "REMOTE") {
                newData.remoteType = selectedRemoteLevel
            } else {
                newData.remoteType = undefined
            }
            onChange(newData)
        }
    }

    // Handle remote level selection (ESSENTIAL or PRO)
    const handleRemoteLevelChange = (level: "ESSENTIAL" | "PRO") => {
        onChange({ remoteType: level })
    }

    // Get base services for current type
    const getServicesForType = (): MidwifeService[] => {
        if (!selectedType) return []

        const type = MIDWIFE_TYPES.find(t => t.id === selectedType)
        if (!type || !type.hasSubCategories || !type.subCategories) return []

        // Filter sub-categories to include only the ones we want
        const availableServices: MidwifeService[] = [];

        type.subCategories.forEach(serviceId => {
            if (serviceId === "private-services") {
                availableServices.push({
                    serviceTitle: "private-services",
                    privateServices: privateServices
                });
            } else if (serviceId === "courses-classes") {
                availableServices.push({
                    serviceTitle: "courses-classes",
                    courses: courses
                });
            }
        });

        return availableServices;
    }

    // Updated: Toggle a private service item
    const handlePrivateServiceToggle = (item: PrivateServiceItem) => {
        const updatedServices = { ...data.services };
        const serviceTitle = "private-services";

        if (updatedServices[serviceTitle]) {
            // Service exists, check if the item exists by name
            const itemIndex = updatedServices[serviceTitle].findIndex(i => i.name === item.name);

            if (itemIndex >= 0) {
                // Item exists, remove it
                updatedServices[serviceTitle] = updatedServices[serviceTitle].filter((_, idx) => idx !== itemIndex);

                // If no items left, remove the service key
                if (updatedServices[serviceTitle].length === 0) {
                    delete updatedServices[serviceTitle];
                }
            } else {
                // Item doesn't exist, add it
                updatedServices[serviceTitle] = [...updatedServices[serviceTitle], item];
            }
        } else {
            // Service doesn't exist, create it with the item
            updatedServices[serviceTitle] = [item];
        }

        onChange({ services: updatedServices });
    }

    // Updated: Toggle a course item
    const handleCourseToggle = (item: CourseServiceItem) => {
        const updatedServices = { ...data.services };
        const serviceTitle = "courses-classes";

        if (updatedServices[serviceTitle]) {
            // Service exists, check if the item exists by name
            const itemIndex = updatedServices[serviceTitle].findIndex(i => i.name === item.name);

            if (itemIndex >= 0) {
                // Item exists, remove it
                updatedServices[serviceTitle] = updatedServices[serviceTitle].filter((_, idx) => idx !== itemIndex);

                // If no items left, remove the service key
                if (updatedServices[serviceTitle].length === 0) {
                    delete updatedServices[serviceTitle];
                }
            } else {
                // Item doesn't exist, add it
                updatedServices[serviceTitle] = [...updatedServices[serviceTitle], item];
            }
        } else {
            // Service doesn't exist, create it with the item
            updatedServices[serviceTitle] = [item];
        }

        onChange({ services: updatedServices });
    }

    // Updated: Check if a private service item is selected
    const isPrivateServiceSelected = (itemName: string) => {
        const serviceItems = data.services["private-services"];
        return serviceItems ? serviceItems.some(item => item.name === itemName) : false;
    }

    // Updated: Check if a course item is selected
    const isCourseSelected = (itemName: string) => {
        const serviceItems = data.services["courses-classes"];
        return serviceItems ? serviceItems.some(item => item.name === itemName) : false;
    }

    // Get classes for the midwife type card
    const getCardClasses = (typeId: string) => {
        const baseClasses = "transition-all duration-300 cursor-pointer relative h-full w-full "
        return selectedType === typeId
            ? `${baseClasses} bg-blue-500 hover:bg-blue-600 text-white shadow-md`
            : `${baseClasses} bg-gray-100 hover:bg-blue-600 hover:text-white shadow-sm`
    }

    // Updated: Get the current image for a private service (from formData or original)
    const getCurrentPrivateServiceImage = (itemName: string, originalImage?: CloudinaryImage | null): CloudinaryImage | null => {
        // First check if the service is selected and has an updated image in formData
        const serviceItems = data.services["private-services"];
        if (serviceItems) {
            const selectedItem = serviceItems.find(i => i.name === itemName);
            if (selectedItem && selectedItem.image) {
                return selectedItem.image; // Return updated image from formData
            }
        }

        // Fallback to original image if no updated image
        return originalImage || null;
    }

    // Updated: Get item property value for private services
    const getPrivateServicePropertyValue = (
        itemName: string,
        property: keyof PrivateServiceItem,
        defaultValue: string
    ) => {
        const serviceItems = data.services["private-services"];
        if (serviceItems) {
            const item = serviceItems.find(i => i.name === itemName);
            if (item && item[property] !== undefined) {
                const value = item[property] as string;
                if (property === 'turnover' && value.endsWith('€')) {
                    return value.replace('€', '');
                }
                return value;
            }
        }
        if (property === 'turnover' && defaultValue.endsWith('€')) {
            return defaultValue.replace('€', '');
        }
        return defaultValue;
    };

    // Updated: Get item property value for courses
    const getCoursePropertyValue = (
        itemName: string,
        property: keyof CourseServiceItem,
        defaultValue: string
    ) => {
        const serviceItems = data.services["courses-classes"];
        if (serviceItems) {
            const item = serviceItems.find(i => i.name === itemName);
            if (item && item[property] !== undefined) {
                const value = item[property] as string;
                if (property === 'turnover' && value.endsWith('€')) {
                    return value.replace('€', '');
                }
                return value;
            }
        }
        if (property === 'turnover' && defaultValue.endsWith('€')) {
            return defaultValue.replace('€', '');
        }
        return defaultValue;
    };

    // Handle opening edit course dialog
    const handleEditCourse = (courseItem: CourseServiceItem) => {

        const selectedCourseInForm = data.services["courses-classes"]?.find(
            course => course.id === courseItem.id
        );
        const courseToEdit = selectedCourseInForm || courseItem;

        setSelectedCourseForEdit(courseToEdit)
        setEditCourseDialogOpen(true)
    }

    // Handle opening edit private service dialog
    const handleEditPrivateService = (serviceItem: PrivateServiceItem) => {
        // Find the actual selected service from formData to get the current image
        const selectedServiceInForm = data.services["private-services"]?.find(
            service => service.id === serviceItem.id
        );

        // Use the service from formData if available (which has the updated image), otherwise use the original
        const serviceToEdit = selectedServiceInForm || serviceItem;

        setSelectedServiceForEdit(serviceToEdit)
        setEditPrivateServiceDialogOpen(true)
    }

    // Handle saving edited course
    const handleSaveEditedCourse = (updatedCourse: CourseServiceItem) => {
        console.log("=== SAVING EDITED COURSE ===");
        console.log("Updated course data:", updatedCourse);

        const serviceTitle = "courses-classes"
        const updatedServices = { ...data.services }

        if (updatedServices[serviceTitle]) {
            // FIXED: Find course by multiple criteria (more reliable matching)
            const courseIndex = updatedServices[serviceTitle].findIndex(
                course => course.id === updatedCourse.id ||
                    course.name === updatedCourse.name
            )

            console.log("Found course at index:", courseIndex);
            console.log("Looking for course with ID:", updatedCourse.id, "or name:", updatedCourse.name);

            if (courseIndex !== -1) {
                // FIXED: Completely replace the course with updated data
                const updatedCoursesArray = [...updatedServices[serviceTitle]]
                updatedCoursesArray[courseIndex] = {
                    ...updatedCourse,
                    // Ensure all required fields are properly set
                    id: updatedCourse.id || updatedCoursesArray[courseIndex].id,
                    name: updatedCourse.name,
                    frequency: updatedCourse.frequency || "1",
                    frequencyPeriod: updatedCourse.frequencyPeriod || "per Week",
                    startDate: updatedCourse.startDate || "",
                    selectedDays: updatedCourse.selectedDays || []
                }

                updatedServices[serviceTitle] = updatedCoursesArray

                console.log("Updated form data:", updatedServices[serviceTitle]);

                // CRITICAL: Update the parent component's form data
                onChange({ services: updatedServices })
                console.log("Form data sent to parent component");
            } else {
                console.error("Course not found in form data for update!");
                console.log("Available courses:", updatedServices[serviceTitle].map(c => ({ id: c.id, name: c.name })));
            }
        } else {
            console.error("No courses-classes found in form data!");
        }

        // ALSO UPDATE: The local courses state
        setCourses(prev => {
            const updated = prev.map(course => {
                const isMatch = course.id === updatedCourse.id ||
                    course.name === updatedCourse.name;

                if (isMatch) {
                    console.log("Updating course in courses state:", course.name);
                    return updatedCourse;
                }
                return course;
            });

            // If no course was found to update, add it
            const wasUpdated = updated.some(course =>
                course.id === updatedCourse.id || course.name === updatedCourse.name
            );

            if (!wasUpdated) {
                console.log("Adding new course to courses state");
                updated.push(updatedCourse);
            }

            console.log("Final courses state:", updated);
            return updated;
        });

        console.log("=== COURSE EDIT SAVE COMPLETED ===");
    }

    const handleSaveEditedPrivateService = (updatedService: PrivateServiceItem) => {
        const serviceTitle = "private-services"
        const updatedServices = { ...data.services }

        if (updatedServices[serviceTitle]) {
            const serviceIndex = updatedServices[serviceTitle].findIndex(
                service => service.id === updatedService.id ||
                    service.name === updatedService.name
            )

            console.log("Found service at index:", serviceIndex);
            console.log("Looking for service with ID:", updatedService.id, "or name:", updatedService.name);

            if (serviceIndex !== -1) {
                const updatedServicesArray = [...updatedServices[serviceTitle]]
                updatedServicesArray[serviceIndex] = {
                    ...updatedService,
                    // Ensure all required fields are properly set
                    id: updatedService.id || updatedServicesArray[serviceIndex].id,
                    name: updatedService.name,
                    frequency: updatedService.frequency || "1",
                    frequencyPeriod: updatedService.frequencyPeriod || "per Week",
                    serviceMode: updatedService.serviceMode || "Individual",
                    startDate: updatedService.startDate || "",
                    selectedDays: updatedService.selectedDays || []
                }

                updatedServices[serviceTitle] = updatedServicesArray

                console.log("Updated form data:", updatedServices[serviceTitle]);
                onChange({ services: updatedServices })
                console.log("Form data sent to parent component");
            } else {
                console.error("Service not found in form data for update!");
                console.log("Available services:", updatedServices[serviceTitle].map(s => ({ id: s.id, name: s.name })));
            }
        } else {
            console.error("No private-services found in form data!");
        }

        setPrivateServices(prev => {
            const updated = prev.map(service => {
                const isMatch = service.id === updatedService.id ||
                    service.name === updatedService.name;

                if (isMatch) {
                    console.log("Updating service in privateServices state:", service.name);
                    return updatedService;
                }
                return service;
            });

            // If no service was found to update, add it
            const wasUpdated = updated.some(service =>
                service.id === updatedService.id || service.name === updatedService.name
            );

            if (!wasUpdated) {
                console.log("Adding new service to privateServices state");
                updated.push(updatedService);
            }

            console.log("Final privateServices state:", updated);
            return updated;
        });

        console.log("=== EDIT SAVE COMPLETED ===");
    }


    const handleContinue = () => {
        // Check if midwife type is selected
        if (!selectedType) {
            toast.error("Please select a midwife type first");
            return;
        }

        // Get available services for the selected type
        const availableServices = getServicesForType();
        const offersServices = availableServices.length > 0 &&
            !(data.midwifeType === "REMOTE" && selectedRemoteLevel === "ESSENTIAL");

        if (offersServices) {
            const offersPrivateServices = availableServices.some(service => service.serviceTitle === "private-services");
            const offersCourses = availableServices.some(service => service.serviceTitle === "courses-classes");
            const hasSelectedPrivateServices = (data.services["private-services"]?.length ?? 0) > 0;
            const hasSelectedCourses = (data.services["courses-classes"]?.length ?? 0) > 0;

            // Check selection requirements
            if (offersPrivateServices || offersCourses) {
                // If BOTH are offered, BOTH must have at least one selection
                // if (offersPrivateServices && offersCourses) {
                //     if (!hasSelectedPrivateServices && !hasSelectedCourses) {
                //         toast.error("Please select at least one private service AND at least one course/class to continue");
                //         return;
                //     } else if (!hasSelectedPrivateServices) {
                //         toast.error("Please select at least one private service to continue");
                //         return;
                //     } else if (!hasSelectedCourses) {
                //         toast.error("Please select at least one course/class to continue");
                //         return;
                //     }
                // }
                // // If only private services are offered
                // else if (offersPrivateServices && !hasSelectedPrivateServices) {
                //     toast.error("Please select at least one private service to continue");
                //     return;
                // }
                // // If only courses are offered
                // else if (offersCourses && !hasSelectedCourses) {
                //     toast.error("Please select at least one course/class to continue");
                //     return;
                // }

                // COMPLETE PRIVATE SERVICES VALIDATION - CHECK EVERY FIELD
                if (hasSelectedPrivateServices) {
                    const selectedPrivateServices = data.services["private-services"] || [];
                    for (const service of selectedPrivateServices) {
                        const missingFields = [];

                        // Check EVERY possible field for private services
                        if (!service.id || service.id.trim() === "") missingFields.push("ID");
                        if (!service.name || service.name.trim() === "") missingFields.push("Name");
                        if (!service.tagline || service.tagline.trim() === "") missingFields.push("Tagline");
                        if (!service.type || service.type.trim() === "") missingFields.push("Type");
                        if (!service.duration || service.duration.trim() === "") missingFields.push("Duration");
                        if (!service.appointments || service.appointments.trim() === "") missingFields.push("Appointments");
                        if (!service.turnover || service.turnover.trim() === "") missingFields.push("Turnover");

                        // Step 2 fields - ALL scheduling related fields
                        if (!service.frequency || service.frequency.trim() === "") missingFields.push("Frequency");
                        if (!service.frequencyPeriod || service.frequencyPeriod.trim() === "") missingFields.push("Frequency Period");
                        if (!service.serviceMode || service.serviceMode.trim() === "") missingFields.push("Service Mode");
                        if (!service.startDate || service.startDate.trim() === "") missingFields.push("Start Date");
                        if (!service.selectedDays || service.selectedDays.length === 0) missingFields.push("Selected Days");

                        // Conditional field for Group services
                        if (service.serviceMode === "Group" && (!service.maxParticipants || service.maxParticipants.trim() === "")) {
                            missingFields.push("Max Participants");
                        }

                        // If any fields are missing, show error
                        if (missingFields.length > 0) {
                            toast.error(`Private service "${service.name || 'Unnamed Service'}" is incomplete. Missing: ${missingFields.join(", ")}. Please edit to complete all details.`);
                            return;
                        }

                        // Business logic validations
                        // const frequency = parseInt(service.frequency);
                        // const totalAppointments = parseInt(service.appointments);

                        // if (frequency && service.selectedDays && service.selectedDays.length !== frequency) {
                        //     toast.error(`Private service "${service.name}": Selected days (${service.selectedDays.length}) must match frequency (${frequency}). Please edit to fix.`);
                        //     return;
                        // }

                        // if (totalAppointments && frequency && totalAppointments < frequency) {
                        //     toast.error(`Private service "${service.name}": Total appointments (${totalAppointments}) cannot be less than frequency (${frequency}). Please edit to fix.`);
                        //     return;
                        // }
                    }
                }

                // COMPLETE COURSES VALIDATION - CHECK EVERY FIELD
                if (hasSelectedCourses) {
                    const selectedCourses = data.services["courses-classes"] || [];
                    for (const course of selectedCourses) {
                        const missingFields = [];

                        // Check EVERY possible field for courses
                        if (!course.id || course.id.trim() === "") missingFields.push("ID");
                        if (!course.name || course.name.trim() === "") missingFields.push("Name");
                        if (!course.tagline || course.tagline.trim() === "") missingFields.push("Tagline");
                        if (!course.type || course.type.trim() === "") missingFields.push("Type");
                        if (!course.duration || course.duration.trim() === "") missingFields.push("Duration");
                        if (!course.appointments || course.appointments.trim() === "") missingFields.push("Appointments");
                        if (!course.turnover || course.turnover.trim() === "") missingFields.push("Turnover");

                        // Step 2 fields - ALL scheduling related fields
                        if (!course.frequency || course.frequency.trim() === "") missingFields.push("Frequency");
                        if (!course.frequencyPeriod || course.frequencyPeriod.trim() === "") missingFields.push("Frequency Period");
                        if (!course.startDate || course.startDate.trim() === "") missingFields.push("Start Date");
                        if (!course.selectedDays || course.selectedDays.length === 0) missingFields.push("Selected Days");

                        // If any fields are missing, show error
                        if (missingFields.length > 0) {
                            toast.error(`Course "${course.name || 'Unnamed Course'}" is incomplete. Missing: ${missingFields.join(", ")}. Please edit to complete all details.`);
                            return;
                        }

                        // Business logic validations
                        // const frequency = parseInt(course.frequency);
                        // const totalAppointments = parseInt(course.appointments);

                        // if (frequency && course.selectedDays && course.selectedDays.length !== frequency) {
                        //     toast.error(`Course "${course.name}": Selected days (${course.selectedDays.length}) must match frequency (${frequency}). Please edit to fix.`);
                        //     return;
                        // }

                        // if (totalAppointments && frequency && totalAppointments < frequency) {
                        //     toast.error(`Course "${course.name}": Total appointments (${totalAppointments}) cannot be less than frequency (${frequency}). Please edit to fix.`);
                        //     return;
                        // }
                    }
                }
            }
        }

        // If all validations pass, continue to next step
        onContinue();
    };

    // Updated: Handle saving a new course to the database and local state
    const handleSaveCourse = async (courseData: CourseData) => {
        try {
            // Prepare data for API
            const apiData = {
                name: courseData.name,
                tagline: courseData.tagline || courseData.name,
                type: courseData.type || "Videocall",
                duration: courseData.duration || "60",
                appointments: courseData.appointments || "1",
                turnover: courseData.turnover || "80,45"
            };

            // Save to database
            const response = await AddCourseApi(apiData);

            console.log("Course API Response:", response);

            // FIXED: Access the correct path (adjust based on your actual API response)
            const savedCourse = response.data.course || response.data; // Try both paths

            console.log("Saved Course:", savedCourse);
            console.log("Course ID:", savedCourse.id || savedCourse._id);

            // FIXED: Create new course with proper defaults and correct ID
            const newCourse: CourseServiceItem = {
                id: savedCourse.id || savedCourse._id, // Handle both ID formats
                name: courseData.name,
                tagline: courseData.tagline,
                type: courseData.type,
                duration: courseData.duration + " min",
                appointments: courseData.appointments,
                turnover: courseData.turnover,

                // FIXED: Provide proper defaults instead of empty strings
                frequency: "1",                    // Default frequency
                frequencyPeriod: "per Week",       // Default period
                maxParticipants: "",               // Not used for courses
                startDate: "",                     // User will set this
                selectedDays: []                   // User will select days
            };

            console.log("Created newCourse with ID:", newCourse.id);

            // Add to courses state
            setCourses(prev => [...prev, newCourse]);

            // Add to form data
            const serviceTitle = "courses-classes";
            const updatedServices = { ...data.services };

            if (updatedServices[serviceTitle]) {
                updatedServices[serviceTitle] = [...updatedServices[serviceTitle], newCourse];
            } else {
                updatedServices[serviceTitle] = [newCourse];
            }

            onChange({ services: updatedServices });
            console.log("Course added:", newCourse);
            toast.success(`Course "${courseData.name}" added successfully!`);

        } catch (error) {
            console.error("Error saving course:", error);
            toast.error("Failed to add course. Please try again.");
        }
    }

    const handleSavePrivateService = async (serviceData: CourseData) => {
        try {
            const apiData = {
                name: serviceData.name,
                tagline: serviceData.tagline || serviceData.name,
                type: serviceData.type || "Videocall",
                duration: serviceData.duration || "60",
                appointments: serviceData.appointments || "1",
                turnover: serviceData.turnover || "80,45"
            };

            const response = await AddPrivateServicesApi(apiData);
            const savedService = response.data.privateService;
            const newService: PrivateServiceItem = {
                id: savedService.id,
                name: serviceData.name,
                tagline: serviceData.tagline,
                type: serviceData.type,
                duration: serviceData.duration + " min",
                appointments: serviceData.appointments,
                turnover: serviceData.turnover,
                image: null,
                frequency: "",
                frequencyPeriod: "per Week",
                serviceMode: "Individual",
                maxParticipants: "",
                startDate: "",
                selectedDays: []
            };

            console.log("4. Created new service object:", newService);
            setPrivateServices(prev => {
                const updated = [...prev, newService];
                console.log("5. Updated privateServices state:", updated);
                return updated;
            });

            const serviceTitle = "private-services";
            const updatedServices = { ...data.services };

            if (updatedServices[serviceTitle]) {
                updatedServices[serviceTitle] = [...updatedServices[serviceTitle], newService];
            } else {
                updatedServices[serviceTitle] = [newService];
            }

            onChange({ services: updatedServices });
            console.log("6. Updated form services:", updatedServices);
            console.log("=== NEW SERVICE CREATION COMPLETED ===");

        } catch (error) {
            console.error("Error saving private service:", error);
        }
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    return (
        <div className="space-y-8">

            {isEditMode && (
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-2 rounded mb-4">
                    Edit Mode: Midwife type cannot be changed
                </div>
            )}
            <h2 className="text-xl font-semibold">Select Midwife Type</h2>

            {/* Midwife Type Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {MIDWIFE_TYPES.map((type) => (
                    <Card
                        key={type.id}
                        className={` group ${type.id === "remote" ? "cursor-not-allowed" : getCardClasses(type.id)}`}
                        // className={` group ${(type.id === "remote" || isEditMode) ? "cursor-not-allowed opacity-60" : getCardClasses(type.id)}`}
                        onClick={() => {
                            if (type.id === "remote" || isEditMode) return;
                            handleTypeSelect(type.id)
                        }}
                    >
                        <CardHeader className="pb-2 text-center">
                            <CardTitle className="text-xl font-bold">{type.title}</CardTitle>
                            {type.title === "REMOTE" && selectedType === type.id ? (
                                <div className="flex justify-center gap-4 pt-2">
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            name="remoteLevel"
                                            value="ESSENTIAL"
                                            checked={selectedRemoteLevel === "ESSENTIAL"}
                                            onChange={() => handleRemoteLevelChange("ESSENTIAL")}
                                            className="w-4 h-4 appearance-none rounded-full border-2 border-white checked:border-black checked:bg-black"
                                        />
                                        <span className="text-sm">ESSENTIAL</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            name="remoteLevel"
                                            value="PRO"
                                            checked={selectedRemoteLevel === "PRO"}
                                            onChange={() => handleRemoteLevelChange("PRO")}
                                            className="w-4 h-4 appearance-none rounded-full border-2 border-white checked:border-black checked:bg-black"
                                        />
                                        <span className="text-sm">PRO</span>
                                    </label>
                                </div>
                            ) : (
                                <CardDescription className={`text-sm transition-colors duration-300 ${type.id !== "remote" && "group-hover:text-white"} ${selectedType === type.id ? 'text-white' : 'text-gray-600'}`}>
                                    {type.description}
                                </CardDescription>
                            )}
                        </CardHeader>
                        <CardContent className="pb-6">
                            <ul className="space-y-2">
                                {type.features.map((feature) => (
                                    <li
                                        key={`${type.id}-${feature}`}
                                        className="flex items-center pb-2 mb-2 border-b border-gray-200 last:border-b-0 last:mb-0 last:pb-0 whitespace-nowrap overflow-hidden"
                                    >
                                        <svg className="h-4 w-4 mr-2 text-green-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-sm truncate">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        {selectedType === type.id && (
                            <div className="absolute top-2 right-2 h-6 w-6 bg-white rounded-full flex items-center justify-center">
                                <svg className="h-4 w-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                        )}
                    </Card>
                ))}
            </div>

            {/* Services Selection */}
            {selectedType &&
                getServicesForType().length > 0 &&
                !(data.midwifeType === "REMOTE" && selectedRemoteLevel === "ESSENTIAL") && (
                    <div className="mt-8 space-y-4">
                        {getServicesForType().map((service) => (
                            <div key={service.serviceTitle} className="space-y-2 bg-gray-100 rounded-xl">
                                <h3 className="text-lg font-medium pl-4 pt-4">
                                    Select the {service.serviceTitle === "private-services" ? "Private Services" : "Courses/Classes"}
                                </h3>
                                <div className="p-4 rounded-lg">
                                    <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto">
                                        {/* Render Private Services */}
                                        {service.serviceTitle === "private-services" && service.privateServices?.map((item, index) => {
                                            const isSelected = isPrivateServiceSelected(item.name);

                                            return (
                                                <div
                                                    key={`${service.serviceTitle}-${item.name}-${index}`}
                                                    className={`p-3 rounded-md transition-colors duration-200 mr-4 ${isSelected ? 'bg-white' : 'hover:bg-gray-200'}`}
                                                >
                                                    <div className="flex items-center space-x-3">
                                                        <Checkbox
                                                            id={`${service.serviceTitle}-${item.name}-${index}`}
                                                            checked={isSelected}
                                                            onCheckedChange={() => handlePrivateServiceToggle(item)}
                                                            className="h-5 w-5"
                                                        />
                                                        <label
                                                            htmlFor={`${service.serviceTitle}-${item.name}-${index}`}
                                                            className="text-sm font-medium cursor-pointer flex-1"
                                                        >
                                                            {item.name}
                                                        </label>
                                                    </div>

                                                    {/* Display details for selected private services */}
                                                    {isSelected && (
                                                        <div className="mt-2 ml-8 p-3 rounded-md relative">
                                                            {/* Edit icon positioned at top-right */}
                                                            <button
                                                                onClick={() => handleEditPrivateService(item)}
                                                                className="absolute top-1 right-1 p-2 hover:bg-gray-200 rounded-full transition-colors z-10"
                                                                title="Edit service details"
                                                            >
                                                                <svg className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                </svg>
                                                            </button>

                                                            {/* Image section - placed above the grid */}
                                                            {(() => {
                                                                const currentImage = getCurrentPrivateServiceImage(item.name, item.image);

                                                                if (currentImage) {
                                                                    return (
                                                                        <div className="mb-3 relative inline-block">
                                                                            <Image
                                                                                src={currentImage.url}
                                                                                alt={item.name}
                                                                                width={80}
                                                                                height={80}
                                                                                className="w-20 h-20 object-cover rounded-md border-2 border-gray-200"
                                                                                unoptimized={currentImage.url.startsWith('blob:')}
                                                                            />
                                                                            {/* Show indicator if it's a newly uploaded image */}
                                                                            {currentImage.url.startsWith('blob:') && (
                                                                                <div className="absolute bottom-0 left-0 right-0 bg-green-500 text-white text-xs px-1 py-0.5 rounded-b-md text-center">
                                                                                    Updated
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    );
                                                                } else {
                                                                    // Show placeholder when no image
                                                                    return (
                                                                        <div className="mb-3">
                                                                            <div className="w-20 h-20 bg-gray-100 rounded-md border-2 border-dashed border-gray-300 flex items-center justify-center">
                                                                                <ImageIcon className="h-6 w-6 text-gray-400" />
                                                                            </div>
                                                                            <p className="text-xs text-gray-500 mt-1 text-center">No image</p>
                                                                        </div>
                                                                    );
                                                                }
                                                            })()}

                                                            {/* Service details grid - exactly same as courses */}
                                                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs pr-8">
                                                                <div>
                                                                    <span className="text-gray-500">Type:</span>
                                                                    <span className="ml-2 font-medium">
                                                                        {getPrivateServicePropertyValue(item.name, 'type', item.type)}
                                                                    </span>
                                                                </div>

                                                                <div>
                                                                    <span className="text-gray-500">Duration:</span>
                                                                    <span className="ml-2 font-medium">
                                                                        {getPrivateServicePropertyValue(item.name, 'duration', item.duration)}
                                                                    </span>
                                                                </div>

                                                                <div>
                                                                    <span className="text-gray-500">Appointments:</span>
                                                                    <span className="ml-2 font-medium">
                                                                        {getPrivateServicePropertyValue(item.name, 'appointments', item.appointments)}
                                                                    </span>
                                                                </div>

                                                                <div>
                                                                    <span className="text-gray-500">Turnover:</span>
                                                                    <span className="ml-2 font-medium">
                                                                        {getPrivateServicePropertyValue(item.name, 'turnover', item.turnover)}€
                                                                    </span>
                                                                </div>

                                                                <div className="col-span-2">
                                                                    <span className="text-gray-500">Tagline:</span>
                                                                    <span className="ml-2 font-medium">
                                                                        {getPrivateServicePropertyValue(item.name, 'tagline', item.tagline)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}

                                        {/* Render Courses */}
                                        {service.serviceTitle === "courses-classes" && service.courses?.map((item, index) => {
                                            const isSelected = isCourseSelected(item.name);

                                            return (
                                                <div
                                                    key={`${service.serviceTitle}-${item.name}-${index}`}
                                                    className={`p-3 rounded-md transition-colors duration-200 mr-4 ${isSelected ? 'bg-white' : 'hover:bg-gray-200'}`}
                                                >
                                                    <div className="flex items-center space-x-3">
                                                        <Checkbox
                                                            id={`${service.serviceTitle}-${item.name}-${index}`}
                                                            checked={isSelected}
                                                            onCheckedChange={() => handleCourseToggle(item)}
                                                            className="h-5 w-5"
                                                        />
                                                        <label
                                                            htmlFor={`${service.serviceTitle}-${item.name}-${index}`}
                                                            className="text-sm font-medium cursor-pointer flex-1"
                                                        >
                                                            {item.name}
                                                        </label>
                                                    </div>

                                                    {/* Display details for selected courses */}
                                                    {isSelected && (
                                                        <div className="mt-2 ml-8 p-3 rounded-md relative">
                                                            {/* Edit icon positioned at top-right */}
                                                            <button
                                                                onClick={() => handleEditCourse(item)}
                                                                className="absolute top-2 right-2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                                                                title="Edit course details"
                                                            >
                                                                <svg className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                </svg>
                                                            </button>

                                                            {/* Course details grid - no image for courses */}
                                                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs pr-8">
                                                                <div>
                                                                    <span className="text-gray-500">Type:</span>
                                                                    <span className="ml-2 font-medium">
                                                                        {getCoursePropertyValue(item.name, 'type', item.type)}
                                                                    </span>
                                                                </div>

                                                                <div>
                                                                    <span className="text-gray-500">Duration:</span>
                                                                    <span className="ml-2 font-medium">
                                                                        {getCoursePropertyValue(item.name, 'duration', item.duration)}
                                                                    </span>
                                                                </div>

                                                                <div>
                                                                    <span className="text-gray-500">Appointments:</span>
                                                                    <span className="ml-2 font-medium">
                                                                        {getCoursePropertyValue(item.name, 'appointments', item.appointments)}
                                                                    </span>
                                                                </div>

                                                                <div>
                                                                    <span className="text-gray-500">Turnover:</span>
                                                                    <span className="ml-2 font-medium">
                                                                        {getCoursePropertyValue(item.name, 'turnover', item.turnover)}€
                                                                    </span>
                                                                </div>

                                                                <div className="col-span-2">
                                                                    <span className="text-gray-500">Tagline:</span>
                                                                    <span className="ml-2 font-medium">
                                                                        {getCoursePropertyValue(item.name, 'tagline', item.tagline)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="mt-2 text-right">
                                        {service.serviceTitle === "courses-classes" ? (
                                            <AddCourseDialog
                                                trigger={
                                                    <Button variant="ghost" size="sm" className="text-xs">
                                                        Add New Course/Class
                                                    </Button>
                                                }
                                                onSave={handleSaveCourse}
                                            />
                                        ) : service.serviceTitle === "private-services" ? (
                                            <AddPrivateServiceDialog
                                                trigger={
                                                    <Button variant="ghost" size="sm" className="text-xs">
                                                        Add New Private Service
                                                    </Button>
                                                }
                                                onSave={handleSavePrivateService}
                                            />
                                        ) : (
                                            <> </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            <div className="flex justify-between pt-6">
                <Button variant="outline" onClick={onBack}>Back</Button>
                <Button
                    onClick={handleContinue}
                    disabled={!selectedType}
                    className="bg-blue-600 hover:bg-blue-700"
                >
                    Continue
                </Button>
            </div>

            {/* Edit Course Dialog */}
            <EditCourseDialog
                open={editCourseDialogOpen}
                onOpenChange={setEditCourseDialogOpen}
                courseData={selectedCourseForEdit}
                onSave={handleSaveEditedCourse}
            />

            {/* Edit Private Service Dialog */}
            <EditPrivateServiceDialog
                open={editPrivateServiceDialogOpen}
                onOpenChange={setEditPrivateServiceDialogOpen}
                serviceData={selectedServiceForEdit}
                onSave={handleSaveEditedPrivateService}
            />
        </div>
    )
}

export default MidwifeTypeTab