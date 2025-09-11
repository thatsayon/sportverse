"use client"
import React from 'react'
import { Button } from '../ui/button';
import BookingConfirmationCard from '../Element/BookingConfirmationCard';
import { useRouter } from 'next/navigation';

function BookingConfirmation() {
    const [isOpen, setIsOpen] = React.useState(true);
    const router = useRouter()

  const handleGoToDashboard = () => {
    setIsOpen(false);
    router.push("/student/")
  };

  const handleViewBookings = () => {
        router.push("/student/bookings")

    setIsOpen(false);
  };
  return (
    <div className="p-8">
      <Button onClick={() => setIsOpen(true)} className="mb-4">
        Show Booking Confirmation
      </Button>
      
      <BookingConfirmationCard
        isOpen={isOpen}
        onGoToDashboard={handleGoToDashboard}
        onViewBookings={handleViewBookings}
        trainerName="Your Trainer"
        sessionDate="TBD"
        sessionTime=""
        totalPaid="$0"
        paymentId="SPV - F9DMZ1GCD"
      />
    </div>
  )
}

export default BookingConfirmation
