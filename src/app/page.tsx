"use client"
import AddSalesPerson from "@/components/AddSalesPerson/AddSalesPerson"
import AppointmentDurationSetting from "@/components/AppointmentDurationSetting"
import AppointmentListView from "@/components/AppointmentsListView"
import AppointmentSetting from "@/components/AppointmentsSetting"
import DashNav from "@/components/DashNav/DashNav"
import BookingsTable from "@/components/ProjectA/Tables/BookingsTable"
// import CustomersTable from "@/components/ProjectA/Tables/CustomersTable"
import MidwifeTable from "@/components/ProjectA/Tables/MidwifeTable"
import ProjectADashboard from "@/components/ProjectADashboard"
import SidePanel from "@/components/Sidepanel/SidePanel"
import PermissionWrapper from "@/wraper/PermissionWraper"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { GetAppointmentsApi } from "@/endpoints/getEndpoints"
import { useEffect, useState } from "react"
import { convertTo24HourTime } from "@/lib/utils"
import type { Appointment } from "@/types"
import PendingApprovalsTable from "@/components/ProjectA/Tables/PendingApprovalsTable"
import PostBirthApprovalsTable from "@/components/ProjectA/Tables/postBirthApprovalsTable"  
import ClientTable from "@/components/ProjectA/Tables/clientTable"
// import { parseLocaleDate } from "@/utils/date"
// import PaymentsTable from "@/components/ProjectA/Tables/PaymentsTable"

// import type { Customer } from "@/types/customers"

