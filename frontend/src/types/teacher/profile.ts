// export interface TrainerProfileResponse {
//   id: string;
//   full_name: string;
//   username: string;
//   city: string;
//   zip_code: string;
//   institute_name: string;
//   coach_type?: Array<"football" | "basketball">; // empty now, but assuming it's an array of strings

//   description: string;
//   status: "unverfied" | "verified"; // union for known values + fallback
//   is_profile_complete: boolean;
// }

export interface TrainerProfileUpdateResponse {
  id: string;
  full_name: string;
  username: string;
  city: string;
  zip_code: string;
  institute_name: string;
  coach_type?: Array<"football" | "basketball">; // empty now, but assuming it's an array of strings

  description: string;
  status: string; // e.g., "unverified"
  is_profile_complete: boolean;
}

export interface TrainerProfileUpdateRequset {
  full_name?: string;
  username?: string;
  city?: string;
  zip_code?: string;
  institute_name?: string;
  coach_type?: string[]; // empty now, but assuming it's an array of strings
  description?: string;
  status?: string; // e.g., "unverified"
  is_profile_complete?: boolean;
}


export interface AvailableSport {
  id: string;
  name: string;
}

export interface TrainerProfileResponse {
  id: string;
  full_name: string;
  username: string;
  city: string | null;
  zip_code: string | null;
  institute_name: string;
  coach_type: string[]; // IDs of sports
  description: string | null;
  status: string; // e.g., "verified" | "unverified"
  is_profile_complete: boolean;
  available_sports: AvailableSport[];
}



export interface TrainerPasswardResponse {
    detail: string;
}

export interface TrainerPasswardResquest {
    current_password: string;
    new_password: string;
}

export interface GoogleExChangeResponse{
 error?:{
  error?: string;
  error_description?: string;
 }
 access_token: string;
}

