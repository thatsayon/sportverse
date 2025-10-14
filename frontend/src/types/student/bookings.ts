export interface StudentBookingResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: StudentBooking[];
}

export interface StudentBooking {
  id: string;
  teacher_name: string;
  teacher_id: string;
  session_time: string;   // ISO date string
  session_type: string;   // e.g. "virtual", "mindset"
  status: "Upcoming" | "Completed" | "Ongoing"; // restrict to known values
}


export interface TeacherRatingRequest {
  booked_session: string;
  teacher: string;
  rating: number;
  review: string;
  detail?: string
}

export interface TeacherRatingResponse {
  message: string;
  data: TeacherReview;
  detail?: string;
}

export interface TeacherReview {
  id: string;
  rating: string;
  review: string;
  teacher_name: string;
  student_name: string;
  created_at: string; // ISO 8601 date string
}

