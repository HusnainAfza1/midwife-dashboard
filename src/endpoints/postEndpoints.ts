import { AddMidwifeFormData, ScheduleAppointment, CourseData } from '@/types';
import axios from 'axios';
import { loginAPiUrl, MidwifeApiUrl, SalesPersonApiUrl, updateClientPlanApiUrl, ScheduleApiUrl, PrivateServicesUrl, CoursesUrl, CreateCustomerApiUrl, RegisterMidiwifeApiUrl, GetMidwifesNameUrl, GetPreBirthSchedulesUrl, GetUserDetailsUrl, e1ClassesApiUrl, f1ClassesApiUrl, getBookedAppointmentsApiUrl, createNewAppointmentApiUrl, assignClassesToClientApiUrl, clientRegisterApiUrl, midwifeBookingApiUrl, PreBirthBookingApiURl, PostBookingApiURl, CheckUserApiUrl } from "./URLS";
import { CustomerFormData } from '@/types/customers';
export type ServiceItemInput = Omit<CourseData, "id">;

export const LoginApi = async ({ email, password }: { email: string, password: string }) => {
    const response = await axios.post(
        `${loginAPiUrl}`,
        {
            email: email,
            password: password
        }
    );
    return response;
}
export const CheckUserApi = async ({ username, email }: { username: string, email: string }) => {
    const response = await axios.post(
        `${CheckUserApiUrl}`,
        {
            email: email,
            username: username
        }
    );
    return response;
}
export const SalesPersonRegisterApi = async ({
    username,
    email,
    password
}: { username: string, email: string, password: string }) => {
    const response = await axios.post(
        `${SalesPersonApiUrl}`,
        {
            username: username,
            email: email,
            password: password
        }
    );
    return response;
}
export const CreateUpdateScheduleApi = async ({ schedule }: { schedule: ScheduleAppointment[] }) => {
    const response = await axios.post(
        `${ScheduleApiUrl}`, { "weeklySchedule": schedule }
    );
    return response;
}
export const CreateUpdateSpecificUserScheduleApi = async ({
    schedule, userId
}: {
    schedule: ScheduleAppointment[];
    userId: string;
}) => {
    const response = await axios.post(
        `${ScheduleApiUrl}`, { "weeklySchedule": schedule, "userId": userId }
    );
    return response;
}
export const CreateMidwifeApi = async (midwifeData: AddMidwifeFormData) => {
    const response = await axios.post(
        `${MidwifeApiUrl}`, midwifeData
    );
    return response;
}
export const AddPrivateServicesApi = async (serviceData: ServiceItemInput) => {
    const response = await axios.post(
        `${PrivateServicesUrl}`, serviceData
    );
    return response;
}
export const AddCourseApi = async (CourseData: ServiceItemInput) => {
    const response = await axios.post(
        `${CoursesUrl}`, CourseData
    );
    return response;
}
export const CreateCustomerApi = async (customerData: CustomerFormData) => {
    const response = await axios.post(`${CreateCustomerApiUrl}`, customerData)
    return response
}


export const MidwifeRegisterApi = async ({
    username,
    email,
    password
}: { username: string, email: string, password: string }) => {
    const response = await axios.post(
        `${RegisterMidiwifeApiUrl}`,
        {
            username: username,
            email: email,
            password: password
        }
    );
    return response;
}
export const fetchMidwifeNames = async (ids: string[]) => {
    const response = await axios.post(
        `${GetMidwifesNameUrl}`,
        {
            ids
        }
    );
    return response;
}

export const GetPreBirthSchedulesApi = async (status: string, midwifeId?: string) => {
    const requestBody: { status: string; midwifeId?: string } = { status }

    if (midwifeId) {
        requestBody.midwifeId = midwifeId
    }

    const response = await axios.post(`${GetPreBirthSchedulesUrl}`, requestBody)
    return response
}

export const fetchUserDetails = async (ids: string[]) => {
    const response = await axios.post(
        `${GetUserDetailsUrl}`,
        { ids }
    );
    return response;
}
export const e1ClassesApi = async (midwifeId: string, classes: object) => {
    const response = await axios.post(
        `${e1ClassesApiUrl}`,
        { midwifeId, classes: classes }
    );
    return response;
}
export const f1ClassesApi = async (midwifeId: string, classes: object) => {
    const response = await axios.post(
        `${f1ClassesApiUrl}`,
        { midwifeId, classes: classes }
    );
    return response;
}
export const getBookedAppointmentsApi = async (midwifeId: string, clientET: string) => {
    const response = await axios.post(
        `${getBookedAppointmentsApiUrl}`,
        { midwifeId, clientET: clientET }
    );
    return response;
}

export const createNewAppointmentApi = async ({ data }: { data: object }) => {
    const response = await axios.post(`${createNewAppointmentApiUrl}`, data);
    return response;
}
export const assignClassesToClientApi = async ({ data }: { data: object }) => {
    // console.log("Data to give the :::", { data })
    // console.log("Data to give the :::", data)
    // console.log("Data to give the :::", data)
    // console.log("Data to give the :::", data) 
    // console.log("url is :",assignClassesToClientApiUrl)
    const response = await axios.post(`${assignClassesToClientApiUrl}`, data);
    return response;
}

export const clientRegisterApi = async ({
    username,
    fullName,
    email,
    password
}: { username: string, email: string, password: string, fullName: string }) => {
    const response = await axios.post(
        `${clientRegisterApiUrl}`,
        {
            username: username,
            fullName: fullName,
            email: email,
            password: password
        }
    );
    return response;
}

export const MidwifeBookingApi = async (data: object) => {
    console.log("data", data);
    console.log("APPOINTMENT_API_URL", midwifeBookingApiUrl);
    const response = await axios.post(
        `${midwifeBookingApiUrl}`, data
    );
    return response;
}

export const preBirthBookingsApi = async (data: object) => {
    const response = await axios.post(
        `${PreBirthBookingApiURl}`, data
    );
    return response;
}
export const postBirthBookingsApi = async (data: object) => {
    const response = await axios.post(
        `${PostBookingApiURl}`, data
    );
    return response;
}
export const updateClientPlanApi = async (userId: string, midwifeId: string, plan: string) => {   

    console.log("updateClientPlanApiUrl::",updateClientPlanApiUrl)
    const response = await axios.post(
        `${updateClientPlanApiUrl}`, {
        userId: userId,
        midwifeId: midwifeId,
        plan: plan
    }
    );
    return response;
}



