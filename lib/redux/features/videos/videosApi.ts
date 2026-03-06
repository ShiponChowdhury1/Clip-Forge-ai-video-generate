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
  path: string;
  duration: number;
  music_id: number;
  subtitle_id: number;
  media_option: string;
  status: string;
  created_at: string;
}

export const { useGetMusicQuery, useCreateVideoMutation, useGetAllVideosQuery, useDeleteVideoMutation } = videosApi;
