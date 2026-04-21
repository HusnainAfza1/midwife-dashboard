"use client"
import { DataTable } from "@/components/dataTable/data-table"
import { Button } from "@/components/ui/button"
import { Filter, RefreshCw } from "lucide-react"
import { postBirthApprovalsColumns } from "./columns"
import { PostBirthApproval } from "./columns"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { fetchMidwifeNames, fetchUserDetails } from "@/endpoints/postEndpoints"
import { GetPostBirthSchedulesApi } from "@/endpoints/getEndpoints"
import ClientPostbirthPendingAppointments from "@/components/ProjectA/ClientPostBirthPendingAppointments"

const PostBirthApprovalsTable = () => {

    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [pendingApprovals, setPendingApprovals] = useState<PostBirthApproval[]>([])
    const [selectedApproval, setSelectedApproval] = useState<PostBirthApproval | null>(null) // Add this state

    const fetchPendingApprovals = async () => {
        setIsLoading(true)
        setError(null)
        try {
            const response = await GetPostBirthSchedulesApi("pending");
            console.log("this is the response of the ::", response.data)
            if (response.status === 200 && response.data.success) {
                const approvals = response.data.data;

                if (approvals.length === 0) {
                    setPendingApprovals([])
                    return
                }

                // Get unique midwife and client IDs
                const midwifeIds = approvals
                    .map((item: { midwifeId: string }) => item.midwifeId)
                    .filter((value: string, index: number, self: string[]) => self.indexOf(value) === index);

                const clientIds = approvals
                    .map((item: { clientId: string }) => item.clientId)
                    .filter((value: string, index: number, self: string[]) => self.indexOf(value) === index);

                // Fetch both midwife and client details
                const [midwifeData, clientData] = await Promise.all([
                    fetchMidwifeNames(midwifeIds),
                    fetchUserDetails(clientIds)
                ]);

                // Merge data
                const mergedData = approvals.map((approval: { midwifeId: string, clientId: string }) => ({
                    ...approval,
                    midwifeName: midwifeData.data.data[approval.midwifeId] || "Unknown",
                    clientName: clientData.data.data[approval.clientId]?.name || "Unknown Client",
                    clientEmail: clientData.data.data[approval.clientId]?.email || "",
                    clientRole: clientData.data.data[approval.clientId]?.role || "",
                }));
                setPendingApprovals(mergedData);
                toast.success("PostBirth approvals loaded successfully")
            } else {
                setError("Failed to fetch PostBirth approvals")
                toast.error("Failed to fetch PostBirth approvals")
            }
        } catch (err) {
            console.error("Error fetching PostBirth approvals:", err)
            setError("An error occurred while fetching PostBirth approvals")
            toast.error("An error occurred while fetching PostBirth approvals")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchPendingApprovals()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleReviewClick = (approval: PostBirthApproval) => {
        setSelectedApproval(approval)
    }

    // Add handler for going back to table
    const handleBackToTable = () => {
        setSelectedApproval(null)
        fetchPendingApprovals() // Refresh data when coming back
    }

    // If showing appointment details
    if (selectedApproval) {
        return (
            <ClientPostbirthPendingAppointments
                approval={selectedApproval}
                onBack={handleBackToTable}
            />
        )
    }

    // Pass the handler to columns
    const columnsWithActions = postBirthApprovalsColumns(handleReviewClick)
    return (
        <div className="container mx-auto bg-white p-6 rounded-lg">
            <div className="flex justify-between items-center mb-6">
                <div className="flex gap-2">
                    <Button variant="outline" className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        Filter
                    </Button>
                    <Button
                        variant="outline"
                        className="flex items-center gap-2"
                        onClick={fetchPendingApprovals}
                        disabled={isLoading}
                    >
                        <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                        Refresh
                    </Button>
                </div>
            </div>

            {error ? (
                <div className="text-center p-4 text-red-500">
                    {error}
                    <Button variant="link" className="ml-2 text-primary" onClick={fetchPendingApprovals}>
                        Try again
                    </Button>
                </div>
            ) : (
                <DataTable
                    columns={columnsWithActions}
                    data={pendingApprovals}
                    searchPlaceholder="Search schedules (Client Name, Midwife, etc.)..."
                    searchableColumns={["clientName", "midwifeName"]}
                />
            )}
        </div>
    )
}

export default PostBirthApprovalsTable