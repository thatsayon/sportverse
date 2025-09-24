import { AdminBookingResponse } from "@/types/admin/bookings";
import { apiSlice } from "./apiSlice";
import { AdminDashboardResponse } from "@/types/admin/dashboard";
import { AdminTeacherListResponse } from "@/types/admin/teachers";
import { StudentsResponse } from "@/types/admin/students";
import {
  WithdrawDetailsResponse,
  WithdrawResponse,
  WithdrawUpadateResponse,
  WithdrawUpdateRequest,
} from "@/types/admin/withdraw";
import { AdminResponse, UpdatePasswordRequest } from "@/types/admin/profile";
import { AnalyticsResponse } from "@/types/admin/analytics";
import { SportCategory, SportCategoryResponse } from "@/types/admin/sports";
import { ConversationDetail, ConversationResponse } from "@/types/admin/chatConversation";

export const adminApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Dashboard API
    getDashboard: builder.query<AdminDashboardResponse, void>({
      query: () => "/control/dashboard/",
    }),
    // Bookings API
    getBookings: builder.query<AdminBookingResponse, void>({
      query: () => "/control/booking/",
    }),
    // Trainer
    getTrainers: builder.query<AdminTeacherListResponse, void>({
      query: () => "/control/trainer-list/",
    }),
    // Students
    getStudents: builder.query<StudentsResponse, void>({
      query: () => "/control/trainee-list/",
    }),
    // Withdraw
    getWithdraw: builder.query<WithdrawResponse, void>({
      query: () => "/control/withdraw",
      providesTags: ["Withdraw"],
    }),
    updateWithdraw: builder.mutation<
      WithdrawUpadateResponse,
      WithdrawUpdateRequest
    >({
      query: (data) => ({
        url: `control/withdraw/${data.id}/`,
        method: "POST",
        body: { status: data.status },
        credentials: "include",
      }),
      invalidatesTags: ["Withdraw"],
    }),
    getWithdrawDetails: builder.query<WithdrawDetailsResponse, string>({
      query: (id)=> `/control/withdraw-detail/${id}`,
    }),

    getAdminProfile: builder.query<AdminResponse, void>({
      query: () => "/control/profile/",
      providesTags: ["AdminProfile"],
    }),
    updatePassword: builder.mutation<string, UpdatePasswordRequest>({
      query: (body) => ({
        url: "/control/password-update/",
        method: "PATCH",
        body,
        credentials: "include",
      }),
    }),
    getAdminAnalytics: builder.query<AnalyticsResponse, void>({
      query: () => "/control/analytics/",
    }),
    getAdminSports: builder.query<SportCategoryResponse, void>({
      query: () => "/control/get-or-create-sport/",
    }),
    getAdminSportById: builder.query<SportCategory, string>({
      query: (id) => `/control/update-sport/${id}`,
    }),
    getAdminConversation: builder.query<
      ConversationResponse,
      { search?: string; page?: number }
    >({
      query: ({ search, page } = {}) => {
        const params = new URLSearchParams();

        if (search) {
          params.append("search", search);
        }

        if (page) {
          params.append("page", page.toString());
        }

        const queryString = params.toString();
        return `/control/chatlog/${queryString ? `?${queryString}` : ""}`;
      },
    }),
    getConversationDetail: builder.query<
      ConversationDetail,
      { id: string; page?: number }
    >({
      query: ({ id, page }) => {
        const params = new URLSearchParams();

        if (page) {
          params.append("page", page.toString());
        }

        const queryString = params.toString();
        return `/control/chatlog/${id}/${queryString ? `?${queryString}` : ""}`;
      },
    }),
  }),
});

export const {
  //Dashboard
  useGetDashboardQuery,
  // Bookings
  useGetBookingsQuery,
  // Trainers
  useGetTrainersQuery,
  // Students
  useGetStudentsQuery,
  // Withdraw
  useGetWithdrawQuery,
  useUpdateWithdrawMutation,
  useLazyGetWithdrawDetailsQuery,
  // Admin Profile
  useGetAdminProfileQuery,
  useUpdatePasswordMutation,
  // Analytics
  useGetAdminAnalyticsQuery,
  // Sports
  useGetAdminSportsQuery,
  useLazyGetAdminSportByIdQuery,
  // Conversation
  useGetAdminConversationQuery,
  useGetConversationDetailQuery,
} = adminApiSlice;
