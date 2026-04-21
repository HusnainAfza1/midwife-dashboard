export interface leads {
  _id: string,
  userId: string,
  midwifeId: string,
  midwifeName: string,
  fullName: string,
  email: string,
  phoneNumber: string,
  insuranceNumber: string,
  insuranceCompany: string,
  insuranceType: string,
  date: string,
  expectedDeliveryDate: string,
  selectedAddressDetails: {
    address: string
  },
  selectedSlot: string, 
  CurrentPlan :string
  status: string 
  createdAt:string


}