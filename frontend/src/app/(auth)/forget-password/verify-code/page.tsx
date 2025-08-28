"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useResendPasswordCodeMutation,
  useResendRegistrationCodeMutation,
  useVerifyEmailCodeMutation,
  useVerifyForgotPasswordCodeMutation,
} from "@/store/Slices/apiSlices/apiSlice";
import { useStateSlice } from "@/store/hooks/sliceHook";
import { getCookie, removeCookie, setCookie } from "@/hooks/cookie";
import { toast } from "sonner";

export default function VerifyCodePage() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [email, setEmail] = useState("");
  const { userQuery, user } = useStateSlice();
  const [verifyCode, { isLoading }] = useVerifyEmailCodeMutation();
  const [verifyForgetCode, { isLoading: forgetLoading }] =
    useVerifyForgotPasswordCodeMutation();
  const router = useRouter();
  const [resendPasswordCode] = useResendPasswordCodeMutation();
  const [resendregistrationCode] = useResendRegistrationCodeMutation();

  console.log("userQuery is:", userQuery);

  useEffect(() => {
    if (timeLeft === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    if (userQuery === "signup" || userQuery === "forget") {
      return;
    } else {
      router.push("/login");
      return;
    }
  }, []);

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      // Move to previous input on backspace if current is empty
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async () => {
    const fullCode = code.join("");
    if (fullCode.length !== 6) {
      alert("Please enter the complete 6-digit code");
      return;
    }
    const verificationToken = getCookie("verificationToken");
    const passResetToken = getCookie("passResetToken");

    console.log("verificationToken:", verificationToken);
    try {
      console.log("Verifying code:", fullCode);

      if (userQuery === "signup") {
        const result = await verifyCode({
          otp: fullCode,
          verificationToken: verificationToken,
        }).unwrap();
        if (result.access_token) {
          // Store code in sessionStorage for next step
          // sessionStorage.setItem("verificationCode", fullCode);
          // setCookie("passResetToken", result.passResetToken, 7)
          removeCookie("verificationToken");
          // Redirect to success page
          router.push("/forget-password/success");
        }
      }
      if (userQuery === "forget") {
        const result = await verifyForgetCode({
          otp: fullCode,
          passResetToken: passResetToken,
        }).unwrap();
        if (result.passwordResetVerified) {
          // Store code in sessionStorage for next step
          // sessionStorage.setItem("verificationCode", fullCode);
          // setCookie("passResetToken", result.passResetToken, 7)
          removeCookie("passResetToken");
          setCookie("passwordResetVerified", result.passwordResetVerified, 7);

          // Redirect to success page
          router.push("/forget-password/reset-password");
        }
      }
    } catch (error) {
      console.error("Code verification error:", error);
      alert("Invalid verification code. Please try again.");
    }
  };

  const handleResend = async () => {
    const verificationToken = getCookie("verificationToken");
    const passResetToken = getCookie("passResetToken");
    if (userQuery === "signup") {
      const response = await resendregistrationCode({
        verificationToken: verificationToken,
      });
      if(response.data){
        toast.success("OTP has been resended to your eamil")
        setTimeLeft(60)
      }
    }
    if (userQuery === "forget") {
      const response = await resendPasswordCode({
        passResetToken: passResetToken,
      });
      if(response.data){
        toast.success("OTP has been resended to your eamil")
        setTimeLeft(60)
      }
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-8">
      {/* Logo */}
      <div className="text-center mb-8">
        <Image
          src={"/image/logo.png"}
          alt="logo image"
          width={80}
          height={80}
          className="md:max-w-[80px] md:max-h-[80px]"
        />
      </div>

      {/* Content */}
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Verify Identity
          </h2>
          <p className="text-gray-600">
            Please input the verification code send to <br /> your email{" "}
            {user.email}
          </p>
        </div>

        <div className="mb-8">
          {/* Code Input Fields */}
          <div className="flex justify-center space-x-2 mb-6">
            {code.map((digit, index) => (
              <Input
                key={index}
                id={`code-${index}`}
                type="text"
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-lg font-bold border-2 border-gray-300 focus:border-blue-500"
                maxLength={1}
                inputMode="numeric"
              />
            ))}
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full py-4"
            disabled={isLoading || code.join("").length !== 6}
          >
            {isLoading ? "VERIFYING..." : "VERIFY"}
          </Button>
          {/* Resend Link */}
          <Button
            onClick={handleResend}
            disabled={timeLeft > 0}
            className="w-full mt-4 py-4"
            variant={"outline"}
          >
            {timeLeft > 0 ? `Resend code in ${timeLeft}s` : "Resend Code"}
          </Button>
        </div>

        {/* Back to Login */}
        <div className="text-center mt-6">
          <Link
            href="/login"
            className="text-sm text-gray-600 hover:text-gray-800 underline"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
