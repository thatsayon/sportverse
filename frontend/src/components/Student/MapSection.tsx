"use client";

import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Clock, Phone, Mail, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Types based on your API response
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

interface MapSectionProps {
  data: ApiResponse;
}

const MapSection: React.FC<MapSectionProps> = ({ data }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const teacherListRef = useRef<HTMLDivElement>(null);
  const teacherCardRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Function to scroll selected teacher card to top
  const scrollToTeacher = (teacherId: number) => {
    const teacherCard = teacherCardRefs.current[teacherId];
    const teacherListContainer = teacherListRef.current;
    
    if (teacherCard && teacherListContainer) {
      // Calculate the position to scroll to (teacher card position minus container offset)
      const containerRect = teacherListContainer.getBoundingClientRect();
      const cardRect = teacherCard.getBoundingClientRect();
      const scrollTop = teacherListContainer.scrollTop;
      const targetScrollTop = scrollTop + (cardRect.top - containerRect.top) - 20; // 20px padding from top
      
      teacherListContainer.scrollTo({
        top: targetScrollTop,
        behavior: 'smooth'
      });
    }
  };

  // Function to handle teacher selection
  const handleTeacherSelection = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    scrollToTeacher(teacher.id);
  };

  useEffect(() => {
    // Dynamically load Leaflet
    const loadLeaflet = async () => {
      if (typeof window !== "undefined" && !window.L) {
        // Load Leaflet CSS
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);

        // Load Leaflet JS
        const script = document.createElement("script");
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        script.onload = () => initializeMap();
        document.head.appendChild(script);
      } else if (window.L) {
        initializeMap();
      }
    };

    const initializeMap = () => {
      if (!mapRef.current || mapInstanceRef.current) return;

      const L = window.L;

      // Initialize map centered on query location
      const map = L.map(mapRef.current).setView(
        [data.location.latitude, data.location.longitude],
        6
      );

      // Add tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      // Custom icons
      const createCustomIcon = (color: string) => {
        return L.divIcon({
          className: "custom-div-icon",
          html: `
            <div style="
              background-color: ${color};
              width: 30px;
              height: 30px;
              border-radius: 50%;
              border: 3px solid white;
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
              font-size: 12px;
            ">
              📚
            </div>
          `,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        });
      };

      // Add search location marker
      const searchIcon = L.divIcon({
        className: "search-location-icon",
        html: `
          <div style="
            background-color: #ef4444;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 10px;
          ">
            📍
          </div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });

      L.marker([data.location.latitude, data.location.longitude], {
        icon: searchIcon,
      }).addTo(map).bindPopup(`
          <div class="p-2">
            <strong>Search Location</strong><br>
            ${data.query.city}
          </div>
        `);

      // Add teacher markers
      data.results.teachers.forEach((teacher, index) => {
        const colors = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"];
        const icon = createCustomIcon(colors[index % colors.length]);

        const marker = L.marker(
          [teacher.location.latitude, teacher.location.longitude],
          { icon }
        ).addTo(map);

        marker.bindPopup(`
          <div class="p-3 min-w-[200px]">
  <div class="flex justify-between">
    <!-- Left section -->
    <div class="flex items-start gap-4">
      <!-- Avatar -->
      <div class="w-16 h-16 rounded-full overflow-hidden">
        <img
          src="https://github.com/shadcn.png"
          alt="Avatar"
          class="w-16 h-16 object-cover"
        />
      </div>

      <!-- Teacher Info -->
      <div>
        <!-- Name -->
        <h3 class="font-semibold text-lg text-gray-900">${teacher.name}</h3>

        <!-- Rating, Experience & Distance -->
        <div class="flex flex-wrap gap-2 items-center mt-1">
          <div class="flex items-center gap-1 text-sm text-gray-600">
            ⏰ ${teacher.experience_years} years exp
          </div>
          <div class="flex items-center gap-1 text-sm text-yellow-500">
            ⭐ ${teacher.rating}
          </div>
          <div class="flex items-center gap-1 text-sm text-gray-600">
            📍 ${teacher.distance.km} miles
          </div>
        </div>
      </div>
    </div>

    <!-- Right section -->
    <div class="text-right flex-shrink-0">
      <div class="text-xl font-bold text-gray-900">$70</div>
      <div class="text-sm text-gray-500">/session</div>
    </div>
  </div>
</div>

        `);

        marker.on("click", () => {
          handleTeacherSelection(teacher);
        });
      });

      // Fit map to show all markers
      const group = new L.featureGroup([
        ...data.results.teachers.map((teacher) =>
          L.marker([teacher.location.latitude, teacher.location.longitude])
        ),
        L.marker([data.location.latitude, data.location.longitude]),
      ]);

      map.fitBounds(group.getBounds().pad(0.1));

      mapInstanceRef.current = map;
      setIsMapLoaded(true);
    };

    loadLeaflet();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [data]);

  const getDistanceColor = (category: string) => {
    switch (category) {
      case "near":
        return "bg-green-100 text-green-800";
      case "moderate":
        return "bg-yellow-100 text-yellow-800";
      case "far":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRatingStars = (rating: number) => {
    return "⭐".repeat(Math.floor(rating)) + (rating % 1 ? "⭐" : "");
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-2 mb-4">
      {/* Header */}
      <div className="text-start space-y-1">
        <h1 className="text-2xl font-bold text-gray-900">
          Trainers in {data.query.city}
        </h1>
        <p className="text-gray-600">
          Found {data.results.total_found} trainers in your area
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Section */}
        <div className="lg:col-span-2">
          <Card className="py-0">
            <CardContent className="p-0">
              <div
                ref={mapRef}
                className="w-full h-[400px] lg:h-[590px] rounded-lg"
                style={{ minHeight: "400px" }}
              />
              {!isMapLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-b-lg">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-gray-600">Loading map...</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Teachers List */}
        <div className="">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Trainer Profiles
              </CardTitle>
            </CardHeader>
            <CardContent 
              ref={teacherListRef}
              className="p-4 space-y-4 max-h-[490px] overflow-y-auto"
            >
              {data.results.teachers.map((teacher, index) => (
                <div
                  key={teacher.id}
                  ref={(el) => teacherCardRefs.current[teacher.id] = el}
                  className={`p-4 rounded-lg border transition-all cursor-pointer ${
                    selectedTeacher?.id === teacher.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                  }`}
                  onClick={() => handleTeacherSelection(teacher)}
                >
                  <div className="">
                    <div className="flex justify-between">
                      <div className="flex items-start gap-4">
                        {/* Teacher Name and Subject */}
                        <Avatar className="size-16">
                          <AvatarImage src="https://github.com/shadcn.png" />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div>
                          <div>
                            <h3 className="font-semibold text-lg text-gray-900">
                              {teacher.name}
                            </h3>
                          </div>

                          {/* Rating and Experience */}
                          <div className="flex flex-wrap gap-2 items-center">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-600">
                                {teacher.experience_years} year exp
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              <span className="text-sm font-medium">
                                {teacher.rating}
                              </span>
                            </div>
                          </div>

                          {/* Location and Distance */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-600">
                                {teacher.distance.km.toFixed(1)} miles
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Right side - Price */}
                      <div className="text-right flex-shrink-0">
                        {/* <div className="text-xl font-bold text-gray-900">
                          ${teacher.price || "70"}
                        </div> */}
                        <div className="text-sm text-gray-500">/session</div>
                      </div>
                    </div>

                    {/* Action Buttons and Price */}
                    <div className="mt-2">
                      {/* Left side - Buttons */}
                      <div className="flex flex-row gap-2 justify-between">
                        <Button className="w-1/2 py-3">View Profile</Button>
                        <Button className="w-1/2 py-3" variant="outline">
                          Quick Book
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Selected Teacher Details (Mobile) */}
      {selectedTeacher && (
        <div className="lg:hidden">
          <Card>
            <CardHeader>
              <CardTitle>Selected Teacher</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold">{selectedTeacher.name}</h3>
                  <p className="text-blue-600 font-medium">
                    {selectedTeacher.subject}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Rating</p>
                    <p className="font-semibold">
                      {getRatingStars(selectedTeacher.rating)}{" "}
                      {selectedTeacher.rating}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Experience</p>
                    <p className="font-semibold">
                      {selectedTeacher.experience_years} years
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-semibold">
                    {selectedTeacher.location.city},{" "}
                    {selectedTeacher.location.postal_code}
                  </p>
                </div>

                <Badge
                  className={getDistanceColor(
                    selectedTeacher.distance.category
                  )}
                >
                  {selectedTeacher.distance.km.toFixed(1)} km away
                </Badge>

                <div className="flex gap-2">
                  <Button className="flex-1">
                    <Phone className="h-4 w-4 mr-2" />
                    Contact
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Mail className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MapSection;