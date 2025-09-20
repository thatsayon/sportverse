import { AdminBookingResponse } from "@/types/admin/bookings";
import { apiSlice } from "./apiSlice";


export const adminApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) =>({
        getBookings: builder.query<AdminBookingResponse, void>({
            query: ()=> "/control/booking/"
        })
    })
})

export const {
    useGetBookingsQuery
} = adminApiSlice;
