import { Camera, CircleCheck } from "lucide-react";

import { useDishPhotoStatus } from "../../hooks/useFoodOptions";

import { Badge, Card } from "../ui";

import DishThumbnail from "./DishThumbnail";
import TakePhotoButton from "./TakePhotoButton";

// On the day: ask the chef to photograph each of today's dishes, replacing
// the pasted internet images. Shows overall progress of the switch-over.
export default function TodayPhotos() {
  const { data } = useDishPhotoStatus();

  if (!data) return null;

  const missing = data.today.filter((d) => !d.hasOwnPhoto);
  const { total, ownPhotos } = data.upcoming;
  const percent = total ? Math.round((ownPhotos / total) * 100) : 100;

  // Nothing to ask for and nothing left to replace
  if (!missing.length && ownPhotos === total) return null;

  return (
    <Card>
      <div className="flex flex-col gap-1 px-5 pt-4 pb-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Camera size={18} className="text-brand-600" />
          <h2 className="font-semibold text-zinc-900">
            {missing.length ? "Photograph today's dishes" : "Today's dishes are photographed"}
          </h2>
        </div>
        <p className="tabular text-sm text-zinc-500">
          {ownPhotos} of {total} upcoming dishes use our photos
        </p>
      </div>

      <div className="mx-5 mb-4 h-1.5 overflow-hidden rounded-full bg-zinc-100">
        <div
          className="h-full rounded-full bg-brand-600 transition-all"
          style={{ width: `${percent}%` }}
        />
      </div>

      {data.today.length > 0 && (
        <ul className="divide-y divide-zinc-100 border-t border-zinc-100">
          {data.today.map((dish) => (
            <li key={dish.id} className="flex items-center gap-3 px-5 py-3">
              <DishThumbnail key={dish.image} src={dish.image} alt={dish.name} className="h-11 w-11" />
              <p className="min-w-0 flex-1 truncate font-medium text-zinc-900">{dish.name}</p>
              {dish.hasOwnPhoto ? (
                <div className="flex items-center gap-2">
                  <Badge tone="success" icon={<CircleCheck size={12} />}>Our photo</Badge>
                  <TakePhotoButton dish={dish} retake variant="ghost" />
                </div>
              ) : (
                <TakePhotoButton dish={dish} />
              )}
            </li>
          ))}
        </ul>
      )}

      {missing.length > 0 && (
        <p className="border-t border-zinc-100 bg-zinc-50/60 px-5 py-3 text-xs text-zinc-500">
          Take the photo once the food is plated. It's saved for this dish name and used every
          time it's on the menu, replacing the internet image.
        </p>
      )}
    </Card>
  );
}
