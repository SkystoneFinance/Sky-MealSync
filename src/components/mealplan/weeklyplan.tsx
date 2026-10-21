import { useEffect, useMemo, useState } from "react";

import toast from "react-hot-toast";

import {
  Ban,
  Check,
  CircleCheck,
  Clock,
  Lock,
  Store,
  UtensilsCrossed,
} from "lucide-react";

import {
  useMyMealPlan,
  useMyPlanStatus,
  useSubmitMealPlan,
} from "../../hooks/useMealPlan";

import type {
  DayChoice,
  PlanDay,
  StaffMealPlan,
} from "../../types/mealPlan";

import {
  apiErrorMessage,
  dishImageUrl,
  formatDay,
  formatDeadline,
  formatTimestamp,
  relativeWeekLabel,
  shiftWeek,
  weekRangeLabel,
  weeksBetween,
} from "../../utils/mealPlanDates";

import {
  Badge,
  Button,
  Callout,
  Card,
  PageHeader,
  PageLoader,
  WeekSwitcher,
  cn,
} from "../ui";

// Local choice per day: a food option id, or NO_MEAL
const NO_MEAL = "no-meal";

// How far back staff can browse their history
const HISTORY_WEEKS = 12;

type Choices = Record<string, string>;

export default function WeeklyMealPlan() {
  const { data: status } = useMyPlanStatus();
  const nextWeek = status?.[0]?.weekStart;
  const lastPlanningWeek = status?.[status.length - 1]?.weekStart;

  const [week, setWeek] = useState<string>();

  // Start on the first open week the user hasn't submitted, else next week
  useEffect(() => {
    if (!status || week) return;

    const pending = status.find((w) => w.isOpen && !w.submittedAt);
    setWeek(pending?.weekStart ?? status[0]?.weekStart);
  }, [status, week]);

  const { data: plan, isLoading, isError } = useMyMealPlan(week);

  if (!week || !nextWeek || !lastPlanningWeek) {
    return <PageLoader />;
  }

  const offset = weeksBetween(nextWeek, week);

  return (
    <div>
      <PageHeader
        title="My meals"
        description="Choose your lunch for the weeks ahead and look back at what you picked."
        actions={
          <WeekSwitcher
            label={weekRangeLabel(week)}
            sublabel={relativeWeekLabel(week, nextWeek)}
            onPrevious={() => setWeek(shiftWeek(week, -1))}
            onNext={() => setWeek(shiftWeek(week, 1))}
            canPrevious={offset > -HISTORY_WEEKS}
            canNext={week < lastPlanningWeek}
          />
        }
      />

      {isLoading || !plan ? (
        isError ? (
          <Callout tone="danger" title="We couldn't load this week">
            Check your connection and try again.
          </Callout>
        ) : (
          <PageLoader />
        )
      ) : (
        <WeekView key={week} plan={plan} />
      )}
    </div>
  );
}

function WeekView({ plan }: { plan: StaffMealPlan }) {
  return (
    <div className="space-y-6">
      <WeekStatus plan={plan} />

      {plan.week.isOpen ? (
        <PlanEditor plan={plan} />
      ) : (
        plan.selections.length > 0 && <ReadOnlyWeek plan={plan} />
      )}
    </div>
  );
}

// ==========================================
// STATUS
// ==========================================

