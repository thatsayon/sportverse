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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const videoEditSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.string().min(1, "Category is required"),
  subcategory: z.string().min(1, "Subcategory is required"),
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
      category: "",
      subcategory: "",
      description: "",
    },
  });

  useEffect(() => {
    if (open && id) {
      fetchVideoData(id);
    }
  }, [open, id]);

  const fetchVideoData = async (videoId: string) => {
    try {
      //   const response = await fetch(`/api/videos/${videoId}`);
      //   const data = await response.json();

      //   reset({
      //     title: data.title || '',
      //     category: data.category || '',
      //     subcategory: data.subcategory || '',
      //     description: data.description || '',
      //   });
      reset();
    } catch (error) {
      console.error("Error fetching video data:", error);
    }
  };

  const onSubmit = async (data: VideoEditFormData) => {
    try {
      //   const response = await fetch(`/api/videos/${id}`, {
      //     method: 'PUT',
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //     body: JSON.stringify(data),
      //   });

      //   if (response.ok) {
      //     setOpen(false);
      //     reset();
      //   }

      toast.success("Video Updated!!");
      setOpen(false);
    } catch (error) {
      console.error("Error updating video:", error);
    }
  };

  const handleCancel = () => {
    setOpen(false);
    reset();
  };

  const descriptionLength = watch("description")?.length || 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Video</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="mb-3" htmlFor="title">
              Title
            </Label>{" "}
            <Input
              id="title"
              placeholder="Title"
              {...register("title")}
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-sm text-red-500 mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <Label className="mb-3" htmlFor="category">
              Category
            </Label>{" "}
            <Select onValueChange={(value) => setValue("category", value)}>
              <SelectTrigger
                className={`${
                  errors.subcategory ? "border-red-500" : ""
                } w-full`}
              >
                <SelectValue placeholder="Sports" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sports">Sports</SelectItem>
                <SelectItem value="entertainment">Entertainment</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="lifestyle">Lifestyle</SelectItem>
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-red-500 mt-1">
                {errors.category.message}
              </p>
            )}
          </div>

          <div>
            <Label className="mb-3" htmlFor="subcategory">
              Subcategory
            </Label>{" "}
            <Select onValueChange={(value) => setValue("subcategory", value)}>
              <SelectTrigger
                className={`${
                  errors.subcategory ? "border-red-500" : ""
                } w-full`}
              >
                <SelectValue placeholder="Consumer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="consumer">Consumer</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="amateur">Amateur</SelectItem>
                <SelectItem value="competitive">Competitive</SelectItem>
              </SelectContent>
            </Select>
            {errors.subcategory && (
              <p className="text-sm text-red-500 mt-1">
                {errors.subcategory.message}
              </p>
            )}
          </div>

          <div>
            <Label className="mb-3" htmlFor="description">
              Description
            </Label>{" "}
            <Textarea
              id="description"
              placeholder="Add a short description"
              className={`resize-none ${
                errors.description ? "border-red-500" : ""
              }`}
              rows={3}
              {...register("description")}
            />
            <div className="text-right text-xs text-gray-500 mt-1">
              {descriptionLength} Characters max
            </div>
            {errors.description && (
              <p className="text-sm text-red-500 mt-1">
                {errors.description.message}
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit(onSubmit)}
            className="flex-1 bg-orange-500 hover:bg-orange-600"
          >
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VideoEditFrom;
