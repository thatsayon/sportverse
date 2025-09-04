"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Settings,
  Users,
} from "lucide-react";

// Types for Agora SDK
interface IAgoraRTCClient {
  join: (
    appId: string,
    channel: string,
    token: string | null,
    uid: number
  ) => Promise<number>;
  leave: () => Promise<void>;
  publish: (tracks: any[]) => Promise<void>;
  subscribe: (user: any, mediaType: "video" | "audio") => Promise<void>;
  on: (event: string, callback: (...args: any[]) => void) => void;
  removeAllListeners: () => void;
}

interface IAgoraRTCRemoteUser {
  uid: number;
  videoTrack?: any;
  audioTrack?: any;
}

interface IMicrophoneAudioTrack {
  setEnabled: (enabled: boolean) => Promise<void>;
  stop: () => void;
  close: () => void;
  play: () => void;
}

interface ICameraVideoTrack {
  setEnabled: (enabled: boolean) => Promise<void>;
  stop: () => void;
  close: () => void;
  play: (element: string) => void;
}

// Props interface to receive Agora config
interface DirectVideoCallProps {
  token: string;
  appId: string;
  channelName: string;
  uid: number;
}

const DirectVideoCall: React.FC<DirectVideoCallProps> = ({
  token,
  appId,
  channelName,
  uid,
}) => {
  // Agora configuration
  const agoraConfig = {
    appId,
    token,
    channelName,
    uid,
  };

  // Refs
  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const localVideoTrackRef = useRef<ICameraVideoTrack | null>(null);
  const localAudioTrackRef = useRef<IMicrophoneAudioTrack | null>(null);
  const agoraRTCRef = useRef<any>(null);

  // State
  const [isJoined, setIsJoined] = useState<boolean>(false);
  const [isCameraOn, setIsCameraOn] = useState<boolean>(true);
  const [isMicOn, setIsMicOn] = useState<boolean>(true);
  const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [devicePermissions, setDevicePermissions] = useState({
    camera: false,
    microphone: false,
    checked: false,
  });

  // Load Agora SDK dynamically
  useEffect(() => {
    const loadAgoraSDK = async () => {
      try {
        // Only load on client side
        if (typeof window === "undefined") return;

        const AgoraRTC = (await import("agora-rtc-sdk-ng")).default;
        agoraRTCRef.current = AgoraRTC;

        await initClient();
        await checkDevicePermissions();
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to load Agora SDK:", err);
        setError("Failed to load video calling SDK");
        setIsLoading(false);
      }
    };

    loadAgoraSDK();

    // Cleanup
    return () => {
      if (clientRef.current) {
        clientRef.current.removeAllListeners();
      }
    };
  }, []);

  const checkDevicePermissions = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasCamera = devices.some((device) => device.kind === "videoinput");
      const hasMicrophone = devices.some(
        (device) => device.kind === "audioinput"
      );

      let cameraPermission = false;
      let microphonePermission = false;

      if (hasCamera) {
        try {
          const videoStream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });
          videoStream.getTracks().forEach((track) => track.stop());
          cameraPermission = true;
        } catch (e) {
          console.log("Camera permission denied or not available");
        }
      }

      if (hasMicrophone) {
        try {
          const audioStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
          });
          audioStream.getTracks().forEach((track) => track.stop());
          microphonePermission = true;
        } catch (e) {
          console.log("Microphone permission denied or not available");
        }
      }

      setDevicePermissions({
        camera: cameraPermission,
        microphone: microphonePermission,
        checked: true,
      });
    } catch (error) {
      console.error("Error checking device permissions:", error);
      setDevicePermissions({
        camera: false,
        microphone: false,
        checked: true,
      });
    }
  };

  const initClient = async () => {
    if (!agoraRTCRef.current) return;

    clientRef.current = agoraRTCRef.current.createClient({
      mode: "rtc",
      codec: "vp8",
    });

    clientRef.current.on("user-published", handleUserPublished);
    clientRef.current.on("user-unpublished", handleUserUnpublished);
    clientRef.current.on("user-joined", handleUserJoined);
    clientRef.current.on("user-left", handleUserLeft);
  };

  const handleUserPublished = async (
    user: IAgoraRTCRemoteUser,
    mediaType: "video" | "audio"
  ) => {
    if (clientRef.current) {
      await clientRef.current.subscribe(user, mediaType);

      if (mediaType === "video") {
        const remoteVideoTrack = user.videoTrack;
        if (remoteVideoTrack) {
          remoteVideoTrack.play(`remote-video-${user.uid}`);
        }
      }

      if (mediaType === "audio") {
        const remoteAudioTrack = user.audioTrack;
        if (remoteAudioTrack) {
          remoteAudioTrack.play();
        }
      }

      setRemoteUsers((prevUsers) => {
        const existingUser = prevUsers.find((u) => u.uid === user.uid);
        if (existingUser) {
          return prevUsers.map((u) => (u.uid === user.uid ? user : u));
        }
        return [...prevUsers, user];
      });
    }
  };

  const handleUserUnpublished = (user: IAgoraRTCRemoteUser) => {
    setRemoteUsers((prevUsers) =>
      prevUsers.map((u) => (u.uid === user.uid ? user : u))
    );
  };

  const handleUserJoined = (user: IAgoraRTCRemoteUser) => {
    console.log("User joined:", user.uid);
  };

  const handleUserLeft = (user: IAgoraRTCRemoteUser) => {
    setRemoteUsers((prevUsers) => prevUsers.filter((u) => u.uid !== user.uid));
  };

  const createLocalTracks = async () => {
    const tracks = [];
    let audioTrack = null;
    let videoTrack = null;

    try {
      if (devicePermissions.microphone && devicePermissions.camera) {
        [audioTrack, videoTrack] =
          await agoraRTCRef.current.createMicrophoneAndCameraTracks();
        tracks.push(audioTrack, videoTrack);
      } else if (devicePermissions.microphone) {
        audioTrack = await agoraRTCRef.current.createMicrophoneAudioTrack();
        tracks.push(audioTrack);
      } else if (devicePermissions.camera) {
        videoTrack = await agoraRTCRef.current.createCameraVideoTrack();
        tracks.push(videoTrack);
      }

      return { audioTrack, videoTrack, tracks };
    } catch (error) {
      console.error("Failed to create local tracks:", error);
      throw new Error(
        "Failed to access camera/microphone. Please check device permissions."
      );
    }
  };

  const joinChannel = async (): Promise<void> => {
    try {
      if (!clientRef.current || !agoraRTCRef.current) return;

      const { audioTrack, videoTrack, tracks } = await createLocalTracks();
      localAudioTrackRef.current = audioTrack;
      localVideoTrackRef.current = videoTrack;

      await clientRef.current.join(
        agoraConfig.appId,
        agoraConfig.channelName,
        agoraConfig.token,
        agoraConfig.uid
      );

      if (tracks.length > 0) {
        await clientRef.current.publish(tracks);
      }

      if (videoTrack) {
        videoTrack.play("local-video");
      }

      setIsJoined(true);
      setError(null);
      console.log("Successfully joined channel");
    } catch (error) {
      console.error("Failed to join channel:", error);
      setError(
        error instanceof Error ? error.message : "Failed to join video call"
      );
    }
  };

  const leaveChannel = async (): Promise<void> => {
    try {
      if (!clientRef.current) return;

      if (localVideoTrackRef.current) {
        localVideoTrackRef.current.stop();
        localVideoTrackRef.current.close();
        localVideoTrackRef.current = null;
      }

      if (localAudioTrackRef.current) {
        localAudioTrackRef.current.stop();
        localAudioTrackRef.current.close();
        localAudioTrackRef.current = null;
      }

      await clientRef.current.leave();
      setIsJoined(false);
      setRemoteUsers([]);
      setError(null);
      console.log("Successfully left channel");
    } catch (error) {
      console.error("Failed to leave channel:", error);
      setError("Failed to leave video call");
    }
  };

  const toggleCamera = async (): Promise<void> => {
    if (localVideoTrackRef.current) {
      await localVideoTrackRef.current.setEnabled(!isCameraOn);
      setIsCameraOn(!isCameraOn);
    }
  };

  const toggleMicrophone = async (): Promise<void> => {
    if (localAudioTrackRef.current) {
      await localAudioTrackRef.current.setEnabled(!isMicOn);
      setIsMicOn(!isMicOn);
    }
  };

  const requestPermissions = async () => {
    try {
      await navigator.mediaDevices
        .getUserMedia({
          video: true,
          audio: true,
        })
        .then((stream) => {
          stream.getTracks().forEach((track) => track.stop());
        });
      await checkDevicePermissions();
    } catch (error) {
      console.error("Permission request failed:", error);
      setError(
        "Please allow camera and microphone access to use video calling"
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-lg p-8 max-w-md mx-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-500 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Video Call</h2>
          <p className="text-gray-600">Loading video calling SDK...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-lg p-8 max-w-md mx-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Settings className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Connection Error
          </h2>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => {
                setError(null);
                checkDevicePermissions();
              }}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={requestPermissions}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
            >
              Grant Permissions
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="mx-auto px-4 py-8">
        {/* Header */}
        {!isJoined && (
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Video Call Session
              </h1>
              <p className="text-gray-600">Connect with your coach or team</p>
            </div>
          </>
        )}

        {/* Device Status Card */}
        {!isJoined && (
          <>
            {devicePermissions.checked && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6 max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Device Status
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        devicePermissions.camera ? "bg-green-100" : "bg-red-100"
                      }`}
                    >
                      <Video
                        className={`w-5 h-5 ${
                          devicePermissions.camera
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Camera</p>
                      <p
                        className={`text-sm ${
                          devicePermissions.camera
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {devicePermissions.camera
                          ? "Available"
                          : "Not available"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        devicePermissions.microphone
                          ? "bg-green-100"
                          : "bg-red-100"
                      }`}
                    >
                      <Mic
                        className={`w-5 h-5 ${
                          devicePermissions.microphone
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">Microphone</p>
                      <p
                        className={`text-sm ${
                          devicePermissions.microphone
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {devicePermissions.microphone
                          ? "Available"
                          : "Not available"}
                      </p>
                    </div>
                  </div>
                </div>

                {(!devicePermissions.camera ||
                  !devicePermissions.microphone) && (
                  <button
                    onClick={requestPermissions}
                    className="w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
                  >
                    Request Device Permissions
                  </button>
                )}
              </div>
            )}
          </>
        )}

        {/* Main Call Interface */}
        <div className=" min-h-screen border-2">
          {/* Video Grid */}
          <div className="bg-black rounded-xl overflow-hidden shadow-lg mb-6 min-h-[1000px]">
            <div className="gap-4 p-4 h-[1000px] w-full relative border-2 border-red-500">
              {/* Local Video */}
              {isJoined && (
                <div className="absolute z-30 right-4 bottom-4 bg-gray-900 rounded-lg overflow-hidden aspect-video w-96">
                  <div
                    id="local-video"
                    className="w-full h-full bg-gray-800 flex items-center justify-center relative"
                  >
                    {!devicePermissions.camera && (
                      <div className="text-center text-white">
                        <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-2">
                          <VideoOff className="w-8 h-8" />
                        </div>
                        <p className="text-sm">Camera Off</p>
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-3 left-3 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    You
                  </div>
                  <div className="absolute top-3 right-3 flex gap-2">
                    {!isCameraOn && (
                      <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                        <VideoOff className="w-4 h-4 text-white" />
                      </div>
                    )}
                    {!isMicOn && (
                      <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                        <MicOff className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Remote Videos */}
              {remoteUsers.map((user) => (
                <div
                  key={user.uid}
                  className="relative bg-green-900 rounded-lg overflow-hidden aspect-video border-2 border-red-700 h-[19%]"
                >
                  <div
                    id={`remote-video-${user.uid}`}
                    className="w-full h-full bg-gray-800"
                  />
                  <div className="absolute bottom-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    User {user.uid}
                  </div>
                </div>
              ))}

              {/* Empty state when not joined */}
              {!isJoined && (
                <div className="col-span-full flex items-center justify-center py-20">
                  <div className="text-center text-white">
                    <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Video className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      Ready to Connect
                    </h3>
                    <p className="text-gray-400">
                      Click "Join Call" to start your video session
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Control Bar */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-center gap-4 mb-4">
              {/* Join/Leave Button */}
              {!isJoined ? (
                <button
                  onClick={joinChannel}
                  disabled={
                    !devicePermissions.camera && !devicePermissions.microphone
                  }
                  className={`px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all ${
                    !devicePermissions.camera && !devicePermissions.microphone
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-xl"
                  }`}
                >
                  <Phone className="w-5 h-5" />
                  Join Call
                </button>
              ) : (
                <button
                  onClick={leaveChannel}
                  className="px-8 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold flex items-center gap-2 transition-all shadow-lg hover:shadow-xl"
                >
                  <PhoneOff className="w-5 h-5" />
                  Leave Call
                </button>
              )}

              {/* Camera Toggle */}
              <button
                onClick={toggleCamera}
                disabled={!isJoined || !devicePermissions.camera}
                className={`p-4 rounded-full transition-all ${
                  !isJoined || !devicePermissions.camera
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : isCameraOn && devicePermissions.camera
                    ? "bg-green-500 hover:bg-green-600 text-white shadow-lg"
                    : "bg-gray-500 hover:bg-gray-600 text-white shadow-lg"
                }`}
              >
                {isCameraOn && devicePermissions.camera ? (
                  <Video className="w-6 h-6" />
                ) : (
                  <VideoOff className="w-6 h-6" />
                )}
              </button>

              {/* Microphone Toggle */}
              <button
                onClick={toggleMicrophone}
                disabled={!isJoined || !devicePermissions.microphone}
                className={`p-4 rounded-full transition-all ${
                  !isJoined || !devicePermissions.microphone
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : isMicOn && devicePermissions.microphone
                    ? "bg-green-500 hover:bg-green-600 text-white shadow-lg"
                    : "bg-gray-500 hover:bg-gray-600 text-white shadow-lg"
                }`}
              >
                {isMicOn && devicePermissions.microphone ? (
                  <Mic className="w-6 h-6" />
                ) : (
                  <MicOff className="w-6 h-6" />
                )}
              </button>
            </div>

            {/* Session Info */}
            {/* {isJoined && (
              <div className="bg-gray-50 rounded-lg p-4 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-gray-500 text-sm">Channel</p>
                    <p className="font-semibold text-gray-800">
                      {agoraConfig.channelName}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Participants</p>
                    <p className="font-semibold text-gray-800 flex items-center justify-center gap-1">
                      <Users className="w-4 h-4" />
                      {remoteUsers.length + 1}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Your ID</p>
                    <p className="font-semibold text-gray-800">
                      {agoraConfig.uid}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Status</p>
                    <div className="flex items-center justify-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <p className="font-semibold text-green-600">Connected</p>
                    </div>
                  </div>
                </div>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectVideoCall;
