"use client"
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, Plus, Search } from 'lucide-react';
import MediaCard from '@/components/Element/MediaCard';
import { useGetVritualTrainersQuery } from '@/store/Slices/apiSlices/studentApiSlice';

export interface VideoData {
  id: string;
  videoUrl: string;
  title: string;
  description: string;
  duration: string;
  sports: 'basketball' | 'football';
  consumer: 'student' | 'teacher';
  thumbnail?: string;
}

const dummyVideos: VideoData[] = [
  {
    id: '1',
    videoUrl: '/videos/basic-ball-control.mp4',
    title: 'Basic ball control',
    description: 'Learn how to control the ball with your feet and body',
    duration: '30s',
    sports: 'football',
    consumer: 'student',
    thumbnail: '/thumbnails/ball-control.jpg'
  },
  {
    id: '2',
    videoUrl: '/videos/passing-receiving.mp4',
    title: 'Passing & Receiving',
    description: 'Master short and long passes with accuracy and control',
    duration: '45s',
    sports: 'football',
    consumer: 'teacher',
    thumbnail: '/thumbnails/passing.jpg'
  },
  {
    id: '3',
    videoUrl: '/videos/dribbling-techniques.mp4',
    title: 'Dribbling Techniques',
    description: 'Improve footwork, speed, and control of the ball',
    duration: '30s',
    sports: 'football',
    consumer: 'student',
    thumbnail: '/thumbnails/dribbling.jpg'
  },
  {
    id: '4',
    videoUrl: '/videos/shooting-finishing.mp4',
    title: 'Shooting & Finishing',
    description: 'Learn powerful and accurate shooting techniques for different game situations',
    duration: '30s',
    sports: 'football',
    consumer: 'teacher',
    thumbnail: '/thumbnails/shooting.jpg'
  },
  {
    id: '5',
    videoUrl: '/videos/defensive-skills.mp4',
    title: 'Defensive Skills',
    description: 'Build tackling, marking, and interception strategies to stop opponents',
    duration: '30s',
    sports: 'football',
    consumer: 'student',
    thumbnail: '/thumbnails/defensive.jpg'
  },
  {
    id: '6',
    videoUrl: '/videos/positioning-movement.mp4',
    title: 'Positioning & Movement',
    description: 'Learn how to control the ball with your feet and body movements effectively',
    duration: '30s',
    sports: 'football',
    consumer: 'teacher',
    thumbnail: '/thumbnails/positioning.jpg'
  },
  {
    id: '7',
    videoUrl: '/videos/basketball-dribbling.mp4',
    title: 'Basketball Dribbling Fundamentals',
    description: 'Master basic and advanced basketball dribbling techniques',
    duration: '45s',
    sports: 'basketball',
    consumer: 'student',
    thumbnail: '/thumbnails/basketball-dribbling.jpg'
  },
  {
    id: '8',
    videoUrl: '/videos/basketball-shooting.mp4',
    title: 'Basketball Shooting Form',
    description: 'Perfect your shooting technique and accuracy',
    duration: '60s',
    sports: 'basketball',
    consumer: 'teacher',
    thumbnail: '/thumbnails/basketball-shooting.jpg'
  },
  {
    id: '9',
    videoUrl: '/videos/basketball-defense.mp4',
    title: 'Basketball Defense Strategies',
    description: 'Learn defensive positioning and techniques',
    duration: '40s',
    sports: 'basketball',
    consumer: 'student',
    thumbnail: '/thumbnails/basketball-defense.jpg'
  },
  {
    id: '10',
    videoUrl: '/videos/basketball-teamwork.mp4',
    title: 'Basketball Team Play',
    description: 'Develop team coordination and communication skills',
    duration: '55s',
    sports: 'basketball',
    consumer: 'teacher',
    thumbnail: '/thumbnails/basketball-teamwork.jpg'
  },
  {
    id: '11',
    videoUrl: '/videos/football-advanced-tactics.mp4',
    title: 'Advanced Football Tactics',
    description: 'Strategic gameplay and formation understanding',
    duration: '90s',
    sports: 'football',
    consumer: 'teacher',
    thumbnail: '/thumbnails/advanced-tactics.jpg'
  },
  {
    id: '12',
    videoUrl: '/videos/basketball-conditioning.mp4',
    title: 'Basketball Conditioning',
    description: 'Physical training and endurance building for basketball',
    duration: '75s',
    sports: 'basketball',
    consumer: 'student',
    thumbnail: '/thumbnails/basketball-conditioning.jpg'
  }
];

const VideoLibrary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sportsFilter, setSportsFilter] = useState<string>('all');
  const [consumerFilter, setConsumerFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter videos based on search term and filters
  const filteredVideos = useMemo(() => {
    return dummyVideos.filter(video => {
      const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           video.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSports = sportsFilter === 'all' || video.sports === sportsFilter;
      const matchesConsumer = consumerFilter === 'all' || video.consumer === consumerFilter;
      
      return matchesSearch && matchesSports && matchesConsumer;
    });
  }, [searchTerm, sportsFilter, consumerFilter]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredVideos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedVideos = filteredVideos.slice(startIndex, startIndex + itemsPerPage);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sportsFilter, consumerFilter]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSportsFilter('all');
    setConsumerFilter('all');
    setCurrentPage(1);
  };

  return (
    <div className="md:px-8 my-8">
      {/* Header */}
      <div className="flex flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Videos Library</h1>
          <p className="text-gray-600 mt-1">
            Showing {filteredVideos.length} of {dummyVideos.length} videos
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search videos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 lg:w-80"
          />
        </div>
        
        <div className="flex flex-row gap-4">
            {(searchTerm || sportsFilter !== 'all' || consumerFilter !== 'all') && (
            <Button variant="outline" onClick={clearFilters} className="whitespace-nowrap hidden md:block py-1">
              Clear Filters
            </Button>
          )}
          <Select value={sportsFilter} onValueChange={setSportsFilter}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Filter by Sport" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sports</SelectItem>
              <SelectItem value="football">Football</SelectItem>
              <SelectItem value="basketball">Basketball</SelectItem>
            </SelectContent>
          </Select>

          <Select value={consumerFilter} onValueChange={setConsumerFilter}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Filter by User" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="student">Student</SelectItem>
              <SelectItem value="teacher">Teacher</SelectItem>
            </SelectContent>
          </Select>

          {(searchTerm || sportsFilter !== 'all' || consumerFilter !== 'all') && (
            <Button variant="outline" onClick={clearFilters} className="whitespace-nowrap block md:hidden py-1">
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Video Grid */}
      {paginatedVideos.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="w-12 h-12 mx-auto mb-4" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No videos found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search terms or filters to find what you&apos;re looking for.
          </p>
          <Button variant="outline" onClick={clearFilters}>
            Clear all filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {paginatedVideos.map((video) => (
            <MediaCard
              key={video.id}
              videoUrl={video.videoUrl}
              title={video.title}
              description={video.description}
              duration={video.duration}
              sports={video.sports}
              consumer={video.consumer}
              thumbnail={video.thumbnail}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages} ({filteredVideos.length} total videos)
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNumber;
                if (totalPages <= 5) {
                  pageNumber = i + 1;
                } else if (currentPage <= 3) {
                  pageNumber = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i;
                } else {
                  pageNumber = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={pageNumber}
                    variant={currentPage === pageNumber ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNumber)}
                    className="w-8 h-8 p-0"
                  >
                    {pageNumber}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoLibrary;