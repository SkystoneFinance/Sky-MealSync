import { useState } from "react";

import { Link } from "react-router-dom";

import toast from "react-hot-toast";

import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardCopy,
  Download,
  Loader2,
  Send,
} from "lucide-react";

import { useAuth } from "../../hooks/useAuth";

import {
  useChefPlanStatus,
  useMealPrepSummary,
  useMenuWeek,
  usePublishWeek,
  useSetClosedDays,
} from "../../hooks/useMealPlan";

import { mealPlanService } from "../../services/mealPlan.service";

import type {
  MealPrepSummary,
  MenuWeek,
} from "../../types/mealPlan";

import {
  apiErrorMessage,
  formatDay,
  formatDeadline,
  formatTimestamp,
} from "../../utils/mealPlanDates";

function shiftWeek(weekStart: string, weeks: number) {
  const date = new Date(`${weekStart}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + weeks * 7);
  return date.toISOString().slice(0, 10);
}

export default function WeeklyPlanning() {
  const { data: status, isLoading } = useChefPlanStatus();
  const [offset, setOffset] = useState(0);

  if (isLoading || !status) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="animate-spin" size={30} />
      </div>
    );
  }

  const weekStart = shiftWeek(status.weekStart, offset);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Weekly Planning
            {offset === 0 && " · next week"}
          </p>

          <h1 className="mt-1 text-2xl font-bold text-gray-900">
            Week of {formatDay(weekStart, { day: "numeric", month: "long", year: "numeric" })}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Previous week"
            onClick={() => setOffset((v) => v - 1)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50"
          >
            <ChevronLeft size={18} />
          </button>

          <button
            type="button"
            disabled={offset === 0}
            onClick={() => setOffset(0)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
          >
            Next week
          </button>

          <button
            type="button"
            aria-label="Following week"
            onClick={() => setOffset((v) => v + 1)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <WeekPanel key={weekStart} weekStart={weekStart} />
    </div>
  );
}

function WeekPanel({ weekStart }: { weekStart: string }) {
  const { data: week, isLoading, isError } = useMenuWeek(weekStart);

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="animate-spin text-gray-400" size={24} />
      </div>
    );
  }

  if (isError || !week) {
    return (
      <div className="rounded-2xl bg-red-50 p-6 text-sm text-red-600">
        Unable to load this week.
      </div>
    );
  }

  return (
    <>
      <StatusCard week={week} />

      {week.isPublished ? (
        <SummarySection week={week} />
      ) : (
        <DraftSection week={week} />
      )}
    </>
  );
}

// ==========================================
// STATUS
// ==========================================

function StatusCard({ week }: { week: MenuWeek }) {
  const stage = week.isPublished
    ? week.isClosed
      ? { label: "Confirmed", tone: "bg-green-100 text-green-800" }
      : { label: "Open for selection", tone: "bg-blue-100 text-blue-800" }
    : week.isClosed
      ? { label: "Never published", tone: "bg-slate-200 text-slate-700" }
      : { label: "Draft", tone: "bg-amber-100 text-amber-800" };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${stage.tone}`}>
          {stage.label}
        </span>

        {week.publishedLate && (
          <span className="flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
            <AlertTriangle size={13} />
            Published late
          </span>
        )}
      </div>

      <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-3">
        <div>
          <dt className="text-slate-500">Publish by</dt>
          <dd className="font-semibold text-slate-900">
            {formatDeadline(week.publishDueAt)}
          </dd>
        </div>

        <div>
          <dt className="text-slate-500">Published</dt>
          <dd className="font-semibold text-slate-900">
            {week.publishedAt ? formatTimestamp(week.publishedAt) : "Not yet"}
          </dd>
        </div>

        <div>
          <dt className="text-slate-500">Staff deadline</dt>
          <dd className="font-semibold text-slate-900">
            {formatDeadline(week.deadline)}
          </dd>
        </div>
      </dl>
    </div>
  );
}

