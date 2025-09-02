"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Pencil, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
// import { sportsTableData } from "@/data/SportsTableData";
import Image from "next/image";
import UpdateSportsPopUp from "./UpdateSportsPopUp";
import { useGetAllSportsQuery } from "@/store/Slices/apiSlices/apiSlice";

const SportsCategory: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [open, setOpen] = useState<boolean>(false);
  const itemsPerPage = 10;
  const { data, isLoading, refetch } = useGetAllSportsQuery();

if (isLoading) return <div>Loading...</div>;
// if (error) return <div>Error: {error}</div>;

const sportsTableData = data?.results || []; // Safely access results

  console.log("open state:", open);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // 🚀 Trigger fetch, router push, or data reload here
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(sportsTableData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sportsTableData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="w-full">
      <UpdateSportsPopUp open={open} setOpen={setOpen} refetch={refetch} />
      <div className="mb-4 md:mb-8 flex items-center w-full justify-between">
        <h1 className="text-xl md:text-2xl font-semibold font-montserrat">
          All Available Sports
        </h1>
        <div>
          <Button onClick={() => setOpen(true)}>
            <Plus /> Add Sports
          </Button>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-6 py-4">No</TableHead>
              <TableHead className="px-6 py-4">Sports Name</TableHead>
              <TableHead className="px-6 py-4">Total Videos</TableHead>
              <TableHead className="px-6 py-4">Total Trainer</TableHead>
              <TableHead className="px-6 py-4">Total Trainee</TableHead>
              <TableHead className="px-6 py-4">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell className="px-6 py-4">{index + 1}</TableCell>
                <TableCell className=" py-4">
                  <div className="flex items-center gap-2">
                    <Image
                      src={item.image}
                      alt="sports image"
                      width={40}
                      height={40}
                      className="object-center rounded-full"
                      onError={(e) => {
                        e.currentTarget.src = "/default-image.png";
                      }}
                    />
                    {item.name}
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4">{item.totalVideos}</TableCell>
                <TableCell className="px-6 py-4">
                  {item.totalTrainers}
                </TableCell>
                <TableCell className="px-6 py-4">
                  {item.totalTrainees}
                </TableCell>
                <TableCell className="px-6 py-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant={"ghost"} className="hover:bg-gray-300">
                        <Pencil />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Edit</p>
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-end mt-4 md:mt-8">
        <div className="flex items-center gap-2">
          {/* Prev */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Page Numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              className={cn(
                "w-10 h-10",
                currentPage === page
                  ? "bg-orange-500 text-white hover:bg-orange-600"
                  : ""
              )}
              onClick={() => goToPage(page)}
            >
              {page}
            </Button>
          ))}

          {/* Next */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SportsCategory;
