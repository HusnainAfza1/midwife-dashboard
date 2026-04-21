"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "lucide-react";
import { SalesPerson } from "@/types";
import { INITIAL_AVAILABILITY_DATA } from "@/config/constants";
import AppointmentSetting from "../AppointmentsSetting";

const ViewScheduleDialog = ({ salesPerson }: { salesPerson: SalesPerson }) => {   
  console.log("salesPerson");
      console.log(salesPerson);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <Calendar size={20} />
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-full md:min-w-[80%] rounded-lg">
        <DialogHeader>
          <DialogTitle>{salesPerson.name}&apos;s Schedule</DialogTitle>
        </DialogHeader>
        <AppointmentSetting 
        existingSchedule={INITIAL_AVAILABILITY_DATA} 
      salesPersonId={salesPerson.id} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default ViewScheduleDialog;
