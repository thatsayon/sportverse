"use client";

import { useState, useEffect, useMemo } from "react";
import { jwtDecode } from "jwt-decode";
import { getCookie } from "./cookie";
import { authEvents } from "@/lib/authEvents";

export interface DecodedToken {
  token_type: "access" | "refresh";
  exp: number;
  iat: number;
  jti: string;
  user_id: string;
  username: string;
  full_name: string;
  email: string;
  profile_pic: string;
  role: "teacher" | "student" | "admin";
  verification_status: "verified" | "unverfied" | "in_progress" | "reject" | "not_submitted";
  subscription_type: "pro" | "basic"
}

export const useJwt = () => {
  // State to trigger re-computation when token changes
  const [tokenVersion, setTokenVersion] = useState(0);

  // Listen for auth events to update tokenVersion
  useEffect(() => {
    const unsubscribe = authEvents.subscribe(() => {
      setTokenVersion(prev => prev + 1);
    });

    return () => unsubscribe();
  }, []);

  // Decode token - now depends on tokenVersion to re-compute when token changes
  const decoded = useMemo<DecodedToken | null>(() => {
    // This dependency ensures re-computation when tokenVersion changes
    void tokenVersion;
    
    const token = getCookie("access_token");
    if (!token) return null;

    try {
      return jwtDecode<DecodedToken>(token);
    } catch (error) {
      console.error("Invalid JWT token:", error);
      return null;
    }
  }, [tokenVersion]);

  const isExpired = useMemo(() => {
    if (!decoded?.exp) return null;
    return Date.now() >= decoded.exp * 1000;
  }, [decoded]);

  return { decoded, isExpired };
};