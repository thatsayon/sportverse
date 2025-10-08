"use client"
import DirectVideoCall from "@/components/VideoCalling/DirectVideoCall";
import { useStudentSlice } from "@/store/hooks/sliceHook";

const ParentComponent: React.FC = () => {
  const {callConfig} = useStudentSlice()
  //console.log("video config",callConfig)
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
