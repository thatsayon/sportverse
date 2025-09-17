export interface CloudinaryUploadResponse {
  api_key: string;
  cloud_name: string;
  timestamp: number;
  signature: string;
  upload_id: string;
  folder: string;
  public_id: string;
}