"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Calendar, Clock, MapPin, Laptop } from "lucide-react";
import Image from "next/image";
import { BookingCardProps } from "@/data/BookingPageData";
import { getCookie } from "@/hooks/cookie";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { setCallConfig } from "@/store/Slices/stateSlices/studentSlice";
import { useRouter } from "next/navigation";

const BookingCard: React.FC<BookingCardProps> = ({
  trainerName,
  sports,
  sessionTime,
  sessionDate,
  sessionType,
  trainerImage,
  rating = 5,
}) => {
  // Get session type styling
  const dispatch = useDispatch();
  const router = useRouter();
  const getSessionTypeColor = (type: string) => {
    switch (type) {
      case "Virtual Session":
        return "bg-blue-100 text-blue-800";
      case "Mindset Session":
        return "bg-purple-100 text-purple-800";
      case "In Person":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get sports icon/color
  const getSportsColor = (sport: string) => {
    switch (sport) {
      case "Football":
        return "bg-orange-100 text-orange-800";
      case "Basketball":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Generate initials from trainer name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  // video calling functions
  const handleVideoCall = async () => {
    const accessToken = getCookie("access_token");
    const response = await fetch(
      "https://stingray-intimate-sincerely.ngrok-free.app/communication/meeting/agora/token/",
      {
        body: JSON.stringify({ channelName: "Student" }), // Assuming it's a GET request. You can change it if needed.
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Set the content type to application/json

          Authorization: `Bearer ${accessToken}`, // Un-comment and replace this if using token-based auth
        },
      }
    );
    if (response) {
      const data = await response.json();
      //console.log("Generated Booking data", data);
      dispatch(setCallConfig(data));

      //console.log(data);
      // router.push("/video");
    } else {
      //console.log("error occurs");
    }
  };

  return (
    <Card className="w-full bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 py-0">
      <CardContent className="py-2">
        {/* Mobile Layout (xs to sm) */}
        <div className="block sm:hidden">
          {/* Header - Trainer Info */}
          <div className="flex items-center gap-3 mb-3">
            {/* Trainer Image */}
            <div className="w-10 h-10 rounded-full overflow-hidden bg-blue-500 flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
              {trainerImage ? (
                <Image
                  src={trainerImage}
                  alt={trainerName}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{getInitials(trainerName)}</span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-sm truncate">
                {trainerName}
              </h3>
              <span
                className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getSportsColor(
                  sports
                )}`}
              >
                {sports}
              </span>
            </div>

            {/* Status and Rating */}
            <div className="flex flex-col items-end gap-1">
              <span className="text-xs text-green-600 font-medium">
                Completed
              </span>
            </div>
          </div>

          {/* Session Details */}
          <div className="space-y-2 mb-3">
            <div className="flex items-center gap-4 text-xs text-gray-600 flex-wrap">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{sessionDate}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{sessionTime}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <Laptop className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{sessionType}</span>
            </div>
          </div>

          {/* Action Button */}
          <Button
            onClick={handleVideoCall}
            variant="outline"
            size="sm"
            className="w-full text-xs px-3 py-2 h-8 border-orange-300 text-orange-600 hover:bg-orange-50"
          >
            Join Session
          </Button>
        </div>

        {/* Tablet and Desktop Layout (sm and above) */}
        <div className="hidden sm:flex items-center justify-between gap-4">
          {/* Left Section - Trainer Info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Trainer Image */}
            <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full overflow-hidden bg-blue-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
              {trainerImage ? (
                <Image
                  src={trainerImage}
                  alt={trainerName}
                  width={56}
                  height={56}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="lg:text-base">{getInitials(trainerName)}</span>
              )}
            </div>

            {/* Trainer Details */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-sm md:text-base lg:text-lg truncate">
                {trainerName}
              </h3>

              {/* Sports Tag */}
              <span
                className={`inline-block px-2 py-1 rounded-full text-xs md:text-sm font-medium mt-1 ${getSportsColor(
                  sports
                )}`}
              >
                {sports}
              </span>

              {/* Session Details */}
              <div className="flex flex-wrap items-center gap-3 lg:gap-4 mt-2 text-xs md:text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                  <span className="truncate">{sessionDate}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                  <span className="truncate">{sessionTime}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Laptop className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                  <span className="truncate">{sessionType}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Status & Actions */}
          <div className="flex items-center gap-4 flex-shrink-0">
            {/* Status and Rating */}
            <div className="flex items-center gap-2">
              <span className="text-xs md:text-sm text-green-600 font-medium whitespace-nowrap">
                Completed
              </span>
            </div>

            {/* Action Button */}
            <Button
              onClick={handleVideoCall}
              variant="outline"
              size="sm"
              className="text-xs md:text-sm px-3 py-1 h-7 md:h-8 lg:px-4 lg:py-2 lg:h-9 border-orange-300 text-orange-600 hover:bg-orange-50 whitespace-nowrap"
            >
              Join Session
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingCard;
