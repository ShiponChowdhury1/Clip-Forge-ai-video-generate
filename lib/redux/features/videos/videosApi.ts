import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  MusicItem,
  CreateVideoRequest,
  CreateVideoResponse,
  UpdateVideoRequest,
  Video,
  JobStatus,
  QueueResponse,
} from "@/types/video";

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
  keepUnusedDataFor: 300,
  endpoints: (builder) => ({
    // GET /api/v1/music/get?skip=0&limit=100
    getMusic: builder.query<MusicItem[], { skip?: number; limit?: number }>({
      query: ({ skip = 0, limit = 100 } = {}) => ({
        url: "/music/get",
        params: { skip, limit },
      }),
      keepUnusedDataFor: 600,
    }),

    // POST /api/v1/videos/create-video
    createVideo: builder.mutation<CreateVideoResponse, CreateVideoRequest>({
      query: (body) => ({
        url: "/videos/create-video",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Videos", id: "LIST" }],
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
          videosApi.util.updateQueryData("getAllVideos", { skip: 0, limit: 9 }, (draft) => {
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
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: "Videos" as const, id })), { type: "Videos", id: "LIST" }]
          : [{ type: "Videos", id: "LIST" }],
    }),

    // GET /api/v1/videos/get/{video_id}
    getVideo: builder.query<Video, number>({
      query: (videoId) => `/videos/get/${videoId}`,
      providesTags: (_result, _error, id) => [{ type: "Videos", id }],
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

export type {
  MusicItem,
  CreateVideoRequest,
  CreateVideoResponse,
  UpdateVideoRequest,
  Video,
  JobStatus,
  QueueVideoData,
  QueueItem,
  QueueResponse,
} from "@/types/video";

export const {
  useGetMusicQuery,
  useCreateVideoMutation,
  useGetAllVideosQuery,
  useGetVideoQuery,
  useDeleteVideoMutation,
  useUpdateVideoMutation,
  useGetQueueQuery,
} = videosApi;
