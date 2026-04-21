import axios from "axios";
import { SalesPersonApiUrl, MidwifeApiUrl, changeAppointmentSlotsApiUrl ,E1ClassesApiUrl , F1ClassesApiUrl } from "./URLS";
import { AddMidwifeFormData } from "@/types";

export const UpdateSalesPersonApi = async ({
  id,
  username,
  email,
  password
}: { id: string, username?: string, email?: string, password?: string }) => {
  const requestBody: { username?: string, email?: string, password?: string } = {};

  if (username) requestBody.username = username;
  if (email) requestBody.email = email;
  if (password) requestBody.password = password;

  const response = await axios.put(`${SalesPersonApiUrl}/${id}`, requestBody);
  return response;
}

export const UpdateMidwifeApi = async (id: string, data: AddMidwifeFormData) => {
  try {
    const response = await axios.put(`${MidwifeApiUrl}/${id}`, data);
    return response;
  } catch (error) {
    console.error("Error updating midwife:", error);
    throw error;
  }
}

type ChangeApptPayload = {
  midwifeId: string;
  clientId: string;
  serviceCode: string;
  appointmentId: string;
  updatedDate: string;       // consider ISO: 2025-11-06
  updatedStartTime: string;  // e.g., "15:30"
  updatedEndTime: string;    // e.g., "16:20"
};
export const changeAppointmentSlotsApi = async (data: ChangeApptPayload) => {
  try {
    const response = await axios.put(`${changeAppointmentSlotsApiUrl}`, {
      "midwifeId": data.midwifeId,
      "clientId": data.clientId,
      "serviceCode": data.serviceCode,
      "appointmentId": data.appointmentId,
      "updatedDate": data.updatedDate,
      "updatedStartTime": data.updatedStartTime,
      "updatedEndTime": data.updatedEndTime
    });
    return response;
  } catch (error) {
    console.error("Error updating midwife:", error);
    throw error;
  }
}

export const updateE1Classs = async (midwifeId: string, data: object) => {
  const response = await axios.put(`${E1ClassesApiUrl}/${midwifeId}`, data)
  return response
}
export const updateF1Classs = async (midwifeId: string, data: object) => {
  const response = await axios.put(`${F1ClassesApiUrl}/${midwifeId}`, data)
  return response
}