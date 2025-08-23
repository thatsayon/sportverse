"use client";
import React, { useState } from "react";
import VideoCall from "@/components/VideoCall";

export default function JoinPage() {
  const [meetingNumber, setMeetingNumber] = useState("");
  const [userName, setUserName] = useState("");
  const [startCall, setStartCall] = useState(false);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (meetingNumber && userName) {
      setStartCall(true);
    }
  };

  if (startCall) {
    return <VideoCall meetingNumber={meetingNumber} userName={userName} role={0} />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">Join Zoom Meeting</h1>
      <form onSubmit={handleJoin} className="space-y-4 w-full max-w-md">
        <input
          type="text"
          placeholder="Meeting Number"
          value={meetingNumber}
          onChange={(e) => setMeetingNumber(e.target.value)}
          className="w-full border rounded px-4 py-2"
          required
        />
        <input
          type="text"
          placeholder="Your Name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="w-full border rounded px-4 py-2"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          Join Meeting
        </button>
      </form>
    </div>
  );
}
