"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SpinnerButton } from "@/components/uiUtils/SpinnerButton";
import { cn } from "@/lib/utils";
import type React from "react";
import { useState } from "react";
import * as reactHookForm from "react-hook-form";
import { toast } from "sonner";

interface ForgotPasswordFormData {
    email: string;
}

export function ForgotPasswordForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = reactHookForm.useForm<ForgotPasswordFormData>();

    const onSubmit = async (data: ForgotPasswordFormData) => {
        setIsSubmitting(true);

        try {
            const response = await fetch("/api/users/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: data.email }),
            });

            const result = await response.json();

            if (response.ok) {
                toast.success("Password reset link sent! Check your email.");
                setEmailSent(true);
                reset();
            } else {
                toast.error(result.error || "Failed to send reset link");
            }
        } catch (error) {
            console.error("Forgot password error:", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (emailSent) {
        return (
            <div className={cn("flex flex-col gap-6", className)} {...props}>
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl text-indigo-900">Check Your Email</CardTitle>
                        <CardDescription className="text-slate-400">
                            We&apos;ve sent you a password reset link
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-4 text-center">
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <p className="text-sm text-green-800">
                                    If an account exists with your email, you&apos;ll receive a password reset link shortly.
                                </p>
                            </div>
                            <p className="text-sm text-slate-600">
                                The link will expire in <strong>5 minutes</strong>.
                            </p>
                            <p className="text-sm text-slate-600">
                                Didn&apos;t receive the email? Check your spam folder.
                            </p>
                            <button
                                onClick={() => setEmailSent(false)}
                                className="text-indigo-600 font-semibold hover:underline text-sm"
                            >
                                Send another link
                            </button>
                            {/* <Link
                                href="/login"
                                className="text-slate-600 text-sm hover:underline"
                            >
                                Back to Login
                            </Link> */}
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl text-indigo-900">Forgot Password?</CardTitle>
                    <CardDescription className="text-slate-400">
                        Enter your email and we&apos;ll send you a reset link
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-indigo-900">
                                    Email*
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="abc@example.com"
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Invalid email address",
                                        },
                                    })}
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm">{errors.email.message}</p>
                                )}
                            </div>

                            <SpinnerButton
                                name="Send Reset Link"
                                state={isSubmitting}
                                type="submit"
                            />

                            {/* <div className="text-center text-sm text-indigo-900">
                                Remember your password?{" "}
                                <Link href="/login" className="font-semibold hover:underline">
                                    Back to Login
                                </Link>
                            </div> */}
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}