"use client";

import React, { useState, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BookingPageData } from "@/data/BookingPageData";
import BookingCard from "../Element/BookingCard";
import Link from "next/link";
import { Button } from "../ui/button";

// Session type from your interface
type SessionType = "Virtual Session" | "Mindset Session" | "In Person";

const BookingPage = ({ isHeader = true, sliceNumber= 8 }: { isHeader?: boolean; sliceNumber?: number }) => {
  const bookings = BookingPageData;
  const [selectedFilter, setSelectedFilter] = useState<SessionType | "all">(
    "all"
  );

  // Filter bookings based on selected sessionType
  const filteredBookings = useMemo(() => {
    if (selectedFilter === "all") {
      return bookings;
    }
    return bookings.filter((booking) => booking.sessionType === selectedFilter);
  }, [bookings, selectedFilter]);

  // Count bookings by sessionType
  const sessionTypeCounts = useMemo(() => {
    return bookings.reduce((acc, booking) => {
      acc[booking.sessionType] = (acc[booking.sessionType] || 0) + 1;
      return acc;
    }, {} as Record<SessionType, number>);
  }, [bookings]);

  return (
    <div className={`w-full max-w-7xl mx-auto p-4`}>
      {/* Filter Section */}
      {isHeader && (
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">My Bookings</h2>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Filter by:</span>
              <Select
                value={selectedFilter}
                onValueChange={(value) =>
                  setSelectedFilter(value as SessionType | "all")
                }
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Sessions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    All Sessions ({bookings.length})
                  </SelectItem>
                  <SelectItem value="Virtual Session">
                    Virtual Session ({sessionTypeCounts["Virtual Session"] || 0}
                    )
                  </SelectItem>
                  <SelectItem value="Mindset Session">
                    Mindset Session ({sessionTypeCounts["Mindset Session"] || 0}
                    )
                  </SelectItem>
                  <SelectItem value="In Person">
                    In Person ({sessionTypeCounts["In Person"] || 0})
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {
        !isHeader &&
        <div className="text-end mb-2">
          <Link href={"/student/bookings"}>
          <Button variant={"outline"} className="py-2">
            View All
          </Button>
          </Link>
        </div>
      }

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length > 0 ? (
          filteredBookings.slice(0, sliceNumber).map((booking) => (
            <BookingCard key={booking.id} {...booking} />
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {selectedFilter === "all"
                ? "No sessions found"
                : `No ${selectedFilter} sessions found`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingPage;
