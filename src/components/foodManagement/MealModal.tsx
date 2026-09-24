import {
  Loader2,
  X,
} from "lucide-react";

import type { FoodOption } from "../../types/foodOption";

interface MealModalProps {
  editingMeal: FoodOption | null;
  name: string;
  image: string;
  mealDate: string;
  setName: (value: string) => void;
  setImage: (value: string) => void;
  setMealDate: (value: string) => void;
  onClose: () => void;
  onSubmit: (
    event: React.FormEvent<HTMLFormElement>
  ) => void;
  loading: boolean;
}

export default function MealModal({
  editingMeal,
  name,
  image,
  mealDate,
  setName,
  setImage,
  setMealDate,
  onClose,
  onSubmit,
  loading,
}: MealModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white shadow-2xl">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {editingMeal
                ? "Edit Meal"
                : "Add Meal"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {editingMeal
                ? "Update the meal details below."
                : "Add a meal to the staff menu."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
          >
            <X size={19} />
          </button>
        </div>

        {/* FORM */}
        <form
          onSubmit={onSubmit}
          className="space-y-5 p-6"
        >
          {/* NAME */}
          <div>
            <label className="text-sm font-semibold text-slate-700">
              Meal Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder="e.g. Jollof Rice & Chicken"
              required
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#B10F16] focus:bg-white"
            />
          </div>

          {/* IMAGE */}
          <div>
            <label className="text-sm font-semibold text-slate-700">
              Meal Image URL
            </label>

            <input
              type="url"
              value={image}
              onChange={(event) =>
                setImage(event.target.value)
              }
              placeholder="https://example.com/meal.jpg"
              required
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#B10F16] focus:bg-white"
            />

            <p className="mt-1.5 text-xs text-slate-400">
              Enter a publicly accessible image URL.
            </p>
          </div>

          {/* IMAGE PREVIEW */}
          {image && (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
              <img
                src={image}
                alt="Meal preview"
                className="h-48 w-full object-cover"
                onError={(event) => {
                  event.currentTarget.style.display =
                    "none";
                }}
              />
            </div>
          )}

          {/* DATE */}
          <div>
            <label className="text-sm font-semibold text-slate-700">
              Meal Date
            </label>

            <input
              type="date"
              value={mealDate}
              onChange={(event) =>
                setMealDate(event.target.value)
              }
              required
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#B10F16] focus:bg-white"
            />
          </div>

          {/* ACTIONS */}
          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                loading ||
                !name.trim() ||
                !image.trim() ||
                !mealDate
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#B10F16] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#920C12] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading && (
                <Loader2
                  size={17}
                  className="animate-spin"
                />
              )}

              {editingMeal
                ? "Save Changes"
                : "Add Meal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}