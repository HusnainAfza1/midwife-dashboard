"use client"
import Image from "next/image"
import avatar from "@/assets/Avatar.png"
import { leads } from "@/types/leads"
import { MoreVertical } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { MidwifeActionsMenu } from "../MidwifeActionsMenu"
import { LeadsDetails } from "@/components/ProjectA/LeadsDetails"  
import {ClientDetails} from "@/components/ProjectA/clientDetails"
import type { Customer } from "@/types/customers"
import type { ColumnDef } from "@tanstack/react-table"
import type { AddMidwifeFormData } from "@/types/addMidwifes"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Edit, Eye, MoreHorizontal, Trash2, Calendar, Clock } from "lucide-react"

// Define the API Midwife type
export interface ApiMidwife extends AddMidwifeFormData {
    _id: string
    createdAt: string
    updatedAt: string
}

// Define the columns for the midwife table
export const createMidwifeColumns = (
    onEditMidwife: (midwife: ApiMidwife) => void,
    onDeleteMidwife: (midwife: ApiMidwife) => void,
    onStatusChangeMidwife: (midwife: ApiMidwife) => void
): ColumnDef<ApiMidwife>[] => [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
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
            accessorFn: (row) => `${row.personalInfo.firstName} ${row.personalInfo.lastName}`,
            id: "name",
            header: "Midwives",
            cell: ({ row }) => {
                const midwife = row.original
                const name = `${midwife.personalInfo.firstName} ${midwife.personalInfo.lastName}`
                return (
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full overflow-hidden">
                            <Image
                                src={midwife.personalInfo.profileImage?.url || avatar.src}
                                alt={name}
                                width={40}
                                height={40}
                                className="object-cover"
                            />
                        </div>
                        <span className="font-medium">{name}</span>
                    </div>
                )
            },
        },
        {
            accessorFn: (row) => row.personalInfo.address || "N/A",
            id: "location",
            header: "Location",
        },
        {
            accessorFn: (row) => row.personalInfo.serviceRadius ? `${row.personalInfo.serviceRadius} km` : "N/A",
            id: "serviceRadius",
            header: "Service Radius",
        },
        {
            accessorFn: () => 0,
            id: "activeClients",
            header: "Number of Active Clients",
        },
        {
            accessorKey: "profile-status",
            header: "Profile Status",
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            cell: ({ row }) => {
                // Default to "Active" status for now
                const status = row.original.isProfileComplete
                return (
                    <Badge variant="default" className={status ? "text-green-800 bg-green-100 hover:bg-green-200" : "bg-red-100 text-red-800 hover:bg-red-200"}>
                        {status ? "Complete" : "Incomplete"}
                    </Badge>
                )
            },
        },
        {
            accessorKey: "midwife-status",
            header: "Midwife Status",
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            cell: ({ row }) => {
                // const midwifeStatus: string =  "Inactive" // Default to "Active" status for now
                const midwifeStatus = row.original.midwifeStatus
                // const status = midwifeStatus === "Active" ? true : false
                return (
                    <Badge variant="default" className={midwifeStatus ? "text-green-800 bg-green-100 hover:bg-green-200" : "bg-red-100 text-red-800 hover:bg-red-200"}>
                        • {midwifeStatus ? "Active" : "Inactive"}
                    </Badge>
                )
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const midwife = row.original;
                return (
                    <MidwifeActionsMenu
                        midwife={midwife}
                        onEdit={onEditMidwife}
                        onDelete={onDeleteMidwife}
                        onStatusChange={() => onStatusChangeMidwife(midwife)}
                    />
                );
            }
        },
    ]

// Define the Booking type
// export interface leads {
//     _id : string,
//     userId :string, 
//     midwifeId :string, 
//     fullName :string, 
//     email :string, 
//     phoneNumber :string,   
//     insuranceNumber :string, 
//     insuranceCompany :string,
//     insuranceType :string,
//     date :string,
//     expectedDeliveryDate:string, 
//     selectedAddressDetails :object,
//     selectedSlot: string,
//     status :string


// }

