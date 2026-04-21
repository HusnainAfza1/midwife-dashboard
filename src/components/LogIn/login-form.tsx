"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SpinnerButton } from "@/components/uiUtils/SpinnerButton";
import { useUser } from "@/contextApis/UserContext";
import { LoginApi } from "@/endpoints/postEndpoints";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type React from "react";
import { useState } from "react";
import * as reactHookForm from "react-hook-form";
import { toast } from "sonner";

interface LoginFormData {
  email: string;
  password: string;
}

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateUserRole } = useUser();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = reactHookForm.useForm<LoginFormData>();

  const onSubmit = async (data: { email: string; password: string }) => {
    console.log("data", data);
    setIsSubmitting(true);
    LoginApi(data)
      .then((response) => {
        updateUserRole(response.data.user.role);
        toast(response.data.message);
        reset();
        router.push("/");
      })
      .catch((error) => {
        console.error("Login Failed", error);
        toast.error(error.response.data.error);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-indigo-900">Sign In</CardTitle>
          <CardDescription className="text-slate-400">
            Enter your email and password to sign in!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-indigo-900">
                    Email*
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="abc@example.com"
                    {...register("email", { required: "Email is required" })}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email.message}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password" className="text-indigo-900">
                      Password*
                    </Label>
                    <Link
                      href="/forgot-password"
                      className="ml-auto text-sm underline-offset-4 text-indigo-900 hover:underline"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="********"
                    {...register("password", { required: "Password is required" })}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm">{errors.password.message}</p>
                  )}
                </div>
                <SpinnerButton name="Login" state={isSubmitting} type="submit" />
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}