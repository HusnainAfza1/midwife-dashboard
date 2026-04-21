"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { SpinnerButton } from "@/components/uiUtils/SpinnerButton"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { MoreVertical } from "lucide-react"
import { toast } from "sonner"
import { UpdateMidwifeApi } from "@/endpoints/putEndpoints" // Using your existing update API
// eslint-disable-next-line
export const MidwifeActionsMenu = ({ midwife, onEdit, onDelete, onStatusChange }: any) => {
    const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)

    // Use the actual midwife status from props
    const isActive = midwife.midwifeStatus
    const isProfileComplete = midwife.isProfileComplete

    const handleStatusChange = async () => {
        // If profile is incomplete, show warning and don't allow activation
        if (!isProfileComplete && !isActive) {
            toast.error("Cannot activate midwife with incomplete profile", {
                description: "Please complete the midwife profile first"
            })
            setIsStatusDialogOpen(false)
            return
        }

        setIsUpdating(true)
        try {
            // Create a copy of the midwife object with updated status    
            const midwifeId = midwife._id
            const updatedMidwife = {
                ...midwife,
                midwifeStatus: !isActive // Toggle the status
            }

            // Call your existing update API with the modified midwife object
            await UpdateMidwifeApi(midwifeId, updatedMidwife)

            // Show success message
            toast.success(`Midwife ${!isActive ? "activated" : "deactivated"} successfully`)

            // Call the parent callback to refresh the data
            if (onStatusChange) {
                onStatusChange()
            }

        } catch (err) {
            console.error("Error updating midwife status:", err)
            toast.error(`Failed to ${!isActive ? "activate" : "deactivate"} midwife`)
        } finally {
            setIsUpdating(false);
            setIsStatusDialogOpen(false);

            // Debug portals and overlays
            setTimeout(() => {
                document.body.style.pointerEvents = '';
                document.body.style.pointerEvents = 'auto';
                console.log('Fixed body pointer-events');
            }, 100);
        }
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(midwife)}>
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => onDelete(midwife)}
                        className="text-red-600 focus:text-red-600"
                    >
                        Delete
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsStatusDialogOpen(true)}>
                        {isActive ? "Deactivate Midwife" : "Activate Midwife"}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {isActive ? "Deactivate Midwife" : "Activate Midwife"}
                        </DialogTitle>
                        <DialogDescription>
                            {isActive
                                ? "Are you sure you want to deactivate this midwife? She will no longer be available for clients to select or book."
                                : "Are you sure you want to activate this midwife? She will become available for client bookings."}
                        </DialogDescription>

                        {/* Show warning for incomplete profile */}
                        {!isProfileComplete && !isActive && (
                            <div className="mt-2 text-red-500 text-sm">
                                Warning: This midwife&#39;s profile is incomplete. Please complete the profile before activation.
                            </div>
                        )}
                    </DialogHeader>
                    <DialogFooter className="flex justify-end gap-2 pt-4">
                        <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)}>
                            Cancel
                        </Button>
                        {/* <Button
                            className="bg-blue-600 text-white hover:bg-blue-700"
                            onClick={handleStatusChange}
                            disabled={isUpdating || (!isProfileComplete && !isActive)}
                        >
                            {isUpdating ? "Processing..." : (isActive ? "Deactivate" : "Activate")}
                        </Button> */}
                        <SpinnerButton
                            state={isUpdating}
                            name={isActive ? "Deactivate" : "Activate"}
                            disabled={(!isProfileComplete && !isActive)}
                            className="bg-blue-600 text-white hover:bg-blue-700"
                            onClick={handleStatusChange}
                        />
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}