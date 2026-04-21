"use client"
import { DataTable } from "@/components/dataTable/data-table"
import { Button } from "@/components/ui/button"
import { GetAllMidwivesApi } from "@/endpoints/getEndpoints"
import { DeleteMidwivesApi } from "@/endpoints/deleteEndpoints"
import { Filter, Plus, RefreshCw } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import AddMidwifeForm from "../AddMidwifeForm"
import { ApiMidwife, createMidwifeColumns } from "./columns"

type MidwifeStatusFilter = "All" | "Active" | "Inactive"

const MidwifeTable = () => {
    const [showAddForm, setShowAddForm] = useState(false)
    const [midwives, setMidwives] = useState<ApiMidwife[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [editingMidwife, setEditingMidwife] = useState<ApiMidwife | null>(null)
    const [activeStatusFilter, setActiveStatusFilter] = useState<MidwifeStatusFilter>("All")

    const fetchMidwives = async () => {
        setIsLoading(true)
        setError(null)
        try {
            const response = await GetAllMidwivesApi()
            if (response.status === 200) {
                setMidwives(response.data.data)
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

    // Filter midwives based on active status filter
    const filteredMidwives = midwives.filter(midwife => {
        if (activeStatusFilter === "All") return true;
        if (activeStatusFilter === "Active") return midwife.midwifeStatus === true;
        if (activeStatusFilter === "Inactive") return midwife.midwifeStatus === false;
        return true;
    });

    const handleStatusFilter = (status: MidwifeStatusFilter) => {
        setActiveStatusFilter(status);
    };

    useEffect(() => {
        fetchMidwives()
    }, [])

    const handleAddMidwifeSuccess = () => {
        setShowAddForm(false)
        setEditingMidwife(null)
        fetchMidwives()
        toast.success("Midwife saved successfully")
    }

    const handleEditMidwife = (midwife: ApiMidwife) => {
        setEditingMidwife(midwife)
        setShowAddForm(true)
    }

    const handleDeleteMidwife = (midwife: ApiMidwife) => {
        // Show confirmation toast
        toast.error(`Delete ${midwife.personalInfo.firstName} ${midwife.personalInfo.lastName}?`, {
            action: {
                label: "Confirm",
                onClick: async () => {
                    try {
                        // Call your delete API here - uncomment when you have the API
                        await DeleteMidwivesApi({ id: midwife._id })
                        toast.success("Midwife deleted successfully")
                        fetchMidwives() // Refresh the data
                    } catch (err) {
                        console.error("Error deleting midwife:", err)
                        toast.error("Failed to delete midwife")
                    }
                },
            },
        })
    }      

    const handleStatusChange = () => {
        fetchMidwives() // Refresh the list after status change
        toast.success("Midwife status updated successfully")
    }

    // Create columns with the handlers
    const columns = createMidwifeColumns(handleEditMidwife, handleDeleteMidwife, handleStatusChange)

    if (showAddForm) {
        return (
            <AddMidwifeForm
                onCancel={() => {
                    setShowAddForm(false)
                    setEditingMidwife(null) // Clear editing state
                }}
                onSuccess={handleAddMidwifeSuccess}
                midwifeData={editingMidwife} // Pass the midwife data if editing
            />
        )
    }

    return (
        <div className="container mx-auto bg-white p-6 rounded-lg">
            <div className="flex justify-between items-center mb-6">
                <div className="flex gap-2">
                    <Button variant="outline" className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        Filter
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2" onClick={fetchMidwives} disabled={isLoading}>
                        <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                        Refresh
                    </Button>
                </div>
                <Button className="flex items-center gap-2" onClick={() => setShowAddForm(true)}>
                    <Plus className="h-4 w-4" />
                    Add New Midwife
                </Button>
            </div>

            <div className="mb-6">
                <div className="flex space-x-2 border-b">
                    <Button 
                        variant="ghost" 
                        className={`rounded-none ${activeStatusFilter === "All" ? "border-b-2 border-primary" : ""}`}
                        onClick={() => handleStatusFilter("All")}
                    >
                        All Midwives
                    </Button>
                    <Button 
                        variant="ghost" 
                        className={`rounded-none ${activeStatusFilter === "Active" ? "border-b-2 border-primary" : ""}`}
                        onClick={() => handleStatusFilter("Active")}
                    >
                        Active
                    </Button>
                    <Button 
                        variant="ghost" 
                        className={`rounded-none ${activeStatusFilter === "Inactive" ? "border-b-2 border-primary" : ""}`}
                        onClick={() => handleStatusFilter("Inactive")}
                    >
                        Inactive
                    </Button>
                </div>
            </div>

            {error ? (
                <div className="text-center p-4 text-red-500">
                    {error}
                    <Button variant="link" className="ml-2 text-primary" onClick={fetchMidwives}>
                        Try again
                    </Button>
                </div>
            ) : (
                <DataTable
                    columns={columns}
                    data={filteredMidwives}  /* Using filtered data instead of all midwives */
                    searchPlaceholder="Search Midwives..."
                    searchableColumns={["name"]} // Optional: specify which columns to search
                />
            )}
        </div>
    )
}

export default MidwifeTable