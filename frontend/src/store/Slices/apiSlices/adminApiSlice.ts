import { AdminBookingResponse } from "@/types/admin/bookings";
import { apiSlice } from "./apiSlice";
import { AdminDashboardResponse } from "@/types/admin/dashboard";
import { AdminTeacherListResponse } from "@/types/admin/teachers";
import { StudentsResponse } from "@/types/admin/students";
import {
  WithdrawResponse,
  WithdrawUpadateResponse,
  WithdrawUpdateRequest,
} from "@/types/admin/withdraw";
import { AdminResponse, AdminUpdateRequest, UpdatePasswordRequest } from "@/types/admin/profile";
import { AnalyticsResponse } from "@/types/admin/analytics";
import { SportCategory, SportCategoryResponse } from "@/types/admin/sports";

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
    getTrainers: builder.query<AdminTeacherListResponse, void>({
      query: () => "/control/trainer-list/",
    }),
    getStudents: builder.query<StudentsResponse, void>({
      query: () => "/control/trainee-list/",
    }),
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
    getAdminProfile: builder.query<AdminResponse, void>({
      query: () => "/control/profile/",
      providesTags: ["AdminProfile"],
    }),   
    updatePassword: builder.mutation<string,UpdatePasswordRequest>({
        query: (body)=>({
            url: "/control/password-update/",
            method: "PATCH",
            body,
            credentials: "include"
        })
    }),
    getAdminAnalytics: builder.query<AnalyticsResponse, void>({
        query: ()=> "/control/analytics/"
    }),
    getAdminSports: builder.query<SportCategoryResponse, void>({
        query: ()=> "/control/get-or-create-sport/"
    }),
    getAdminSportById: builder.query<SportCategory, string>({
        query: (id)=> `/control/update-sport/${id}`
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
  // Admin Profile
  useGetAdminProfileQuery,
  useUpdatePasswordMutation,
  // Analytics
  useGetAdminAnalyticsQuery,
  // Sports
  useGetAdminSportsQuery,
  useLazyGetAdminSportByIdQuery
} = adminApiSlice;
