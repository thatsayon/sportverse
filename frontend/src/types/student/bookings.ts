export interface StudentBookingResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: StudentBooking[];
}

export interface StudentBooking {
  id: string;
  teacher_name: string;
  session_time: string;   // ISO date string
  session_type: string;   // e.g. "virtual", "mindset"
  status: "Upcoming" | "Completed"; // restrict to known values
}
