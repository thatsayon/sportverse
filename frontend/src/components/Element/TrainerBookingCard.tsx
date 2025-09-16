import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Video } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import moment from "moment";
import { useLazyGetGeneratedTokenQuery } from "@/store/Slices/apiSlices/trainerApiSlice";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setCallConfig } from "@/store/Slices/stateSlices/studentSlice";
interface TrainerBookingCardProps {
  id: string;
  student_name: string;
  price: number;
  category: string;
  session_time: string;
  session_type: "Virtual Session" | "In-person";
  status: "Ongoing" | "Upcomming" | "Completed";
  // avatar_url: string;
}

const TrainerBookingCard: React.FC<TrainerBookingCardProps> = ({
  id,
  student_name,
  price,
  category,
  session_time,
  session_type,
  status,
  // avatar_url,
}) => {
  const [getToken] = useLazyGetGeneratedTokenQuery();
  const router = useRouter();
  const dispatch = useDispatch();
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ongoing":
        return "bg-green-100 text-green-800 border-green-200";
      case "Upcoming":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Completed":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleJoinSession = async () => {
    const response = await getToken(id).unwrap();
    if (response.token) {
      console.log("Token Resonse",response);

      dispatch(setCallConfig(response))
      router.push("/video")
    }
    console.log("pressed. Now press harder!!!");
  };

  return (
    <Card className="p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        {/* Left Section - Avatar and Info */}
        <div className="flex items-center space-x-3 flex-1">
          <Avatar className="h-16 w-16">
            {/* <AvatarImage src={avatar_url} alt={student_name} /> */}
            <AvatarImage
              src={
                "https://i.pinimg.com/736x/3d/40/e6/3d40e6df5a167e763a170871e526483b.jpg"
              }
              alt={student_name}
            />
            {/* <AvatarFallback className="bg-orange-100 text-orange-600">
              {getInitials(student_name)}
            </AvatarFallback> */}
          </Avatar>

          <div className="flex-1 min-w-0">
            {/* Trainer Name and Price */}
            <div className="flex items-center mb-1">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {student_name}
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
                  {/* <span>{formatDate(date)}</span> */}
                  <span>{moment(session_time).format("MMMM Do YYYY")}</span>
                </div>

                <div className="flex items-center gap-1f">
                  <Clock className="h-4 w-4" />
                  <span>
                    {<span>{moment(session_time).format("LT")}</span>} -{" "}
                    {
                      <span>
                        {moment(session_time).add(1, "hour").format("LT")}
                      </span>
                    }
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

            {status === "Ongoing" ? (
              <Button
                onClick={handleJoinSession}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 text-sm"
              >
                Join Session
              </Button>
            ) : (
              <Button
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
