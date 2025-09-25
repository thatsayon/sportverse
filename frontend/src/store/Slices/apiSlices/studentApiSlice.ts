import { ApiResponse } from "@/types/student/trainerList";
import { apiSlice } from "./apiSlice";
import {
  CheckoutRequest,
  CheckoutResponse,
  sessionBookingsResponse,
} from "@/types/student/sessionBooking";
import { StudentBookingResponse } from "@/types/student/bookings";
import { VideoListResponse } from "@/types/admin/video";
import { AgoraTokenResponse } from "@/types/teacher/dashboard";

export const studentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getVritualTrainers: builder.query<ApiResponse, void>({
      query: () => ({
        url: "/student/virtual-list/",
        credentials: "include",
      }),
    }),
    // session
    getSessionDetails: builder.query<sessionBookingsResponse, string>({
      query: (id) => `/student/session-detail/${id}`,
    }),
    bookSession: builder.mutation<CheckoutResponse, CheckoutRequest>({
      query: (body) => ({
        url: `/student/session-book/${body.id}/`,
        method: "POST",
        body: {
          available_time_slot_id: body.available_time_slot_id,
          session_date: body.session_date,
        },
        credentials: "include",
      }),
    }),

    // bookings

    getBookings: builder.query<StudentBookingResponse, void>({
      query: () => "/student/booked-sessions/",
    }),
    // video
    getVideos: builder.query<VideoListResponse, void>({
      query: () => "/student/video-list/",
    }),
    generateStudentToken: builder.query<AgoraTokenResponse, string>({
      query: (id) => `/student/generate-video-token/${id}/`,
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetVritualTrainersQuery,
  // session
  useGetSessionDetailsQuery,
  useBookSessionMutation,
  // bookings
  useGetBookingsQuery,
  // video
  useGetVideosQuery,
  useLazyGenerateStudentTokenQuery,
} = studentApiSlice;
