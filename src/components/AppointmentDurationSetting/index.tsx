import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "../ui/button";
import { toast } from "sonner";

const AppointmentDuration = () => {
    const options = [
        { label: "30 mins", value: 30 },
        { label: "45 mins", value: 45 },
        { label: "60 mins", value: 60 },
    ];

    const [selectedTime, setSelectedTime] = useState<{ label: string, value: number | null }>({ label: "", value: null });

    // Fetch the current duration on mount
    useEffect(() => {
        const fetchDuration = async () => {
            try {
                const res = await fetch("/api/public/duration");
                const data = await res.json();
                if (data.success) {
                    const selected = options.find(option => option.value === data.duration);
                    if (selected) {
                        setSelectedTime(selected);
                    }
                }
            } catch (error) {
                console.error("Error fetching duration:", error);
            }
        };

        fetchDuration();
        // eslint-disable-next-line
    }, []);

    const handleSave = async () => {
        try {
            const res = await fetch("/api/public/duration", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ duration: selectedTime.value }),
            });

            const data = await res.json();
            if (data.success) {
                toast(
                    "Success", {
                    description: "Slot duration updated successfully."
                })
            }
        } catch (error) {
            toast(
                "Error", {
                description: "Error updating slot duration."
            })
            console.error("Error updating duration:", error);
        }
    };

    return (
        <div className="flex flex-col gap-5 mb-10 ">
            <h2 className="text-lg font-semibold text-blue-900">Slot Duration</h2>
            <div className="flex gap-5 ml-1">
                <div className="w-[150px] bg-white">
                    <Select
                        value={selectedTime.value?.toString()}
                        onValueChange={(value) => {
                            const selected = options.find((option) => option.value === parseInt(value));
                            if (selected) {
                                setSelectedTime(selected);
                            }
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Time" />
                        </SelectTrigger>
                        <SelectContent>
                            {options.map((option) => (
                                <SelectItem key={option.value} value={option.value.toString()}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <Button onClick={handleSave} disabled={selectedTime.value == null}>Update</Button>
            </div>
        </div>
    );
};

export default AppointmentDuration;