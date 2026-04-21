import { format, addDays, isWeekend, differenceInDays, endOfMonth, eachDayOfInterval } from "date-fns"
import { isGermanHoliday } from "./german-holidays"
import { SERVICE_COLORS } from "@/config/constants"
import type { SimulationAppointment, CustomerSimulationData } from "@/types/simulations"

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

interface CustomerInput {
  id: string
  name: string
  et: Date
  contractDate: Date
  birthNotificationDate?: Date
}

interface CourseSession {
  courseId: string
  serviceCode: string
  date: string
  startTime: string
  endTime: string
  participants: string[]
  maxParticipants: number
}

export class SimulationEngine {
  private timetable: Timetable
  private intensity: number
  private enabledServices: string[]
  private appointments: SimulationAppointment[] = []
  private customers: CustomerSimulationData[] = []
  private courseSessions: CourseSession[] = []

  constructor(timetable: Timetable, intensity: number, enabledServices: string[]) {
    this.timetable = timetable
    this.intensity = intensity
    this.enabledServices = enabledServices
    console.log("SimulationEngine initialized with services:", enabledServices)
  }

  public generateSimulation(customers: CustomerInput[]): {
    appointments: SimulationAppointment[]
    customers: CustomerSimulationData[]
  } {
    this.appointments = []
    this.customers = []
    this.courseSessions = []

    // Initialize customer data
    customers.forEach((customer) => {
      this.customers.push({
        customerId: customer.id,
        customerName: customer.name,
        et: customer.et,
        contractDate: customer.contractDate,
        birthNotificationDate: customer.birthNotificationDate,
        appointments: [],
        quotas: {
          pregnancyB1: 0,
          pregnancyB2: 0,
          earlyC1: 0,
          earlyC2: 0,
          lateD1: 0,
          lateD2: 0,
          birthPrepSessions: 0,
          ruckbildungSessions: 0,
        },
      })
    })

    // Sort customers by ET date for "first come, first serve" processing
    this.customers.sort((a, b) => a.et.getTime() - b.et.getTime())

    // Process each customer individually for individual appointments
    this.customers.forEach((customer) => {
      this.scheduleIndividualAppointments(customer)
    })

    // Process course appointments (E1, F1) as shared sessions
    this.scheduleCourseAppointments()

    console.log("Final appointments generated:", this.appointments.length)
    console.log(
      "Appointments by type:",
      this.appointments.reduce(
        (acc, apt) => {
          acc[apt.appointmentCode] = (acc[apt.appointmentCode] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      ),
    )

    return {
      appointments: this.appointments,
      customers: this.customers,
    }
  }   
  private isServiceAlreadyBookedOnDay(date: Date, serviceCode: string): boolean {
  const dateString = format(date, "yyyy-MM-dd")
  
  return this.appointments.some(
    (apt) => apt.date === dateString && apt.appointmentCode === serviceCode
  )
}

  private scheduleIndividualAppointments(customer: CustomerSimulationData) {
    console.log(
      `\n=== Scheduling individual appointments for ${customer.customerName}, ET: ${format(customer.et, "yyyy-MM-dd")} ===`,
    )

    // 1. Schedule C1/C2 (Early Care) - 10 consecutive days starting on ET
    this.scheduleEarlyCare(customer)

    // 2. Schedule B1/B2 (Pregnancy Care) - 6 months before ET (3 each, alternating)
    this.schedulePregnancyCare(customer)

    // 3. Schedule D1/D2 (Late Care) - 2 per week before ET+50, then 1 per week after
    this.scheduleLateCare(customer)

    console.log(`Individual appointments scheduled for ${customer.customerName}:`, customer.appointments.length)
  }

  private scheduleCourseAppointments() {
    console.log("\n=== Scheduling course appointments (E1, F1) ===")

    // Schedule E1 (Birth Training) for all eligible customers
    this.scheduleSharedBirthTraining()

    // Schedule F1 (After Birth Gym) for all eligible customers
    this.scheduleSharedAfterBirthGym()
  }

  private scheduleEarlyCare(customer: CustomerSimulationData) {
    console.log(`\n--- Scheduling early care (C1/C2) for ${customer.customerName} ---`)

    // C1/C2 - 10 consecutive days starting on ET
    for (let dayOffset = 0; dayOffset <= 9; dayOffset++) {
      const currentDay = addDays(customer.et, dayOffset)

      // Day 0 (ET): MUST start with C1
      if (dayOffset === 0) {
        if (this.enabledServices.includes("C1") && this.isValidSchedulingDate(currentDay, false, "C1")) {
          const c1Slot = this.findAvailableSlot(currentDay, "C1")
          if (c1Slot) {
            const c1Appointment = this.createAppointment(
              customer,
              "C1",
              currentDay,
              c1Slot,
              customer.quotas.earlyC1 + 1,
            )
            this.appointments.push(c1Appointment)
            customer.appointments.push(c1Appointment)
            customer.quotas.earlyC1++
            console.log(`✅ Scheduled C1 on ${format(currentDay, "yyyy-MM-dd")} for ${customer.customerName}`)
          }
        }

        // Also schedule C2 on the same day if enabled
        if (this.enabledServices.includes("C2") && this.isValidSchedulingDate(currentDay, false, "C2")) {
          const c2Slot = this.findAvailableSlot(currentDay, "C2")
          if (c2Slot) {
            const c2Appointment = this.createAppointment(
              customer,
              "C2",
              currentDay,
              c2Slot,
              customer.quotas.earlyC2 + 1,
            )
            this.appointments.push(c2Appointment)
            customer.appointments.push(c2Appointment)
            customer.quotas.earlyC2++
            console.log(`✅ Scheduled C2 on ${format(currentDay, "yyyy-MM-dd")} for ${customer.customerName}`)
          } else {
            console.log(`❌ No C2 slot available on ${format(currentDay, "yyyy-MM-dd")} for ${customer.customerName}`)
          }
        }
      } else {
        // Days 1-9: Schedule both C1 and C2 if slots available and quotas not exceeded
        if (this.enabledServices.includes("C1") && customer.quotas.earlyC1 < 10 && this.isValidSchedulingDate(currentDay, false, "C1")) {
          const c1Slot = this.findAvailableSlot(currentDay, "C1")
          if (c1Slot) {
            const c1Appointment = this.createAppointment(
              customer,
              "C1",
              currentDay,
              c1Slot,
              customer.quotas.earlyC1 + 1,
            )
            this.appointments.push(c1Appointment)
            customer.appointments.push(c1Appointment)
            customer.quotas.earlyC1++
            console.log(`✅ Scheduled C1 on ${format(currentDay, "yyyy-MM-dd")} for ${customer.customerName}`)
          } else {
            console.log(`❌ No C1 slot available on ${format(currentDay, "yyyy-MM-dd")} for ${customer.customerName}`)
          }
        }

        if (this.enabledServices.includes("C2") && customer.quotas.earlyC2 < 10 && this.isValidSchedulingDate(currentDay, false, "C2")) {
          const c2Slot = this.findAvailableSlot(currentDay, "C2")
          if (c2Slot) {
            const c2Appointment = this.createAppointment(
              customer,
              "C2",
              currentDay,
              c2Slot,
              customer.quotas.earlyC2 + 1,
            )
            this.appointments.push(c2Appointment)
            customer.appointments.push(c2Appointment)
            customer.quotas.earlyC2++
            console.log(`✅ Scheduled C2 on ${format(currentDay, "yyyy-MM-dd")} for ${customer.customerName}`)
          } else {
            console.log(`❌ No C2 slot available on ${format(currentDay, "yyyy-MM-dd")} for ${customer.customerName}`)
          }
        }
      }
    }

    console.log(
      `Early care complete for ${customer.customerName}: C1=${customer.quotas.earlyC1}, C2=${customer.quotas.earlyC2}`,
    )
  }

  private schedulePregnancyCare(customer: CustomerSimulationData) {
    console.log(`\n--- Scheduling pregnancy care (B1/B2) for ${customer.customerName} ---`)

    // B1/B2 - 3 of each type (6 total), alternating, 1 per month for 6 months
    const startDate = addDays(customer.et, -180) // ET - 6 months
    const endDate = addDays(customer.et, -30) // ET - 1 month

    const months: Date[] = []
    let currentMonth = new Date(startDate.getFullYear(), startDate.getMonth(), 1)

    // Generate 6 months
    for (let i = 0; i < 6; i++) {
      months.push(new Date(currentMonth))
      currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    }

    let b1Count = 0
    let b2Count = 0
    let shouldBeB1 = true // Start with B1, then alternate

    // First pass: Try to schedule in order with alternation
    months.forEach((monthStart, monthIndex) => {
      if (b1Count >= 3 && b2Count >= 3) return

      const monthEnd = endOfMonth(monthStart)
      const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })
        .filter((day) => day >= startDate && day <= endDate)
        .filter((day) => this.isValidSchedulingDate(day, true))

      // Determine which service to schedule this month
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

      console.log(`Month ${monthIndex + 1}: Planning to schedule ${serviceCode} (B1: ${b1Count}/3, B2: ${b2Count}/3)`)

      if (this.enabledServices.includes(serviceCode)) {
        let scheduled = false

        // Try to find available slot in this month
        for (const day of monthDays) {
          if (this.hasValidGap(customer, day, ["B1", "B2"], 14)&& !this.isServiceAlreadyBookedOnDay(day, serviceCode)) {
            const slot = this.findAvailableSlot(day, serviceCode)
            if (slot) {
              const appointment = this.createAppointment(customer, serviceCode, day, slot, b1Count + b2Count + 1)
              this.appointments.push(appointment)
              customer.appointments.push(appointment)

              if (serviceCode === "B1") {
                customer.quotas.pregnancyB1++
                b1Count++
              } else {
                customer.quotas.pregnancyB2++
                b2Count++
              }

              console.log(
                `✅ Scheduled ${serviceCode} on ${format(day, "yyyy-MM-dd")} for ${customer.customerName} (month ${monthIndex + 1})`,
              )
              scheduled = true
              break
            }
          }
        }

        if (!scheduled) {
          console.log(`❌ Could not schedule ${serviceCode} in month ${monthIndex + 1} for ${customer.customerName}`)
        }
      }

      shouldBeB1 = !shouldBeB1 // Alternate for next month
    })

    // Second pass: Fill in any missing appointments with more flexible scheduling
    if (b1Count < 3 || b2Count < 3) {
      console.log(`Second pass needed for ${customer.customerName}: B1=${b1Count}/3, B2=${b2Count}/3`)

      // Try to schedule missing appointments across all available days
      const allDays = eachDayOfInterval({ start: startDate, end: endDate }).filter((day) =>
        this.isValidSchedulingDate(day, true),
      )

      for (const day of allDays) {
        if (b1Count >= 3 && b2Count >= 3) break

        // Try B1 if needed
        if (b1Count < 3 && this.enabledServices.includes("B1")) {
          if (this.hasValidGap(customer, day, ["B1", "B2"], 14)&& !this.isServiceAlreadyBookedOnDay(day, "B1")) {
            const slot = this.findAvailableSlot(day, "B1")
            if (slot) {
              const appointment = this.createAppointment(customer, "B1", day, slot, b1Count + b2Count + 1)
              this.appointments.push(appointment)
              customer.appointments.push(appointment)
              customer.quotas.pregnancyB1++
              b1Count++
              console.log(`✅ [Second pass] Scheduled B1 on ${format(day, "yyyy-MM-dd")} for ${customer.customerName}`)
              continue
            }
          }
        }

        // Try B2 if needed
        if (b2Count < 3 && this.enabledServices.includes("B2")) {
          if (this.hasValidGap(customer, day, ["B1", "B2"], 14)&& !this.isServiceAlreadyBookedOnDay(day, "B2")) {
            const slot = this.findAvailableSlot(day, "B2")
            if (slot) {
              const appointment = this.createAppointment(customer, "B2", day, slot, b1Count + b2Count + 1)
              this.appointments.push(appointment)
              customer.appointments.push(appointment)
              customer.quotas.pregnancyB2++
              b2Count++
              console.log(`✅ [Second pass] Scheduled B2 on ${format(day, "yyyy-MM-dd")} for ${customer.customerName}`)
            }
          }
        }
      }
    }

    console.log(
      `Pregnancy care complete for ${customer.customerName}: B1=${customer.quotas.pregnancyB1}, B2=${customer.quotas.pregnancyB2}`,
    )
  }

  private scheduleLateCare(customer: CustomerSimulationData) {
    console.log(`\n--- Scheduling late care (D1/D2) for ${customer.customerName} ---`)

    // D1/D2 - Start right after C ends (ET + 10 days)
    // Before ET+50: 2 per week, After ET+50: 1 per week
    const startDate = addDays(customer.et, 10) // Start right after C ends
    const endDate = addDays(customer.et, 84) // ET + 12 weeks
    const transitionDate = addDays(customer.et, 50) // ET + 50 days

    console.log(`D scheduling window: ${format(startDate, "yyyy-MM-dd")} to ${format(endDate, "yyyy-MM-dd")}`)
    console.log(`Transition at: ${format(transitionDate, "yyyy-MM-dd")} (2/week → 1/week)`)

    let currentDate = startDate
    let totalScheduled = 0
    let shouldBeD1 = true // Start with D1, then alternate
    let weeklyCount = 0
    let currentWeekStart = startDate

    while (currentDate <= endDate && totalScheduled < 16) {
      // Check if we've moved to a new week
      const daysSinceWeekStart = differenceInDays(currentDate, currentWeekStart)
      if (daysSinceWeekStart >= 7) {
        currentWeekStart = addDays(currentWeekStart, 7)
        weeklyCount = 0
      }

      // Determine how many slots per week based on date
      const isBeforeTransition = currentDate < transitionDate
      const maxSlotsThisWeek = isBeforeTransition ? 2 : 1

      // Only schedule if we haven't reached the weekly limit
      if (weeklyCount < maxSlotsThisWeek && this.isValidSchedulingDate(currentDate, true)) {
        const serviceCode = shouldBeD1 ? "D1" : "D2"

        if (this.enabledServices.includes(serviceCode)) {
          if (this.hasValidGap(customer, currentDate, ["D1", "D2"], 2)) {
            const slot = this.findAvailableSlot(currentDate, serviceCode)
            if (slot) {
              const appointment = this.createAppointment(customer, serviceCode, currentDate, slot, totalScheduled + 1)
              this.appointments.push(appointment)
              customer.appointments.push(appointment)

              if (serviceCode === "D1") customer.quotas.lateD1++
              else customer.quotas.lateD2++

              totalScheduled++
              weeklyCount++
              shouldBeD1 = !shouldBeD1 // Alternate

              const weekNumber = Math.floor(differenceInDays(currentDate, customer.et) / 7)
              console.log(
                `✅ Scheduled ${serviceCode} on ${format(currentDate, "yyyy-MM-dd")} for ${customer.customerName} (week ${weekNumber}, ${isBeforeTransition ? "2/week period" : "1/week period"})`,
              )
            }
          }
        }
      }

      currentDate = addDays(currentDate, 1)
    }

    console.log(
      `Late care complete for ${customer.customerName}: D1=${customer.quotas.lateD1}, D2=${customer.quotas.lateD2}`,
    )
  }

