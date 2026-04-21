import AlertDeleteDialog from "@/components/uiUtils/AlertDeleteDialog"
import { useUser } from "@/contextApis/UserContext"
import { DeleteSalesPersonApi } from "@/endpoints/deleteEndpoints"
import { SalesPerson } from "@/types"
import { useState } from "react"

const DeleteSalesPerson = ({ salesPerson }: { salesPerson: SalesPerson }) => {
    const { salesPersons, updateSalesPersons } = useUser();
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const DeleteExpertHandler = () => {
        setIsDeleting(true);
        DeleteSalesPersonApi({
            id: salesPerson.id.toString(),
        })
            .then(response => {
                console.log(response.data.message);
                updateSalesPersons(salesPersons.filter((sp) => sp.id !== salesPerson.id));
                setIsDeleting(false);
            })
            .catch(error => {
                console.log(error)
                setIsDeleting(false);
            })
    }
    return (
        <AlertDeleteDialog
            description="This action cannot be undone. This will permanently delete your Sales Person and remove your data from our servers."
            isDeleting={isDeleting}
            onDelete={DeleteExpertHandler}
            variant="ghost"
            triggerButtonClassName={"p-0 hover:bg-transparent"}
        />
    )
}

export default DeleteSalesPerson