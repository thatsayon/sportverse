"use client";
import React, { useState } from "react";
import { Camera, Cloud, X, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import Image from "next/image";
import imageCompression from "browser-image-compression";
import { toast } from "sonner";
import { getCookie, removeCookie, setCookie } from "@/hooks/cookie";
import { useRouter } from "next/navigation";
import { useJwt } from "@/hooks/useJwt";

// Define types for form data and errors
interface FormData {
  picture: File | null;
  id_front: File | null;
  id_back: File | null;
  city: string;
  zip_code: string;
}

interface Errors {
  picture?: string;
  id_front?: string;
  id_back?: string;
  city?: string;
  zip_code?: string;
}

interface ResponseAccess {
  access_token?: string;
  error?: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const DocUpload: React.FC = () => {
  const { decoded } = useJwt();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [frontSidePreview, setFrontSidePreview] = useState<string | null>(null);
  const [backSidePreview, setBackSidePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    picture: null,
    id_front: null,
    id_back: null,
    city: "",
    zip_code: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const router = useRouter();

  // Status Card Component for different verification states
  const StatusCard = () => {
    const status = decoded?.verification_status;

    const getStatusConfig = () => {
      switch (status) {
        case "in_progress":
          return {
            icon: <Clock className="w-16 h-16 text-yellow-500" />,
            title: "Verification in Progress",
            description: "Your documents are currently under review by our team. This process typically takes 24-48 hours.",
            bgColor: "bg-yellow-50",
            borderColor: "border-yellow-200",
            textColor: "text-yellow-700",
            iconBg: "bg-yellow-100",
          };
        case "verified":
          return {
            icon: <CheckCircle className="w-16 h-16 text-green-500" />,
            title: "Verification Complete",
            description: "Your account has been successfully verified. You now have full access to all features.",
            bgColor: "bg-green-50",
            borderColor: "border-green-200",
            textColor: "text-green-700",
            iconBg: "bg-green-100",
          };
        case "unverfied":
          return {
            icon: <AlertCircle className="w-16 h-16 text-orange-500" />,
            title: "Account Unverified",
            description: "Your account is currently unverified. Please submit your documents to get verified.",
            bgColor: "bg-orange-50",
            borderColor: "border-orange-200",
            textColor: "text-orange-700",
            iconBg: "bg-orange-100",
          };
        default:
          return null;
      }
    };

    const config = getStatusConfig();

    if (!config) return null;

    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className={`${config.bgColor} ${config.borderColor} border-2 rounded-2xl p-8 text-center`}>
          <div className={`${config.iconBg} w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6`}>
            {config.icon}
          </div>
          <h2 className={`text-2xl font-bold ${config.textColor} mb-4`}>
            {config.title}
          </h2>
          <p className="text-gray-700 text-lg mb-6 max-w-md mx-auto">
            {config.description}
          </p>
          {status === "in_progress" && (
            <div className="flex justify-center items-center space-x-2 text-sm text-gray-600">
              <div className="animate-pulse flex space-x-1">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="w-2 h-2 bg-yellow-500 rounded-full animation-delay-200"></div>
                <div className="w-2 h-2 bg-yellow-500 rounded-full animation-delay-400"></div>
              </div>
              <span>Processing your documents...</span>
            </div>
          )}
          {status === "verified" && (
            <button
              onClick={() => router.push("/trainer")}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Go to Home
            </button>
          )}
        </div>
      </div>
    );
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

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  // Handle file uploads and preview generation
  const handlePhotoChange = (
    files: FileList | null,
    fieldName: keyof FormData
  ) => {
    if (files && files[0]) {
      const file = files[0];

      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          [fieldName]: "Only image files are allowed",
        }));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (fieldName === "picture") {
          setPhotoPreview(result);
        } else if (fieldName === "id_front") {
          setFrontSidePreview(result);
        } else if (fieldName === "id_back") {
          setBackSidePreview(result);
        }
      };
      reader.readAsDataURL(file);

      handleInputChange(fieldName, file);
    }
  };

  // Remove an uploaded image
  const removeImage = (fieldName: keyof FormData) => {
    if (fieldName === "picture") {
      setPhotoPreview(null);
    } else if (fieldName === "id_front") {
      setFrontSidePreview(null);
    } else if (fieldName === "id_back") {
      setBackSidePreview(null);
    }
    handleInputChange(fieldName, null);
  };

  // Validate the form inputs
  const validateForm = (): boolean => {
    const newErrors: Errors = {};

    if (!formData.city.trim()) {
      newErrors.city = "City name is required";
    }

    if (!formData.zip_code.trim()) {
      newErrors.zip_code = "ZIP code is required";
    } else if (!/^\d+$/.test(formData.zip_code.trim())) {
      newErrors.zip_code = "ZIP code must contain only numbers";
    }

    if (!formData.picture) {
      newErrors.picture = "Photo is required";
    }

    if (!formData.id_front) {
      newErrors.id_front = "Front side image is required";
    }

    if (!formData.id_back) {
      newErrors.id_back = "Back side image is required";
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
      const photoFile = formData.picture!;
      const frontSideFile = formData.id_front!;
      const backSideFile = formData.id_back!;

      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      };

      const compressedPhoto = await imageCompression(photoFile, options);
      const compressedFrontSide = await imageCompression(frontSideFile, options);
      const compressedBackSide = await imageCompression(backSideFile, options);

      const formDataToSend = new FormData();
      formDataToSend.append("picture", compressedPhoto);
      formDataToSend.append("id_front", compressedFrontSide);
      formDataToSend.append("id_back", compressedBackSide);
      formDataToSend.append("city", formData.city);
      formDataToSend.append("zip_code", formData.zip_code);
      
      const accessToken = getCookie("access_token");
      const response = await fetch(
        `${BASE_URL}/account/teacher-verification/`,
        {
          method: "POST",
          body: formDataToSend,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data: ResponseAccess = await response.json();

      if (data.access_token) {
        removeCookie("access_token");
        setCookie("access_token", data.access_token, 7);
        toast.success("Documents uploaded successfully!");

        setFormData({
          city: "",
          zip_code: "",
          picture: null,
          id_front: null,
          id_back: null,
        });
        setPhotoPreview(null);
        setFrontSidePreview(null);
        setBackSidePreview(null);
        setErrors({});

        router.push("/trainer");
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("Upload failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Trigger file input click programmatically
  const triggerFileInput = (inputName: string) => {
    document.getElementById(inputName)?.click();
  };

  // Show status card for in_progress, verified, or unverfied
  if (decoded?.verification_status === "in_progress" || 
      decoded?.verification_status === "verified" || 
      decoded?.verification_status === "unverfied") {
    return <StatusCard />;
  }

  // Show upload form for not_submitted or reject
  const isRejected = decoded?.verification_status === "reject";

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white">
      {isRejected && (
        <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start space-x-3">
          <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-700 mb-1">Verification Rejected</h3>
            <p className="text-sm text-red-600">
              Your previous submission was rejected. Please review your documents carefully and resubmit with correct information.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={onSubmit}>
        <div className="text-center mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-2">
            {isRejected ? "Resubmit Your Documents" : "Submit Your Documents"}
          </h2>
          <p className="text-sm text-gray-600 mb-6">
            {isRejected 
              ? "Please ensure all information is accurate and images are clear before resubmitting"
              : "Please fill in the necessary documents to continue"}
          </p>

          {/* Photo Upload Circle */}
          <div className="flex justify-center mb-2">
            <div className="relative">
              {photoPreview ? (
                <div className="relative">
                  <Image
                    src={photoPreview}
                    alt="Photo preview"
                    width={80}
                    height={80}
                    className="rounded-full object-cover border-2 border-orange-300"
                  />
                  <button
                    type="button"
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-xs hover:bg-red-600"
                    onClick={() => removeImage("picture")}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="picture"
                  className="w-20 h-20 rounded-full border-2 border-dashed border-orange-300 flex items-center justify-center cursor-pointer hover:border-orange-400 transition-colors"
                >
                  <Camera className="w-8 h-8 text-orange-500" />
                </label>
              )}
              <input
                id="picture"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handlePhotoChange(e.target.files, "picture")}
              />
            </div>
          </div>
          <p className="text-sm font-medium text-gray-700 mb-2">Photo Upload</p>
          {errors.picture && (
            <p className="text-sm text-red-500 mb-4">{errors.picture}</p>
          )}
        </div>

        <div>
          {/* City Name and ZIP Code Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City Name
              </label>
              <input
                type="text"
                placeholder="Enter city name"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
              />
              {errors.city && (
                <p className="text-sm text-red-500 mt-1">{errors.city}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ZIP Code
              </label>
              <input
                type="text"
                placeholder="Enter ZIP code"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                value={formData.zip_code}
                onChange={(e) => handleInputChange("zip_code", e.target.value)}
              />
              {errors.zip_code && (
                <p className="text-sm text-red-500 mt-1">{errors.zip_code}</p>
              )}
            </div>
          </div>

          {/* Upload ID Card Section */}
          <div className="space-y-4 mb-8">
            <h3 className="text-lg font-medium text-gray-900 text-center">
              Upload ID card
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Front Side */}
              <div>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-orange-300 transition-colors relative">
                  {frontSidePreview ? (
                    <div className="relative">
                      <Image
                        src={frontSidePreview}
                        alt="Front side preview"
                        width={300}
                        height={120}
                        className="w-full h-32 object-cover rounded-lg mb-4"
                      />
                      <button
                        type="button"
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-xs hover:bg-red-600"
                        onClick={() => removeImage("id_front")}
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <p className="text-sm font-medium text-gray-700">
                        Front side uploaded
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center">
                          <Cloud className="w-6 h-6 text-orange-500" />
                        </div>
                      </div>

                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Front side
                      </p>
                      <p className="text-sm text-gray-700 mb-2">
                        Choose a file or drag & drop it here
                      </p>
                      <p className="text-xs text-gray-500 mb-4">
                        JPEG, PNG, PDF formats, up to 50mb
                      </p>

                      <button
                        type="button"
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => triggerFileInput("id_front")}
                      >
                        Browse file
                      </button>
                    </>
                  )}

                  <input
                    id="id_front"
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(e) => handlePhotoChange(e.target.files, "id_front")}
                  />
                </div>
                {errors.id_front && (
                  <p className="text-sm text-red-500 mt-1">{errors.id_front}</p>
                )}
              </div>

              {/* Back Side */}
              <div>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-orange-300 transition-colors relative">
                  {backSidePreview ? (
                    <div className="relative">
                      <Image
                        src={backSidePreview}
                        alt="Back side preview"
                        width={300}
                        height={120}
                        className="w-full h-32 object-cover rounded-lg mb-4"
                      />
                      <button
                        type="button"
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-xs hover:bg-red-600"
                        onClick={() => removeImage("id_back")}
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <p className="text-sm font-medium text-gray-700">
                        Back side uploaded
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center">
                          <Cloud className="w-6 h-6 text-orange-500" />
                        </div>
                      </div>

                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Back side
                      </p>
                      <p className="text-sm text-gray-700 mb-2">
                        Choose a file or drag & drop it here
                      </p>
                      <p className="text-xs text-gray-500 mb-4">
                        JPEG, PNG, PDF formats, up to 50mb
                      </p>

                      <button
                        type="button"
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => triggerFileInput("id_back")}
                      >
                        Browse file
                      </button>
                    </>
                  )}

                  <input
                    id="id_back"
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(e) => handlePhotoChange(e.target.files, "id_back")}
                  />
                </div>
                {errors.id_back && (
                  <p className="text-sm text-red-500 mt-1">{errors.id_back}</p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              {isSubmitting 
                ? "Uploading..." 
                : isRejected 
                  ? "Resubmit Documents" 
                  : "Submit Documents"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DocUpload;