"use client"

import { useState } from "react";
import BookingFaildCard from "../Element/BookingFailedCard";
import { Button } from "../ui/button";

const BookingFailed: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const handleTryAgain = () => {
    console.log('Retry booking');
    setIsOpen(false);
  };

  return (
    <div className="p-8">
      <Button onClick={() => setIsOpen(true)} className="mb-4 bg-red-500 hover:bg-red-600">
        Show Booking Error
      </Button>
      
      <BookingFaildCard
        isOpen={isOpen}
        onTryAgain={handleTryAgain}
        trainerName="Your Trainer"
        sessionDate="TBD"
        sessionTime=""
        totalAmount="$0"
        errorMessage="Something went wrong while processing your booking"
        errorCode="ERR - B001XYZ9"
      />
    </div>
  );
};

export default BookingFailed;