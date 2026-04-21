"use client"
import { DataTable } from "@/components/dataTable/data-table"
import { Button } from "@/components/ui/button"
import { Filter, Plus } from "lucide-react"
import { paymentColumns } from "./columns"

// Sample payments data
const PAYMENTS_DATA = [
    {
        id: 1,
        clientName: "Client Name",
        midwifeName: "Midwife Name",
        amount: "€180",
        date: "15-05-2025",
        status: "Paid",
    },
    {
        id: 2,
        clientName: "Client Name 2",
        midwifeName: "Midwife Name 2",
        amount: "€220",
        date: "16-05-2025",
        status: "Pending",
    },
    {
        id: 3,
        clientName: "Client Name 3",
        midwifeName: "Midwife Name 3",
        amount: "€150",
        date: "17-05-2025",
        status: "Paid",
    },
]

const PaymentsTable = () => {
    return (
        <div className="container mx-auto bg-white p-6 rounded-lg">
            <div className="flex justify-between items-center mb-6">
                <div className="flex gap-2">
                    <Button variant="outline" className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        Filter
                    </Button>
                </div>
                <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add New Payment
                </Button>
            </div>

            <div className="mb-6">
                <div className="flex space-x-2 border-b">
                    <Button variant="ghost" className="border-b-2 border-primary rounded-none">
                        All Payments
                    </Button>
                    <Button variant="ghost" className="rounded-none">
                        Paid
                    </Button>
                    <Button variant="ghost" className="rounded-none">
                        Pending
                    </Button>
                    <Button variant="ghost" className="rounded-none">
                        Failed
                    </Button>
                </div>
            </div>

            <DataTable columns={paymentColumns} data={PAYMENTS_DATA} searchPlaceholder="Payments" searchableColumns={["clientName"]} />
        </div>
    )
}

export default PaymentsTable;
