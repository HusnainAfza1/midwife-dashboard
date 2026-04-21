// import Image from "next/image";
// import { Input } from "../ui/input";
// import { Bell, Search } from "lucide-react";
// import ProfileIcon from "@/assets/profile_icon.png";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DashNav = (props: any) => {
  const { panelName } = props;
  const panelTitle: Record<string, string> = {
    Dashboard: "",
    Appointments: "Appointments",
    Upcoming: "Upcoming Appointments",
    Previous: "Previous Appointments",
    Settings: "Appointment Settings",
  };

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 bg-[#f4f7fe]">
      <div className="flex flex-col gap-1">
        <p className="text-gray-500 text-sm">
          Dashboard / {panelTitle[panelName] || panelName}
        </p>
        <h1 className="text-2xl font-bold text-blue-900">
          {" "}
          {panelTitle[panelName] || panelName}
        </h1>
      </div>
      {/* <div className="flex flex-row items-center gap-4 w-full lg:w-auto bg-white px-6 py-3 rounded-full">
        <div className="relative flex-1 lg:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search"
            className="pl-9 pt-1 w-full rounded-full placeholder:text-gray-400"
          />
        </div>
        <div className="flex items-center gap-4 ml-auto lg:ml-0">
          <Bell className="w-6 h-6 text-gray-400" />
          <Image
            src={ProfileIcon}
            alt="Profile Icon"
            className="rounded-full w-7 h-7"
          />
        </div>
      </div> */}
    </div>
  );
};

export default DashNav;
