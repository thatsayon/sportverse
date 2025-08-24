// components/dashboard/StatsCards.tsx
"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, Wallet, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCard {
  title: string;
  value: string | number;
  change: string;
  changeType: "positive" | "negative";
  icon: React.ElementType;
  bgColor: string;
  iconColor: string;
}

const statsData: StatCard[] = [
  {
    title: "Total balance",
    value: "$9,569",
    change: "+3.67%",
    changeType: "positive",
    icon: Wallet,
    bgColor: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    title: "Total income",
    value: "$21,869",
    change: "+3.67%",
    changeType: "positive",
    icon: DollarSign,
    bgColor: "bg-yellow-100",
    iconColor: "text-yellow-600",
  },
  {
    title: "Total savings",
    value: "2,100",
    change: "+3.67%",
    changeType: "positive",
    icon: TrendingUp,
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    title: "Total expense",
    value: "3,212",
    change: "-2.40%",
    changeType: "negative",
    icon: TrendingDown,
    bgColor: "bg-red-100",
    iconColor: "text-red-600",
  },
];

const StatsCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
      {statsData.map((stat, index) => (
        <Card key={index} className="border-0 shadow-sm">
          {/* <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">

          </CardHeader> */}
          <CardContent>
            <div className="mb-3">
              <div className={cn("p-2 rounded-full w-fit  mb-2", stat.bgColor)}>
                <stat.icon className={cn("h-4 w-4", stat.iconColor)} />
              </div>
              <h3 className="font-semibold text-[#949AA6]">{stat.title}</h3>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{stat.value}</div>
              <div
                className={cn(
                  "text-sm font-medium",
                  stat.changeType === "positive"
                    ? "text-green-600"
                    : "text-red-600"
                )}
              >
                {stat.change}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;
