"use client"
import { useEffect, useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { INITAIL_TIMETABLE, SERVICES_DURATIONS } from "@/config/constants";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { IdentityData, MidwifeTypeData, } from "@/types";
import { validatePrivateServicesDuration } from '@/utils/privateServiceValidation';
interface IntensityTabProps {
    data: IdentityData
    midwifeType: MidwifeTypeData
    onChange: (data: Partial<IdentityData>) => void
    onBack: () => void
    onContinue: () => void
    isEditMode?: boolean
}
// Define time slot interface
interface TimeSlot {
    startTime: string;
    endTime: string;
}

// No longer using static serviceTypes, we'll extract them from the loaded timetable
const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const timeSlots = Array.from({ length: 96 }, (_, i) => {
    const hours = Math.floor(i / 4);
    const minutes = (i % 4) * 15;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
});

const IntensityTab = ({ onBack, onContinue, data, midwifeType, onChange }: IntensityTabProps) => {

    console.log("Intensity Data", data)

    const [intensityInput, setIntensityInput] = useState(data.intensity || "");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [selectedIntensityData, setSelectedIntensityData] = useState<any>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [timetable, setTimetable] = useState<any>(data.timetable || null);
    const [slotsDialogOpen, setSlotsDialogOpen] = useState(false);
    const [currentDay, setCurrentDay] = useState("");
    const [currentService, setCurrentService] = useState("");
    const [newSlot, setNewSlot] = useState<TimeSlot>({ startTime: "", endTime: "" });
    const [timeError, setTimeError] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [slotValidationError, setSlotValidationError] = useState("");
    const [currentServiceDuration, setCurrentServiceDuration] = useState(0);
    const [prevMidwifeType, setPrevMidwifeType] = useState(midwifeType.midwifeType);
    // New state to store dynamic service types
    const [serviceTypes, setServiceTypes] = useState<string[]>([]);
    // New state for tracking slot counts
    const [scheduledSlots, setScheduledSlots] = useState(0);
    const [requiredSlots, setRequiredSlots] = useState(0);
    // State for toaster notifications
    const [showToaster, setShowToaster] = useState(false);
    const [toasterMessage, setToasterMessage] = useState("");
    const [freeTimeSlotsForServiceI, setFreeTimeSlotsForServiceI] = useState<TimeSlot[]>([]);

    // Load saved data if available or reset if midwife type changes
    useEffect(() => {
        if (prevMidwifeType !== midwifeType.midwifeType) {
            setPrevMidwifeType(midwifeType.midwifeType);
            setIntensityInput(data.intensity || "");
            setSelectedIntensityData(null);
            setTimetable(null);
            setServiceTypes([]);
            setErrorMessage("");
            setScheduledSlots(0);
            setRequiredSlots(0);
            console.log("Midwife type changed, resetting data.");
            return;
        }

        if (
            data.intensity &&
            data.timetable &&
            Object.keys(data.timetable).length > 0
        ) {
            setIntensityInput(data.intensity);
            setTimetable(data.timetable);

            // Dynamically access timetable using midwifeType and intensity
            const timetableCategory = INITAIL_TIMETABLE[midwifeType.midwifeType as keyof typeof INITAIL_TIMETABLE];
            if (timetableCategory && timetableCategory[data.intensity]) {
                setSelectedIntensityData(timetableCategory[data.intensity]);
                // Extract service types from the loaded timetable
                extractServiceTypes(timetableCategory[data.intensity].defaultTimeTable);

                // Set the required total slots from the loaded data
                if (timetableCategory[data.intensity].totalSlots) {
                    setRequiredSlots(timetableCategory[data.intensity].totalSlots);
                }

                // Count current scheduled slots in the timetable
                const currentSlots = countTotalScheduledSlots(data.timetable);
                setScheduledSlots(currentSlots);

                setErrorMessage("");
            } else {
                setErrorMessage(
                    `Timetable not found for ${midwifeType.midwifeType} with intensity ${data.intensity}`
                );
            }
        }
    }, [data, midwifeType, prevMidwifeType]);

    // New function to extract service types from timetable
    const extractServiceTypes = (timetableData: Record<string, { slots: Record<string, unknown> }>) => {
        if (!timetableData) return;

        // Get all unique service types from the timetable
        const allServiceTypes = new Set<string>();

        // Loop through each day to collect all service types
        weekDays.forEach(day => {
            if (timetableData[day] && timetableData[day].slots) {
                // Add all service keys to the set
                Object.keys(timetableData[day].slots).forEach(service => {
                    allServiceTypes.add(service);
                });
            }
        });

        // Convert the set to an array and sort alphabetically
        const sortedServiceTypes = Array.from(allServiceTypes).sort();
        setServiceTypes(sortedServiceTypes);
        console.log("Extracted service types:", sortedServiceTypes);
    };

    // New function to count all scheduled slots in the timetable   
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const countTotalScheduledSlots = (timetableData: any) => {
        if (!timetableData) return 0;

        let totalCount = 0;

        // Loop through each day
        weekDays.forEach(day => {
            if (timetableData[day] && timetableData[day].slots) {
                // Loop through each service 
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                Object.values(timetableData[day].slots).forEach((slots: any) => {
                    if (Array.isArray(slots)) {
                        // Add the number of slots for this service
                        totalCount += slots.length;
                    }
                });
            }
        });
        console.log("Total scheduled slots:", totalCount);
        return totalCount;
    };

    // New function to count service-specific slots across all days
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const countServiceSlots = (timetableData: any) => {
        if (!timetableData) return {};

        const serviceCounts: Record<string, number> = {};

        // Initialize counts for all services
        serviceTypes.forEach(service => {
            serviceCounts[service] = 0;
        });

        // Count slots for each service across all days
        weekDays.forEach(day => {
            if (timetableData[day] && timetableData[day].slots) {
                Object.keys(timetableData[day].slots).forEach(service => {
                    const slots = timetableData[day].slots[service];
                    if (Array.isArray(slots)) {
                        serviceCounts[service] = (serviceCounts[service] || 0) + slots.length;
                    }
                });
            }
        });

        return serviceCounts;
    };

    // New function to get required service counts from default timetable
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getRequiredServiceCounts = (defaultTimetable: any) => {
        if (!defaultTimetable) return {};

        const requiredCounts: Record<string, number> = {};

        // Count required slots for each service from default timetable
        weekDays.forEach(day => {
            if (defaultTimetable[day] && defaultTimetable[day].slots) {
                Object.keys(defaultTimetable[day].slots).forEach(service => {
                    const slots = defaultTimetable[day].slots[service];
                    if (Array.isArray(slots)) {
                        requiredCounts[service] = (requiredCounts[service] || 0) + slots.length;
                    }
                });
            }
        });

        return requiredCounts;
    };

    const handleLoadTimetable = () => {
        const intensity = intensityInput.trim();
        setErrorMessage("");
        setShowToaster(false);
        console.log("Intensity Type", typeof intensity)

        if (!intensity) {
            setErrorMessage("Please enter an intensity value.");
            setSelectedIntensityData(null);
            setTimetable(null);
            setServiceTypes([]);
            setRequiredSlots(0);
            setScheduledSlots(0);
            return;
        }

        if (Number(intensity) < 2 || Number(intensity) > 6) {
            setErrorMessage("Intensity value can only be between 2 and 6.");
            setSelectedIntensityData(null);
            setTimetable(null);
            setServiceTypes([]);
            setRequiredSlots(0);
            setScheduledSlots(0);
            return;
        }

        // Access timetable dynamically
        const timetableCategory = INITAIL_TIMETABLE[midwifeType.midwifeType as keyof typeof INITAIL_TIMETABLE];
        if (!timetableCategory) {
            setErrorMessage(`Invalid midwife type: ${midwifeType.midwifeType}`);
            setSelectedIntensityData(null);
            setTimetable(null);
            setServiceTypes([]);
            setRequiredSlots(0);
            setScheduledSlots(0);
            return;
        }

        const intensityData = timetableCategory[intensity];
        if (!intensityData) {
            setErrorMessage(
                `Timetable not found for ${midwifeType.midwifeType} with intensity ${intensity}`
            );
            setSelectedIntensityData(null);
            setTimetable(null);
            setServiceTypes([]);
            setRequiredSlots(0);
            setScheduledSlots(0);
            return;
        }

        setSelectedIntensityData(intensityData);
        setTimetable(intensityData.defaultTimeTable);

        // Set the required total slots from the loaded data
        if (intensityData.totalSlots) {
            setRequiredSlots(intensityData.totalSlots);
        }

        // Count current scheduled slots in the timetable
        const currentSlots = countTotalScheduledSlots(intensityData.defaultTimeTable);
        setScheduledSlots(currentSlots);

        // Extract service types from the loaded timetable
        extractServiceTypes(intensityData.defaultTimeTable);
    };

    // Find service duration from SERVICES_DURATIONS
    const getServiceDuration = (serviceId: string): number => {
        const service = SERVICES_DURATIONS.find(service => service.id === serviceId);
        return service ? service.duration : 0;
    };

    // Modified function to find free time slots for service "I" - 24 hour calculation
    const findFreeTimeSlotsForServiceI = (day: string, customTimetable = timetable) => {
        if (!customTimetable || !customTimetable[day]) return [];

        // Collect all busy time slots from ALL services for this day
        const busySlots: TimeSlot[] = [];

        Object.keys(customTimetable[day].slots).forEach(service => {
            const slots = customTimetable[day].slots[service];
            if (Array.isArray(slots)) {
                slots.forEach(slot => {
                    if (slot.startTime && slot.endTime) {
                        busySlots.push({
                            startTime: slot.startTime,
                            endTime: slot.endTime
                        });
                    }
                });
            }
        });

        // Sort busy slots by start time
        busySlots.sort((a, b) => a.startTime.localeCompare(b.startTime));

        // Find free periods that are at least 1 hour (60 minutes) long
        const freeSlots: TimeSlot[] = [];

        // Helper functions
        const timeToMinutes = (time: string) => {
            const [hours, minutes] = time.split(':').map(Number);
            return hours * 60 + minutes;
        };

        const minutesToTime = (minutes: number) => {
            const hours = Math.floor(minutes / 60);
            const mins = minutes % 60;
            return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
        };

        // Check for 24-hour period (00:00 to 23:59)
        if (busySlots.length === 0) {
            // No appointments, entire day is free (24 hours)
            freeSlots.push({
                startTime: "00:00",
                endTime: "23:59"
            });
        } else {
            // Check gap from start of day (00:00) to first appointment
            const firstAppointmentStart = timeToMinutes(busySlots[0].startTime);
            const dayStart = 0; // 00:00 = 0 minutes

            if (firstAppointmentStart - dayStart >= 60) {
                freeSlots.push({
                    startTime: "00:00",
                    endTime: minutesToTime(firstAppointmentStart)
                });
            }

            // Check gaps between appointments
            for (let i = 0; i < busySlots.length - 1; i++) {
                const currentEnd = timeToMinutes(busySlots[i].endTime);
                const nextStart = timeToMinutes(busySlots[i + 1].startTime);

                if (nextStart - currentEnd >= 60) {
                    freeSlots.push({
                        startTime: busySlots[i].endTime,
                        endTime: busySlots[i + 1].startTime
                    });
                }
            }

            // Check gap from last appointment to end of day (23:59)
            const lastAppointmentEnd = timeToMinutes(busySlots[busySlots.length - 1].endTime);
            const dayEnd = 23 * 60 + 59; // 23:59 = 1439 minutes

            if (dayEnd - lastAppointmentEnd >= 60) {
                freeSlots.push({
                    startTime: busySlots[busySlots.length - 1].endTime,
                    endTime: "23:59"
                });
            }
        }

        // Filter out any free slots that are less than 1 hour
        return freeSlots.filter(slot => {
            const duration = timeToMinutes(slot.endTime) - timeToMinutes(slot.startTime);
            return duration >= 60;
        });
    };

    // Open dialog to manage slots for a specific day and service
    const openSlotsDialog = (day: string, service: string) => {
        setCurrentDay(day);
        setCurrentService(service);

        // Get service duration
        const duration = getServiceDuration(service);

        setCurrentServiceDuration(duration);
        if (service === "I") {
            const freeSlots = findFreeTimeSlotsForServiceI(day);
            setFreeTimeSlotsForServiceI(freeSlots);
        } else {
            setFreeTimeSlotsForServiceI([]);
        }

        setNewSlot({ startTime: "", endTime: "" });
        setTimeError("");
        setSlotValidationError("");
        setSlotsDialogOpen(true);
    };

    // Calculate end time based on start time and service duration
    const calculateEndTime = (startTime: string, durationMinutes: number): string => {
        if (!startTime || durationMinutes <= 0) return "";

        const [hoursStr, minutesStr] = startTime.split(':');
        const hours = parseInt(hoursStr, 10);
        const minutes = parseInt(minutesStr, 10);

        // Calculate total minutes
        const totalMinutes = hours * 60 + minutes + durationMinutes;

        // Convert back to hours and minutes
        const newHours = Math.floor(totalMinutes / 60) % 24; // Use modulo 24 to handle overnight
        const newMinutes = totalMinutes % 60;

        return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
    };

    // Handle time change for new slot
    const handleTimeChange = (type: 'start' | 'end', value: string) => {
        if (type === 'start') {
            // When start time changes, automatically set end time based on service duration
            const endTime = calculateEndTime(value, currentServiceDuration);
            setNewSlot({
                startTime: value,
                endTime: endTime
            });

            // Validate if the calculated end time is valid (not beyond 24h)
            if (endTime && value >= endTime) {
                setTimeError('Invalid time range. The appointment would end after midnight.');
            } else {
                setTimeError('');
            }
        } else {
            // End time is set automatically, but we'll include this for completeness
            const updatedSlot = {
                ...newSlot,
                endTime: value
            };
            setNewSlot(updatedSlot);
        }
    };

    // Check if a new slot overlaps with existing slots
    const checkSlotOverlap = (newSlot: TimeSlot, existingSlots: TimeSlot[]) => {
        if (!newSlot.startTime || !newSlot.endTime) return false;

        return existingSlots.some(slot => {
            if (!slot.startTime || !slot.endTime) return false;

            // Check for overlap or same start time
            return (
                (newSlot.startTime < slot.endTime && newSlot.endTime > slot.startTime) ||
                newSlot.startTime === slot.startTime
            );
        });
    };

    // Check if a new slot overlaps with any existing slots for the day
    // except for the special case where C1 and D1 can overlap
    // const checkDayOverlap = (newSlot: TimeSlot, day: string, currentService: string) => {
    //     if (!newSlot.startTime || !newSlot.endTime) return false;

    //     let hasOverlap = false;

    //     // Check each service for the day
    //     Object.keys(timetable[day].slots).forEach(service => {
    //         // Skip the current service (we already check that separately)
    //         if (service === currentService) return;

    //         // Special case: D1 and C1 can overlap with each other
    //         if ((currentService === "D1" && service === "C1") ||
    //             (currentService === "C1" && service === "D1")) return;

    //         // Check slots for this service
    //         const slots = timetable[day].slots[service];
    //         if (Array.isArray(slots)) {
    //             slots.forEach(slot => {
    //                 if (!slot.startTime || !slot.endTime) return;

    //                 // Check for overlap
    //                 if (newSlot.startTime < slot.endTime && newSlot.endTime > slot.startTime) {
    //                     hasOverlap = true;
    //                 }
    //             });
    //         }
    //     });

    //     return hasOverlap;
    // };   

    const checkDayOverlap = (newSlot: TimeSlot, day: string, currentService: string) => {
        if (!newSlot.startTime || !newSlot.endTime) return false;

        let hasOverlap = false;

        // Define overlap groups
        const overlapGroups = [
            ["A1/A2", "B2", "C2", "D2", "G"],    // Group 1: can overlap with each other
            ["E1", "E2"],                         // Group 2: can overlap with each other  
            ["F1", "F2"],                         // Group 3: can overlap with each other
            ["B1", "C1", "D1"]                    // Group 4: can overlap with each other
        ];

        // Function to check if two services can overlap
        const canServicesOverlap = (service1: string, service2: string) => {
            // Service "I" can overlap with EVERYONE
            // if (service1 === "I" || service2 === "I") {
            //     return true;
            // }

            // Check if both services are in the same overlap group
            for (const group of overlapGroups) {
                if (group.includes(service1) && group.includes(service2)) {
                    return true;
                }
            }

            return false;
        };

        // Check each service for the day
        Object.keys(timetable[day].slots).forEach(service => {
            // Skip the current service (we already check that separately)
            if (service === currentService) return;

            // If services CAN overlap, skip collision check
            if (canServicesOverlap(currentService, service)) {
                return; // Allow overlap
            }

            // If services CANNOT overlap, check for collision
            const slots = timetable[day].slots[service];
            if (Array.isArray(slots)) {
                slots.forEach(slot => {
                    if (!slot.startTime || !slot.endTime) return;
                    // Check for overlap
                    if (newSlot.startTime < slot.endTime && newSlot.endTime > slot.startTime) {
                        hasOverlap = true;
                    }
                });
            }
        });

        return hasOverlap;
    };

    // Add a new time slot
    const addNewTimeSlot = () => {
        if (timeError) return;

        // First check for overlap with existing slots in the same service
        if (Array.isArray(timetable[currentDay].slots[currentService])) {
            const existing = timetable[currentDay].slots[currentService];
            if (checkSlotOverlap(newSlot, existing)) {
                setSlotValidationError("This time slot overlaps with an existing slot in the same service");
                return;
            }
        }

        // Then check for overlap with slots in OTHER services for the same day
        // with the exception that D1 and C1 can overlap
        if (checkDayOverlap(newSlot, currentDay, currentService)) {
            setSlotValidationError("This time slot overlaps with another appointment on this day");
            return;
        }

        // Clone the timetable to avoid direct state mutation
        const updatedTimetable = JSON.parse(JSON.stringify(timetable));

        // Ensure the slots is an array
        if (!Array.isArray(updatedTimetable[currentDay].slots[currentService])) {
            updatedTimetable[currentDay].slots[currentService] = [];
        }

        // Add the new slot
        updatedTimetable[currentDay].slots[currentService].push({
            startTime: newSlot.startTime,
            endTime: newSlot.endTime
        });

        // Sort slots by start time
        updatedTimetable[currentDay].slots[currentService].sort((a: TimeSlot, b: TimeSlot) =>
            a.startTime.localeCompare(b.startTime)
        );

        // Update state and reset form
        setTimetable(updatedTimetable);

        // Update scheduled slots count
        setScheduledSlots(prevCount => prevCount + 1);

        if (currentService === "I") {
            // Temporarily create a timetable with the new slot to calculate updated free slots
            const tempTimetable = { ...timetable, [currentDay]: updatedTimetable[currentDay] };

            // Calculate new free slots based on updated timetable
            const updatedFreeSlots = findFreeTimeSlotsForServiceI(currentDay, tempTimetable);
            setFreeTimeSlotsForServiceI(updatedFreeSlots);
        }

        // Reset form
        setNewSlot({ startTime: "", endTime: "" });
        setTimeError("");
        setSlotValidationError("");
    };

    // Delete a time slot
    const deleteTimeSlot = (slotIndex: number) => {
        // Clone the timetable to avoid direct state mutation
        const updatedTimetable = JSON.parse(JSON.stringify(timetable));

        // Remove the slot at the given index
        if (Array.isArray(updatedTimetable[currentDay].slots[currentService])) {
            updatedTimetable[currentDay].slots[currentService].splice(slotIndex, 1);
            setTimetable(updatedTimetable);

            // Update scheduled slots count
            setScheduledSlots(prevCount => prevCount - 1);
            if (currentService === "I") {
                // Calculate new free slots based on updated timetable
                const updatedFreeSlots = findFreeTimeSlotsForServiceI(currentDay, updatedTimetable);
                setFreeTimeSlotsForServiceI(updatedFreeSlots);
            }
        }
    };
    // Handle intensity input change
    const handleContinue = () => {
        if (!selectedIntensityData || !timetable) {
            setErrorMessage("Please load a valid timetable before continuing.");
            return;
        }

        // // Check if the scheduled slots match the required total
        // if (scheduledSlots !== requiredSlots) {
        //     // Calculate the difference
        //     const difference = scheduledSlots - requiredSlots;
        //     let message = "";

        //     if (difference < 0) {
        //         // Missing slots
        //         message = `You need to add ${Math.abs(difference)} more slot${Math.abs(difference) > 1 ? 's' : ''} to match the required total of ${requiredSlots}.`;
        //     } else {
        //         // Excess slots
        //         message = `You have ${difference} excess slot${difference > 1 ? 's' : ''}. Please remove ${difference} slot${difference > 1 ? 's' : ''} to match the required total of ${requiredSlots}.`;
        //     }

        //     // Show toaster message
        //     setToasterMessage(message);
        //     setShowToaster(true);

        //     // Hide toaster after 5 seconds
        //     setTimeout(() => {
        //         setShowToaster(false);
        //     }, 5000);

        //     return;
        // }

        // NEW VALIDATION: Check service-specific counts
        const currentServiceCounts = countServiceSlots(timetable);
        const requiredServiceCounts = getRequiredServiceCounts(selectedIntensityData.defaultTimeTable);

        // Prepare arrays to track discrepancies (excluding service "I")
        const missingSlots: string[] = [];
        const excessSlots: string[] = [];

        // Check each service (excluding "I")
        Object.keys(requiredServiceCounts).forEach(service => {
            // Skip service "I" as requested
            if (service === "I") return;

            const required = requiredServiceCounts[service] || 0;
            const current = currentServiceCounts[service] || 0;

            if (current < required) {
                missingSlots.push(`${service}: ${required - current} more needed`);
            } else if (current > required) {
                excessSlots.push(`${service}: ${current - required} excess`);
            }
        });

        // If there are discrepancies, show detailed message
        if (missingSlots.length > 0 || excessSlots.length > 0) {
            let serviceMessage = "Service count discrepancies found:\n\n";

            if (missingSlots.length > 0) {
                serviceMessage += "Missing slots:\n" + missingSlots.join('\n') + "\n\n";
            }

            if (excessSlots.length > 0) {
                serviceMessage += "Excess slots:\n" + excessSlots.join('\n');
            }

            // Show detailed service validation message
            setToasterMessage(serviceMessage);
            setShowToaster(true);

            // Hide toaster after 7 seconds for longer message
            setTimeout(() => {
                setShowToaster(false);
            }, 7000);

            return;
        }

        if (!validatePrivateServicesDuration(midwifeType, timetable, setToasterMessage, setShowToaster)) {
            return; // Validation failed, stop execution
        }

        // All validation passed, save the data
        onChange({
            intensity: intensityInput,
            totalWeeklyHours: selectedIntensityData.weeklyHours,
            monthlyTurnover: selectedIntensityData.monthlyTurnover,
            timetable: timetable
        });

        onContinue();
    };

    return (
        <div className="w-full flex flex-col gap-6">
            {/* Intensity Input Section */}
            <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                    <Label htmlFor="intensity">Intensity (Number of patients per month)</Label>
                    <Input
                        id="intensity"
                        type="number"
                        value={intensityInput}
                        onChange={(e) => setIntensityInput(e.target.value)}
                        min={2}
                        max={6}
                        placeholder="Enter Intensity"
                    />
                    <Button onClick={handleLoadTimetable} className="mt-2">
                        Load Timetable
                    </Button>

                    {errorMessage && (
                        <div className="text-red-500 text-sm mt-2">
                            {errorMessage}
                        </div>
                    )}
                </div>
            </div>

            {selectedIntensityData && timetable && (
                <>
                    {/* Header Information */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium">Intensity (Number of patients per month)</label>
                            <Input
                                type="text"
                                value={intensityInput}
                                className="border rounded p-2"
                                disabled
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium">Total Weekly Hours</label>
                            <Input
                                type="text"
                                value={`${selectedIntensityData.weeklyHours} Hours Per Week`}
                                className="border rounded p-2"
                                disabled
                            />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium">Monthly Turnover</label>
                            <Input
                                type="text"
                                value={`$${selectedIntensityData.monthlyTurnover}`}
                                className="border rounded p-2"
                                disabled
                            />
                        </div>
                    </div>

                    {/* Timetable Section */}
                    <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-lg">Below is the Timetable based on the intensity</h3>
                        <div className="text-right">
                            {/* <p className={`font-semibold ${scheduledSlots !== requiredSlots ? 'text-red-500' : 'text-green-600 '}`}> */}
                            <p className={`font-semibold ${scheduledSlots !== requiredSlots ? 'hidden' : 'hidden'}`}>
                                Scheduled Time for Appointments: {scheduledSlots}/{requiredSlots}
                            </p>
                            <p>{intensityInput} CLIENTS PER MONTH</p>
                        </div>
                    </div>

                    {/* Display message if no service types are found */}
                    {serviceTypes.length === 0 && (
                        <div className="text-center p-4 bg-yellow-100 rounded">
                            <p>No service types available for this midwife type and intensity.</p>
                        </div>
                    )}

                    {serviceTypes.length > 0 && (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="bg-gray-100 font-medium"></TableHead>
                                        {serviceTypes.map(service => (
                                            <TableHead key={service} className="bg-gray-100 font-bold">
                                                {service}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {weekDays.map(day => {
                                        const dayData = timetable[day];
                                        const isOffDay = dayData.isOff;

                                        return (
                                            <TableRow key={day} className={isOffDay ? 'text-red-500' : ''}>
                                                <TableCell className='border border-gray-200'>
                                                    <div className="font-medium flex justify-between h-full w-full items-center">
                                                        <p>{day}</p>
                                                    </div>
                                                </TableCell>
                                                {serviceTypes.map(service => {
                                                    // Check if this service exists in the day's slots
                                                    const slots = dayData.slots[service] || [];
                                                    const isEmpty = !Array.isArray(slots) || slots.length === 0;

                                                    return (
                                                        <TableCell key={`${day}-${service}`} className={`border border-gray-200 ${isEmpty ? 'bg-yellow-100' : 'bg-white'} `}>
                                                            <div className='flex flex-col h-full w-full'>
                                                                <div className="flex flex-col justify-between items-center w-full gap-1">
                                                                    <div className="flex-1">
                                                                        {Array.isArray(slots) && slots.map((slot, index) => (
                                                                            <div key={index} className="text-sm mb-1">
                                                                                {`${slot.startTime} - ${slot.endTime}`}
                                                                            </div>
                                                                        ))}
                                                                        {isEmpty && <span className="text-gray-500">No slots</span>}
                                                                    </div>
                                                                    {!isOffDay && (
                                                                        <button
                                                                            onClick={() => openSlotsDialog(day, service)}
                                                                            className="text-orange-500 hover:text-orange-700 ml-2"
                                                                        >
                                                                            <Pencil size={16} />
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                    );
                                                })}
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    )}

                    {/* Slots Management Dialog */}
                    <Dialog open={slotsDialogOpen} onOpenChange={setSlotsDialogOpen}>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>
                                    Manage Time Slots: {currentDay} - {currentService}
                                </DialogTitle>
                            </DialogHeader>

                            {/* Service duration info */}
                            <div className="p-2 bg-blue-50 rounded mb-4 text-center">
                                <p className="text-sm text-blue-700">
                                    This service requires a {currentServiceDuration} minute appointment
                                </p>
                            </div>

                            {/* List of existing slots */}
                            <div className="max-h-[300px] overflow-y-auto mb-4">
                                {timetable && currentDay && currentService && Array.isArray(timetable[currentDay]?.slots[currentService]) ? (
                                    <div className="space-y-2">
                                        {timetable[currentDay].slots[currentService].length > 0 ? (
                                            timetable[currentDay].slots[currentService].map((slot: TimeSlot, idx: number) => (
                                                <div
                                                    key={idx}
                                                    className="flex justify-between items-center p-2 border rounded"
                                                >
                                                    <span>{`${slot.startTime} - ${slot.endTime}`}</span>
                                                    <button
                                                        onClick={() => deleteTimeSlot(idx)}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center text-gray-500 py-4">
                                                No time slots added yet
                                            </div>
                                        )}
                                    </div>
                                ) : null}
                            </div>

                            {/* Add new slot form */}
                            <div className="border-t pt-4">
                                <h3 className="font-medium mb-2">Add New Slot</h3>
                                <div className="grid gap-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label className="text-right">Start Time</Label>
                                        <div className="col-span-3">
                                            <Select
                                                value={newSlot.startTime}
                                                onValueChange={value => handleTimeChange('start', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select start time" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {timeSlots.map((time) => (
                                                        <SelectItem
                                                            key={time}
                                                            value={time}
                                                        >
                                                            {time}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label className="text-right">End Time</Label>
                                        <div className="col-span-3">
                                            <Input
                                                type="text"
                                                value={newSlot.endTime}
                                                disabled
                                                className="border rounded p-2 bg-gray-50"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                End time is automatically set based on the service duration.
                                            </p>
                                        </div>
                                    </div>
                                    {currentService === "I" && freeTimeSlotsForServiceI.length > 0 && (
                                        <div className="p-3 bg-blue-50 rounded mb-4">
                                            <h4 className="font-medium text-blue-800 mb-2">Available Free Time Slots</h4>
                                            <div className="grid grid-cols-2 gap-2">
                                                {freeTimeSlotsForServiceI.map((slot, index) => (
                                                    <div key={index} className="text-sm text-blue-700 bg-blue-100 px-2 py-1 rounded">
                                                        {slot.startTime} - {slot.endTime}
                                                    </div>
                                                ))}
                                            </div>
                                            <p className="text-xs text-blue-600 mt-2">
                                                These are suggested time periods where you can schedule service &quot;I&quot;.
                                            </p>
                                        </div>
                                    )}

                                    {/* No free slots message for service "I" with BLUE color */}
                                    {currentService === "I" && freeTimeSlotsForServiceI.length === 0 && (
                                        <div className="p-3 bg-blue-50 rounded mb-4">
                                            <p className="text-sm text-blue-700">
                                                No free time slots of 1 hour or more available for this day.
                                            </p>
                                        </div>
                                    )}

                                    {(timeError || slotValidationError) && (
                                        <p className="text-red-500 text-sm text-center">
                                            {timeError || slotValidationError}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <DialogFooter className="flex justify-between mt-4">
                                <Button variant="outline" onClick={() => setSlotsDialogOpen(false)}>
                                    Close
                                </Button>
                                <Button
                                    onClick={addNewTimeSlot}
                                    disabled={!!timeError || !newSlot.startTime || !newSlot.endTime}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                    <Plus size={16} className="mr-1" /> Add Slot
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-4">
                        <Button type="button" variant="outline" onClick={onBack}>
                            Back
                        </Button>
                        <Button
                            type="button"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={handleContinue}
                        >
                            Continue
                        </Button>
                    </div>

                    {/* Toaster Notification */}
                    {showToaster && (
                        <div className="fixed bottom-4 right-4 bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 rounded shadow-md z-50 max-w-md animate-fade-in">
                            <div className="flex items-start">
                                <div className="ml-3">
                                    <p className="font-medium">Slot Count Mismatch</p>
                                    <div className="text-sm whitespace-pre-line">{toasterMessage}</div>
                                </div>
                                <button
                                    onClick={() => setShowToaster(false)}
                                    className="ml-auto -mx-1.5 -my-1.5 bg-orange-100 text-orange-500 rounded-lg p-1.5 hover:bg-orange-200"
                                >
                                    <span className="sr-only">Close</span>
                                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Add some global CSS for animations */}
            <style jsx global>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fadeIn 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
}

export default IntensityTab;