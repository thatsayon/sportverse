"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
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
import { useAppSelector } from "@/store/hooks/hooks";
import { useDispatch } from "react-redux";
import { setIsJoined } from "@/store/Slices/stateSlices/stateSlice";
import { useJwt } from "@/hooks/useJwt";

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
  off: (event: string, callback: (...args: any[]) => void) => void;
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
  play: (element: string | HTMLElement) => void;
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
  uid=0
}) => {
  // Refs
  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const localVideoTrackRef = useRef<ICameraVideoTrack | null>(null);
  const localAudioTrackRef = useRef<IMicrophoneAudioTrack | null>(null);
  const agoraRTCRef = useRef<any>(null);
  const isInitializedRef = useRef<boolean>(false);
  const cleanupInProgressRef = useRef<boolean>(false);

  // State
  const dispatch = useDispatch();
  const isJoined = useAppSelector((state) => state.state.isJoined);
  const [isCameraOn, setIsCameraOn] = useState<boolean>(true);
  const [isMicOn, setIsMicOn] = useState<boolean>(true);
  const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState<boolean>(false);
  const [devicePermissions, setDevicePermissions] = useState({
    camera: false,
    microphone: false,
    checked: false,
  });
  const {decoded} = useJwt()

  // Event handlers with useCallback to prevent recreation
  const handleUserPublished = useCallback(
    async (user: IAgoraRTCRemoteUser, mediaType: "video" | "audio") => {
      try {
        if (!clientRef.current) return;

        await clientRef.current.subscribe(user, mediaType);

        if (mediaType === "video" && user.videoTrack) {
          // Wait a bit for DOM to be ready
          setTimeout(() => {
            const videoElement = document.getElementById(
              `remote-video-${user.uid}`
            );
            if (videoElement && user.videoTrack) {
              user.videoTrack.play(videoElement);
            }
          }, 100);
        }

        if (mediaType === "audio" && user.audioTrack) {
          user.audioTrack.play();
        }

        setRemoteUsers((prevUsers) => {
          const existingUserIndex = prevUsers.findIndex(
            (u) => u.uid === user.uid
          );
          if (existingUserIndex !== -1) {
            const updatedUsers = [...prevUsers];
            updatedUsers[existingUserIndex] = user;
            return updatedUsers;
          }
          return [...prevUsers, user];
        });
      } catch (error) {
        console.error("Error handling user published:", error);
      }
    },
    []
  );

  const handleUserUnpublished = useCallback((user: IAgoraRTCRemoteUser) => {
    setRemoteUsers((prevUsers) =>
      prevUsers.map((u) => (u.uid === user.uid ? user : u))
    );
  }, []);

  const handleUserJoined = useCallback((user: IAgoraRTCRemoteUser) => {
    console.log("User joined:", user.uid);
  }, []);

  const handleUserLeft = useCallback((user: IAgoraRTCRemoteUser) => {
    setRemoteUsers((prevUsers) => prevUsers.filter((u) => u.uid !== user.uid));
  }, []);

  // Load Agora SDK and initialize
  useEffect(() => {
    const loadAgoraSDK = async () => {
      try {
        if (typeof window === "undefined" || isInitializedRef.current) return;

        const AgoraRTC = (await import("agora-rtc-sdk-ng")).default;
        agoraRTCRef.current = AgoraRTC;

        await initClient();
        await checkDevicePermissions();

        isInitializedRef.current = true;
        setIsLoading(false);
      } catch (err) {
        console.error("Failed to load Agora SDK:", err);
        setError("Failed to load video calling SDK");
        setIsLoading(false);
      }
    };

    loadAgoraSDK();

    // Cleanup on unmount
    return () => {
      cleanup();
    };
  }, []);

  const cleanup = useCallback(async () => {
    if (cleanupInProgressRef.current) return;
    cleanupInProgressRef.current = true;

    try {
      // Clean up local tracks first
      if (localVideoTrackRef.current) {
        try {
          localVideoTrackRef.current.stop();
          localVideoTrackRef.current.close();
        } catch (e) {
          console.error("Error closing video track:", e);
        }
        localVideoTrackRef.current = null;
      }

      if (localAudioTrackRef.current) {
        try {
          localAudioTrackRef.current.stop();
          localAudioTrackRef.current.close();
        } catch (e) {
          console.error("Error closing audio track:", e);
        }
        localAudioTrackRef.current = null;
      }

      // Clean up client
      if (clientRef.current) {
        try {
          clientRef.current.off("user-published", handleUserPublished);
          clientRef.current.off("user-unpublished", handleUserUnpublished);
          clientRef.current.off("user-joined", handleUserJoined);
          clientRef.current.off("user-left", handleUserLeft);

          if (isJoined) {
            await clientRef.current.leave();
          }
        } catch (e) {
          console.error("Error cleaning up client:", e);
        }
        clientRef.current = null;
      }

      dispatch(setIsJoined(false));
      setRemoteUsers([]);
    } catch (error) {
      console.error("Error during cleanup:", error);
    } finally {
      cleanupInProgressRef.current = false;
    }
  }, [
    isJoined,
    handleUserPublished,
    handleUserUnpublished,
    handleUserJoined,
    handleUserLeft,
  ]);

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
            video: { width: 640, height: 480 },
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
    if (!agoraRTCRef.current || clientRef.current) return;

    try {
      clientRef.current = agoraRTCRef.current.createClient({
        mode: "rtc",
        codec: "vp8",
      });

      // Add event listeners
      clientRef.current.on("user-published", handleUserPublished);
      clientRef.current.on("user-unpublished", handleUserUnpublished);
      clientRef.current.on("user-joined", handleUserJoined);
      clientRef.current.on("user-left", handleUserLeft);
    } catch (error) {
      console.error("Error initializing client:", error);
      throw error;
    }
  };

  const createLocalTracks = async () => {
    if (!agoraRTCRef.current) throw new Error("Agora SDK not loaded");

    const tracks = [];
    let audioTrack = null;
    let videoTrack = null;

    try {
      if (devicePermissions.camera && devicePermissions.microphone) {
        const [newAudioTrack, newVideoTrack] =
          await agoraRTCRef.current.createMicrophoneAndCameraTracks(
            {
              echoCancellation: true,
              noiseSuppression: true,
            },
            {
              width: 640,
              height: 480,
              frameRate: 15,
            }
          );
        audioTrack = newAudioTrack;
        videoTrack = newVideoTrack;
        tracks.push(audioTrack, videoTrack);
      } else if (devicePermissions.microphone) {
        audioTrack = await agoraRTCRef.current.createMicrophoneAudioTrack({
          echoCancellation: true,
          noiseSuppression: true,
        });
        tracks.push(audioTrack);
      } else if (devicePermissions.camera) {
        videoTrack = await agoraRTCRef.current.createCameraVideoTrack({
          width: 640,
          height: 480,
          frameRate: 15,
        });
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
    if (isJoining || !clientRef.current || !agoraRTCRef.current) return;

    setIsJoining(true);
    setError(null);

    try {
      const { audioTrack, videoTrack, tracks } = await createLocalTracks();

      // Store tracks in refs
      localAudioTrackRef.current = audioTrack;
      localVideoTrackRef.current = videoTrack;

      // const testToken = "0063a92940d828b4be687ea50c325adfc20IACZt18ECUEv9JiNjeWPmOfOzJKbaj3awG+GHKaqHxiyWLHv79fM2MOtIgCV5T4FZCDLaAQAAQD03MloAgD03MloAwD03MloBAD03Mlo"

      // Join channel first
      await clientRef.current.join(appId, channelName, token, uid);

      // Publish tracks if available
      if (tracks.length > 0) {
        await clientRef.current.publish(tracks);
      }

      // Play local video with retry mechanism
      if (videoTrack) {
        const playVideo = () => {
          const localVideoElement = document.getElementById("local-video");
          if (localVideoElement) {
            videoTrack.play(localVideoElement);
          } else {
            // Retry after a short delay
            setTimeout(playVideo, 100);
          }
        };
        playVideo();
      }

      dispatch(setIsJoined(true));
      console.log("Successfully joined channel");
    } catch (error) {
      console.error("Failed to join channel:", error);
      setError(
        error instanceof Error ? error.message : "Failed to join video call"
      );

      // Clean up tracks on failure
      if (localVideoTrackRef.current) {
        localVideoTrackRef.current.close();
        localVideoTrackRef.current = null;
      }
      if (localAudioTrackRef.current) {
        localAudioTrackRef.current.close();
        localAudioTrackRef.current = null;
      }
    } finally {
      setIsJoining(false);
    }
  };

  const leaveChannel = async (): Promise<void> => {
    if (!clientRef.current) return;

    try {
      // Stop and close tracks
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
      dispatch(setIsJoined(false));
      setRemoteUsers([]);
      setError(null);
      console.log("Successfully left channel");
    } catch (error) {
      console.error("Failed to leave channel:", error);
      setError("Failed to leave video call");
    }
  };

  const toggleCamera = async (): Promise<void> => {
    if (localVideoTrackRef.current && isJoined) {
      try {
        await localVideoTrackRef.current.setEnabled(!isCameraOn);
        setIsCameraOn(!isCameraOn);
      } catch (error) {
        console.error("Error toggling camera:", error);
      }
    }
  };

  const toggleMicrophone = async (): Promise<void> => {
    if (localAudioTrackRef.current && isJoined) {
      try {
        await localAudioTrackRef.current.setEnabled(!isMicOn);
        setIsMicOn(!isMicOn);
      } catch (error) {
        console.error("Error toggling microphone:", error);
      }
    }
  };

  const requestPermissions = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      await checkDevicePermissions();
      setError(null);
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

  if (error && !devicePermissions.checked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
    <div className="min-h-screen py-8">
      <div className="">
        <div>
          {/* Header */}
        {!isJoined && (
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Video Call Session
            </h1>
            <p className="text-gray-600">Connect with your coach or team</p>
          </div>
        )}

        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 max-w-2xl mx-auto">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Device Status Card */}
        {!isJoined && devicePermissions.checked && (
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
                    {devicePermissions.camera ? "Available" : "Not available"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    devicePermissions.microphone ? "bg-green-100" : "bg-red-100"
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

            {(!devicePermissions.camera || !devicePermissions.microphone) && (
              <button
                onClick={requestPermissions}
                className="w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
              >
                Request Device Permissions
              </button>
            )}
          </div>
        )}
        </div>

        {/* Main Call Interface */}
        <div className={`${isJoined ? "w-full" : "max-w-6xl  mx-auto"}`}>
          {/* Video Grid */}
          <div className={`bg-black ${isJoined? "max-h-screen":"max-h-[440px]"} w-full overflow-hidden shadow-lg mb-6 aspect-video relative`}>
            {/* Local Video */}
            {isJoined && (
              <div className="absolute z-20 top-4 right-4 w-64 aspect-video bg-gray-900 rounded-lg overflow-hidden border-2 border-gray-600">
                <div
                  id="local-video"
                  className="w-full h-full bg-gray-800 flex items-center justify-center"
                >
                  {(!devicePermissions.camera || !isCameraOn) && (
                    <div className="text-center text-white">
                      <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-2">
                        <VideoOff className="w-6 h-6" />
                      </div>
                      <p className="text-xs">Camera Off</p>
                    </div>
                  )}
                </div>
                <div className="absolute bottom-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
                  You
                </div>
                <div className="absolute top-2 right-2 flex gap-1">
                  {!isCameraOn && (
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                      <VideoOff className="w-3 h-3 text-white" />
                    </div>
                  )}
                  {!isMicOn && (
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                      <MicOff className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Remote Videos */}
            <div className="w-full h-full">
              {remoteUsers.length > 0 ? (
                <div
                  className={`grid h-full gap-2 p-4 ${
                    remoteUsers.length === 1
                      ? "grid-cols-1"
                      : remoteUsers.length <= 4
                      ? "grid-cols-2"
                      : "grid-cols-3"
                  }`}
                >
                  {remoteUsers.map((user) => (
                    <div
                      key={user.uid}
                      className="relative bg-gray-800 rounded-lg overflow-hidden"
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
                </div>
              ) : (
                /* Empty state */
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-white">
                    <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Video className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      {isJoined
                        ? "Waiting for others to join"
                        : "Ready to Connect"}
                    </h3>
                    <p className="text-gray-400">
                      {isJoined
                        ? `Share channel "${channelName}" with others`
                        : 'Click "Join Call" to start your video session'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Control Bar */}
          <div
            className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${
              isJoined ? "hidden" : "block"
            }`}
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              {/* Join/Leave Button */}
              {!isJoined && (
                <button
                  onClick={joinChannel}
                  disabled={
                    isJoining ||
                    (!devicePermissions.camera && !devicePermissions.microphone)
                  }
                  className={`px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all ${
                    isJoining ||
                    (!devicePermissions.camera && !devicePermissions.microphone)
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-xl"
                  }`}
                >
                  <Phone className="w-5 h-5" />
                  {isJoining ? "Joining..." : "Join Call"}
                </button>
              )}
            </div>

            {/* Session Info */}
            {/* {isJoined && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-gray-500 text-sm">Channel</p>
                    <p className="font-semibold text-gray-800 text-sm">
                      {channelName}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Participants</p>
                    <p className="font-semibold text-gray-800 flex items-center justify-center gap-1 text-sm">
                      <Users className="w-4 h-4" />
                      {remoteUsers.length + 1}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Status</p>
                    <div className="flex items-center justify-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <p className="font-semibold text-green-600 text-sm">Connected</p>
                    </div>
                  </div>
                </div>
              </div>
            )} */}
          </div>
          {isJoined && (
            <div className="flex items-center gap-4 absolute z-20 bottom-10 left-1/2 -translate-x-1/2">
              {/* Leave button */}
              <button
                onClick={leaveChannel}
                className="px-8 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold flex items-center gap-2 transition-all shadow-lg hover:shadow-xl"
              >
                <PhoneOff className="w-5 h-5" />
                Leave Call
              </button>
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
          )}
        </div>
      </div>
    </div>
  );
};

export default DirectVideoCall;
