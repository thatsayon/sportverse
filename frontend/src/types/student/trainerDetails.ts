export interface TrainingOption {
  exists: boolean;
  id: string | null;
  price: number | null;
}

export interface Rating {
  id: string;
  rating: string; // keeping as string since the API provides it as "4.0"
  review: string;
  student_name: string;
  student_username: string;
  created_at: string; // ISO date string
}

export interface TrainerDetailsResponse {
  id: string;
  training_type: 'virtual' | 'mindset' | 'in_person';
  price: string; // API returns this as string (e.g., "200.00")
  full_name: string;
  username: string;
  profile_pic_url: string | null;
  institute_name: string | null;
  coach_type: string[]; // array (can be empty)
  virtual: TrainingOption;
  mindset: TrainingOption;
  in_person: TrainingOption;
  ratings: Rating[];
  average_rating: number;
  total_reviews: number;
  student_count: number;
}
