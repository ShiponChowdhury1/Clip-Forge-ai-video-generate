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
  tagTypes: ["Videos"],
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
      invalidatesTags: ["Videos"],
    }),

    // DELETE /api/v1/videos/delete/{id}
    deleteVideo: builder.mutation<{ status: string }, number>({
      query: (id) => ({
        url: `/videos/delete/${id}`,
        method: "DELETE",
      }),
      onQueryStarted: async (id, { dispatch, queryFulfilled }) => {
        // Optimistically remove from all getAllVideos cache entries
        const patchResult = dispatch(
          videosApi.util.updateQueryData("getAllVideos", { skip: 0, limit: 100 }, (draft) => {
            const index = draft.findIndex((v) => v.id === id);
            if (index !== -1) draft.splice(index, 1);
          })
        );
        const patchResult2 = dispatch(
          videosApi.util.updateQueryData("getAllVideos", { skip: 0, limit: 8 }, (draft) => {
            const index = draft.findIndex((v) => v.id === id);
            if (index !== -1) draft.splice(index, 1);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
          patchResult2.undo();
        }
      },
    }),

    // GET /api/v1/videos/get-all?skip=0&limit=100
    getAllVideos: builder.query<Video[], { skip?: number; limit?: number }>({
      query: ({ skip = 0, limit = 100 } = {}) => ({
        url: "/videos/get-all",
        params: { skip, limit },
      }),
      providesTags: ["Videos"],
    }),

    // GET /api/v1/videos/get/{video_id}
    getVideo: builder.query<Video, number>({
      query: (videoId) => `/videos/get/${videoId}`,
      providesTags: ["Videos"],
    }),

    // GET /api/v1/videos/job-status/{job_id}
    getJobStatus: builder.query<JobStatus, string>({
      query: (jobId) => `/videos/job-status/${jobId}`,
    }),

    // PUT /api/v1/videos/update/{id}
    updateVideo: builder.mutation<Video, { id: number; body: UpdateVideoRequest }>({
      query: ({ id, body }) => ({
        url: `/videos/update/${id}`,
        method: "PUT",
        body,
      }),
      onQueryStarted: async ({ id }, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            videosApi.util.updateQueryData("getVideo", id, () => data)
          );
        } catch {}
      },
    }),

    // GET /api/v1/videos/queue
    getQueue: builder.query<QueueResponse, void>({
      query: () => "/videos/queue",
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
  subtitle_id: number;
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
  subtitle_id: number;
  media_option: string;
}

export interface CreateVideoResponse {
  job_id: string;
  status: string;
  queue_position: number;
}

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
  subtitle_id: number;
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
  subtitle_id: number;
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

export const {
  useGetMusicQuery,
  useCreateVideoMutation,
  useGetAllVideosQuery,
  useGetVideoQuery,
  useDeleteVideoMutation,
  useUpdateVideoMutation,
  useGetQueueQuery,
} = videosApi;