const Home = () => {
  const [panelName, setPanelName] = useState<string>("Dashboard")
  const [appointments, setAppointments] = useState<Appointment[]>([])
  // const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  // const [showAddCustomerForm, setShowAddCustomerForm] = useState(false)


  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await GetAppointmentsApi()
        setAppointments(response.data.data)
        console.log("Appointments fetched successfully:", response.data.data)
      } catch (error) {
        console.error("Error fetching appointments:", error)
      }
    }
    fetchAppointments()
  }, [])

  // const filterAppointments = () => {
  //   const now = new Date() // Current UTC time
  //   const upcoming = []
  //   const previous = []

  //   for (const appointment of appointments) {
  //     const appointmentDate = new Date(appointment.selectedDate)
  //     const endDateTime = calculateEndDateTime(appointment)

  //     if (endDateTime < now) {
  //       previous.push(appointment)
  //     } else if (appointmentDate > now) {
  //       upcoming.push(appointment)
  //     } else {
  //       previous.push(appointment)
  //     }
  //   }

  //   return { upcoming, previous }
  // }

  const filterAppointments = () => {
    // const now = new Date() // Current UTC time
    const upcoming = []
    const previous = []

    for (const appointment of appointments) {
      // const appointmentDate = parseLocaleDate(appointment.selectedDate)
      // const endDateTime = calculateEndDateTime(appointment)

      const selectedDate = appointment.selectedDate;
      const endTime = convertTo24HourTime(appointment.endTime);
      const startTime = convertTo24HourTime(appointment.startTime);

      const nowTime = getGermanDateTime() // Get current time in German format   
      console.log("Current Time in German Format:", nowTime);

      const appointmentTime = {
        selectedDate,
        endTime,
        startTime
      }

      // console.log("Appointment Time:", appointmentTime);

      // console.log({ "Appointment Date": appointmentDate, "End DateTime": endDateTime, "Now": now });

      const status = getAppointmentStatus(nowTime, appointmentTime);
      console.log("Appointment Status:", status);

      // {
      //   "Appointment Date": "2025-07-22T19:00:00.000Z",
      //     "End DateTime": "2025-07-23T08:30:00.000Z",
      //       "Now": "2025-07-23T10:21:38.938Z"
      // }

      // if (endDateTime < now) {
      //   previous.push(appointment)
      // } else if (appointmentDate > now) {
      //   upcoming.push(appointment)
      // } else {
      //   previous.push(appointment)
      // }      
      // if (now >= endDateTime) {
      //   // Appointment has completely ended
      //   previous.push(appointment);
      // } else {
      //   // Appointment is either upcoming OR currently happening
      //   upcoming.push(appointment);
      // }   
      if (status === 'previous') {
        previous.push(appointment);
      } else {
        // Both 'upcoming' and 'ongoing' go to upcoming
        upcoming.push(appointment);
      }
    }

    return { upcoming, previous }
  }





  const getAppointmentStatus = (nowTime: { date: string, time: string }, appointmentTime: { selectedDate: string, startTime: string, endTime: string }) => {
    // Parse current date and time
    const [currentDay, currentMonth, currentYear] = nowTime.date.split('/').map(Number);
    const [currentHour, currentMinute] = nowTime.time.split(':').map(Number);

    // Parse appointment date and times
    const [appointmentDay, appointmentMonth, appointmentYear] = appointmentTime.selectedDate.split('/').map(Number);
    const [startHour, startMinute] = appointmentTime.startTime.split(':').map(Number);
    const [endHour, endMinute] = appointmentTime.endTime.split(':').map(Number);

    // Create Date objects for comparison
    const currentDate = new Date(currentYear, currentMonth - 1, currentDay, currentHour, currentMinute);
    const appointmentStartDate = new Date(appointmentYear, appointmentMonth - 1, appointmentDay, startHour, startMinute);
    const appointmentEndDate = new Date(appointmentYear, appointmentMonth - 1, appointmentDay, endHour, endMinute);

    // Return status flag
    if (currentDate < appointmentStartDate) {
      return 'upcoming';  // Appointment hasn't started yet
    } else if (currentDate >= appointmentStartDate && currentDate <= appointmentEndDate) {
      return 'upcoming';   // Appointment is happening now
    } else {
      return 'previous';  // Appointment has ended
    }
  };



  const getGermanDateTime = () => {
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'Europe/Berlin',
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    };

    const formatter = new Intl.DateTimeFormat('en-GB', options); // en-GB gives DD/MM/YYYY format
    const parts = formatter.formatToParts(new Date());

    // Extract parts
    const day = parts.find(part => part.type === 'day')?.value ?? '';
    const month = parts.find(part => part.type === 'month')?.value ?? '';
    const year = parts.find(part => part.type === 'year')?.value ?? '';
    const hour = parts.find(part => part.type === 'hour')?.value ?? '';
    const minute = parts.find(part => part.type === 'minute')?.value ?? '';

    return {
      date: `${day}/${month}/${year}`,
      time: `${hour}:${minute}`
    };
  };


  // Helper function to calculate end date-time in UTC
  // const calculateEndDateTime = (appointment: Appointment) => {
  //   // 1. Get date portion in CET (UTC+1)
  //   const datePart = new Date(appointment.selectedDate)
  //   datePart.setHours(datePart.getHours() + 1) // Convert to CET

  //   // 2. Parse end time (CET timezone)
  //   const [time, modifier] = appointment.endTime.split(" ")
  //   const [hours, minutes] = time.split(":").map(Number) // Changed to const

  //   // Convert to 24h format
  //   let adjustedHours = hours
  //   if (modifier === "PM" && hours !== 12) adjustedHours += 12
  //   if (modifier === "AM" && hours === 12) adjustedHours = 0

  //   // 3. Create CET datetime object
  //   const endDateTimeCET = new Date(datePart)
  //   endDateTimeCET.setHours(adjustedHours, minutes, 0, 0)

  //   // 4. Convert back to UTC
  //   return new Date(endDateTimeCET.getTime() - 60 * 60 * 1000)
  // }

  // const calculateEndDateTime = (appointment: Appointment) => {
  //   const datePart = parseLocaleDate(appointment.selectedDate)
  //   datePart.setHours(datePart.getHours() + 1) // Convert to CET

  //   const [time, modifier] = appointment.endTime.split(" ")
  //   const [hours, minutes] = time.split(":").map(Number)

  //   // console.log("Parsed end time:", hours, minutes, modifier, time);   
  //   // console.log("hours:", hours, "minutes:", minutes, "modifier:", modifier ,"time:", time);

  //   let adjustedHours = hours
  //   if (modifier === "PM" && hours !== 12) adjustedHours += 12
  //   if (modifier === "AM" && hours === 12) adjustedHours = 0

  //   const endDateTimeCET = new Date(datePart)
  //   endDateTimeCET.setHours(adjustedHours, minutes, 0, 0)

  //   return new Date(endDateTimeCET.getTime() - 60 * 60 * 1000)
  // }

  const { upcoming, previous } = filterAppointments()
  // const handleCustomerClick = (customer: Customer) => {
  //   setSelectedCustomer(customer)
  // }
  // const handleAddCustomer = () => {
  //   setShowAddCustomerForm(true)
  // }

  useEffect(() => {
    if (panelName === "Appointments") {
      setPanelName("Upcoming")
    }
  }, [panelName])

  // Render content based on panel name
  const renderContent = () => {
    switch (panelName) {
      case "Settings":
        return (
          <>
            <AppointmentSetting />
            <PermissionWrapper element={<AppointmentDurationSetting />} permissions={["superuser"]} />
          </>
        )
      case "Upcoming":
        return <AppointmentListView appointments={upcoming} title="Upcoming Appointments" />
      case "Previous":
        return <AppointmentListView appointments={previous} title="Previous Appointments" />
      case "Sales Person":
        return <AddSalesPerson />
      case "Project A":
        return <ProjectADashboard />
      case "Midwife":
        return <MidwifeTable />
      case "Leads":
        return <BookingsTable />
      case "PreBirth Approvals":
        return <PendingApprovalsTable />
      // case "Payments":
      //   return <PaymentsTable />  
      case "PostBirth Approvals":
        return <PostBirthApprovalsTable />
      case "Customers":
        // return <CustomersTable />  
        return <ClientTable/>
      default:
        return (
          <div className="h-screen w-full flex justify-center items-center">
            <Label>Page not available</Label>
          </div>
        )
    }
  }

  return (
    <div className="flex">
      <div className="flex">
        <SidePanel panelName={panelName} setPanelName={setPanelName} />
      </div>
      <div className="p-6 bg-[#f4f7fe] h-screen flex-1">
        <DashNav panelName={panelName} />
        <ScrollArea className="h-[84vh]">{renderContent()}</ScrollArea>
      </div>
    </div>
  )
}

export default Home