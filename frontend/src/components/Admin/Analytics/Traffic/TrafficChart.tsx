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
import AnalyticsCard from "@/components/Element/analyticsData";
import { useGetAdminAnalyticsQuery } from "@/store/Slices/apiSlices/adminApiSlice";

// Updated interfaces
export interface AnalyticsAllTime {
  income: number;
  income_change: number;
  profit: number;
  profit_change: number;
  expense: number;
  expense_change: number;
  profit_rate: number;
}

export interface AnalyticsRevenue {
  subscription: number;
  consultancy: number;
}

export interface AnalyticsTotals {
  coaches: number;
  students: number;
}

export interface AnalyticsDailyChartItem {
  date: string;
  income: number;
  expense: number;
  profit: number;
}

export interface AnalyticsResponse {
  all_time: AnalyticsAllTime;
  revenue: AnalyticsRevenue;
  totals: AnalyticsTotals;
  daily_chart: AnalyticsDailyChartItem[];
}

export const description = "An interactive area chart";

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  income: {
    label: "Income",
    color: "var(--chart-1)",
  },
  expense: {
    label: "Expense",
    color: "var(--chart-2)",
  },
  profit: {
    label: "Profit",
    color: "var(--chart-3)",
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
  const { data, isLoading, error } = useGetAdminAnalyticsQuery();
  
  React.useEffect(() => {
    const currentMonth = new Date().getMonth(); // Get the current month (0-based index)
    setSelectedMonth(currentMonth.toString()); // Set the default selected month (0-based index)
  }, []);

  // Transform API data to analytics cards format
  const transformedAnalyticsData = React.useMemo(() => {
    if (!data?.all_time) return [];

    const formatChange = (change: number) => {
      const absChange = Math.abs(change);
      return `${change >= 0 ? '+' : ''}${absChange.toFixed(1)}%`;
    };

    const getChangeType = (change: number): 'positive' | 'negative' | 'neutral' => {
      if (change > 0) return 'positive';
      if (change < 0) return 'negative';
      return 'neutral';
    };

    return [
      {
        id: "1",
        title: "Total Income",
        value: `$${data.all_time.income.toFixed(2)}`,
        change: formatChange(data.all_time.income_change),
        changeType: getChangeType(data.all_time.income_change),
      },
      {
        id: "2", 
        title: "Total Profit",
        value: `$${data.all_time.profit.toFixed(2)}`,
        change: formatChange(data.all_time.profit_change),
        changeType: getChangeType(data.all_time.profit_change),
      },
      {
        id: "3",
        title: "Total Expense", 
        value: `$${data.all_time.expense.toFixed(2)}`,
        change: data.all_time.expense_change !== 0 ? formatChange(data.all_time.expense_change) : "0%",
        changeType: getChangeType(data.all_time.expense_change),
      },
      {
        id: "4",
        title: "Profit Rate",
        value: `${data.all_time.profit_rate.toFixed(1)}%`,
      },
      {
        id: "5",
        title: "Total Coaches",
        value: data.totals.coaches.toString(),
      },
      {
        id: "6", 
        title: "Total Students",
        value: data.totals.students.toString(),
      },
      {
        id: "7",
        title: "Subscription Revenue",
        value: `$${data.revenue.subscription.toFixed(2)}`,
      },
      {
        id: "8",
        title: "Consultancy Revenue", 
        value: `$${data.revenue.consultancy.toFixed(2)}`,
      },
    ];
  }, [data]);

  // Filter chart data by selected month
  const filteredData = React.useMemo(() => {
    if (!data?.daily_chart) return [];
    
    return data.daily_chart.filter((item) => {
      // Parse the date format "Sep 01" to get month
      const monthMap: Record<string, number> = {
        'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
        'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
      };
      
      const monthStr = item.date.split(' ')[0];
      const itemMonth = monthMap[monthStr];
      
      return itemMonth?.toString() === selectedMonth;
    });
  }, [data, selectedMonth]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading analytics data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg text-red-500">Error loading analytics data</div>
      </div>
    );
  }

  return (
    <div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {transformedAnalyticsData.map((item) => (
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
          <div className="grid flex-1 gap-1 text-center sm:text-left">
            <CardTitle>Financial Analytics Chart</CardTitle>
            <CardDescription>
              Showing income, expenses, and profit for the selected month
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="fillIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#DBA5FF" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#DBA5FF" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF8F6DCC" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#FF8F6DCC" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="fillProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4379EE" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#4379EE" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => value} // Since date is already formatted as "Sep 01"
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => `Date: ${value}`}
                    indicator="dot"
                  />
                }
              />
              
              {/* Income Area */}
              <Area
                dataKey="income"
                type="natural"
                fill="url(#fillIncome)"
                fillOpacity={0.4}
                stroke="#DBA5FF"
                stackId="a"
              />
              
              {/* Expense Area */}
              <Area
                dataKey="expense"
                type="natural"
                fill="url(#fillExpense)"
                fillOpacity={0.4}
                stroke="#FF8F6DCC"
                stackId="b"
              />
              
              {/* Profit Area */}
              <Area
                dataKey="profit"
                type="natural"
                fill="url(#fillProfit)"
                fillOpacity={0.4}
                stroke="#4379EE"
                stackId="c"
              />
              
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}