// ==========================================
// DRAFT: CLOSED DAYS + PUBLISH
// ==========================================

function DraftSection({ week }: { week: MenuWeek }) {
  const { user } = useAuth();
  const setClosedDays = useSetClosedDays(week.weekStart);
  const publish = usePublishWeek(week.weekStart);

  const closed = week.days.filter((d) => d.closed).map((d) => d.date);

  const toggleClosed = (date: string) => {
    const next = closed.includes(date)
      ? closed.filter((d) => d !== date)
      : [...closed, date];

    setClosedDays.mutate(next, {
      onError: (error) => toast.error(apiErrorMessage(error)),
    });
  };

  const handlePublish = () => {
    if (
      !window.confirm(
        "Publish this menu? Staff will be asked to choose their meals. Closed days can't be changed afterwards."
      )
    ) {
      return;
    }

    publish.mutate(undefined, {
      onSuccess: (res) => toast.success(res.message ?? "Menu published."),
      onError: (error) => toast.error(apiErrorMessage(error)),
    });
  };

  if (week.isClosed) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
        This week was never published, so no meals were planned.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-bold text-slate-900">Menu for the week</h2>

          {user?.role === "ADMIN" && (
            <Link
              to="/food-management"
              className="text-sm font-semibold text-[#B10F16] hover:underline"
            >
              Add or edit dishes in Food Management →
            </Link>
          )}
        </div>

        <ul className="mt-4 divide-y divide-slate-100">
          {week.days.map((day) => {
            const active = day.options.filter((o) => o.isActive !== false);

            return (
              <li
                key={day.date}
                className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold text-slate-900">
                    {formatDay(day.date)}
                  </p>

                  <p className="text-sm text-slate-500">
                    {day.closed
                      ? "Kitchen closed"
                      : active.length
                        ? active.map((o) => o.name).join(" · ")
                        : "⚠ No dishes yet"}
                  </p>
                </div>

                <label className="flex items-center gap-2 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    checked={day.closed}
                    disabled={setClosedDays.isPending}
                    onChange={() => toggleClosed(day.date)}
                    className="h-4 w-4 accent-[#B10F16]"
                  />
                  Kitchen closed
                </label>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handlePublish}
          disabled={publish.isPending}
          className="flex items-center gap-2 rounded-xl bg-[#B10F16] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#920c12] disabled:opacity-50"
        >
          {publish.isPending ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Send size={18} />
          )}
          Publish menu to staff
        </button>
      </div>
    </div>
  );
}

// ==========================================
// PUBLISHED: ANNOUNCEMENT + SUMMARY
// ==========================================

function SummarySection({ week }: { week: MenuWeek }) {
  const { data: summary, isLoading } = useMealPrepSummary(week.weekStart);
  const [downloading, setDownloading] = useState(false);

  const handleExport = async () => {
    try {
      setDownloading(true);

      const blob = await mealPlanService.exportSummary(week.weekStart);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `MealSync-Meal-Prep-${week.weekStart}.xlsx`;
      link.click();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error(apiErrorMessage(error, "Export failed."));
    } finally {
      setDownloading(false);
    }
  };

  if (isLoading || !summary) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="animate-spin text-gray-400" size={24} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!week.isClosed && <Announcement week={week} />}

      {/* HEADLINE NUMBERS */}

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Submitted" value={`${summary.totals.submitted} / ${summary.totals.activeStaff}`} />
        <Stat label="Did not submit" value={summary.totals.notSubmitted} />
        <Stat
          label="Status"
          value={summary.isConfirmed ? "Confirmed" : "Provisional"}
          hint={summary.isConfirmed ? undefined : "Numbers can change until selection closes"}
        />
      </div>

      {/* PER DAY */}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-bold text-slate-900">Meal Preparation Summary</h2>

          <button
            type="button"
            onClick={handleExport}
            disabled={downloading}
            className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            {downloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            Excel
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {summary.days.map((day) => (
            <DaySummary key={day.date} day={day} />
          ))}
        </div>
      </div>

      <StaffLists summary={summary} />
    </div>
  );
}

