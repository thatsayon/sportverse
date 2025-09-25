"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Upload,
  Video,
  ChevronDown,
  Image as ImageIcon,
  X,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Image from "next/image";
import { useGetAllSportsQuery } from "@/store/Slices/apiSlices/apiSlice";
import Loading from "@/components/Element/Loading";
import ErrorLoadingPage from "@/components/Element/ErrorLoadingPage";
import { getCookie } from "@/hooks/cookie";
import { useRouter } from "next/navigation";
import { useGetAdminVideosQuery } from "@/store/Slices/apiSlices/adminApiSlice";

const BASE_URL = "https://stingray-intimate-sincerely.ngrok-free.app";

// Form validation schema
const formSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .min(3, "Title must be at least 3 characters"),

  sport: z.string().min(1, "Please select a sport"),

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

  thumbnail: z
    .instanceof(File, { message: "Thumbnail image is required" })
    .refine(
      (file) => file.size <= 5 * 1024 * 1024, // 5MB limit
      "Thumbnail must be less than 5MB"
    )
    .refine(
      (file) => ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
      "Only JPG and PNG images are supported"
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
  const [selectedThumbnail, setSelectedThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [thumbnailDragActive, setThumbnailDragActive] = useState(false);
  const [sportDropdownOpen, setSportDropdownOpen] = useState(false);
  const [selectedSportId, setSelectedSportId] = useState<string>("");
  const [consumerDropdownOpen, setConsumerDropdownOpen] = useState(false);
  const { data, isLoading, isError } = useGetAllSportsQuery();
  const { refetch } = useGetAdminVideosQuery();
  const router = useRouter();
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

  // Get signature from backend using fetch with multipart/form-data
  const getSignatureFromAPI = async (
    title: string,
    description: string,
    thumbnail: File,
    sport: string,
    consumer: string
  ) => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("thumbnail", thumbnail);
    // Fixed: Added sport and consumer to FormData
    formData.append("sport", sport);
    formData.append("consumer", consumer.toLocaleLowerCase());

    try {
      const token = getCookie("access_token");
      const response = await fetch(`${BASE_URL}/control/generate-token/`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to get signature: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error getting signature:", error);
      throw error;
    }
  };

  // Mock Cloudinary upload function
  const uploadToCloudinary = async (file: File, signatureData: any) => {
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
      const signatureResponse = await getSignatureFromAPI(
        data.title,
        data.description,
        data.thumbnail,
        selectedSportId, // Send the sport ID
        data.consumer
      );

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
      toast.success("Video has been uploaded successfully.");
      refetch();
      router.push("/dashboard/media");
      // Call the onSubmit callback
      if (onSubmit) {
        onSubmit(finalData);
      }

      // Reset form
      handleReset();
    } catch (error) {
      console.error("Upload failed:", error);

      // Show error toast
      toast.error("Failed to upload video. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    reset();
    setSelectedFile(null);
    setSelectedThumbnail(null);
    setThumbnailPreview(null);
    setUploadProgress(0);
    setSelectedSportId("");
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

  // Thumbnail handling functions
  const handleThumbnailDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setThumbnailDragActive(true);
    } else if (e.type === "dragleave") {
      setThumbnailDragActive(false);
    }
  };

  const handleThumbnailDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setThumbnailDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      handleThumbnailFile(file);
    }
  };

  const handleThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      handleThumbnailFile(file);
    }
  };

  const handleThumbnailFile = (file: File) => {
    setSelectedThumbnail(file);
    setValue("thumbnail", file, { shouldValidate: true });

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setThumbnailPreview(previewUrl);
  };

  const removeThumbnail = () => {
    setSelectedThumbnail(null);
    setThumbnailPreview(null);
    setValue("thumbnail", undefined as any);
  };

  if (isLoading) return <Loading />;
  if (isError) return <ErrorLoadingPage />;

  const sportsOptions = data?.results || [];

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

        {/* Thumbnail Upload Area */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Thumbnail *
          </label>
          <div
            className={`relative border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
              thumbnailDragActive
                ? "border-orange-500 bg-orange-50"
                : selectedThumbnail
                ? "border-green-500 bg-green-50"
                : "border-gray-300 bg-gray-50 hover:border-orange-400"
            }`}
            onDragEnter={handleThumbnailDrag}
            onDragLeave={handleThumbnailDrag}
            onDragOver={handleThumbnailDrag}
            onDrop={handleThumbnailDrop}
          >
            <input
              type="file"
              accept="image/jpeg,image/png,image/jpg"
              onChange={handleThumbnailSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isUploading}
            />

            {thumbnailPreview ? (
              <div className="relative">
                <div className="relative w-24 h-16 mx-auto rounded overflow-hidden">
                  <Image
                    src={thumbnailPreview}
                    alt="Thumbnail preview"
                    fill
                    className="object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeThumbnail();
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                  disabled={isUploading}
                >
                  <X className="w-3 h-3" />
                </button>
                <p className="text-xs text-gray-500 mt-2">
                  {selectedThumbnail?.name}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <ImageIcon className="mx-auto h-6 w-6 text-gray-400" />
                <p className="text-sm font-medium">Upload thumbnail</p>
                <p className="text-xs text-gray-500">JPG or PNG (Max 5MB)</p>
              </div>
            )}
          </div>

          {errors.thumbnail && (
            <p className="text-sm text-red-600">{errors.thumbnail.message}</p>
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
          options={sportsOptions?.map((sport) => sport.name)}
          placeholder="Sports"
          onSelect={(value) => {
            const selectedSport = sportsOptions.find(
              (sport) => sport.name === value
            );
            if (selectedSport) {
              setSelectedSportId(selectedSport.id);
              setValue("sport", value, {
                shouldValidate: true,
              });
            }
          }}
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
              onClick={handleReset}
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
