"use client";
import React, { useState } from "react";
import TrainerCard from "../Element/TrainerCard";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { FilterIcon } from "lucide-react";
import { useGetVritualTrainersQuery } from "@/store/Slices/apiSlices/studentApiSlice";
import { LoadingSpinner } from "../Element/LoadingSpinner";
import Loading from "../Element/Loading";

function VirtualTraining() {
  const [filter, setFilter] = useState<string>("all");
  const { data, isLoading } = useGetVritualTrainersQuery();

  console.log("Filter values:", filter);
  console.log("Data values:", data);

  // Filter based on new API structure
  const filteredData =
    data?.results.filter((trainer) => {
      if (filter === "all") {
        return trainer.training_info.some(
          (t) => t.training_type === "virtual" || t.training_type === "mindset"
        );
      } else if (filter === "virtual") {
        return trainer.training_info.some((t) => t.training_type === "virtual");
      } else if (filter === "mindset") {
        return trainer.training_info.some((t) => t.training_type === "mindset");
      }
      return false;
    }) || [];


    if (isLoading) {
      return (

        <LoadingSpinner size="xl" className="mx-auto my-20" />
      )
    }

  return (
    <div className="min-h-[calc(100vh-240px)]">
      {/* Header + Filters */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-6 md:gap-0">
        <div>
          <h2 className="text-3xl font-semibold font-montserrat mb-2">
            {filter === "all"
              ? "Virtual Trainers"
              : filter === "virtual"
              ? "Virtual Sessions"
              : "Mindset Sessions"}
          </h2>
          <p>Connect with professional trainers through live video sessions</p>
        </div>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="border-[#5B5B5B] text-[#5B5B5B]"
              >
                <FilterIcon /> Filters
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Choose Session Type</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={filter}
                onValueChange={setFilter}
              >
                <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="virtual">
                  Virtual Session
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="mindset">
                  Mindset Session
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Trainers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          <Loading/>
        ) : filteredData.length === 0 ? (
          <p>No trainers found.</p>
        ) : (
          filteredData.map((item, index) => {
            // pick first matching price (virtual or mindset)
            const matchingTraining = item.training_info.find(
              (t) =>
                filter === "all" ||
                t.training_type.toLowerCase() === filter.toLowerCase()
            );

            return (
              <TrainerCard
                key={index}
                institute_name={item.institute_name}
                id={index}
                image="/trainer/default.jpg" // fallback until API provides images
                name={item.full_name}
                rating={4.5} // placeholder, API doesn’t provide rating yet
                price={matchingTraining ? Number(matchingTraining.price) : 0.00}
                sports={item.coach_type.replace("controlpanel.Sport.", "")}
                sessionType={item.training_info}
              />
            );
          })
        )}
      </div>
    </div>
  );
}

export default VirtualTraining;
