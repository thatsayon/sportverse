// Single booked session
export interface BookedSession {
  id: string;
  student_name: string;
  session_time: string; // ISO datetime string
  session_type: "virtual" | "in_person" | string; // extendable
  status: "Upcoming" | "Ongoing" | "Completed" | "Cancelled" | string; // extendable
}

// Paginated response for booked sessions
export interface BookedSessionResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: BookedSession[];
}
