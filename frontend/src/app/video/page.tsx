"use client"
import DirectVideoCall from "@/components/VideoCalling/DirectVideoCall";
import { useStudentSlice } from "@/store/hooks/sliceHook";

const ParentComponent: React.FC = () => {
  const {callConfig} = useStudentSlice()
  return (
    <DirectVideoCall
      token={callConfig.token}
      appId={callConfig.appId}
      channelName={callConfig.channelName}
      uid={callConfig.uid}
    />
  );
};

export default ParentComponent;
