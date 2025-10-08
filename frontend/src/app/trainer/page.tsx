"use client";
 
import React, { useEffect } from "react";
import HomePage from "@/components/Shared/HomePage";
import { getCookie } from "@/hooks/cookie";
import { getSocket } from "@/lib/socket";
 
const SOCKET_URL = "https://stingray-intimate-sincerely.ngrok-free.app";
 
function Page() {
  useEffect(() => {
    const accessToken = getCookie("access_token");
    if (!accessToken) return;
 
    const socket = getSocket(SOCKET_URL, accessToken);
 
    socket.on("connect", () => {
      //console.log("✅ Global socket connected:", socket.id);
    });
 
    socket.on("receive_message", (msg: any) => {
      //console.log("📩 New message received globally:", msg);
      // You can update a global store or trigger a toast/notification here
    });
 
    return () => {
      // optional: do not disconnect to keep the global socket alive
      // socket.disconnect();
    };
  }, []);
 
  return (
    <div>
      <HomePage />
    </div>
  );
}
 
export default Page;