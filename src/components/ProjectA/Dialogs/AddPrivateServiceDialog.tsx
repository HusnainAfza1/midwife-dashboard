"use client"

import React, { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { toast } from "sonner";

// Using the same data structure for both course and private service for consistency
interface PrivateServiceData {
    id: string;
    name: string;
    tagline: string;
    type: string;
    duration: string;
    appointments: string;
    turnover: string;
}

interface AddPrivateServiceDialogProps {
    trigger?: React.ReactNode;
    onSave: (service: PrivateServiceData) => void;
}

const AddPrivateServiceDialog: React.FC<AddPrivateServiceDialogProps> = ({
    trigger,
    onSave
}) => {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<PrivateServiceData>({
        id: `service-${Date.now()}`,
        name: "",
        tagline: "",
        type: "",
        duration: "",
        appointments: "",
        turnover: ""
    });

    const handleChange = (field: keyof PrivateServiceData, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    // Ensure only numbers and one comma in turnover
    const handleTurnoverChange = (value: string) => {
        // Allow only numbers and at most one comma
        const regex = /^[0-9]*(?:,[0-9]*)?$/;
        if (regex.test(value) || value === "") {
            handleChange("turnover", value);
        }
    };

    // Ensure only numbers in appointments
    const handleAppointmentsChange = (value: string) => {
        // Allow only numbers
        const regex = /^[0-9]*$/;
        if (regex.test(value) || value === "") {
            handleChange("appointments", value);
        }
    };

    const handleSubmit = () => {
        // Validation for all required fields
        const requiredFields: (keyof PrivateServiceData)[] = ['name', 'tagline', 'type', 'duration'];
        const fieldLabels: Record<keyof PrivateServiceData, string> = {
            id: 'ID',
            name: 'Name',
            tagline: 'Tagline',
            type: 'Type',
            duration: 'Duration',
            appointments: 'Appointments',
            turnover: 'Turnover'
        };
        
        // Check all required fields
        for (const field of requiredFields) {
            if (!formData[field] || formData[field].trim() === '') {
                toast.error(`${fieldLabels[field]} is required`);
                return;
            }
        }

        // Generate a new ID before saving to ensure uniqueness
        const serviceToSave = {
            ...formData,
            id: `service-${Date.now()}`
        };

        // Save the service data
        onSave(serviceToSave);
        
        // Reset form and close dialog
        setFormData({
            id: `service-${Date.now()}`,
            name: "",
            tagline: "",
            type: "",
            duration: "",
            appointments: "",
            turnover: ""
        });
        setOpen(false);

        toast.success("New private service has been added successfully");
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || <Button variant="ghost" size="sm" className="text-xs">Add New Private Service</Button>}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Add New Private Service</DialogTitle>
                    <DialogDescription>
                        Enter the details for the new private service you want to offer.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name*
                        </Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            className="col-span-3"
                            placeholder="e.g., Initial Prenatal Consultation"
                        />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="tagline" className="text-right">
                            Tagline*
                        </Label>
                        <Input
                            id="tagline"
                            value={formData.tagline}
                            onChange={(e) => handleChange("tagline", e.target.value)}
                            className="col-span-3"
                            placeholder="e.g., Comprehensive first visit for expectant mothers"
                        />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="type" className="text-right">
                            Type*
                        </Label>
                        <Select
                            value={formData.type}
                            onValueChange={(value) => handleChange("type", value)}
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select service type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="In persona">In persona</SelectItem>
                                <SelectItem value="Videocall">Videocall</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="duration" className="text-right">
                            Duration*
                        </Label>
                        <Select 
                            value={formData.duration}
                            onValueChange={(value) => handleChange("duration", value)}
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="20">20 min</SelectItem>
                                <SelectItem value="30">30 min</SelectItem>
                                <SelectItem value="40">40 min</SelectItem>
                                <SelectItem value="50">50 min</SelectItem>
                                <SelectItem value="60">60 min</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="appointments" className="text-right">
                            Appointments
                        </Label>
                        <Input
                            id="appointments"
                            value={formData.appointments}
                            onChange={(e) => handleAppointmentsChange(e.target.value)}
                            className="col-span-3"
                            placeholder="e.g., 1 (appointment slot per session)"
                        />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="turnover" className="text-right">
                            Turnover
                        </Label>
                        <Input
                            id="turnover"
                            value={formData.turnover}
                            onChange={(e) => handleTurnoverChange(e.target.value)}
                            className="col-span-3"
                            placeholder="e.g., 150,00"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button type="submit" onClick={handleSubmit}>
                        Save Service
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddPrivateServiceDialog;