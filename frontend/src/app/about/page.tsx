"use client"
import AboutUs from '@/components/Landing/AboutUs'
import React from 'react'
import io from "socket.io-client";

function page() {
const socket = io("http://localhost:8000", {
  auth: { user_id: "uuid-of-user" }
});

socket.on("connect", () => {
  // //console.log("🔌 Connected to notifications service");
});
 
socket.on("new_notification", () => {
  // //console.log("🔔 New notification:");
});
 
socket.on("notification_read", () => {
  // //console.log("✅ Notification marked as read:");
});

  return (
    <div>
      <AboutUs/>
    </div>
  )
}

export default page
