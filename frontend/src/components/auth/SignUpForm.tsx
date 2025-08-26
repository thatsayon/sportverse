"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSignUpMutation } from "@/store/Slices/apiSlice";

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
import { AppleIcon, GoogleIcon } from "@/SVG/AuthSCG";
import { useDispatch } from "react-redux";
import { setEmail, setUser, setUserQuery } from "@/store/Slices/stateSlice";
import { toast } from "sonner";
import { useStateSlice } from "@/store/hooks/sliceHook";

export function SignUpForm() {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signUp, { isLoading }] = useSignUpMutation();

  const [selected, setSelected] = useState<"Student" | "Teacher" | null>(null);

  const handleChange = (value: "Student" | "Teacher" | null) => {
    setSelected(value); // Set the selected value to the clicked option
  };


  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
      confirm_password: "",
      agree_terms: false,
    },
  });

  console.log("hello error", form.formState.errors);

  const router = useRouter();

  const onSubmit = async (data: SignUpFormData) => {
    console.log("Sign up data:", data);
    try {
      // Transform form data to match API requirements
      const formatedData = {
        full_name: data.full_name,
        password: data.password,
        email: data.email,
      };

      const result = await signUp(formatedData).unwrap();

      console.log("signup response:", result);

      // Check if the response indicates success (either by success field or message)
      if (result.success || result.message?.includes("successful")) {
        console.log("Signup successful:", result);
        dispatch(setEmail(result?.user?.email ?? ""));
        dispatch(setUserQuery("signup"));
        // After successful signup, redirect to pricing page
        router.push("/forget-password/verify-code");
      } else {
        console.error("Signup failed:", result.message);
        toast.success(result.message || "Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      if (error instanceof Error) {
        toast.error(`Some error occurs: ${error.message}`);
      } else {
        toast.error("Some unknown error occurred");
      }
    }
  };

  return (
    <Card className="w-full max-w-lg border-none shadow-none">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center mb-0 md:mb-1 lg:mb-2">
          <Image
            src={"/image/logo.png"}
            alt="logo-image"
            width={63}
            height={63}
            className="max-w-20 md:max-w-[63px] max-h-20 md:max-h-[63px] object-center rounded-md"
            layout="responsive"
          />
        </div>
        <CardTitle className="text-lg md:text-2xl font-semibold text-[#232323]">
          <h2 className="text-3xl font-medium">Create your account</h2>
          <div className="flex items-center justify-center gap-4 mt-4">
            {/* ShadCN Toggle component */}
            <div
              value={selected}
              onChange={handleChange}
              className="flex items-center border-2 p-1 rounded-md text-lg font-semibold"
            >
              {/* Student Option */}
              <div
                className={`py-2 px-3 rounded-md cursor-pointer ${
                  selected === "Student"
                    ? "bg-[#118AB2] text-white"
                    : "bg-white text-[#808080]"
                }`}
                onClick={() => handleChange("Student")}
              >
                Student
              </div>

              {/* Teacher Option */}
              <div
                className={`py-2 px-3 rounded-md cursor-pointer ${
                  selected === "Teacher"
                    ? "bg-[#118AB2] text-white"
                    : "bg-white text-[#808080]"
                }`}
                onClick={() => handleChange("Teacher")}
              >
                Teacher
              </div>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
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

            <FormField
              control={form.control}
              name="agree_terms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div>
                    <FormLabel className="text-xs leading-[140%] text-gray-600">
                      By creating an account, I accept the Terms & Conditions &
                      Privacy Policy.
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

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

        <div className="mt-6 text-center">
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
        <div className="flex items-center gap-4 mt-6">
          <div className="w-full h-[2px] bg-[#C4C3C3]" />
          or
          <div className="w-full h-[2px] bg-[#C4C3C3]" />
        </div>
        <div className="flex items-center justify-center gap-6">
          <Button variant={"ghost"} className="bg-[#F3F4F6] font-medium">
            <GoogleIcon size={22} />
            Continue with Google
          </Button>
          <Button variant={"ghost"} className="bg-[#F3F4F6] font-medium">
            <AppleIcon size={24} />
            Continue with Apple
          </Button>
        </div>

        {/* <SocialLogin title="Or Login With" /> */}
      </CardContent>
    </Card>
  );
}
