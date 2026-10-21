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
