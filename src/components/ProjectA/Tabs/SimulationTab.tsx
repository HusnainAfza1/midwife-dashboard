"use client"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { DEFAULT_SERVICES, SERVICES_DURATIONS, SERVICE_COLORS } from "@/config/constants"
import type { AddMidwifeFormData } from "@/types"
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  parseISO,
  isSameDay,
  startOfWeek,
  endOfWeek,
  isWeekend, // Add this
} from "date-fns"
import { AlertCircle, ChevronLeft, ChevronRight, X, Calendar as CalendarIcon, List } from "lucide-react"
import { useEffect, useState } from "react"
import { SimulationEngine } from "@/utils/simulation-engine"
import { isGermanHoliday } from "@/utils/german-holidays"

// Types
interface Appointment {
  id: string
  type: string
  typeCode: string
  color: string
  patient: string
  patientId: number
  date: string
  time: string
  duration: number
  expectedTerm: string
  serviceType: string
}

interface ETData {
  name: string
  date: Date | undefined
}

interface TimeSlot {
  startTime: string
  endTime: string
}

interface DaySlots {
  slots: {
    [serviceCode: string]: TimeSlot[]
  }
}

interface Timetable {
  [dayOfWeek: string]: DaySlots
}

interface SimulationTabProps {
  onBack: () => void
  onContinue: () => void
  data: AddMidwifeFormData
  isEditMode?: boolean
}

const SimulationTab = ({ onBack, onContinue, data }: SimulationTabProps) => {
  const [currentDate, setCurrentDate] = useState(new Date()) // Use current date
  const [etDates, setEtDates] = useState<ETData[]>([])
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [showCalendar, setShowCalendar] = useState(false)
  const [isFormValid, setIsFormValid] = useState(false)
  
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar')

  // Check if prerequisites are met
  const hasMidwifeType = !!data.midwifeType?.midwifeType
  const hasIntensity = !!data.identity?.intensity
  const hasServices = Object.keys(data.services || {}).length > 0
  const hasPrerequisites = hasMidwifeType && hasIntensity && hasServices

  // Get intensity from identity data
  const intensity = data.identity?.intensity || "2"

  // Initialize ET dates based on intensity
  useEffect(() => {
    if (!hasPrerequisites) return

    const intensityNum = Number.parseInt(intensity, 10) || 2
    const initialEtDates = Array.from({ length: intensityNum }, (_, i) => ({
      name: `Patient ${i + 1}`,
      date: undefined,
    }))
    setEtDates(initialEtDates)
  }, [intensity, hasPrerequisites])

  // Check if at least one ET date is filled
  useEffect(() => {
    const atLeastOneValid = etDates.some((et) => et.date !== undefined)
    setIsFormValid(atLeastOneValid)
  }, [etDates])

  // Update ET date for a specific patient
  const updateEtDate = (index: number, date: Date | undefined) => {
    const updatedDates = [...etDates]
    updatedDates[index] = {
      ...updatedDates[index],
      date,
    }
    setEtDates(updatedDates)
  }

  // Generate comprehensive appointments using the new simulation engine
  const generateAppointments = () => {
    const appointments: Appointment[] = []

    // Use the timetable from identity
    const timetable = (data.identity?.timetable as Timetable) || {}

    // Get patients with valid ET dates
    const validPatients = etDates.filter((et) => et.date !== undefined)

    // If no patients have ET dates, return empty array
    if (validPatients.length === 0) return []

    // Get enabled services from the form data
    const enabledServices = Object.keys(data.services || {})
    console.log("Form services data:", data.services)
    console.log("Enabled services from form:", enabledServices)

    // For PRO and ULTIMATE types, ensure E1 is included if E2 is present
    const midwifeType = data.midwifeType?.midwifeType
    if (
      (midwifeType === "PRO" || midwifeType === "ULTIMATE") &&
      enabledServices.includes("E2") &&
      !enabledServices.includes("E1")
    ) {
      enabledServices.push("E1")
      console.log("Added E1 to enabled services for", midwifeType, "type")
    }

    console.log("Final enabled services:", enabledServices)

    // Create simulation engine
    const engine = new SimulationEngine(timetable, Number.parseInt(intensity), enabledServices)

    // Prepare customer data for simulation
    const customers = validPatients.map((patient, index) => ({
      id: `customer-${index + 1}`,
      name: patient.name,
      et: patient.date!,
      contractDate: new Date(), // Use current date as contract date for simulation
      birthNotificationDate: undefined,
    }))

    // Generate simulation
    const simulation = engine.generateSimulation(customers)

    // Convert simulation appointments to display format
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    simulation.appointments.forEach((simAppt, index) => {
      const service = data.services?.[simAppt.appointmentCode] || DEFAULT_SERVICES[simAppt.appointmentCode]
      const durationInfo = SERVICES_DURATIONS.find((s) => s.id === simAppt.appointmentCode)
      const durationMinutes = service?.duration
        ? Number.parseInt(service.duration.split(" ")[0])
        : durationInfo?.duration || simAppt.duration

      if (service) {
        const patientIndex = validPatients.findIndex((p) => p.name === simAppt.customerName)

        appointments.push({
          id: simAppt.id,
          type: service.title,
          typeCode: simAppt.appointmentCode,
          color: SERVICE_COLORS[simAppt.appointmentCode] || "bg-gray-500",
          patient: simAppt.customerName,
          patientId: patientIndex + 1,
          date: simAppt.date,
          time: simAppt.startTime,
          duration: durationMinutes,
          expectedTerm: simAppt.et ? format(parseISO(simAppt.et), "MMMM d, yyyy") : "Unknown",
          serviceType: service.serviceType,
        })
      }
    })

    // Filter appointments to only show those in the current month view
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)

    const filteredAppointments = appointments.filter((apt) => {
      const aptDate = parseISO(apt.date)
      return aptDate >= monthStart && aptDate <= monthEnd
    })

    // Sort appointments for list view
    return filteredAppointments.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }

  // Demo appointments data
  const [appointments, setAppointments] = useState<Appointment[]>([])

  useEffect(() => {
    if (showCalendar) {
      setAppointments(generateAppointments())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDate, showCalendar, etDates, viewMode])

  // Generate calendar days
  const generateCalendarDays = () => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)

    return eachDayOfInterval({ start: startDate, end: endDate })
  }

  // Get appointments for a specific day
  const getAppointmentsForDay = (date: Date) => {
    const dateString = format(date, "yyyy-MM-dd")
    return appointments.filter((appointment) => appointment.date === dateString)
  }

  // Handle appointment click
  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
  }

  // Close appointment detail popup
  const closeAppointmentDetail = () => {
    setSelectedAppointment(null)
  }

  // Generate simulated calendar
  const generateCalendar = () => {
    if (isFormValid) {
      setShowCalendar(true)
    } else {
      alert("Please provide at least one Expected Term (ET) date")
    }
  }

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1))
  }

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1))
  }

  // Go to today
  const goToToday = () => {
    setCurrentDate(new Date())
  }

  // Group appointments by date for list view
  const groupAppointmentsByDate = () => {
    const grouped: { [date: string]: Appointment[] } = {}
    
    appointments.forEach(appointment => {
      const dateKey = appointment.date
      if (!grouped[dateKey]) {
        grouped[dateKey] = []
      }
      grouped[dateKey].push(appointment)
    })

    // Sort dates and appointments within each date
    return Object.keys(grouped)
      .sort()
      .map(date => ({
        date,
        appointments: grouped[date].sort((a, b) => a.time.localeCompare(b.time))
      }))
  }

  // If prerequisites are not met, show a message
  if (!hasPrerequisites) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Prerequisites not met</AlertTitle>
          <AlertDescription>
            Please complete the following sections before proceeding to the Simulation tab:
            <ul className="list-disc pl-5 mt-2">
              {!hasMidwifeType && <li>Select a Midwife Type</li>}
              {!hasIntensity && <li>Set Intensity and Timetable</li>}
              {!hasServices && <li>Configure Services</li>}
            </ul>
          </AlertDescription>
        </Alert>

        <div className="flex justify-between pt-6">
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button type="button" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={onContinue} disabled>
            Continue
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold mb-4">Intensity: {intensity} CLIENTS PER MONTH</h1>

        <div className="space-y-4">
          {etDates.map((etData, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 items-end">
              <div>
                <Label htmlFor={`client${index + 1}Name`}>{etData.name}:</Label>
                <Input id={`client${index + 1}Name`} value={etData.name} disabled className="bg-gray-100" />
              </div>
              <div>
                <Label htmlFor={`client${index + 1}ET`}>{etData.name} ET:</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal ${!etData.date ? "border-red-300" : "border-green-300"}`}
                      id={`client${index + 1}ET`}
                    >
                      {etData.date ? (
                        format(etData.date, "PPP")
                      ) : (
                        <span className="text-muted-foreground">Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={etData.date}
                      onSelect={(date) => updateEtDate(index, date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          ))}
        </div>

        <Alert className="my-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Note</AlertTitle>
          <AlertDescription>
            Provide Expected Term (ET) dates for the patients you want to include in the simulation. All patients with
            an ET date will be included in the simulation.
          </AlertDescription>
        </Alert>

        <Button onClick={generateCalendar} className="bg-blue-500 hover:bg-blue-600 mt-4" disabled={!isFormValid}>
          Generate the Simulated Calendar
        </Button>
      </div>

      {showCalendar && (
        <div>
          <p className="mb-4">Below is the Simulated Calendar based on the midwife type and intensity</p>

          {/* NEW TOGGLE BUTTONS */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2 border rounded-lg p-1">
              <Button
                variant={viewMode === 'calendar' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('calendar')}
                className="flex items-center gap-2"
              >
                <CalendarIcon className="h-4 w-4" />
                Calendar View
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="flex items-center gap-2"
              >
                <List className="h-4 w-4" />
                List View
              </Button>
            </div>
          </div>

          {/*CALENDAR VIEW (EXISTING CODE) */}
          {viewMode === 'calendar' && (
            <div className="border rounded-md overflow-hidden">
              <div className="p-4 border-b flex flex-col md:flex-row justify-between items-center gap-4">
                <h2 className="text-lg font-semibold">Treatment Plan Calendar</h2>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex gap-2">
                    <button className="px-3 py-1 text-sm border rounded hover:bg-gray-100" onClick={goToPreviousMonth}>
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button className="px-3 py-1 text-sm border rounded bg-gray-100" onClick={goToToday}>
                      Today
                    </button>
                    <button className="px-3 py-1 text-sm border rounded hover:bg-gray-100" onClick={goToNextMonth}>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="font-medium">{format(currentDate, "MMMM yyyy")}</span>
                </div>
              </div>

              <div className="grid grid-cols-7 text-center border-b">
                <div className="p-2 border-r font-medium">Sun</div>
                <div className="p-2 border-r font-medium">Mon</div>
                <div className="p-2 border-r font-medium">Tue</div>
                <div className="p-2 border-r font-medium">Wed</div>
                <div className="p-2 border-r font-medium">Thu</div>
                <div className="p-2 border-r font-medium">Fri</div>
                <div className="p-2 font-medium">Sat</div>
              </div>

              <div className="grid grid-cols-7">
                {generateCalendarDays().map((day, index) => {
                  const dayAppointments = getAppointmentsForDay(day)
                  const isCurrentMonth = isSameMonth(day, currentDate)
                  const isToday = isSameDay(day, new Date())
                  const isHoliday = isGermanHoliday(day)
                  const isWeekendDay = isWeekend(day)

                  return (
                    <div
                      key={index}
                      className={`min-h-[100px] border-r border-b p-1 ${
                        isCurrentMonth ? "" : "bg-gray-50 text-gray-400"
                      } ${isToday ? "bg-blue-50" : ""} ${
                        isHoliday ? "bg-red-50" : ""
                      } ${isWeekendDay && !isHoliday ? "bg-gray-100" : ""}`}
                      style={{ borderRight: index % 7 === 6 ? "none" : undefined }}
                    >
                      <div
                        className={`text-right p-1 ${isToday ? "font-bold text-blue-600" : ""} ${
                          isHoliday ? "text-red-600 font-semibold" : ""
                        }`}
                      >
                        {format(day, "d")}
                        {isHoliday && <div className="text-xs text-red-500">Holiday</div>}
                      </div>
                      <div className="space-y-1 overflow-y-auto max-h-[80px]">
                        {dayAppointments.map((appointment) => (
                          <div
                            key={appointment.id}
                            className={`${appointment.color} text-white text-xs p-1 rounded cursor-pointer truncate`}
                            onClick={() => handleAppointmentClick(appointment)}
                            title={`${appointment.typeCode} - ${appointment.type} - ${appointment.patient}`}
                          >
                            {appointment.typeCode} - {appointment.time} - {appointment.patient}
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/*NEW LIST VIEW */}
          {viewMode === 'list' && (
            <div className="border rounded-md overflow-hidden">
              <div className="p-4 border-b flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                  <h2 className="text-lg font-semibold">Treatment Plan List</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {appointments.length} appointment{appointments.length !== 1 ? 's' : ''} in {format(currentDate, "MMMM yyyy")}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex gap-2">
                    <button className="px-3 py-1 text-sm border rounded hover:bg-gray-100" onClick={goToPreviousMonth}>
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button className="px-3 py-1 text-sm border rounded bg-gray-100" onClick={goToToday}>
                      Today
                    </button>
                    <button className="px-3 py-1 text-sm border rounded hover:bg-gray-100" onClick={goToNextMonth}>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="font-medium">{format(currentDate, "MMMM yyyy")}</span>
                </div>
              </div>

              <div className="max-h-[600px] overflow-y-auto">
                {appointments.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <p>No appointments scheduled for {format(currentDate, "MMMM yyyy")}</p>
                  </div>
                ) : (
                  groupAppointmentsByDate().map(({ date, appointments: dayAppointments }) => (
                    <div key={date} className="border-b last:border-b-0">
                      <div className="bg-gray-50 px-4 py-3 border-b">
                        <h3 className="font-semibold text-gray-800">
                          {format(parseISO(date), "EEEE, MMMM d, yyyy")}
                        </h3>
                        <span className="text-sm text-gray-600">
                          {dayAppointments.length} appointment{dayAppointments.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      
                      <div className="space-y-0">
                        {dayAppointments.map((appointment) => (
                          <div
                            key={appointment.id}
                            className="p-4 hover:bg-gray-50 cursor-pointer border-b last:border-b-0 transition-colors"
                            onClick={() => handleAppointmentClick(appointment)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className={`w-4 h-4 rounded ${appointment.color}`}></div>
                                <div>
                                  <div className="font-medium text-gray-900">
                                    {appointment.typeCode} - {appointment.type}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {appointment.patient} (Patient {appointment.patientId})
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-medium text-gray-900">{appointment.time}</div>
                                <div className="text-sm text-gray-600">{appointment.duration} min</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* SERVICE LEGEND (SHOWS FOR BOTH VIEWS) */}
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
            <div className="flex items-center gap-1 text-xs">
              <div className="w-3 h-3 bg-purple-500 rounded"></div>
              <span>B1 - Pre Birth Visit</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <div className="w-3 h-3 bg-pink-500 rounded"></div>
              <span>B2 - Pre Birth Video</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <div className="w-3 h-3 bg-red-600 rounded"></div>
              <span>C1 - Early Care Visit</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <div className="w-3 h-3 bg-orange-500 rounded"></div>
              <span>C2 - Early Care Video</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <div className="w-3 h-3 bg-yellow-600 rounded"></div>
              <span>D1 - Late Care Visit</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <div className="w-3 h-3 bg-amber-500 rounded"></div>
              <span>D2 - Late Care Video</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <div className="w-3 h-3 bg-indigo-600 rounded"></div>
              <span>E1 - Birth Training</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <div className="w-3 h-3 bg-purple-700 rounded"></div>
              <span>F1 - After Birth Gym</span>
            </div>
          </div>

          <div className="flex justify-between pt-6">
            <Button type="button" variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={onContinue}>
              Continue
            </Button>
          </div>
        </div>
      )}

      {/* Appointment Detail Popup (UNCHANGED) */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-md shadow-lg w-full max-w-md relative">
            <button
              onClick={closeAppointmentDetail}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>

            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-700">
                {selectedAppointment.typeCode} - {selectedAppointment.type}
              </h3>

              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <div className="font-medium">Patient:</div>
                  <div className="col-span-2">
                    {selectedAppointment.patient} (Patient {selectedAppointment.patientId})
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="font-medium">Service Type:</div>
                  <div className="col-span-2">{selectedAppointment.serviceType}</div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="font-medium">Date:</div>
                  <div className="col-span-2">{format(parseISO(selectedAppointment.date), "EEEE, MMMM d, yyyy")}</div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="font-medium">Time:</div>
                  <div className="col-span-2">{selectedAppointment.time}</div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="font-medium">Duration:</div>
                  <div className="col-span-2">{selectedAppointment.duration} minutes</div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="font-medium">Expected Term:</div>
                  <div className="col-span-2">{selectedAppointment.expectedTerm}</div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="font-medium">Description:</div>
                  <div className="col-span-2">
                    {data.services?.[selectedAppointment.typeCode]?.description ||
                      DEFAULT_SERVICES[selectedAppointment.typeCode]?.description ||
                      "No description available"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SimulationTab