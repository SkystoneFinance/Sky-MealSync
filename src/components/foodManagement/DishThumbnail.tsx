import { useState } from "react";
import { ImageOff } from "lucide-react";

import { cn } from "../ui";
import { dishImageUrl } from "../../utils/mealPlanDates";

// Rounded, cropped dish image that falls back to a neutral tile when the
// URL is empty or fails to load. Remount with `key={src}` to retry on change.
export default function DishThumbnail({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={cn(
          "flex shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-400 ring-1 ring-zinc-200 ring-inset",
          className
        )}
        role="img"
        aria-label={alt}
      >
        <ImageOff size={18} />
      </div>
    );
  }

  return (
    <img
      src={dishImageUrl(src)}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={cn(
        "shrink-0 rounded-lg bg-zinc-100 object-cover ring-1 ring-zinc-200",
        className
      )}
    />
  );
}
