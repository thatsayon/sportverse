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



export interface WithdrawDetailsResponse {
  id: string;
  teacher_name: string;
  wallet_type: "bank" | "paypal" | "crypto" | string; // extendable if more types
  transaction_id: string;
  amount: string;       // kept as string since API returns string
  left_amount: string;  // kept as string for consistency
  status: "pending" | "approved" | "rejected" | string;
  date: string; // format: YYYY-MM-DD
  wallet_info: WalletInfo;
}

export interface WalletInfo {
  full_name: string;
  bank_name: string;
  bank_acc_num: string;
  bank_routing_num: string;
  account_type: string[]; // e.g., ["checking", "savings"]
}