// app/dashboard/page.tsx
"use client";

import React from "react";
import StatsCards from "@/components/dashboard/StatsCards";
import TrainersTable from "@/components/dashboard/TrainersTable";
import TraineesTable from "@/components/dashboard/TraineesTable";
import { DonutChart, BarChartComponent } from "@/components/dashboard/Charts";
import { useGetDashboardQuery } from "@/store/Slices/apiSlices/adminApiSlice";
import Loading from "@/components/Element/Loading";
import ErrorLoadingPage from "@/components/Element/ErrorLoadingPage";

const AdminDashboard: React.FC = () => {
  const { data, isLoading, isError } = useGetDashboardQuery();

  console.log("Geting admin dashboard data:", data);
  if (isLoading) return <Loading />;
  if (isError) return <ErrorLoadingPage />;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {data && (
        <StatsCards
          financials={data.financials!}
          user_count={data.user_count!}
        />
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Bar Chart */}
          {data && <BarChartComponent data={data?.income.last_6_months} />}
          {/* Trainers Table */}
          {data && <TrainersTable data={data.teachers.latest!} />}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Donut Chart */}

          {data && <DonutChart data={data?.sessions.breakdown} />}
          {/* Trainees Table */}
          {data && <TraineesTable data={data.students.latest} />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