// Define the columns for the bookings table
export const bookingColumns: ColumnDef<leads>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
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
        accessorKey: "fullName",
        header: "Client Name",
    },
    {
        accessorKey: "midwifeName",
        header: "midwife Name",
    },
    {
        accessorKey: "date",
        header: "Date",
    },
    {
        accessorKey: "selectedSlot",
        header: "Time",
        cell: ({ row }) => {
            const timeSlot = row.original.selectedSlot;
            const startTime = timeSlot.split('-')[0];
            return <span>{startTime}</span>;
        }
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.status
            return (
                <Badge variant={status === "Confirmed" ? "default" : "secondary"} className="bg-green-100 text-green-800">
                    • {status}
                </Badge>
            )
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const lead = row.original
            return <LeadsDetails
                lead={lead}
            />
        },
    }
]
export const clientColumns: ColumnDef<leads>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
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
        accessorKey: "fullName",
        header: "Client Name",
    },
    {
        accessorKey: "midwifeName",
        header: "midwife Name",
    },
    {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
        const date = new Date(row.original.createdAt);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return <span>{`${day}/${month}/${year}`}</span>;
    }
},
    {
    accessorKey: "CurrentPlan",
    header: "Current Plan",
    cell: ({ row }) => {
        const currentPlan = row.original.CurrentPlan;
        return <span>{currentPlan ? currentPlan : "No Plan"}</span>;
        // OR you can use: return <span>{currentPlan || "No Plan"}</span>;
    }
},
    {
        accessorKey: "email",
        header: "Email",
    },
    // {
    //     accessorKey: "selectedSlot",
    //     header: "Time",
    //     cell: ({ row }) => {
    //         const timeSlot = row.original.selectedSlot;
    //         const startTime = timeSlot.split('-')[0];
    //         return <span>{startTime}</span>;
    //     }
    // },
    // {
    //     accessorKey: "status",
    //     header: "Status",
    //     cell: ({ row }) => {
    //         const status = row.original.status
    //         return (
    //             <Badge variant={status === "Confirmed" ? "default" : "secondary"} className="bg-green-100 text-green-800">
    //                 • {status}
    //             </Badge>
    //         )
    //     },
    // },
    {
        id: "actions",
        cell: ({ row }) => {
            const lead = row.original
            return <ClientDetails
                lead={lead}
            />
        },
    }
]

// Define the Payment type
interface Payment {
    id: number
    clientName: string
    midwifeName: string
    amount: string
    date: string
    status: string
}

// Define the columns for the payments table
export const paymentColumns: ColumnDef<Payment>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
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
        accessorKey: "clientName",
        header: "Client Name",
    },
    {
        accessorKey: "midwifeName",
        header: "Midwife Name",
    },
    {
        accessorKey: "amount",
        header: "Amount",
    },
    {
        accessorKey: "date",
        header: "Date",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.status
            return (
                <Badge
                    variant={status === "Paid" ? "default" : "secondary"}
                    className={status === "Paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
                >
                    • {status}
                </Badge>
            )
        },
    },
    {
        id: "actions",
        cell: () => {
            return (
                <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                </Button>
            )
        },
    },
]

export interface PendingApproval {
    _id: string
    clientId: string
    midwifeId: string
    clientET: string
    clientName: string
    clientEmail: string
    clientRole: string
    midwifeName: string
    totalAppointments: number
    bookingStatus: "pending" | "finalized" | "approved"
    createdAt: string
    appointments: {
        [key: string]: Array<{
            appointmentId: string
            appointmentDate: string
            startTime: string
            endTime: string
            duration: number
            status: string
        }>
    }
}

// Add this component before your column definitions
// Update the ScheduleDetails component to accept onReviewClick
const ScheduleDetails = ({
    approval,
    onReviewClick
}: {
    approval: PendingApproval
    onReviewClick: (approval: PendingApproval) => void
}) => {
    return (
        <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => onReviewClick(approval)} // Call the handler
        >
            <Eye className="h-4 w-4" />
            Review
        </Button>
    )
}

// Update the column definition to accept the callback
export const pendingApprovalsColumns = (
    onReviewClick: (approval: PendingApproval) => void
): ColumnDef<PendingApproval>[] => [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
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
            accessorKey: "clientName",
            header: "Client Name",
        },
        {
            accessorKey: "midwifeName",
            header: "Midwife Name",
        },
        {
            accessorKey: "clientET",
            header: "Expected Date",
            cell: ({ row }) => {
                const etDate = new Date(row.original.clientET)
                return (
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>{etDate.toLocaleDateString('en-GB')}</span>
                    </div>
                )
            }
        },
        {
            accessorKey: "totalAppointments",
            header: "Appointments",
            cell: ({ row }) => {
                const appointments = row.original.appointments
                const appointmentTypes = Object.keys(appointments)
                const totalCount = Object.values(appointments).reduce((sum, arr) => sum + arr.length, 0)

                return (
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{totalCount}</span>
                        <span className="text-sm text-gray-500">
                            ({appointmentTypes.join(', ')})
                        </span>
                    </div>
                )
            }
        },
        {
            accessorKey: "createdAt",
            header: "Created",
            cell: ({ row }) => {
                const createdDate = new Date(row.original.createdAt)
                return (
                    <span className="text-sm text-gray-600">
                        {createdDate.toLocaleDateString('en-GB')}
                    </span>
                )
            }
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const approval = row.original
                return <ScheduleDetails approval={approval} onReviewClick={onReviewClick} />
            },
        }
    ]


