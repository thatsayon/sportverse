"use client";
import React, { useState } from "react";
import TrainerCard from "../Element/TrainerCard";
import { trainersProfiles } from "@/data/TrainersProfiles";
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

function VirtualTraining() {
  const [filter, setFilter] = useState<string>("all");

  console.log("Filter values:",filter)

  // Filter the trainers based on selected filter
   const filteredData = trainersProfiles.filter((trainer) => {
    if (filter === "all") {
      // Show coaches who offer either Virtual or Mindset Sessions
      return (
        trainer.consultancyPlans.includes("Virtual Session") ||
        trainer.consultancyPlans.includes("Mindset Session")
      );
    } else if (filter === "virtual") {
      // Show only coaches who offer Virtual Session
      return trainer.consultancyPlans.includes("Virtual Session");
    } else if (filter === "mindset") {
      // Show only coaches who offer Mindset Session
      return trainer.consultancyPlans.includes("Mindset Session");
    }
    return false;
  });


  return (
    <div>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-6 md:gap-0">
        <div>
          <h2 className="text-3xl font-semibold font-montserrat mb-2">
            {filter === "all" ? "Virtual Trainers" : filter}
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
              <DropdownMenuRadioGroup value={filter} onValueChange={setFilter}>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData.map((item) => (
          <TrainerCard
            image={item.profileImage}
            name={item.name}
            rating={item.rating}
            price={item.virtualPrice}
            sports={item.title}
            key={item.id}
          />
        ))}
      </div>
    </div>
  );
}

export default VirtualTraining;
