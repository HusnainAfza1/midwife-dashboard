import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { SpinnerButton } from "./SpinnerButton";

interface AlertDeleteDialogProps {
    description: string;
    isDeleting: boolean;
    onDelete: () => void;
    triggerButtonClassName?: string;
    variant: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost";
}

const AlertDeleteDialog = ({
    description,
    isDeleting,
    onDelete,
    triggerButtonClassName = "",
    variant
}: AlertDeleteDialogProps) => {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <SpinnerButton
                    className={triggerButtonClassName}
                    name={""}
                    state={isDeleting}
                    icon={<Trash2 size={20} className="text-red-600 hover:text-red-400" />}
                    variant={variant}
                />
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        className="bg-red-700 hover:bg-red-800"
                        onClick={onDelete}
                    >
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default AlertDeleteDialog;
