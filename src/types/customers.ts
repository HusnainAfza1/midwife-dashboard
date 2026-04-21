export interface Customer {
  _id: string
  customerId: string
  customerName: string
  email: string
  phone: string
  dateOfBirth: string
  address: string
  midwifeId: string
  midwifeName: string
  et: string
  totalAppointments: number
  status: "Active" | "Inactive" | "Completed"
  createdAt: string
  updatedAt: string
}

export interface CustomerFormData {
  customerName: string
  email: string
  phone: string
  dateOfBirth: string
  address: string
  midwifeId: string
  et: string
  status: "Active" | "Inactive" | "Completed"
}

export interface CustomerAppointment {
  _id: string
  customerId: string
  customerName: string
  midwifeId: string
  midwifeName: string
  date: string
  time: string
  duration: number
  serviceType: string
  serviceCode: string
  serviceTitle: string
  startTime: string
  endTime: string
  status: "Scheduled" | "Completed" | "Cancelled" | "Rescheduled"
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface CustomerProfileData extends Customer {
  appointments: CustomerAppointment[]
}
