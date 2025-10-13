"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "../ui/dialog";
import { useJwt } from "@/hooks/useJwt";
import { Button } from "../ui/button";
import { DialogTitle } from "@radix-ui/react-dialog";
import { AlertCircle, Clock, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface WarningAlertProps {
  open: boolean;
  isOpen: (open: boolean) => void;
}

const WarningAlert: React.FC<WarningAlertProps> = ({ isOpen, open }) => {
  const { decoded } = useJwt(); // This will now automatically update when token changes
  const router = useRouter();

  // Get theme based on verification status
  const getTheme = () => {
    switch (decoded?.verification_status) {
      case "reject":
        return {
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          iconBg: "bg-red-100",
          iconColor: "text-red-600",
          titleColor: "text-red-700",
          textColor: "text-red-600",
          buttonBg: "bg-red-500 hover:bg-red-600",
          icon: <XCircle className="w-8 h-8" />,
        };
      case "in_progress":
        return {
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
          iconBg: "bg-yellow-100",
          iconColor: "text-yellow-600",
          titleColor: "text-yellow-700",
          textColor: "text-yellow-600",
          buttonBg: "bg-yellow-500 hover:bg-yellow-600",
          icon: <Clock className="w-8 h-8" />,
        };
      case "not_submitted":
      default:
        return {
          bgColor: "bg-orange-50",
          borderColor: "border-orange-200",
          iconBg: "bg-orange-100",
          iconColor: "text-orange-600",
          titleColor: "text-orange-700",
          textColor: "text-orange-600",
          buttonBg: "bg-orange-500 hover:bg-orange-600",
          icon: <AlertCircle className="w-8 h-8" />,
        };
    }
  };

  const theme = getTheme();

  const handleRouting = () => {
    router.push(
      decoded?.verification_status === "not_submitted"
        ? "/trainer/doc-submission"
        : decoded?.verification_status === "reject"
        ? "/trainer/doc-submission"
        : decoded?.verification_status === "in_progress"
        ? "/trainer"
        : "/"
    );
    isOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(value) => isOpen(value)}>
      <DialogContent
        className={`${theme.bgColor} border-2 ${theme.borderColor} max-w-lg`}
      >
        <DialogHeader>
          <div className="flex items-center gap-4 mb-4">
            <div
              className={`${theme.iconBg} ${theme.iconColor} p-3 rounded-full`}
            >
              {theme.icon}
            </div>
            <DialogTitle className={`text-2xl font-bold ${theme.titleColor}`}>
              Account Verification Required
            </DialogTitle>
          </div>
        </DialogHeader>

        <div
          className={`${theme.bgColor} rounded-lg p-4 border ${theme.borderColor}`}
        >
          {decoded?.verification_status === "in_progress" && (
            <div className="space-y-3">
              <p className={`${theme.textColor} font-medium`}>
                Your verification request is currently{" "}
                <strong className="font-bold">under review</strong>.
              </p>
              <p className={`${theme.textColor}`}>
                You&apos;ll be notified once it&apos;s approved. During this
                time, access to the{" "}
                <strong className="font-semibold">Dashboard</strong> and{" "}
                <strong className="font-semibold">Profile</strong> remains
                restricted.
              </p>
            </div>
          )}

          {decoded?.verification_status === "not_submitted" && (
            <div className="space-y-3">
              <p className={`${theme.textColor} font-medium`}>
                You have not submitted your verification documents yet.
              </p>
              <p className={`${theme.textColor}`}>
                Please complete the verification process to access your{" "}
                <strong className="font-semibold">Dashboard</strong> and{" "}
                <strong className="font-semibold">Profile</strong> features.
              </p>
            </div>
          )}

          {decoded?.verification_status === "reject" && (
            <div className="space-y-3">
              <p className={`${theme.textColor} font-medium`}>
                Your verification request was{" "}
                <strong className="font-bold">rejected</strong> after review.
              </p>
              <p className={`${theme.textColor}`}>
                Please re-upload valid documents and ensure all details are
                clearly visible.
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="mt-4">
          <Button
            onClick={handleRouting}
            className={`${theme.buttonBg} text-white font-semibold px-6 py-2 rounded-lg transition-colors`}
          >
            {decoded?.verification_status === "not_submitted" &&
              "Upload Documents"}
            {decoded?.verification_status === "reject" && "Resubmit Documents"}
            {decoded?.verification_status === "in_progress" && "Go to Home"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WarningAlert;