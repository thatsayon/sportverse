"use client";
import React, { useState, useEffect } from "react";
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
import { ChevronLeft, ChevronRight, Plus, Search } from "lucide-react";
import MediaCard from "@/components/Element/MediaCard";
import VideoEditFrom from "@/components/Element/VideoEditForm";
import { useGetAdminVideosQuery } from "@/store/Slices/apiSlices/adminApiSlice";
import Loading from "@/components/Element/Loading";
import ErrorLoadingPage from "@/components/Element/ErrorLoadingPage";

interface VideoItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  consumer: "student" | "teacher" | string;
  sport_name: string;
  created_at: string;
}

interface MediaManagementProps {
  isAdmin: boolean;
}

const MediaManagement: React.FC<MediaManagementProps> = ({
  isAdmin = true,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sportsFilter, setSportsFilter] = useState<string>("all");
  const [consumerFilter, setConsumerFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string>('')
  const [filteredVideos, setFilteredVideos] = useState<VideoItem[]>([]);
  const itemsPerPage = isAdmin ? 6 : 8;
  const { data, isLoading, isError } = useGetAdminVideosQuery();

  const videos = data?.results || [];

  // Filter videos whenever search term, filters, or videos data changes
  useEffect(() => {
    if (!videos.length) {
      setFilteredVideos([]);
      return;
    }

    const filtered = videos.filter((video: VideoItem) => {
      const matchesSearch =
        video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSports =
        sportsFilter === "all" || 
        video.sport_name.toLowerCase() === sportsFilter.toLowerCase();
      
      const matchesConsumer =
        consumerFilter === "all" || 
        video.consumer.toLowerCase() === consumerFilter.toLowerCase();

      return matchesSearch && matchesSports && matchesConsumer;
    });

    setFilteredVideos(filtered);
  }, [videos, searchTerm, sportsFilter, consumerFilter]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredVideos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedVideos = filteredVideos.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sportsFilter, consumerFilter]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSportsFilter("all");
    setConsumerFilter("all");
    setCurrentPage(1);
  };

  // Get unique sports for filter dropdown
  const uniqueSports = Array.from(
    new Set(videos.map((video: VideoItem) => video.sport_name))
  );

  if (isLoading) return <Loading />;
  if (isError) return <ErrorLoadingPage />;

  return (
    <div className={`md:px-6 ${isAdmin ? "" : "mt-6 mb-6"}`}>
      {/* Header */}
      <div className="flex flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Videos
          </h1>
          <p className="text-gray-600 mt-1">
            Showing {filteredVideos.length} of {videos.length} videos
          </p>
        </div>
        {isAdmin && (
          <Link href="/dashboard/media/video-upload">
            <Button
              variant={"outline"}
              size={"lg"}
              className="flex py-2 md:py-2.5 text-[#F15A24] items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add
            </Button>
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search videos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 lg:w-80"
          />
        </div>

        <div className="flex flex-row gap-4">
          {(searchTerm ||
            sportsFilter !== "all" ||
            consumerFilter !== "all") && (
            <Button
              variant="outline"
              onClick={clearFilters}
              className="whitespace-nowrap hidden md:block py-1"
            >
              Clear Filters
            </Button>
          )}
          
          <Select value={sportsFilter} onValueChange={setSportsFilter}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Filter by Sport" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sports</SelectItem>
              {uniqueSports.map((sport) => (
                <SelectItem key={sport} value={sport.toLowerCase()}>
                  {sport}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {isAdmin && (
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
          )}

          {(searchTerm ||
            sportsFilter !== "all" ||
            consumerFilter !== "all") && (
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
        <div
          className={`grid grid-cols-1 md:grid-cols-2 ${
            isAdmin ? "xl:grid-cols-3" : "lg:grid-cols-3 xl:grid-cols-4"
          } gap-6 mb-8`}
        >
          {paginatedVideos.map((video: VideoItem) => (
            <MediaCard
              id={video.id}
              key={video.id}
              open={open}
              setOpen={setOpen}
              title={video.title}
              description={video.description}
              sports={video.sport_name}
              consumer={video.consumer}
              thumbnail={video.thumbnail}
              isAdmin={isAdmin}
              setSelectedId={setSelectedId}
            />
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

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-1 w-8 h-8"
            >
              <ChevronLeft className="w-4 h-4" />
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
              className="flex items-center gap-1 w-8 h-8"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
      <VideoEditFrom open={open} setOpen={setOpen} id={selectedId} />
    </div>
  );
};

export default MediaManagement;