export interface TrainerVerification {
  id: string;
  teacher_name: string;
  status: "verified" | "unverfied";
  picture: string | null;
  id_front: string | null;
  id_back: string | null;
  city: string;
  zip_code: string;
}

export interface TrainerVerificationResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: TrainerVerification[];
}


export interface VerificationType{
    id: string;
    status: string;
}