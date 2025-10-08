export interface TrainerDetailsResponse {
  id: string;
  training_type: string;
  price: string;
  full_name: string;
  username: string;
  profile_pic_url: string;
  institute_name: string;
  coach_type: string[]; // array of strings
  virtual: boolean;
  mindset: boolean;
  in_person: boolean;
}