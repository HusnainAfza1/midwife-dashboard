
import { CalendarView } from "./calender-view";
import { MetricsCards } from "./matrix-cards";
import { AppointmentsTable } from "./appointments-table";
import { RequestsTable } from "./request-table";
import { RevenueChart } from "./revenue-chart";
import RevenueBarChart from "./revenueBarChart";
import { Avatar, } from "@/components/ui/avatar";
import { Search } from "./search-commponent";
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Info } from "lucide-react";
import Link from "next/link";  
import avatar from "@/assets/Avatar.png";         
import Image from "next/image";

export const MainDashboard = () => {
  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between md:flex-row flex-col space-y-4 md:space-y-0">
        <div>
          <Breadcrumb>
            <BreadcrumbItem>
              <Link href="/pages">Pages</Link>
            </BreadcrumbItem>
            <BreadcrumbItem> <Link href="/dashboard">Dashboard</Link> </BreadcrumbItem>
          </Breadcrumb>
          <h1 className="text-2xl font-bold mt-2">Main Dashboard</h1>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4 shadow-lg p-2 rounded-lg w-full sm:w-auto md:w-[350px] lg:w-[450px]">
          <Search placeholder="Search..." />
          <Bell size={20} className="text-gray-600 cursor-pointer" />
          <div className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full flex items-center justify-center cursor-pointer">
            <Info size={14} />
          </div>
          <Avatar>
            {/* <AvatarImage src= {} alt="avatar" />  
            {/* image={<Image src={avatar} alt="avatar" width={40} height={40} />}   */}
            {/* <AvatarFallback>US</AvatarFallback> */}    
            
            <Image src={avatar} alt="avatar" width={40} height={40} />
          </Avatar>
        </div>
      </div>

      {/* Metrics Cards */}
      <MetricsCards />

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">     
         <RevenueChart />
        
        
            {/* Bar chart component */}
            <RevenueBarChart />
          
      </div>

      {/* Data Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AppointmentsTable />
        <RequestsTable />
      </div>

      {/* Calendar */}
      <Card>
        <CardHeader>
          <CardTitle>Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <CalendarView />
        </CardContent>
      </Card>
    </div>
  );
};

export default MainDashboard;