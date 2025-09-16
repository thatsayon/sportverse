export interface TrainerDashboardResponse {
  id: string;
  total_revenue: string; // returned as string in API
  total_paid_fees: string; // returned as string in API
  total_reservation: number;
  occupied_sits: string; // returned as string in API
  visit_count: VisitCount;
  income_history: IncomeHistory;
  booked_sessions: BookedSession[];
}

export interface VisitCount {
  last_7_days: Record<string, number>;   // e.g. { "2025-09-10": 0, "2025-09-11": 27 }
  last_30_days: Record<string, number>;  // same shape but for 30 days
}

export interface IncomeHistory {
  last_7_days: Record<string, number>;   // e.g. { "2025-09-16": 360.8 }
  last_30_days: Record<string, number>;
}

export interface BookedSession {
  id: string;
  student_name: string;
  session_time: string; // ISO date string, you can convert to Date if needed
  session_type: "virtual" | "in-person" | string;
  status: "Upcoming" | "Completed" | "Cancelled" | string;
}


export interface AgoraTokenResponse {
  token: string;
  appId: string;
  channelName: string;
  expireIn: number; // in seconds
}