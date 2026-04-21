import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const convertTo24HourTime = (timeStr: string | null): string => {
  if (!timeStr) return "";
  const [time, modifier] = timeStr.split(" "); // Split the time and AM/PM
  const [hours, minutes] = time.split(":").map(Number); // Split hours and minutes

  let hours24 = hours;

  if (modifier === "AM" && hours === 12) {
    hours24 = 0; // 12 AM is 00 in 24-hour format
  } else if (modifier === "PM" && hours !== 12) {
    hours24 = hours + 12; // Convert PM time to 24-hour time
  }

  return `${String(hours24).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};  