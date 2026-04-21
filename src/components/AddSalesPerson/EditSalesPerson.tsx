"use client"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SpinnerButton } from "@/components/uiUtils/SpinnerButton"
import { useUser } from "@/contextApis/UserContext"
import { UpdateSalesPersonApi } from "@/endpoints/putEndpoints"
import { RegisterSalesPersonFromData, SalesPerson } from "@/types"
import { PencilLine } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

const EditSalesPerson = ({ salesPerson }: { salesPerson: SalesPerson }) => {
    const [isAdding, setIsAdding] = useState<boolean>(false);
    const { salesPersons, updateSalesPersons } = useUser();
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<RegisterSalesPersonFromData>();

    const submitHandler = (data: RegisterSalesPersonFromData) => {
        setIsAdding(true);
        UpdateSalesPersonApi({
            email: data.email,
            id: salesPerson.id,
            password: data.password,
            username: data.name,
        })
            .then(response => {
                reset();
                setIsAdding(false);
                const updatedSalesPerson: SalesPerson = {
                    id: response.data.salesperson.id,
                    name: response.data.salesperson.username,
                    email: response.data.salesperson.email,
                };
                updateSalesPersons(salesPersons.map((sp) =>
                    sp.id === updatedSalesPerson.id ? updatedSalesPerson : sp
                ));
                toast(
                    "Success", {
                    description: "Expert Successfully Updated."
                })
            })
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .catch(error => {
                setIsAdding(false);
                toast(
                    "Error", {
                    description: "An unkown error occurred. Please try again later.",
                })
            })
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={"ghost"}>
                    <PencilLine size={20} />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Update Sales Person</DialogTitle>
                    <DialogDescription>
                        Enter details of the sales Person you want to update. Click update when
                        you&apos;re done.
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
                                placeholder={salesPerson.name}
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
                                placeholder={salesPerson.email}
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
                            name="Update"
                            state={isAdding}
                            type="submit"
                        />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default EditSalesPerson