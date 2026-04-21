"use client"
import { DataTable } from "@/components/dataTable/data-table"
import { Button } from "@/components/ui/button"
import { Filter, RefreshCw } from "lucide-react"
import { bookingColumns } from "./columns"
import { useState, useEffect } from "react"
import { leads } from "@/types/leads"
import { toast } from "sonner"
import { GetMidiwfeA1BookingsApi } from "@/endpoints/getEndpoints"
import { fetchMidwifeNames } from "@/endpoints/postEndpoints"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type StatusFilter = "All" | "Confirmed" | "Pending" | "Cancelled"

const BookingsTable = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null)
    const [leads, setLeads] = useState<leads[]>([])
    const [activeStatusFilter, setActiveStatusFilter] = useState<StatusFilter>("All")
    const [selectedMidwife, setSelectedMidwife] = useState<string>("All Midwives")

    // Get unique midwife names from leads data
    const uniqueMidwives = ["All Midwives", ...Array.from(new Set(leads.map(lead => lead.midwifeName)))]

   const fetchLeads = async () => {
    setIsLoading(true)
    setError(null)
    try {
        const response = await GetMidiwfeA1BookingsApi("pending,cancelled");
        if (response.status === 200) {
            const bookings = response.data.data;
            
            // If no bookings, set empty leads and return
            if (!bookings || bookings.length === 0) {
                setLeads([]);
                return;
            }

            const ids = bookings.map((item: { midwifeId: string }) => item.midwifeId);

            console.log("these are the ids::", ids);

            const idsData = await fetchMidwifeNames(ids);

            const mergedData = bookings.map((booking: { midwifeId: string }) => ({
                ...booking,
                midwifeName: idsData.data.data[booking.midwifeId] || "Unknown",
            }));

            setLeads(mergedData);
        } else {
            setError("Failed to fetch midwives")
            toast.error("Failed to fetch midwives")
        }
    } catch (err) {
        console.error("Error fetching midwives:", err)
        setError("An error occurred while fetching midwives")
        toast.error("An error occurred while fetching midwives")
    } finally {
        setIsLoading(false)
    }
}

    // Filter leads based on active status filter
    const filteredLeads = leads.filter(lead => {
        // Status filter
        const statusMatch = activeStatusFilter === "All" ||
            lead.status?.toLowerCase() === activeStatusFilter.toLowerCase();

        // Midwife filter
        const midwifeMatch = selectedMidwife === "All Midwives" ||
            lead.midwifeName === selectedMidwife;

        return statusMatch && midwifeMatch;
    });

    const handleStatusFilter = (status: StatusFilter) => {
        setActiveStatusFilter(status);
    };

    const handleMidwifeFilter = (midwifeName: string) => {
        setSelectedMidwife(midwifeName);
    };

    useEffect(() => {
        fetchLeads()
    }, [])

    return (
        <div className="container mx-auto bg-white p-6 rounded-lg">
            <div className="flex justify-between items-center mb-6">
                <div className="flex gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="flex items-center gap-2">
                                <Filter className="h-4 w-4" />
                                {selectedMidwife}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-56">
                            {uniqueMidwives.map((midwifeName) => (
                                <DropdownMenuItem
                                    key={midwifeName}
                                    onClick={() => handleMidwifeFilter(midwifeName)}
                                    className={selectedMidwife === midwifeName ? "bg-accent" : ""}
                                >
                                    {midwifeName}
                                    {selectedMidwife === midwifeName && (
                                        <span className="ml-auto">✓</span>
                                    )}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button variant="outline" className="flex items-center gap-2" onClick={fetchLeads} disabled={isLoading}>
                        <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                        Refresh
                    </Button>
                </div>
            </div>

            <div className="mb-6">
                <div className="flex space-x-2 border-b">
                    <Button
                        variant="ghost"
                        className={`rounded-none ${activeStatusFilter === "All" ? "border-b-2 border-primary" : ""}`}
                        onClick={() => handleStatusFilter("All")}
                    >
                        All Leads
                    </Button>
                    {/* <Button
                        variant="ghost"
                        className={`rounded-none ${activeStatusFilter === "Confirmed" ? "border-b-2 border-primary" : ""}`}
                        onClick={() => handleStatusFilter("Confirmed")}
                    >
                        Confirmed
                    </Button> */}
                    <Button
                        variant="ghost"
                        className={`rounded-none ${activeStatusFilter === "Pending" ? "border-b-2 border-primary" : ""}`}
                        onClick={() => handleStatusFilter("Pending")}
                    >
                        Pending
                    </Button>
                    <Button
                        variant="ghost"
                        className={`rounded-none ${activeStatusFilter === "Cancelled" ? "border-b-2 border-primary" : ""}`}
                        onClick={() => handleStatusFilter("Cancelled")}
                    >
                        Cancelled
                    </Button>
                </div>
            </div>

            {error ? (
                <div className="text-center p-4 text-red-500">
                    {error}
                    <Button variant="link" className="ml-2 text-primary" onClick={fetchLeads}>
                        Try again
                    </Button>
                </div>
            ) : (
                <DataTable
                    columns={bookingColumns}
                    data={filteredLeads}  /* Using filtered data instead of all leads */
                    pageSize={10}
                    searchPlaceholder="Search Leads (Client Name, midwife, etc.)..."
                    searchableColumns={["fullName", "midwifeName"]}
                />
            )}
        </div>
    )
}

export default BookingsTable