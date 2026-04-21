"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { SalesPerson } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import DeleteSalesPerson from "./DeleteSalesPerson";
import EditSalesPerson from "./EditSalesPerson";
import ViewScheduleDialog from "./ViewScheduleDialog";

export const columns: ColumnDef<SalesPerson>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "S.No",
    cell: ({ row }) => <Label>{row.index + 1}</Label>,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Sales Person Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    id: "view-schedule",
    header: "View Schedule",
    cell: ({ row }) => {
      const salesPerson = row.original;
      return <ViewScheduleDialog salesPerson={salesPerson} />;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <div className="flex gap-x-4 items-center pl-4">
          <EditSalesPerson salesPerson={row.original} />
          <DeleteSalesPerson salesPerson={row.original} />
        </div>
      );
    },
  },
];
