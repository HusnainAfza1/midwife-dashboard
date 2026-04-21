"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SIDE_PANEL_COMPS } from "@/config/constants";
import { useUser } from "@/contextApis/UserContext";
import { LogoutAPi } from "@/endpoints/getEndpoints";
import PermissionWrapper from "@/wraper/PermissionWraper";
import { ChevronFirst, ChevronLast } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SidePanelItem } from "./SidePanelItem";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function SidePanel(props: any) {
  const { panelName, setPanelName } = props;
  const [expanded, setExpanded] = useState(true);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const router = useRouter();

  const [activeSubTab, setActiveSubTab] = useState<string | null>(null);
  const { logout } = useUser();

  const handleItemClick = (name: string, subTab?: string) => {
    if (name === "Logout") {
      LogoutAPi()
        .then(response => {
          toast(response.data.message, {
            description: "User Logged Out and Access token invalidated.",
          });
          logout();
          router.push("/login");
          // window.location.href = "/login"
        })
        .catch(error => {
          toast("Logput Error", {
            description: error as string,
          });
        })
    } else {
      setPanelName(subTab || name);
      setActiveTabIndex(
        SIDE_PANEL_COMPS.findIndex((item) => item.text === name)
      );
      setActiveSubTab(subTab || null);
    }
  };

  useEffect(() => {
    // Find the index of the main tab
    const mainTabIndex = SIDE_PANEL_COMPS.findIndex(
      (tab) => tab.text === panelName
    );

    // If the panelName is a sub-tab, find its parent and update both activeTabIndex and activeSubTab
    if (mainTabIndex === -1) {
      SIDE_PANEL_COMPS.forEach((tab, index) => {
        if (tab.subTabs?.includes(panelName)) {
          setActiveTabIndex(index);
          setActiveSubTab(panelName);
        }
      });
    } else {
      setActiveTabIndex(mainTabIndex);
      setActiveSubTab(""); // Reset sub-tab if a main tab is selected
    }
  }, [panelName]);

  return (
    <aside className="h-screen">
      <nav className="h-full flex flex-col bg-white border-r shadow-sm relative">
        <div className="flex gap-x-4 justify-center items-center self-start p-4 pb-0">
          <Avatar>
            <AvatarImage src="/avatar.png" alt="cropsight" />
            <AvatarFallback>HB</AvatarFallback>
          </Avatar>
          <Label
            className={`font-bold text-gray-600 text-base ${!expanded ? "hidden" : ""
              }`}
          >
            Hebammen
          </Label>
          <Button
            onClick={() => setExpanded((curr) => !curr)}
            className="absolute p-1.5 rounded-full bg-blue-50 hover:bg-blue-100 z-10
                         text-[#4318FF] -right-5 border-2 px-2"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </Button>
        </div>

        <hr className="my-3" />
        <ul className="flex-1 px-3">
          {SIDE_PANEL_COMPS.map((data, index) => (
            <PermissionWrapper
              key={index}
              element={
                <SidePanelItem
                  key={index}
                  icon={data.icon}
                  text={data.text}
                  isActive={index === activeTabIndex}
                  onClick={(subTab) => handleItemClick(data.text, subTab)}
                  expanded={expanded}
                  subTabs={data.subTabs}
                  activeSubTab={activeSubTab}
                />
              }
              permissions={data.permissions}
            />
          ))}
        </ul>
      </nav>
    </aside>
  );
}
