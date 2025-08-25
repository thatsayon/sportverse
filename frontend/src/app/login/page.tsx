"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import Image from "next/image";
import { Suspense, useState } from "react";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
   const [role, setRole] = useState<string>("Teacher");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 md:px-4">
      <Card className="w-full max-w-lg md:px-3">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center md:mt-6 lg:mt-14 md:mb-4 lg:mb-10">
            <Image
              src={"/image/logo.png"}
              alt="logo-image"
              width={63}
              height={63}
              className="md:max-w-[63px] md:max-h-[63px] object-center rounded-md"
              layout="responsive"
            />
          </div>
          <CardTitle className="text-lg md:text-2xl font-semibold text-[#232323]">
            Create your account
          </CardTitle>

          {/* switch button of user type */}

          <div className="flex border border-[#E6E6E6] rounded-lg overflow-hidden w-fit mx-auto mt-4">
            <button
              onClick={() => setRole("Student")}
              className={`px-4 py-2 font-medium ${
                role === "Student"
                  ? "bg-sky-600 text-white"
                  : "text-gray-600 bg-white"
              }`}
            >
              Student
            </button>
            <button
              onClick={() => setRole("Teacher")}
              className={`px-4 py-2 font-medium ${
                role === "Teacher"
                  ? "bg-sky-600 text-white"
                  : "text-gray-600 bg-white"
              }`}
            >
              Teacher
            </button>
          </div>


        </CardHeader>
        <CardContent>
          <Suspense>
            <LoginForm />
          </Suspense>

          <div className="mt-6 text-center">
            <p className="text-sm text-[#232323]">
              Don&apos;t Have An Account?{" "}
              <Link
                href="/signup"
                className="text-purple-600 hover:underline font-medium"
              >
                Sign Up
              </Link>
            </p>
          </div>

          {/* <SocialLogin title="Or Login With" /> */}
        </CardContent>
      </Card>
    </div>
  );
}
