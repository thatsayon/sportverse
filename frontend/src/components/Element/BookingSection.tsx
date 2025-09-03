"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, Calendar, Clock, MapPin } from 'lucide-react';
import Image from 'next/image';
import { BookingPageData } from '@/data/BookingPageData';
import BookingCard from './BookingCard';

// Status type
type SessionStatus = "past" | "upcoming" | "ongoing";



const BookingSessions = () => {

    const bookings = BookingPageData
  const [selectedFilter, setSelectedFilter] = useState<SessionStatus | 'all'>('all');

  // Function to determine session status based on current date and time
  const getSessionStatus = (sessionDate: string, sessionTime: string): SessionStatus => {
    const currentDate = new Date();
    const currentTime = currentDate.getTime();

    // Parse session date (assuming format like "December 21, 2024")
    const sessionDateObj = new Date(sessionDate);
    
    // Parse session time (assuming format like "3:00 PM - 4:00 PM")
    const [startTime, endTime] = sessionTime.split(' - ');
    
    // Create full datetime objects for session start and end
    const sessionStartTime = new Date(sessionDate + ' ' + startTime);
    const sessionEndTime = new Date(sessionDate + ' ' + endTime);

    // Compare with current time
    if (currentTime < sessionStartTime.getTime()) {
      return 'upcoming';
    } else if (currentTime >= sessionStartTime.getTime() && currentTime <= sessionEndTime.getTime()) {
      return 'ongoing';
    } else {
      return 'past';
    }
  };

  // Add status to each booking and filter
  const bookingsWithStatus = useMemo(() => {
    return bookings.map(booking => ({
      ...booking,
      status: getSessionStatus(booking.sessionDate, booking.sessionTime)
    }));
  }, [bookings]);

  // Filter bookings based on selected filter
  const filteredBookings = useMemo(() => {
    if (selectedFilter === 'all') {
      return bookingsWithStatus;
    }
    return bookingsWithStatus.filter(booking => booking.status === selectedFilter);
  }, [bookingsWithStatus, selectedFilter]);

  // Count bookings by status
  const statusCounts = useMemo(() => {
    return bookingsWithStatus.reduce((acc, booking) => {
      acc[booking.status] = (acc[booking.status] || 0) + 1;
      return acc;
    }, {} as Record<SessionStatus, number>);
  }, [bookingsWithStatus]);

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Filter Section */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">My Sessions</h2>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Filter by:</span>
            <Select value={selectedFilter} onValueChange={(value) => setSelectedFilter(value as SessionStatus | 'all')}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Sessions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  All Sessions ({bookingsWithStatus.length})
                </SelectItem>
                <SelectItem value="upcoming">
                  Upcoming ({statusCounts.upcoming || 0})
                </SelectItem>
                <SelectItem value="ongoing">
                  Ongoing ({statusCounts.ongoing || 0})
                </SelectItem>
                <SelectItem value="past">
                  Past ({statusCounts.past || 0})
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              {...booking}
            />
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {selectedFilter === 'all' 
                ? 'No sessions found' 
                : `No ${selectedFilter} sessions found`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingSessions;