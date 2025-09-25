import { ApiResponse } from "@/types/student/trainerList";
import { apiSlice } from "./apiSlice";
import { sessionBookingsResponse } from "@/types/student/sessionBooking";



export const studentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getVritualTrainers: builder.query<ApiResponse,void>({
        query: ()=>({
            url: "/student/virtual-list/",
            credentials: "include"
        })
    }),
    getSessionDetails: builder.query<sessionBookingsResponse, string>({
      query: (id)=> `/student/session-detail/${id}`
    })
  }),
  overrideExisting: true,
})

export const {useGetVritualTrainersQuery, useGetSessionDetailsQuery}= studentApiSlice;