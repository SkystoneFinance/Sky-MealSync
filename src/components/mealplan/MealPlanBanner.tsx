import { Link } from "react-router-dom";

import { ArrowRight, UtensilsCrossed } from "lucide-react";

import { useMyPlanStatus } from "../../hooks/useMealPlan";

import {
  formatDeadline,
  weekRangeLabel,
} from "../../utils/mealPlanDates";

// Top of the staff home page: loud while a published week is still
// waiting for this person's choices. Nothing otherwise.
export default function MealPlanBanner() {
  const { data: weeks } = useMyPlanStatus();

  const pending = weeks?.filter((w) => w.isOpen && !w.submittedAt) ?? [];

  if (!pending.length) {
    return null;
  }

  const first = pending[0];

  return (
    <div
      role="alert"
      className="overflow-hidden rounded-2xl bg-brand-600 text-white shadow-pop"
    >
      <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15">
            <UtensilsCrossed size={22} />
          </span>
          <div>
            <h2 className="text-lg font-semibold sm:text-xl">
              {pending.length > 1
                ? "Two weeks of menus are ready"
                : "The menu is ready"}
            </h2>
            <p className="mt-1 text-sm text-white/85 sm:text-base">
              Choose your meals for {weekRangeLabel(first.weekStart)} by{" "}
              <span className="font-semibold text-white">
                {formatDeadline(first.deadline)}
              </span>
              .
            </p>
          </div>
        </div>

        <Link
          to="/meal-plan"
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-white px-5 text-sm font-semibold text-brand-700 shadow-sm transition hover:bg-brand-50"
        >
          Choose my meals
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
