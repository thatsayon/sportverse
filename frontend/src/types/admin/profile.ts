export interface AdminResponse {
  id: string;
  full_name: string;
  profile_pic: string | null;
  profile_pic_url: string | null;
}


export interface UpdatePasswordRequest {
  old_password: string;
  new_password: string;
  confirm_password: string;
}