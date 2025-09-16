import React, { useState, useMemo } from "react";
import { DollarSign, CreditCard, Calendar, Users } from "lucide-react";
import { MetricsCard } from "./MetricsCard";
import { CurrentReservations } from "./CurrentReservations";
import { AverageVisitsChart } from "./AverageVisitsChart";
import {
  DashboardMetrics,
  Reservation,
  ChartData,
  VisitData,
  TopStudent,
} from "@/types/Trainerdashboard";
import { useGetTeacherDashboardQuery } from "@/store/Slices/apiSlices/trainerApiSlice";
import { LoadingSpinner } from "@/components/Element/LoadingSpinner";
import Loading from "@/components/Element/Loading";
import ErrorLoadingPage from "@/components/Element/ErrorLoadingPage";
import { RevenueChart } from "./RevenueChart";

// Dummy data for different periods
const weeklyReservationData: ChartData[] = [
  { day: "Mon", value: 110 },
  { day: "Tue", value: 85 },
  { day: "Wed", value: 75 },
  { day: "Thu", value: 95 },
  { day: "Fri", value: 70 },
  { day: "Sat", value: 55 },
  { day: "Sun", value: 72 },
];

const monthlyReservationData: ChartData[] = [
  { day: "Week 1", value: 420 },
  { day: "Week 2", value: 380 },
  { day: "Week 3", value: 450 },
  { day: "Week 4", value: 390 },
];

const weeklyVisitsData: VisitData[] = [
  { day: "Mon", visits: 25 },
  { day: "Tue", visits: 38 },
  { day: "Wed", visits: 15 },
  { day: "Thu", visits: 78 },
  { day: "Fri", visits: 65 },
  { day: "Sat", visits: 45 },
  { day: "Sun", visits: 52 },
];

const monthlyVisitsData: VisitData[] = [
  { day: "Week 1", visits: 45 },
  { day: "Week 2", visits: 62 },
  { day: "Week 3", visits: 38 },
  { day: "Week 4", visits: 75 },
];

interface TrainerDashboardProps {
  metrics: DashboardMetrics;
  reservations: Reservation[];
  topStudents: TopStudent[];
  onViewAllReservations?: () => void;
  onEditReservation?: (id: string) => void;
  onViewAllStudents?: () => void;
}

export const TrainerDashboard: React.FC<TrainerDashboardProps> = ({
  metrics,
  reservations,
  onViewAllReservations = () => {},
  onEditReservation = () => {},
}) => {
  const [reservationPeriod, setReservationPeriod] = useState<
    "Weekly" | "Monthly"
  >("Weekly");
  const [visitsPeriod, setVisitsPeriod] = useState<"Weekly" | "Monthly">(
    "Weekly"
  );
  const { data, isLoading, isError } = useGetTeacherDashboardQuery();

  console.log("Dashboard data:", data);
  
  // Transform data function
  function transformData(
    rawData: Record<string, number>,
    type: "Weekly" | "Monthly"
  ): ChartData[] {
    if (!rawData) return [];
    
    return Object.entries(rawData).map(([date, value]) => ({
      day: type === "Weekly" 
        ? new Date(date).toLocaleDateString("en-US", { weekday: "short" }) 
        : new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      value,
    }));
  }

  const revenueChartData = useMemo(() => {
    if (!data?.income_history) return [];
    
    return reservationPeriod === "Weekly"
      ? transformData(data.income_history.last_7_days ?? {}, "Weekly")
      : transformData(data.income_history.last_30_days ?? {}, "Monthly");
  }, [data, reservationPeriod]);

  const visitsChartData = useMemo(() => {
    return visitsPeriod === "Weekly" ? weeklyVisitsData : monthlyVisitsData;
  }, [visitsPeriod]);

  const peakValue = useMemo(() => {
    return visitsPeriod === "Weekly" ? 2203 : 3450;
  }, [visitsPeriod]);

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
          change={metrics.revenueChange}
          icon={<DollarSign className="h-5 w-5 text-green-600" />}
        />
        <MetricsCard
          title="Total paid fees"
          value={`$${data?.total_paid_fees}`}
          change={metrics.feesChange}
          icon={<CreditCard className="h-5 w-5 text-yellow-600" />}
        />
        <MetricsCard
          title="Total reservation"
          value={data?.total_reservation}
          change={metrics.reservationChange}
          icon={<Calendar className="h-5 w-5 text-blue-600" />}
        />
        <MetricsCard
          title="Occupied sits"
          value={`${data?.occupied_sits}%`}
          change={metrics.occupancyChange}
          icon={<Users className="h-5 w-5 text-red-600" />}
          variant="danger"
        />
      </div>

      {/* Charts and Top Students - 2 columns on desktop, 1 on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <CurrentReservations
          reservations={reservations}
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
            data={visitsChartData}
            period={visitsPeriod}
            peakValue={peakValue}
            onPeriodChange={setVisitsPeriod}
          />
        </div>
      </div>
    </div>
  );
};