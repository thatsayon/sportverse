import React, { useState } from "react";
import { Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

interface MediaCardProps {
  id: string;
  isAdmin?: boolean;
  title: string;
  description: string;
  sports: string | null;
  consumer: string;
  thumbnail: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  setSelectedId: (value: string) => void;
}

const MediaCard: React.FC<MediaCardProps> = ({
  id,
  isAdmin = true,
  title,
  description,
  sports,
  consumer,
  thumbnail,
  setOpen,
  open,
  setSelectedId
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);
  const router = useRouter();

  console.log("Receiving Consumer:", consumer);

  const getSportsColor = (sport: string | null) => {
    if (!sport) return "bg-gray-100 text-gray-800 border-gray-200";
    
    const sportLower = sport.toLowerCase();
    switch (sportLower) {
      case "football":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "basketball":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "soccer":
        return "bg-green-100 text-green-800 border-green-200";
      case "tennis":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "volleyball":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "baseball":
        return "bg-red-100 text-red-800 border-red-200";
      case "cricket":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getConsumerColor = (consumer: string) => {
    const consumerLower = consumer.toLowerCase();
    switch (consumerLower) {
      case "student":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "teacher":
        return "bg-green-100 text-green-800 border-green-200";
      case "trainers":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getSportsIcon = (sport: string | null) => {
    if (!sport) return "🏃";
    
    const sportLower = sport.toLowerCase();
    switch (sportLower) {
      case "football":
        return "🏈";
      case "basketball":
        return "🏀";
      case "soccer":
        return "⚽";
      case "tennis":
        return "🎾";
      case "volleyball":
        return "🏐";
      case "baseball":
        return "⚾";
      case "cricket":
        return "🏏";
      case "badminton":
        return "🏸";
      case "table tennis":
        return "🏓";
      default:
        return "🏃";
    }
  };

  const getConsumerIcon = (consumer: string) => {
    const consumerLower = consumer.toLowerCase();
    switch (consumerLower) {
      case "teacher":
        return "👨‍🏫";
      case "student":
        return "🧑‍🎓";
      case "trainers":
        return "🏋️‍♂️";
      default:
        return "👤";
    }
  };

  const handleRoute = () => {
    if (isAdmin) {
      router.push(`/dashboard/media/${id}`);
    } else {
      router.push(`/student/video-library/${id}`);
    }
  };

  // Helper function to check if thumbnail is a valid URL
  const isValidImageUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Fallback thumbnail for invalid URLs or missing images
  const fallbackThumbnail = "/images/video-placeholder.jpg"; // You should add this placeholder image

  return (
    <Card
      className="group cursor-pointer h-[400px] transition-all duration-300 hover:shadow-lg overflow-hidden py-0 pb-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        onClick={handleRoute}
        className="relative aspect-video bg-gray-100 overflow-hidden"
      >
        {/* Thumbnail or Placeholder */}
        <Image
          src={imageError || !isValidImageUrl(thumbnail) ? fallbackThumbnail : thumbnail}
          alt={title}
          width={320}
          height={231}
          className="w-full h-full object-cover transition-transform duration-300 scale-95 group-hover:scale-100 rounded-2xl"
          onError={() => setImageError(true)}
        />

        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
          <div
            className={`w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center transition-all duration-300 ${
              isHovered ? "scale-100 opacity-100" : "scale-75 opacity-0"
            }`}
          >
            <Play className="w-6 h-6 text-gray-800 ml-1" fill="currentColor" />
          </div>
        </div>
      </div>

      <CardContent className="p-4 -mt-6 relative">
        <div onClick={handleRoute} className="mb-3">
          <h3 className="font-semibold text-xl flex items-center justify-between text-gray-900 mb-2 line-clamp-1">
            <span className="group-hover:text-[#F15A24] transition-colors">
              {title}
            </span>
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Tags */}
        <div
          onClick={handleRoute}
          className="flex items-center justify-between"
        >
          <div className="flex flex-wrap gap-2">
            {sports && (
              <Badge
                variant="outline"
                className={`text-xs ${getSportsColor(sports)} capitalize`}
              >
                {getSportsIcon(sports)} {sports}
              </Badge>
            )}
            {isAdmin && (
              <Badge
                variant="outline"
                className={`text-xs ${getConsumerColor(consumer)} capitalize`}
              >
                {getConsumerIcon(consumer)}
                {consumer}
              </Badge>
            )}
          </div>
        </div>
        <div className="absolute right-5 bottom-2">
          {isAdmin && (
            <Button
              onClick={(e) => {
                e.preventDefault(); // Prevent navigation when clicking edit
                e.stopPropagation();
                setOpen(true);
                setSelectedId(id);
              }}
              variant={"outline"}
              className="py-2 px-6"
            >
              Edit
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MediaCard;