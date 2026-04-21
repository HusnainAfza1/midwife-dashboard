// components/dashboard/calendar-view.tsx  
"use client"
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function CalendarView() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [month, setMonth] = useState("April");
  const [year, setYear] = useState("2021");
  
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Select value={month} onValueChange={setMonth}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="April">April</SelectItem>
            {/* Add other months */}
          </SelectContent>
        </Select>
        
        <Select value={year} onValueChange={setYear}>
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2021">2021</SelectItem>
            {/* Add other years */}
          </SelectContent>
        </Select>
      </div>
      
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border shadow"
      />
    </div>
  );
}