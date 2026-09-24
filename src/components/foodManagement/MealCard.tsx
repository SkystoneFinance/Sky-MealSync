import {
  CalendarDays,
  Edit3,
  Image as ImageIcon,
  Loader2,
  Power,
  Trash2,
} from "lucide-react";

import type { FoodOption } from "../../types/foodOption";

interface MealCardProps {
  meal: FoodOption;
  onEdit: () => void;
  onToggleStatus: () => void;
  onDelete: () => void;
  statusLoading: boolean;
  deleteLoading: boolean;
}

function formatDate(date: string) {
  return new Date(
    `${date.slice(0, 10)}T00:00:00`
  ).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function MealCard({
  meal,
  onEdit,
  onToggleStatus,
  onDelete,
  statusLoading,
  deleteLoading,
}: MealCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:shadow-md">
      {/* IMAGE */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        {meal.image ? (
          <img
            src={meal.image}
            alt={meal.name}
            className="h-full w-full object-cover transition duration-300 hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-400">
            <ImageIcon size={32} />
          </div>
        )}

        {/* STATUS */}
        <div className="absolute right-3 top-3">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-semibold shadow-sm ${
              meal.isActive
                ? "text-green-700"
                : "text-slate-500"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                meal.isActive
                  ? "bg-green-500"
                  : "bg-slate-400"
              }`}
            />

            {meal.isActive
              ? "Active"
              : "Inactive"}
          </span>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-base font-bold text-slate-900">
              {meal.name}
            </h3>

            <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
              <CalendarDays size={15} />

              {formatDate(meal.mealDate)}
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="mt-5 grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            <Edit3 size={15} />
            Edit
          </button>

          <button
            type="button"
            onClick={onToggleStatus}
            disabled={statusLoading}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          >
            {statusLoading ? (
              <Loader2
                size={15}
                className="animate-spin"
              />
            ) : (
              <Power size={15} />
            )}

            {meal.isActive
              ? "Disable"
              : "Activate"}
          </button>

          <button
            type="button"
            onClick={onDelete}
            disabled={deleteLoading}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-red-100 px-3 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
          >
            {deleteLoading ? (
              <Loader2
                size={15}
                className="animate-spin"
              />
            ) : (
              <Trash2 size={15} />
            )}

            Delete
          </button>
        </div>
      </div>
    </div>
  );
}