  private scheduleSharedBirthTraining() {
    console.log("\n--- Scheduling shared birth training (E1) ---")

    if (!this.enabledServices.includes("E1")) {
      console.log("E1 not enabled, skipping...")
      console.log("Enabled services:", this.enabledServices)
      return
    }

    // Add debugging for timetable
    console.log("Checking E1 slots in timetable...")
    const daysWithE1 = Object.keys(this.timetable).filter(
      (day) => this.timetable[day]?.slots?.E1 && this.timetable[day].slots.E1.length > 0,
    )
    console.log("Days with E1 slots:", daysWithE1)

    if (daysWithE1.length === 0) {
      console.log("❌ No E1 slots found in timetable for any day")
      return
    }

    // For simulation purposes, assume all customers are eligible for E1
    const eligibleCustomers = this.customers

    if (eligibleCustomers.length === 0) {
      console.log("No customers eligible for E1")
      return
    }

    console.log(`Found ${eligibleCustomers.length} customers for E1 course`)

    // Find a suitable start date for the course (6 weekly sessions)
    const earliestET = Math.min(...this.customers.map((c) => c.et.getTime()))
    const courseStartDate = addDays(new Date(earliestET), -70) // ET - 10 weeks (within E1 window)

    console.log(`E1 course start date: ${format(courseStartDate, "yyyy-MM-dd")}`)

    // Schedule 6 weekly sessions
    let currentDate = courseStartDate
    let attemptsCount = 0
    const maxAttempts = 50 // Prevent infinite loop

    for (let session = 1; session <= 6 && attemptsCount < maxAttempts; session++) {
      attemptsCount++

      // Find next valid weekday with E1 slots
      let foundValidDay = false
      let searchAttempts = 0

      while (!foundValidDay && searchAttempts < 14) {
        // Search up to 2 weeks ahead
        const dayName = format(currentDate, "EEEE")
        const hasE1Slots = this.timetable[dayName]?.slots?.E1 && this.timetable[dayName].slots.E1.length > 0

        console.log(
          `Checking ${format(currentDate, "yyyy-MM-dd")} (${dayName}): valid=${this.isValidSchedulingDate(currentDate, true)}, hasE1Slots=${hasE1Slots}`,
        )

        if (this.isValidSchedulingDate(currentDate, true) && hasE1Slots) {
          foundValidDay = true
          break
        }

        currentDate = addDays(currentDate, 1)
        searchAttempts++
      }

      if (!foundValidDay) {
        console.log(`❌ Could not find valid day with E1 slots for session ${session}`)
        continue
      }

      const slot = this.findAvailableSlot(currentDate, "E1")
      console.log(`Slot search result for ${format(currentDate, "yyyy-MM-dd")}:`, slot)

      if (slot) {
        const courseId = `E1-${format(courseStartDate, "yyyy-MM-dd")}`

        // Create course session
        const courseSession: CourseSession = {
          courseId,
          serviceCode: "E1",
          date: format(currentDate, "yyyy-MM-dd"),
          startTime: slot.startTime,
          endTime: slot.endTime,
          participants: eligibleCustomers.map((c) => c.customerId),
          maxParticipants: 10,
        }
        this.courseSessions.push(courseSession)

        // Create appointments for each participant
        eligibleCustomers.forEach((customer) => {
          const appointment = this.createAppointment(customer, "E1", currentDate, slot, session)
          appointment.courseId = courseId
          appointment.sessionNumber = session

          this.appointments.push(appointment)
          customer.appointments.push(appointment)
          customer.quotas.birthPrepSessions++
        })

        console.log(
          `✅ Scheduled E1 session ${session} on ${format(currentDate, "yyyy-MM-dd")} for ${eligibleCustomers.length} participants`,
        )

        // Move to next week
        currentDate = addDays(currentDate, 7)
      } else {
        console.log(`❌ Could not find slot for E1 session ${session} on ${format(currentDate, "yyyy-MM-dd")}`)
        // Try next day
        currentDate = addDays(currentDate, 1)
        session-- // Retry this session
      }
    }

    if (attemptsCount >= maxAttempts) {
      console.log("❌ Reached maximum attempts for E1 scheduling")
    }
  }

