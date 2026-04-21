'use client';
import { SalesPerson } from "@/types";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";

interface UserContextType {
    salesPersons: SalesPerson[];
    userRole: string;
    updateUserRole: (role: string) => void;
    updateSalesPersons: (sp: SalesPerson[]) => void;
    logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function useUser() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
}

interface UserProviderProps {
    children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
    const [salesPersons, setSalesPersons] = useState<SalesPerson[]>([]);
    const [userRole, setUserRole] = useState<string>("");

    useEffect(() => {
        const storedSalesPersons = JSON.parse(localStorage.getItem("salesPersons") || "[]");
        const storedUserRole = localStorage.getItem("userRole");

        if (storedSalesPersons && storedUserRole) {
            setSalesPersons(storedSalesPersons);
            setUserRole(storedUserRole);
        }
    }, []);

    const updateSalesPersons = (sp: SalesPerson[]) => {
        setSalesPersons(sp);
        localStorage.setItem("salesPersons", JSON.stringify(sp));
    }

    const updateUserRole = (role: string) => {
        setUserRole(role);
        localStorage.setItem("userRole", role);
    }

    const logout = () => {
        setSalesPersons([]);

        localStorage.clear();
    };


    const UserContextValue: UserContextType = {
        salesPersons,
        userRole,
        updateUserRole,
        updateSalesPersons,
        logout,
    }
    return (
        <UserContext.Provider value={UserContextValue} >
            {children}
        </UserContext.Provider>
    );
}
