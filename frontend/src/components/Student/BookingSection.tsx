"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Star, MapPin, Clock } from "lucide-react";
import Link from "next/link";
import { useGetSessionDetailsQuery } from "@/store/Slices/apiSlices/studentApiSlice";

interface Timeslot {
  id: string;
  start_time: string; // HH:mm:ss
  end_time: string;   // HH:mm:ss
  day: string;
}

interface BookingSectionProps {
  id: string;
}

const BookingSection: React.FC<BookingSectionProps> = ({ id }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<Timeslot | null>(null);

  const { data: trainer, isLoading, isError } = useGetSessionDetailsQuery(id);

  console.log('trainer details:', trainer)

  // Get current month and year
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Days of the week
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Create calendar days array
  const calendarDays = useMemo(() => {
    const days = [];
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    return days;
  }, [firstDayOfMonth, daysInMonth]);

  // Get available days for trainer (convert to day names)
  const availableDayNames = trainer?.available_days.map((day) =>
    day.day.toLowerCase()
  );

  // Check if a date is available
  const isDateAvailable = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    const dayName = date
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase();
    return availableDayNames?.includes(dayName);
  };

  // Get available time slots for selected date
  const getAvailableTimeSlots = () => {
    if (!selectedDate || !trainer) return [];

    const dayName = selectedDate
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase();
    const availableDay = trainer.available_days.find(
      (day) => day.day.toLowerCase() === dayName
    );

    return availableDay ? availableDay.timeslots : [];
  };

  // Format time for display
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Navigate months
  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
    setSelectedDate(null);
    setSelectedTimeSlot(null);
  };

  // Handle date selection
  const handleDateSelect = (day: number) => {
    if (!isDateAvailable(day)) return;

    const date = new Date(currentYear, currentMonth, day);
    setSelectedDate(date);
    setSelectedTimeSlot(null);
  };

  // Get coach types as string
  const getCoachTypes = () => {
    if (!trainer?.teacher_info?.coach_type) return trainer?.coach_type || "";
    if (Array.isArray(trainer.teacher_info.coach_type)) {
      return trainer.teacher_info.coach_type.join(", ");
    }
    return trainer.teacher_info.coach_type;
  };

  // Get institute name
  const getInstituteName = () => {
    return trainer?.teacher_info?.institute_name || trainer?.institute_name || "Training Center";
  };

  // Format training type for display
  const getTrainingTypeDisplay = (type: string) => {
    switch (type.toLowerCase()) {
      case "virtual":
        return "Virtual";
      case "in_person":
      case "in-person":
        return "In-Person";
      default:
        return type;
    }
  };

  if (isLoading) {
    return (
      <div className="w-full p-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (isError || !trainer) {
    return (
      <div className="w-full p-4 text-center">
        <p className="text-red-500">Failed to load trainer information</p>
      </div>
    );
  }

  return (
    <div className="w-full p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Trainer Info + Calendar */}
        <div className="lg:col-span-2 space-y-6">
          {/* Trainer Profile */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-xl font-bold">
                  {trainer.full_name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {trainer.full_name}
                  </h2>
                  <div className="flex items-center gap-1 my-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-1">
                      5.0 (128 reviews)
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {getCoachTypes()}
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                      {trainer.training_type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-3">
                    Certified personal trainer specializing in strength training
                    and fitness. Passionate about helping clients achieve their
                    fitness goals.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Calendar */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold">
                Selection Date
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="grid grid-cols-1 md:grid-cols-3 items-start gap-8">
                <div className="col-span-2">
                  {/* Calendar Header */}
                  <div className="flex items-center justify-between mb-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigateMonth("prev")}
                      className="h-8 w-8"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <h3 className="font-semibold text-lg">
                      {monthNames[currentMonth]} {currentYear}
                    </h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigateMonth("next")}
                      className="h-8 w-8"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Days of Week Header */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {daysOfWeek.map((day) => (
                      <div
                        key={day}
                        className="text-center text-sm font-medium text-gray-500 p-2"
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1 mb-6">
                    {calendarDays.map((day, index) => (
                      <Button
                        key={index}
                        variant={
                          selectedDate?.getDate() === day ? "default" : "ghost"
                        }
                        size="sm"
                        disabled={!day || !isDateAvailable(day)}
                        onClick={() => day && handleDateSelect(day)}
                        className={`h-12 w-full text-sm ${
                          !day
                            ? "invisible"
                            : isDateAvailable(day)
                            ? "hover:bg-orange-50"
                            : "text-gray-300 cursor-not-allowed"
                        } ${
                          selectedDate?.getDate() === day
                            ? "bg-orange-500 text-white hover:bg-orange-600"
                            : ""
                        }`}
                      >
                        {day}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Available Times */}
                {selectedDate && (
                  <div>
                    <h4 className="font-medium mb-3 text-lg">
                      Available Times
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {getAvailableTimeSlots().map((slot) => (
                        <Button
                          key={slot.id}
                          variant={
                            selectedTimeSlot?.id === slot.id
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() => setSelectedTimeSlot(slot)}
                          className={`text-sm h-10 text-[#F15A24] ${
                            selectedTimeSlot?.id === slot.id
                              ? "bg-orange-500 hover:bg-orange-600 text-white border-orange-500"
                              : "hover:bg-orange-50 hover:text-orange-600 hover:border-orange-300"
                          }`}
                        >
                          {formatTime(slot.start_time)}
                        </Button>
                      ))}
                    </div>
                    {getAvailableTimeSlots().length === 0 && (
                      <p className="text-sm text-gray-500 text-center py-4">
                        No time slots available for this date
                      </p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Session Summary */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold">
                Session Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-4">
              {/* Trainer Info */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold">
                  {trainer.full_name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="font-medium text-sm">{trainer.full_name}</p>
                  <p className="text-sm text-gray-600">{getCoachTypes()}</p>
                </div>
              </div>

              {/* Date & Time */}
              {selectedDate && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">
                      {selectedDate.toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  {selectedTimeSlot && (
                    <div className="text-sm ml-6">
                      <span className="font-medium">
                        {formatTime(selectedTimeSlot.start_time)} -{" "}
                        {formatTime(selectedTimeSlot.end_time)}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Location */}
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                <div>
                  <p className="font-medium">{getInstituteName()}</p>
                  <p className="text-gray-600">
                    {trainer.training_type.toLowerCase() === "virtual" && "Online Session"}
                  </p>
                </div>
              </div>

              {/* Pricing */}
              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Session Price</span>
                  <span className="font-medium">${trainer.price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span className="font-medium">$0.00</span>
                </div>
                <div className="flex justify-between font-semibold text-base border-t pt-3">
                  <span>Total</span>
                  <span>${trainer.price}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4">
                <Button
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white h-12 text-base font-medium"
                  disabled={!selectedDate || !selectedTimeSlot}
                >
                  Confirm & Pay
                </Button>
                <Link href={"/student/virtual-training"}>
                  <Button variant="outline" className="w-full h-10 text-sm">
                    Cancel
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookingSection;