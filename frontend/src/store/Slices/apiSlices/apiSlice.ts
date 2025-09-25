import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Verification } from "next/dist/lib/metadata/types/metadata-types";

const removeCookie = (name: string) => {
  if (typeof window === "undefined") return;

  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
};

// Define types for our dummy data
export interface User {
  id: string;
  email: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  role: string;
}

export interface SignUpRequest {
  full_name: string;
  email: string;
  password: string;
  role?: "student" | "teacher";
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyCodeRequest {
  otp: string;
  verificationToken: string | null;
}
export interface forgetCodeRequest {
  otp: string;
  passResetToken: string | null;
}

export interface ResetPasswordRequest {
  new_password: string;
  passwordResetVerified: string | null;
}

export interface SignUpResponse {
  success?: boolean;
  message: string;
  user?: User;
  verificationToken: string;
}

export interface LoginResponse {
  access_token: string;
  // refresh_token: string;
}
export interface verifyEmailCodeResponse {
  access_token: string;
}
export interface verifyForgotPasswordCodeResponse {
  message: string;
  passwordResetVerified: string;
}
export interface requestForgotPasswordCodeResponse {
  success: boolean;
  message: string;
  user: {
    id: string;
    email: string;
  };
  passResetToken: string;
}

export interface resendRegistrationCodeRequesrt {
  verificationToken: string | null;
}
export interface resendPasswordCodeRequesrt {
  passResetToken: string | null;
}

export interface allSportsResponseData {
  id: string;
  name: string;
  image: string;
}
export interface allSportsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: allSportsResponseData[];
}

export interface getSignatureReponse {
  api_key: string;
  cloud_name: string;
  timestamp: number;
  signature: string;
  folder: string;
  video_id: string;
}
export interface getSignatureRequest {
  title: string;
  description: string;
  thumbnail: File
}


// Create the API slice
export const apiSlice = createApi({
  reducerPath: "api",
  
  baseQuery: fetchBaseQuery({
    baseUrl: "https://stingray-intimate-sincerely.ngrok-free.app/", // Your actual API base URL
    prepareHeaders: (headers) => {
      // Add any default headers here (e.g., authorization)
      headers.set("Content-Type", "application/json");

      // Get token from cookies for authentication (only on client side)
      if (typeof window !== "undefined") {
        const accessToken = document.cookie
          .split("; ")
          .find((row) => row.startsWith("access_token"))
          ?.split("=")[1];

        if (accessToken) {
          headers.set("Authorization", `Bearer ${accessToken}`);
        }
      }

      return headers;
    },
    // Add response handling for debugging
    validateStatus: (response, body) => {
      console.log("API Response Status:", response.status);
      console.log("API Response Body:", body);
      return response.status < 500; // Don't treat 4xx as errors
    },
  }),
  tagTypes: [
    // Existing tags
    "User", 
    "Plan", 
    "Chat", 
    "Class", 
    "login",
    // New trainer-related tags
    "TrainerDashboard",
    "TrainerBookings", 
    "TrainerRevenue",
    "TrainerSessions",
    "TrainerBank",
    "TrainerPaypal",
    "TrainerWithdraw",
    "AgoraToken",
    "TimeSlotAvailability",
    "TrainerProfile",
    // Admin
    "Withdraw",
    "AdminProfile",
    "Video"
  ], // Define cache tags for invalidation
  endpoints: (builder) => ({
    // Auth endpoints

    signUp: builder.mutation<SignUpResponse, SignUpRequest>({
      query: (credentials) => ({
        url: "/auth/register/",
        method: "POST",
        body: credentials,
      }),
    }),

    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login/",
        method: "POST",
        body: credentials,
      }),
      // No cache invalidation needed for login
    }),
    logout: builder.mutation<{ success: boolean }, void>({
      // No API call needed for logout, just clear cookies and session
      queryFn: async () => {
        removeCookie("access_token");
        removeCookie("refresh_token");
        removeCookie("token_type");

        // Clear session storage
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("isLoggedIn");
          sessionStorage.removeItem("userEmail");
          sessionStorage.removeItem("userProfile");
        }

        return { data: { success: true } };
      },
    }),

    // Forgot Password endpoints
    requestForgotPasswordCode: builder.mutation<
      requestForgotPasswordCodeResponse,
      ForgotPasswordRequest
    >({
      query: (data) => ({
        url: "/auth/forget-password/",
        method: "POST",
        body: data,
      }),
    }),

    verifyEmailCode: builder.mutation<
      verifyEmailCodeResponse,
      VerifyCodeRequest
    >({
      query: (data) => ({
        url: "/auth/verify-otp/",
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
    verifyForgotPasswordCode: builder.mutation<
      verifyForgotPasswordCodeResponse,
      forgetCodeRequest
    >({
      query: (data) => ({
        url: "/auth/forget-password-otp-verify/",
        method: "POST",
        body: data,
      }),
    }),

    resetPassword: builder.mutation<string, ResetPasswordRequest>({
      query: (data) => ({
        url: "/auth/forget-password-set/",
        method: "POST",
        body: data,
      }),
    }),
    resendRegistrationCode: builder.mutation<
      string,
      resendRegistrationCodeRequesrt
    >({
      query: (data) => ({
        url: "/auth/resend-registration-otp/",
        method: "POST",
        body: data,
      }),
    }),
    resendPasswordCode: builder.mutation<string, resendPasswordCodeRequesrt>({
      query: (data) => ({
        url: "/auth/resend-forget-password-otp/",
        method: "POST",
        body: data,
      }),
    }),
    // User profile endpoint
    getUserProfile: builder.query<User, void>({
      query: () => ({
        url: "/api/user/profile",
        credentials: "include",
      }),
      providesTags: ["User"],
    }),
    getAllSports: builder.query<allSportsResponse, void>({
      query: () => "/control/get-or-create-sport/",
    }),
    getSignature: builder.mutation<getSignatureReponse, getSignatureRequest>({
      query:(data)=>({
        url: "/control/generate-token/",
        method: "POST",
        body: data,
        credentials: "include"
      })
    })
  }),
});

// Export auto-generated hooks
export const {
  // Auth hooks

  useLoginMutation,
  useSignUpMutation,
  useLogoutMutation,
  useRequestForgotPasswordCodeMutation,
  useVerifyForgotPasswordCodeMutation,
  useResetPasswordMutation,
  useGetUserProfileQuery,
  useVerifyEmailCodeMutation,
  useResendPasswordCodeMutation,
  useResendRegistrationCodeMutation,
  useGetAllSportsQuery,
  useGetSignatureMutation
} = apiSlice;