export interface PostBirthApproval {
    _id: string
    clientId: string
    midwifeId: string
    clientET: string
    clientName: string
    clientEmail: string
    clientRole: string
    midwifeName: string
    totalAppointments: number
    bookingStatus: "pending" | "finalized" | "approved"
    createdAt: string
    appointments: {
        [key: string]: Array<{
            appointmentId: string
            appointmentDate: string
            startTime: string
            endTime: string
            duration: number
            status: string
        }>
    }
}

// Add this component before your column definitions
// Update the ScheduleDetails component to accept onReviewClick
const PostBirthScheduleDetails = ({
    approval,
    onReviewClick
}: {
    approval: PostBirthApproval
    onReviewClick: (approval: PostBirthApproval) => void
}) => {
    return (
        <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => onReviewClick(approval)} // Call the handler
        >
            <Eye className="h-4 w-4" />
            Review
        </Button>
    )
}

// Update the column definition to accept the callback
export const postBirthApprovalsColumns = (
    onReviewClick: (approval: PostBirthApproval) => void
): ColumnDef<PostBirthApproval>[] => [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
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
            accessorKey: "clientName",
            header: "Client Name",
        },
        {
            accessorKey: "midwifeName",
            header: "Midwife Name",
        },
        {
            accessorKey: "clientET",
            header: "Expected Date",
            cell: ({ row }) => {
                const etDate = new Date(row.original.clientET)
                return (
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>{etDate.toLocaleDateString('en-GB')}</span>
                    </div>
                )
            }
        },
        {
            accessorKey: "totalAppointments",
            header: "Appointments",
            cell: ({ row }) => {
                const appointments = row.original.appointments
                const appointmentTypes = Object.keys(appointments)
                const totalCount = Object.values(appointments).reduce((sum, arr) => sum + arr.length, 0)

                return (
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{totalCount}</span>
                        <span className="text-sm text-gray-500">
                            ({appointmentTypes.join(', ')})
                        </span>
                    </div>
                )
            }
        },
        {
            accessorKey: "createdAt",
            header: "Created",
            cell: ({ row }) => {
                const createdDate = new Date(row.original.createdAt)
                return (
                    <span className="text-sm text-gray-600">
                        {createdDate.toLocaleDateString('en-GB')}
                    </span>
                )
            }
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const approval = row.original
                return <PostBirthScheduleDetails approval={approval} onReviewClick={onReviewClick} />
            },
        }
    ]

export const customersColumns = (onCustomerClick?: (customer: Customer) => void): ColumnDef<Customer>[] => [
    {
        accessorKey: "customerName",
        header: "Customer Name",
        cell: ({ row }) => {
            const customer = row.original
            return (
                <Button
                    variant="link"
                    className="p-0 h-auto font-medium text-blue-600 hover:text-blue-800"
                    onClick={() => onCustomerClick?.(customer)}
                >
                    {customer.customerName}
                </Button>
            )
        },
    },
    {
        accessorKey: "midwifeName",
        header: "Midwife",
        cell: ({ row }) => {
            return <span className="font-medium">{row.getValue("midwifeName")}</span>
        },
    },
    {
        accessorKey: "et",
        header: "ET",
        cell: ({ row }) => {
            const et = row.getValue("et") as string
            return <span>{new Date(et).toLocaleDateString()}</span>
        },
    },
    {
        accessorKey: "totalAppointments",
        header: "Total Appointments",
        cell: ({ row }) => {
            return <span className="font-medium">{row.getValue("totalAppointments")}</span>
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            return (
                <Badge variant={status === "Active" ? "default" : status === "Completed" ? "secondary" : "destructive"}>
                    {status}
                </Badge>
            )
        },
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const customer = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onCustomerClick?.(customer)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Customer
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Customer
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]