// components/AddClient/types.ts
import type { SelectedAddress } from "@/types/google-places"
import type { AddMidwifeFormData } from "@/types"

export interface ClientFormData {
    // Step 1 - Sign up details 
    clientId?: string
    username: string
    fullName: string
    email: string
    password: string
    
    // Step 2 - Expected date, Address & Midwife
    expectedDate: string
    googleAddress: SelectedAddress | null
    selectedMidwife: AddMidwifeFormData | null
    
    // Step 3 - Insurance details
    phoneNumber: string
    insuranceNumber: string
    insuranceCompany: string
    insuranceType: "private" | "government" | ""
    
    // Step 4 - Care type
    careType: "prebirth" | "postbirth" | ""
}