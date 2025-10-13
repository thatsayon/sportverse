"use client";
import Loading from "@/components/Element/Loading";
import LoginSuccess from "@/components/Element/LoginSuccessCard";
import { setCookie } from "@/hooks/cookie";
import { decodeToken } from "@/hooks/decodeToken";
import { useGoogleExchangeMutation } from "@/store/Slices/apiSlices/apiSlice";
import { useRouter } from "next/navigation";
import { initScriptLoader } from "next/script";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

function GoogleLogin() {
  const [googleExchange, {  isLoading}] = useGoogleExchangeMutation();
  const [isSuccess, setIsSuccess] = useState<boolean>(false)
  const router = useRouter();

  const loginFunction = async () => {
    setIsSuccess(false)
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const codeParam = urlParams.get("code");

      if (codeParam) {
        const response = await googleExchange({ code: codeParam }).unwrap();

        if (response.access_token) {
            setIsSuccess(true)
          setCookie("access_token", response.access_token, 7);
          const user = decodeToken(response.access_token);
          if (user?.role === "student") {
            toast.success("Login Successful");
            router.push("/student");
          } else if (user?.role === "teacher") {
            toast.success("Login Successful");
            router.push("/teacher");
          }
        }else{
            setIsSuccess(false)
            toast.error(response.error?.error)
        }
      } else {
        setIsSuccess(false)
        console.log("No code found in URL");
      }
    }
  };

  useEffect(() => {
    loginFunction();
  }, []);


  return (
    <>
      {isLoading ? (
        <div className="min-h-screen flex items-center justify-center">
            <Loading/>
        </div>
      ) : (
        <>
          <LoginSuccess isSuccess={isSuccess}/>
        </>
      )}
    </>
  );
}

export default GoogleLogin;
