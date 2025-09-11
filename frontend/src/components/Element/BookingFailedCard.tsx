"use client";
import React from "react";
import {
  X,
  AlertTriangle,
  FileText,
  Clock,
  User,
  DollarSign,
  RotateCcw,
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface BookingErrorProps {
  isOpen: boolean;
  onTryAgain: () => void;
  trainerName?: string;
  sessionDate?: string;
  sessionTime?: string;
  totalAmount?: string;
  errorMessage?: string;
  errorCode?: string;
}

const BookingFaildCard: React.FC<BookingErrorProps> = ({
  isOpen,
  onTryAgain,
  trainerName = "Your Trainer",
  sessionDate = "TBD",
  sessionTime = "",
  totalAmount = "$0",
  errorMessage = "Something went wrong while processing your booking",
  errorCode = "ERR - B001XYZ9",
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={() => {}} modal>
      <DialogContent
        className="sm:max-w-md w-[95%] max-w-[400px] rounded-2xl border-0 shadow-2xl p-0 gap-0"
        showCloseButton={false}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        {/* Error Icon */}
        <div className="flex justify-center pt-8 pb-4">
          <div className="relative">
            <div className="w-16 h-16 bg-[#FEE2E2] rounded-full flex items-center justify-center">
              <div className="w-12 h-12 bg-[#EF4444] rounded-full flex items-center justify-center">
                <X className="w-6 h-6 text-white" strokeWidth={3} />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-6 pb-6">
          {/* Title */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Booking Failed!
            </h2>
            <p className="text-gray-600 text-base">{errorMessage}</p>
          </div>
          {/* Action Button */}
          <div className="mb-4">
            <Link href={"/student/bookings"}>
            <Button
              onClick={onTryAgain}
              className="w-full bg-[#EF4444] hover:bg-[#EF4444]/90 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Try Again
            </Button>
            </Link>
          </div>

          {/* Help Text */}
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Need help? Contact our support team
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingFaildCard;
