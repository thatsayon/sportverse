"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

import { Button } from "@/components/ui/button";

export default function ForgotPasswordSuccessPage() {
  const router = useRouter();

  const handleSignIn = () => {
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-8">
      {/* Logo */}
      <div className="text-center mb-8">
        <Image src={"/image/logo.png"} alt="logo image" width={80} height={80} className="md:max-w-[80px] md:max-h-[px]"/>
      </div>

      {/* Content */}
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <p className="text-gray-600 mb-6">
            Your password has been updated, please change your password regularly.
          </p>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-8">Congratulations</h1>
          
          <Button
            onClick={handleSignIn}
            className="w-full py-4"
          >
            SIGN IN
          </Button>
        </div>
      </div>
    </div>
  );
} 