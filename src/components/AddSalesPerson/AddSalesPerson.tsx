'use client';
import { DataTable } from "@/components/dataTable/data-table";
import { useUser } from "@/contextApis/UserContext";
import { GetSalesPersonApi } from "@/endpoints/getEndpoints";
import { useEffect } from "react";
import AddSalesPersonForm from "./AddSalesPersonForm";
import { columns } from "./columns";

export default function AddSalesPerson() {
    const { salesPersons, updateSalesPersons } = useUser();

    const FetchSalesPersons = () => {
        GetSalesPersonApi()
            .then(response => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                updateSalesPersons(response.data.salespersons.map((sp: any) => ({
                    id: sp._id,
                    name: sp.username,
                    email: sp.email
                })));
            })
            .catch(error => {
                console.log(error);
            })
    }

    useEffect(() => {
        FetchSalesPersons();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    return (
        <div className="container mx-auto bg-white p-6 rounded-lg">
            <div className="flex gap-x-2 justify-end w-full mt-1">
                <AddSalesPersonForm />
            </div>
            <DataTable columns={columns} data={salesPersons} searchPlaceholder="Sales Persons" searchableColumns={["name"]} />
        </div>
    )
}
