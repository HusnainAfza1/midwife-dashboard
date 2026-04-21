"use client";

import { Calendar } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { CheckCircle } from "lucide-react";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";


const chartData = [   
    { month: "jUN", value1: 100, value2: 80 },
    { month: "JULY", value1: 100, value2: 80 },
    { month: "AUG", value1: 100, value2: 80 },
    { month: "SEP", value1: 100, value2: 80 },
    { month: "OCT", value1: 120, value2: 100 },
    { month: "NOV", value1: 140, value2: 110 },
    { month: "DEC", value1: 110, value2: 90 },
    { month: "JAN", value1: 130, value2: 100 },
    { month: "FEB", value1: 150, value2: 120 },
];


const chartConfig = {
    value1: {
        label: "Revenue",
        color: "hsl(var(--chart-1))",
    },
    value2: {
        label: "Sales",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig;

export function RevenueChart() {
    return (
        <Card>
            {/* Header */}
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-700">
                    <span className="p-2 bg-gray-200 rounded-md">
                        <Calendar size={18} className="text-gray-600" />
                    </span>
                    This Month
                </CardTitle>
            </CardHeader>


            <CardContent className="flex flex-col sm:flex-row items-start gap-6">


                <div className="w-full sm:w-1/3 flex flex-col gap-y-3  p-8 rounded-lg">
                    <p className="text-4xl font-bold text-gray-900">52</p>
                    <p className="text-sm text-green-500">New Booking +2.4%</p>
                    <p className="text-sm text-green-500 flex items-center gap-2 font-bold">
                        <CheckCircle size={16} className="text-green-500" /> On track
                    </p>
                </div>


                <div className="w-full sm:w-2/3">
                    <ChartContainer config={chartConfig}>
                        <LineChart
                            accessibilityLayer
                            data={chartData}
                            margin={{
                                left: 12,
                                right: 12,
                            }}
                        >
                            <CartesianGrid vertical={false} strokeDasharray="3 3" />
                            <XAxis
                                dataKey="month"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                tickFormatter={(value) => value.slice(0, 3)}
                            />
                            {/* <YAxis
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `$${value}`}
              /> */}
                            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                            <Line
                                dataKey="value1"
                                type="monotone"
                                stroke="hsl(var(--chart-1))"
                                strokeWidth={2}
                                dot={false}
                            />
                            <Line
                                dataKey="value2"
                                type="monotone"
                                stroke="hsl(var(--chart-2))"
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ChartContainer>
                </div>
            </CardContent>
        </Card>
    );
}
