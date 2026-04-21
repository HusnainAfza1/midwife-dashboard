"use client"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const Home = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [result, setResult] = useState<{ success?: boolean; message?: string; error?: string } | null>(null)

    const sendEmailHandler = async () => {
        setIsLoading(true)
        setResult(null)

        try {
            const response = await fetch("/api/send-mail", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    receiver: "junaid.ali101452@gmail.com",
                    subject: "Test Subject",
                    message: "Hi I am being sent by the project",
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Failed to send email")
            }

            setResult({ success: true, message: data.message })
        } catch (error) {
            setResult({
                success: false,
                error: error instanceof Error ? error.message : "An unknown error occurred",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="p-6 max-w-md mx-auto">
            <Button onClick={sendEmailHandler} disabled={isLoading} className="w-full">
                {isLoading ? "Sending..." : "Send Test Email"}
            </Button>

            {result && (
                <div
                    className={`mt-4 p-3 rounded ${result.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                >
                    {result.success ? result.message : result.error}
                </div>
            )}
        </div>
    )
}

export default Home

