import { format, addDays, endOfMonth, eachDayOfInterval, isWeekend, differenceInDays, getDay } from "date-fns"
import { isGermanHoliday } from "./german-holidays"
import { GetE1ClasssesApi } from "@/endpoints/getEndpoints"
import { updateE1Classs } from "@/endpoints/putEndpoints"
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

interface E1Class {
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
  }>,
  cancelExceptional?: string[]
}

interface E1ClassesResponse {
  success: boolean
  message: string
  data: {
    _id: string
    midwifeId: string
    classes: {
      [year: string]: {
        class1?: E1Class
        class2?: E1Class
        class3?: E1Class
        class4?: E1Class
        class5?: E1Class
        class6?: E1Class
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
  classId?: string  // NEW: Database ID of the class (for E1 only)
  classNo?: string  // NEW: Class number 1-6 (for E1 only)
}

interface PreBirthAppointments {
  B1: GeneratedAppointment[]
  B2: GeneratedAppointment[]
  E1: GeneratedAppointment[]
}

export class PreBirthBookingEngine {
  private timetable: Timetable
  private enabledServices: string[]
  private existingBookings: ExistingBookingsResponse['data'] = {}

  constructor(timetable: Timetable, enabledServices: string[]) {
    this.timetable = timetable
    this.enabledServices = enabledServices
    console.log("PreBirthBookingEngine initialized with services:", enabledServices)
  }

  // Main method to generate pre-birth appointments
  public async generatePreBirthAppointments({
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
  }): Promise<PreBirthAppointments> {

    this.timetable = timetable
    this.enabledServices = enabledServices

    console.log(`\n=== Scheduling pre-birth appointments for ET: ${format(clientET, "yyyy-MM-dd")} ===`)
    // Step 1: Fetch existing bookings from unified API
    await this.fetchExistingBookings(apiUrl, midwifeId, clientET)

    // Step 2: Generate appointments
    const appointments: PreBirthAppointments = {
      B1: [],
      B2: [],
      E1: []
    }

    // Step 3: Schedule B1/B2 pregnancy care (6 months before ET)
    if (enabledServices.includes("B1") || enabledServices.includes("B2")) {
      const pregnancyAppointments = this.schedulePregnancyCare(clientET)
      appointments.B1 = pregnancyAppointments.B1
      appointments.B2 = pregnancyAppointments.B2
    }

    // Step 4: Schedule E1 birth training with class management
    if (enabledServices.includes("E1")) {
      appointments.E1 = await this.scheduleBirthTrainingWithClasses(clientET, clientId, midwifeId)
    }

    console.log("Final pre-birth appointments generated:")
    console.log(`B1: ${appointments.B1.length}/3, B2: ${appointments.B2.length}/3, E1: ${appointments.E1.length}/6`)

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

  // Schedule B1/B2 pregnancy care appointments (unchanged)
  private schedulePregnancyCare(clientET: Date): { B1: GeneratedAppointment[], B2: GeneratedAppointment[] } {
    console.log(`\n--- Scheduling pregnancy care (B1/B2) ---`)

    const appointments = { B1: [] as GeneratedAppointment[], B2: [] as GeneratedAppointment[] }

    const startDate = addDays(clientET, -180)
    const endDate = addDays(clientET, -30)

    console.log(`B1/B2 scheduling window: ${format(startDate, 'yyyy-MM-dd')} to ${format(endDate, 'yyyy-MM-dd')}`)

    const months: Date[] = []
    let currentMonth = new Date(startDate.getFullYear(), startDate.getMonth(), 1)

    for (let i = 0; i < 6; i++) {
      months.push(new Date(currentMonth))
      currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    }

    let b1Count = 0
    let b2Count = 0
    let shouldBeB1 = true

    months.forEach((monthStart, monthIndex) => {
      if (b1Count >= 3 && b2Count >= 3) return

      const monthEnd = endOfMonth(monthStart)
      const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })
        .filter((day) => day >= startDate && day <= endDate)
        .filter((day) => this.isValidSchedulingDate(day, true))

      let serviceCode: string
      if (b1Count < 3 && b2Count < 3) {
        serviceCode = shouldBeB1 ? "B1" : "B2"
      } else if (b1Count < 3) {
        serviceCode = "B1"
      } else if (b2Count < 3) {
        serviceCode = "B2"
      } else {
        return
      }

      if (this.enabledServices.includes(serviceCode)) {
        let scheduled = false

        for (const day of monthDays) {
          if (this.isServiceAlreadyBookedOnDay(day, serviceCode, appointments)) {
            continue
          }

          if (this.hasValidGap(appointments, day, ["B1", "B2"], 14)) {
            const slot = this.findAvailableSlot(day, serviceCode)
            if (slot) {
              const appointment = this.createAppointment(serviceCode, day, slot)

              if (serviceCode === "B1") {
                appointments.B1.push(appointment)
                b1Count++
              } else {
                appointments.B2.push(appointment)
                b2Count++
              }

              console.log(`✅ Scheduled ${serviceCode} on ${format(day, 'yyyy-MM-dd')} (month ${monthIndex + 1})`)
              scheduled = true
              break
            }
          }
        }

        if (!scheduled) {
          console.log(`❌ Could not schedule ${serviceCode} in month ${monthIndex + 1}`)
        }
      }

      shouldBeB1 = !shouldBeB1
    })

    // Second pass logic (unchanged)
    if (b1Count < 3 || b2Count < 3) {
      const allDays = eachDayOfInterval({ start: startDate, end: endDate })
        .filter((day) => this.isValidSchedulingDate(day, true))

      for (const day of allDays) {
        if (b1Count >= 3 && b2Count >= 3) break

        if (b1Count < 3 && this.enabledServices.includes("B1")) {
          if (this.hasValidGap(appointments, day, ["B1", "B2"], 14) && !this.isServiceAlreadyBookedOnDay(day, "B1", appointments)) {
            const slot = this.findAvailableSlot(day, "B1")
            if (slot) {
              const appointment = this.createAppointment("B1", day, slot)
              appointments.B1.push(appointment)
              b1Count++
              console.log(`✅ [Second pass] Scheduled B1 on ${format(day, 'yyyy-MM-dd')}`)
              continue
            }
          }
        }

        if (b2Count < 3 && this.enabledServices.includes("B2")) {
          if (this.hasValidGap(appointments, day, ["B1", "B2"], 14) && !this.isServiceAlreadyBookedOnDay(day, "B2", appointments)) {
            const slot = this.findAvailableSlot(day, "B2")
            if (slot) {
              const appointment = this.createAppointment("B2", day, slot)
              appointments.B2.push(appointment)
              b2Count++
              console.log(`✅ [Second pass] Scheduled B2 on ${format(day, 'yyyy-MM-dd')}`)
            }
          }
        }
      }
    }

    console.log(`Pregnancy care complete: B1=${b1Count}/3, B2=${b2Count}/3`)
    return appointments
  }

  // NEW: Schedule E1 with class management system
  private async scheduleBirthTrainingWithClasses(clientET: Date, clientId: string, midwifeId: string): Promise<GeneratedAppointment[]> {
    console.log("\n--- Scheduling birth training (E1) with class management ---")

    // Step 1: Generate first E1 appointment using simulation rules
    const firstE1Appointment = this.generateFirstE1Appointment(clientET)
    if (!firstE1Appointment) {
      console.log("❌ Could not generate first E1 appointment")
      return []
    }

    const firstDate = this.parseAppointmentDate(firstE1Appointment.appointmentDate)
    const year = firstDate.getFullYear().toString()
    const month = firstDate.getMonth() + 1 // 1-12

    console.log(`First E1 appointment: ${firstE1Appointment.appointmentDate}, Year: ${year}, Month: ${month}`)

    // Step 2: Get month-to-class mapping
    const classKey = this.getClassFromMonth(month)
    console.log(`Month ${month} maps to ${classKey}`)

    // Step 3: Fetch existing E1 classes
    const classesData = await this.fetchE1Classes(midwifeId)
    console.log("🔍 Classes data received:", classesData)
    if (classesData) {
      console.log("🗓️ Available years:", Object.keys(classesData.classes))
      if (classesData.classes[year]) {
        console.log(`📅 Classes in year ${year}:`, Object.keys(classesData.classes[year]))
      }
    }
    // Step 4: Check if year exists in classes
    if (classesData && classesData.classes[year]) {
      // Year exists - use existing classes
      return await this.handleExistingYear(classesData, year, classKey, clientId, firstE1Appointment)
    } else {
      // Year doesn't exist - create new year structure
      return await this.handleNewYear(classesData, year, clientId, midwifeId, firstE1Appointment)
    }
  }

  // Generate first E1 appointment using original simulation rules
  private generateFirstE1Appointment(clientET: Date): GeneratedAppointment | null {
    const daysWithE1 = Object.keys(this.timetable).filter(
      (day) => this.timetable[day]?.slots?.E1 && this.timetable[day].slots.E1.length > 0,
    )

    if (daysWithE1.length === 0) {
      return null
    }

    const courseStartDate = addDays(clientET, -70) // ET - 10 weeks
    let currentDate = courseStartDate

    // Find first valid date with E1 slots
    for (let attempts = 0; attempts < 50; attempts++) {
      if (currentDate >= clientET) break

      const dayName = format(currentDate, "EEEE")
      const hasE1Slots = this.timetable[dayName]?.slots?.E1 && this.timetable[dayName].slots.E1.length > 0

      if (this.isValidSchedulingDate(currentDate, true) && hasE1Slots) {
        const slot = this.findAvailableSlot(currentDate, "E1")
        if (slot) {
          return this.createAppointment("E1", currentDate, slot)
        }
      }

      currentDate = addDays(currentDate, 1)
    }

    return null
  }

  // Map month to class
  private getClassFromMonth(month: number): string {
    if (month <= 2) return "class1" // Jan-Feb
    if (month <= 4) return "class2" // Mar-Apr
    if (month <= 6) return "class3" // May-Jun
    if (month <= 8) return "class4" // Jul-Aug
    if (month <= 10) return "class5" // Sep-Oct
    return "class6" // Nov-Dec
  }

  // Fetch E1 classes from API
  private async fetchE1Classes(midwifeId: string): Promise<E1ClassesResponse['data'] | null> {
    try {
      console.log("Fetching E1 classes for midwife:", midwifeId)

      // Use your endpoint function instead of fetch
      const response = await GetE1ClasssesApi(midwifeId)

      console.log("API Response:", response.data)

      if (response.data.success) {
        console.log("E1 classes fetched successfully")
        console.log("Full E1 classes data:", JSON.stringify(response.data.data, null, 2))
        return response.data.data
      } else {
        console.log("API returned success: false")
        return null
      }
    } catch (error) {
      console.error('Error fetching E1 classes:', error)
      return null
    }
  }

  // Handle existing year scenario - now with 2 sub-scenarios
  private async handleExistingYear(
    classesData: E1ClassesResponse['data'],
    year: string,
    classKey: string,
    clientId: string,
    firstE1Appointment: GeneratedAppointment
  ): Promise<GeneratedAppointment[]> {
    console.log(`Year ${year} exists, checking ${classKey}`)
    console.log("🔍 ORIGINAL YEAR DATA:", JSON.stringify(classesData.classes[year], null, 2))

    const yearClasses = classesData.classes[year]
    const targetClass = yearClasses[classKey as keyof typeof yearClasses]
    console.log("🎯 TARGET CLASS DATA:", JSON.stringify(targetClass, null, 2))

    if (targetClass) {
      // Scenario 3: Year exists, class exists
      console.log(`👥 Current clients in ${classKey}: ${targetClass.clients.length}/10`)

      if (targetClass.clients.length < 10) {
        console.log("✅ Class has space, proceeding with booking")

        const appointments = this.generateAppointmentsFromClass(targetClass, classKey)
        await this.updateE1ClassWithClient(classesData, year, classKey, clientId)

        console.log(`✅ Added client to existing ${classKey}, generating ${appointments.length} appointments`)
        return appointments
      } else {
        console.log(`❌ ${classKey} is full (${targetClass.clients.length}/10 clients)`)
        return []
      }
    } else {
      // Scenario 2: Year exists, but target class doesn't exist
      console.log(`📝 Creating missing ${classKey} in existing year ${year}`)
      return await this.createMissingClass(classesData, year, classKey, clientId, firstE1Appointment)
    }
  }

  // Handle new year scenario - Scenario 1: Create year and single class
  private async handleNewYear(
    classesData: E1ClassesResponse['data'] | null,
    year: string,
    clientId: string,
    midwifeId: string,
    firstE1Appointment: GeneratedAppointment
  ): Promise<GeneratedAppointment[]> {
    console.log(`Scenario 1: Creating new year ${year} structure`)

    const firstDate = this.parseAppointmentDate(firstE1Appointment.appointmentDate)
    const month = firstDate.getMonth() + 1
    const classKey = this.getClassFromMonth(month)
    const dayOfWeek = getDay(firstDate)

    // Create only the required class, not all 6 classes
    const newClass = this.createSingleClass(classKey, year, dayOfWeek, firstE1Appointment)
    console.log("🆕 CREATED SINGLE CLASS:", JSON.stringify(newClass, null, 2))

    // Add client to the new class
    newClass.clients.push(clientId)
    console.log("👤 AFTER ADDING CLIENT TO NEW CLASS:", JSON.stringify(newClass, null, 2))

    // Prepare complete classes object for API
    const existingClasses = classesData ? classesData.classes : {}
    if (!existingClasses[year]) {
      existingClasses[year] = {}
    }
    existingClasses[year][classKey as keyof typeof existingClasses[typeof year]] = newClass

    console.log("📡 COMPLETE CLASSES OBJECT FOR API:", JSON.stringify({ classes: existingClasses }, null, 2))

    // Update via API
    await this.updateE1ClassesAPI(midwifeId, existingClasses)

    // Generate appointments from the new class
    const appointments = this.generateAppointmentsFromClass(newClass, classKey)
    console.log(`✅ Created new year ${year} with ${classKey}, generated ${appointments.length} appointments`)
    return appointments
  }

  // NEW: Create missing class in existing year - Scenario 2
  private async createMissingClass(
    classesData: E1ClassesResponse['data'],
    year: string,
    classKey: string,
    clientId: string,
    firstE1Appointment: GeneratedAppointment
  ): Promise<GeneratedAppointment[]> {
    console.log(`Scenario 2: Creating missing ${classKey} in existing year ${year}`)

    const dayOfWeek = getDay(this.parseAppointmentDate(firstE1Appointment.appointmentDate))

    // Create the missing class
    const newClass = this.createSingleClass(classKey, year, dayOfWeek, firstE1Appointment)
    console.log("🆕 CREATED MISSING CLASS:", JSON.stringify(newClass, null, 2))

    // Add client to the new class
    newClass.clients.push(clientId)
    console.log("👤 AFTER ADDING CLIENT TO MISSING CLASS:", JSON.stringify(newClass, null, 2))

    // Add the new class to existing year structure
    classesData.classes[year][classKey as keyof typeof classesData.classes[typeof year]] = newClass

    console.log("📡 UPDATED CLASSES OBJECT FOR API:", JSON.stringify({ classes: classesData.classes }, null, 2))

    // Update via API
    await this.updateE1ClassesAPI(classesData.midwifeId, classesData.classes)

    // Generate appointments from the new class
    const appointments = this.generateAppointmentsFromClass(newClass, classKey)
    console.log(`✅ Created missing ${classKey} in year ${year}, generated ${appointments.length} appointments`)
    return appointments
  }

  // NEW: Create a single class for specific class key
  private createSingleClass(classKey: string, year: string, dayOfWeek: number, template: GeneratedAppointment): E1Class {
    // Map class key to months
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
      throw new Error(`Invalid class key: ${classKey}`)
    }

    // Find first occurrence of target day in the start month
    const monthStart = new Date(parseInt(year), months.start - 1, 1)
    let firstOccurrence = monthStart

    while (getDay(firstOccurrence) !== dayOfWeek) {
      firstOccurrence = addDays(firstOccurrence, 1)
    }

    console.log(`Creating ${classKey} for months ${months.start}-${months.end}, startDate: ${format(firstOccurrence, 'dd/MM/yyyy')}`)

    return {
      id: this.generateUniqueId(),
      startDate: format(firstOccurrence, 'dd/MM/yyyy'),
      startTime: template.startTime,
      endTime: template.endTime,
      duration: template.duration,
      clients: []
    }
  }

  // NEW: Unified API update method
  private async updateE1ClassesAPI(midwifeId: string, classesObject: E1ClassesResponse['data']['classes']): Promise<void> {
    try {
      console.log("🔄 CALLING updateE1Classs API")
      console.log("Midwife ID:", midwifeId)
      console.log("Classes Object:", classesObject)
      // console.log("Classes Object:", classesObject)
      // console.log("Classes Object:", classesObject)

      const response = await updateE1Classs(midwifeId, { classes: classesObject })
      console.log("✅ API UPDATE SUCCESS:", response.data)
    } catch (error) {
      console.error('❌ API UPDATE ERROR:', error)
      throw error
    }
  }

  // Generate 6 appointments from a class WITH classId and classNo
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private generateAppointmentsFromClass(classData: E1Class, classKey: string): GeneratedAppointment[] {
    const appointments: GeneratedAppointment[] = []
    const startDate = this.parseAppointmentDate(classData.startDate)

    // Extract class number from classKey (class1 -> 1, class2 -> 2, etc.)
    // const classNo = parseInt(classKey.replace('class', ''))

    for (let session = 0; session < 6; session++) {
      const sessionDate = addDays(startDate, session * 7) // Weekly sessions
      const classNo = `${classData.id}-${session + 1}`
      const exception = classData.exceptional?.find(ex => ex.classNo === classNo)
      console.log("this is the exception::", exception)
      const cancelException = classData.cancelExceptional?.find(ex => ex === classNo)

      console.log("this is the cancelException::", cancelException)
      console.log("this is the cancelException::", cancelException)
      // console.log("this is the exception::", exception)
      // console.log("this is the exception::", exception)
      // console.log("this is the exception::", exception)  
      if (cancelException) {
        appointments.push({
          appointmentId: this.generateUniqueId(),
          appointmentDate: format(sessionDate, 'dd/MM/yyyy'),
          startTime: classData.startTime,
          endTime: classData.endTime,
          duration: classData.duration,
          status: "cancelled",
          classId: classData.id,     // NEW: Add class database ID
          classNo: `${classData.id}-${session + 1}`           // NEW: Add class number (1-6)
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
          duration: classData.duration,
          status: "pending",
          classId: classData.id,     // NEW: Add class database ID
          classNo: `${classData.id}-${session + 1}`           // NEW: Add class number (1-6)
        })
      }



    }

    return appointments
  }

  // Updated: Use unified API method for existing year updates
  private async updateE1ClassWithClient(
    classesData: E1ClassesResponse['data'],
    year: string,
    classKey: string,
    clientId: string
  ): Promise<void> {
    try {
      console.log(`Scenario 3: Adding client to existing ${classKey} in year ${year}`)
      console.log("🔍 BEFORE ADDING CLIENT:", JSON.stringify(classesData.classes[year][classKey as keyof typeof classesData.classes[typeof year]], null, 2))

      // Modify existing classes object - add client to specific class
      const targetClass = classesData.classes[year][classKey as keyof typeof classesData.classes[typeof year]]
      if (targetClass && !targetClass.clients.includes(clientId)) {
        targetClass.clients.push(clientId)
        console.log("👤 AFTER ADDING CLIENT:", JSON.stringify(targetClass, null, 2))
      }

      // Update via unified API method
      await this.updateE1ClassesAPI(classesData.midwifeId, classesData.classes)
    } catch (error) {
      console.error('Error updating E1 class:', error)
      throw error
    }
  }

  // Existing helper methods (unchanged)
  private hasValidGap(
    existingAppointments: { B1: GeneratedAppointment[], B2: GeneratedAppointment[] },
    date: Date,
    serviceCodes: string[],
    minGapDays: number
  ): boolean {
    const allAppointments = [...existingAppointments.B1, ...existingAppointments.B2]

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

  private getServiceCodeFromAppointment(appointment: GeneratedAppointment): string {
    if (appointment.duration === 60) return "B1"
    if (appointment.duration === 50) return "B2"
    if (appointment.duration === 140) return "E1"
    return "UNKNOWN"
  }

  private isServiceAlreadyBookedOnDay(
    date: Date,
    serviceCode: string,
    currentAppointments: { B1: GeneratedAppointment[], B2: GeneratedAppointment[] }
  ): boolean {
    const targetDateString = format(date, "dd/MM/yyyy")

    const serviceAppointments = currentAppointments[serviceCode as keyof typeof currentAppointments] || []
    const newlyScheduled = serviceAppointments.some(apt => apt.appointmentDate === targetDateString)

    if (newlyScheduled) {
      return true
    }

    const monthYear = format(date, 'M/yyyy')

    if (this.existingBookings[monthYear]) {
      const existingServiceBookings = this.existingBookings[monthYear][serviceCode as keyof typeof this.existingBookings[typeof monthYear]]

      if (existingServiceBookings && existingServiceBookings.length > 0) {
        const apiConflict = existingServiceBookings.some(booking => booking.appointmentDate === targetDateString)
        if (apiConflict) {
          return true
        }
      }
    }

    return false
  }

  private isValidSchedulingDate(date: Date, weekdaysOnly: boolean = false, serviceCode?: string): boolean {
    const isWeekendDay = isWeekend(date)
    const isHoliday = isGermanHoliday(date)

    if (serviceCode === 'C1' || serviceCode === 'C2') {
      return true
    }

    if (weekdaysOnly) {
      return !isWeekendDay && !isHoliday
    }

    return !isHoliday
  }

  private findAvailableSlot(date: Date, serviceCode: string): TimeSlot | null {
    const dayName = format(date, "EEEE")
    const daySlots = this.timetable[dayName]?.slots[serviceCode]

    if (!daySlots || daySlots.length === 0) {
      return null
    }

    for (const slot of daySlots) {
      if (this.isSlotAvailable(date, slot, serviceCode)) {
        return slot
      }
    }

    return null
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private isSlotAvailable(date: Date, slot: TimeSlot, serviceCode: string): boolean {
    const monthYear = format(date, 'M/yyyy')
    const dateString = format(date, 'dd/MM/yyyy')

    if (!this.existingBookings[monthYear]) {
      return true
    }

    const monthBookings = this.existingBookings[monthYear]
    const allServiceCodes = ['B1', 'B2', 'E1', 'C1', 'C2', 'D1', 'D2', 'F1']

    for (const checkServiceCode of allServiceCodes) {
      const serviceBookings = monthBookings[checkServiceCode as keyof typeof monthBookings]

      if (serviceBookings && serviceBookings.length > 0) {
        const hasConflict = serviceBookings.some(booking => {
          if (booking.appointmentDate !== dateString) return false

          return this.timeSlotsOverlap(
            { startTime: slot.startTime, endTime: slot.endTime },
            { startTime: booking.startTime, endTime: booking.endTime }
          )
        })

        if (hasConflict) {
          return false
        }
      }
    }

    return true
  }

  private timeSlotsOverlap(slot1: { startTime: string, endTime: string }, slot2: { startTime: string, endTime: string }): boolean {
    const start1 = this.timeToMinutes(slot1.startTime)
    const end1 = this.timeToMinutes(slot1.endTime)
    const start2 = this.timeToMinutes(slot2.startTime)
    const end2 = this.timeToMinutes(slot2.endTime)

    return start1 < end2 && start2 < end1
  }

  private timeToMinutes(timeString: string): number {
    const [hours, minutes] = timeString.split(':').map(Number)
    return hours * 60 + minutes
  }

  private createAppointment(serviceCode: string, date: Date, slot: TimeSlot): GeneratedAppointment {
    const durations: Record<string, number> = {
      B1: 60,
      B2: 50,
      E1: 140
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

  private generateUniqueId(): string {
    return crypto.randomBytes(12).toString('hex')
  }

  private parseAppointmentDate(dateString: string): Date {
    const [day, month, year] = dateString.split('/').map(Number)
    return new Date(year, month - 1, day)
  }
}