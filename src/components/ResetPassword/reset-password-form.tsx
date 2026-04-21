"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SpinnerButton } from "@/components/uiUtils/SpinnerButton";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import type React from "react";
import { useState, useEffect } from "react";
import * as reactHookForm from "react-hook-form";
import { toast } from "sonner";
import Link from "next/link";

interface ResetPasswordFormData {
    newPassword: string;
    confirmPassword: string;
}

export function ResetPasswordForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [tokenValid, setTokenValid] = useState(true);
    const [resetSuccess, setResetSuccess] = useState(false);
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        reset,
    } = reactHookForm.useForm<ResetPasswordFormData>();

    const newPassword = watch("newPassword");

    useEffect(() => {
        if (!token) {
            setTokenValid(false);
            toast.error("Invalid reset link. Please request a new one.");
        }
    }, [token]);

    const onSubmit = async (data: ResetPasswordFormData) => {
        if (!token) {
            toast.error("Invalid reset link");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch("/api/users/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token: token,
                    newPassword: data.newPassword,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                toast.success(result.message || "Password reset successful!");
                reset();
                setResetSuccess(true);
            } else {
                toast.error(result.error || "Failed to reset password");

                // If token is invalid/expired, offer to request new one
                if (result.error.includes("Invalid") || result.error.includes("expired")) {
                    setTokenValid(false);
                }
            }
        } catch (error) {
            console.error("Reset password error:", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!tokenValid) {
        return (
            <div className={cn("flex flex-col gap-6", className)} {...props}>
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl text-indigo-900">Invalid Link</CardTitle>
                        <CardDescription className="text-slate-400">
                            This password reset link is invalid or has expired.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-4 text-center">
                            <p className="text-sm text-slate-600">
                                Password reset links expire after 5 minutes for security reasons.
                            </p>
                            <Link
                                href="/forgot-password"
                                className="text-indigo-600 font-semibold hover:underline"
                            >
                                Request a new reset link
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (resetSuccess) {
        return (
            <div className={cn("flex flex-col gap-6", className)} {...props}>
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl text-indigo-900">Password Reset Successful!</CardTitle>
                        <CardDescription className="text-slate-400">
                            Your password has been successfully updated
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-4 text-center">
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <p className="text-sm text-green-800">
                                    ✓ Your password has been changed successfully. You can now use your new password to log in.
                                </p>
                            </div>
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
                    <CardTitle className="text-2xl text-indigo-900">Reset Password</CardTitle>
                    <CardDescription className="text-slate-400">
                        Enter your new password below
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="newPassword" className="text-indigo-900">
                                    New Password*
                                </Label>
                                <Input
                                    id="newPassword"
                                    type="password"
                                    placeholder="Enter new password"
                                    {...register("newPassword", {
                                        required: "Password is required",
                                        minLength: {
                                            value: 6,
                                            message: "Password must be at least 6 characters",
                                        },
                                    })}
                                />
                                {errors.newPassword && (
                                    <p className="text-red-500 text-sm">{errors.newPassword.message}</p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="confirmPassword" className="text-indigo-900">
                                    Confirm Password*
                                </Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Confirm new password"
                                    {...register("confirmPassword", {
                                        required: "Please confirm your password",
                                        validate: (value) =>
                                            value === newPassword || "Passwords do not match",
                                    })}
                                />
                                {errors.confirmPassword && (
                                    <p className="text-red-500 text-sm">
                                        {errors.confirmPassword.message}
                                    </p>
                                )}
                            </div>

                            <SpinnerButton
                                name="Reset Password"
                                state={isSubmitting}
                                type="submit"
                            />

                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}