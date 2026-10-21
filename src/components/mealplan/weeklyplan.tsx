import { useMemo, useState } from "react";

import toast from "react-hot-toast";

import {
  Ban,
  CalendarClock,
  Check,
  CheckCircle2,
  Loader2,
  Lock,
  Store,
} from "lucide-react";

import {
  useMyMealPlan,
  useSubmitMealPlan,
} from "../../hooks/useMealPlan";

import type {
  DayChoice,
  PlanDay,
} from "../../types/mealPlan";

import {
  apiErrorMessage,
  formatDay,
  formatDeadline,
  formatTimestamp,
} from "../../utils/mealPlanDates";

// Local choice per day: a food option id, or NO_MEAL
const NO_MEAL = "no-meal";

type Choices = Record<string, string>;

export default function WeeklyMealPlan() {
  const { data: plan, isLoading, isError } = useMyMealPlan();
  const submitPlan = useSubmitMealPlan();

  // Edits on top of what is saved on the server
  const [edits, setEdits] = useState<Choices>({});

  const saved: Choices = useMemo(() => {
    const result: Choices = {};

    for (const s of plan?.selections ?? []) {
      result[s.date] = s.noMeal
        ? NO_MEAL
        : (s.foodOptionId ?? "");
    }

    return result;
  }, [plan]);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="animate-spin" size={30} />
      </div>
    );
  }

  if (isError || !plan) {
    return (
      <div className="rounded-2xl bg-red-50 p-6 text-sm text-red-600">
        Unable to load next week's menu. Please refresh the page.
      </div>
    );
  }

  const { week, days, submission } = plan;
  const openDays = days.filter((d) => !d.closed);
  const choices: Choices = { ...saved, ...edits };

  const missingDay = openDays.find((d) => !choices[d.date]);
  const hasChanges = openDays.some(
    (d) => choices[d.date] !== saved[d.date]
  );

  const handleSubmit = () => {
    if (missingDay) {
      toast.error(
        `Please choose a meal or "No meal required" for ${formatDay(missingDay.date)}.`
      );
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
          toast.success(
            submission
              ? "Your meal plan has been updated."
              : "Your meal plan has been submitted."
          );
        },
        onError: (error) => {
          toast.error(apiErrorMessage(error));
        },
      }
    );
  };

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      {/* HEADER */}

      <div>
        <p className="text-sm font-medium text-slate-500">
          Next week's meals
        </p>

        <h1 className="mt-1 text-2xl font-bold text-gray-900">
          Week of {formatDay(week.weekStart, { day: "numeric", month: "long" })}
        </h1>

        {week.isOpen && (
          <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-[#B10F16]">
            <CalendarClock size={16} />
            Choose by {formatDeadline(week.deadline)}
          </p>
        )}
      </div>

      {/* STATUS */}

      <PlanStatus
        isPublished={week.isPublished}
        isOpen={week.isOpen}
        submittedAt={submission?.submittedAt}
        updatedAt={submission?.updatedAt}
      />

      {/* DAYS */}

      {week.isPublished && (
        <div className="space-y-6">
          {days.map((day) => (
            <DayCard
              key={day.date}
              day={day}
              choice={choices[day.date]}
              readOnly={!week.isOpen}
              onChoose={(value) =>
                setEdits((current) => ({
                  ...current,
                  [day.date]: value,
                }))
              }
            />
          ))}
        </div>
      )}

      {/* SUBMIT */}

      {week.isOpen && (
        <div className="sticky bottom-4 flex flex-col items-end gap-2 border-t border-gray-200 bg-[#f5f5f5]/90 pt-4 backdrop-blur">
          {missingDay && (
            <p className="text-xs text-slate-500">
              {openDays.filter((d) => !choices[d.date]).length} day(s) left to choose
            </p>
          )}

          <button
            type="button"
            disabled={
              submitPlan.isPending ||
              (Boolean(submission) && !hasChanges)
            }
            onClick={handleSubmit}
            className="flex items-center gap-2 rounded-xl bg-[#B10F16] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#920c12] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitPlan.isPending ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Saving...
              </>
            ) : submission && !hasChanges ? (
              <>
                <Check size={18} />
                Plan submitted
              </>
            ) : submission ? (
              "Update my plan"
            ) : (
              "Submit my plan"
            )}
          </button>
        </div>
      )}
    </div>
  );
}

