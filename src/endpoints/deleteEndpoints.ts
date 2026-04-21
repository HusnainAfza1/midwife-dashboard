import axios from "axios";
import { SalesPersonApiUrl, MidwifeApiUrl, DeleteAppointmentApiUrl, removeClientFromClassesApiUrl } from "./URLS";

export const DeleteSalesPersonApi = async ({ id }: { id: string }) => {
    const response = await axios.delete(`${SalesPersonApiUrl}/${id}`);
    return response;
}

export const DeleteMidwivesApi = async ({ id }: { id: string }) => {
    const response = await axios.delete(`${MidwifeApiUrl}/${id}`);
    return response;
}
export const DeleteAppointmentApi = async ({ data }: { data: object }) => {
    const response = await axios.delete(`${DeleteAppointmentApiUrl}`, { data });
    return response;
}
export const removeClientFromClassesApi = async ({ data }: { data: object }) => {
    const response = await axios.delete(`${removeClientFromClassesApiUrl}`, { data });
    return response;
}