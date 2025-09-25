"use client"
import React from 'react';
import { Check, Clock, User, DollarSign, FileText, LayoutDashboard, Calendar } from 'lucide-react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DialogTitle } from '@radix-ui/react-dialog';

interface BookingConfirmationProps {
  isOpen: boolean;
  onGoToDashboard: () => void;
  onViewBookings: () => void;
  trainerName?: string;
  sessionDate?: string;
  sessionTime?: string;
  totalPaid?: string;
  paymentId?: string;
}

const BookingConfirmationCard: React.FC<BookingConfirmationProps> = ({
  isOpen,
  onGoToDashboard,
  onViewBookings,
  trainerName = "Your Trainer",
  sessionDate = "TBD",
  sessionTime = "",
  totalPaid = "$0",
  paymentId = "SPV - F9DMZ1GCD"
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={() => {}} modal>
      <DialogContent 
        className="sm:max-w-md w-[95%] max-w-[400px] rounded-2xl border-0 shadow-2xl p-0 gap-0"
        showCloseButton
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogTitle></DialogTitle>
        {/* Success Icon */}
        <div className="flex justify-center pt-8 pb-4">
          <div className="relative">
            <div className="w-16 h-16 bg-[#DCFCE7] rounded-full flex items-center justify-center">
              <div className="w-12 h-12 bg-[#22C55E] rounded-full flex items-center justify-center">
                <Check className="w-6 h-6 text-white" strokeWidth={3} />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-6 pb-6">
          {/* Title */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Booking Confirmed!
            </h2>
            <p className="text-gray-600 text-base">
              Your session with{' '}
              <span className="text-[#F15A24] font-semibold">{trainerName}</span>{' '}
              is booked
            </p>
          </div>

          {/* Session Details */}
          <div className="bg-[#FFF8F5] rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-5 h-5 bg-[#FFF1EC] rounded-full flex items-center justify-center">
                <FileText className="w-3 h-3 text-[#F15A24]" />
              </div>
              <h3 className="font-semibold text-gray-900">Session Details</h3>
            </div>

            <div className="space-y-4">
              {/* Date and Trainer Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Date */}
                <div className="bg-white rounded-lg p-3 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#FFF1EC] rounded-full flex items-center justify-center">
                      <Clock className="w-4 h-4 text-[#F15A24]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-600 font-medium">Date</p>
                      <p className="text-gray-900 font-semibold">{sessionDate}</p>
                    </div>
                  </div>
                </div>

                {/* Trainer */}
                <div className="bg-white rounded-lg p-3 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#FFF1EC] rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-[#F15A24]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-600 font-medium">Trainer</p>
                      <p className="text-gray-900 font-semibold truncate">{trainerName}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Time and Total Paid Row */}
              {sessionTime && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Time */}
                  <div className="bg-white rounded-lg p-3 border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#FFF1EC] rounded-full flex items-center justify-center">
                        <Clock className="w-4 h-4 text-[#F15A24]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-gray-600 font-medium">Time</p>
                        <p className="text-gray-900 font-semibold">{sessionTime}</p>
                      </div>
                    </div>
                  </div>

                  {/* Total Paid */}
                  <div className="bg-white rounded-lg p-3 border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#FFF1EC] rounded-full flex items-center justify-center">
                        <DollarSign className="w-4 h-4 text-[#F15A24]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-gray-600 font-medium">Total Paid</p>
                        <p className="text-gray-900 font-semibold">{totalPaid}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment ID */}
              <div className="bg-white rounded-lg p-3 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#FFF1EC] rounded-full flex items-center justify-center">
                    <FileText className="w-4 h-4 text-[#F15A24]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-600 font-medium">Payment ID</p>
                    <p className="text-gray-900 font-semibold font-mono text-sm">{paymentId}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <Button 
              onClick={onGoToDashboard}
              className="bg-[#F15A24] hover:bg-[#F15A24]/90 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              Go to Dashboard
            </Button>
            
            <Button 
              onClick={onViewBookings}
              variant="outline"
              className="border-[#F15A24] text-[#F15A24] hover:bg-[#F15A24] hover:text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Calendar className="w-4 h-4" />
              View Bookings
            </Button>
          </div>

          {/* Help Text */}
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Need help or want to make change?
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingConfirmationCard;