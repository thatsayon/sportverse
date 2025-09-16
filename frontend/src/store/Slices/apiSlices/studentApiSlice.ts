import { apiSlice } from "./apiSlice";

export interface TrainingInfo {
  id: string;
  training_type: string;
  price: string;
}

export interface UserResult {
  full_name: string;
  username: string;
  institute_name: string | null;
  coach_type: string; // e.g. "controlpanel.Sport.None"
  training_info: TrainingInfo[];
}

export interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: UserResult[];
}


export const studentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getVritualTrainers: builder.query<ApiResponse,void>({
        query: ()=>({
            url: "/student/virtual-list/",
            credentials: "include"
        })
    }),
  }),
  overrideExisting: true,
})

export const {useGetVritualTrainersQuery, useLazyGetAllSportsQuery}= studentApiSlice;