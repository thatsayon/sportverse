"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Upload, Video, ChevronDown } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  getSignatureReponse,
  useGetSignatureMutation,
} from "@/store/Slices/apiSlices/apiSlice";
import { toast } from "sonner";

// Form validation schema

const formSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .min(3, "Title must be at least 3 characters"),

  sport: z.enum(["Basketball", "Football"]).refine((val) => val, {
    message: "Please select a sport",
  }),

  consumer: z.enum(["Student", "Trainers"]).refine((val) => val, {
    message: "Please select a consumer type",
  }),

  description: z
    .string()
    .min(1, "Description is required")
    .min(10, "Description must be at least 10 characters"),

  video: z
    .instanceof(File, { message: "Video file is required" })
    .refine(
      (file) => file.size <= 100 * 1024 * 1024, // 100MB limit
      "Video file must be less than 100MB"
    )
    .refine(
      (file) =>
        ["video/mp4", "video/webm", "video/quicktime"].includes(file.type),
      "Only MP4, WebM, and MOV video files are supported"
    ),
});

type FormData = z.infer<typeof formSchema>;

interface VideoUploadFormProps {
  onSubmit?: (data: FormData & { videoUrl: string }) => void;
}

export default function VideoUploadForm({ onSubmit }: VideoUploadFormProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [sportDropdownOpen, setSportDropdownOpen] = useState(false);
  const [consumerDropdownOpen, setConsumerDropdownOpen] = useState(false);
  const [getSignature, { isLoading }] = useGetSignatureMutation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const watchedValues = watch();

  // Mock Cloudinary upload function
  const uploadToCloudinary = async (
    file: File,
    signatureData: getSignatureReponse
  ) => {
    const formData = new FormData();

    // Add required Cloudinary parameters
    formData.append("file", file);
    formData.append("api_key", signatureData.api_key);
    formData.append("timestamp", signatureData.timestamp.toString());
    formData.append("signature", signatureData.signature);
    formData.append("folder", signatureData.folder);
    formData.append("public_id", signatureData.video_id);

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
      console.error("Cloudinary upload error:", error);
      throw error;
    }
  };

  const handleFormSubmit = async (data: FormData) => {
    console.log("Submitted data:", data);

    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Get signature from backend
      const signatureResponse = await getSignature({
        title: data.title,
        description: data.description,
      }).unwrap();

      if (!signatureResponse) {
        throw new Error("Failed to get upload signature");
      }

      console.log("Getting the signature response:", signatureResponse);

      // Simulate progress for UI (since we can't track real progress with fetch)
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
        data.video,
        signatureResponse
      );

      // Clear progress interval and set to 100%
      clearInterval(progressInterval);
      setUploadProgress(100);

      console.log("Cloudinary upload response:", cloudinaryResponse);

      // Prepare final data with video URL
      const finalData = {
        ...data,
        videoUrl: cloudinaryResponse.secure_url || cloudinaryResponse.url,
      };

      // Show success toast
      reset();
      toast.success("Video has been uploaded successfully.");

      // Call the onSubmit callback
      if (onSubmit) {
        onSubmit(finalData);
      }

      // Reset form
      reset();
      setSelectedFile(null);
      setUploadProgress(0);
    } catch (error) {
      console.error("Upload failed:", error);

      // Show error toast
      toast.error("Failed to upload video. Please try again.");
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

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      setSelectedFile(file);
      setValue("video", file, { shouldValidate: true });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      setSelectedFile(file);
      setValue("video", file, { shouldValidate: true });
    }
  };

  const CustomDropdown = ({
    value,
    options,
    placeholder,
    onSelect,
    isOpen,
    setIsOpen,
    error,
  }: {
    value: string;
    options: string[];
    placeholder: string;
    onSelect: (value: string) => void;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    error?: string;
  }) => (
    <div className="relative">
      <div
        className={`w-full px-3 py-2 border rounded-md cursor-pointer flex items-center justify-between ${
          error ? "border-red-500" : "border-gray-300"
        } hover:border-orange-400 focus:border-orange-500`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={value ? "text-gray-900" : "text-gray-500"}>
          {value || placeholder}
        </span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          {options.map((option) => (
            <div
              key={option}
              className="px-3 py-2 hover:bg-orange-50 cursor-pointer text-gray-900"
              onClick={() => {
                onSelect(option);
                setIsOpen(false);
              }}
            >
              {option}
            </div>
          ))}
        </div>
      )}
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-center mb-6">Upload a video</h2>

      <div className="space-y-4">
        {/* Video Upload Area */}
        <div className="space-y-2">
          <div
            className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragActive
                ? "border-orange-500 bg-orange-50"
                : selectedFile
                ? "border-green-500 bg-green-50"
                : "border-gray-300 bg-gray-50 hover:border-orange-400"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept="video/mp4,video/webm,video/quicktime"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isUploading}
            />

            <div className="space-y-2">
              {selectedFile ? (
                <>
                  <Video className="mx-auto h-8 w-8 text-green-500" />
                  <p className="text-sm font-medium text-green-700">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB
                  </p>
                </>
              ) : (
                <>
                  <Upload className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="text-sm font-medium">upload video</p>
                  <p className="text-xs text-gray-500">
                    Drag & drop video file to upload
                  </p>
                </>
              )}
            </div>

            {!selectedFile && (
              <div className="mt-3 px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition-colors inline-block">
                Browse file
              </div>
            )}
          </div>

          {errors.video && (
            <p className="text-sm text-red-600">{errors.video.message}</p>
          )}

          {isUploading && (
            <div className="space-y-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-center text-gray-600">
                Uploading... {Math.round(uploadProgress)}%
              </p>
            </div>
          )}
        </div>

        {/* Title Input */}
        <div className="space-y-1">
          <input
            {...register("title")}
            type="text"
            placeholder="Title"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            disabled={isUploading}
          />
          {errors.title && (
            <p className="text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* Sports Dropdown */}
        <CustomDropdown
          value={watchedValues.sport || ""}
          options={["Basketball", "Football"]}
          placeholder="Sports"
          onSelect={(value) =>
            setValue("sport", value as "Basketball" | "Football", {
              shouldValidate: true,
            })
          }
          isOpen={sportDropdownOpen}
          setIsOpen={setSportDropdownOpen}
          error={errors.sport?.message}
        />

        {/* Consumer Dropdown */}
        <CustomDropdown
          value={watchedValues.consumer || ""}
          options={["Student", "Trainers"]}
          placeholder="Consumer"
          onSelect={(value) =>
            setValue("consumer", value as "Student" | "Trainers", {
              shouldValidate: true,
            })
          }
          isOpen={consumerDropdownOpen}
          setIsOpen={setConsumerDropdownOpen}
          error={errors.consumer?.message}
        />

        {/* Description Textarea */}
        <div className="space-y-1">
          <textarea
            {...register("description")}
            placeholder="Add a short description"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
            disabled={isUploading}
          />
          {errors.description && (
            <p className="text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        {/* Character Count */}
        <div className="text-right">
          <span className="text-xs text-gray-500">
            {watchedValues.description?.length || 0} Characters max
          </span>
        </div>

        {/* Submit and Cancel Buttons */}
        <div className="flex gap-3 items-center justify-center mt-5">
          <div className="w-full">
            <Button
              className="w-full"
              type="button"
              onClick={handleSubmit(handleFormSubmit)}
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Submit"}
            </Button>
          </div>

          <Link href={"/dashboard/media"} className="w-full">
            <Button
              className="w-full text-[#F15A24] hover:text-[#F15A24]"
              variant={"outline"}
              type="button"
              onClick={() => {
                reset();
                setSelectedFile(null);
                setUploadProgress(0);
              }}
              disabled={isUploading}
            >
              Cancel
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
