export interface VideoResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Video[];
}

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string; // Can be URL or timestamp string (depending on backend consistency)
  consumer: "student" | "teacher" | string; // Extendable if more roles appear
  sports: string;
  created_at: string; // ISO timestamp
}
