export interface UserProfileResponse {
  id: string;
  profile_pic: string;
  full_name: string;
  username: string;
  email: string;
  about: string;
  training_sessions: number;
  coaches_booked: number;
  hours_trained: number;
  account_type: "basic" | "pro" | string; // if backend can return more types
  current_plan: string;
  renewal_date: string; // ISO date string
  favorite_sports: Sport[];
  all_sports: AllSports[];
}

export interface AllSports {
  id: string;
  name: string;
  is_favorite: boolean;
}
export interface Sport {
  id: string;
  name: string;
}


export interface subscriptionResponse{
  checkout_url: string;
}
export interface subscriptionRequest{
  amount: string;
  success_url: string;
  cancel_url: string;
}

export interface videoAccessResponse{
    can_access: boolean;
}


export interface CanAccessResponse{
  can_access_schedule: boolean;
}