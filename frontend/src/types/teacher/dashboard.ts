export interface TeacherDashboardResponse {
  id: string;
  total_revenue: string; // e.g. "0.00"
  total_paid_fees: string; // e.g. "0.00"
  total_reservation: number;
  occupied_sits: string; // e.g. "0.00"

  visit_count: {
    last_7_days: Record<string, number>;   // { "2025-09-10": 0, ... }
    last_30_days: Record<string, number>;  // { "2025-08-18": 0, ... }
  };

  income_history: {
    last_7_days: Record<string, number>;   // { "2025-09-10": 0.0, ... }
    last_30_days: Record<string, number>;  // { "2025-08-18": 0.0, ... }
  };
}
