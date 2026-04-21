"use client"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GetAllMidwivesApi } from "@/endpoints/getEndpoints"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

interface CustomerMidwifeAssignmentTabProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateData: (data: any) => void
    onNext: () => void
    onPrevious: () => void
    isFirst: boolean
    isLast: boolean
}

export default function CustomerMidwifeAssignmentTab({
    data,
    updateData,
    onNext,
    onPrevious,
    isFirst,
    isLast,
}: CustomerMidwifeAssignmentTabProps) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [midwives, setMidwives] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchMidwives()
    }, [])

    const fetchMidwives = async () => {
        try {
            setLoading(true)
            const response = await GetAllMidwivesApi()
            setMidwives(response.data.midwives || [])
        } catch (error) {
            console.error("Error fetching midwives:", error)
            toast.error("Failed to fetch midwives")
        } finally {
            setLoading(false)
        }
    }

    const handleMidwifeChange = (midwifeId: string) => {
        updateData({ midwifeId })
    }

    const handleDateChange = (field: string, date: Date | undefined) => {
        if (date) {
            updateData({ [field]: date.toISOString().split("T")[0] })
        }
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Midwife Assignment */}
                <div className="space-y-2">
                    <Label>Assigned Midwife *</Label>
                    <Select value={data.midwifeId || ""} onValueChange={handleMidwifeChange} disabled={loading}>
                        <SelectTrigger>
                            <SelectValue placeholder={loading ? "Loading midwives..." : "Select a midwife"} />
                        </SelectTrigger>
                        <SelectContent>
                            {midwives.map((midwife) => (
                                <SelectItem key={midwife._id} value={midwife._id}>
                                    {midwife.personalInfo.firstName} {midwife.personalInfo.lastName} - {midwife.midwifeType.type}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Expected Due Date (ET) */}
                <div className="space-y-2">
                    <Label>Expected Due Date (ET) *</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={cn("w-full justify-start text-left font-normal", !data.et && "text-muted-foreground")}
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {data.et ? format(new Date(data.et), "PPP") : "Pick expected due date"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={data.et ? new Date(data.et) : undefined}
                                onSelect={(date) => handleDateChange("et", date)}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            {/* Selected Midwife Info */}
            {data.midwifeId && (
                <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-2">Selected Midwife Information</h4>
                    {(() => {
                        const selectedMidwife = midwives.find((m) => m._id === data.midwifeId)
                        if (!selectedMidwife) return null

                        return (
                            <div className="space-y-2 text-sm">
                                <p>
                                    <strong>Name:</strong> {selectedMidwife.personalInfo.firstName}{" "}
                                    {selectedMidwife.personalInfo.lastName}
                                </p>
                                <p>
                                    <strong>Type:</strong> {selectedMidwife.midwifeType.type}
                                </p>
                                <p>
                                    <strong>Email:</strong> {selectedMidwife.personalInfo.email}
                                </p>
                                <p>
                                    <strong>Phone:</strong> {selectedMidwife.personalInfo.phone}
                                </p>
                            </div>
                        )
                    })()}
                </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
                <Button variant="outline" onClick={onPrevious} disabled={isFirst}>
                    Previous
                </Button>
                <Button onClick={onNext} disabled={isLast}>
                    Next
                </Button>
            </div>
        </div>
    )
}
