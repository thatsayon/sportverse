"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, MapPin, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import MapSection from "./MapSection";
import { getCookie } from "@/hooks/cookie";

// Validation schema
const searchSchema = z.object({
  zipCode: z
    .string()
    .min(1, "ZIP code is required")
    .regex(/^\d{4,6}$/, "ZIP code must be 4-6 digits"),
  cityName: z
    .string()
    .min(2, "City name must be at least 2 characters")
    .max(50, "City name must be less than 50 characters")
    .regex(
      /^[a-zA-Z\s-']+$/,
      "City name can only contain letters, spaces, hyphens, and apostrophes"
    ),
});

type SearchFormData = z.infer<typeof searchSchema>;

// Types for API response (same as MapSection)
interface Location {
  city: string;
  postal_code: string;
  latitude: number;
  longitude: number;
}

interface Distance {
  km: number;
  category: string;
}

interface Teacher {
  id: number;
  name: string;
  subject: string;
  experience_years: number;
  rating: number;
  location: Location;
  distance: Distance;
}

interface ApiResponse {
  success: boolean;
  query: {
    city: string;
    postal: string | null;
    limit: number;
  };
  location: {
    resolved_from: string;
    latitude: number;
    longitude: number;
  };
  results: {
    total_found: number;
    teachers: Teacher[];
  };
}

const MapSearch: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      zipCode: "",
      cityName: "",
    },
  });

  const searchTeachers = async (data: SearchFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        city: data.cityName.toLowerCase().trim(),
        postal: data.zipCode.trim(),
      });

      const access_token = getCookie("access_token");

      const response = await fetch(
        `https://stingray-intimate-sincerely.ngrok-free.app/map/nearest-teacher/?${params.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`, // ✅ attach token
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse = await response.json();

      if (!result.success) {
        throw new Error("Search was not successful");
      }

      setSearchResults(result);
    } catch (err) {
      //console.error("Search error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to search for teachers. Please try again."
      );
      setSearchResults(null);
    } finally {
      setIsLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchResults(null);
    setError(null);
    reset();
  };

  return (
    <div className="w-full">
      {/* Search Section */}
      <div className="w-full max-w-4xl mx-auto">
        <Card className="shadow-none border-0 bg-white">
          <CardContent>
            <form onSubmit={handleSubmit(searchTeachers)} className="space-y-4">
              {/* Search Header */}
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Find Teachers Near You
                </h2>
                <p className="text-gray-600">
                  Enter your location to discover qualified teachers in your
                  area
                </p>
              </div>

              {/* Search Inputs */}
              <div className="flex flex-col sm:flex-row gap-8 md:gap-4">
                {/* ZIP Code Input */}
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 -top-6 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    {...register("zipCode")}
                    type="text"
                    placeholder="Enter city ZIP code..."
                    className={`pl-10 h-12 text-base ${
                      errors.zipCode
                        ? "border-red-500 focus-visible:ring-red-500"
                        : "border-gray-300 focus-visible:ring-blue-500"
                    }`}
                    disabled={isLoading}
                  />
                  {errors.zipCode && (
                    <p className="text-red-500 text-sm my-1 absolute">
                      {errors.zipCode.message}
                    </p>
                  )}
                </div>

                {/* City Name Input */}
                <div className="flex-1 relative mb-7">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    {...register("cityName")}
                    type="text"
                    placeholder="Enter city name..."
                    className={`pl-10 h-12 text-base ${
                      errors.cityName
                        ? "border-red-500 focus-visible:ring-red-500"
                        : "border-gray-300 focus-visible:ring-blue-500"
                    }`}
                    disabled={isLoading}
                  />
                  {errors.cityName && (
                    <p className="text-red-500 text-sm my-1 absolute">
                      {errors.cityName.message}
                    </p>
                  )}
                </div>

                {/* Search Button */}
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="max-h-12"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        Search Now
                        <Search className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>

                  {searchResults && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={clearSearch}
                      className="h-12 px-4"
                      disabled={isLoading}
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Error Display */}
      {error && (
        <div className="max-w-4xl mx-auto px-4">
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Search Failed:</strong> {error}
              <div className="mt-2">
                <Button
                  onClick={clearSearch}
                  variant="outline"
                  size="sm"
                  className="text-red-700 border-red-300 hover:bg-red-100"
                >
                  Try Again
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="max-w-4xl mx-auto px-4">
          <Card>
            <CardContent className="p-8">
              <div className="flex flex-col items-center justify-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <p className="text-lg font-medium text-gray-700">
                  Searching for teachers...
                </p>
                <p className="text-sm text-gray-500">
                  This may take a few moments
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search Results */}
      {searchResults && !isLoading && (
        <div className="space-y-4 px-4 lg:px-0">

          {/* Map Section */}
          <MapSection data={searchResults} />
        </div>
      )}

      {/* Empty State - No Search Yet */}
      {!searchResults && !isLoading && !error && (
        <div className="max-w-4xl mx-auto px-4">
          <Card className="border-dashed border-2 border-gray-300">
            <CardContent className="p-12">
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Ready to find teachers?
                  </h3>
                  <p className="text-gray-600">
                    Enter your city name and ZIP code above to discover
                    qualified teachers in your area.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MapSearch;
