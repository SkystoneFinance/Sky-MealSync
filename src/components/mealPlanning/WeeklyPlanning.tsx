import { useState } from "react";

import { Link } from "react-router-dom";

import toast from "react-hot-toast";

import {
  CircleCheck,
  CircleDashed,
  Copy,
  Download,
  Send,
  Store,
  TriangleAlert,
  UsersRound,
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
  relativeWeekLabel,
  shiftWeek,
  weekRangeLabel,
  weeksBetween,
} from "../../utils/mealPlanDates";

import {
  Avatar,
  Badge,
  Button,
  Callout,
  Card,
  CardHeader,
  EmptyState,
  PageHeader,
  PageLoader,
  StatCard,
  WeekSwitcher,
  buttonStyles,
  cn,
} from "../ui";

const HISTORY_WEEKS = 26;

export default function WeeklyPlanning() {
  const { data: status, isLoading } = useChefPlanStatus();
  const [week, setWeek] = useState<string>();

  if (isLoading || !status) {
    return <PageLoader />;
  }

  const nextWeek = status.weekStart;
  const selected = week ?? nextWeek;
  const offset = weeksBetween(nextWeek, selected);

  return (
    <div>
      <PageHeader
        title="Weekly planning"
        description="Publish the menu up to two weeks ahead and see what to cook."
        actions={
          <WeekSwitcher
            label={weekRangeLabel(selected)}
            sublabel={relativeWeekLabel(selected, nextWeek)}
            onPrevious={() => setWeek(shiftWeek(selected, -1))}
            onNext={() => setWeek(shiftWeek(selected, 1))}
            canPrevious={offset > -HISTORY_WEEKS}
            canNext={offset < 1}
          />
        }
      />

      <WeekPanel key={selected} weekStart={selected} />
    </div>
  );
}

function WeekPanel({ weekStart }: { weekStart: string }) {
  const { data: week, isLoading, isError } = useMenuWeek(weekStart);

  if (isLoading) return <PageLoader />;

  if (isError || !week) {
    return (
      <Callout tone="danger" title="We couldn't load this week">
        Check your connection and try again.
      </Callout>
    );
  }

  const isDraft = !week.isPublished && week.isPlanningWeek && !week.isClosed;

  return (
    <div className="space-y-6">
      <StatusStrip week={week} />
      {isDraft ? <DraftWeek week={week} /> : <SummaryWeek week={week} />}
    </div>
  );
}

// ==========================================
// STATUS
// ==========================================

function StatusStrip({ week }: { week: MenuWeek }) {
  const stage = week.isPublished
    ? week.isClosed
      ? <Badge tone="success" icon={<CircleCheck size={12} />}>Confirmed</Badge>
      : <Badge tone="info" icon={<CircleDashed size={12} />}>Open for choices</Badge>
    : week.isPlanningWeek && !week.isClosed
      ? <Badge tone="warning">Draft</Badge>
      : <Badge>Before weekly planning</Badge>;

  const items = week.isPublished || week.isPlanningWeek
    ? [
        { label: "Publish by", value: formatDeadline(week.publishDueAt) },
        {
          label: "Published",
          value: week.publishedAt ? formatTimestamp(week.publishedAt) : "Not yet",
          flag: week.publishedLate ? "Late" : undefined,
        },
        { label: "Staff deadline", value: formatDeadline(week.deadline) },
      ]
    : [];

  return (
    <Card className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-3">
        {stage}
        {!items.length && (
          <p className="text-sm text-zinc-500">Staff chose these meals day by day.</p>
        )}
      </div>
      {items.length > 0 && (
        <dl className="grid gap-4 text-sm sm:grid-cols-3 lg:gap-8">
          {items.map((item) => (
            <div key={item.label}>
              <dt className="text-zinc-500">{item.label}</dt>
              <dd className="mt-0.5 flex items-center gap-2 font-medium text-zinc-900">
                {item.value}
                {item.flag && <Badge tone="danger">{item.flag}</Badge>}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </Card>
  );
}

// ==========================================
// DRAFT: CLOSED DAYS + PUBLISH
// ==========================================

function DraftWeek({ week }: { week: MenuWeek }) {
  const { user } = useAuth();
  const setClosedDays = useSetClosedDays(week.weekStart);
  const publish = usePublishWeek(week.weekStart);

  const closed = week.days.filter((d) => d.closed).map((d) => d.date);
  const missing = week.days.filter(
    (d) => !d.closed && !d.options.some((o) => o.isActive !== false)
  );

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

  return (
    <Card>
      <CardHeader
        title="Menu"
        description="Check each day, mark any day the kitchen is closed, then publish."
        actions={
          user?.role === "ADMIN" && (
            <Link to="/food-management" className={buttonStyles("secondary", "sm")}>
              Edit dishes
            </Link>
          )
        }
      />

      <ul className="divide-y divide-zinc-100">
        {week.days.map((day) => {
          const active = day.options.filter((o) => o.isActive !== false);

          return (
            <li key={day.date} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="font-medium text-zinc-900">{formatDay(day.date)}</p>
                <p className={cn("mt-0.5 text-sm", !day.closed && !active.length ? "text-amber-700" : "text-zinc-500")}>
                  {day.closed
                    ? "Kitchen closed"
                    : active.length
                      ? active.map((o) => o.name).join(" · ")
                      : "No dishes yet"}
                </p>
              </div>

              <label className="flex shrink-0 cursor-pointer items-center gap-2.5 text-sm text-zinc-700">
                <input
                  type="checkbox"
                  checked={day.closed}
                  disabled={setClosedDays.isPending}
                  onChange={() => toggleClosed(day.date)}
                  className="h-4 w-4 rounded border-zinc-300 accent-brand-600"
                />
                Kitchen closed
              </label>
            </li>
          );
        })}
      </ul>

      <div className="flex flex-col gap-3 border-t border-zinc-100 bg-zinc-50/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-zinc-500">
          {missing.length
            ? `Add dishes for ${missing.map((d) => formatDay(d.date, { weekday: "long" })).join(", ")} or mark ${missing.length > 1 ? "them" : "it"} closed.`
            : `Due ${formatDeadline(week.publishDueAt)}. Staff then have until ${formatDeadline(week.deadline)}.`}
        </p>
        <Button
          icon={<Send size={16} />}
          onClick={handlePublish}
          loading={publish.isPending}
          disabled={missing.length > 0}
        >
          Publish menu
        </Button>
      </div>
    </Card>
  );
}

// ==========================================
// SUMMARY
// ==========================================

function SummaryWeek({ week }: { week: MenuWeek }) {
  const { data: summary, isLoading } = useMealPrepSummary(week.weekStart);
  const [downloading, setDownloading] = useState(false);

  if (isLoading || !summary) return <PageLoader />;

  if (!summary.isPublished && !summary.isLegacy) {
    return (
      <Card>
        <EmptyState
          icon={<Store size={20} />}
          title="No meals were planned this week"
          description="The menu wasn't published, so nobody chose meals."
        />
      </Card>
    );
  }

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

  const status = summary.isLegacy
    ? { value: "Final", hint: "Chosen day by day" }
    : summary.isConfirmed
      ? { value: "Confirmed", hint: "Selection has closed" }
      : { value: "Provisional", hint: `Final at ${formatDeadline(summary.hardClose)}` };

  return (
    <div className="space-y-6">
      {week.isPublished && !week.isClosed && <Announcement week={week} />}

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label={summary.isLegacy ? "Chose meals" : "Submitted"}
          value={`${summary.totals.submitted} / ${summary.totals.activeStaff}`}
          hint={`${Math.round((summary.totals.submitted / Math.max(summary.totals.activeStaff, 1)) * 100)}% of active staff`}
          icon={<UsersRound size={16} />}
        />
        <StatCard
          label={summary.isLegacy ? "Didn't choose" : "Did not submit"}
          value={summary.totals.notSubmitted}
          icon={<TriangleAlert size={16} />}
        />
        <StatCard label="Status" value={status.value} hint={status.hint} />
      </div>

      <Card>
        <CardHeader
          title="Meal preparation"
          description="What to cook each day."
          actions={
            <Button
              variant="secondary"
              size="sm"
              icon={<Download size={15} />}
              loading={downloading}
              onClick={handleExport}
            >
              Excel
            </Button>
          }
        />
        <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {summary.days.map((day) => (
            <DayColumn
              key={day.date}
              day={day}
              legacy={summary.isLegacy}
              activeStaff={summary.totals.activeStaff}
            />
          ))}
        </div>
      </Card>

      <StaffLists summary={summary} />
    </div>
  );
}

function DayColumn({
  day,
  legacy,
  activeStaff,
}: {
  day: MealPrepSummary["days"][number];
  legacy: boolean;
  activeStaff: number;
}) {
  // Older weeks were chosen day by day, so "didn't choose" is per day
  const didNotChoose = legacy
    ? Math.max(0, activeStaff - day.mealsRequired - day.noMeal)
    : day.notSubmitted;

  return (
    <div className="rounded-lg border border-zinc-200 p-4">
      <p className="text-sm font-semibold text-zinc-900">{formatDay(day.date, { weekday: "long" })}</p>
      <p className="text-xs text-zinc-500">{formatDay(day.date, { day: "numeric", month: "short" })}</p>

      {day.closed ? (
        <p className="mt-4 text-sm text-zinc-500">Kitchen closed</p>
      ) : (
        <>
          <p className="tabular mt-4 text-3xl font-semibold tracking-tight text-zinc-900">
            {day.mealsRequired}
          </p>
          <p className="text-xs font-medium text-zinc-500">meals</p>

          <ul className="mt-4 space-y-2 text-sm">
            {day.options.map((o) => (
              <li key={o.id} className="flex items-start justify-between gap-3">
                <span className={cn("leading-snug", o.isActive ? "text-zinc-700" : "text-zinc-400")}>
                  {o.name}
                </span>
                <span className="tabular font-semibold text-zinc-900">{o.count}</span>
              </li>
            ))}
          </ul>

          <div className="mt-4 space-y-1 border-t border-zinc-100 pt-3 text-xs text-zinc-500">
            {!legacy && (
              <p className="flex justify-between">
                <span>No meal required</span>
                <span className="tabular">{day.noMeal}</span>
              </p>
            )}
            <p className="flex justify-between">
              <span>{legacy ? "Didn't choose" : "Didn't submit"}</span>
              <span className="tabular">{didNotChoose}</span>
            </p>
          </div>
        </>
      )}
    </div>
  );
}

function Announcement({ week }: { week: MenuWeek }) {
  const text =
    `🍽️ The MealSync menu for ${weekRangeLabel(week.weekStart)} is ready.\n` +
    `Please choose your meals, or "No meal required", by ${formatDeadline(week.deadline)}.\n` +
    `If you don't submit, no meals will be booked for you that week.`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied. Paste it into WhatsApp.");
    } catch {
      toast.error("Couldn't copy. Select the text and copy it manually.");
    }
  };

  return (
    <Callout
      tone="info"
      title="Let staff know"
      action={
        <Button variant="secondary" size="sm" icon={<Copy size={15} />} onClick={copy}>
          Copy message
        </Button>
      }
    >
      <p className="mt-1 whitespace-pre-line">{text}</p>
    </Callout>
  );
}

function StaffLists({ summary }: { summary: MealPrepSummary }) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader
          title={`${summary.isLegacy ? "Chose meals" : "Submitted"} (${summary.submitted.length})`}
          description={summary.isLegacy ? "Time of their first choice" : "In order of submission"}
        />
        {summary.submitted.length ? (
          <ul className="max-h-[28rem] divide-y divide-zinc-100 overflow-y-auto">
            {summary.submitted.map((s) => (
              <li key={s.id} className="flex items-center gap-3 px-5 py-3">
                <Avatar name={`${s.firstName} ${s.lastName}`} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-zinc-900">
                    {s.firstName} {s.lastName}
                  </p>
                  <p className="truncate text-xs text-zinc-500">
                    {s.staffNumber} · {s.department}
                  </p>
                </div>
                <div className="text-right text-xs">
                  <p className="font-medium text-zinc-700">{formatTimestamp(s.submittedAt)}</p>
                  {s.edited && <p className="text-zinc-400">edited {formatTimestamp(s.updatedAt)}</p>}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState title="No submissions yet" />
        )}
      </Card>

      <Card>
        <CardHeader
          title={`${summary.isLegacy ? "Didn't choose" : "Didn't submit"} (${summary.notSubmitted.length})`}
          description="Active staff with no meals booked"
        />
        {summary.notSubmitted.length ? (
          <ul className="max-h-[28rem] divide-y divide-zinc-100 overflow-y-auto">
            {summary.notSubmitted.map((s) => (
              <li key={s.id} className="flex items-center gap-3 px-5 py-3">
                <Avatar name={`${s.firstName} ${s.lastName}`} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-zinc-900">
                    {s.firstName} {s.lastName}
                  </p>
                  <p className="truncate text-xs text-zinc-500">
                    {s.staffNumber} · {s.department}
                  </p>
                </div>
                {!s.hasActivatedAccount && <Badge>Never signed in</Badge>}
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState title="Everyone has submitted" />
        )}
      </Card>
    </div>
  );
}
