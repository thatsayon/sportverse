// components/dashboard/StatsCards.tsx
"use client";

import React from "react";
import {
  DollarSign,
  TrendingUp,
  Wallet,
  TrendingDown,
} from "lucide-react";
import { Financials } from "@/types/admin/dashboard";
import DashboardCard from "../Element/DashboardCard";
;

interface StatsCardProps {
  financials: Financials;
  user_count: number;
}

const StatsCards: React.FC<StatsCardProps> = ({ financials, user_count }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
      <DashboardCard bgColor="bg-green-100" iconColor="text-green-600" total={financials.income.total} icon={Wallet} rate={financials.income.rate} title="Current Month Income"/>
      <DashboardCard bgColor="bg-yellow-100" iconColor="text-yellow-600" total={financials.expense.total} icon={DollarSign} rate={financials.expense.rate} title="Current Month Expence"/>
      <DashboardCard bgColor="bg-blue-100" iconColor="text-blue-600" total={financials.profit.total} icon={TrendingUp} rate={financials.profit.rate} title="Current Month Profit"/>
      <DashboardCard bgColor="bg-red-100" iconColor="text-red-600" total={user_count} icon={TrendingDown} title="Current Month New User"/>
      
    </div>
  );
};

export default StatsCards;
