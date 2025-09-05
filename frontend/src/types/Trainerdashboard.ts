export interface DashboardMetrics {
  totalRevenue: number;
  totalPaidFees: number;
  totalReservation: number;
  occupiedSits: number;
  revenueChange: number;
  feesChange: number;
  reservationChange: number;
  occupancyChange: number;
}

export interface Reservation {
  id: string;
  name: string;
  avatar: string;
  time: string;
  table: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
}

export interface ChartData {
  day: string;
  value: number;
}

export interface VisitData {
  day: string;
  visits: number;
  peak?: number;
}

export interface TopStudent {
  id: string;
  name: string;
  avatar: string;
  hours: string;
}