function Announcement({ week }: { week: MenuWeek }) {
  const text =
    `🍽️ Next week's menu (week of ${formatDay(week.weekStart, { day: "numeric", month: "long" })}) is now on MealSync.\n` +
    `Please choose your meals, or "No meal required", by ${formatDeadline(week.deadline)}.\n` +
    `If you don't submit, no meals will be booked for you next week.`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Announcement copied. Paste it into WhatsApp.");
    } catch {
      toast.error("Couldn't copy. Select the text and copy it manually.");
    }
  };

  return (
    <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-bold text-blue-900">Let staff know</h2>
          <p className="mt-2 whitespace-pre-line text-sm text-blue-900/80">{text}</p>
        </div>

        <button
          type="button"
          onClick={copy}
          className="flex shrink-0 items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <ClipboardCopy size={16} />
          Copy message
        </button>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

function DaySummary({ day }: { day: MealPrepSummary["days"][number] }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
      <p className="font-semibold text-slate-900">{formatDay(day.date)}</p>

      {day.closed ? (
        <p className="mt-2 text-sm text-slate-500">Kitchen closed</p>
      ) : (
        <>
          <ul className="mt-3 space-y-1 text-sm">
            {day.options.map((o) => (
              <li key={o.id} className="flex justify-between gap-2">
                <span className="text-slate-700">
                  {o.name}
                  {!o.isActive && <span className="text-xs text-slate-400"> (disabled)</span>}
                </span>
                <span className="font-semibold text-slate-900">{o.count}</span>
              </li>
            ))}
          </ul>

          <div className="mt-3 space-y-1 border-t border-slate-200 pt-3 text-sm">
            <p className="flex justify-between font-bold text-[#B10F16]">
              <span>Meals required</span>
              <span>{day.mealsRequired}</span>
            </p>
            <p className="flex justify-between text-slate-600">
              <span>No meal required</span>
              <span>{day.noMeal}</span>
            </p>
            <p className="flex justify-between text-slate-600">
              <span>Did not submit</span>
              <span>{day.notSubmitted}</span>
            </p>
          </div>
        </>
      )}
    </div>
  );
}

function StaffLists({ summary }: { summary: MealPrepSummary }) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="flex items-center gap-2 font-bold text-slate-900">
          <CheckCircle2 size={18} className="text-green-600" />
          Submitted ({summary.submitted.length})
        </h2>

        <div className="mt-3 max-h-96 overflow-y-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase text-slate-400">
              <tr>
                <th className="py-2">Name</th>
                <th className="py-2">Submitted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {summary.submitted.map((s) => (
                <tr key={s.id}>
                  <td className="py-2">
                    <p className="font-medium text-slate-900">{s.firstName} {s.lastName}</p>
                    <p className="text-xs text-slate-500">{s.staffNumber} · {s.department}</p>
                  </td>
                  <td className="py-2 text-slate-700">
                    {formatTimestamp(s.submittedAt)}
                    {s.edited && (
                      <p className="text-xs text-slate-400">edited {formatTimestamp(s.updatedAt)}</p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!summary.submitted.length && (
            <p className="py-4 text-sm text-slate-500">No submissions yet.</p>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="flex items-center gap-2 font-bold text-slate-900">
          <AlertTriangle size={18} className="text-amber-500" />
          Did not submit ({summary.notSubmitted.length})
        </h2>

        <ul className="mt-3 max-h-96 divide-y divide-slate-100 overflow-y-auto text-sm">
          {summary.notSubmitted.map((s) => (
            <li key={s.id} className="flex items-center justify-between gap-2 py-2">
              <div>
                <p className="font-medium text-slate-900">{s.firstName} {s.lastName}</p>
                <p className="text-xs text-slate-500">{s.staffNumber} · {s.department}</p>
              </div>

              {!s.hasActivatedAccount && (
                <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                  Never activated
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
