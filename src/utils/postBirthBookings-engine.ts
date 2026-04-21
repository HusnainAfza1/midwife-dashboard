import { format, addDays, isWeekend, differenceInDays, startOfWeek, getDay } from "date-fns"
import { isGermanHoliday } from "./german-holidays"
// import { GetF1ClassesApi } from "@/endpoints/getEndpoints"  
import { GetF1ClasssesApi } from "@/endpoints/getEndpoints"
import { updateF1Classs } from "@/endpoints/putEndpoints"
import crypto from 'crypto'

// Types
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

interface BookedAppointment {
  appointmentId: string
  appointmentDate: string // DD/MM/YYYY format
  startTime: string
  endTime: string
  duration: number
  status: string
}

interface ExistingBookingsResponse {
  success: boolean
  data: {
    [monthYear: string]: {
      B1: BookedAppointment[]
      B2: BookedAppointment[]
      E1: BookedAppointment[]
      C1: BookedAppointment[]
      C2: BookedAppointment[]
      D1: BookedAppointment[]
      D2: BookedAppointment[]
      F1: BookedAppointment[]
    }
  }
}

interface F1Class {
  id: string
  startDate: string // DD/MM/YYYY format
  startTime: string
  endTime: string
  duration: number
  clients: string[]
  exceptional?: Array<{  // NEW
    classNo: string
    startDate: string
    startTime: string
    endTime: string
    duration: number
  }>
  cancelExceptional?: string[]
}

interface F1ClassesResponse {
  success: boolean
  message: string
  data: {
    _id: string
    midwifeId: string
    classes: {
      [year: string]: {
        class1?: F1Class
        class2?: F1Class
        class3?: F1Class
        class4?: F1Class
        class5?: F1Class
        class6?: F1Class
      }
    }
    createdAt: string
    updatedAt: string
    __v: number
  }
}

interface GeneratedAppointment {
  appointmentId: string
  appointmentDate: string // DD/MM/YYYY format
  startTime: string
  endTime: string
  duration: number
  status: "pending" | "cancelled"
  classId?: string  // For F1 class management
  classNo?: string  // For F1 session number
}

interface PostBirthAppointments {
  C1: GeneratedAppointment[]
  C2: GeneratedAppointment[]
  D1: GeneratedAppointment[]
  D2: GeneratedAppointment[]
  F1: GeneratedAppointment[]
}

export class PostBirthBookingEngine {
  private timetable: Timetable
  private enabledServices: string[]
  private existingBookings: ExistingBookingsResponse['data'] = {}

  constructor(timetable: Timetable, enabledServices: string[]) {
    this.timetable = timetable
    this.enabledServices = enabledServices
    console.log("PostBirthBookingEngine initialized with services:", enabledServices)
  }

  // Main method to generate post-birth appointments
  public async generatePostBirthAppointments({
    clientET,
    clientId,
    midwifeId,
    timetable,
    enabledServices,
    apiUrl
  }: {
    clientET: Date
    clientId: string
    midwifeId: string
    timetable: Timetable
    enabledServices: string[]
    apiUrl: string
  }): Promise<PostBirthAppointments> {

    this.timetable = timetable
    this.enabledServices = enabledServices

    console.log(`\n=== Scheduling post-birth appointments for ET: ${format(clientET, "yyyy-MM-dd")} ===`)

    // Step 1: Fetch existing bookings from unified API
    await this.fetchExistingBookings(apiUrl, midwifeId, clientET)

    // Step 2: Generate appointments
    const appointments: PostBirthAppointments = {
      C1: [],
      C2: [],
      D1: [],
      D2: [],
      F1: []
    }

    // Step 3: Schedule C1/C2 early care (10 consecutive days starting on ET)
    if (enabledServices.includes("C1") || enabledServices.includes("C2")) {
      const earlyCareAppointments = this.scheduleEarlyCare(clientET)
      appointments.C1 = earlyCareAppointments.C1
      appointments.C2 = earlyCareAppointments.C2
    }

    // Step 4: Schedule D1/D2 late care (starting ET+10 days - FIXED RULE)
    if (enabledServices.includes("D1") || enabledServices.includes("D2")) {
      const lateCareAppointments = this.scheduleLateCare(clientET)
      appointments.D1 = lateCareAppointments.D1
      appointments.D2 = lateCareAppointments.D2
    }

    // Step 5: Schedule F1 after birth gym with class management (8 weekly sessions starting ET+8 weeks)
    if (enabledServices.includes("F1")) {
      appointments.F1 = await this.scheduleBirthGymWithClasses(clientET, clientId, midwifeId)
    }

    console.log("Final post-birth appointments generated:")
    console.log(`C1: ${appointments.C1.length}/10, C2: ${appointments.C2.length}/10, D1: ${appointments.D1.length}, D2: ${appointments.D2.length}, F1: ${appointments.F1.length}/8`)

    return appointments
  }

