'use client';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SpinnerButton } from "@/components/uiUtils/SpinnerButton";
import { useUser } from "@/contextApis/UserContext";
import { SalesPersonRegisterApi } from "@/endpoints/postEndpoints";
import { RegisterSalesPersonFromData, SalesPerson } from "@/types";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const AddSalesPersonForm = () => {
    const { salesPersons, updateSalesPersons } = useUser();
    const [isAdding, setIsAdding] = useState<boolean>(false);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<RegisterSalesPersonFromData>();


    const submitHandler = (data: RegisterSalesPersonFromData) => {
        setIsAdding(true);
        SalesPersonRegisterApi({
            email: data.email,
            password: data.password,
            username: data.name,
        })
            .then(response => {
                reset();
                setIsAdding(false);
                console.log("response.data");
                console.log(response.data);
                const newSalesPerson: SalesPerson = {
                    id: response.data.salesperson.id,
                    name: response.data.salesperson.username,
                    email: response.data.salesperson.email,
                };
                updateSalesPersons([...salesPersons, newSalesPerson]);
                toast("Success", {
                    description: "Sales Person Successfully Added."
                });
                setIsDialogOpen(false);
            }
            )
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .catch((error: any) => {
                setIsAdding(false);
                console.log(error);
                toast("Error", {
                    description: "An unkown error occurred. Please try again later.",
                })
            })
    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button onClick={() => setIsDialogOpen(true)} className="flex items-center gap-x-2 max-w-fit self-end mt-2">
                    <Plus />
                    Add SalesPerson
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Sales Person</DialogTitle>
                    <DialogDescription>
                        Enter details of the Sales Person you want to add. Click save when you&apos;re done.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(submitHandler)}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="name"
                                placeholder="name"
                                {...register("name", { required: true })}
                                className={`${errors.name ? "border-red-500" : "border-gray-300"} col-span-3`}
                            />
                            {errors.name && (
                                <Label className="text-right col-span-4 text-red-500 text-sm">Sales Person Name is required</Label>
                            )}
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                                Email
                            </Label>
                            <Input
                                type="email"
                                placeholder="abc@gmail.com"
                                {...register("email", { required: true })}
                                className={`${errors.email ? "border-red-500" : "border-gray-300"} col-span-3`}
                            />
                            {errors.email && (
                                <Label className="text-right col-span-4 text-red-500 text-sm">Sales Person email is required</Label>
                            )}
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                                Password
                            </Label>
                            <Input
                                type="password"
                                placeholder="password"
                                {...register("password", { required: true })}
                                className={`${errors.password ? "border-red-500" : "border-gray-300"} col-span-3`}
                            />
                            {errors.password && (
                                <Label className="text-right col-span-4 text-red-500 text-sm">Sales Person password is required</Label>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <SpinnerButton
                            name="Add"
                            state={isAdding}
                            type="submit"
                        />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default AddSalesPersonForm