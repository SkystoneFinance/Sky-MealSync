import { useRef, useState } from "react";

import toast from "react-hot-toast";

import { Camera } from "lucide-react";

import { useUploadDishPhoto } from "../../hooks/useFoodOptions";
import { apiErrorMessage } from "../../utils/mealPlanDates";

import { Button } from "../ui";

import { compressPhoto } from "./compressPhoto";

// Opens the phone's rear camera (or a file picker on desktop), shrinks the
// photo and saves it as our own photo for this dish name.
export default function TakePhotoButton({
  dish,
  retake = false,
  variant = "primary",
  size = "sm",
}: {
  dish: { id: string; name: string };
  retake?: boolean;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
}) {
  const input = useRef<HTMLInputElement>(null);
  const upload = useUploadDishPhoto();
  const [preparing, setPreparing] = useState(false);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;

    try {
      setPreparing(true);
      const photo = await compressPhoto(file);
      setPreparing(false);

      await upload.mutateAsync({ id: dish.id, photo });
      toast.success(`Photo saved for ${dish.name}.`);
    } catch (error) {
      toast.error(
        error instanceof Error && !("response" in error)
          ? error.message
          : apiErrorMessage(error, "Couldn't save the photo.")
      );
    } finally {
      setPreparing(false);
      if (input.current) input.current.value = "";
    }
  };

  return (
    <>
      <input
        ref={input}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(event) => handleFile(event.target.files?.[0])}
      />
      <Button
        variant={variant}
        size={size}
        icon={<Camera size={15} />}
        loading={preparing || upload.isPending}
        onClick={() => input.current?.click()}
        aria-label={`${retake ? "Retake" : "Take"} photo of ${dish.name}`}
      >
        {retake ? "Retake" : "Take photo"}
      </Button>
    </>
  );
}
