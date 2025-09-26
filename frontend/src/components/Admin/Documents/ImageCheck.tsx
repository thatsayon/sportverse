import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ImageViewerProps {
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
}

// Full screen image viewer component
export const ImageViewer: React.FC<ImageViewerProps> = ({
  src,
  alt,
  isOpen,
  onClose,
}) => {
  const [imageError, setImageError] = useState<boolean>(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
      <div className="relative w-full h-full flex items-center justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={onClose}
          className="absolute top-4 right-4 bg-white/10 border-white/20 text-white hover:bg-white/20 z-10"
        >
          <X className="h-4 w-4" />
        </Button>
        {imageError ? (
          <div className="text-white text-center">
            <p>Failed to load image</p>
            <p className="text-sm text-gray-300 mt-2">URL: {src}</p>
          </div>
        ) : (
          <div className="relative max-w-[90vw] max-h-[90vh] w-full h-full">
            <Image
              src={src}
              alt={alt}
              fill
              className="object-contain rounded-lg"
              sizes="90vw"
              onError={() => setImageError(true)}
              unoptimized={true} // Add this temporarily to bypass Next.js optimization
            />
          </div>
        )}
      </div>
    </div>
  );
};