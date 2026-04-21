"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { day: "17", revenue: 120, sales: 80 },
  { day: "18", revenue: 150, sales: 100 },
  { day: "19", revenue: 200, sales: 120 },
  { day: "20", revenue: 170, sales: 110 },
  { day: "21", revenue: 250, sales: 160 },
  { day: "22", revenue: 220, sales: 140 },
  { day: "23", revenue: 300, sales: 200 },
  { day: "24", revenue: 280, sales: 190 },
  { day: "25", revenue: 320, sales: 210 },
];


const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
  sales: {
    label: "Sales",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function RevenueBarChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Revenue</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="day" 
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
           
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
            
           
            <Bar
              dataKey="revenue"
              stackId="a"
              fill="hsl(var(--chart-1))"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="sales"
              stackId="a"
              fill="hsl(var(--chart-2))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default RevenueBarChart;
