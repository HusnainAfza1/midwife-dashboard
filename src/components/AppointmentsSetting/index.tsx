"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { GetScheduleApi } from "@/endpoints/getEndpoints";
import { ScheduleAppointment } from "@/types/appointments";
import { FaPlus, FaRegEdit, FaTrash } from "react-icons/fa";
import { INITIAL_AVAILABILITY_DATA } from "@/config/constants";
import { CreateUpdateScheduleApi } from "@/endpoints/postEndpoints";
import { GetSpecificUserScheduleApi } from "@/endpoints/getEndpoints";
import { CreateUpdateSpecificUserScheduleApi } from "@/endpoints/postEndpoints";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { convertTo24HourTime } from "@/lib/utils";

const timeSlots = Array.from({ length: 24 }, (_, i) =>
  new Date(0, 0, 0, i).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
);

const AppointmentSetting = ({
  existingSchedule = null,
  salesPersonId,
}: {
  existingSchedule?: null | ScheduleAppointment[];
  salesPersonId?: string;
}) => {
  const [availabilityData, setAvailabilityData] = useState(
    existingSchedule || INITIAL_AVAILABILITY_DATA
  );
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [startHour, setStartHour] = useState<string | null>("08:00 AM");
  const [endHour, setEndHour] = useState<string | null>("05:00 PM");
  const [offDay, setOffDay] = useState(false);

  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);
  const [isUnavailabilityModalOpen, setIsUnavailabilityModalOpen] =
    useState(false);
  const [unavailableSlots, setUnavailableSlots] = useState<
    { from: string; to: string }[]
  >([]);

  const formatTimeTo12Hour = (time: string) => {
    // Split the input time into hours and minutes
    const [hour, minute] = time.split(":").map((num) => parseInt(num));

    // Determine if it's AM or PM
    const period = hour >= 12 ? "PM" : "AM";

    // Convert 24-hour time to 12-hour time
    const formattedHour = hour % 12 || 12; // Convert hour 0 to 12 for AM
    const formattedMinute = minute.toString().padStart(2, "0"); // Ensure two digits for minute

    // Format the time
    const formattedTime = `${String(formattedHour).padStart(
      2,
      "0"
    )}:${formattedMinute} ${period}`;

    return formattedTime;
  };
  const formatTimesInArray = (timeArray: {
    from: string,
    to: string
  }[]) => {
    return timeArray.map((item) => ({
      from: item.from ? formatTimeTo12Hour(item.from) : item.from,
      to: item.to ? formatTimeTo12Hour(item.to) : item.to,
    }));
  };

  const FetchSchedule = () => {
    const apiCall = salesPersonId ? GetSpecificUserScheduleApi({ id: salesPersonId }) : GetScheduleApi();

    apiCall
      .then((response) => {
        const formattedData: ScheduleAppointment[] = response.data.data.map(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (item: any) => ({
            day: item.day,
            startHour: item.startHour ? formatTimeTo12Hour(item.startHour) : item.startHour,
            endHour: item.endHour ? formatTimeTo12Hour(item.endHour) : item.endHour,
            repeats: item.repeats,
            offDay: item.offDay,
            unavailableSlots: formatTimesInArray(item.unavailableSlots),
          })
        );

        setAvailabilityData(formattedData);
        toast(response.data.message);

        console.log("formattedData");
        console.log(formattedData);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    FetchSchedule();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // GetSpecificUserScheduleApi

  const handleUpdate = () => {
    setAvailabilityData((prevData) =>
      prevData.map((slot) =>
        slot.day === selectedDay
          ? {
            ...slot,
            startHour: offDay ? null : startHour,
            endHour: offDay ? null : endHour,
            offDay,
            unavailableSlots: [],
          }
          : slot
      )
    );

    // Reset local state for unavailable slots
    setUnavailableSlots([]);

    setIsAvailabilityModalOpen(false);
  };

  const handleStartHourChange = (value: string) => {
    setStartHour(value);
    const startIndex = timeSlots.indexOf(value);
    setEndHour(timeSlots[startIndex + 1] || value);

    // Reset unavailable slots when start hour changes
    setUnavailableSlots([]);
  };

  const handleAddUnavailableSlot = () => {
    const newSlot = { from: "", to: "" };
    setUnavailableSlots([...unavailableSlots, newSlot]);
  };

  const handleUpdateUnavailability = () => {
    const validationResults = unavailableSlots.map((slot, index) => {
      if (!slot.from || !slot.to) {
        return {
          status: false,
          description: "Both 'From' and 'To' times must be selected.",
        };
      }
      return validateUnavailableSlot(slot.from, slot.to, index);
    });

    const isValid = validationResults.every((result) => result.status);

    if (isValid) {
      setAvailabilityData((prevData) =>
        prevData.map((slot) =>
          slot.day === selectedDay ? { ...slot, unavailableSlots } : slot
        )
      );
      setIsUnavailabilityModalOpen(false);
    } else {
      // Display the first error message encountered
      const firstError = validationResults.find((result) => !result.status);
      toast.error(
        firstError?.description || "Invalid slots. Please check your inputs."
      );
    }
  };

  const handleRemoveUnavailableSlot = (index: number) => {
    setUnavailableSlots(unavailableSlots.filter((_, i) => i !== index));
  };

  const handleSaveSchedule = () => {
    console.log("Schedule saved:", availabilityData);
    const apiCall = salesPersonId ? CreateUpdateSpecificUserScheduleApi({ userId: salesPersonId, schedule: availabilityData }) : CreateUpdateScheduleApi({ schedule: availabilityData });

    // CreateUpdateScheduleApi({ schedule: availabilityData })  
    apiCall
      .then((response) => {
        toast(response.data.message);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const validateUnavailableSlot = (
    from: string,
    to: string,
    currentIndex: number
  ) => {
    // Ensure both `from` and `to` are selected
    if (!from || !to) {
      return {
        status: false,
        description: "Both 'From' and 'To' times must be selected.",
      };
    }

    const startIndex = timeSlots.indexOf(startHour || "08:00 AM");
    const endIndex = timeSlots.indexOf(endHour || "05:00 PM");
    const fromIndex = timeSlots.indexOf(from);
    const toIndex = timeSlots.indexOf(to);

    // Check if `from` is after `to`
    if (fromIndex >= toIndex) {
      return {
        status: false,
        description: "'From' time must be before 'To' time.",
      };
    }

    // Check if the slot is within working hours
    if (fromIndex < startIndex || toIndex > endIndex) {
      return {
        status: false,
        description: "Unavailable slot must be within working hours.",
      };
    }

    for (let i = 0; i < unavailableSlots.length; i++) {
      const slot = unavailableSlots[i];
      if (i === currentIndex || !slot.from || !slot.to) continue; // Skip current or incomplete

      const slotFromIndex = timeSlots.indexOf(slot.from);
      const slotToIndex = timeSlots.indexOf(slot.to);

      // Check for overlap
      if (
        (fromIndex >= slotFromIndex && fromIndex < slotToIndex) ||
        (toIndex > slotFromIndex && toIndex <= slotToIndex) ||
        (fromIndex <= slotFromIndex && toIndex >= slotToIndex)
      ) {
        return {
          status: false,
          description: "Unavailable slots must not overlap.",
        };
      }
    }

    return { status: true };
  };

  return (
    <div>
      {/* Availability Table */}
      <div className="bg-white p-6 rounded-lg shadow">
        <Table className="w-full border-collapse">
          <TableHeader>
            <TableRow className="border-b border-gray-300 hover:bg-white">
              <TableHead className="">Day</TableHead>
              <TableHead className="">Start Hour</TableHead>
              <TableHead className="">End Hour</TableHead>
              <TableHead className="text-center">Set Availability</TableHead>
              <TableHead className="text-center">Unavailable Slots</TableHead>
              <TableHead className="text-center">Set Unavailability</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {availabilityData.map((slot, index) => (
              <TableRow key={index} className="border-b border-gray-200">
                <TableCell className="">{slot.day}</TableCell>
                <TableCell>{slot.offDay ? "None" : convertTo24HourTime(slot.startHour)}</TableCell>
                <TableCell>{slot.offDay ? "None" : convertTo24HourTime(slot.endHour)}</TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedDay(slot.day);
                      setStartHour(slot.startHour || "08:00 AM");
                      setEndHour(slot.endHour || "05:00 PM");
                      setOffDay(slot.offDay);
                      setIsAvailabilityModalOpen(true);
                    }}
                  >
                    <FaRegEdit className="h-4 w-4 text-blue-600" />
                  </Button>
                </TableCell>
                <TableCell className="text-center">
                  {slot.unavailableSlots.length > 0
                    ? slot.unavailableSlots.map((s, i) => (
                      <div key={i}>
                        {convertTo24HourTime(s.from)} - {convertTo24HourTime(s.to)}
                      </div>
                    ))
                    : "None"}
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const selectedSlot = availabilityData.find(
                        (s) => s.day === slot.day
                      );
                      setSelectedDay(slot.day);
                      setStartHour(selectedSlot?.startHour || "08:00 AM");
                      setEndHour(selectedSlot?.endHour || "05:00 PM");
                      setUnavailableSlots(selectedSlot?.unavailableSlots || []);
                      setIsUnavailabilityModalOpen(true);
                    }}
                  >
                    <FaRegEdit className="h-4 w-4 text-blue-600" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-6 w-full flex justify-end">
        <Button onClick={handleSaveSchedule}>Save Schedule</Button>
      </div>

      {/* Edit Availability Modal */}
      <Dialog
        open={isAvailabilityModalOpen}
        onOpenChange={setIsAvailabilityModalOpen}
      >
        <DialogContent className="bg-white p-6 rounded-lg shadow-lg w-96">
          <DialogTitle className="text-lg font-semibold text-blue-900 mb-4">
            Edit {selectedDay}&apos;s Availability
          </DialogTitle>
          <div className="mb-4 flex items-center gap-2">
            <Checkbox
              checked={offDay}
              onCheckedChange={(checked) => {
                setOffDay(!!checked);
                if (checked) {
                  setEndHour(null); // Reset end hour if off day
                }
              }}
            />
            <span className="text-gray-600 text-sm">Off Day</span>
          </div>

          {!offDay && (
            <>
              <label className="text-gray-600 text-sm">Start Time</label>
              <Select
                value={startHour ?? ""}
                onValueChange={handleStartHourChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <label className="text-gray-600 text-sm">End Time</label>
              <Select value={endHour ?? ""} onValueChange={setEndHour}>
                <SelectTrigger>
                  <SelectValue placeholder={endHour} />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time, index) => (
                    <SelectItem
                      key={time}
                      value={time}
                      disabled={
                        startHour
                          ? index <= timeSlots.indexOf(startHour)
                          : false
                      }
                    >
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          )}

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsAvailabilityModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdate}>Update</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Set Unavailability Modal */}
      <Dialog
        open={isUnavailabilityModalOpen}
        onOpenChange={setIsUnavailabilityModalOpen}
      >
        <DialogContent className="bg-white p-6 rounded-lg shadow-lg w-96">
          <DialogTitle>Set Unavailability for {selectedDay}</DialogTitle>
          {unavailableSlots.map((slot, index) => (
            <div key={index} className="flex gap-2 items-center mt-2">
              {/* From Time Selector */}
              <Select
                value={slot.from}
                onValueChange={(value) => {
                  const updatedSlots = [...unavailableSlots];
                  updatedSlots[index].from = value;

                  // Reset `to` time if it's no longer valid
                  if (
                    slot.to &&
                    timeSlots.indexOf(slot.to) <= timeSlots.indexOf(value)
                  ) {
                    updatedSlots[index].to = "";
                  }

                  setUnavailableSlots(updatedSlots);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select start time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots
                    .filter((time) => {
                      const startIndex = timeSlots.indexOf(
                        startHour || "08:00 AM"
                      );
                      const endIndex = timeSlots.indexOf(endHour || "05:00 PM");
                      const currentIndex = timeSlots.indexOf(time);
                      return (
                        currentIndex >= startIndex && currentIndex < endIndex
                      );
                    })
                    .map((time) => (
                      <SelectItem key={time} value={time}>
                        {convertTo24HourTime(time)}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              {/* To Time Selector (Disabled if "From" is not selected) */}
              <Select
                value={slot.to}
                onValueChange={(value) => {
                  const updatedSlots = [...unavailableSlots];
                  updatedSlots[index].to = value;
                  setUnavailableSlots(updatedSlots);
                }}
                disabled={!slot.from} // Disable if "From" is not selected
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select end time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots
                    .filter((time) => {
                      if (!slot.from) return false; // Prevents selection if "From" is not set
                      const fromIndex = timeSlots.indexOf(slot.from);
                      const currentIndex = timeSlots.indexOf(time);
                      const endIndex = timeSlots.indexOf(endHour || "05:00 PM");
                      return (
                        currentIndex > fromIndex && // Ensure "To" is after "From"
                        currentIndex <= endIndex // Ensure within working hours
                      );
                    })
                    .map((time) => (
                      <SelectItem key={time} value={time}>
                        {convertTo24HourTime(time)}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              {/* Remove Slot Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveUnavailableSlot(index)}
              >
                <FaTrash className="h-4 w-4 text-red-600" />
              </Button>
            </div>
          ))}

          <Button
            variant="outline"
            onClick={handleAddUnavailableSlot}
            className="mt-2"
          >
            <FaPlus className="mr-1" /> Add Slot
          </Button>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsUnavailabilityModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateUnavailability}>Update</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppointmentSetting;
