export interface TrainerRevenueResponse {
  all_time: number;
  last_month: number;
  current_month: number;
  monthly_overview: Record<string, number>; // keys like "16-20 September"
}