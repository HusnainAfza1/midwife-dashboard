"use client"

import { toast } from "sonner"
import { Pencil, Users, Calendar, MapPin, Clock, Check } from "lucide-react"
import { useEffect, useState, } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MidwifeTypeData, MidwifeTypeKey, IdentityData } from "@/types"
import { DEFAULT_SERVICES, SERVICES } from "@/config/constants"
import { ServiceApiData, ServiceData } from "@/types/servicesData"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

const PUFFER_CODES = ["H"];
const SPECIAL_CODES = ["G"]
const isSpecialService = (code: string) => SPECIAL_CODES.includes(code);
const isPuffer = (code: string) => PUFFER_CODES.includes(code);

// Helper function to convert constant data to component data 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const convertConstantToServiceData = (constantData: any, key: string): ServiceData => {
    // Define category mapping based on service codes
    const getCategoryFromCode = (code: string): string => {
        if (['A1/A2'].includes(code)) return 'consultation';
        if (['B1', 'B2'].includes(code)) return 'prenatal';
        if (['C1', 'C2', 'D1', 'D2'].includes(code)) return 'postnatal';
        if (['E1', 'E2', 'F1', 'F2'].includes(code)) return 'classes';
        return 'other';
    };

    // Define default intervals and starting points
    const getDefaultsFromCode = (code: string) => {
        const defaults: Record<string, { startingAt: string; interval: string }> = {
            'A1/A2': { startingAt: '4th week of pregnancy', interval: 'Once' },
            'B1': { startingAt: '12th week of pregnancy', interval: 'Every 4 weeks' },
            'B2': { startingAt: '12th week of pregnancy', interval: 'Every 4 weeks' },
            'C1': { startingAt: '1st day after birth', interval: 'Daily for first week' },
            'C2': { startingAt: '1st day after birth', interval: 'Daily for first week' },
            'D1': { startingAt: '2nd week after birth', interval: 'Weekly for 8 weeks' },
            'D2': { startingAt: '2nd week after birth', interval: 'Weekly for 8 weeks' },
            'E1': { startingAt: '32nd week of pregnancy', interval: 'Weekly for 6 weeks' },
            'E2': { startingAt: '32nd week of pregnancy', interval: 'Weekly for 6 weeks' },
            'F1': { startingAt: '6th week after birth', interval: 'Weekly for 12 weeks' },
            'F2': { startingAt: '6th week after birth', interval: 'Weekly for 12 weeks' },
            'G': { startingAt: 'Any time', interval: 'As needed' },
            // 'H': { startingAt: 'Any time', interval: 'As needed' },
            'I': { startingAt: 'Any time', interval: 'As scheduled' },
        };
        return defaults[code] || { startingAt: '', interval: '' };
    };

    const getDefaultAppointmentsAndTurnover = (code: string) => {
        const defaults: Record<string, { appointments: string | null; turnover: string | null }> = {
            'A1/A2': { appointments: "1", turnover: "8,36€" },
            'B1': { appointments: "3", turnover: "8,36€" },
            'B2': { appointments: "3", turnover: "8,36€" },
            'C1': { appointments: "10", turnover: "8,36€" },
            'C2': { appointments: "10", turnover: "8,36€" },
            'D1': { appointments: "8", turnover: "8,36€" },
            'D2': { appointments: "8", turnover: "8,36€" },
            'E1': { appointments: "6", turnover: "8,36€" },
            'E2': { appointments: "6", turnover: "8,36€" },
            'F1': { appointments: "8", turnover: "8,36€" },
            'F2': { appointments: "8", turnover: "8,36€" },
            'G': { appointments: null, turnover: null },
            // 'H': { appointments: null, turnover: null }, // Puffer service - no appointments/turnover
            'I': { appointments: "8", turnover: "8,36€" },
        };
        return defaults[code] || { appointments: null, turnover: null };
    };

    const defaults = getDefaultsFromCode(key);
    const appointmentsAndTurnover = getDefaultAppointmentsAndTurnover(key);

    return {
        code: key,
        title: constantData.title || '',
        description: constantData.description || '',
        serviceType: constantData.serviceType || '',
        duration: constantData.duration || '',
        startingAt: defaults.startingAt,
        interval: defaults.interval,
        appointments: appointmentsAndTurnover.appointments,
        turnover: appointmentsAndTurnover.turnover,
        category: getCategoryFromCode(key)
    };
};

interface ServicesInfoProps {
    midwifeServices?: Record<string, ServiceApiData>;
    midwifeIntensity: IdentityData // Data from parent component   
    midwifeType: MidwifeTypeData
    onChange?: (data: Record<string, ServiceApiData>) => void; // Function to update parent state
    onBack: () => void;
    onContinue: () => void;
    isEditMode?: boolean
}

// Create a local PrivateService interface that matches what we expect
interface LocalPrivateService {
    id: string;
    name: string;
    tagline: string;
    frequency: number;
    frequencyPeriod: string;
    duration: string;
    type: string;
    serviceMode: string;
    appointments: string;
    turnover: string;
    selectedDays: string[];
    maxParticipants?: number;
    startDate?: string;
}

const EmptyStateMessage = ({ category }: { category: string }) => {
    const messages: Record<string, string> = {
        consultation: "No consultation services are available for this midwife.",
        prenatal: "No prenatal services are available for this midwife.",
        postnatal: "No postnatal services are available for this midwife.",
        classes: "No classes or courses are available for this midwife.",
        other: "No additional services are available for this midwife."
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <h3 className="text-lg font-medium text-gray-800 mb-2">No Services Available</h3>
            <p className="text-gray-600">{messages[category] || "No services available."}</p>
        </div>
    );
};

