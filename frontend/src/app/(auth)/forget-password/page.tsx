"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRequestForgotPasswordCodeMutation } from "@/store/Slices/apiSlices/apiSlice";
import { z } from "zod";
import { useStateSlice } from "@/store/hooks/sliceHook";
import { useDispatch } from "react-redux";
import { setUserQuery } from "@/store/Slices/stateSlices/stateSlice";
import { setCookie } from "@/hooks/cookie";

// Email validation schema
const emailSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
});

interface ForgotPasswordFormData {
  email: string;
}




export default function ForgotPasswordPage() {
  const [requestCode, { isLoading }] = useRequestForgotPasswordCodeMutation();
  const router = useRouter();
  const dispatch = useDispatch()
  const {userQuery} = useStateSlice()

  console.log("userQuery is:",userQuery)
  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      console.log("Requesting code for:", data.email);
      
      const result = await requestCode({ email: data.email }).unwrap();
      
      console.log("Code request successful:", result);
      
      if(result.success){
        dispatch(setUserQuery("forget"))
        setCookie("passResetToken", result.passResetToken, 7)
        router.push("/forget-password/verify-code");
      }
      // Redirect to verification code page
    } catch (error) {
      console.error("Code request error:", error);
      alert("Failed to send verification code. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-8">
      {/* Logo */}
      <div className="text-center mb-8">
        <Image src={"/image/logo.png"} alt="logo image" width={80} height={80} className="md:max-w-[80px] md:max-h-[80px]"/>
      </div>

      {/* Form */}
      <div className="max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Forgot Password</h1>
          <p className="text-gray-600">Enter your email to receive a verification code</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      className="py-3 h-[50px]"
                      placeholder="Enter your email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full rounded-full h-[54px]"
              disabled={isLoading}
            >
              {isLoading ? "SENDING..." : "SEND VERIFICATION CODE"}
            </Button>
          </form>
        </Form>

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