"use client"
import { useJwt } from "@/hooks/useJwt";
import React from "react";

function PaymentSuccessText() {
  const { decoded } = useJwt();
  return (
    <div>
      {decoded?.role === "student" ? (
        <p className="text-gray-600">
          You now have access to our exclusive video library with premium
          educational content.
        </p>
      ) : (
        <p className="text-gray-600">
          Now you can manage your session time and start your income.
        </p>
      )}
    </div>
  );
}

export default PaymentSuccessText;
