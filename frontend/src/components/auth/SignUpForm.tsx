"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import {
  useLazyGoogleSignupQuery,
  useSignUpMutation,
} from "@/store/Slices/apiSlices/apiSlice";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { signUpSchema, type SignUpFormData } from "@/schema/auth.schema";
import Link from "next/link";
import Image from "next/image";
import { GoogleIcon } from "@/SVG/AuthSCG";
import { useDispatch } from "react-redux";
import { setEmail, setUserQuery } from "@/store/Slices/stateSlices/stateSlice";
import { toast } from "sonner";
import { setCookie } from "@/hooks/cookie";
import Logo from "../Element/Logo";

export function SignUpForm() {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signUp, { isLoading }] = useSignUpMutation();
  const [googleSignup, { isLoading: googleLoading }] =
    useLazyGoogleSignupQuery();

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
      confirm_password: "",
      agree_terms: false,
      role: undefined,
    },
  });

  const selectedRole = form.watch("role");

  const handleRoleChange = (value: "student" | "teacher") => {
    form.setValue("role", value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const router = useRouter();

  const onSubmit = async (data: SignUpFormData) => {
    try {
      const formattedData = {
        full_name: data.full_name,
        email: data.email,
        password: data.password,
        role: data.role,
      };

      const result = await signUp(formattedData).unwrap();

      if (result.success) {
        setCookie("verificationToken", result.verificationToken, 7);
        dispatch(setEmail(result?.user?.email ?? ""));
        dispatch(setUserQuery("signup"));
        router.push("/forget-password/verify-code");
      } else {
        toast.error(result.message || "Signup failed");
      }
    } catch (error) {
      if (error instanceof Error) toast.error(`Error: ${error.message}`);
      else toast.error("Unknown error occurred");
    }
  };

  const handleSocialSignup = async () => {
    const response = await googleSignup().unwrap();
    console.log("response:", response);
    if (response.auth_url) {
      redirect(response.auth_url);
    }
  };

  return (
    <Card className="w-full max-w-lg scroll-auto border-none shadow-none">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center mb-0 md:mb-1 lg:mb-2">
          <Logo href="/" />
        </div>
        <CardTitle className="text-lg md:text-2xl font-semibold text-[#232323]">
          <h2 className="text-lg md:text-2xl lg:text-3xl font-medium">
            Create your account
          </h2>
        </CardTitle>
      </CardHeader>
      <CardContent className="-mt-3 md:mt-0 lg:-mt-3 xl:mt-0">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-2 xl:space-y-6"
          >
            {/* Role Selection Field */}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-center mb-2">
                    Select Role
                  </FormLabel>
                  <FormControl>
                    <div className="flex items-center justify-center">
                      <div className="flex items-center border-2 md:p-1 rounded-md text-lg font-semibold">
                        <div className="flex items-center p-1 rounded-md">
                          <div
                            className={`py-2 px-3 rounded-md cursor-pointer transition-colors ${
                              selectedRole === "student"
                                ? "bg-[#118AB2] text-white"
                                : "bg-white text-[#808080] hover:bg-gray-100"
                            }`}
                            onClick={() => handleRoleChange("student")}
                          >
                            Student
                          </div>
                          <div
                            className={`py-2 px-3 rounded-md cursor-pointer transition-colors ${
                              selectedRole === "teacher"
                                ? "bg-[#118AB2] text-white"
                                : "bg-white text-[#808080] hover:bg-gray-100"
                            }`}
                            onClick={() => handleRoleChange("teacher")}
                          >
                            Teacher
                          </div>
                        </div>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage className="text-center mt-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      className="py-3 h-[50px]"
                      placeholder="Enter your full name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      className="py-3 h-[50px]"
                      placeholder="Asadujoman@gmail.com"
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
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
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

            <FormField
              control={form.control}
              name="confirm_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        {...field}
                        className="pr-10 py-3 h-[50px]"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                      >
                        {showConfirmPassword ? (
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

            <div className="cursor-pointer">
              <FormField
                control={form.control}
                name="agree_terms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl className="cursor-pointer">
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div>
                      <FormLabel className="text-xs leading-[140%] text-gray-600 cursor-pointer flex flex-wrap gap-1">
                        By creating an account, I accept the <Link href={"/terms"} className="text-blue-400 hover:underline inline text-xs">Terms & Conditions</Link>
                        & <Link href={"/privacy"} className="text-blue-400 hover:underline inline text-xs">Privacy Policy</Link>.
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={form.formState.isSubmitting || isLoading}
            >
              {form.formState.isSubmitting || isLoading
                ? "SIGNING UP..."
                : "SIGN UP"}
            </Button>
          </form>
        </Form>

        <div className="mt-3 md:mt-4 lg:mt-3 xl:mt-6 text-center">
          <p className="text-sm text-[#232323]">
            Already Have An Account?{" "}
            <Link
              href="/login"
              className="text-purple-600 hover:underline font-medium"
            >
              Login
            </Link>
          </p>
        </div>
        <div className="flex items-center gap-4 md:mt-6 lg:mt-0 xl:mt-6">
          <div className="w-full h-[2px] bg-[#C4C3C3]" />
          or
          <div className="w-full h-[2px] bg-[#C4C3C3]" />
        </div>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
          <Button
            disabled={googleLoading}
            onClick={handleSocialSignup}
            variant={"ghost"}
            className="bg-[#F3F4F6] font-medium"
          >
            <GoogleIcon size={22} />
            {googleLoading ? <Loader /> : "Continue with Google"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