  private scheduleSharedAfterBirthGym() {
    console.log("\n--- Scheduling shared after birth gym (F1) ---")

    if (!this.enabledServices.includes("F1")) {
      console.log("F1 not enabled, skipping...")
      return
    }

    // For simulation purposes, assume all customers are eligible for F1
    const eligibleCustomers = this.customers

    if (eligibleCustomers.length === 0) {
      console.log("No customers for F1")
      return
    }

    console.log(`Found ${eligibleCustomers.length} customers for F1 course`)

    // Find a suitable start date for the course (8 weekly sessions)
    const latestET = Math.max(...this.customers.map((c) => c.et.getTime()))
    const courseStartDate = addDays(new Date(latestET), 56) // ET + 8 weeks

    console.log(`F1 course start date: ${format(courseStartDate, "yyyy-MM-dd")}`)

    // Schedule 8 weekly sessions
    let currentDate = courseStartDate
    for (let session = 1; session <= 8; session++) {
      // Find next valid weekday
      while (!this.isValidSchedulingDate(currentDate, true)) {
        currentDate = addDays(currentDate, 1)
      }

      const slot = this.findAvailableSlot(currentDate, "F1")
      if (slot) {
        const courseId = `F1-${format(courseStartDate, "yyyy-MM-dd")}`

        // Create course session
        const courseSession: CourseSession = {
          courseId,
          serviceCode: "F1",
          date: format(currentDate, "yyyy-MM-dd"),
          startTime: slot.startTime,
          endTime: slot.endTime,
          participants: eligibleCustomers.map((c) => c.customerId),
          maxParticipants: 10,
        }
        this.courseSessions.push(courseSession)

        // Create appointments for each participant
        eligibleCustomers.forEach((customer) => {
          const appointment = this.createAppointment(customer, "F1", currentDate, slot, session)
          appointment.courseId = courseId
          appointment.sessionNumber = session

          this.appointments.push(appointment)
          customer.appointments.push(appointment)
          customer.quotas.ruckbildungSessions++
        })

        console.log(
          `✅ Scheduled F1 session ${session} on ${format(currentDate, "yyyy-MM-dd")} for ${eligibleCustomers.length} participants`,
        )

        // Move to next week
        currentDate = addDays(currentDate, 7)
      } else {
        console.log(`❌ Could not find slot for F1 session ${session} on ${format(currentDate, "yyyy-MM-dd")}`)
        // Try next day
        currentDate = addDays(currentDate, 1)
        session-- // Retry this session
      }
    }
  }

