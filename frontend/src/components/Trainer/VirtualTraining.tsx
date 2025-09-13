"use client";
import React, { useState, useMemo } from "react";
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
import { Input } from "@/components/ui/input";
import { FilterIcon, Search, Star, DollarSign } from "lucide-react";
import TrainerviewCard from "../Element/TrainerViewCard";

function VirtualTraining() {
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [priceFilter, setPriceFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  console.log("Filter values:", { ratingFilter, priceFilter, searchQuery });

  // Filter the trainers based on rating, price, and search query
  const filteredData = useMemo(() => {
    return trainersProfiles.filter((trainer) => {
      // Search filter - check if name includes search query (case insensitive)
      const nameMatch = trainer.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      // Rating filter
      let ratingMatch = true;
      if (ratingFilter === "4plus") {
        ratingMatch = trainer.rating >= 4.0;
      } else if (ratingFilter === "4.5plus") {
        ratingMatch = trainer.rating >= 4.5;
      } else if (ratingFilter === "below4") {
        ratingMatch = trainer.rating < 4.0;
      }

      // Price filter (assuming virtualPrice is a number)
      let priceMatch = true;
      if (priceFilter === "low") {
        priceMatch = trainer.virtualPrice <= 30;
      } else if (priceFilter === "medium") {
        priceMatch = trainer.virtualPrice > 30 && trainer.virtualPrice <= 60;
      } else if (priceFilter === "high") {
        priceMatch = trainer.virtualPrice > 60;
      }

      // Show coaches who offer either Virtual or Mindset Sessions and match all filters
      const sessionMatch =
        trainer.consultancyPlans.includes("Virtual Session") ||
        trainer.consultancyPlans.includes("Mindset Session");

      return sessionMatch && nameMatch && ratingMatch && priceMatch;
    });
  }, [ratingFilter, priceFilter, searchQuery]);

  const clearAllFilters = () => {
    setRatingFilter("all");
    setPriceFilter("all");
    setSearchQuery("");
  };

  const activeFiltersCount =
    [ratingFilter, priceFilter].filter((filter) => filter !== "all").length +
    (searchQuery ? 1 : 0);

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-4xl font-semibold font-montserrat mb-2">
          Virtual Trainers
        </h2>
        <p>Browse professional trainers through visiting their profile</p>
      </div>

      {/* Filters Section */}
      <div className="flex flex-col-reverse lg:flex-row items-start justify-between sm:flex-row gap-4 w-full md:w-auto mb-2">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-3.5 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search trainers by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full h-11 sm:w-64 border-[#5B5B5B] focus:border-orange-500"
          />
          {filteredData.length > 0 && (
            <p className="text-sm text-gray-600 mt-3">
              Showing {filteredData.length} trainer
              {filteredData.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        <div className="flex gap-2">
          {/* Clear Filters Button */}
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              onClick={clearAllFilters}
              className="text-gray-600 hover:text-gray-800 px-3 hidden lg:block"
            >
              Clear ({activeFiltersCount})
            </Button>
          )}
          {/* Rating Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className={`border-[#5B5B5B] text-[#5B5B5B] ${
                  ratingFilter !== "all"
                    ? "bg-orange-50 border-orange-500 text-orange-600"
                    : ""
                }`}
              >
                <Star className="w-4 h-4 mr-1" />
                Rating
                {ratingFilter !== "all" && (
                  <span className="ml-1 bg-orange-500 text-white rounded-full px-1.5 py-0.5 text-xs">
                    1
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <DropdownMenuLabel>Filter by Rating</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={ratingFilter}
                onValueChange={setRatingFilter}
              >
                <DropdownMenuRadioItem value="all">
                  All Ratings
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="4.5plus">
                  4.5+ Stars
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="4plus">
                  4.0+ Stars
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="below4">
                  Below 4.0
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Price Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className={`border-[#5B5B5B] text-[#5B5B5B] ${
                  priceFilter !== "all"
                    ? "bg-orange-50 border-orange-500 text-orange-600"
                    : ""
                }`}
              >
                <DollarSign className="w-4 h-4 mr-1" />
                Price
                {priceFilter !== "all" && (
                  <span className="ml-1 bg-orange-500 text-white rounded-full px-1.5 py-0.5 text-xs">
                    1
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
              <DropdownMenuLabel>Filter by Price Range</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={priceFilter}
                onValueChange={setPriceFilter}
              >
                <DropdownMenuRadioItem value="all">
                  All Prices
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="low">
                  $0 - $30
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="medium">
                  $31 - $60
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="high">$60+</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Clear Filters Button */}
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              onClick={clearAllFilters}
              className="text-gray-600 hover:text-gray-800 px-3 block lg:hidden"
            >
              Clear ({activeFiltersCount})
            </Button>
          )}
        </div>
      </div>

      {/* No Results Message */}
      {filteredData.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="w-16 h-16 mx-auto mb-4" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No trainers found
          </h3>
          <p className="text-gray-500 mb-4">
            Try adjusting your search or filter criteria
          </p>
          <Button
            variant="outline"
            onClick={clearAllFilters}
            className="border-orange-500 text-orange-600 hover:bg-orange-50"
          >
            Clear all filters
          </Button>
        </div>
      )}

      {/* Trainers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData.map((item) => (
          <TrainerviewCard
            image={item.profileImage}
            name={item.name}
            rating={item.rating}
            price={item.virtualPrice}
            sports={item.title}
            key={item.id}
            description={item.description}
            totalReview={item.totalReviews}
          />
        ))}
      </div>
    </div>
  );
}

export default VirtualTraining;
