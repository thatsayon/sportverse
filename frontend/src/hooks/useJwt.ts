"use client";

import { useMemo } from "react";
import {jwtDecode} from "jwt-decode";
import { getCookie } from "./cookie";


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
  verification_status: "verified" | "unverfied";
}

export const useJwt = () => {
  const decoded = useMemo<DecodedToken | null>(() => {
    const token = getCookie("access_token")
    if (!token) return null;

    try {
      return jwtDecode<DecodedToken>(token);
    } catch (error) {
      //console.error("Invalid JWT token:", error);
      return null;
    }
  }, []);

  const isExpired = useMemo(() => {
    if (!decoded?.exp) return null;
    return Date.now() >= decoded.exp * 1000;
  }, [decoded]);

  return { decoded, isExpired };
};
