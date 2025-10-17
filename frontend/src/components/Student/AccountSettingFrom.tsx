"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pencil, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAdminSportsQuery } from "@/store/Slices/apiSlices/adminApiSlice";
import imageCompression from "browser-image-compression";
import { getCookie } from "@/hooks/cookie";
import { useGetStudentProfieQuery } from "@/store/Slices/apiSlices/studentApiSlice";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

// Maximum file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

// Zod validation schema
const accountSchema = z.object({
  full_name: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must not exceed 100 characters"),
  profile_pic: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, "Max file size is 5MB")
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpg and .png formats are supported"
    )
    .optional()
    .or(z.literal(null)),
  about: z
    .string()
    .max(500, "About must not exceed 500 characters")
    .optional()
    .or(z.literal("")),
  favorite_sports: z
    .array(z.string()).optional(),
  username: z.string(),
  email: z.string().email(),
});

type AccountFormData = z.infer<typeof accountSchema>;

interface SportCategory {
  id: string;
  name: string;
  image: string;
}

const AccountSettingForm = () => {
  const [isEditing] = useState(true);
  const [profileImage, setProfileImage] = useState("/api/placeholder/120/120");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { data } = useGetAdminSportsQuery();
  const { data: studentProfile, refetch } = useGetStudentProfieQuery()

  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors },
  } = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      full_name: "",
      username: "",
      email: "",
      favorite_sports: [],
      about: "",
      profile_pic: null,
    },
  });

  // Populate form with student profile data
  useEffect(() => {
    if (studentProfile) {
      setValue("full_name", studentProfile.full_name || "");
      setValue("username", studentProfile.username || "");
      setValue("email", studentProfile.email || "");
      setValue("about", studentProfile.about || "");

      // Set pre-selected sports based on favorite_sports from response
      const favoriteIds = studentProfile.favorite_sports?.map((sport) => sport.id) || [];
      setValue("favorite_sports", favoriteIds);

      // Set profile image
      if (studentProfile.profile_pic) {
        setProfileImage(studentProfile.profile_pic);
      }
    }
  }, [studentProfile, setValue]);

  const selectedSports = watch("favorite_sports") || [];

  const handleCancel = () => {
    router.push("/student/profile");
  };

  const handleSave = async (formData: AccountFormData) => {
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("full_name", formData.full_name);
      formDataToSend.append("about", formData.about || "");

      // Append sports as JSON array
      formData.favorite_sports.forEach((sportId) => {
        formDataToSend.append("favorite_sports", sportId);
      });

      // Compress and append profile picture if it exists
      if (formData.profile_pic && formData.profile_pic instanceof File) {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1024,
          useWebWorker: true,
        };

        const compressedImage = await imageCompression(
          formData.profile_pic,
          options
        );

        const compressedFile = new File(
          [compressedImage],
          formData.profile_pic.name,
          {
            type: formData.profile_pic.type,
            lastModified: Date.now(),
          }
        );

        formDataToSend.append("profile_pic", compressedFile);
      }

      // Get access token
      const accessToken = getCookie("access_token");

      // Send to backend
      const response = await fetch(`${BASE_URL}/student/profile-update/`, {
        method: "PATCH",
        body: formDataToSend,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      toast.success("Profile updated successfully!");
      refetch()
      router.push("/student/profile");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update profile"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        toast.error("Only JPG and PNG formats are supported");
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        toast.error("File size must be less than 5MB");
        return;
      }

      // Set file in form
      setValue("profile_pic", file, { shouldValidate: true });

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSportToggle = (sportId: string) => {
    const currentSports = selectedSports;
    const newSports = currentSports.includes(sportId)
      ? currentSports.filter((id) => id !== sportId)
      : [...currentSports, sportId];

    setValue("favorite_sports", newSports, { shouldValidate: true });
  };

  return (
    <div className="max-w-7xl mx-auto py-8">
      <h1 className="text-2xl font-semibold text-center mb-4">
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
                      {studentProfile?.full_name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase() || "SP"}
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
                        accept="image/jpeg,image/jpg,image/png"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>
                {errors.profile_pic && (
                  <p className="text-sm text-red-500 text-center">
                    {errors.profile_pic.message}
                  </p>
                )}
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

                  {/* Username (Read-only) */}
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      {...register("username")}
                      disabled
                      className="bg-gray-50 text-gray-700"
                    />
                  </div>

                  {/* Email (Read-only) */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      disabled
                      className="bg-gray-50 text-gray-700"
                    />
                  </div>

                  {/* Sports Multi-Select */}
                  <div className="space-y-2">
                    <Label htmlFor="sports">Interested Sports</Label>
                    <Controller
                      name="favorite_sports"
                      control={control}
                      render={({ field }) => (
                        <div className="relative">
                          <Select>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select sports">
                                {selectedSports.length > 0
                                  ? `${selectedSports.length} sport${
                                      selectedSports.length > 1 ? "s" : ""
                                    } selected`
                                  : "Select sports"}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <div className="max-h-60 overflow-y-auto">
                                {data?.results?.map((sport: SportCategory) => (
                                  <div
                                    key={sport.id}
                                    className="flex items-center px-2 py-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => handleSportToggle(sport.id)}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={selectedSports.includes(sport.id)}
                                      onChange={() => {}}
                                      className="mr-2 h-4 w-4 text-orange-500"
                                    />
                                    <span className="text-sm">{sport.name}</span>
                                  </div>
                                ))}
                              </div>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    />
                    {errors.favorite_sports && (
                      <p className="text-sm text-red-500">
                        {errors.favorite_sports.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Selected Sports Display */}
                {selectedSports.length > 0 && (
                  <div className="space-y-2">
                    <Label>Selected Sports</Label>
                    <div className="flex flex-wrap gap-2">
                      {selectedSports.map((sportId) => {
                        const sport = data?.results?.find(
                          (s: SportCategory) => s.id === sportId
                        );
                        return sport ? (
                          <div
                            key={sportId}
                            className="inline-flex items-center gap-1 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm"
                          >
                            {sport.name}
                            <button
                              type="button"
                              onClick={() => handleSportToggle(sportId)}
                              className="ml-1 hover:bg-orange-200 rounded-full p-0.5"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}

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
                  {errors.about && (
                    <p className="text-sm text-red-500">{errors.about.message}</p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white px-8"
                  >
                    {isSubmitting ? "Saving..." : "Save"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isSubmitting}
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