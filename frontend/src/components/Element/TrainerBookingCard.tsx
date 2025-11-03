import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Video, Star } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import moment from "moment";
import { useLazyGetGeneratedTokenQuery } from "@/store/Slices/apiSlices/trainerApiSlice";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setCallConfig } from "@/store/Slices/stateSlices/studentSlice";
import { useJwt } from "@/hooks/useJwt";
import {
  useLazyGenerateStudentTokenQuery,
  usePostRatingMutation,
} from "@/store/Slices/apiSlices/studentApiSlice";
import { StudentBooking } from "@/types/student/bookings";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

const ratingSchema = z.object({
  rating: z.number().min(1, "Please select a rating").max(5),
  review: z
    .string()
    .min(10, "Review must be at least 10 characters")
    .max(500, "Review must be less than 500 characters"),
});

type RatingFormData = z.infer<typeof ratingSchema>;

const TrainerBookingCard: React.FC<StudentBooking> = ({
  id,
  teacher_name,
  teacher_id,
  session_time,
  session_type,
  status,
}) => {
  const [getToken] = useLazyGetGeneratedTokenQuery();
  const [getStudentToken] = useLazyGenerateStudentTokenQuery();
  const [postRating, { isLoading: isSubmittingRating }] =
    usePostRatingMutation();
  const router = useRouter();
  const { decoded } = useJwt();
  const dispatch = useDispatch();

  const [isRatingDialogOpen, setIsRatingDialogOpen] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<RatingFormData>({
    resolver: zodResolver(ratingSchema),
    defaultValues: {
      rating: 0,
      review: "",
    },
  });

  const currentRating = watch("rating");

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
    if (decoded?.role === "student") {
      const response = await getStudentToken(id).unwrap();
      if (response.token) {
        dispatch(setCallConfig(response));
        router.push("/video");
      }
    } else {
      const response = await getToken(id).unwrap();
      if (response.token) {
        dispatch(setCallConfig(response));
        router.push("/video");
      }
    }
  };

  const handleStarClick = (rating: number) => {
    setValue("rating", rating, { shouldValidate: true });
  };

  const onSubmitRating = async (data: RatingFormData) => {
    try {
      const response = await postRating({
        booked_session: id,
        teacher: teacher_id,
        rating: data.rating,
        review: data.review,
      }).unwrap();

      if (response.data) {
        toast.success("Rating submitted successfully!");
        setIsRatingDialogOpen(false);
        reset();
      } else {
        toast.error(response.detail);
      }
    } catch (error) {
      const err = error as Error;
      toast.error(`Failed to submit rating: ${err.message}`);
    }
  };

  const handleOpenRatingDialog = () => {
    reset();
    setIsRatingDialogOpen(true);
  };

  return (
    <>
      <Card className="p-4 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-start justify-between">
          {/* Left Section - Avatar and Info */}
          <div className="flex items-center space-x-3 flex-1">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src={
                  "https://i.pinimg.com/736x/3d/40/e6/3d40e6df5a167e763a170871e526483b.jpg"
                }
                alt={teacher_name}
              />
            </Avatar>

            <div className="flex-1 min-w-0">
              {/* Trainer Name and Price */}
              <div className="flex items-center mb-1">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {teacher_name}
                </h3>
              </div>
              {/* Session Details */}
              <div className="flex flex-wrap justify-between items-center gap-4 text-sm text-gray-500 mb-3">
                <div className="flex gap-6">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{moment(session_time).format("MMMM Do YYYY")}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>
                      {moment(session_time).format("LT")} -{" "}
                      {moment(session_time).add(1, "hour").format("LT")}
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
              ) : status === "Completed" && decoded?.role === "student" ? (
                <Button
                  onClick={handleOpenRatingDialog}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 text-sm"
                >
                  
                  Rate Session
                </Button>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Rating Dialog */}
      <Dialog open={isRatingDialogOpen} onOpenChange={setIsRatingDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Rate Your Session</DialogTitle>
            <DialogDescription>
              Share your experience with {teacher_name}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmitRating)}>
            <div className="space-y-6 py-4">
              {/* Star Rating */}
              <div className="space-y-2">
                <Label htmlFor="rating">Rating *</Label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleStarClick(star)}
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(0)}
                      className="transition-colors duration-150 focus:outline-none"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= (hoveredStar || currentRating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-gray-300 text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    {currentRating > 0
                      ? `${currentRating} out of 5`
                      : "Select rating"}
                  </span>
                </div>
                {errors.rating && (
                  <p className="text-sm text-red-600">
                    {errors.rating.message}
                  </p>
                )}
              </div>

              {/* Review Textarea */}
              <div className="space-y-2">
                <Label htmlFor="review">Review *</Label>
                <Textarea
                  id="review"
                  placeholder="Share your thoughts about the session..."
                  className="min-h-[120px] resize-none"
                  {...register("review")}
                />
                {errors.review && (
                  <p className="text-sm text-red-600">
                    {errors.review.message}
                  </p>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsRatingDialogOpen(false)}
                disabled={isSubmittingRating}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmittingRating}
                className="bg-orange-500 hover:bg-orange-600"
              >
                {isSubmittingRating ? "Submitting..." : "Submit Rating"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TrainerBookingCard;
