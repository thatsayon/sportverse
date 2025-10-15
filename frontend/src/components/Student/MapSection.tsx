"use client";

import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Phone, Mail } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useJwt } from "@/hooks/useJwt";
import Link from "next/link";

// Updated Types based on new API response
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
  id: string; // Changed from number to string (UUID)
  user_id: string; // Added user_id
  username: string; // Changed from name
  full_name: string; // Added full_name
  profile_pic: string | null; // Added profile_pic
  institute_name: string; // Added institute_name
  coach_types: string[]; // Changed from subject to coach_types array
  description: string; // Added description
  location: Location;
  distance: Distance;
}

interface ApiResponse {
  success: boolean;
  query: {
    city: string;
    postal: string;
    country?: string;
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
  const teacherCardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const { decoded } = useJwt();

  // Function to scroll selected teacher card to top
  const scrollToTeacher = (teacherId: string) => {
    const teacherCard = teacherCardRefs.current[teacherId];
    const teacherListContainer = teacherListRef.current;

    if (teacherCard && teacherListContainer) {
      const containerRect = teacherListContainer.getBoundingClientRect();
      const cardRect = teacherCard.getBoundingClientRect();
      const scrollTop = teacherListContainer.scrollTop;
      const targetScrollTop =
        scrollTop + (cardRect.top - containerRect.top) - 20;

      teacherListContainer.scrollTo({
        top: targetScrollTop,
        behavior: "smooth",
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

      // Add search location marker with map pin icon
      const searchIcon = L.divIcon({
        className: "search-location-icon",
        html: `
          <div style="
            position: relative;
            width: 32px;
            height: 40px;
          ">
            <svg width="32" height="40" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 0C7.03 0 3 4.03 3 9C3 15.75 12 28 12 28C12 28 21 15.75 21 9C21 4.03 16.97 0 12 0Z" fill="#ef4444" stroke="white" stroke-width="1.5"/>
              <circle cx="12" cy="9" r="3" fill="white"/>
            </svg>
          </div>
        `,
        iconSize: [32, 40],
        iconAnchor: [16, 40],
        popupAnchor: [0, -40],
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

        // Build coach types display
        const coachTypesDisplay = teacher.coach_types.length > 0 
          ? teacher.coach_types.join(", ") 
          : "No specialization listed";

        // Build institute display
        const instituteDisplay = teacher.institute_name 
          ? `<div class="text-sm text-gray-600">🏫 ${teacher.institute_name}</div>`
          : '';

        marker.bindPopup(`
          <div class="p-3 min-w-[200px]">
            <div class="flex justify-between">
              <!-- Left section -->
              <div class="flex items-start gap-4">
                <!-- Avatar -->
                <div class="w-16 h-16 rounded-full overflow-hidden">
                  <img
                    src="${teacher.profile_pic || 'https://github.com/shadcn.png'}"
                    alt="${teacher.full_name}"
                    class="w-16 h-16 object-cover"
                  />
                </div>

                <!-- Teacher Info -->
                <div>
                  <!-- Name -->
                  <h3 class="font-semibold text-lg text-gray-900">${teacher.full_name}</h3>
                  
                  <!-- Coach Types -->
                  <div class="text-sm text-blue-600 font-medium">${coachTypesDisplay}</div>

                  ${instituteDisplay}

                  <!-- Distance -->
                  <div class="flex flex-wrap gap-2 items-center mt-1">
                    <div class="flex items-center gap-1 text-sm text-gray-600">
                      📍 ${teacher.distance.km.toFixed(1)} km
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
      case "very_close":
        return "bg-green-100 text-green-800";
      case "nearby":
        return "bg-blue-100 text-blue-800";
      case "far":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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
              {data.results.teachers.map((teacher) => (
                <div
                  key={teacher.id}
                  ref={(el) => (teacherCardRefs.current[teacher.id] = el)}
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
                        {/* Teacher Avatar */}
                        <Avatar className="size-16">
                          <AvatarImage 
                            src={teacher.profile_pic || "https://github.com/shadcn.png"} 
                            alt={teacher.full_name}
                          />
                          <AvatarFallback>
                            {teacher.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div>
                          {/* Name */}
                          <div>
                            <h3 className="font-semibold text-lg text-gray-900">
                              {teacher.full_name}
                            </h3>
                          </div>

                          {/* Coach Types */}
                          {teacher.coach_types.length > 0 && (
                            <div className="text-sm text-blue-600 font-medium">
                              {teacher.coach_types.join(", ")}
                            </div>
                          )}

                          {/* Institute Name */}
                          {teacher.institute_name && (
                            <div className="text-sm text-gray-600">
                              🏫 {teacher.institute_name}
                            </div>
                          )}

                          {/* Location and Distance */}
                          <div className="space-y-2 mt-1">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-600">
                                {teacher.distance.km.toFixed(1)} km
                              </span>
                              <Badge 
                                className={`ml-2 ${getDistanceColor(teacher.distance.category)}`}
                                variant="secondary"
                              >
                                {teacher.distance.category.replace('_', ' ')}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Right side - Price */}
                      <div className="text-right flex-shrink-0">
                        <div className="text-sm text-gray-500">/session</div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-3">
                      <div className="flex flex-row gap-2 justify-between">
                        <Link 
                          href={
                            decoded?.role === "teacher" ? `/trainer/in-person/${teacher.id}`:`/student/in-person/${teacher.id}`
                          }
                          className="w-1/2"
                        >
                          <Button className="w-full py-3">View Profile</Button>
                        </Link>
                        {decoded?.role === "student" && (
                          <Link 
                            href={`/student/session-booking/${teacher.user_id}`}
                            className="w-1/2"
                          >
                            <Button className="w-full py-3" variant="outline">
                              Quick Book
                            </Button>
                          </Link>
                        )}
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
                <div className="flex items-center gap-4">
                  <Avatar className="size-20">
                    <AvatarImage 
                      src={selectedTeacher.profile_pic || "https://github.com/shadcn.png"} 
                      alt={selectedTeacher.full_name}
                    />
                    <AvatarFallback>
                      {selectedTeacher.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-bold">{selectedTeacher.full_name}</h3>
                    {selectedTeacher.coach_types.length > 0 && (
                      <p className="text-blue-600 font-medium">
                        {selectedTeacher.coach_types.join(", ")}
                      </p>
                    )}
                  </div>
                </div>

                {selectedTeacher.institute_name && (
                  <div>
                    <p className="text-sm text-gray-600">Institute</p>
                    <p className="font-semibold">🏫 {selectedTeacher.institute_name}</p>
                  </div>
                )}

                {selectedTeacher.description && (
                  <div>
                    <p className="text-sm text-gray-600">Description</p>
                    <p className="text-sm">{selectedTeacher.description}</p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-semibold">
                    {selectedTeacher.location.city},{" "}
                    {selectedTeacher.location.postal_code}
                  </p>
                </div>

                <Badge
                  className={getDistanceColor(selectedTeacher.distance.category)}
                >
                  {selectedTeacher.distance.km.toFixed(1)} km away
                </Badge>

                <div className="flex gap-2">
                  <Link 
                    href={
                            decoded?.role === "teacher" ? `/trainer/in-person/${selectedTeacher.id}`:`/student/in-person/${selectedTeacher.id}`
                          }
                    className="flex-1"
                  >
                    <Button className="w-full">View Profile</Button>
                  </Link>
                  {decoded?.role === "student" && (
                    <Link 
                      href={`/student/session-booking/${selectedTeacher.user_id}`}
                      className="flex-1"
                    >
                      <Button variant="outline" className="w-full">
                        Quick Book
                      </Button>
                    </Link>
                  )}
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