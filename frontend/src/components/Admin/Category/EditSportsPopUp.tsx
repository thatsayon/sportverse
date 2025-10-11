"use client";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import React, { useState, useEffect } from "react";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import imageCompression from "browser-image-compression";
import { toast } from "sonner";
import { getCookie } from "@/hooks/cookie";
import { useLazyGetAdminSportByIdQuery } from "@/store/Slices/apiSlices/adminApiSlice";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

// Define types for form data and errors
interface FormData {
  image: File | null;
  name: string;
}

interface Errors {
  image?: string;
  name?: string;
}

interface EditSportsPopUpProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  refetch: () => void;
  id: string;
}

function EditSportsPopUp({ open, setOpen, refetch, id }: EditSportsPopUpProps) {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    image: null,
    name: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [originalData, setOriginalData] = useState<{
    name: string;
    image: string;
  } | null>(null);

  const [getSports] = useLazyGetAdminSportByIdQuery();

  // Fetch sport data when dialog opens
  useEffect(() => {
    if (open && id) {
      fetchSportData();
    }
  }, [open, id]);

  const fetchSportData = async () => {
    try {
      setIsLoading(true);
      //console.log("Calling RTK API")
      const response = await getSports(id).unwrap();
      
      if (response) {
        setOriginalData({
          name: response.name,
          image: response.image,
        });
        setFormData({
          name: response.name,
          image: null, // We don't set the original file, just show preview
        });
        setImagePreview(response.image);
        setErrors({});
      }
    } catch (error) {
      //console.error("Failed to fetch sport data:", error);
      toast.error("Failed to load sport data");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input change for form fields
  const handleInputChange = (
    field: keyof FormData,
    value: string | File | null
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  // Handle file uploads and preview generation
  const handleImageChange = (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          image: "Only image files are allowed",
        }));
        return;
      }

      // Validate file size (before compression)
      if (file.size > 50 * 1024 * 1024) {
        // 50MB limit before compression
        setErrors((prev) => ({
          ...prev,
          image: "File size must be less than 50MB",
        }));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
      };
      reader.readAsDataURL(file);

      // Set file to form data
      handleInputChange("image", file);
    }
  };

  // Remove uploaded image
  const removeImage = () => {
    setImagePreview(originalData?.image || null);
    handleInputChange("image", null);
  };

  // Handle drag events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageChange(e.dataTransfer.files);
    }
  };

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleImageChange(e.target.files);
    }
  };

  // Validate the form inputs
  const validateForm = (): boolean => {
    const newErrors: Errors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Title is required";
    } else if (formData.name.length > 100) {
      newErrors.name = "Title must be less than 100 characters";
    }

    // For edit, image is not required if there's an existing one
    if (!formData.image && !originalData?.image) {
      newErrors.image = "Image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission with image compression
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare formData to send to the backend
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);

      // Only append image if a new one was selected
      if (formData.image) {
        // Compression options - target <= 1MB
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1024,
          useWebWorker: true,
        };

        // Compress image before uploading
        const compressedImage = await imageCompression(formData.image, options);

        //console.log("Original Image Size:", formData.image.size / 1024, "KB");
        //console.log("Compressed Image Size:", compressedImage.size / 1024, "KB");

        formDataToSend.append("image", compressedImage);
      }

      //console.log("Formatted data:", formDataToSend);

      // API call for update
      const accessToken = getCookie("access_token");
      const response = await fetch(`${BASE_URL}/control/update-sport/${id}/`, {
        method: "PATCH",
        body: formDataToSend,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        toast.success("Sports item updated successfully!");
        setOpen(false);
        refetch();
        resetForm();
      } else {
        throw new Error("Failed to update sport");
      }
    } catch (error) {
      //console.error("Update error:", error);
      toast.error("Update failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      image: null,
      name: "",
    });
    setImagePreview(null);
    setErrors({});
    setOriginalData(null);
  };

  // Handle cancel action
  const handleCancel = () => {
    resetForm();
    setOpen(false);
  };

  // Trigger file input click programmatically
  const triggerFileInput = () => {
    document.getElementById("edit-image-upload")?.click();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg max-h-[75%] overflow-scroll scrollbar-x-hidden scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <DialogTitle>Edit Sports</DialogTitle>
        <div className="max-w-md mx-auto bg-white rounded-lg p-4 sm:p-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
          ) : (
            <form onSubmit={onSubmit}>
              <div className="space-y-6">
                {/* File Upload Section */}
                <div className="space-y-2">
                  <div
                    className={`relative border-2 border-dashed rounded-lg p-6 sm:p-8 text-center transition-colors ${
                      dragActive
                        ? "border-orange-400 bg-orange-50"
                        : "border-gray-300 hover:border-gray-400"
                    } ${errors.image ? "border-red-300" : ""}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    {imagePreview ? (
                      <div className="relative">
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          width={300}
                          height={200}
                          className="max-w-full max-h-48 mx-auto rounded-lg object-cover"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <div className="mt-2">
                          <button
                            type="button"
                            onClick={triggerFileInput}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            Change Image
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-center mb-4">
                          <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center">
                            <Upload className="w-6 h-6 text-orange-500" />
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">upload image</p>
                        <p className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                          Drag & drop image file to upload
                        </p>
                        <p className="text-sm text-gray-500 mb-4">
                          JPG, PNG formats, up to 50MB
                        </p>
                        <button
                          type="button"
                          onClick={triggerFileInput}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Browse file
                        </button>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      onChange={handleFileInputChange}
                      className="hidden"
                      id="edit-image-upload"
                    />
                  </div>
                  {errors.image && (
                    <p className="text-sm text-red-600">{errors.image}</p>
                  )}
                </div>

                {/* Title Input */}
                <div className="space-y-2">
                  <label
                    htmlFor="edit-name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Title
                  </label>
                  <input
                    id="edit-name"
                    type="text"
                    placeholder="Enter sports name"
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                      errors.name ? "border-red-300" : "border-gray-200"
                    }`}
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 order-2 sm:order-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 order-1 sm:order-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Updating..." : "Update"}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default EditSportsPopUp;