import { apiSlice } from "./apiSlice";

interface uploadDocResponse {
  picture: string;
  in_front: string;
  id_back: string;
  city: string;
  zip_code: string;
}

export const trainerApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadDoc: builder.mutation<uploadDocResponse, FormData>({
      query: (body) => ({
        url: "/account/teacher-verification/",
        method: "POST",
        body: body,
        credentials: "include"
      }),
      
    }),
  }),
  overrideExisting: true,
});

export const { useUploadDocMutation } = trainerApiSlice;
