import Background from "@/assets/Background-Login.png";
import Logo from "@/assets/Login Logo.png";
import Image from "next/image";
import { ResetPasswordForm } from "./reset-password-form";
import { Suspense } from "react";

const ResetPassword = () => {
    return (
        <div className="flex bg-gray-50">
            <div className="w-full flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10 bg-gray-50">
                <div className="flex w-full max-w-sm flex-col gap-6">
                    <Suspense fallback={<div className="text-center text-slate-600">Loading...</div>}>
                        <ResetPasswordForm />
                    </Suspense>
                </div>
            </div>
            <div
                className="hidden md:block w-full bg-cover bg-left bg-no-repeat"
                style={{
                    backgroundImage: `url(${Background.src})`,
                    borderRadius: "0 0 0 150px",
                }}
            >
                <div className="flex flex-col items-center justify-center gap-10 h-full text-white">
                    <div className="flex flex-col items-center justify-center">
                        <Image src={Logo} alt="Logo" width={150} height={150} />
                        <h1 className="text-3xl font-semibold mt-4">Hebammen</h1>
                    </div>
                    <div className="flex flex-col items-center gap-2 px-10 py-4 border-2 border-white/20 rounded-2xl">
                        <p className="text-sm">Learn more about Horizon UI on</p>
                        <p className="text-lg font-semibold">hebammen.com</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;