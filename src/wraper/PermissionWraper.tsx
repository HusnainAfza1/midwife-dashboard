import { useUser } from "@/contextApis/UserContext";
import { ReactNode } from "react";

interface PermissionWrapperProps {
    element: ReactNode;
    permissions: string[];
}

function PermissionWrapper({ element, permissions }: PermissionWrapperProps) {
    const { userRole } = useUser();
    if (permissions.includes(userRole)) {
        return element;
    } else {
        return null;
    }
}

export default PermissionWrapper;