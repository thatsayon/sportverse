import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Video } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TrainerBookingCardProps {
  id: string;
  trainer_name: string;
  price: number;
  category: string;
  date: string;
  start_time: string;
  end_time: string;
  session_type: "Virtual Session" | "In-person";
  status: "On Going" | "Up Comming" | "Cancelled";
  avatar_url: string;
  actions: {
    join_url: string;
  };
  onJoinSession?: (sessionId: string) => void;
}

const TrainerBookingCard: React.FC<TrainerBookingCardProps> = ({
  id,
  trainer_name,
  price,
  category,
  date,
  start_time,
  end_time,
  session_type,
  status,
  avatar_url,
  actions,
  onJoinSession,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "On Going":
        return "bg-green-100 text-green-800 border-green-200";
      case "Up Comming":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase();
  };

  const handleJoinSession = () => {
    if (onJoinSession) {
      onJoinSession(id);
    }
  };

  return (
    <Card className="p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        {/* Left Section - Avatar and Info */}
        <div className="flex items-center space-x-3 flex-1">
          <Avatar className="h-16 w-16">
            <AvatarImage src={avatar_url} alt={trainer_name} />
            <AvatarFallback className="bg-orange-100 text-orange-600">
              {getInitials(trainer_name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            {/* Trainer Name and Price */}
            <div className="flex items-center mb-1">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {trainer_name}
              </h3>
            </div>

            {/* Category */}
            <div className="text-[#FF7F51]">
              <span className="text-lg font-semibold">${price}</span>
              <p className="font-montserrat font-medium mb-3">{category}</p>
            </div>

            {/* Session Details */}
            <div className="flex flex-wrap justify-between items-center gap-4 text-sm text-gray-500 mb-3">
              <div className="flex gap-6">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(date)}</span>
                </div>

                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>
                    {formatTime(start_time)} - {formatTime(end_time)}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  {session_type === "Virtual Session" ? (
                    <Video className="h-4 w-4" />
                  ) : (
                    <MapPin className="h-4 w-4" />
                  )}
                  <span>{session_type}</span>
                </div>
              </div>
              {/* Status and Action */}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge
              variant="outline"
              className={`${getStatusColor(status)} border`}
            >
              {status}
            </Badge>

            {status === "On Going" ? (
              <Button
                onClick={handleJoinSession}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 text-sm"
              >
                Join Session
              </Button>
            ) : (
              <Button
                onClick={handleJoinSession}
                disabled
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 text-sm"
              >
                {status}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TrainerBookingCard;
