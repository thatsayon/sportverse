export interface Student {
  id: string;
  full_name: string;
  username: string;
  favorite_sports: string[];
  account_type: string;
  total_session: number;
  total_spent: number;
}

export interface StudentsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Student[];
}