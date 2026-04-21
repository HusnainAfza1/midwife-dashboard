// components/AddClient/SignUpStep.tsx
"use client"
import { useState, useEffect } from "react"  // ← ADD useEffect
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { ClientFormData } from "./types"
import { CheckUserApi } from "@/endpoints/postEndpoints"
import { GetuserByEmailApi } from "@/endpoints/getEndpoints"
import { Loader2 } from "lucide-react"

interface SignUpStepProps {
    data: ClientFormData
    updateData: (field: Partial<ClientFormData>) => void
    onNext: () => void
}

const SignUpStep = ({ data, updateData, onNext }: SignUpStepProps) => {
    const [isChecking, setIsChecking] = useState(false)
    const [userExists, setUserExists] = useState(false)
    const [existingEmail, setExistingEmail] = useState("")

    // ← ADD THIS useEffect
    useEffect(() => {
        // If clientId exists in data, it means user came back from next step
        // Show existing user mode with the email
        if (data.clientId && data.email) {
            setUserExists(true)
            setExistingEmail(data.email)
        }
    }, [data.clientId, data.email])

    const handleExistingUser = async () => {
        // Validation for existing user
        if (!existingEmail.trim()) {
            toast.error("Email is required")
            return
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(existingEmail)) {
            toast.error("Please enter a valid email address")
            return
        }

        const normalizedEmail = existingEmail.trim().toLowerCase()

        setIsChecking(true)
        try {
            const response = await GetuserByEmailApi(normalizedEmail)

            console.log("GetuserByEmailApi response:", response.data)

            // Check if user exists
            if (!response.data?.success) {
                toast.error("User with this email does not exist")
                setIsChecking(false)
                return
            }

            // Check if role is client
            if (response.data.role !== "client") {
                toast.error("This user is not a client")
                setIsChecking(false)
                return
            }

            if (response.data.error) {
                toast.error(response.data.error);
                setIsChecking(false)
                return
            }

            // Save existing user data
            updateData({
                clientId: response.data.data._id,
                username: response.data.username,
                fullName: response.data.data.fullName,
                email: response.data.email
            })

            toast.success("Existing client found!")
            onNext()

        } catch (error) {
            console.error("Error fetching user:", error)
            toast.error("Failed to fetch user information. Please try again.")
        } finally {
            setIsChecking(false)
        }
    }

    const handleNewUser = async () => {
        // Validation for new user
        if (!data.username.trim()) {
            toast.error("Username is required")
            return
        }
        if (!data.fullName.trim()) {
            toast.error("Full name is required")
            return
        }
        if (!data.email.trim()) {
            toast.error("Email is required")
            return
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(data.email)) {
            toast.error("Please enter a valid email address")
            return
        }
        if (!data.password.trim()) {
            toast.error("Password is required")
            return
        }
        if (data.password.length < 6) {
            toast.error("Password must be at least 6 characters long")
            return
        }

        const normalizedEmail = data.email.trim().toLowerCase()
        updateData({ email: normalizedEmail })

        setIsChecking(true)
        try {
            const response = await CheckUserApi({
                email: normalizedEmail,
                username: data.username.trim()
            })

            console.log("CheckUserApi response:", response.data)

            if (response.data?.exists === true) {
                const matchedField = response.data.matchedField || "email or username"
                toast.error(`User with this ${matchedField} already exists`)
                setIsChecking(false)
                return
            }

            onNext()

        } catch (error) {
            console.error("Error checking user:", error)
            toast.error("Failed to verify user information. Please try again.")
        } finally {
            setIsChecking(false)
        }
    }

    const handleNext = () => {
        if (userExists) {
            handleExistingUser()
        } else {
            handleNewUser()
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-semibold mb-2">Client Sign Up Details</h2>
                <p className="text-gray-500 text-sm">Enter the basic information for the new client</p>
            </div>

            {/* Checkbox for existing user */}
            <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <Checkbox
                    id="userExists"
                    checked={userExists}
                    onCheckedChange={(checked) => setUserExists(checked as boolean)}
                    disabled={isChecking}
                />
                <label
                    htmlFor="userExists"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                    User already exists
                </label>
            </div>

            <div className="space-y-4">
                {userExists ? (
                    // Show only email field for existing user
                    <div className="space-y-2">
                        <Label htmlFor="existingEmail">Email *</Label>
                        <Input
                            id="existingEmail"
                            type="email"
                            value={existingEmail}
                            onChange={(e) => setExistingEmail(e.target.value.toLowerCase())}
                            placeholder="Enter existing user's email"
                            className="w-full"
                            disabled={isChecking}
                        />
                    </div>
                ) : (
                    // Show all fields for new user
                    <>
                        <div className="space-y-2">
                            <Label htmlFor="username">Username *</Label>
                            <Input
                                id="username"
                                value={data.username}
                                onChange={(e) => updateData({ username: e.target.value })}
                                placeholder="Enter username"
                                className="w-full"
                                disabled={isChecking}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name *</Label>
                            <Input
                                id="fullName"
                                value={data.fullName}
                                onChange={(e) => updateData({ fullName: e.target.value })}
                                placeholder="Enter full name"
                                className="w-full"
                                disabled={isChecking}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email *</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => updateData({ email: e.target.value.toLowerCase() })}
                                placeholder="Enter email address"
                                className="w-full"
                                disabled={isChecking}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password *</Label>
                            <Input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(e) => updateData({ password: e.target.value })}
                                placeholder="Enter password (min 6 characters)"
                                className="w-full"
                                disabled={isChecking}
                            />
                        </div>
                    </>
                )}
            </div>

            <Button
                onClick={handleNext}
                className="w-full mt-4"
                disabled={isChecking}
            >
                {isChecking ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {userExists ? "Fetching User..." : "Checking..."}
                    </>
                ) : (
                    userExists ? "Continue with Existing User" : "Next: Expected Date & Address"
                )}
            </Button>
        </div>
    )
}

export default SignUpStep