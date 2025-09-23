export interface AnalyticsAllTime {
  income: number;
  income_change: number;
  profit: number;
  profit_change: number;
  expense: number;
  expense_change: number;
  profit_rate: number;
}

export interface AnalyticsRevenue {
  subscription: number;
  consultancy: number;
}

export interface AnalyticsTotals {
  coaches: number;
  students: number;
}

export interface AnalyticsDailyChartItem {
  date: string;
  income: number;
  expense: number;
  profit: number;
}

export interface AnalyticsResponse {
  all_time: AnalyticsAllTime;
  revenue: AnalyticsRevenue;
  totals: AnalyticsTotals;
  daily_chart: AnalyticsDailyChartItem[];
}
