// app/dashboard/page.tsx
"use client";
import React from "react";
import { useJwt } from "@/hooks/useJwt";
import AdminDashboard from "@/components/Admin/Dashboard/AdminDashboard";
import { useRouter } from "next/navigation";
import { TrainerDashboard } from "@/components/Trainer/Dashboard/TrainerDashboard";
import {
  DashboardMetrics,  
  ChartData,
  VisitData,
} from "@/types/Trainerdashboard";
import { reservations } from "@/data/TrainerDashboardBookings";
// Sample data - replace with your actual API calls
const sampleMetrics: DashboardMetrics = {
  totalRevenue: 12869,
  totalPaidFees: 2869,
  totalReservation: 20,
  occupiedSits: 72,
  revenueChange: 3.67,
  feesChange: 3.67,
  reservationChange: 3.67,
  occupancyChange: -2.4,
};

const sampleReservationChartData: ChartData[] = [
  { day: "Mon", value: 110 },
  { day: "Tue", value: 85 },
  { day: "Wed", value: 75 },
  { day: "Thu", value: 95 },
  { day: "Fri", value: 70 },
  { day: "Sat", value: 55 },
  { day: "Sun", value: 72 },
];

const sampleVisitsChartData: VisitData[] = [
  { day: "Mon", visits: 25 },
  { day: "Tue", visits: 38 },
  { day: "Wed", visits: 15 },
  { day: "Thu", visits: 48, peak: 2203 },
  { day: "Fri", visits: 78 },
  { day: "Sat", visits: 45 },
  { day: "Sun", visits: 68 },
];

const DashboardPage: React.FC = () => {
  const { decoded } = useJwt();
  const route = useRouter();

  const handleViewAllReservations = () => {
    // //console.log("View all reservations clicked");
    // Navigate to reservations page or open modal
  };

  const handleEditReservation = (id: string) => {
    // //console.log("Edit reservation:", id);
    // Open edit modal or navigate to edit page
  };

  const handleViewAllStudents = () => {
    // //console.log("View all students clicked");
    // Navigate to students page or open modal
  };

  if (decoded?.role === "teacher")
    return (
      <div className="min-h-screen bg-white -mt-5">
        <TrainerDashboard
          metrics={sampleMetrics}
          reservations={reservations}
          reservationChartData={sampleReservationChartData}
          visitsChartData={sampleVisitsChartData}
          onViewAllReservations={handleViewAllReservations}
          onEditReservation={handleEditReservation}
          onViewAllStudents={handleViewAllStudents}
        />
      </div>
    );
  if (decoded?.role === "admin")
    return (
      <div className="min-h-screen bg-white">
        <AdminDashboard />
      </div>
    );
};

export default DashboardPage;
