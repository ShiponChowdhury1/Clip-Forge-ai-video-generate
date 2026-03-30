// Video-related types

export interface MusicItem {
  id: number;
  name: string;
  category: string;
  file_path: string;
}

export interface CreateVideoRequest {
  title: string;
  script: string;
  format: string;
  style: string;
  voice: string;
  category: string;
  media_option: string;
  subtitle_id: number | null;
  keywords: string;
  negative_keywords: string;
  music_id: number;
}

export interface UpdateVideoRequest {
  title: string;
  format: string;
  style: string;
  voice: string;
  script: string;
  keywords: string;
  negative_keywords: string;
  music_id: number;
  subtitle_id: number | null;
  media_option: string;
}

export interface VideoGenerationResponse {
  job_id: string;
  status: string;
  queue_position?: number;
  video_id?: number;
  id?: number;
  message?: string;
  user_id?: number;
}

export type CreateVideoResponse = VideoGenerationResponse;

export interface Video {
  id: number;
  user_id: number;
  title: string;
  format: string;
  style: string;
  voice: string;
  script: string;
  keywords: string | null;
  negative_keywords: string | null;
  path: string;
  duration: number;
  music_id: number;
  subtitle_id: number | null;
  media_option: string;
  status: string;
  created_at: string;
}

export interface JobStatus {
  job_id: string;
  status: string;
  progress?: number;
  current_step?: string;
  video_id?: number;
  error?: string;
}

export interface QueueVideoData {
  title: string;
  script: string;
  format: string;
  style: string;
  voice: string;
  keywords: string;
  negative_keywords: string;
  music_id: number;
  subtitle_id: number | null;
  media_option: string;
  user_id: number;
}

export interface QueueItem {
  id: string;
  status: string;
  progress: number;
  message: string;
  video_data: QueueVideoData;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
  result: unknown;
  error: string | null;
}

export interface QueueResponse {
  queued: QueueItem[];
  processing: QueueItem[];
  total_queued: number;
  total_processing: number;
}
