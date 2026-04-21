/* eslint-disable @typescript-eslint/no-explicit-any */
export interface SidebatrItemProps {
    icon: any;
    text: string;
    isActive?: boolean;
    onClick?: (subTab?: string) => void;
    name?: string;
    expanded?: boolean;
    panelName?: string;
    subTabs?: string[];
}