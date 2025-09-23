export interface Withdraw {
  id: string;
  teacher_name: string;
  transaction_id: string;
  location: string;
  date: string; // ISO date string (e.g., "2025-09-22")
  amount: string; // comes as string from API (e.g., "400.00")
  status: "pending" | "approved" | "rejected"; // restrict if API uses fixed values
}

export interface WithdrawResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Withdraw[];
}


export interface WithdrawUpdateRequest {
    status: "approve"|"reject" | "pending";
    id: string;
}

export interface WithdrawUpadateResponse{
    msg?: string;
    error?: string;

}