function PlanStatus({
  isPublished,
  isOpen,
  submittedAt,
  updatedAt,
}: {
  isPublished: boolean;
  isOpen: boolean;
  submittedAt?: string;
  updatedAt?: string;
}) {
  if (!isPublished) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
        The chef hasn't published next week's menu yet. It's usually
        ready by Wednesday evening; check back then.
      </div>
    );
  }

  if (submittedAt) {
    const edited =
      updatedAt &&
      new Date(updatedAt).getTime() -
        new Date(submittedAt).getTime() >
        60 * 1000;

    return (
      <div className="flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 p-5 text-sm text-green-800">
        <CheckCircle2 size={20} className="mt-0.5 shrink-0" />

        <div>
          <p className="font-semibold">
            Submitted {formatTimestamp(submittedAt)}
            {edited && updatedAt
              ? ` · last changed ${formatTimestamp(updatedAt)}`
              : ""}
          </p>

          <p className="mt-1">
            {isOpen
              ? "You can still change your choices until the deadline."
              : "Selection has closed. These are your meals for next week."}
          </p>
        </div>
      </div>
    );
  }

  if (!isOpen) {
    return (
      <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
        <Lock size={20} className="mt-0.5 shrink-0" />

        <p>
          Selection for next week has closed. You didn't submit a plan,
          so no meals are booked for you next week.
        </p>
      </div>
    );
  }

  return null;
}

function DayCard({
  day,
  choice,
  readOnly,
  onChoose,
}: {
  day: PlanDay;
  choice?: string;
  readOnly: boolean;
  onChoose: (value: string) => void;
}) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">
          {formatDay(day.date)}
        </h2>

        {day.closed ? (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            Kitchen closed
          </span>
        ) : choice ? (
          <span className="flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
            <Check size={14} />
            Chosen
          </span>
        ) : null}
      </div>

      {day.closed ? (
        <div className="flex items-center gap-2 rounded-xl bg-gray-50 p-6 text-sm text-gray-500">
          <Store size={18} />
          No meals are served on this day.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {day.options.map((food) => (
            <ChoiceTile
              key={food.id}
              selected={choice === food.id}
              disabled={readOnly}
              onClick={() => onChoose(food.id)}
            >
              <div className="relative h-40 overflow-hidden">
                <img
                  src={food.image}
                  alt={food.name}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-gray-900">
                  {food.name}
                </h3>
              </div>
            </ChoiceTile>
          ))}

          <ChoiceTile
            selected={choice === NO_MEAL}
            disabled={readOnly}
            onClick={() => onChoose(NO_MEAL)}
          >
            <div className="flex h-full min-h-[120px] flex-col items-center justify-center gap-2 p-4 text-center">
              <Ban size={28} className="text-slate-400" />

              <h3 className="font-semibold text-gray-900">
                No meal required
              </h3>

              <p className="text-xs text-gray-500">
                I won't be eating on this day
              </p>
            </div>
          </ChoiceTile>
        </div>
      )}
    </section>
  );
}

function ChoiceTile({
  selected,
  disabled,
  onClick,
  children,
}: {
  selected: boolean;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-pressed={selected}
      className={`group relative overflow-hidden rounded-xl border-2 text-left transition ${
        selected
          ? "border-[#B10F16] bg-red-50"
          : disabled
            ? "cursor-not-allowed border-gray-100 bg-gray-50 opacity-60"
            : "border-gray-100 bg-white hover:border-gray-300"
      }`}
    >
      {children}

      {selected && (
        <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#B10F16] text-white shadow">
          <Check size={18} />
        </div>
      )}
    </button>
  );
}
