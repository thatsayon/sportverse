import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useGetAdminVideoForEditQuery, useGetAdminVideosQuery, useUpdateAdminVideoMutation } from "@/store/Slices/apiSlices/adminApiSlice";

const videoEditSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z
    .string()
    .max(500, "Description must be 500 characters or less"),
});

type VideoEditFormData = z.infer<typeof videoEditSchema>;

interface VideoEditFormProps {
  id: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const VideoEditFrom: React.FC<VideoEditFormProps> = ({ id, open, setOpen }) => {
  const {refetch} = useGetAdminVideosQuery()
  const { data, isLoading, isError } = useGetAdminVideoForEditQuery(id, {
    skip: !open || !id, // Only fetch when dialog is open and id exists
  });
  const [updateVideo, { isLoading: isUpdating }] = useUpdateAdminVideoMutation();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<VideoEditFormData>({
    resolver: zodResolver(videoEditSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  // Populate form with API data when data is loaded
  useEffect(() => {
    if (data && open) {
      setValue("title", data.title || "");
      setValue("description", data.description || "");
    }
  }, [data, open, setValue]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  const onSubmit = async (formData: VideoEditFormData) => {
    try {
      const updateData = {
        id: id,
        title: formData.title,
        description: formData.description,
      };

      await updateVideo(updateData).unwrap();
      refetch()
      toast.success("Video updated successfully!");
      setOpen(false);
      reset();
    } catch (error) {
      console.error("Error updating video:", error);
      toast.error("Failed to update video. Please try again.");
    }
  };

  const handleCancel = () => {
    setOpen(false);
    reset();
  };

  const descriptionLength = watch("description")?.length || 0;

  // Loading state
  if (isLoading && open) {
    return (
      <Dialog  open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Video</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Error state
  if (isError && open) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Video</DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">Failed to load video data</p>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Video</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title Field */}
          <div>
            <Label htmlFor="title" className="mb-2 block">
              Title
            </Label>
            <Input
              id="title"
              placeholder="Enter video title"
              {...register("title")}
              className={errors.title ? "border-red-500" : ""}
              disabled={isUpdating}
            />
            {errors.title && (
              <p className="text-sm text-red-500 mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Description Field */}
          <div>
            <Label htmlFor="description" className="mb-2 block">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Add a short description"
              className={`resize-none ${
                errors.description ? "border-red-500" : ""
              }`}
              rows={4}
              {...register("description")}
              disabled={isUpdating}
            />
            <div className="text-right text-xs text-gray-500 mt-1">
              {descriptionLength}/500 characters
            </div>
            {errors.description && (
              <p className="text-sm text-red-500 mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <DialogFooter className="gap-2 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="flex-1"
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-orange-500 hover:bg-orange-600"
              disabled={isUpdating}
            >
              {isUpdating ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default VideoEditFrom;