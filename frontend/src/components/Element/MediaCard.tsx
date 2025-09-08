import React, { useState } from "react";
import { Play, Clock, User, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

interface MediaCardProps {
  isAdmin?: boolean;
  title: string;
  description: string;
  duration: string;
  sports: "basketball" | "football";
  consumer: "student" | "teacher";
  thumbnail?: string;
}

const MediaCard: React.FC<MediaCardProps> = ({
  isAdmin= true,
  title,
  description,
  duration,
  sports,
  consumer,
  thumbnail,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const getSportsColor = (sport: string) => {
    switch (sport) {
      case "football":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "basketball":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getConsumerColor = (consumer: string) => {
    switch (consumer) {
      case "student":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "teacher":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getSportsIcon = (sport: string) => {
    switch (sport) {
      case "football":
        return "⚽";
      case "basketball":
        return "🏀";
      default:
        return "🏃";
    }
  };
  const getConsumerIcon = (consumer: string) => {
    switch (consumer) {
      case "teacher":
        return "👨‍🏫";
      case "student":
        return "🧑‍🎓";
      default:
        return "🏃";
    }
  };

  return (
    <Card
      className="group cursor-pointer transition-all duration-300 hover:shadow-lg overflow-hidden py-0 pb-2 "
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-video bg-gray-100 overflow-hidden">
        {/* Thumbnail or Placeholder */}
        {thumbnail && !imageError ? (
          <Image
            src={thumbnail}
            alt={title}
            width={320}
            height={231}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">{getSportsIcon(sports)}</div>
              <div className="text-gray-500 text-sm font-medium">{sports}</div>
            </div>
          </div>
        )}

        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
          <div
            className={`w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center transition-all duration-300 ${
              isHovered ? "scale-100 opacity-100" : "scale-75 opacity-0"
            }`}
          >
            <Play className="w-6 h-6 text-gray-800 ml-1" fill="currentColor" />
          </div>
        </div>
      </div>

      <CardContent className="p-4 -mt-6">
        <div className="mb-3">
          <h3 className="font-semibold text-xl flex items-center justify-between text-gray-900 mb-2 line-clamp-1">
            <span className="group-hover:text-[#F15A24] transition-colors">
              {title}
            </span>
            <span className="text-base font-normal">{duration}</span>
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          <Badge
            variant="outline"
            className={`text-xs ${getSportsColor(sports)} capitalize`}
          >
            {getSportsIcon(sports)} {sports}
          </Badge>
          {isAdmin && (
            <Badge
              variant="outline"
              className={`text-xs ${getConsumerColor(consumer)} capitalize`}
            >
              {/* <User className="w-3 h-3 mr-1" /> */}
              {getConsumerIcon(consumer)}
              {consumer}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MediaCard;
