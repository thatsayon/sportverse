import {
  AgoraTokenResponse,
  TrainerDashboardResponse,
} from "@/types/teacher/dashboard";
import { apiSlice } from "./apiSlice";
import { BookedSessionResponse } from "@/types/teacher/bookings";
import { TrainerRevenueResponse } from "@/types/teacher/revenue";
import { CloudinaryUploadResponse } from "@/types/teacher/trainerVideoUpload";
import { TrainerBankRequest, TrainerBankResponse, TrainerPaypalRequest, TrainerPaypalResponse, TrainerWalletTransactionRequest, TrainerWalletTransactionResponse, TrainerWithdrawResponse } from "@/types/teacher/wallet";
import { CreateSessionRequest, CreateSessionResponse, deleteResponse, DeleteTimeSlotRequest, DeleteTimeSlotResponse, SessionResponse, TimeCheckRequest, TimeCheckResponse } from "@/types/teacher/session";


export const trainerApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //Dashboard API
    getTeacherDashboard: builder.query<TrainerDashboardResponse, void>({
      query: () => "/teacher/d/dashboard/",
    }),

    // Booking and join session ---------------------------

    getGeneratedToken: builder.query<AgoraTokenResponse, string>({
      query: (id) => `/teacher/d/generate-token/${id}`,
    }),

    getTrainerBookings: builder.query<BookedSessionResponse, void>({
      query: ()=> "/teacher/d/booked-session/"
    }),

    // Revenye API ---------------------------

    getTrainerRenenue: builder.query<TrainerRevenueResponse, string>({
      query: (month)=> `/teacher/d/revenue-report?month=${month}`
    }),

    //session management API ---------------------------
    createSession: builder.mutation<
      CreateSessionResponse,
      CreateSessionRequest
    >({
      query: (body) => ({
        url: "/teacher/session/create-session/",
        method: "POST",
        body: body,
        credentials: "include",
      }),
    }),
    
    getSession: builder.query<SessionResponse, void>({
      query: () => "/teacher/session/get-session/",
    }),
    
    updateSession: builder.mutation<
      CreateSessionResponse,
      CreateSessionRequest
    >({
      query: (body) => ({
        url: `/teacher/session/${body.id}/update-session/`,
        method: "PATCH", // Fixed from "PETCH"
        body: body,
        credentials: "include",
      }),
    }),
    
    deleteSession: builder.mutation<deleteResponse, string>({
      query: (sessionId) => ({
        url: `/teacher/session/${sessionId}/delete-session/`, // Fixed endpoint
        method: "DELETE",
        credentials: "include",
      }),
    }),
    
    // New endpoint for deleting individual time slots
    deleteTimeSlot: builder.mutation<DeleteTimeSlotResponse, DeleteTimeSlotRequest>({
      query: (body) => ({
        url: `/teacher/session/${body.slot_id}/delete-timeslot/`,
        method: "DELETE",
        credentials: "include",
      }),
    }),
    
    timeCheck: builder.mutation<TimeCheckResponse, TimeCheckRequest>({
      query: (data) => ({
        url: "/teacher/session/timeslot-availability/",
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),

    // Wallet Bank API

    //GET
    getTrainerBank: builder.query<TrainerBankResponse, void>({
      query: ()=> "/teacher/d/bank/"
    }),

    //POST
    createTrainerBank: builder.mutation<TrainerBankResponse, TrainerBankRequest>({
      query: (body)=>({
        url: "/teacher/d/bank/",
        method: "POST",
        body: body,
        credentials: "include"
      })
    }),

    //PUT
    updateTrainerBank: builder.mutation<TrainerBankResponse, TrainerBankRequest>({
      query: (body)=>({
        url: "/teacher/d/bank/",
        method: "PUT",
        body: body,
        credentials: "include"
      })
    }),

    

    //Wallet Paypal API

    //GET
    getTrainerPaypal: builder.query<TrainerPaypalResponse, void>({
      query: ()=> "/teacher/d/paypal/"
    }),

    //POST
    createTrainerPaypal: builder.mutation<TrainerPaypalResponse, TrainerPaypalRequest>({
      query: (body)=>({
        url: "/teacher/d/paypal/",
        method: "POST",
        body: body,
        credentials: "include"
      })
    }),

    //PUT
    updateTrainerPaypal: builder.mutation<TrainerPaypalResponse, TrainerPaypalRequest>({
      query: (body)=>({
        url: "/teacher/d/paypal/",
        method: "PUT",
        body: body,
        credentials: "include"
      })
    }),

    // withdraw API

    //GET
    getTainerWithdraw: builder.query<TrainerWithdrawResponse, void>({
      query: ()=> "/teacher/d/withdraw/"
    }),

    //POST
    createTrainerWithdrawRequest: builder.mutation<TrainerWalletTransactionResponse, TrainerWalletTransactionRequest>({
      query: (body)=>({
        url: "/teacher/d/withdraw/",
        method: "POST",
        body,
        credentials: "include"
      })
    }),
    // Profile API

    postTrainerVideo: builder.mutation<CloudinaryUploadResponse, void>({
      query: ()=>({
        url: "/teacher/d/upload-video/",
        method: "PUT",
        credentials: "include"
      })
    }),

  }),
  overrideExisting: true,
});

export const {
  useGetTeacherDashboardQuery,
  // booking and session join
  useLazyGetGeneratedTokenQuery,
  useGetTrainerBookingsQuery,
  // revenue api
  useGetTrainerRenenueQuery,
  // wallet bank
  useGetTrainerBankQuery,
  useCreateTrainerBankMutation,
  useUpdateTrainerBankMutation,
  // wallet Paypal
  useGetTrainerPaypalQuery,
  useCreateTrainerPaypalMutation,
  useUpdateTrainerPaypalMutation,
  // withdraw
  useGetTainerWithdrawQuery,
  useCreateTrainerWithdrawRequestMutation,
  // session management
  useCreateSessionMutation,
  useGetSessionQuery,
  useUpdateSessionMutation,
  useDeleteSessionMutation,
  useDeleteTimeSlotMutation, // New export
  useTimeCheckMutation,
  // profile

  usePostTrainerVideoMutation
} = trainerApiSlice;