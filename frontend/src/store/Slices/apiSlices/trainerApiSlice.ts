import { TeacherDashboardResponse } from "@/types/teacher/dashboard";
import { apiSlice } from "./apiSlice";
export type CreateSessionRequest = {
  id?: string;
  training_type: string;
  price: string;
  close_before: string;
  available_days: {
    day: string;
    time_slots: {
      start_time: string;
      end_time: string;
    }[];
  }[];
};

export type CreateSessionResponse = {
  id: string;
  training_type: string;
  price: string;
  close_before: string;
  days: {
    id: string;
    day: string;
    slots: {
      id: string;
      start_time: string;
      end_time: string;
    }[];
  }[];
  created_at: string;
};

export type deleteResponse = {
  success: string;
}
export type deleteRequest = {
  id: string;
}


export interface Slot {
  id: string;
  start_time: string; // Format: "HH:MM:SS"
  end_time: string;   // Format: "HH:MM:SS"
}

export interface Day {
  id: string;
  day: string; // e.g., "monday", "wednesday"
  slots: Slot[];
}

export interface SessionResult {
  id: string;
  training_type: string; // e.g., "mindset"
  price: string;         // e.g., "1.11"
  close_before: string;  // Format: "HH:MM:SS"
  days: Day[];
  created_at: string;    // ISO timestamp
}

export interface SessionResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: SessionResult[];
}

export interface TimeCheckRequest{
  day: string;
  start_time: string;
  end_time: string;
}
export interface TimeCheckResponse{
  available: boolean;
  message: string;
}

export const trainerApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //Dashboard API
    getTeacherDashboard: builder.query<TeacherDashboardResponse, void>({
      query: ()=> "/teacher/d/dashboard/"
    }),

    //session management API
    createSession: builder.mutation<CreateSessionResponse, CreateSessionRequest>({
      query: (body) => ({
        url: "/teacher/session/create-session/",
        method: "POST",
        body: body,
        credentials: "include"
      }),
    }),
    getSession: builder.query<SessionResponse, void>({
      query: ()=> "/teacher/session/get-session/"
    }),
    updateSession: builder.mutation<CreateSessionResponse, CreateSessionRequest>({
      query:(body)=>({
        url: `/teacher/session/${body.id}/update-session/`,
        method: "PETCH",
        body: body,
        credentials: "include"
      })
    }),
    deleteSession: builder.mutation<deleteResponse, CreateSessionRequest>({
      query:(id)=>({
        url: `/teacher/session/${id}/update-session/`,
        method: "DELETE",
        credentials: "include"
      })
    }),
    timeCheck: builder.query<TimeCheckResponse, TimeCheckRequest>({
      query: (data)=> ({
        url: "/teacher/session/timeslot-availability/",
        method: "GET",
        body: data,
        credentials: "include"
      })
    })
  }),
  overrideExisting: true,
});

export const { useGetTeacherDashboardQuery ,useCreateSessionMutation, useGetSessionQuery, useUpdateSessionMutation, useDeleteSessionMutation, useLazyTimeCheckQuery } = trainerApiSlice;
