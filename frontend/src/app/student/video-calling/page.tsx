"use client";
import React, { useEffect, useState } from "react"; // Adjust path as needed
import DirectVideoCall from "@/components/VideoCalling/DirectVideoCall";
import { Button } from "@/components/ui/button";
import { getCookie } from "@/hooks/cookie";
import { useStudentSlice } from "@/store/hooks/sliceHook";

const ParentComponent: React.FC = () => {
  const [toggle, setToggle] = useState<boolean>(false);
  // const [callConfig, setCallConfig] = useState<any>(null);
  const { callConfig } = useStudentSlice();
  //console.log("calling Config",callConfig)

  // useEffect(() => {
  //   // Simulate fetching data from backend
  //   const fetchData = async () => {
  //     const response = await fetch("/api/getAgoraConfig");
  //     const data = await response.json();
  //     setCallConfig(data); // Assuming data contains { token, appId, channelName, uid }
  //   };

  //   fetchData();
  // }, []);

  const handleVideoCall = async () => {
    // const accessToken = getCookie("access_token");
    // const response = await fetch(
    //   "https://stingray-intimate-sincerely.ngrok-free.app/communication/meeting/agora/token/",
    //   {
    //     body: JSON.stringify({ channelName: "Student" }), // Assuming it's a GET request. You can change it if needed.
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json", // Set the content type to application/json

    //       Authorization: `Bearer ${accessToken}`, // Un-comment and replace this if using token-based auth
    //     },
    //   }
    // );
    setToggle(true);
    // if (response) {
    //   const data = await response.json();
    //   // setCallConfig(data);
    // } else {
    //   //console.log("error occurs");
    // }
  };

  if (!toggle)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Button onClick={handleVideoCall}>Join Video Call</Button>
      </div>
    );

  if (!callConfig) return <p>Loading...</p>;
  

  return (
    <DirectVideoCall
      token={callConfig.token}
      appId={callConfig.appId}
      channelName={callConfig.channelName}
      uid={0}
    />
  );
};

export default ParentComponent;
