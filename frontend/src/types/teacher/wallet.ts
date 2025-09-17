export interface TrainerBankResponse {
  id: string;
  account_type: string[]; // e.g., ["checking"]
  full_name: string;
  bank_name: string;
  bank_acc_num: string;
  bank_routing_num: string;
  teacher: string; // teacher's ID (UUID)
}

export interface TrainerBankRequest {
  full_name: string;
  bank_name: string;
  bank_acc_num: number;
  bank_routing_num: number;
  account_type: string[];
}


export interface TrainerPaypalResponse {
  id: string;
  full_name: string;
  email: string;
  country: string;
  teacher: string;
}


export interface TrainerPaypalRequest {
  full_name: string;
  email: string;
  country: string;
}


// withdraw

export interface TrainerWithdraw {
  id: string;
  wallet_type: "bank" | "paypal" | "card"; // adjust if other types exist
  amount: string; // or number if you want to parse
  transaction_id: string;
  left_amount: string; // or number
  date: string; // or Date if you want to parse
}

export interface TrainerWithdrawResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: TrainerWithdraw[];
}


export interface TrainerWalletTransactionResponse {
  id: string;
  wallet_type: "bank" | "paypal" | "card"; // adjust other types if needed
  amount: string;
  transaction_id: string;
  left_amount: string;
  date: string; // could use Date type if you plan to parse it
}
export interface TrainerWalletTransactionRequest {
  wallet_type: string;// adjust other types if needed
  amount: number;
}