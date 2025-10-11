"use client";
import React, { useState } from "react"; // Adjust path as needed
import DirectVideoCall from "@/components/VideoCalling/DirectVideoCall";
import { Button } from "@/components/ui/button";
import { useStudentSlice } from "@/store/hooks/sliceHook";

const ParentComponent: React.FC = () => {
  const [toggle, setToggle] = useState<boolean>(false);
  const { callConfig } = useStudentSlice();

  const handleVideoCall = async () => {    
    setToggle(true);    
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