function WeekStatus({ plan }: { plan: StaffMealPlan }) {
  const { week, submission, selections } = plan;

  if (week.isOpen && !submission) {
    return (
      <Callout
        tone="brand"
        icon={<Clock size={18} />}
        title={`Choose by ${formatDeadline(week.deadline)}`}
      >
        Pick a meal, or "No meal required", for each day. If you don't
        submit, no meals are booked for you this week.
      </Callout>
    );
  }

  if (week.isOpen && submission) {
    return (
      <Callout
        tone="success"
        icon={<CircleCheck size={18} />}
        title={`Submitted ${formatTimestamp(submission.submittedAt)}`}
      >
        You can change your choices until {formatDeadline(week.deadline)}.
      </Callout>
    );
  }

  if (week.isPlanningWeek && !week.isPublished) {
    return (
      <Card className="p-0">
        <div className="flex flex-col items-center px-6 py-14 text-center">
          <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-zinc-100 text-zinc-500">
            <UtensilsCrossed size={20} />
          </span>
          <p className="font-medium text-zinc-900">The menu isn't out yet</p>
          <p className="mt-1 max-w-sm text-sm text-zinc-500">
            The kitchen publishes each week's menu by the Wednesday before.
            You'll see a reminder on your home page when it's ready.
          </p>
        </div>
      </Card>
    );
  }

  if (week.isPublished && submission) {
    return (
      <Callout tone="neutral" icon={<Lock size={18} />} title="Selection closed">
        These are your meals for the week. Submitted {formatTimestamp(submission.submittedAt)}.
      </Callout>
    );
  }

  if (week.isPublished && !submission) {
    return (
      <Callout tone="neutral" icon={<Lock size={18} />} title="You didn't choose meals for this week">
        Selection has closed, so no meals were booked for you.
      </Callout>
    );
  }

  if (selections.length === 0) {
    return (
      <Card className="p-0">
        <div className="flex flex-col items-center px-6 py-14 text-center">
          <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-zinc-100 text-zinc-500">
            <UtensilsCrossed size={20} />
          </span>
          <p className="font-medium text-zinc-900">No meals for this week</p>
          <p className="mt-1 text-sm text-zinc-500">You didn't choose any meals.</p>
        </div>
      </Card>
    );
  }

  return null;
}

// ==========================================
// READ-ONLY WEEK
// ==========================================

function ReadOnlyWeek({ plan }: { plan: StaffMealPlan }) {
  const byDate = new Map(plan.selections.map((s) => [s.date, s]));

  return (
    <Card className="divide-y divide-zinc-100">
      {plan.days.map((day) => {
        const choice = byDate.get(day.date);

        return (
          <div key={day.date} className="flex items-center gap-4 px-5 py-4">
            <div className="w-28 shrink-0">
              <p className="text-sm font-semibold text-zinc-900">
                {formatDay(day.date, { weekday: "long" })}
              </p>
              <p className="text-xs text-zinc-500">
                {formatDay(day.date, { day: "numeric", month: "short" })}
              </p>
            </div>

            {day.closed ? (
              <DayNote icon={<Store size={16} />}>Kitchen closed</DayNote>
            ) : choice?.noMeal ? (
              <DayNote icon={<Ban size={16} />}>No meal</DayNote>
            ) : choice?.dish ? (
              <div className="flex min-w-0 items-center gap-3">
                <DishImage src={choice.dish.image} alt="" className="h-11 w-11 rounded-lg" />
                <p className="truncate font-medium text-zinc-900">{choice.dish.name}</p>
              </div>
            ) : (
              <DayNote>Nothing chosen</DayNote>
            )}
          </div>
        );
      })}
    </Card>
  );
}

function DayNote({
  icon,
  children,
}: {
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <p className="flex items-center gap-2 text-sm text-zinc-500">
      {icon}
      {children}
    </p>
  );
}

// ==========================================
// EDITOR (open weeks)
// ==========================================

