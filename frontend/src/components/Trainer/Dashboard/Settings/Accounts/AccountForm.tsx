"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pencil, Upload, X } from "lucide-react";

// Zod validation schema
const accountSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  surname: z.string().min(2, "Surname must be at least 2 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  zipCode: z.string().min(3, "Zip code must be at least 3 characters"),
  institutionName: z
    .string()
    .min(2, "Institution name must be at least 2 characters"),
  description: z.string().optional(),
});

type AccountFormData = z.infer<typeof accountSchema>;

const AccountForm = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState("/api/placeholder/120/120");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: "Bradley",
      surname: "Lawlor",
      city: "",
      zipCode: "",
      institutionName: "",
      description: "",
    },
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset();
    setUploadedFile(null);
  };

  const handleSave = (data: AccountFormData) => {
    console.log("Form data:", data);
    console.log("Uploaded file:", uploadedFile);
    setIsEditing(false);
    // Handle form submission here
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
  };

  return (
    <div>
        <h1 className="text-2xl font-semibold text-center mb-4">Account Details</h1>
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
                          BL
                        </AvatarFallback>
                      </Avatar>
                      {isEditing && (
                        <div className="absolute -bottom-2 -right-2">
                          <label
                            htmlFor="image-upload"
                            className="cursor-pointer"
                          >
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
                        Bradley Lawlor
                      </h2>
                    </div>

                    {/* File Upload Section - Fixed Height */}
                    <div className="w-full">
                      <div className="space-y-4">
                        <Label>Upload Video</Label>
                        <div 
                          className={`border-2 border-dashed rounded-lg transition-all duration-200 ${
                            isEditing 
                              ? "border-gray-300 bg-white" 
                              : "border-gray-200 bg-gray-50"
                          }`}
                          style={{ minHeight: '140px' }}
                        >
                          {uploadedFile && isEditing ? (
                            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md m-3">
                              <div className="flex items-center gap-3">
                                <div className="bg-blue-100 p-2 rounded">
                                  <Upload className="w-4 h-4 text-blue-600" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    {uploadedFile.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                                  </p>
                                </div>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={removeFile}
                                className="text-gray-400 hover:text-red-500"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center p-6 h-full">
                              {isEditing ? (
                                <div className="text-center">
                                  <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                                  <div className="mb-2">
                                    <label htmlFor="file-upload" className="cursor-pointer">
                                      <span className="text-blue-600 hover:text-blue-500 font-medium">
                                        Click to upload
                                      </span>
                                      <span className="text-gray-500"> or drag and drop</span>
                                    </label>
                                  </div>
                                  <p className="text-xs text-gray-500">
                                    MP4, WebM or MOV (MAX. 100MB)
                                  </p>
                                  <input
                                    id="file-upload"
                                    type="file"
                                    accept="video/*"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                  />
                                </div>
                              ) : (
                                <div className="text-center">
                                  <Upload className="mx-auto h-8 w-8 text-gray-300 mb-2" />
                                  <p className="text-sm text-gray-400">No video uploaded</p>
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
                        <Label htmlFor="name">Name</Label>
                        <div className="relative">
                          <Input
                            id="name"
                            {...register("name")}
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
                          {errors.name && (
                            <p className="text-sm text-red-500">
                              {errors.name.message}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Surname */}
                      <div className="space-y-2">
                        <Label htmlFor="surname">Surname</Label>
                        <div className="relative">
                          <Input
                            id="surname"
                            {...register("surname")}
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
                          {errors.surname && (
                            <p className="text-sm text-red-500">
                              {errors.surname.message}
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

                    {/* Institution Name - Full Width */}
                    <div className="space-y-2">
                      <Label htmlFor="institutionName">Institution name</Label>
                      <div className="relative">
                        <Input
                          id="institutionName"
                          placeholder="Select coach type"
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