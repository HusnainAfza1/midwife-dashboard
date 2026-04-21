"use client";

import { useState } from "react";
import { Appointment } from "@/types";
import { getColumns } from "./columns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { DataTable } from "@/components/dataTable/data-table";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { convertTo24HourTime } from "@/lib/utils";
import { useUser } from "@/contextApis/UserContext";  
import { HiOutlineClipboardCopy, HiOutlineCheck } from 'react-icons/hi';

interface AppointmentProps {
    appointments: Appointment[];
    title: string;
}

const formatDateToDDMMYYYY = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
};

const AppointmentListView = ({ appointments, title }: AppointmentProps) => {
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [tempSelectedDate, setTempSelectedDate] = useState<Date | undefined>(undefined);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { userRole } = useUser();  
    const [copied, setCopied] = useState(false);  

    console.log("userRole", userRole);    

    const copyToClipboard = (meetingLink: string) => {
        navigator.clipboard.writeText(meetingLink)
            .then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            })
        .catch(err => console.error('Failed to copy: ', err));
};


    // Determine if the table should show the Zoom Link column
    const isUpcoming = title.toLowerCase().includes("upcoming");

    // Filter appointments by selected date
    const filteredAppointments = selectedDate
        ? appointments.filter((appointment) => {
            return appointment.selectedDate === formatDateToDDMMYYYY(selectedDate);
        })
        : appointments;

    // Handle applying the date filter
    const handleApplyDate = () => {
        setSelectedDate(tempSelectedDate);
        setIsDialogOpen(false);
    };

    // Handle canceling the date selection
    const handleCancelDate = () => {
        setTempSelectedDate(selectedDate);
        setIsDialogOpen(false);
    };

    // Clear the selected date
    const handleClearDate = () => {
        setSelectedDate(undefined);
        setTempSelectedDate(undefined);
    };

    return (
        <div>
            <div className="bg-white p-6 rounded-lg">
                <div className="flex space-x-4">
                    {/* Date Filter */}
                    <div className="mb-4">
                        {/* <label className="block text-sm font-medium text-gray-700">Select Meeting Date</label> */}
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button
                                    variant={selectedDate ? "default" : "outline"}
                                >
                                    {selectedDate ? formatDateToDDMMYYYY(selectedDate) : "Select Meeting Date"}
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="w-80">
                                <div className="space-y-4 flex flex-col items-center">

                                    <p>Select Meeting Date</p>
                                    {/* Calendar Component */}
                                    <Calendar
                                        mode="single"
                                        selected={tempSelectedDate}
                                        onSelect={setTempSelectedDate}
                                        className="rounded-md border shadow mt-4 w-full flex justify-center"
                                    />

                                    {/* Apply and Cancel Buttons */}
                                    <div className="w-full flex justify-center space-x-2">
                                        <Button variant="outline" onClick={handleCancelDate} className="w-32">
                                            Cancel
                                        </Button>
                                        <Button onClick={handleApplyDate} className="w-32">Apply</Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Clear Filter Button */}
                    {selectedDate && (
                        <Button
                            variant="outline"
                            onClick={handleClearDate}
                        >
                            Clear
                        </Button>
                    )}
                </div>

                {/* Pass filtered appointments to the DataTable */}
                <DataTable
                    columns={getColumns(setSelectedAppointment, isUpcoming, userRole)}
                    data={filteredAppointments}
                    searchPlaceholder="Appointments"
                    searchableColumns={["name"]}
                />
            </div>

            {/* Sidebar for Viewing Appointment Details */}
            {selectedAppointment && (
                <div className="fixed inset-0 flex justify-end bg-black bg-opacity-50 z-50">
                    <div className="w-full sm:w-96 bg-white h-full shadow-lg p-6 overflow-y-auto animate-slide-in-right">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-xl font-semibold ">Appointment Details</h2>
                            <button
                                className="text-gray-500 hover:text-gray-800"
                                onClick={() => setSelectedAppointment(null)}
                            >
                                ✖
                            </button>
                        </div>
                        <div className="space-y-4">
                            <p>
                                <strong>Submission Date:</strong>{" "}
                                {new Date(selectedAppointment.createdAt).toLocaleDateString("en-GB", {
                                    year: "numeric",
                                    month: "numeric",
                                    day: "numeric",
                                })}
                            </p>
                            <p>
                                <strong>Midwife Name:</strong> {selectedAppointment.name}
                            </p>
                            <p>
                                <strong>Location (City):</strong> {selectedAppointment.location}
                            </p>
                            <p>
                                <strong>Meeting Date:</strong>  {selectedAppointment.selectedDate}
                            </p>
                            <p>
                                <strong>Meeting Time:</strong> {convertTo24HourTime(selectedAppointment.startTime)}
                            </p>
                            <p>
                                <strong>Phone:</strong> {selectedAppointment.phone}
                            </p>
                            <p>
                                <strong>Email:</strong> {selectedAppointment.email}
                            </p>

                            {userRole === 'superuser' && (
                                <p>
                                    <strong>Assigned to:</strong> {selectedAppointment.username}
                                </p>
                            )}
                            <p>
                                <strong>Challenge:</strong> {selectedAppointment.challengeOptions}
                            </p>
                            <p>
                                <strong>Challenge Description:</strong>{" "}
                                {selectedAppointment.challengeDescription || "No description provided"}
                            </p>
                            {isUpcoming && (
                                <p>
                                    <strong>Meeting Link:</strong>{" "}
                                    <a href={selectedAppointment.meetingLink} className="text-blue-600 underline" target="_blank">
                                        Join Meeting
                                    </a>
                                </p>
                            )}
                            {!isUpcoming && (
                                <div>
                                    <p className="mb-2">
                                        <strong>Meeting Link:</strong>
                                    </p>
                                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border">
                                        <a
                                            href={selectedAppointment.meetingLink}
                                            className="text-blue-600 hover:text-blue-800 flex-1 break-all text-sm"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {selectedAppointment.meetingLink}
                                        </a>
                                        <button
                                            onClick={() => copyToClipboard(selectedAppointment.meetingLink)}
                                            className={`p-2 rounded-md transition-all duration-200 ${copied
                                                    ? 'bg-blue-100 text-blue-600'
                                                    : 'bg-white text-gray-600 hover:text-blue-600 hover:bg-blue-50 border'
                                                }`}
                                            title={copied ? "Copied!" : "Copy link to clipboard"}
                                        >
                                            {copied ? (
                                                <HiOutlineCheck className="w-4 h-4 " />
                                            ) : (
                                                <HiOutlineClipboardCopy className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                    {/* {copied && (
                                        <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                                            <HiOutlineCheck className="w-4 h-4" />
                                            Link copied to clipboard!
                                        </p>
                                    )} */}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AppointmentListView;