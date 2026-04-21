"use client"
import { DataTable } from "@/components/dataTable/data-table"
import { Button } from "@/components/ui/button"
import { GetAllCustomersApi } from "@/endpoints/getEndpoints"
import type { Customer } from "@/types/customers"
import { Filter, Plus, RefreshCw } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import AddCustomerForm from "../AddCustomerForm"
import CustomerProfile from "../CustomerProfile"
import { customersColumns } from "./columns"

export default function CustomersTable() {
    const [customers, setCustomers] = useState<Customer[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [showAddForm, setShowAddForm] = useState(false)
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)

    const fetchCustomers = async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await GetAllCustomersApi()
            setCustomers(response.data.customers || [])
        } catch (err) {
            console.error("Error fetching customers:", err)
            setError("Failed to fetch customers")
            toast.error("Failed to fetch customers")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCustomers()
    }, [])

    const handleRefresh = () => {
        fetchCustomers()
    }

    const handleAddCustomer = () => {
        setShowAddForm(true)
        setSelectedCustomer(null)
    }

    const handleCustomerClick = (customer: Customer) => {
        setSelectedCustomer(customer)
        setShowAddForm(false)
    }

    const handleBackToTable = () => {
        setShowAddForm(false)
        setSelectedCustomer(null)
        fetchCustomers() // Refresh data when coming back
    }

    const handleCustomerAdded = () => {
        setShowAddForm(false)
        fetchCustomers() // Refresh the table after adding
        toast.success("Customer added successfully!")
    }

    // If showing add form
    if (showAddForm) {
        return <AddCustomerForm onBack={handleBackToTable} onCustomerAdded={handleCustomerAdded} />
    }

    // If showing customer profile
    if (selectedCustomer) {
        return <CustomerProfile customer={selectedCustomer} onBack={handleBackToTable} />
    }

    const columnsWithActions = customersColumns(handleCustomerClick)

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
                <p className="text-red-500">{error}</p>
                <Button onClick={handleRefresh} variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Again
                </Button>
            </div>
        )
    }

    // Default table view
    return (
        <div className="space-y-4">
            {/* Header with controls */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleRefresh}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                    </Button>
                </div>
                <Button onClick={handleAddCustomer}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Customer
                </Button>
            </div>

            {/* Data Table */}
            <DataTable
                columns={columnsWithActions}
                data={customers}
                searchPlaceholder="Customers"
                searchableColumns={["customerName"]}
            />
        </div>
    )
}
