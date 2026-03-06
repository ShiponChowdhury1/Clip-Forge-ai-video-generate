import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://10.10.12.3:8000/api";

export const videosApi = createApi({
  reducerPath: "videosApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/v1`,
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as { auth: { token: string | null } };
      const token = state.auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // GET /api/v1/music/get?skip=0&limit=100
    getMusic: builder.query<MusicItem[], { skip?: number; limit?: number }>({
      query: ({ skip = 0, limit = 100 } = {}) => ({
        url: "/music/get",
        params: { skip, limit },
      }),
    }),

    // POST /api/v1/videos/create-video
    createVideo: builder.mutation<CreateVideoResponse, CreateVideoRequest>({
      query: (body) => ({
        url: "/videos/create-video",
        method: "POST",
        body,
      }),
    }),
  }),
});

// Types
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
  subtitle_id: string;
  keywords: string;
  negative_keywords: string;
  music_id: number;
}

export interface CreateVideoResponse {
  job_id: string;
  status: string;
  queue_position: number;
}

export const { useGetMusicQuery, useCreateVideoMutation } = videosApi;
