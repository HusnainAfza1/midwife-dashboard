import axios from "axios";
import { AppointmentsApiUrl, CoursesUrl, GetAllCustomersApiUrl, GetCustomerAppointmentsApiUrl,midwifeBookingApiUrl, GetSpecificUserScheduleApiUrl, LogoutAPiUrl, MidwifeApiUrl, PrivateServicesUrl, SalesPersonApiUrl, ScheduleApiUrl, SlogansUrl, GetMidiwfeA1BookingsUrl, GetMidiwfeByIdUrl, GetPostBirthSchedulesUrl, GetmidwifeA1bookingAppointmentCountApiUrl ,E1ClassesApiUrl , F1ClassesApiUrl ,GetuserByEmailApiUrl } from "./URLS";

export const GetSalesPersonApi = async () => {
    const response = await axios.get(`${SalesPersonApiUrl}`);
    return response;
}
export const LogoutAPi = async () => {
    const response = await axios.get(`${LogoutAPiUrl}`);
    return response;
}
export const GetScheduleApi = async () => {
    const response = await axios.get(`${ScheduleApiUrl}`);
    return response;
}
export const GetSpecificUserScheduleApi = async ({ id }: { id: string }) => {
    const response = await axios.get(`${GetSpecificUserScheduleApiUrl}/${id}`);
    return response;
}
export const GetAppointmentsApi = async () => {
    const response = await axios.get(`${AppointmentsApiUrl}`);
    return response;
}
export const GetAllMidwivesApi = async () => {
    const response = await axios.get(`${MidwifeApiUrl}`)
    return response
}
export const GetAllslogansApi = async () => {
    const response = await axios.get(`${SlogansUrl}`)
    return response
}
export const GetAllPrivateServicesApi = async () => {
    const response = await axios.get(`${PrivateServicesUrl}`)
    return response
}
export const GetAllCoursesApi = async () => {
    const response = await axios.get(`${CoursesUrl}`)
    return response
}
export const GetAllCustomersApi = async () => {
    const response = await axios.get(GetAllCustomersApiUrl)
    return response
}

export const GetCustomerAppointmentsApi = async (customerId: string) => {
    const response = await axios.get(`${GetCustomerAppointmentsApiUrl}/${customerId}`)
    return response
}
export const GetMidiwfeA1BookingsApi = async (status: string) => {
    const response = await axios.get(`${GetMidiwfeA1BookingsUrl}?clientStatus=${status}`)
    return response
}
export const GetMidiwfeByIdApi = async (id: string) => {
    const response = await axios.get(`${GetMidiwfeByIdUrl}/${id}`)
    return response
}

export const GetPostBirthSchedulesApi = async (status: string, midwifeId?: string) => {
    const requestBody: { status: string; midwifeId?: string } = { status }

    if (midwifeId) {
        requestBody.midwifeId = midwifeId
    }

    const response = await axios.post(`${GetPostBirthSchedulesUrl}`, requestBody)
    return response
}

export const GetmidwifeA1bookingAppointmentCountApi = async (midwifeId: string, expectedDeliveryDate: string,) => {

    // const response = await axios.get(`${"/api/public/midwifeBooking/appointments-count"}?midwifeId=${midwifeId}&expectedDeliveryDate=${expectedDeliveryDate}`);
    const response = await axios.get(`${GetmidwifeA1bookingAppointmentCountApiUrl}?midwifeId=${midwifeId}&expectedDeliveryDate=${expectedDeliveryDate}`);
    return response;

}  

export const GetE1ClasssesApi = async (midwifeId: string) => {

    const response = await axios.get(`${E1ClassesApiUrl}/${midwifeId}`);
    return response;

}
export const GetF1ClasssesApi = async (midwifeId: string) => {

    const response = await axios.get(`${F1ClassesApiUrl}/${midwifeId}`);
    return response;

}
export const GetuserByEmailApi = async (email: string) => {

    const response = await axios.get(`${GetuserByEmailApiUrl}?email=${email}`);
    return response;

}
export const getMidwifeBookingApi = async (midwifeId: string , userId : string) => {

    const response = await axios.get(`${midwifeBookingApiUrl}?midwifeId=${midwifeId}&userId=${userId}`);
    return response;

}