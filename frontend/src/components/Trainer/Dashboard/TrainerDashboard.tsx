import React, { useState, useMemo } from "react";
import { DollarSign, CreditCard, Calendar, Users } from "lucide-react";
import { MetricsCard } from "./MetricsCard";
import { CurrentReservations } from "./CurrentReservations";
import { AverageVisitsChart } from "./AverageVisitsChart";
import {
  DashboardMetrics,
  TopStudent,
} from "@/types/Trainerdashboard";
import { useGetTeacherDashboardQuery } from "@/store/Slices/apiSlices/trainerApiSlice";
import Loading from "@/components/Element/Loading";
import ErrorLoadingPage from "@/components/Element/ErrorLoadingPage";
import { RevenueChart } from "./RevenueChart";
import { trainerTransformData } from "@/lib/TrainerTransformData";

interface TrainerDashboardProps {
  topStudents: TopStudent[];
  onViewAllReservations?: () => void;
  onEditReservation?: (id: string) => void;
  onViewAllStudents?: () => void;
}

export const TrainerDashboard: React.FC<TrainerDashboardProps> = ({
  onViewAllReservations = () => {},
  onEditReservation = () => {},
}) => {
  // State declaration ---------------------------

  const [reservationPeriod, setReservationPeriod] = useState<
    "Weekly" | "Monthly"
  >("Weekly");
  const [visitsPeriod, setVisitsPeriod] = useState<"Weekly" | "Monthly">(
    "Weekly"
  );

  // data fetching ---------------------------

  const { data, isLoading, isError } = useGetTeacherDashboardQuery();
  console.log("Dashboard data:", data);

  // Transform data function ---------------------------

  const revenueChartData = useMemo(() => {
    if (!data?.income_history) return [];

    return reservationPeriod === "Weekly"
      ? trainerTransformData(data.income_history.last_7_days ?? {}, "Weekly")
      : trainerTransformData(data.income_history.last_30_days ?? {}, "Monthly");
  }, [data, reservationPeriod]);

 const averageVisitsChartData = useMemo(() => {
  if (!data?.visit_count) return [];

  return visitsPeriod === "Weekly"  // Changed from reservationPeriod
    ? trainerTransformData(data.visit_count.last_7_days ?? {}, "Weekly")
    : trainerTransformData(data.visit_count.last_30_days ?? {}, "Monthly");
}, [data, visitsPeriod]);  // Changed dependency from reservationPeriod


  const peakValue = useMemo(() => {
    return visitsPeriod === "Weekly" ? 2203 : 3450;
  }, [visitsPeriod]);

  //Loading and Error Handling ---------------------------

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (isError) {
    return <ErrorLoadingPage />;
  }

  return (
    <div className="space-y-6 p-4 lg:p-6 bg-white min-h-screen">
      {/* Metrics Cards - 4 columns on desktop, 2 on tablet, 1 on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <MetricsCard
          title="Total revenue"
          value={`$${data?.total_revenue}`}
          change={1.23}
          icon={<DollarSign className="h-5 w-5 text-green-600" />}
        />
        <MetricsCard
          title="Total paid fees"
          value={`$${data?.total_paid_fees}`}
          change={2.34}
          icon={<CreditCard className="h-5 w-5 text-yellow-600" />}
        />
        <MetricsCard
          title="Total reservation"
          value={data?.total_reservation || 0}
          change={1.24}
          icon={<Calendar className="h-5 w-5 text-blue-600" />}
        />
        <MetricsCard
          title="Occupied sits"
          value={`${data?.occupied_sits}%`}
          change={3.23}
          icon={<Users className="h-5 w-5 text-red-600" />}
          variant="danger"
        />
      </div>

      {/* Charts and Top Students - 2 columns on desktop, 1 on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <CurrentReservations
          reservations={data?.booked_sessions || []}
          onViewAll={onViewAllReservations}
          onEdit={onEditReservation}
        />

        {/* Revenue Chart - Fixed props */}
        <RevenueChart
          data={revenueChartData}
          period={reservationPeriod}
          onPeriodChange={setReservationPeriod}
        />

        <div className="lg:col-span-2">
          <AverageVisitsChart
            data={averageVisitsChartData}
            period={visitsPeriod}
            onPeriodChange={setVisitsPeriod}
          />
        </div>
      </div>
    </div>
  );
};
