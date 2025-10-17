"use client"
import { useJwt } from "@/hooks/useJwt";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";

function PaymentSuccessButton() {
  const { decoded } = useJwt();
  return (
    <div>
      {decoded?.role === "student" ? (
        <Link href="/student/video-library" className="w-full">
          <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium h-12">
            Access Video Library
          </Button>
        </Link>
      ) : (
        <Link href="/dashboard/session-management" className="w-full">
          <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium h-12">
            Access Session Management
          </Button>
        </Link>
      )}
    </div>
  );
}

export default PaymentSuccessButton;
