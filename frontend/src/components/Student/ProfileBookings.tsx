"use client";
import React, { useState } from "react";
import TrainerBookingCard from "@/components/Element/TrainerBookingCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetBookingsQuery } from "@/store/Slices/apiSlices/studentApiSlice";
import ErrorLoadingPage from "../Element/ErrorLoadingPage";
import { Button } from "../ui/button";
import Link from "next/link";
import NoDataFound from "../Element/NoDataFound";
import { isFloat32Array } from "util/types";
import Loading from "../Element/Loading";

function ProfileBookings() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 5; // sessions per page

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const { data, isError, isLoading } = useGetBookingsQuery();

  //console.log("booking data:", data)

  const trainerBookingData = data?.results ?? [];

  if(isLoading)return <Loading/>
  if(isError)return <ErrorLoadingPage/>

  if (trainerBookingData?.length === 0) {
    return (
      <div>
        <h1 className="mt-14 text-center text-3xl font-semibold">No Session taken yet</h1>
        <div className="flex items-center justify-center mt-6">
          <Link href={"/student/virtual-training"}>
        <Button>
          View Trainers
        </Button>
        </Link>
        </div>
      </div>
    );
  }
  // Filter logic
  const filteredData =
    statusFilter === "all"
      ? trainerBookingData
      : trainerBookingData?.filter((item) => item.status === statusFilter);

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="max-w-7xl mx-auto my-8">
        <div className="mb-4 text-end">
            <Link href={"/student/bookings"}>
            <Button>
                View All
            </Button>
            </Link>
        </div>

      {/* Session Cards */}
      <div className="space-y-4 ">
        {
          data?.results.length >=0 ? (
            <div>
              {paginatedData.slice(0,3).map((item) => (
          <TrainerBookingCard key={item.id} {...item} />
        ))}
            </div>

      ):(
        <div><NoDataFound/></div>
      )
        }
      </div>
    </div>
  );
}

export default ProfileBookings;