function PlanEditor({ plan }: { plan: StaffMealPlan }) {
  const { week, days, submission } = plan;
  const submitPlan = useSubmitMealPlan();
  const [edits, setEdits] = useState<Choices>({});

  const saved: Choices = useMemo(() => {
    const result: Choices = {};

    for (const s of plan.selections) {
      result[s.date] = s.noMeal ? NO_MEAL : (s.foodOptionId ?? "");
    }

    return result;
  }, [plan]);

  const choices: Choices = { ...saved, ...edits };
  const openDays = days.filter((d) => !d.closed);
  const remaining = openDays.filter((d) => !choices[d.date]);
  const hasChanges = openDays.some((d) => choices[d.date] !== saved[d.date]);

  const handleSubmit = () => {
    if (remaining.length) {
      toast.error(`Choose a meal or "No meal required" for ${formatDay(remaining[0].date)}.`);
      return;
    }

    const selections: DayChoice[] = openDays.map((d) =>
      choices[d.date] === NO_MEAL
        ? { date: d.date, noMeal: true }
        : { date: d.date, foodOptionId: choices[d.date] }
    );

    submitPlan.mutate(
      { weekStart: week.weekStart, selections },
      {
        onSuccess: () => {
          setEdits({});
          toast.success(submission ? "Your changes are saved." : "Your meals are submitted.");
        },
        onError: (error) => toast.error(apiErrorMessage(error)),
      }
    );
  };

  return (
    <>
      <div className="space-y-4">
        {days.map((day) => (
          <DayPicker
            key={day.date}
            day={day}
            choice={choices[day.date]}
            onChoose={(value) => setEdits((current) => ({ ...current, [day.date]: value }))}
          />
        ))}
      </div>

      <div className="sticky bottom-0 z-10 -mx-4 border-t border-zinc-200 bg-white/90 px-4 py-3 backdrop-blur sm:bottom-4 sm:mx-0 sm:rounded-xl sm:border sm:shadow-pop">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-zinc-600">
            {remaining.length
              ? `${openDays.length - remaining.length} of ${openDays.length} days chosen`
              : submission && !hasChanges
                ? "All set"
                : "Ready to submit"}
          </p>
          <Button
            onClick={handleSubmit}
            loading={submitPlan.isPending}
            disabled={Boolean(submission) && !hasChanges}
            icon={submission && !hasChanges ? <Check size={16} /> : undefined}
          >
            {submission && !hasChanges ? "Submitted" : submission ? "Save changes" : "Submit my meals"}
          </Button>
        </div>
      </div>
    </>
  );
}

function DayPicker({
  day,
  choice,
  onChoose,
}: {
  day: PlanDay;
  choice?: string;
  onChoose: (value: string) => void;
}) {
  return (
    <Card>
      <div className="flex items-center justify-between gap-3 border-b border-zinc-100 px-5 py-3.5">
        <h2 className="font-semibold text-zinc-900">{formatDay(day.date)}</h2>
        {day.closed ? (
          <Badge>Kitchen closed</Badge>
        ) : choice ? (
          <Badge tone="success" icon={<Check size={12} />}>Chosen</Badge>
        ) : (
          <Badge tone="warning">To choose</Badge>
        )}
      </div>

      {day.closed ? (
        <p className="flex items-center gap-2 px-5 py-5 text-sm text-zinc-500">
          <Store size={16} />
          No meals are served this day.
        </p>
      ) : (
        <div
          role="radiogroup"
          aria-label={formatDay(day.date)}
          className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 lg:grid-cols-4"
        >
          {day.options.map((option) => (
            <ChoiceTile
              key={option.id}
              selected={choice === option.id}
              onSelect={() => onChoose(option.id)}
              label={option.name}
            >
              <DishImage src={option.image} alt="" className="aspect-[4/3] w-full" />
              <p className="px-3 py-2.5 text-sm font-medium leading-snug text-zinc-900">
                {option.name}
              </p>
            </ChoiceTile>
          ))}

          <ChoiceTile
            selected={choice === NO_MEAL}
            onSelect={() => onChoose(NO_MEAL)}
            label="No meal required"
          >
            <div className="flex aspect-[4/3] w-full items-center justify-center bg-zinc-50 text-zinc-400">
              <Ban size={26} strokeWidth={1.5} />
            </div>
            <p className="px-3 py-2.5 text-sm font-medium leading-snug text-zinc-900">
              No meal required
            </p>
          </ChoiceTile>
        </div>
      )}
    </Card>
  );
}

function ChoiceTile({
  selected,
  onSelect,
  label,
  children,
}: {
  selected: boolean;
  onSelect: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={label}
      onClick={onSelect}
      className={cn(
        "relative overflow-hidden rounded-xl border bg-white text-left transition",
        selected
          ? "border-brand-600 ring-2 ring-brand-600/20"
          : "border-zinc-200 hover:border-zinc-300 hover:shadow-card"
      )}
    >
      {children}
      {selected && (
        <span className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-brand-600 text-white shadow">
          <Check size={14} strokeWidth={3} />
        </span>
      )}
    </button>
  );
}

function DishImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div className={cn("flex items-center justify-center bg-zinc-100 text-zinc-400", className)}>
        <UtensilsCrossed size={18} />
      </div>
    );
  }

  return (
    <img
      src={dishImageUrl(src)}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={cn("bg-zinc-100 object-cover", className)}
    />
  );
}
