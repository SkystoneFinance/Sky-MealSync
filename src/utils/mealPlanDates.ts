// Display helpers for the weekly meal plan.
// Times are always shown in Africa/Lagos so everyone sees the same deadline.

const TIME_ZONE = "Africa/Lagos";

// "YYYY-MM-DD" → "Monday 26 Oct"
export function formatDay(
  dateKey: string,
  options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "numeric",
    month: "short",
  }
) {
  return new Date(`${dateKey}T00:00:00.000Z`).toLocaleDateString(
    "en-GB",
    { ...options, timeZone: "UTC" }
  );
}

// ISO timestamp → "Thursday 22 Oct, 5:00 pm"
export function formatDeadline(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: TIME_ZONE,
  });
}

// ISO timestamp → "22 Oct, 14:05"
export function formatTimestamp(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: TIME_ZONE,
  });
}

export function apiErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again."
) {
  const message = (
    error as { response?: { data?: { message?: string } } }
  )?.response?.data?.message;

  return message ?? fallback;
}

// Move a "YYYY-MM-DD" Monday by whole weeks
export function shiftWeek(weekStart: string, weeks: number) {
  const date = new Date(`${weekStart}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + weeks * 7);
  return date.toISOString().slice(0, 10);
}

export function weeksBetween(from: string, to: string) {
  const ms =
    new Date(`${to}T00:00:00.000Z`).getTime() -
    new Date(`${from}T00:00:00.000Z`).getTime();
  return Math.round(ms / (7 * 24 * 60 * 60 * 1000));
}

// Label a week relative to next week: "This week", "Next week", "In 2 weeks", "3 weeks ago"
export function relativeWeekLabel(weekStart: string, nextWeekStart: string) {
  const offset = weeksBetween(nextWeekStart, weekStart) + 1; // 0 = this week

  if (offset === 0) return "This week";
  if (offset === 1) return "Next week";
  if (offset === -1) return "Last week";
  if (offset > 1) return `In ${offset} weeks`;
  return `${-offset} weeks ago`;
}

// "Week of 26 Oct" / "26–30 Oct"
export function weekRangeLabel(weekStart: string) {
  const start = new Date(`${weekStart}T00:00:00.000Z`);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 4);

  const day = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", timeZone: "UTC" });
  const month = (d: Date) => d.toLocaleDateString("en-GB", { month: "short", timeZone: "UTC" });

  return month(start) === month(end)
    ? `${day(start)}–${day(end)} ${month(end)}`
    : `${day(start)} ${month(start)} – ${day(end)} ${month(end)}`;
}

// Dish images are either pasted outside URLs or our own photos served by
// the API (stored as "/api/v1/dish-photos/…"). Turn the latter into a full URL.
const API_ORIGIN = (() => {
  try {
    return new URL(import.meta.env.VITE_API_URL).origin;
  } catch {
    return "";
  }
})();

export function dishImageUrl(image: string | null | undefined) {
  if (!image) return "";
  return image.startsWith("/api/") ? `${API_ORIGIN}${image}` : image;
}

export function isOwnDishPhoto(image: string | null | undefined) {
  return Boolean(image?.startsWith("/api/v1/dish-photos/"));
}

// Today's date in Lagos as "YYYY-MM-DD"
export function lagosTodayKey() {
  return new Date().toLocaleDateString("en-CA", { timeZone: TIME_ZONE });
}