  private hasValidGap(
    customer: CustomerSimulationData,
    date: Date,
    serviceCodes: string[],
    minGapDays: number,
  ): boolean {
    const lastAppointment = customer.appointments
      .filter((apt) => serviceCodes.includes(apt.appointmentCode))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]

    if (!lastAppointment) return true

    const daysDiff = differenceInDays(date, new Date(lastAppointment.date))
    return daysDiff >= minGapDays
  }

  private isValidSchedulingDate(date: Date, weekdaysOnly: boolean, serviceCode?: string): boolean {
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

  private findAvailableSlot(date: Date, serviceCode: string): TimeSlot | null {
    const dayName = format(date, "EEEE")
    const daySlots = this.timetable[dayName]?.slots[serviceCode]

    if (!daySlots || daySlots.length === 0) {
      return null
    }

    // For course appointments (E1, F1), check if slot is available for shared use
    if (serviceCode === "E1" || serviceCode === "F1") {
      for (const slot of daySlots) {
        const existingCourse = this.courseSessions.find(
          (course) =>
            course.date === format(date, "yyyy-MM-dd") &&
            course.startTime === slot.startTime &&
            course.serviceCode === serviceCode,
        )

        if (!existingCourse || existingCourse.participants.length < existingCourse.maxParticipants) {
          return slot
        }
      }
      return null
    }

    // For individual appointments, find first available slot
    for (const slot of daySlots) {
      if (this.isSlotAvailable(date, slot)) {
        return slot
      }
    }

    return null
  }

  private isSlotAvailable(date: Date, slot: TimeSlot): boolean {
    const dateString = format(date, "yyyy-MM-dd")

    // Check if slot is already taken by individual appointments
    const conflictingAppointment = this.appointments.find(
      (apt) => apt.date === dateString && apt.startTime === slot.startTime,
    )

    return !conflictingAppointment
  }

  private createAppointment(
    customer: CustomerSimulationData,
    serviceCode: string,
    date: Date,
    slot: TimeSlot,
    sequenceNumber: number,
  ): SimulationAppointment {
    const durations: Record<string, number> = {
      B1: 60,
      B2: 45,
      C1: 60,
      C2: 25,
      D1: 60,
      D2: 25,
      E1: 140,
      F1: 75,
    }

    const titles: Record<string, string> = {
      B1: "Pre Birth Consultation Visit",
      B2: "Pre Birth Consultation Video",
      C1: "After Birth Intense Care Visit",
      C2: "After Birth Intense Care Video",
      D1: "After Birth Child Support Visit",
      D2: "After Birth Child Support Video",
      E1: "Birth Training Class",
      F1: "After Birth Gym",
    }

    return {
      id: `${customer.customerId}-${serviceCode}-${sequenceNumber}`,
      customerId: customer.customerId,
      customerName: customer.customerName,
      appointmentType: titles[serviceCode] || serviceCode,
      appointmentCode: serviceCode,
      date: format(date, "yyyy-MM-dd"),
      startTime: slot.startTime,
      endTime: slot.endTime,
      duration: durations[serviceCode] || 60,
      color: SERVICE_COLORS[serviceCode] || "bg-gray-500",
      et: format(customer.et, "yyyy-MM-dd"),
      isWeekend: isWeekend(date),
      isHoliday: isGermanHoliday(date),
    }
  }
}
