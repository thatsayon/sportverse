import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

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
  role?: "student" | "teacher"
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
}

export interface ResetPasswordRequest {
  email: string;
  new_password: string;
  code: string;
}

export interface SignUpResponse {
  success?: boolean;
  message: string;
  user?: User;
}

export interface LoginResponse {
  access_token: string;
}

// Create the API slice
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://127.0.0.1:8000/", // Your actual API base URL
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
  tagTypes: ["User", "Plan", "Chat", "Class", "login"], // Define cache tags for invalidation
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
        credentials: "include",
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
    requestForgotPasswordCode: builder.mutation<string, ForgotPasswordRequest>({
      query: (data) => ({
        url: "/api/forget-password/",
        method: "POST",
        body: data,
      }),
    }),

    verifyForgotPasswordCode: builder.mutation<string, VerifyCodeRequest>({
      query: (data) => ({
        url: "/auth/verify-otp/",
        method: "POST",
        body: data,
      }),
    }),

    resetPassword: builder.mutation<string, ResetPasswordRequest>({
      query: (data) => ({
        url: "/api/forget-password/reset",
        method: "POST",
        body: data,
        credentials: "include",
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
} = apiSlice;
