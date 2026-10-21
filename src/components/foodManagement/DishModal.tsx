import { useState, type FormEvent } from "react";
import toast from "react-hot-toast";

import { Button, Field, Input, Modal } from "../ui";
import DishThumbnail from "./DishThumbnail";

import {
  useCreateFoodOption,
  useUpdateFoodOption,
} from "../../hooks/useFoodOptions";
import { apiErrorMessage, isOwnDishPhoto } from "../../utils/mealPlanDates";

import type { FoodOption } from "../../types/foodOption";

interface Errors {
  name?: string;
  image?: string;
  mealDate?: string;
}

// The image is optional here: the server uses our own photo when it has one
// for this dish name, and asks for a URL otherwise.
function validate(name: string, _image: string, mealDate: string): Errors {
  const errors: Errors = {};

  if (name.trim().length < 2) {
    errors.name = "Enter a dish name of at least 2 characters.";
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(mealDate)) {
    errors.mealDate = "Pick a date.";
  }

  return errors;
}

// Add / edit dialog. Mount it fresh (conditional render) each time it opens
// so the form state initialises from `dish` / `defaultDate`.
export default function DishModal({
  dish,
  defaultDate,
  onClose,
}: {
  dish?: FoodOption | null;
  defaultDate: string;
  onClose: () => void;
}) {
  const isEdit = Boolean(dish);

  const [name, setName] = useState(dish?.name ?? "");
  const [image, setImage] = useState(dish?.image ?? "");
  const [mealDate, setMealDate] = useState(
    dish ? dish.mealDate.slice(0, 10) : defaultDate
  );
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  const createDish = useCreateFoodOption();
  const updateDish = useUpdateFoodOption();
  const saving = createDish.isPending || updateDish.isPending;

  const revalidate = (next: { name?: string; image?: string; mealDate?: string }) => {
    if (!submitted) return;
    setErrors(
      validate(next.name ?? name, next.image ?? image, next.mealDate ?? mealDate)
    );
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);

    const nextErrors = validate(name, image, mealDate);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const payload = {
      name: name.trim(),
      image: image.trim() || undefined,
      mealDate,
    };

    try {
      if (dish) {
        await updateDish.mutateAsync({ id: dish.id, data: payload });
        toast.success("Dish updated");
      } else {
        await createDish.mutateAsync(payload);
        toast.success("Dish added");
      }
      onClose();
    } catch (error) {
      toast.error(
        apiErrorMessage(
          error,
          isEdit ? "Couldn't update the dish." : "Couldn't add the dish."
        )
      );
    }
  };

  const previewUrl = image.trim();
  // Editing a dish that already uses our own photo (and keeping its name)
  const usesOwnPhoto =
    isOwnDishPhoto(dish?.image) && name.trim() === dish?.name.trim();

  return (
    <Modal
      open
      onClose={saving ? () => undefined : onClose}
      title={isEdit ? "Edit dish" : "Add dish"}
      description={
        isEdit
          ? "Update the dish details staff will see."
          : "Staff will be able to pick this dish once the week is published."
      }
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" form="dish-form" loading={saving}>
            Save
          </Button>
        </>
      }
    >
      <form
        id="dish-form"
        noValidate
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <Field label="Dish name" htmlFor="dish-name" error={errors.name}>
          <Input
            id="dish-name"
            autoFocus
            value={name}
            placeholder="e.g. Jollof rice & chicken"
            aria-invalid={Boolean(errors.name)}
            onChange={(event) => {
              setName(event.target.value);
              revalidate({ name: event.target.value });
            }}
          />
        </Field>

        {!usesOwnPhoto && (
        <Field
          label="Image URL"
          htmlFor="dish-image"
          error={errors.image}
          hint="Paste a link to a picture of the dish. Not needed if we already have our own photo of a dish with this name. On the day, you'll be asked to replace it with a real photo."
        >
          <Input
            id="dish-image"
            type="text"
            inputMode="url"
            value={image}
            placeholder="https://…"
            aria-invalid={Boolean(errors.image)}
            onChange={(event) => {
              setImage(event.target.value);
              revalidate({ image: event.target.value });
            }}
          />
        </Field>
        )}

        <div className="flex items-center gap-4 rounded-xl border border-zinc-200 bg-zinc-50 p-3">
          <DishThumbnail
            key={previewUrl}
            src={previewUrl}
            alt={name.trim() ? `Preview of ${name.trim()}` : "Image preview"}
            className="h-20 w-20 sm:h-24 sm:w-24"
          />
          <div className="min-w-0 text-sm">
            <p className="font-medium text-zinc-900">
              {usesOwnPhoto ? "Our photo" : "Preview"}
            </p>
            <p className="mt-0.5 text-zinc-500">
              {usesOwnPhoto
                ? "Used automatically every time this dish is on the menu."
                : previewUrl
                  ? "This is how the picture will appear."
                  : "A preview appears once you add an image URL."}
            </p>
          </div>
        </div>

        <Field label="Date" htmlFor="dish-date" error={errors.mealDate}>
          <Input
            id="dish-date"
            type="date"
            value={mealDate}
            aria-invalid={Boolean(errors.mealDate)}
            onChange={(event) => {
              setMealDate(event.target.value);
              revalidate({ mealDate: event.target.value });
            }}
          />
        </Field>
      </form>
    </Modal>
  );
}
