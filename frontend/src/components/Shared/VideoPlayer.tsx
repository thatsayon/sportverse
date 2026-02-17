"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useGetAdminVideoDetailsQuery } from "@/store/Slices/apiSlices/adminApiSlice";
import MediaCard from "@/components/Element/MediaCard";
import Loading from "@/components/Element/Loading";
import ErrorLoadingPage from "@/components/Element/ErrorLoadingPage";
import { useJwt } from "@/hooks/useJwt";
import Hls from "hls.js";

interface VideoDetails {
  video_id: string;
  title: string;
  description: string;
  consumer: string;
  status: "ready" | "processing" | "failed";
  hls_url: string;
  related_videos: VideoItem[];
}

interface VideoItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  consumer: "student" | "teacher" | string;
  sport_name: string;
  created_at: string;
}

interface VideoPlayerProps {
  route: string;
  id: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ route, id }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const { decoded } = useJwt();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const isPlayingRef = useRef(false);
  const playPromiseRef = useRef<Promise<void> | null>(null);

  const isAdmin = decoded?.role === "admin";

  const { data, isLoading, isError } = useGetAdminVideoDetailsQuery(id);
  const videoDetails: VideoDetails | undefined = data;

  // Smart video source initialization — handles both MP4 and HLS (.m3u8)
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoDetails?.hls_url) return;

    // Destroy any previous HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const url = videoDetails.hls_url;
    const isHLS =
      url.includes(".m3u8") ||
      url.includes("application/x-mpegURL") ||
      url.includes("application/vnd.apple.mpegurl");

    if (isHLS) {
      // True HLS stream
      if (Hls.isSupported()) {
        const hls = new Hls({ enableWorker: true, lowLatencyMode: false });
        hlsRef.current = hls;
        hls.loadSource(url);
        hls.attachMedia(video);
        hls.on(Hls.Events.ERROR, (_event, data) => {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                hls.recoverMediaError();
                break;
              default:
                hls.destroy();
                break;
            }
          }
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        // Safari native HLS
        video.src = url;
      }
    } else {
      // Plain MP4 / WebM / any direct video URL — just set src directly
      video.src = url;
      video.load();
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [videoDetails?.hls_url]);

  // Cleanup controls timeout on unmount
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  // Auto-hide controls after 3 seconds of inactivity
  const resetControlsTimeout = () => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    setShowControls(true);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlayingRef.current) {
        setShowControls(false);
      }
    }, 3000);
  };

  const handlePlayPause = async () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlayingRef.current) {
      // Wait for any pending play() before pausing
      if (playPromiseRef.current) {
        try {
          await playPromiseRef.current;
        } catch {
          // Already interrupted, nothing to do
        }
      }
      video.pause();
      isPlayingRef.current = false;
    } else {
      isPlayingRef.current = true;
      playPromiseRef.current = video.play();
      try {
        await playPromiseRef.current;
      } catch (err: any) {
        if (err?.name === "AbortError") {
          isPlayingRef.current = false;
          setIsPlaying(false);
        }
      } finally {
        playPromiseRef.current = null;
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = async (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;

    // Wait for any pending play() before seeking to avoid AbortError
    if (playPromiseRef.current) {
      try {
        await playPromiseRef.current;
      } catch {
        // ignore
      }
    }

    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume;
        setIsMuted(false);
      } else {
        videoRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (isLoading)
    return (
      <div className="min-h-screen">
        <Loading />
      </div>
    );

  if (isError || !videoDetails)
    return (
      <div className="min-h-screen">
        <ErrorLoadingPage />
      </div>
    );

  if (videoDetails.status === "processing") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#F15A24] mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Video Processing
          </h2>
          <p className="text-gray-600">
            Your video is being processed. Please check back later.
          </p>
        </div>
      </div>
    );
  }

  if (videoDetails.status === "failed") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">
            Video Processing Failed
          </h2>
          <p className="text-gray-600">
            There was an error processing this video. Please try uploading
            again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-4 py-4">
        <Link
          href={
            decoded?.role !== "admin"
              ? `/${route}/video-library`
              : "/dashboard/media"
          }
        >
          <Button
            variant="ghost"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} />
            Back to video library
          </Button>
        </Link>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        {/* Video Player Section */}
        <div className="mb-8">
          <div
            ref={containerRef}
            className="relative bg-black rounded-lg overflow-hidden shadow-2xl cursor-pointer"
            onMouseMove={resetControlsTimeout}
            onMouseLeave={() => setShowControls(false)}
          >
            {/* HTML5 Video Player */}
            <div className="relative aspect-video">
              <video
                ref={videoRef}
                className="w-full h-full object-contain"
                preload="metadata"
                playsInline
                onContextMenu={(e) => e.preventDefault()}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onPlay={() => {
                  isPlayingRef.current = true;
                  setIsPlaying(true);
                }}
                onPause={() => {
                  isPlayingRef.current = false;
                  setIsPlaying(false);
                }}
                onClick={handlePlayPause}
                style={{ outline: "none" }}
              >
                Your browser does not support the video tag.
              </video>

              {/* Custom Controls Overlay */}
              <div
                className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
                  showControls ? "opacity-100" : "opacity-0"
                }`}
              >
                {/* Play/Pause Center Overlay */}
                {!isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
                    <button
                      onClick={handlePlayPause}
                      className="bg-[#F15A24] hover:bg-[#F15A24]/90 text-white rounded-full p-4 transition-all duration-200 hover:scale-110"
                    >
                      <Play className="w-8 h-8 ml-1" fill="currentColor" />
                    </button>
                  </div>
                )}

                {/* Controls Bar */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pointer-events-auto">
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div
                      className="w-full h-2 bg-white/30 rounded-full cursor-pointer group"
                      onClick={handleSeek}
                    >
                      <div
                        className="h-full bg-[#F15A24] rounded-full transition-all duration-150 group-hover:h-3"
                        style={{
                          width: `${
                            duration ? (currentTime / duration) * 100 : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Control Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Play/Pause */}
                      <button
                        onClick={handlePlayPause}
                        className="text-white hover:text-[#F15A24] transition-colors"
                      >
                        {isPlaying ? (
                          <Pause className="w-6 h-6" />
                        ) : (
                          <Play className="w-6 h-6" fill="currentColor" />
                        )}
                      </button>

                      {/* Volume Control */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={toggleMute}
                          className="text-white hover:text-[#F15A24] transition-colors"
                        >
                          {isMuted ? (
                            <VolumeX className="w-5 h-5" />
                          ) : (
                            <Volume2 className="w-5 h-5" />
                          )}
                        </button>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={isMuted ? 0 : volume}
                          onChange={handleVolumeChange}
                          className="w-20 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, #F15A24 0%, #F15A24 ${
                              (isMuted ? 0 : volume) * 100
                            }%, rgba(255,255,255,0.3) ${
                              (isMuted ? 0 : volume) * 100
                            }%, rgba(255,255,255,0.3) 100%)`,
                          }}
                        />
                      </div>

                      {/* Time Display */}
                      <span className="text-white text-sm">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>

                    {/* Right Controls */}
                    <div className="flex items-center gap-4">
                      <button
                        onClick={toggleFullscreen}
                        className="text-white hover:text-[#F15A24] transition-colors"
                      >
                        {isFullscreen ? (
                          <Minimize className="w-5 h-5" />
                        ) : (
                          <Maximize className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Video Title and Description */}
          <div className="mt-6">
            <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-4">
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  {videoDetails.title}
                </h1>
                <div className="flex items-center gap-2 mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200 capitalize">
                    {videoDetails.consumer}
                  </span>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      videoDetails.status === "ready"
                        ? "bg-green-100 text-green-800 border border-green-200"
                        : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                    }`}
                  >
                    {videoDetails.status}
                  </span>
                </div>
              </div>
            </div>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed max-w-4xl">
              {videoDetails.description}
            </p>
          </div>
        </div>

        {/* Related Videos Section */}
        {videoDetails.related_videos &&
          videoDetails.related_videos.length > 0 && (
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
                Related Videos ({videoDetails.related_videos.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {videoDetails.related_videos.map((video) => (
                  <MediaCard
                    key={video.id}
                    id={video.id}
                    open={open}
                    setOpen={setOpen}
                    title={video.title}
                    description={video.description}
                    sports={video.sport_name}
                    consumer={video.consumer}
                    thumbnail={video.thumbnail}
                    isAdmin={isAdmin}
                  />
                ))}
              </div>
            </div>
          )}

        {/* No Related Videos Message */}
        {videoDetails.related_videos &&
          videoDetails.related_videos.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Related Videos
              </h3>
              <p className="text-gray-600">
                Check back later for more videos in this category.
              </p>
            </div>
          )}
      </div>

      {/* Custom CSS for range input thumb */}
      <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #f15a24;
          cursor: pointer;
          border: 2px solid white;
        }

        input[type="range"]::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #f15a24;
          cursor: pointer;
          border: 2px solid white;
        }
      `}</style>
    </div>
  );
};

export default VideoPlayer; 