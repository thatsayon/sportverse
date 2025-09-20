import { AdminBookingResponse } from "@/types/admin/bookings";
import { apiSlice } from "./apiSlice";
import { AdminDashboardResponse } from "@/types/admin/dashboard";


export const adminApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) =>({
        // Dashboard API
        getDashboard: builder.query<AdminDashboardResponse, void>({
            query: ()=> "/control/dashboard/"
        }),
        // Bookings API
        getBookings: builder.query<AdminBookingResponse, void>({
            query: ()=> "/control/booking/"
        })
    })
})

export const {
    //Dashboard
    useGetDashboardQuery,
    // Bookings
    useGetBookingsQuery
} = adminApiSlice;