  // Fetch existing bookings from unified API
  private async fetchExistingBookings(apiUrl: string, midwifeId: string, clientET: Date): Promise<void> {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          midwifeId,
          clientET: clientET.toISOString()
        })
      })

      const result: ExistingBookingsResponse = await response.json()

      if (result.success) {
        this.existingBookings = result.data
        console.log("Unified API appointments fetched:", result.data)
        console.log('Existing bookings months:', Object.keys(this.existingBookings))
      } else {
        console.log('No existing bookings found, all slots considered free')
        this.existingBookings = {}
      }
    } catch (error) {
      console.error('Error fetching existing bookings:', error)
      this.existingBookings = {} // Treat as no existing bookings
    }
  }

  // Schedule C1/C2 early care - EXACT SimulationEngine rules
  private scheduleEarlyCare(clientET: Date): { C1: GeneratedAppointment[], C2: GeneratedAppointment[] } {
    console.log(`\n--- Scheduling early care (C1/C2) ---`)

    const appointments = { C1: [] as GeneratedAppointment[], C2: [] as GeneratedAppointment[] }

    // C1/C2 - 10 consecutive days starting on ET
    for (let dayOffset = 0; dayOffset <= 9; dayOffset++) {
      const currentDay = addDays(clientET, dayOffset)

      // Day 0 (ET): MUST start with C1
      if (dayOffset === 0) {
        if (this.enabledServices.includes("C1") && this.isValidSchedulingDate(currentDay, false, "C1")) {
          const c1Slot = this.findAvailableSlot(currentDay, "C1")
          if (c1Slot) {
            const c1Appointment = this.createAppointment("C1", currentDay, c1Slot)
            appointments.C1.push(c1Appointment)
            console.log(`✅ Scheduled C1 on ${format(currentDay, "yyyy-MM-dd")} (birth day)`)
          }
        }

        // Also schedule C2 on the same day if enabled and slot available
        if (this.enabledServices.includes("C2") && this.isValidSchedulingDate(currentDay, false, "C2")) {
          const c2Slot = this.findAvailableSlot(currentDay, "C2")
          if (c2Slot) {
            const c2Appointment = this.createAppointment("C2", currentDay, c2Slot)
            appointments.C2.push(c2Appointment)
            console.log(`✅ Scheduled C2 on ${format(currentDay, "yyyy-MM-dd")} (birth day)`)
          } else {
            console.log(`❌ No C2 slot available on ${format(currentDay, "yyyy-MM-dd")}`)
          }
        }
      } else {
        // Days 1-9: Schedule both C1 and C2 if slots available and quotas not exceeded
        // CRITICAL: Allow multiple C1/C2 per day as long as time slots don't conflict
        if (this.enabledServices.includes("C1") && appointments.C1.length < 10 && this.isValidSchedulingDate(currentDay, false, "C1")) {
          const c1Slot = this.findAvailableSlot(currentDay, "C1")
          if (c1Slot) {
            const c1Appointment = this.createAppointment("C1", currentDay, c1Slot)
            appointments.C1.push(c1Appointment)
            console.log(`✅ Scheduled C1 on ${format(currentDay, "yyyy-MM-dd")} (day ${dayOffset + 1})`)
          } else {
            console.log(`❌ No C1 slot available on ${format(currentDay, "yyyy-MM-dd")}`)
          }
        }

        if (this.enabledServices.includes("C2") && appointments.C2.length < 10 && this.isValidSchedulingDate(currentDay, false, "C2")) {
          const c2Slot = this.findAvailableSlot(currentDay, "C2")
          if (c2Slot) {
            const c2Appointment = this.createAppointment("C2", currentDay, c2Slot)
            appointments.C2.push(c2Appointment)
            console.log(`✅ Scheduled C2 on ${format(currentDay, "yyyy-MM-dd")} (day ${dayOffset + 1})`)
          } else {
            console.log(`❌ No C2 slot available on ${format(currentDay, "yyyy-MM-dd")}`)
          }
        }
      }
    }

    console.log(`Early care complete: C1=${appointments.C1.length}/10, C2=${appointments.C2.length}/10`)
    return appointments
  }

  // Schedule D1/D2 late care - EXACT SimulationEngine rules
  private scheduleLateCare(clientET: Date): { D1: GeneratedAppointment[], D2: GeneratedAppointment[] } {
    console.log(`\n--- Scheduling late care (D1/D2) ---`)

    const appointments = { D1: [] as GeneratedAppointment[], D2: [] as GeneratedAppointment[] }

    // D1/D2 - Start right after C ends (ET + 10 days) - FIXED RULE FROM SIMULATION
    // Before ET+50: 2 per week, After ET+50: 1 per week
    const startDate = addDays(clientET, 10) // ET + 10 days (FIXED RULE)
    const endDate = addDays(clientET, 84) // ET + 12 weeks  
    const transitionDate = addDays(clientET, 50) // ET + 50 days

    console.log(`D scheduling window: ${format(startDate, "yyyy-MM-dd")} to ${format(endDate, "yyyy-MM-dd")}`)
    console.log(`Transition at: ${format(transitionDate, "yyyy-MM-dd")} (2/week → 1/week)`)

    let currentDate = startDate
    let totalScheduled = 0
    let shouldBeD1 = true // Start with D1, then alternate
    let weeklyCount = 0
    let currentWeekStart = startOfWeek(startDate, { weekStartsOn: 1 }) // Monday = 1

    while (currentDate <= endDate && totalScheduled < 16) {
      // Check if we've moved to a new week (Monday to Monday)
      const currentWeekStart_check = startOfWeek(currentDate, { weekStartsOn: 1 })
      if (currentWeekStart_check.getTime() !== currentWeekStart.getTime()) {
        currentWeekStart = currentWeekStart_check
        weeklyCount = 0
      }

      // Determine how many slots per week based on date
      const isBeforeTransition = currentDate < transitionDate
      const maxSlotsThisWeek = isBeforeTransition ? 2 : 1

      // Only schedule if we haven't reached the weekly limit AND it's a valid scheduling date
      if (weeklyCount < maxSlotsThisWeek && this.isValidSchedulingDate(currentDate, true)) {
        const serviceCode = shouldBeD1 ? "D1" : "D2"

        if (this.enabledServices.includes(serviceCode)) {
          // Check gap validation (2-day minimum between D1/D2)
          if (this.hasValidGap(appointments, currentDate, ["D1", "D2"], 2)) {
            const slot = this.findAvailableSlot(currentDate, serviceCode)
            if (slot) {
              const appointment = this.createAppointment(serviceCode, currentDate, slot)

              if (serviceCode === "D1") {
                appointments.D1.push(appointment)
              } else {
                appointments.D2.push(appointment)
              }

              totalScheduled++
              weeklyCount++
              shouldBeD1 = !shouldBeD1 // Alternate

              const weekNumber = Math.floor(differenceInDays(currentDate, clientET) / 7)
              console.log(
                `✅ Scheduled ${serviceCode} on ${format(currentDate, "yyyy-MM-dd")} (week ${weekNumber}, ${isBeforeTransition ? "2/week period" : "1/week period"})`,
              )
            } else {
              console.log(`❌ No slot available for ${serviceCode} on ${format(currentDate, "yyyy-MM-dd")}`)
            }
          } else {
            console.log(`❌ Gap validation failed for ${serviceCode} on ${format(currentDate, "yyyy-MM-dd")}`)
          }
        }
      }

      currentDate = addDays(currentDate, 1)
    }

    console.log(`Late care complete: D1=${appointments.D1.length}, D2=${appointments.D2.length}`)
    return appointments
  }

  // NEW: Schedule F1 with class management system
  private async scheduleBirthGymWithClasses(clientET: Date, clientId: string, midwifeId: string): Promise<GeneratedAppointment[]> {
    console.log("\n--- Scheduling birth gym (F1) with class management ---")

    // Step 1: Generate first F1 appointment using simulation rules
    const firstF1Appointment = this.generateFirstF1Appointment(clientET)
    if (!firstF1Appointment) {
      console.log("❌ Could not generate first F1 appointment")
      return []
    }

    const firstDate = this.parseAppointmentDate(firstF1Appointment.appointmentDate)
    const year = firstDate.getFullYear().toString()
    const month = firstDate.getMonth() + 1 // 1-12

    console.log(`First F1 appointment: ${firstF1Appointment.appointmentDate}, Year: ${year}, Month: ${month}`)

    // Step 2: Get month-to-class mapping
    const classKey = this.getClassFromMonth(month)
    console.log(`Month ${month} maps to ${classKey}`)

    // Step 3: Fetch existing F1 classes
    const classesData = await this.fetchF1Classes(midwifeId)
    console.log("🔍 F1 Classes data received:", classesData)
    if (classesData) {
      console.log("🗓️ Available years:", Object.keys(classesData.classes))
      if (classesData.classes[year]) {
        console.log(`📅 Classes in year ${year}:`, Object.keys(classesData.classes[year]))
      }
    }

    // Step 4: Check if year exists in classes
    if (classesData && classesData.classes[year]) {
      // Year exists - use existing classes
      return await this.handleExistingYearF1(classesData, year, classKey, clientId, firstF1Appointment)
    } else {
      // Year doesn't exist - create new year structure
      return await this.handleNewYearF1(classesData, year, clientId, midwifeId, firstF1Appointment)
    }
  }

  // Generate first F1 appointment using F1-specific simulation rules
  private generateFirstF1Appointment(clientET: Date): GeneratedAppointment | null {
    const daysWithF1 = Object.keys(this.timetable).filter(
      (day) => this.timetable[day]?.slots?.F1 && this.timetable[day].slots.F1.length > 0,
    )

    if (daysWithF1.length === 0) {
      console.log("❌ No F1 slots found in timetable for any day")
      return null
    }

    const courseStartDate = addDays(clientET, 56) // F1: ET + 8 weeks (not ET - 10 weeks like E1)
    let currentDate = courseStartDate

    console.log(`F1 course start date: ${format(courseStartDate, 'yyyy-MM-dd')}`)

    // Find first valid date with F1 slots
    for (let attempts = 0; attempts < 50; attempts++) {
      const dayName = format(currentDate, "EEEE")
      const hasF1Slots = this.timetable[dayName]?.slots?.F1 && this.timetable[dayName].slots.F1.length > 0

      if (this.isValidSchedulingDate(currentDate, true) && hasF1Slots) { // F1 uses weekdays only
        // const slot = this.findAvailableSlot(currentDate, "F1")  
        const slot = this.timetable[dayName].slots.F1[0]
        if (slot) {
          return this.createF1Appointment("F1", currentDate, slot) // Use F1-specific creation
        }
      }

      currentDate = addDays(currentDate, 1)
    }

    return null
  }

  // Map month to class (same as E1)
  private getClassFromMonth(month: number): string {
    if (month <= 2) return "class1" // Jan-Feb
    if (month <= 4) return "class2" // Mar-Apr
    if (month <= 6) return "class3" // May-Jun
    if (month <= 8) return "class4" // Jul-Aug
    if (month <= 10) return "class5" // Sep-Oct
    return "class6" // Nov-Dec
  }

  // Fetch F1 classes from API
  private async fetchF1Classes(midwifeId: string): Promise<F1ClassesResponse['data'] | null> {
    try {
      console.log("Fetching F1 classes for midwife:", midwifeId)

      const response = await GetF1ClasssesApi(midwifeId)

      console.log("F1 API Response:", response.data)

      if (response.data.success) {
        console.log("F1 classes fetched successfully")
        console.log("Full F1 classes data:", JSON.stringify(response.data.data, null, 2))
        return response.data.data
      } else {
        console.log("F1 API returned success: false")
        return null
      }
    } catch (error) {
      console.error('Error fetching F1 classes:', error)
      return null
    }
  }

  // Handle existing year scenario for F1
  private async handleExistingYearF1(
    classesData: F1ClassesResponse['data'],
    year: string,
    classKey: string,
    clientId: string,
    firstF1Appointment: GeneratedAppointment
  ): Promise<GeneratedAppointment[]> {
    console.log(`F1 Year ${year} exists, checking ${classKey}`)
    console.log("🔍 ORIGINAL F1 YEAR DATA:", JSON.stringify(classesData.classes[year], null, 2))

    const yearClasses = classesData.classes[year]
    const targetClass = yearClasses[classKey as keyof typeof yearClasses]
    console.log("🎯 TARGET F1 CLASS DATA:", JSON.stringify(targetClass, null, 2))

    if (targetClass) {
      // Scenario 3: Year exists, class exists
      console.log(`👥 Current clients in F1 ${classKey}: ${targetClass.clients.length}/10`)

      if (targetClass.clients.length < 10) {
        console.log("✅ F1 Class has space, proceeding with booking")

        const appointments = this.generateAppointmentsFromF1Class(targetClass, classKey)
        await this.updateF1ClassWithClient(classesData, year, classKey, clientId)

        console.log(`✅ Added client to existing F1 ${classKey}, generating ${appointments.length} appointments`)
        return appointments
      } else {
        console.log(`❌ F1 ${classKey} is full (${targetClass.clients.length}/10 clients)`)
        return []
      }
    } else {
      // Scenario 2: Year exists, but target class doesn't exist
      console.log(`📝 Creating missing F1 ${classKey} in existing year ${year}`)
      return await this.createMissingF1Class(classesData, year, classKey, clientId, firstF1Appointment)
    }
  }

  // Handle new year scenario for F1
  private async handleNewYearF1(
    classesData: F1ClassesResponse['data'] | null,
    year: string,
    clientId: string,
    midwifeId: string,
    firstF1Appointment: GeneratedAppointment
  ): Promise<GeneratedAppointment[]> {
    console.log(`Scenario 1: Creating new F1 year ${year} structure`)

    const firstDate = this.parseAppointmentDate(firstF1Appointment.appointmentDate)
    const month = firstDate.getMonth() + 1
    const classKey = this.getClassFromMonth(month)
    const dayOfWeek = getDay(firstDate)

    // Create only the required F1 class
    const newClass = this.createSingleF1Class(classKey, year, dayOfWeek, firstF1Appointment)
    console.log("🆕 CREATED SINGLE F1 CLASS:", JSON.stringify(newClass, null, 2))

    // Add client to the new class
    newClass.clients.push(clientId)
    console.log("👤 AFTER ADDING CLIENT TO NEW F1 CLASS:", JSON.stringify(newClass, null, 2))

    // Prepare complete classes object for API
    const existingClasses = classesData ? classesData.classes : {}
    if (!existingClasses[year]) {
      existingClasses[year] = {}
    }
    existingClasses[year][classKey as keyof typeof existingClasses[typeof year]] = newClass

    console.log("📡 COMPLETE F1 CLASSES OBJECT FOR API:", JSON.stringify({ classes: existingClasses }, null, 2))

    // Update via API
    await this.updateF1ClassesAPI(midwifeId, existingClasses)

    // Generate appointments from the new class
    const appointments = this.generateAppointmentsFromF1Class(newClass, classKey)
    console.log(`✅ Created new F1 year ${year} with ${classKey}, generated ${appointments.length} appointments`)
    return appointments
  }

  // Create missing F1 class in existing year
  private async createMissingF1Class(
    classesData: F1ClassesResponse['data'],
    year: string,
    classKey: string,
    clientId: string,
    firstF1Appointment: GeneratedAppointment
  ): Promise<GeneratedAppointment[]> {
    console.log(`Scenario 2: Creating missing F1 ${classKey} in existing year ${year}`)

    const dayOfWeek = getDay(this.parseAppointmentDate(firstF1Appointment.appointmentDate))

    // Create the missing F1 class
    const newClass = this.createSingleF1Class(classKey, year, dayOfWeek, firstF1Appointment)
    console.log("🆕 CREATED MISSING F1 CLASS:", JSON.stringify(newClass, null, 2))

    // Add client to the new class
    newClass.clients.push(clientId)
    console.log("👤 AFTER ADDING CLIENT TO MISSING F1 CLASS:", JSON.stringify(newClass, null, 2))

    // Add the new class to existing year structure
    classesData.classes[year][classKey as keyof typeof classesData.classes[typeof year]] = newClass

    console.log("📡 UPDATED F1 CLASSES OBJECT FOR API:", JSON.stringify({ classes: classesData.classes }, null, 2))

    // Update via API
    await this.updateF1ClassesAPI(classesData.midwifeId, classesData.classes)

    // Generate appointments from the new class
    const appointments = this.generateAppointmentsFromF1Class(newClass, classKey)
    console.log(`✅ Created missing F1 ${classKey} in year ${year}, generated ${appointments.length} appointments`)
    return appointments
  }

  // Create a single F1 class
  private createSingleF1Class(classKey: string, year: string, dayOfWeek: number, template: GeneratedAppointment): F1Class {
    // Map class key to months (same as E1)
    const classToMonths = {
      "class1": { start: 1, end: 2 },   // Jan-Feb
      "class2": { start: 3, end: 4 },   // Mar-Apr  
      "class3": { start: 5, end: 6 },   // May-Jun
      "class4": { start: 7, end: 8 },   // Jul-Aug
      "class5": { start: 9, end: 10 },  // Sep-Oct
      "class6": { start: 11, end: 12 }  // Nov-Dec
    }

    const months = classToMonths[classKey as keyof typeof classToMonths]
    if (!months) {
      throw new Error(`Invalid F1 class key: ${classKey}`)
    }

    // Find first occurrence of target day in the start month
    const monthStart = new Date(parseInt(year), months.start - 1, 1)
    let firstOccurrence = monthStart

    while (getDay(firstOccurrence) !== dayOfWeek) {
      firstOccurrence = addDays(firstOccurrence, 1)
    }

    console.log(`Creating F1 ${classKey} for months ${months.start}-${months.end}, startDate: ${format(firstOccurrence, 'dd/MM/yyyy')}`)

    return {
      id: this.generateUniqueId(),
      startDate: format(firstOccurrence, 'dd/MM/yyyy'),
      startTime: template.startTime,
      endTime: template.endTime,
      duration: 75, // F1-specific duration
      clients: []
    }
  }

  // Unified API update method for F1
  private async updateF1ClassesAPI(midwifeId: string, classesObject: F1ClassesResponse['data']['classes']): Promise<void> {
    try {
      console.log("🔄 CALLING updateF1Classes API")
      console.log("Midwife ID:", midwifeId)
      console.log("F1 Classes Object:", classesObject)
      console.log("F1 Classes Object:", classesObject)
      console.log("F1 Classes Object:", classesObject)
      console.log("F1 Classes Object:", classesObject)

      const response = await updateF1Classs(midwifeId, { classes: classesObject })
      console.log("✅ F1 API UPDATE SUCCESS:", response.data)
    } catch (error) {
      console.error('❌ F1 API UPDATE ERROR:', error)
      throw error
    }
  }

  // Generate 8 F1 appointments from a class WITH classId and classNo
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private generateAppointmentsFromF1Class(classData: F1Class, classKey: string): GeneratedAppointment[] {
    const appointments: GeneratedAppointment[] = []
    const startDate = this.parseAppointmentDate(classData.startDate)

    // F1: 8 sessions (not 6 like E1)
    for (let session = 0; session < 8; session++) {
      const sessionDate = addDays(startDate, session * 7) // Weekly sessions   
      const classNo = `${classData.id}-${session + 1}`
      const exception = classData.exceptional?.find(ex => ex.classNo === classNo)
      console.log("this is the exception::", exception)
      console.log("this is the exception::", exception)

      const canclException = classData.cancelExceptional?.find(ex => ex === classNo)

      console.log("this is the canclException)::", canclException)
      console.log("this is the canclException)::", canclException)
      if (canclException) {
        appointments.push({
          appointmentId: this.generateUniqueId(),
          appointmentDate: format(sessionDate, 'dd/MM/yyyy'),
          startTime: classData.startTime,
          endTime: classData.endTime,
          duration: classData.duration,
          status: "cancelled",
          classId: classData.id,
          classNo: classNo
        })
      } else if (exception) {
        appointments.push({
          appointmentId: this.generateUniqueId(),
          appointmentDate: exception.startDate,  // From exception
          startTime: exception.startTime,         // From exception
          endTime: exception.endTime,             // From exception
          duration: exception.duration,           // From exception
          status: "pending",
          classId: classData.id,
          classNo: classNo
        })
      } else {
        appointments.push({
          appointmentId: this.generateUniqueId(),
          appointmentDate: format(sessionDate, 'dd/MM/yyyy'),
          startTime: classData.startTime,
          endTime: classData.endTime,
          duration: 75, // F1-specific duration
          status: "pending",
          classId: classData.id,     // Add class database ID
          classNo: `${classData.id}-${session + 1}`           // Add session number (1-8)
        })
      }


    }

    return appointments
  }
  // if we dont want that we dont have to booked the f1 appointment on those days that are in the german holiday

  // private generateAppointmentsFromF1Class(classData: F1Class, classKey: string): GeneratedAppointment[] {
  //   const appointments: GeneratedAppointment[] = []
  //   const startDate = this.parseAppointmentDate(classData.startDate)
  //   const targetWeekday = getDay(startDate) // Get day of week (0=Sunday, 1=Monday, etc.)

  //   console.log(`F1 Class will maintain ${format(startDate, 'EEEE')} pattern (weekday ${targetWeekday})`)

  //   // Generate 8 sessions, maintaining same weekday pattern
  //   for (let session = 0; session < 8; session++) {
  //     let sessionDate = addDays(startDate, session * 7) // Start with weekly pattern
  //     let searchAttempts = 0
  //     const maxSearchWeeks = 8 // Search up to 8 weeks ahead

  //     // If the calculated date is a holiday, find next occurrence of same weekday
  //     while (!this.isValidSchedulingDate(sessionDate, true) && searchAttempts < maxSearchWeeks) {
  //       console.log(`❌ F1 Session ${session + 1} skipped ${format(sessionDate, 'dd/MM/yyyy')} (${format(sessionDate, 'EEEE')} - holiday/weekend)`)
  //       sessionDate = addDays(sessionDate, 7) // Move to next week (same weekday)
  //       searchAttempts++
  //     }

  //     if (searchAttempts >= maxSearchWeeks) {
  //       console.log(`❌ Could not find valid ${format(startDate, 'EEEE')} for F1 Session ${session + 1} within ${maxSearchWeeks} weeks`)
  //       continue // Skip this session
  //     }

  //     const statusText = searchAttempts === 0 ? 'original date' : `moved ${searchAttempts} weeks ahead due to holidays`
  //     console.log(`✅ F1 Session ${session + 1} scheduled on ${format(sessionDate, 'dd/MM/yyyy')} (${format(sessionDate, 'EEEE')} - ${statusText})`)

  //     appointments.push({
  //       appointmentId: this.generateUniqueId(),
  //       appointmentDate: format(sessionDate, 'dd/MM/yyyy'),
  //       startTime: classData.startTime,
  //       endTime: classData.endTime,
  //       duration: 75, // F1-specific duration
  //       status: "pending",
  //       classId: classData.id,     // Add class database ID
  //       classNo: `${classData.id}-${session + 1}`     // Add session number (1-8)
  //     })
  //   }

  //   console.log(`F1 Class generated ${appointments.length}/8 sessions maintaining ${format(startDate, 'EEEE')} pattern`)
  //   return appointments
  // }

  // Update F1 class with client
  private async updateF1ClassWithClient(
    classesData: F1ClassesResponse['data'],
    year: string,
    classKey: string,
    clientId: string
  ): Promise<void> {
    try {
      console.log(`Scenario 3: Adding client to existing F1 ${classKey} in year ${year}`)
      console.log("🔍 BEFORE ADDING CLIENT:", JSON.stringify(classesData.classes[year][classKey as keyof typeof classesData.classes[typeof year]], null, 2))

      // Modify existing classes object - add client to specific class
      const targetClass = classesData.classes[year][classKey as keyof typeof classesData.classes[typeof year]]
      if (targetClass && !targetClass.clients.includes(clientId)) {
        targetClass.clients.push(clientId)
        console.log("👤 AFTER ADDING CLIENT:", JSON.stringify(targetClass, null, 2))
      }

      // Update via unified API method
      await this.updateF1ClassesAPI(classesData.midwifeId, classesData.classes)
    } catch (error) {
      console.error('Error updating F1 class:', error)
      throw error
    }
  }

  // Check if there's a valid gap between appointments - SAME as SimulationEngine  
  private hasValidGap(
    existingAppointments: { D1?: GeneratedAppointment[], D2?: GeneratedAppointment[] },
    date: Date,
    serviceCodes: string[],
    minGapDays: number
  ): boolean {
    const allAppointments = [
      ...(existingAppointments.D1 || []),
      ...(existingAppointments.D2 || [])
    ]

    // Filter appointments by service codes and find the most recent
    const relevantAppointments = allAppointments.filter(apt =>
      serviceCodes.some(code =>
        apt.appointmentId.includes(code) || this.getServiceCodeFromAppointment(apt) === code
      )
    )

    if (relevantAppointments.length === 0) return true

    const lastAppointment = relevantAppointments
      .sort((a, b) => this.parseAppointmentDate(b.appointmentDate).getTime() - this.parseAppointmentDate(a.appointmentDate).getTime())[0]

    const daysDiff = differenceInDays(date, this.parseAppointmentDate(lastAppointment.appointmentDate))
    return daysDiff >= minGapDays
  }

  // Helper to determine service code from appointment - SAME as SimulationEngine
  private getServiceCodeFromAppointment(appointment: GeneratedAppointment): string {
    if (appointment.duration === 60 && appointment.appointmentId.includes("C1")) return "C1"
    if (appointment.duration === 25 && appointment.appointmentId.includes("C2")) return "C2"
    if (appointment.duration === 60 && appointment.appointmentId.includes("D1")) return "D1"
    if (appointment.duration === 25 && appointment.appointmentId.includes("D2")) return "D2"
    if (appointment.duration === 75) return "F1"
    return "UNKNOWN"
  }

  // Check if date is valid for scheduling - SAME as SimulationEngine
  private isValidSchedulingDate(date: Date, weekdaysOnly: boolean = false, serviceCode?: string): boolean {
    const isWeekendDay = isWeekend(date)
    const isHoliday = isGermanHoliday(date)

    // Special case: C1 and C2 are critical services available 24/7
    if (serviceCode === 'C1' || serviceCode === 'C2') {
      return true  // C1/C2 allowed on ANY day
    }

    // For all other services: normal rules
    if (weekdaysOnly) {
      return !isWeekendDay && !isHoliday
    }

    return !isHoliday
  }

  // Find available slot for a specific date and service - SAME as SimulationEngine
  private findAvailableSlot(date: Date, serviceCode: string): TimeSlot | null {
    const dayName = format(date, "EEEE")
    const daySlots = this.timetable[dayName]?.slots[serviceCode]

    if (!daySlots || daySlots.length === 0) {
      return null
    }

    // For course appointments (F1), check if slot is available for shared use
    if (serviceCode === "F1") {
      for (const slot of daySlots) {
        if (this.isSlotAvailable(date, slot, serviceCode)) {
          return slot
        }
      }
      return null
    }

    // For individual appointments (C1, C2, D1, D2), find first available slot
    for (const slot of daySlots) {
      if (this.isSlotAvailable(date, slot, serviceCode)) {
        return slot
      }
    }

    return null
  }

  // Check if a specific slot is available - Only checks TIME SLOT conflicts
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private isSlotAvailable(date: Date, slot: TimeSlot, serviceCode: string): boolean {
    const monthYear = format(date, 'M/yyyy') // e.g., "9/2024"
    const dateString = format(date, 'dd/MM/yyyy') // e.g., "28/09/2024"

    // If this month/year doesn't exist in existing bookings, slot is free
    if (!this.existingBookings[monthYear]) {
      return true
    }

    const monthBookings = this.existingBookings[monthYear]

    // Check for TIME SLOT conflicts across ALL service types (unified API benefit)
    const allServiceCodes = ['B1', 'B2', 'E1', 'C1', 'C2', 'D1', 'D2', 'F1']

    for (const checkServiceCode of allServiceCodes) {
      const serviceBookings = monthBookings[checkServiceCode as keyof typeof monthBookings]

      if (serviceBookings && serviceBookings.length > 0) {
        const hasConflict = serviceBookings.some(booking => {
          if (booking.appointmentDate !== dateString) return false

          // Check for time overlap (ONLY time conflicts matter, multiple services per day allowed)
          return this.timeSlotsOverlap(
            { startTime: slot.startTime, endTime: slot.endTime },
            { startTime: booking.startTime, endTime: booking.endTime }
          )
        })

        if (hasConflict) {
          console.log(`Time slot conflict with existing ${checkServiceCode} appointment on ${dateString}`)
          return false
        }
      }
    }

    return true
  }

  // Check if two time slots overlap
  private timeSlotsOverlap(slot1: { startTime: string, endTime: string }, slot2: { startTime: string, endTime: string }): boolean {
    const start1 = this.timeToMinutes(slot1.startTime)
    const end1 = this.timeToMinutes(slot1.endTime)
    const start2 = this.timeToMinutes(slot2.startTime)
    const end2 = this.timeToMinutes(slot2.endTime)

    return start1 < end2 && start2 < end1
  }

  // Convert time string to minutes for comparison
  private timeToMinutes(timeString: string): number {
    const [hours, minutes] = timeString.split(':').map(Number)
    return hours * 60 + minutes
  }

  // Create a new appointment object - EXACT SimulationEngine durations
  private createAppointment(serviceCode: string, date: Date, slot: TimeSlot): GeneratedAppointment {
    const durations: Record<string, number> = {
      C1: 60,  // SimulationEngine: 60
      C2: 25,  // SimulationEngine: 25
      D1: 60,  // SimulationEngine: 60  
      D2: 25,  // SimulationEngine: 25
      F1: 75   // SimulationEngine: 75
    }

    return {
      appointmentId: this.generateUniqueId(),
      appointmentDate: format(date, 'dd/MM/yyyy'),
      startTime: slot.startTime,
      endTime: slot.endTime,
      duration: durations[serviceCode] || 60,
      status: "pending"
    }
  }

  // Create F1-specific appointment with correct duration
  private createF1Appointment(serviceCode: string, date: Date, slot: TimeSlot): GeneratedAppointment {
    return {
      appointmentId: this.generateUniqueId(),
      appointmentDate: format(date, 'dd/MM/yyyy'),
      startTime: slot.startTime,
      endTime: slot.endTime,
      duration: 75, // F1 duration from SimulationEngine
      status: "pending"
    }
  }

  // Generate unique 24-character ObjectId compatible ID
  private generateUniqueId(): string {
    return crypto.randomBytes(12).toString('hex')
  }

  // Parse DD/MM/YYYY date string to Date object
  private parseAppointmentDate(dateString: string): Date {
    const [day, month, year] = dateString.split('/').map(Number)
    return new Date(year, month - 1, day)
  }
}