export interface AdminTeacherListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: AdminTeacher[];
}

export interface AdminTeacher {
  id: string;
  full_name: string;
  username: string;
  location: string | null;
  net_income: number;
  coach_type: string[];
}