"use client"

import { authEvents } from "@/lib/authEvents";

export const removeCookie = (name: string) => {
  if (typeof window === "undefined") return;

  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;SameSite=Strict`;
  
  // Emit event when access token is removed
  if (name === 'access_token') {
    authEvents.emit();
  }
};

export const setCookie = (name: string, value: string, days: number = 7) => {
  if (typeof window === "undefined") return;

  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
  
  // Emit event when access token is set
  if (name === 'access_token') {
    authEvents.emit();
  }
};

export const getCookie = (name: string): string | null => {
  if (typeof window === "undefined") return null;

  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));

  return match ? match.split("=")[1] : null;
};