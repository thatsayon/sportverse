"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ✅ Updated Zod validation schema
const accountSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters"),
  username: z.string().min(2, "Username must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  interestedSports: z.enum(["Football", "Basketball"]),
  about: z.string().optional(),
});

type AccountFormData = z.infer<typeof accountSchema>;

const AccountSettingForm = () => {
  const [isEditing, setIsEditing] = useState(true);
  const [profileImage, setProfileImage] = useState("/api/placeholder/120/120");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      full_name: "Bradley Lawlor",
      username: "bradley123",
      email: "bradley@example.com",
      interestedSports: undefined,
      about: "",
    },
  });

  const handleCancel = () => {
    router.push("/student/profile");
  };

  const handleSave = (data: AccountFormData) => {
    console.log("Form data:", data);
    toast.success("Profile updated");
    router.push("/student/profile");
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8">
      <h1 className="text-2xl font-semibold text-center mb-4 ">
        Account Details
      </h1>
      <Card className="border-none shadow-none">
        <CardContent className="p-6">
          <form className="space-y-8" onSubmit={handleSubmit(handleSave)}>
            {/* Profile Section */}
            <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12">
              {/* Left Column - Profile Image */}
              <div className="flex flex-col items-center gap-6 w-full lg:w-80 flex-shrink-0">
                <div className="relative">
                  <Avatar className="w-32 h-32">
                    <AvatarImage src={profileImage} alt="Profile" />
                    <AvatarFallback className="bg-orange-100 text-orange-600 text-lg font-semibold">
                      BL
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <div className="absolute -bottom-2 -right-2">
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <div className="bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transition-colors">
                          <Pencil className="w-3 h-3" />
                        </div>
                      </label>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Form Fields */}
              <div className="flex-1 w-full space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      {...register("full_name")}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50 text-gray-700" : ""}
                    />
                    {errors.full_name && (
                      <p className="text-sm text-red-500">
                        {errors.full_name.message}
                      </p>
                    )}
                  </div>

                  {/* Username */}
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      {...register("username")}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50 text-gray-700" : ""}
                    />
                    {errors.username && (
                      <p className="text-sm text-red-500">
                        {errors.username.message}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50 text-gray-700" : ""}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Interested Sports (Select) */}
                  <div className="space-y-2">
                    <Label htmlFor="interestedSports">Interested Sport</Label>
                    <Select
                      onValueChange={(val) =>
                        setValue("interestedSports", val as "Football" | "Basketball")
                      }
                      disabled={!isEditing}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select sport" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Football">Football</SelectItem>
                        <SelectItem value="Basketball">Basketball</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.interestedSports && (
                      <p className="text-sm text-red-500">
                        {errors.interestedSports.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* About */}
                <div className="space-y-2">
                  <Label htmlFor="about">About</Label>
                  <Textarea
                    id="about"
                    placeholder="Add a short bio..."
                    {...register("about")}
                    disabled={!isEditing}
                    className={`min-h-32 resize-none ${
                      !isEditing ? "bg-gray-50 text-gray-700" : ""
                    }`}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    type="submit"
                    className="bg-orange-500 hover:bg-orange-600 text-white px-8"
                  >
                    Save
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    className="px-8"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountSettingForm;
