"use client"
import React from 'react';
import { ArrowLeft, Play, Pause, RotateCcw, Settings, Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

interface RelatedVideo {
  id: string;
  title: string;
  description: string;
  duration: string;
  thumbnail: string;
}

interface VideoPlayerProps{
    route: string
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({route}) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(29);
  const [duration] = React.useState(546);

  const relatedVideos: RelatedVideo[] = [
    {
      id: '1',
      title: 'Core Strength Workout',
      description: 'Learn the fundamentals of strength training with proper form and technique.',
      duration: '13:15',
      thumbnail: '/api/placeholder/300/180'
    },
    {
      id: '2',
      title: 'Flexibility & Stretching',
      description: 'Learn the fundamentals of strength training with proper form and technique.',
      duration: '15:30',
      thumbnail: '/api/placeholder/300/180'
    },
    {
      id: '3',
      title: 'Cardio Burst Training',
      description: 'Learn the fundamentals of strength training with proper form and technique.',
      duration: '8:45',
      thumbnail: '/api/placeholder/300/180'
    }
  ];

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = (currentTime / duration) * 100;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-4">
        <Link href={`/${route}/video-library`}>
        <Button 
          variant="ghost" 
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          onClick={() => window.history.back()}
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
          <div className="relative bg-black rounded-lg overflow-hidden shadow-lg">
            {/* Video Display Area */}
            <div className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900">
              {/* Placeholder Basketball Court Scene */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB2aWV3Qm94PSIwIDAgODAwIDQ1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwMCIgaGVpZ2h0PSI0NTAiIGZpbGw9IiM0QTU1NjgiLz4KPCEtLSBCYXNrZXRiYWxsIGNvdXJ0IGZsb29yIC0tPgo8cmVjdCB4PSIxMDAiIHk9IjEwMCIgd2lkdGg9IjYwMCIgaGVpZ2h0PSIyNTAiIGZpbGw9IiNEOTc3MDYiLz4KPCEtLSBDb3VydCBsaW5lcyAtLT4KPGxpbmUgeDE9IjQwMCIgeTE9IjEwMCIgeDI9IjQwMCIgeTI9IjM1MCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxjaXJjbGUgY3g9IjQwMCIgY3k9IjIyNSIgcj0iNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIvPgo8IS0tIFBsYXllciBzaWxob3VldHRlcyAtLT4KPGVsbGlwc2UgY3g9IjIwMCIgY3k9IjMwMCIgcng9IjE1IiByeT0iMjUiIGZpbGw9IiMxRjI5MzciLz4KPGVsbGlwc2UgY3g9IjMwMCIgY3k9IjI4MCIgcng9IjE1IiByeT0iMjUiIGZpbGw9IiMxRjI5MzciLz4KPGVsbGlwc2UgY3g9IjUwMCIgY3k9IjI5MCIgcng9IjE1IiByeT0iMjUiIGZpbGw9IiMxRjI5MzciLz4KPGVsbGlwc2UgY3g9IjYwMCIgY3k9IjMxMCIgcng9IjE1IiByeT0iMjUiIGZpbGw9IiMxRjI5MzciLz4KPC9zdmc+Cg==')] bg-cover bg-center opacity-60"></div>
                
                {/* Play Button Overlay */}
                {!isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button
                      onClick={() => setIsPlaying(true)}
                      className="w-16 h-16 rounded-full bg-[#F15A24] hover:bg-[#F15A24]/90 flex items-center justify-center shadow-lg"
                    >
                      <Play size={24} fill="white" className="text-white ml-1" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Frame Counter */}
              <div className="absolute top-4 left-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
                Frame 850
              </div>

              {/* Video Controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="w-full bg-gray-600/50 h-1 rounded-full cursor-pointer">
                    <div 
                      className="h-full bg-[#F15A24] rounded-full transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="text-white hover:text-[#F15A24] hover:bg-white/20"
                    >
                      {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:text-[#F15A24] hover:bg-white/20"
                    >
                      <RotateCcw size={18} />
                    </Button>
                    <span className="text-white text-sm">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:text-[#F15A24] hover:bg-white/20"
                    >
                      <Settings size={18} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:text-[#F15A24] hover:bg-white/20"
                    >
                      <Maximize size={18} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Video Title and Description */}
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Strength Training for Beginners
              </h1>
              <span className="bg-[#F15A24] text-white px-2 py-1 rounded text-xs font-medium">
                BEGINNER
              </span>
            </div>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed max-w-4xl">
              Learn the fundamentals of strength training with proper form and technique. This comprehensive guide covers basic exercises, safety tips, and how to build your first workout routine.
            </p>
          </div>
        </div>

        {/* Related Videos Section */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
            Related Videos
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {relatedVideos.map((video) => (
              <Card key={video.id} className="group py-0 cursor-pointer hover:shadow-lg transition-shadow duration-300 border border-[#D9D9D9]">
                <CardContent className="p-0">
                  {/* Thumbnail */}
                  <div className="relative aspect-video bg-gradient-to-br from-gray-300 to-gray-400 rounded-t-lg overflow-hidden">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDMwMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMTgwIiBmaWxsPSIjNEE1NTY4Ii8+CjxyZWN0IHg9IjMwIiB5PSIzMCIgd2lkdGg9IjI0MCIgaGVpZ2h0PSIxMjAiIGZpbGw9IiNEOTc3MDYiLz4KPGxpbmUgeDE9IjE1MCIgeTE9IjMwIiB4Mj0iMTUwIiB5Mj0iMTUwIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjEuNSIvPgo8Y2lyY2xlIGN4PSIxNTAiIGN5PSI5MCIgcj0iMjUiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMS41Ii8+CjxlbGxpcHNlIGN4PSI4MCIgY3k9IjEyMCIgcng9IjYiIHJ5PSIxMCIgZmlsbD0iIzFGMjkzNyIvPgo8ZWxsaXBzZSBjeD0iMTIwIiBjeT0iMTEwIiByeD0iNiIgcnk9IjEwIiBmaWxsPSIjMUYyOTM3Ii8+CjxlbGxpcHNlIGN4PSIxODAiIGN5PSIxMTUiIHJ4PSI2IiByeT0iMTAiIGZpbGw9IiMxRjI5MzciLz4KPGVsbGlwc2UgY3g9IjIyMCIgY3k9IjEyNSIgcng9IjYiIHJ5PSIxMCIgZmlsbD0iIzFGMjkzNyIvPgo8L3N2Zz4K')] bg-cover bg-center opacity-80"></div>
                    
                    {/* Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-[#F15A24] group-hover:bg-[#F15A24]/90 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                        <Play size={16} fill="white" className="text-white ml-0.5" />
                      </div>
                    </div>
                    
                    {/* Duration Badge */}
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
                      {video.duration}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-[#F15A24] transition-colors">
                      {video.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {video.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;