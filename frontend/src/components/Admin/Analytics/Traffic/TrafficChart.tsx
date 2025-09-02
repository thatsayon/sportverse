"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trafficData } from "@/data/TrafficData";
import { analyticsData } from "@/data/analyticsData";
import AnalyticsCard from "@/components/Element/analyticsData";

export const description = "An interactive area chart";

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  northCarolina: {
    label: "North Carolina",
    color: "var(--chart-1)",
  },
  southCarolina: {
    label: "South Carolina",
    color: "var(--chart-2)",
  },
  tennessee: {
    label: "Tennessee",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function TrafficChart() {
  const [selectedMonth, setSelectedMonth] = React.useState<string>("");

   React.useEffect(() => {
    const currentMonth = new Date().getMonth(); // Get the current month (0-based index)
    setSelectedMonth(currentMonth.toString()); // Set the default selected month (0-based index)
  }, []);


  // Array of month names

  const filteredData = trafficData.filter((item) => {
    const itemDate = new Date(item.date);
    return itemDate.getMonth().toString() === selectedMonth; // Filter by selected month
  });

  return (
    <div>
      <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsData.map((item) => (
          <AnalyticsCard key={item.id} data={item} />
        ))}
      </div>
    </div>
      <div className="flex items-center justify-end mb-4 md:mb-8 lg:mb-10">
       <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Month" />
          </SelectTrigger>
          <SelectContent>
            {months.map((month, index) => (
              <SelectItem key={index} value={index.toString()}>
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Card className="pt-0">
        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
         
          {/* <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select> */}
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient
                  id="fillNorthCarolina"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="100%" stopColor="#DBA5FF" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#DBA5FF" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient
                  id="fillSouthCarolina"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="100%" stopColor="#FF8F6DCC" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#FF8F6DCC" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillTennessee" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="100%" stopColor="#4379EE" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#4379EE" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                    indicator="dot"
                  />
                }
              />
              {/* North Carolina Area */}
              <Area
                dataKey="northCarolina"
                type="natural"
                fill="#E3B9FF"
                stroke="#E3B9FF"
                stackId="a"
              />
              {/* South Carolina Area */}
              <Area
                dataKey="southCarolina"
                type="natural"
                fill="#FFA58A"
                stroke="#FFA58A"
                stackId="a"
              />
              {/* Tennessee Area */}
              <Area
                dataKey="tennessee"
                type="natural"
                fill="#4379EE"
                stroke="#4379EE"
                stackId="a"
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
