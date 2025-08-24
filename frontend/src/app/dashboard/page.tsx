// app/dashboard/page.tsx
"use client";

import React from "react";
import StatsCards from "@/components/dashboard/StatsCards";
import TrainersTable from "@/components/dashboard/TrainersTable";
import TraineesTable from "@/components/dashboard/TraineesTable";
import { DonutChart, BarChartComponent } from "@/components/dashboard/Charts";

const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <StatsCards />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Trainers Table */}
          <TrainersTable />
          {/* Trainees Table */}
          <TraineesTable />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Donut Chart */}

          <DonutChart />
          {/* Bar Chart */}
          <BarChartComponent />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
