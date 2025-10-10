"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import MediaCard from "@/components/Element/MediaCard";
import Loading from "../Element/Loading";
import ErrorLoadingPage from "../Element/ErrorLoadingPage";
import { useGetVideosQuery } from "@/store/Slices/apiSlices/trainerApiSlice";

// Updated interfaces based on your backend data
export interface VideoItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  consumer: "student" | "teacher" | string;
  sport_name: string;
  created_at: string;
}

export interface VideoListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: VideoItem[];
}

const VideoLibrary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sportsFilter, setSportsFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const { data, isLoading, isError } = useGetVideosQuery();

  const videos = data?.results || [];
  
  // Get unique sports for the filter dropdown
  const uniqueSports = useMemo(() => {
    const sportsSet = new Set(videos.map(video => video.sport_name.toLowerCase()));
    return Array.from(sportsSet);
  }, [videos]);

  // Filter videos based on search term and filters
  const filteredVideos = useMemo(() => {
    return videos.filter((video) => {
      const matchesSearch =
        video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSports =
        sportsFilter === "all" || video.sport_name.toLowerCase() === sportsFilter;

      return matchesSearch && matchesSports;
    });
  }, [videos, searchTerm, sportsFilter]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredVideos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedVideos = filteredVideos.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sportsFilter]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSportsFilter("all");
    setCurrentPage(1);
  };

  if(isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loading/>
    </div>
  )
  if(isError) return <ErrorLoadingPage/>

  return (
    <div className="md:px-8 my-8">
      {/* Header */}
      <div className="flex flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Videos Library
          </h1>
          <p className="text-gray-600 mt-1">
            Showing {filteredVideos.length} of {videos.length} videos
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 p-4 rounded-lg">
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
          {(searchTerm || sportsFilter !== "all") && (
            <Button
              variant="outline"
              onClick={clearFilters}
              className="whitespace-nowrap hidden md:block py-1"
            >
              Clear Filters
            </Button>
          )}
          <Select value={sportsFilter} onValueChange={setSportsFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by Sport" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sports</SelectItem>
              {uniqueSports.map((sport) => (
                <SelectItem key={sport} value={sport}>
                  {sport.charAt(0).toUpperCase() + sport.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {(searchTerm || sportsFilter !== "all") && (
            <Button
              variant="outline"
              onClick={clearFilters}
              className="whitespace-nowrap block md:hidden py-1"
            >
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No videos found
          </h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search terms or filters to find what you&apos;re
            looking for.
          </p>
          <Button variant="outline" onClick={clearFilters}>
            Clear all filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8 px-4 md:px-0">
          {paginatedVideos.map((video) => (
            <Link key={video.id} href={`/trainer/video-library/${video.id}`}>
              <MediaCard
                id={video.id}
                title={video.title}
                description={video.description}
                sports={video.sport_name}
                consumer={video.consumer}
                thumbnail={video.thumbnail}
                isAdmin={false}
                open={false}
                setOpen={() => {}}
                setSelectedId={() => {}}
              />
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages} ({filteredVideos.length} total
            videos)
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size={"icon"}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="w-8 h-8 p-0"
            >
              <ChevronLeft className="w-8 h-8" />
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
                    size={"icon"}
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
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="w-8 h-8 p-0"
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoLibrary;