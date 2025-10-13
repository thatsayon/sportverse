"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import Image from "next/image";
import { useLazyGoogleLoginQuery, useLoginMutation } from "@/store/Slices/apiSlices/apiSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  //   FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { loginSchema, type LoginFormData } from "@/schema/auth.schema";
import { toast } from "sonner";
import { GoogleIcon } from "@/SVG/AuthSCG";
import { redirect, useRouter } from "next/navigation";
import { setCookie } from "@/hooks/cookie";
import { decodeToken } from "@/hooks/decodeToken";
import Logo from "../Element/Logo";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [login, { isLoading }] = useLoginMutation();
  const [googleLogin, {isLoading: googleLoading}] = useLazyGoogleLoginQuery()
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();

  const onSubmit = async (data: LoginFormData) => {
    //console.log("Login data:", data);
    try {
      const result = await login(data).unwrap();

      if (result.access_token) {
        //console.log("Login successful:", result);

        // Store tokens in cookies
        setCookie("access_token", result.access_token, 7); // 7 days expiry
        // setCookie("refresh_token", result.refresh_token, 7); // 7 days expiry

        const user = decodeToken(result.access_token);
        //console.log("user information", user)
        if (user?.role === "admin") {
          router.push("/dashboard");
        } else {
          if (user?.role === "student") {
            router.push("/student");
          } else if (
            user?.verification_status === "not_submitted" ||
            (user?.verification_status === "reject" && user?.role === "teacher")
          ) {
            router.push("/trainer/doc-submission");
          } else {
            router.push("/trainer");
          }
        }

        // Store login data in sessionStorage for immediate access
        sessionStorage.setItem("isLoggedIn", "true");
        sessionStorage.setItem("userEmail", data.email);
        // toast.success("Login successful!");
      } else {
        toast.error(result?.error);
      }
    } catch (error) {
      const err = error as Error;

      //console.error("Login error:", error);
      toast.error(
        err?.message ||
          "Login failed. Please check your credentials and try again."
      );
    }
  };

const HandleGoogleLogin = async()=>{
  const response = await googleLogin().unwrap()

  if(response.auth_url){
    redirect(response.auth_url)
  }
}
  return (
    <Card className="w-full max-w-lg md:px-3 shadow-none border-none">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center md:mt-6 lg:mt-14 mb-2 md:mb-4 lg:mb-6">
          <Logo href="/" />
        </div>
        <CardTitle className="text-lg md:text-2xl font-semibold text-[#232323]">
          <h2 className="text-3xl font-medium">Welcome back server</h2>
          <p className="text-[#414141]/70 text-base mt-1">
            Sign in to continue to your account
          </p>
        </CardTitle>
        <Button disabled={googleLoading} onClick={HandleGoogleLogin} variant={"ghost"} className="bg-[#F3F4F6] font-medium">
         
          {googleLoading ? <Loader/>:<>
           <GoogleIcon size={22} />
          Continue with Google
          </>}
          
        </Button>
        <div className="flex items-center gap-4 mt-6">
          <div className="w-full h-[2px] bg-[#C4C3C3]" />
          or
          <div className="w-full h-[2px] bg-[#C4C3C3]" />
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 w-full"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="email">Email</FormLabel>
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

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        {...field}
                        className="pr-10 py-3 h-[50px]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-end">
              <Link
                href="/forget-password"
                className="text-sm text-red-600 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting || isLoading}
            >
              {form.formState.isSubmitting || isLoading
                ? "Signing in..."
                : "Sign in"}
            </Button>
          </form>
        </Form>

        <div className="mt-6 text-center">
          <p className="text-sm text-[#666666]">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-black hover:underline font-semibold underline"
            >
              Create account
            </Link>
          </p>
          <div className="mt-4 md:mt-6 space-x-4 lg:space-x-6 text-[#666666] text-sm">
            <Link href={"/privacy"} className="hover:underline">Privacy policy</Link>
            <Link href={"/terms"} className="hover:underline">Terms of service</Link>
            <Link href={"/help"} className="hover:underline">Help center</Link>
          </div>
        </div>

        {/* <SocialLogin title="Or Login With" /> */}
      </CardContent>
    </Card>
  );
}
