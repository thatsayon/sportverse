export interface AdminBooking {
  id: string;
  teacher_name: string;
  student_name: string;
  session_time: string; // ISO datetime string
  session_price: string; // price comes as string from API
  training_type: string; // e.g., "mindset" | "virtual"
  state_name: string | null;
  status: "complete" | "ongoing" | "upcoming";
}

export interface AdminBookingResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: AdminBooking[];
}