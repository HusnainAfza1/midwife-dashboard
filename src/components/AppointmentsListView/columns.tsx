"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { IoIosArrowForward } from "react-icons/io";
import { Appointment } from "@/types";
import Link from "next/link";
import { convertTo24HourTime } from "@/lib/utils";
import { parseLocaleDate } from "@/utils/date";

// Pass isUpcoming flag to determine whether to include the Zoom Link column
export const getColumns = (
  setSelectedAppointment: (appointment: Appointment) => void,
  isUpcoming: boolean,
  userRole: string
): ColumnDef<Appointment>[] => {
  const columns: ColumnDef<Appointment>[] = [
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Submission Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) =>
        new Date(row.original.createdAt).toLocaleDateString("en-GB", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
        }),
      sortingFn: (rowA, rowB) => {
        const dateA = new Date(rowA.original.createdAt).getTime();
        const dateB = new Date(rowB.original.createdAt).getTime();
        return dateA - dateB;
      },
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Midwife Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "date",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Meeting Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => row.original.selectedDate || "-",
      sortingFn: (rowA, rowB) => {
        if (!rowA.original.selectedDate) return 1; // Handle empty values
        if (!rowB.original.selectedDate) return -1;
        const dateA = parseLocaleDate(rowA.original.selectedDate).getTime();
        const dateB = parseLocaleDate(rowB.original.selectedDate).getTime();
        return dateA - dateB;
      },
    },
    {
      accessorKey: "time",
      header: "Meeting Time",
      cell: ({ row }) => convertTo24HourTime(row.original.startTime) || "-",
    },
    {
      accessorKey: "phone",
      header: "Phone Number",
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => {
        const appointment = row.original;
        return (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedAppointment(appointment)}
          >
            <IoIosArrowForward className="h-4 w-4 text-blue-600" />
          </Button>
        );
      },
    },
  ];
  // Add SalesPerson column for superusers
  if (userRole === "superuser") {
    columns.splice(2, 0, {
      accessorKey: "username",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Assigned to
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => row.original.username || "-",
    });
  }

  // Conditionally add the "Zoom Link" column **only for upcoming appointments**
  if (isUpcoming) {
    columns.splice(5, 0, {
      accessorKey: "meetng_link",
      header: "Meeting Link",
      cell: ({ row }) =>
        row.original.meetingLink ? (
          <Link
            href={row.original.meetingLink}
            className="text-blue-600 underline"
            target="_blank"
          >
            Join Now
          </Link>
        ) : (
          "-"
        ),
    });
  }

  return columns;
};
