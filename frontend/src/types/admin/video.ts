export interface VideoListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: VideoItem[];
}


export interface VideoDetailsResponse {
  video_id: string;
  title: string;
  description: string;
  consumer: "student" | "teacher" | string; // extend if more roles
  status: "ready" | "processing" | "failed" | string; // extend if more statuses
  hls_url: string; // HLS or MP4 video URL
}

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string; // Can be a URL or sometimes a timestamp (if incorrect data comes from API)
  consumer: "student" | "teacher" | string; // Extendable if more roles
  sport_name: string;
  created_at: string; // ISO timestamp
}



export interface VideoDetails {
  video_id: string;
  title: string;
  description: string;
  consumer: string;
  status: 'ready' | 'processing' | 'failed'; // optional, adjust based on possible statuses
  hls_url: string;
  related_videos:VideoItem[];
}