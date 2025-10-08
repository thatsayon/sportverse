"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pencil, Upload, X, Video } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge"; // optional, if you have it

import {
  useGetTrainerProfileQuery,
  usePostTrainerVideoMutation,
  useUpdateTrainerProfileMutation,
} from "@/store/Slices/apiSlices/trainerApiSlice";
import { useGetSignatureMutation } from "@/store/Slices/apiSlices/apiSlice";
import { toast } from "sonner";

// Updated Zod schema - coach_type is now an array of strings (IDs)
const accountSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  username: z.string().min(2, "Surname must be at least 2 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  zipCode: z.string().min(3, "Zip code must be at least 3 characters"),
  institutionName: z
    .string()
    .min(2, "Institution name must be at least 2 characters"),
  coach_type: z.array(z.string()).default([]), // Now array of string IDs
  description: z.string().optional(),
});

type AccountFormData = z.infer<typeof accountSchema>;

interface SignatureResponse {
  api_key: string;
  cloud_name: string;
  folder: string;
  public_id: string;
  signature: string;
  timestamp: number;
  upload_id: string;
}

const AccountForm = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState("/api/placeholder/120/120");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string | null>(null);

  const [postVideo] = usePostTrainerVideoMutation();
  const [getSignature] = useGetSignatureMutation();
  const { data: trainerProfile } = useGetTrainerProfileQuery();
  const [updateTrainerProfile] = useUpdateTrainerProfileMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      full_name: "",
      username: "",
      city: "",
      zipCode: "",
      institutionName: "",
      coach_type: [], // Array of string IDs
      description: "",
    },
  });

  useEffect(() => {
    if (trainerProfile) {
      reset({
        full_name: trainerProfile.full_name || "",
        username: trainerProfile.username || "",
        city: trainerProfile.city || "",
        zipCode: trainerProfile.zip_code || "",
        institutionName: trainerProfile.institute_name || "",
        // Convert coach_type to array of string IDs
        coach_type: Array.isArray(trainerProfile.coach_type) 
          ? trainerProfile.coach_type.map(String) // Ensure all values are strings
          : [],
        description: trainerProfile.description || "",
      });
    }
  }, [trainerProfile, reset]);

  const selectedCoachTypes = Array.isArray(watch("coach_type"))
    ? (watch("coach_type") as string[])
    : [];

  const toggleCoach = (
    sportId: string,
    checked: boolean | "indeterminate"
  ) => {
    const current = new Set(selectedCoachTypes);
    if (checked) {
      current.add(sportId);
    } else {
      current.delete(sportId);
    }
    setValue("coach_type", Array.from(current), {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset();
    setUploadedFile(null);
    setUploadedVideoUrl(null);
    setUploadProgress(0);
  };

  const handleSave = async (data: AccountFormData) => {
    try {
      // Transform form data to match API
      const payload = {
        full_name: data.full_name,
        username: data.username,
        city: data.city,
        zip_code: data.zipCode,
        institute_name: data.institutionName,
        coach_type: data.coach_type, // Send array of string IDs
        description: data.description,
      };

      const response = await updateTrainerProfile(payload).unwrap();

      toast.success("Profile updated successfully.");
      reset({
        full_name: response.full_name,
        username: response.username,
        city: response.city,
        zipCode: response.zip_code,
        institutionName: response.institute_name,
        // Ensure coach_type is converted to string array
        coach_type: Array.isArray(response.coach_type) 
          ? response.coach_type.map(String)
          : [],
        description: response.description,
      });
      setIsEditing(false);
    } catch (error) {
      const err = error as Error;
      toast.error(err?.message || "Failed to update profile.");
    }
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

  // Cloudinary upload function
  const uploadToCloudinary = async (
    file: File,
    signatureData: SignatureResponse
  ) => {
    const formData = new FormData();

    // Add required Cloudinary parameters
    formData.append("file", file);
    formData.append("api_key", signatureData.api_key);
    formData.append("timestamp", signatureData.timestamp.toString());
    formData.append("signature", signatureData.signature);
    formData.append("folder", signatureData.folder);
    formData.append("public_id", signatureData.public_id);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${signatureData.cloud_name}/video/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      //console.error("Cloudinary upload error:", error);
      throw error;
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    // Validate file type
    const allowedTypes = ["video/mp4", "video/webm", "video/quicktime"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only MP4, WebM, and MOV video files are supported");
      return;
    }

    // Validate file size (100MB limit)
    if (file.size > 100 * 1024 * 1024) {
      toast.error("Video file must be less than 100MB");
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);
      setUploadedFile(file);

      // Get signature from backend
      const signatureResponse = await postVideo().unwrap();

      if (!signatureResponse) {
        throw new Error("Failed to get upload signature");
      }

      //console.log("Getting the signature response:", signatureResponse);

      // Simulate progress for UI
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 10;
        });
      }, 200);

      // Upload video to Cloudinary
      const cloudinaryResponse = await uploadToCloudinary(
        file,
        signatureResponse
      );

      // Clear progress interval and set to 100%
      clearInterval(progressInterval);
      setUploadProgress(100);

      //console.log("Cloudinary upload response:", cloudinaryResponse);

      // Store the uploaded video URL
      setUploadedVideoUrl(
        cloudinaryResponse.secure_url || cloudinaryResponse.url
      );

      // Show success toast
      toast.success("Video has been uploaded successfully.");
    } catch (error) {
      //console.error("Upload failed:", error);
      toast.error("Failed to upload video. Please try again.");
      setUploadedFile(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (!isEditing) return;

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      // Create a synthetic event to reuse the handleFileUpload logic
      const syntheticEvent = {
        target: { files: [file] },
      } as React.ChangeEvent<HTMLInputElement>;

      handleFileUpload(syntheticEvent);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setUploadedVideoUrl(null);
    setUploadProgress(0);
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-center mb-4">
        Account Details
      </h1>
      <Card className="border-none shadow-none">
        <CardContent className="p-6">
          <div className="space-y-8" onSubmit={handleSubmit(handleSave)}>
            {/* Profile Section */}
            <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-12">
              {/* Left Column - Profile Image and File Upload */}
              <div className="flex flex-col items-center gap-6 w-full lg:w-80 flex-shrink-0">
                {/* Profile Image */}
                <div className="relative">
                  <Avatar className="w-32 h-32">
                    <AvatarImage src={profileImage} alt="Profile" />
                    <AvatarFallback className="bg-orange-100 text-orange-600 text-lg font-semibold">
                      {trainerProfile?.full_name
                        ? trainerProfile.full_name.slice(0, 2).toUpperCase()
                        : "NA"}
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

                <div className="text-center">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {trainerProfile?.full_name || "No name"}
                  </h2>
                </div>

                {/* File Upload Section */}
                <div className="w-full">
                  <div className="space-y-4">
                    <Label>Upload Video</Label>
                    <div
                      className={`border-2 border-dashed rounded-lg transition-all duration-200 ${
                        dragActive && isEditing
                          ? "border-orange-500 bg-orange-50"
                          : uploadedFile
                          ? "border-green-500 bg-green-50"
                          : isEditing
                          ? "border-gray-300 bg-white hover:border-orange-400"
                          : "border-gray-200 bg-gray-50"
                      }`}
                      style={{ minHeight: "140px" }}
                      onDragEnter={isEditing ? handleDrag : undefined}
                      onDragLeave={isEditing ? handleDrag : undefined}
                      onDragOver={isEditing ? handleDrag : undefined}
                      onDrop={isEditing ? handleDrop : undefined}
                    >
                      {uploadedFile && isEditing ? (
                        <div className="p-3">
                          {/* Upload Progress */}
                          {isUploading && (
                            <div className="mb-3 space-y-2">
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${uploadProgress}%` }}
                                ></div>
                              </div>
                              <p className="text-xs text-center text-gray-600">
                                Uploading... {Math.round(uploadProgress)}%
                              </p>
                            </div>
                          )}

                          {/* File Info */}
                          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                            <div className="flex items-center gap-3">
                              <div
                                className={`p-2 rounded ${
                                  uploadedVideoUrl
                                    ? "bg-green-100"
                                    : "bg-blue-100"
                                }`}
                              >
                                {uploadedVideoUrl ? (
                                  <Video className="w-4 h-4 text-green-600" />
                                ) : (
                                  <Upload className="w-4 h-4 text-blue-600" />
                                )}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {uploadedFile.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {(uploadedFile.size / 1024 / 1024).toFixed(2)}{" "}
                                  MB
                                  {uploadedVideoUrl && (
                                    <span className="text-green-600 ml-2">
                                      ✓ Uploaded
                                    </span>
                                  )}
                                </p>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={removeFile}
                              className="text-gray-400 hover:text-red-500"
                              disabled={isUploading}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center p-6 h-full">
                          {isEditing ? (
                            <div className="text-center">
                              <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                              <div className="mb-2">
                                <label
                                  htmlFor="file-upload"
                                  className="cursor-pointer"
                                >
                                  <span className="text-blue-600 hover:text-blue-500 font-medium">
                                    Click to upload
                                  </span>
                                  <span className="text-gray-500">
                                    {" "}
                                    or drag and drop
                                  </span>
                                </label>
                              </div>
                              <p className="text-xs text-gray-500">
                                MP4, WebM or MOV (MAX. 100MB)
                              </p>
                              <input
                                id="file-upload"
                                type="file"
                                accept="video/mp4,video/webm,video/quicktime"
                                onChange={handleFileUpload}
                                className="hidden"
                                disabled={isUploading}
                              />
                            </div>
                          ) : (
                            <div className="text-center">
                              <Upload className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                              <p className="text-sm text-gray-400">
                                No video uploaded
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Form Fields */}
              <div className="flex-1 w-full space-y-6">
                {/* Form Fields Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <div className="relative">
                      <Input
                        id="full_name"
                        {...register("full_name")}
                        disabled={!isEditing}
                        className={`pr-10 transition-colors ${
                          !isEditing ? "bg-gray-50 text-gray-700" : ""
                        }`}
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4">
                        {isEditing && (
                          <Pencil className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </div>
                    <div className="h-5">
                      {errors.full_name && (
                        <p className="text-sm text-red-500">
                          {errors.full_name.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Surname */}
                  <div className="space-y-2">
                    <Label htmlFor="username">User Name</Label>
                    <div className="relative">
                      <Input
                        id="username"
                        {...register("username")}
                        disabled={!isEditing}
                        className={`pr-10 transition-colors ${
                          !isEditing ? "bg-gray-50 text-gray-700" : ""
                        }`}
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4">
                        {isEditing && (
                          <Pencil className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </div>
                    <div className="h-5">
                      {errors.username && (
                        <p className="text-sm text-red-500">
                          {errors.username.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* City */}
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <div className="relative">
                      <Input
                        id="city"
                        {...register("city")}
                        disabled={!isEditing}
                        className={`pr-10 transition-colors ${
                          !isEditing ? "bg-gray-50 text-gray-700" : ""
                        }`}
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4">
                        {isEditing && (
                          <Pencil className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </div>
                    <div className="h-5">
                      {errors.city && (
                        <p className="text-sm text-red-500">
                          {errors.city.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Zip Code */}
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">Zip code</Label>
                    <div className="relative">
                      <Input
                        id="zipCode"
                        {...register("zipCode")}
                        disabled={!isEditing}
                        className={`transition-colors ${
                          !isEditing ? "bg-gray-50 text-gray-700 pr-10" : ""
                        }`}
                      />
                      {isEditing && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <Pencil className="w-4 h-4 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="h-5">
                      {errors.zipCode && (
                        <p className="text-sm text-red-500">
                          {errors.zipCode.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  {/* Institution Name - Full Width */}
                  <div className="space-y-2">
                    <Label htmlFor="institutionName">Institution name</Label>
                    <div className="relative">
                      <Input
                        id="institutionName"
                        placeholder="Enter institution name"
                        {...register("institutionName")}
                        disabled={!isEditing}
                        className={`transition-colors ${
                          !isEditing ? "bg-gray-50 text-gray-700 pr-10" : ""
                        }`}
                      />
                      {isEditing && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <Pencil className="w-4 h-4 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="h-5">
                      {errors.institutionName && (
                        <p className="text-sm text-red-500">
                          {errors.institutionName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Coach Type (multi-select from API) */}
                  <div className="space-y-2">
                    <Label>Coach type</Label>

                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {trainerProfile?.available_sports?.map((sport) => (
                        <label
                          key={sport.id}
                          className="flex items-center gap-2"
                        >
                          <Checkbox
                            checked={selectedCoachTypes.includes(String(sport.id))}
                            onCheckedChange={(checked) => 
                              toggleCoach(String(sport.id), checked)
                            }
                            disabled={!isEditing}
                          />
                          <span className={!isEditing ? "text-gray-700" : ""}>
                            {sport.name}
                          </span>
                        </label>
                      ))}
                    </div>

                    {/* Optional: show selections as badges */}
                    {selectedCoachTypes.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {selectedCoachTypes.map((id) => {
                          const sport = trainerProfile?.available_sports?.find(
                            (s) => String(s.id) === id
                          );
                          return (
                            <Badge key={id} variant="secondary">
                              {sport?.name || id}
                            </Badge>
                          );
                        })}
                      </div>
                    )}

                    <div className="h-5">
                      {errors.coach_type && (
                        <p className="text-sm text-red-500">
                          {errors.coach_type.message as string}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <div className="relative">
                    <Textarea
                      id="description"
                      placeholder="Add a short bio..."
                      {...register("description")}
                      disabled={!isEditing}
                      className={`min-h-32 resize-none transition-colors ${
                        !isEditing ? "bg-gray-50 text-gray-700 pr-10" : ""
                      }`}
                    />
                    {isEditing && (
                      <div className="absolute right-3 top-3">
                        <Pencil className="w-4 h-4 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="h-5">
                    {errors.description && (
                      <p className="text-sm text-red-500">
                        {errors.description.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  {isEditing ? (
                    <>
                      <Button
                        type="submit"
                        onClick={handleSubmit(handleSave)}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-8"
                        disabled={isUploading}
                      >
                        {isUploading ? "Uploading..." : "Save"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        className="px-8"
                        disabled={isUploading}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      type="button"
                      onClick={handleEdit}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-8"
                    >
                      Edit
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountForm;