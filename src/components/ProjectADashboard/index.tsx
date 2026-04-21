"use client"
import { Calendar, Users, CreditCard } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { RevenueChart } from "./RevenueChart"
import { RevenueBarChart } from "./RevenueBarChart"
import { RecentActivity } from "./Recent-Activity"

const ProjectADashboard = () => {
    return (
        <div className="container mx-auto space-y-6">
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-white">
                    <CardContent className="p-6 flex items-center space-x-4">
                        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                            <Users className="text-blue-500" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Midwives</p>
                            <h3 className="text-2xl font-bold">2935</h3>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white">
                    <CardContent className="p-6 flex items-center space-x-4">
                        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                            <Calendar className="text-blue-500" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Bookings</p>
                            <h3 className="text-2xl font-bold">320</h3>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white">
                    <CardContent className="p-6 flex items-center space-x-4">
                        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                            <CreditCard className="text-blue-500" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Monthly revenue</p>
                            <h3 className="text-2xl font-bold">$574.34</h3>
                            <p className="text-xs text-green-500">+23% since last month</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white">
                    <CardContent className="p-6 flex items-center space-x-4">
                        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                            <Calendar className="text-blue-500" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total bookings</p>
                            <h3 className="text-2xl font-bold">3522</h3>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <RevenueChart />
                <RevenueBarChart />
            </div>

            {/* Recent Activity */}
            <Card className="bg-white">
                <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                    <RecentActivity />
                </div>
            </Card>
        </div>
    )
}

export default ProjectADashboard
