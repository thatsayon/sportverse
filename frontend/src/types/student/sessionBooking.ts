export interface sessionBookingsResponse {
  id: string;
  training_type: string;
  price: string;
  full_name: string;
  username: string;
  institute_name: string | null;
  coach_type: string;
  available_days: AvailableDay[];
  teacher_info: TeacherInfo;
}

export interface AvailableDay {
  id: string;
  day: string;
  timeslots: Timeslot[];
}

export interface Timeslot {
  id: string;
  start_time: string; // HH:mm:ss
  end_time: string;   // HH:mm:ss
  day: string;
}

export interface TeacherInfo {
  institute_name: string | null;
  coach_type: string[];
}


export interface CheckoutResponse {
  checkout_url: string;
  booked_session_id: string;
  error?: string;
}

export interface CheckoutRequest {
  id: string | undefined;
  available_time_slot_id: string | undefined;
  session_date: string; // ISO date in YYYY-MM-DD format
}