const ServiceSection = ({
    title,
    children,
    categoryColor
}: {
    title: string,
    children: React.ReactNode,
    categoryColor: string
}) => {
    return (
        <div>
            <h3 className={`text-lg font-semibold mb-4 pb-2 border-b-2 ${categoryColor}`}>
                {title}
            </h3>
            <div className="space-y-6">
                {children}
            </div>
        </div>
    );
};

interface TimeSlot {
    startTime: string;
    endTime: string;
}

interface DayData {
    slots: {
        [serviceCode: string]: TimeSlot[];
    };
}

// interface TimetableData {
//     [day: string]: DayData;
// }

interface ServiceCardProps {
    service: ServiceData;
    midwifeIntensity: IdentityData;
    onEdit: () => void;
    midwifeType?: MidwifeTypeData;
    onSlotsChange?: (serviceCode: string, privateServiceName: string, selectedSlots: string[]) => void;
    // Each private service has its own selected slots
    privateServiceSlots?: Record<string, string[]>;
}

const ServiceCard = ({ service, onEdit, midwifeType, midwifeIntensity, onSlotsChange, privateServiceSlots }: ServiceCardProps) => {
    // const isPufferService = isPuffer(service.code);

    const isSpecialServiceCard = isSpecialService(service.code);

    // Define the categories as a type
    type CategoryKey = 'prenatal' | 'postnatal' | 'classes' | 'other' | 'consultation';

    // Map the category to the appropriate color class
    const categoryColorMap: Record<CategoryKey, string> = {
        consultation: "bg-blue-600",
        prenatal: "bg-indigo-600",
        postnatal: "bg-emerald-600",
        classes: "bg-amber-600",
        other: "bg-gray-600"
    };

    const colorClass = categoryColorMap[service.category as CategoryKey] || "bg-gray-600";

    // Function to get time slots for a specific service's selected days
    const getTimeSlotsForService = (serviceSelectedDays: string[]) => {
        // Check if timetable exists and is properly structured
        if (!midwifeIntensity?.timetable || typeof midwifeIntensity.timetable !== 'object') {
            return [];
        }

        const serviceSlots: Array<{ day: string; slot: TimeSlot; slotId: string }> = [];

        // Convert selected days to lowercase for comparison
        const selectedDaysLower = serviceSelectedDays.map(day => day.toLowerCase());

        // Get time slots for service "I" only on this service's selected days
        Object.entries(midwifeIntensity.timetable).forEach(([day, dayData]) => {
            const typedDayData = dayData as DayData;
            const dayLower = day.toLowerCase();

            if (selectedDaysLower.includes(dayLower) && typedDayData.slots?.I) {
                typedDayData.slots.I.forEach((slot, index) => {
                    const slotId = `${dayLower}-${slot.startTime}-${slot.endTime}-${index}`;
                    serviceSlots.push({
                        day: day,
                        slot: slot,
                        slotId: slotId
                    });
                });
            }
        });

        return serviceSlots;
    };

    // Helper to safely get private services from midwifeType
    const getPrivateServices = (): LocalPrivateService[] => {
        if (!midwifeType?.services) return [];

        // Try to access private-services, handling different possible structures
        const privateServicesData = midwifeType.services["private-services"];
        if (!privateServicesData || !Array.isArray(privateServicesData)) return [];

        // Convert to our local interface to ensure type safety 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return privateServicesData.map((service: any) => ({
            id: service.id || '',
            name: service.name || '',
            tagline: service.tagline || '',
            frequency: service.frequency || 0,
            frequencyPeriod: service.frequencyPeriod || '',
            duration: service.duration || '',
            type: service.type || '',
            serviceMode: service.serviceMode || '',
            appointments: service.appointments || '',
            turnover: service.turnover || '',
            selectedDays: service.selectedDays || [],
            maxParticipants: service.maxParticipants,
            startDate: service.startDate,
        }));
    };

    const privateServices = getPrivateServices();

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
            <div className={`${colorClass} text-white px-6 py-4 flex justify-between items-center`}>
                <div>
                    <h3 className="text-xl font-bold">Service {service.code}</h3>
                    <p className="text-gray-100">{service.title}</p>
                </div>

                {service.code !== "I" && (
                    <div className="flex items-center space-x-2">
                        <div className="bg-white text-gray-800 px-3 py-1 rounded-full font-bold text-sm">
                            {service.serviceType}
                        </div>
                        <button
                            onClick={onEdit}
                            className="bg-white text-gray-800 p-1 rounded-full hover:bg-gray-100"
                            title="Edit service"
                        >
                            <Pencil size={16} />
                        </button>
                    </div>
                )}
            </div>

            <div className="p-6">
                <p className="text-gray-700 mb-4">{service.description}</p>

                {service.code !== "I" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <div className="flex items-start mb-3">
                                <div className="font-medium w-36 flex-shrink-0 text-gray-500">Duration:</div>
                                <div>{service.duration}</div>
                            </div>
                            <div className="flex items-start mb-3">
                                <div className="font-medium w-36 flex-shrink-0 text-gray-500">Starting at:</div>
                                <div>{service.startingAt}</div>
                            </div>
                            <div className="flex items-start mb-3">
                                <div className="font-medium w-36 flex-shrink-0 text-gray-500">Interval:</div>
                                <div>{service.interval}</div>
                            </div>
                        </div>

                        {/* {isPufferService ? (
                            <div className="flex items-start mb-3">
                                <p className="text-sm italic text-gray-500 max-w-60">
                                    This buffer service doesn&#39;t require appointments or turnover.
                                </p>
                            </div>
                        ) : (
                            <div>
                                <div className="flex items-start mb-3">
                                    <div className="font-medium w-36 flex-shrink-0 text-gray-500">Appointments:</div>
                                    <div className="font-semibold">
                                        {service.appointments ?? (
                                            <span className="text-gray-400 italic">Not set yet</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-start mb-3">
                                    <div className="font-medium w-36 flex-shrink-0 text-gray-500">Turnover:</div>
                                    <div className="font-semibold text-blue-600">
                                        {service.turnover ?? (
                                            <span className="text-gray-400 italic">Not set yet</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )} */}
                        {isSpecialServiceCard ? (
                            <div className="flex items-start mb-3">
                                <p className="text-sm italic text-gray-500 max-w-60">
                                    This service doesn&#39;t require appointments or turnover.
                                </p>
                            </div>
                        ) : (
                            <div>
                                <div className="flex items-start mb-3">
                                    <div className="font-medium w-36 flex-shrink-0 text-gray-500">Appointments:</div>
                                    <div className="font-semibold">
                                        {service.appointments ?? (
                                            <span className="text-gray-400 italic">Not set yet</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-start mb-3">
                                    <div className="font-medium w-36 flex-shrink-0 text-gray-500">Turnover:</div>
                                    <div className="font-semibold text-blue-600">
                                        {service.turnover ?? (
                                            <span className="text-gray-400 italic">Not set yet</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                )}

                {service.code === "I" && (
                    <>
                        {/* Private Services Section */}
                        {privateServices.length === 0 ? (
                            <div className="bg-gray-50 rounded-lg p-6 text-center">
                                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Users className="w-8 h-8 text-gray-400" />
                                </div>
                                <h4 className="text-lg font-medium text-gray-800 mb-2">No Private Services Selected</h4>
                                <p className="text-gray-600 text-sm">
                                    You haven&apos;t selected any private services yet.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Private Services Display */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-lg font-semibold text-gray-800">Selected Private Services</h4>
                                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                                            {privateServices.length} service{privateServices.length !== 1 ? 's' : ''}
                                        </span>
                                    </div>

                                    <div className="grid gap-4">
                                        {privateServices.map((privateService) => {
                                            const serviceTimeSlots = getTimeSlotsForService(privateService.selectedDays);
                                            // Get selected slots for THIS specific private service
                                            const thisServiceSelectedSlots = new Set(privateServiceSlots?.[privateService.name] || []);

                                            // Function to toggle slot selection for THIS specific private service
                                            const toggleSlotSelectionForThisService = (slotId: string) => {
                                                const newSelectedSlots = new Set(thisServiceSelectedSlots);

                                                // Extract day from slotId
                                                const dayFromSlotId = slotId.split('-')[0];

                                                // Check if this slot is already selected
                                                if (newSelectedSlots.has(slotId)) {
                                                    // If clicking the same slot, just deselect it
                                                    newSelectedSlots.delete(slotId);
                                                } else {
                                                    // Find and remove any other selected slot from the same day
                                                    const slotsToRemove = Array.from(newSelectedSlots).filter(existingSlotId => {
                                                        const existingDay = existingSlotId.split('-')[0];
                                                        return existingDay === dayFromSlotId;
                                                    });

                                                    // Remove all slots from the same day
                                                    slotsToRemove.forEach(slotToRemove => {
                                                        newSelectedSlots.delete(slotToRemove);
                                                    });

                                                    // Add the new slot
                                                    newSelectedSlots.add(slotId);
                                                }

                                                // Use the callback to notify parent component with private service name
                                                onSlotsChange?.(service.code, privateService.name, Array.from(newSelectedSlots));
                                            };

                                            return (
                                                <div key={privateService.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                                                    {/* Service Header */}
                                                    <div className="flex justify-between items-start mb-3">
                                                        <div>
                                                            <h5 className="font-semibold text-gray-900 text-lg">{privateService.name}</h5>
                                                            <p className="text-gray-600 text-sm">{privateService.tagline}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                                                                {privateService.frequency} {privateService.frequencyPeriod}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Service Details Grid */}
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                        <div className="flex items-center space-x-2">
                                                            <Clock className="w-4 h-4 text-gray-400" />
                                                            <div>
                                                                <div className="text-gray-600">Duration</div>
                                                                <div className="font-medium">{privateService.duration}</div>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center space-x-2">
                                                            <MapPin className="w-4 h-4 text-gray-400" />
                                                            <div>
                                                                <div className="text-gray-600">Type</div>
                                                                <div className="font-medium">{privateService.type}</div>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center space-x-2">
                                                            <Users className="w-4 h-4 text-gray-400" />
                                                            <div>
                                                                <div className="text-gray-600">Mode</div>
                                                                <div className="font-medium">{privateService.serviceMode}</div>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center space-x-2">
                                                            <Calendar className="w-4 h-4 text-gray-400" />
                                                            <div>
                                                                <div className="text-gray-600">Appointments</div>
                                                                <div className="font-medium">{privateService.appointments}</div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Additional Details */}
                                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                            <div>
                                                                <span className="text-gray-600">Selected Days:</span>
                                                                <div className="flex flex-wrap gap-1 mt-1">
                                                                    {privateService.selectedDays.map(day => (
                                                                        <span key={day} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded capitalize">
                                                                            {day}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            <div className="flex justify-between items-center">
                                                                <div>
                                                                    <span className="text-gray-600">Turnover:</span>
                                                                    <span className="ml-2 font-semibold text-green-600">{privateService.turnover}</span>
                                                                </div>
                                                                {privateService.serviceMode === "Group" && privateService.maxParticipants && (
                                                                    <div>
                                                                        <span className="text-gray-600">Max Participants:</span>
                                                                        <span className="ml-2 font-medium">{privateService.maxParticipants}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Time Slots for this specific service */}
                                                    {serviceTimeSlots.length > 0 && (
                                                        <div className="mt-4 pt-4 border-t border-gray-100">
                                                            <h6 className="font-medium text-gray-800 mb-3">Available Time Slots for {privateService.name}</h6>
                                                            <div className="space-y-3">
                                                                {Object.entries(
                                                                    serviceTimeSlots.reduce((acc, { day, slot, slotId }) => {
                                                                        if (!acc[day]) acc[day] = [];
                                                                        acc[day].push({ slot, slotId });
                                                                        return acc;
                                                                    }, {} as Record<string, Array<{ slot: TimeSlot; slotId: string }>>)
                                                                ).map(([day, slots]) => (
                                                                    <div key={day} className="bg-gray-50 rounded-md p-3">
                                                                        <h6 className="text-sm font-medium text-gray-700 mb-2 capitalize">{day}</h6>
                                                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                                                            {slots.map(({ slot, slotId }) => {
                                                                                const isSlotAvailableForThisService = privateService.selectedDays
                                                                                    .map(d => d.toLowerCase())
                                                                                    .includes(slotId.split('-')[0]);

                                                                                // Check ONLY this specific private service's selections
                                                                                const shouldShowAsSelected = () => {
                                                                                    const thisServiceSlots = privateServiceSlots?.[privateService.name] || [];

                                                                                    // Compare without index
                                                                                    const [currentDay, currentStart, currentEnd] = slotId.split('-');

                                                                                    const isMatch = thisServiceSlots.some(storedSlot => {
                                                                                        const [storedDay, storedStart, storedEnd] = storedSlot.split('-');
                                                                                        // Compare day, start time, and end time (ignore index)
                                                                                        return currentDay === storedDay &&
                                                                                            currentStart === storedStart &&
                                                                                            currentEnd === storedEnd;
                                                                                    });

                                                                                    return isMatch;
                                                                                };

                                                                                const isSelected = shouldShowAsSelected();

                                                                                return (
                                                                                    <button
                                                                                        key={slotId}
                                                                                        onClick={() => toggleSlotSelectionForThisService(slotId)}
                                                                                        disabled={!isSlotAvailableForThisService}
                                                                                        className={`
                                                                                            relative px-3 py-2 rounded-md border transition-all duration-200 text-xs font-medium
                                                                                            ${isSelected
                                                                                                ? 'border-blue-400 bg-blue-50 text-blue-700'
                                                                                                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                                                                                            }
                                                                                            ${!isSlotAvailableForThisService ? 'opacity-50 cursor-not-allowed' : ''}
                                                                                        `}
                                                                                    >
                                                                                        <div className="flex items-center justify-between">
                                                                                            <span>{slot.startTime} - {slot.endTime}</span>
                                                                                            {isSelected && (
                                                                                                <Check className="w-3 h-3 text-blue-600 ml-1" />
                                                                                            )}
                                                                                        </div>
                                                                                    </button>
                                                                                );
                                                                            })}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {privateServiceSlots && Object.values(privateServiceSlots).reduce((total, serviceSlots) => total + serviceSlots.length, 0) > 0 && (
                                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                                        <div className="flex items-center space-x-2">
                                            <Check className="w-5 h-5 text-blue-600" />
                                            <span className="text-blue-800 font-medium">
                                                {Object.values(privateServiceSlots).reduce((total, serviceSlots) => total + serviceSlots.length, 0)} time slot{Object.values(privateServiceSlots).reduce((total, serviceSlots) => total + serviceSlots.length, 0) !== 1 ? 's' : ''} selected across all services
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

const ServicesInfoTab = ({ midwifeIntensity, midwifeServices = {}, midwifeType, onChange, onBack, onContinue }: ServicesInfoProps) => {

    // Initialize services state with the default data
    const mergeServiceData = (defaultService: ServiceData, apiService: ServiceApiData): ServiceData => {
        return {
            code: apiService.code ?? defaultService.code,
            title: apiService.title ?? defaultService.title,
            description: apiService.description ?? defaultService.description,
            serviceType: apiService.serviceType ?? defaultService.serviceType,
            duration: apiService.duration ?? defaultService.duration,
            startingAt: apiService.startingAt ?? defaultService.startingAt,
            interval: apiService.interval ?? defaultService.interval,
            category: defaultService.category,
            appointments: apiService.appointments === undefined
                ? null
                : typeof apiService.appointments === 'number'
                    ? apiService.appointments.toString()
                    : apiService.appointments,
            turnover: apiService.turnover === undefined
                ? null
                : typeof apiService.turnover === 'number'
                    ? `${apiService.turnover}€`
                    : apiService.turnover,
        };
    };

    const [services, setServices] = useState<Record<string, ServiceData>>(() => {
        const initialServices: Record<string, ServiceData> = {};

        // Convert each constant to ServiceData format
        Object.entries(DEFAULT_SERVICES).forEach(([key, constantData]) => {
            initialServices[key] = convertConstantToServiceData(constantData, key);
        });

        // Apply any existing midwife services
        if (Object.keys(midwifeServices).length > 0) {
            Object.keys(midwifeServices).forEach(key => {
                if (initialServices[key]) {
                    initialServices[key] = mergeServiceData(initialServices[key], midwifeServices[key]);
                }
            });
        }

        return initialServices;
    });

    const [selectedTimeSlots, setSelectedTimeSlots] = useState<Record<string, Record<string, string[]>>>(() => {
        // Initialize with existing data from midwifeServices if available
        const initialSlots: Record<string, Record<string, string[]>> = {};

        // Check if we have existing private service data
        if (midwifeServices["I"] && typeof midwifeServices["I"] === 'object') {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const privateServicesData = midwifeServices["I"] as Record<string, any>;
            initialSlots["I"] = {};

            // Loop through each private service in the existing data
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            Object.entries(privateServicesData).forEach(([serviceName, serviceData]: [string, any]) => {
                if (serviceData.selectedDays) {
                    const selectedSlots: string[] = [];

                    // Extract selected slots from the selectedDays data
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    Object.entries(serviceData.selectedDays).forEach(([day, dayData]: [string, any]) => {
                        if (dayData.slots) {
                            // Convert back to slot ID format
                            const [startTime, endTime] = dayData.slots.split('-');
                            const slotId = `${day}-${startTime}-${endTime}-0`;
                            selectedSlots.push(slotId);
                        }
                    });

                    initialSlots["I"][serviceName] = selectedSlots;
                }
            });
        }

        return initialSlots;
    });

    // State for dialog
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentServiceKey, setCurrentServiceKey] = useState<string | null>(null);
    const [editingService, setEditingService] = useState<ServiceData | null>(null);

    const displayedServiceCodes: string[] = midwifeType?.midwifeType
        ? (SERVICES[midwifeType.midwifeType as MidwifeTypeKey] || [])
        : [];

    // Function to handle edit button click
    const handleEditService = (serviceKey: string) => {
        setCurrentServiceKey(serviceKey);
        setEditingService(services[serviceKey]);
        setIsDialogOpen(true);
    };

    const handleSlotsChange = (serviceCode: string, privateServiceName: string, selectedSlots: string[]) => {
        setSelectedTimeSlots(prev => ({
            ...prev,
            [serviceCode]: {
                ...prev[serviceCode],
                [privateServiceName]: selectedSlots
            }
        }));
    };

    // Function to save edited service
    const handleSaveService = () => {
        if (!currentServiceKey || !editingService) return;

        // Helper to ensure exactly one "€" prefix
        const addEuro = (val: string | null) =>
            val && !val.includes("€") ? `${val}€` : val;

        // Build the service object we'll store
        const updatedService: ServiceData = isPuffer(currentServiceKey)
            ? {
                ...editingService,
                appointments: null,
                turnover: null,
            }
            : {
                ...editingService,
                // appointments logic from the previous "locked" fix
                appointments: isAppointmentsLocked
                    ? editingService.appointments
                    : draftAppointments === "" ? null : draftAppointments,
                turnover: addEuro(draftTurnover === "" ? null : draftTurnover),
            };

        // Push into the big state object
        const updatedServices = {
            ...services,
            [currentServiceKey]: updatedService,
        };

        setServices(updatedServices);
        onChange?.(prepareServiceDataForApi(updatedServices));
        setIsDialogOpen(false);
    };

    // Function to update editing service field
    const updateEditingService = (field: string, value: string | null) => {
        if (editingService) {
            setEditingService({
                ...editingService,
                [field]: value
            });
        }
    };

    // Function to prepare turnover for editing - remove € symbol
    const prepareForEditing = (value: string | null) => {
        if (value === null) return "";
        return value.replace('€', '');
    };

    // Helper to safely get private services
    const getPrivateServicesForApi = () => {
        if (!midwifeType?.services) return [];

        const privateServicesData = midwifeType.services["private-services"];
        if (!privateServicesData || !Array.isArray(privateServicesData)) return [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return privateServicesData.map((service: any) => ({
            name: service.name || '',
            tagline: service.tagline || '',
            frequency: service.frequency || 0,
            frequencyPeriod: service.frequencyPeriod || '',
            duration: service.duration || '',
            type: service.type || '',
            serviceMode: service.serviceMode || '',
            appointments: service.appointments || '',
            turnover: service.turnover || '',
            selectedDays: service.selectedDays || [],
            maxParticipants: service.maxParticipants,
            startDate: service.startDate,
        }));
    };

    // Function to prepare the service data for the API
    const prepareServiceDataForApi = (serviceData: Record<string, ServiceData> = services): Record<string, ServiceApiData> => {
        const result: Record<string, ServiceApiData> = {};

        displayedServiceCodes.forEach(code => {
            if (serviceData[code]) {
                const service = serviceData[code];

                // Special handling for service "I" - create nested object structure
                if (code === "I") {
                    const privateServices = getPrivateServicesForApi();
                    if (privateServices.length > 0) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const privateServicesObject: Record<string, any> = {};

                        privateServices.forEach((privateService) => {
                            const serviceKey = privateService.name; // Use private service name as key

                            // Map selected time slots to this private service's selected days
                            const mappedSelectedDays: Record<string, { slots?: string }> = {};

                            // ONLY initialize the days that are in this service's selectedDays
                            interface MappedSelectedDays {
                                [day: string]: {
                                    slots?: string;
                                };
                            }

                            privateService.selectedDays.forEach((day: string) => {
                                const dayLower: string = day.toLowerCase();
                                (mappedSelectedDays as MappedSelectedDays)[dayLower] = {}; // Start with empty object
                            });

                            // Add slots for days that this private service operates on AND user selected slots
                            if (selectedTimeSlots["I"] && selectedTimeSlots["I"][privateService.name]) {
                                selectedTimeSlots["I"][privateService.name].forEach(slotId => {
                                    const [dayFromSlot] = slotId.split('-'); // Extract day from slot ID
                                    const [, startTime, endTime] = slotId.split('-'); // Extract times

                                    // Only add slot if this private service operates on this day
                                    interface MappedSelectedDays {
                                        [day: string]: {
                                            slots?: string;
                                        };
                                    }

                                    if (
                                        privateService.selectedDays
                                            .map((d: string) => d.toLowerCase())
                                            .includes(dayFromSlot)
                                    ) {
                                        (mappedSelectedDays as MappedSelectedDays)[dayFromSlot] = {
                                            slots: `${startTime}-${endTime}`,
                                        };
                                    }
                                });
                            }

                            // Add this private service to the nested object
                            privateServicesObject[serviceKey] = {
                                code: "I",
                                title: privateService.name,
                                tagline: privateService.tagline,
                                serviceType: privateService.type,
                                frequency: privateService.frequency.toString(),
                                frequencyPeriod: `per ${privateService.frequencyPeriod}`,
                                serviceMode: privateService.serviceMode,
                                maxParticipants: privateService.maxParticipants?.toString() || "",
                                duration: privateService.duration,
                                startDate: privateService.startDate, // Get from private service data
                                appointments: privateService.appointments,
                                turnover: privateService.turnover,
                                selectedDays: mappedSelectedDays
                            };
                        });

                        // Set the entire "I" service as a nested object containing all private services 
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        result[code] = privateServicesObject as any;
                    }
                } else if (code !== "I") {
                    // Regular services - include all standard fields
                    result[code] = {
                        code: service.code,
                        title: service.title,
                        description: service.description,
                        serviceType: service.serviceType,
                        duration: service.duration,
                        startingAt: service.startingAt,
                        interval: service.interval,
                        appointments: service.appointments,
                        turnover: service.turnover
                    };
                }
            }
        });

        return result;
    };

    // Updated validation function to skip service "I" in regular validation
    const validateServiceData = (data: Record<string, ServiceApiData>): { isValid: boolean; message: string } => {
        for (const code in data) {
            if (isSpecialService(code) || code === "I" || isPuffer(code)) continue; // Skip validation for Puffer services AND service "I"

            const service = data[code];

            // Validation for regular services only (not "I")
            if (service.appointments === null || service.appointments === undefined) {
                return {
                    isValid: false,
                    message: `Number of appointments for service ${code} (${service.title}) is required.`
                };
            }

            if (service.turnover === null || service.turnover === undefined) {
                return {
                    isValid: false,
                    message: `Turnover for service ${code} (${service.title}) is required.`
                };
            }
        }

        return {
            isValid: true,
            message: ""
        };
    };

    // Function to validate private services
    const validatePrivateServices = (): { isValid: boolean; message: string } => {
        const privateServices = getPrivateServicesForAPI();
        if (privateServices.length === 0) {
            return { isValid: true, message: "" };
        }

        // 1. Check that EVERY operating day has EXACTLY ONE slot selected
        for (const privateService of privateServices) {
            for (const day of privateService.selectedDays) {
                const dayLower = day.toLowerCase();

                // Check if this specific day has a slot selected
                const hasSlotForThisDay = selectedTimeSlots["I"]?.[privateService.name]?.some(slotId => {
                    const [slotDay] = slotId.split('-');
                    return slotDay === dayLower;
                });

                if (!hasSlotForThisDay) {
                    return {
                        isValid: false,
                        message: `Private service '${privateService.name}' is missing a time slot for ${day}. Please select exactly one slot for each operating day.`
                    };
                }
            }
        }

        // 2. Check for time conflicts between different private services on the same day
        const allSelectedSlots: Array<{ slotId: string, serviceName: string }> = [];

        // Collect all selected slots from all private services
        Object.entries(selectedTimeSlots["I"] || {}).forEach(([serviceName, slots]) => {
            slots.forEach(slotId => {
                allSelectedSlots.push({ slotId, serviceName });
            });
        });

        for (let i = 0; i < allSelectedSlots.length; i++) {
            for (let j = i + 1; j < allSelectedSlots.length; j++) {
                const slot1 = allSelectedSlots[i];
                const slot2 = allSelectedSlots[j];

                // Skip if same service (no conflict within same service)
                if (slot1.serviceName === slot2.serviceName) continue;

                const [day1, startTime1, endTime1] = slot1.slotId.split('-');
                const [day2, startTime2, endTime2] = slot2.slotId.split('-');

                // Check if both slots are on the same day
                if (day1 === day2) {
                    // Check if times overlap
                    const start1 = timeToMinutes(startTime1);
                    const end1 = timeToMinutes(endTime1);
                    const start2 = timeToMinutes(startTime2);
                    const end2 = timeToMinutes(endTime2);

                    // Check for overlap: (start1 < end2) && (start2 < end1)
                    if (start1 < end2 && start2 < end1) {
                        return {
                            isValid: false,
                            message: `Time conflict on ${day1}: '${slot1.serviceName}' (${startTime1}-${endTime1}) conflicts with '${slot2.serviceName}' (${startTime2}-${endTime2})`
                        };
                    }
                }
            }
        }

        return { isValid: true, message: "" };
    };

    // Helper function with correct name
    const getPrivateServicesForAPI = () => {
        return getPrivateServicesForApi();
    };

    // Helper functions
    const timeToMinutes = (timeStr: string): number => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    };

    // Handle continue button click
    const handleContinue = () => {
        // Step 1: Prepare the data for the API
        const serviceDataForApi = prepareServiceDataForApi();

        // Step 2: Validate regular services first
        const regularValidationResult = validateServiceData(serviceDataForApi);
        if (!regularValidationResult.isValid) {
            toast("Error", {
                description: regularValidationResult.message,
            });
            return; // Stop here if regular validation fails
        }

        // Step 3: Validate private services (slots and conflicts) - ONLY on Continue button click
        const privateServiceValidationResult = validatePrivateServices();
        if (!privateServiceValidationResult.isValid) {
            toast("Error", {
                description: privateServiceValidationResult.message,
            });
            return; // Stop here if private service validation fails
        }

        // Step 4: If ALL validations pass, proceed
        if (onChange) {
            onChange(serviceDataForApi);
        }

        // Step 5: Continue to next step
        onContinue();
    };

    // Filter services based on the displayedServiceCodes array
    const filteredServices = Object.entries(services)
        .filter(([key]) => displayedServiceCodes.includes(key))
        .reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
        }, {} as Record<string, ServiceData>);

    // Group filtered services by category  
    const consultationServices = Object.values(filteredServices).filter(service => service.category === "consultation");
    const prenatalServices = Object.values(filteredServices).filter(service => service.category === "prenatal");
    const postnatalServices = Object.values(filteredServices).filter(service => service.category === "postnatal");
    const classesServices = Object.values(filteredServices).filter(service => service.category === "classes");
    const otherServices = Object.values(filteredServices).filter(service => service.category === "other");

    // local state inside the dialog
    const [isAppointmentsLocked, setIsAppointmentsLocked] = useState(false);
    const [draftAppointments, setDraftAppointments] = useState<string>("");
    const [draftTurnover, setDraftTurnover] = useState<string>("");

    useEffect(() => {
        if (!isDialogOpen) return;
        if (!editingService) return;

        // Get default appointments from converted constants
        const defaultService = convertConstantToServiceData(DEFAULT_SERVICES[editingService.code] || {}, editingService.code);
        const defaultAppointments = defaultService.appointments;
        const initiallyEditable = defaultAppointments === null;

        setIsAppointmentsLocked(
            !initiallyEditable && editingService.appointments !== null
        );

        setDraftAppointments(editingService.appointments ?? "");
        setDraftTurnover(prepareForEditing(editingService.turnover));
    }, [isDialogOpen, editingService]);

    return (
        <div className="w-full max-w-5xl mx-auto pb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Midwife Services Overview</h2>

            {!midwifeType?.midwifeType ? (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                    <div className="flex">
                        <div className="ml-3">
                            <p className="text-sm text-yellow-700">
                                Midwife type is not selected. Please select a midwife type to view available services.
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div className="mb-6">
                        <p className="text-gray-600 text-sm mb-4">
                            Selected Midwife Type: <span className="font-semibold">{midwifeType.midwifeType}</span>
                        </p>
                        <div className="flex flex-wrap gap-3 mb-4">
                            <button
                                onClick={() => {
                                    document.getElementById('consultation-section')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
                            >
                                Consultation
                            </button>
                            <button
                                onClick={() => {
                                    document.getElementById('prenatal-section')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="bg-indigo-100 text-indigo-800 px-4 py-1 rounded-full text-sm font-medium hover:bg-indigo-200 transition-colors"
                            >
                                Prenatal
                            </button>
                            <button
                                onClick={() => {
                                    document.getElementById('postnatal-section')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="bg-emerald-100 text-emerald-800 px-4 py-1 rounded-full text-sm font-medium hover:bg-emerald-200 transition-colors"
                            >
                                Postnatal
                            </button>
                            <button
                                onClick={() => {
                                    document.getElementById('classes-section')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="bg-amber-100 text-amber-800 px-4 py-1 rounded-full text-sm font-medium hover:bg-amber-200 transition-colors"
                            >
                                Classes & Courses
                            </button>
                            <button
                                onClick={() => {
                                    document.getElementById('other-section')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="bg-gray-100 text-gray-800 px-4 py-1 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
                            >
                                Other Services
                            </button>
                        </div>
                    </div>

                    <div className="space-y-8">

                        {/* Consultation Services Section - NEW SECTION AT TOP */}
                        <div id="consultation-section">
                            <ServiceSection title="Consultation Services" categoryColor="border-blue-500">
                                {consultationServices.length > 0 ? (
                                    consultationServices.map((service) => (
                                        <ServiceCard
                                            key={service.code}
                                            service={service}
                                            midwifeType={midwifeType}
                                            midwifeIntensity={midwifeIntensity}
                                            onEdit={() => handleEditService(service.code)}
                                            onSlotsChange={handleSlotsChange}
                                            privateServiceSlots={selectedTimeSlots["I"] || {}}
                                        />
                                    ))
                                ) : (
                                    <EmptyStateMessage category="consultation" />
                                )}
                            </ServiceSection>
                        </div>

                        {/* Prenatal Services Section */}
                        <div id="prenatal-section">
                            <ServiceSection title="Prenatal Services" categoryColor="border-indigo-500">
                                {prenatalServices.length > 0 ? (
                                    prenatalServices.map((service) => (
                                        <ServiceCard
                                            key={service.code}
                                            service={service}
                                            midwifeType={midwifeType}
                                            midwifeIntensity={midwifeIntensity}
                                            onEdit={() => handleEditService(service.code)}
                                            onSlotsChange={handleSlotsChange}
                                            privateServiceSlots={selectedTimeSlots["I"] || {}}
                                        />
                                    ))
                                ) : (
                                    <EmptyStateMessage category="prenatal" />
                                )}
                            </ServiceSection>
                        </div>

                        {/* Postnatal Services Section */}
                        <div id="postnatal-section">
                            <ServiceSection title="Postnatal Services" categoryColor="border-emerald-500">
                                {postnatalServices.length > 0 ? (
                                    postnatalServices.map((service) => (
                                        <ServiceCard
                                            key={service.code}
                                            service={service}
                                            midwifeType={midwifeType}
                                            midwifeIntensity={midwifeIntensity}
                                            onEdit={() => handleEditService(service.code)}
                                            onSlotsChange={handleSlotsChange}
                                            privateServiceSlots={selectedTimeSlots["I"] || {}}
                                        />
                                    ))
                                ) : (
                                    <EmptyStateMessage category="postnatal" />
                                )}
                            </ServiceSection>
                        </div>

                        {/* Classes & Courses Section */}
                        <div id="classes-section">
                            <ServiceSection title="Classes & Courses" categoryColor="border-amber-500">
                                {classesServices.length > 0 ? (
                                    classesServices.map((service) => (
                                        <ServiceCard
                                            key={service.code}
                                            service={service}
                                            midwifeType={midwifeType}
                                            midwifeIntensity={midwifeIntensity}
                                            onEdit={() => handleEditService(service.code)}
                                            onSlotsChange={handleSlotsChange}
                                            privateServiceSlots={selectedTimeSlots["I"] || {}}
                                        />
                                    ))
                                ) : (
                                    <EmptyStateMessage category="classes" />
                                )}
                            </ServiceSection>
                        </div>

                        {/* Other Services Section */}
                        <div id="other-section">
                            <ServiceSection title="Other Services" categoryColor="border-gray-500">
                                {otherServices.length > 0 ? (
                                    otherServices.map((service) => (
                                        <ServiceCard
                                            key={service.code}
                                            service={service}
                                            midwifeType={midwifeType}
                                            midwifeIntensity={midwifeIntensity}
                                            onEdit={() => handleEditService(service.code)}
                                            onSlotsChange={handleSlotsChange}
                                            privateServiceSlots={selectedTimeSlots["I"] || {}}
                                        />
                                    ))
                                ) : (
                                    <EmptyStateMessage category="other" />
                                )}
                            </ServiceSection>
                        </div>
                    </div>

                    <div className="flex justify-between mt-8">
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
                </>
            )}

            {/* Edit Service Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Service {editingService?.code}</DialogTitle>
                    </DialogHeader>

                    {editingService && (
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="title" className="text-right">Title:</Label>
                                <Input
                                    id="title"
                                    value={editingService.title}
                                    className="col-span-3"
                                    disabled
                                />
                            </div>

                            {editingService.code === "A1/A2" ? (
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="serviceType" className="text-right font-bold">Service Type:</Label>
                                    <div className="col-span-3">
                                        <select
                                            id="serviceType"
                                            value={editingService.serviceType}
                                            onChange={(e) => updateEditingService("serviceType", e.target.value)}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <option value="In persona">In persona</option>
                                            <option value="Videocall">Videocall</option>
                                        </select>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="serviceType" className="text-right">Service Type:</Label>
                                    <Input
                                        id="serviceType"
                                        value={editingService.serviceType}
                                        className="col-span-3"
                                        disabled
                                    />
                                </div>
                            )}

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="duration" className="text-right">Duration:</Label>
                                <Input
                                    id="duration"
                                    value={editingService.duration}
                                    className="col-span-3"
                                    disabled
                                />
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="startingAt" className="text-right">Starting At:</Label>
                                <Input
                                    id="startingAt"
                                    value={editingService.startingAt}
                                    className="col-span-3"
                                    disabled
                                />
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="interval" className="text-right">Interval:</Label>
                                <Input
                                    id="interval"
                                    value={editingService.interval}
                                    className="col-span-3"
                                    disabled
                                />
                            </div>

                            {isSpecialService(editingService.code) ? (
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <p className="col-span-4 text-sm italic text-gray-500">
                                        This special service doesn&apos;t require appointments or turnover.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="appointments" className={`text-right ${isAppointmentsLocked ? "" : "font-bold"}`}>
                                            Appointments:
                                        </Label>

                                        <Input
                                            id="appointments"
                                            value={isAppointmentsLocked ? editingService!.appointments! : draftAppointments}
                                            className="col-span-3"
                                            disabled={isAppointmentsLocked}
                                            onChange={(e) =>
                                                !isAppointmentsLocked &&
                                                setDraftAppointments(e.target.value.replace(/[^0-9]/g, ""))
                                            }
                                            type="text"
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            placeholder="Not set yet"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="turnover" className="text-right font-bold">Turnover:</Label>
                                        <Input
                                            id="turnover"
                                            value={draftTurnover}
                                            className="col-span-3"
                                            onChange={(e) => {
                                                const raw = e.target.value;
                                                // keep digits and at most one comma
                                                let cleaned = raw.replace(/[^0-9,]/g, "");
                                                const firstComma = cleaned.indexOf(",");
                                                if (firstComma !== -1) {
                                                    cleaned =
                                                        cleaned.slice(0, firstComma + 1) +
                                                        cleaned.slice(firstComma + 1).replace(/,/g, "");
                                                }
                                                setDraftTurnover(cleaned);
                                            }}
                                            type="text"
                                            inputMode="numeric"
                                            pattern="[0-9.,]*"
                                            placeholder="Not set yet"
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="button" onClick={handleSaveService} className="bg-blue-600 hover:bg-blue-700 text-white">
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ServicesInfoTab;