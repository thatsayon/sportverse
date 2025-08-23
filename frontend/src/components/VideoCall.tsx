"use client";
import React, { useEffect } from "react";
import { ZoomMtg } from "@zoomus/websdk";
import { getZoomSignature } from "@/lib/zoom";

ZoomMtg.preLoadWasm();
ZoomMtg.prepareWebSDK();

interface VideoCallProps {
  meetingNumber: string;
  userName: string;
  role?: number; // 0 = participant, 1 = host
  password?: string;
}

const VideoCall: React.FC<VideoCallProps> = ({
  meetingNumber,
  userName,
  role = 0,
  password = "",
}) => {
  useEffect(() => {
    const startMeeting = async () => {
      try {
        const signature = await getZoomSignature(meetingNumber, role);

        ZoomMtg.init({
          leaveUrl: "/",
          isSupportAV: true,
          success: () => {
            ZoomMtg.join({
              signature,
              meetingNumber,
              userName,
              sdkKey: process.env.NEXT_PUBLIC_ZOOM_SDK_KEY!,
              passWord: password,
              success: () => console.log("Joined successfully"),
              error: (err) => console.error("Error joining meeting", err),
            });
          },
          error: (err) => {
            console.error("Error initializing Zoom", err);
          },
        });
      } catch (err) {
        console.error("Failed to start meeting:", err);
      }
    };

    startMeeting();
  }, [meetingNumber, userName, role, password]);

  return <div id="zmmtg-root"></div>;
};

export default VideoCall;
