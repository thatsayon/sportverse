import { ZoomIn } from "lucide-react";
import Image from "next/image";
import { ImageViewer } from "./ImageCheck";
import { useState } from "react";

// Image component with click to zoom
export const ClickableImage: React.FC<{
  src: string | null;
  alt: string;
  className?: string;
}> = ({ src, alt, className = "" }) => {
  const [isImageViewerOpen, setIsImageViewerOpen] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);
  const [imageLoading, setImageLoading] = useState<boolean>(true);
 
  if (!src || src.trim() === '') {
    return (
      <div
        className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`}
      >
        <span className="text-gray-400 text-sm">No image</span>
      </div>
    );
  }

  if (imageError) {
    return (
      <div
        className={`bg-red-50 border border-red-200 rounded-lg flex items-center justify-center ${className}`}
      >
        <span className="text-red-400 text-sm">Failed to load image</span>
      </div>
    );
  }

  return (
    <>
      <div
        className={`relative cursor-pointer group overflow-hidden rounded-lg border ${className}`}
        onClick={() => setIsImageViewerOpen(true)}
      >
        {imageLoading && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
            <span className="text-gray-400 text-sm">Loading...</span>
          </div>
        )}
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
          onLoad={() => setImageLoading(false)}
          onError={() => {
            setImageError(true);
            setImageLoading(false);
          }}
          unoptimized={true} // Add this temporarily to bypass Next.js optimization
        />
        {!imageLoading && (
          <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
            <ZoomIn className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </div>
        )}
      </div>
      <ImageViewer
        src={src}
        alt={alt}
        isOpen={isImageViewerOpen}
        onClose={() => setIsImageViewerOpen(false)}
      />
    </>
  );
};