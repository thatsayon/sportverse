"use client"
import React from 'react';
import { Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DialogTitle } from '@radix-ui/react-dialog';
import Link from 'next/link';

interface BookingConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
}

const BookingConfirmationCard: React.FC<BookingConfirmationProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-md w-[95%] max-w-[400px] rounded-2xl border-0 shadow-2xl p-0 gap-0"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogTitle></DialogTitle>
        
        {/* Success Icon */}
        <div className="flex justify-center pt-8 pb-6">
          <div className="relative">
            <div className="w-16 h-16 bg-[#DCFCE7] rounded-full flex items-center justify-center">
              <div className="w-12 h-12 bg-[#22C55E] rounded-full flex items-center justify-center">
                <Check className="w-6 h-6 text-white" strokeWidth={3} />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-6 pb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Booking Successful!
          </h2>
          <p className="text-gray-600 text-base mb-6">
            Your booking has been confirmed. You will receive a confirmation email shortly.
          </p>

          {/* Close Button */}
          <Link href={"/student"}>
          <Button 
            className="w-full bg-[#F15A24] hover:bg-[#F15A24]/90 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            Go To Home
          </Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingConfirmationCard;