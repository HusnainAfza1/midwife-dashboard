import { updateAppointmentStatusApiUrl } from "./URLS"
import axios from "axios"

export const UpdateAppointmentStatusApi = async (id: string, type: string) => {
    console.log(updateAppointmentStatusApiUrl)
    const response = await axios.patch(`${updateAppointmentStatusApiUrl}`, { "_id": id, "type": type })
    return response
}