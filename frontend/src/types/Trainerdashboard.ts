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
  sessionType: 'Virtual' | 'Mindset' | 'In-Person';
  price: string;
  status: 'Complete' | 'On Going' | 'Up Coming';
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