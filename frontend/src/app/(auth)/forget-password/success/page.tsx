"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { useStateSlice } from "@/store/hooks/sliceHook";
import { useDispatch } from "react-redux";
import { setUserQuery } from "@/store/Slices/stateSlices/stateSlice";
import { useJwt } from "@/hooks/useJwt";
import Logo from "@/components/Element/Logo";

export default function ForgotPasswordSuccessPage() {
  const { decoded } = useJwt();
  const router = useRouter();
  const { userQuery } = useStateSlice();
  const dispatch = useDispatch();
  const handleSignIn = () => {
    if (userQuery === "signup") {
      if (decoded?.role === "admin") {
        router.push("/dashboard");
        dispatch(setUserQuery(""));
      } else {
        if (decoded?.role === "student") {
          router.push("/sports-selection");
          dispatch(setUserQuery(""));
        } else {
          router.push("/trainer/doc-submission");
          dispatch(setUserQuery(""));
        }
      }
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-8">
      {/* Logo */}
      <div className="text-center mb-8">
        <Logo href="/" />
      </div>

      {/* Content */}
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <p className="text-gray-600 mb-6">
            {userQuery === "signup"
              ? "You email have been verified."
              : " Your password has been updated, please change your password regularly."}
          </p>

          <h1 className="text-2xl font-bold text-gray-800 mb-8">
            Congratulations
          </h1>

          <Button onClick={handleSignIn} className="w-full py-4">
            {userQuery === "signup"
              ? `${
                  decoded?.role === "student"
                    ? "Select Sport"
                    : "Submit Documentation"
                }`
              : "Login"}
          </Button>
        </div>
      </div>
    </div>
  );
}
