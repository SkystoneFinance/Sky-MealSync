import { Link } from "react-router-dom";

import { ArrowRight, Clock3, UtensilsCrossed } from "lucide-react";

import { Avatar, Card, CardHeader, EmptyState, Spinner } from "../ui";
import type { RecentAttendance as Attendance } from "../../types/dashboard";
import { dishImageUrl, formatTimestamp } from "../../utils/mealPlanDates";

// "Just now", "12 min ago", "3 h ago" for today's servings, otherwise "22 Oct, 14:05".
function formatServedAt(iso: string, now: number) {
  const minutes = Math.floor((now - new Date(iso).getTime()) / 60_000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (minutes < 12 * 60) return `${Math.floor(minutes / 60)} h ago`;

  return formatTimestamp(iso);
}

interface Props {
  loading: boolean;
  error: boolean;
  data: Attendance[];
  now: number;
}

function Dish({ meal }: { meal: Attendance["meal"] }) {
  return (
    <div className="hidden min-w-0 flex-1 items-center gap-2.5 sm:flex">
      {meal?.image ? (
        <img
          src={dishImageUrl(meal.image)}
          alt=""
          loading="lazy"
          className="h-8 w-8 shrink-0 rounded-md bg-zinc-100 object-cover"
        />
      ) : (
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-zinc-100 text-zinc-400">
          <UtensilsCrossed size={14} />
        </span>
      )}
      <p className="truncate text-sm text-zinc-700">{meal?.name ?? "—"}</p>
    </div>
  );
}

export default function RecentAttendance({ loading, error, data, now }: Props) {
  let body;

  if (loading) {
    body = (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    );
  } else if (error) {
    body = (
      <EmptyState
        icon={<Clock3 size={20} />}
        title="Couldn't load recent servings"
        description="Try refreshing the page in a moment."
      />
    );
  } else if (data.length === 0) {
    body = (
      <EmptyState
        icon={<Clock3 size={20} />}
        title="No meals served yet"
        description="Servings appear here as staff are checked in."
      />
    );
  } else {
    body = (
      <ul className="divide-y divide-zinc-100">
        {data.map((attendance) => {
          const name = `${attendance.staff.firstName} ${attendance.staff.lastName}`;

          return (
            <li key={attendance.id} className="flex items-center gap-3 px-5 py-3">
              <Avatar name={name} size="sm" />
              <div className="min-w-0 flex-1 sm:flex-none sm:basis-56">
                <p className="truncate text-sm font-medium text-zinc-900">
                  {name}
                </p>
                <p className="truncate text-xs text-zinc-500">
                  {attendance.staff.department}
                  {/* On phones the dish goes under the name */}
                  {attendance.meal && (
                    <span className="sm:hidden"> · {attendance.meal.name}</span>
                  )}
                </p>
              </div>
              <Dish meal={attendance.meal} />
              <time
                dateTime={attendance.scannedAt}
                title={formatTimestamp(attendance.scannedAt)}
                className="shrink-0 text-xs text-zinc-500 tabular"
              >
                {formatServedAt(attendance.scannedAt, now)}
              </time>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <Card>
      <CardHeader
        title="Recent servings"
        description="Latest meals served today"
        actions={
          <Link
            to="/check-meal"
            className="inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
          >
            View all
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        }
      />
      {body}
    </Card>
  );
}
