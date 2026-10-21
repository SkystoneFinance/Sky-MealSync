import { Link } from "react-router-dom";

import {
  CheckCircle2,
  ChevronRight,
  UtensilsCrossed,
} from "lucide-react";

import { useMyMealPlan } from "../../hooks/useMealPlan";

import {
  formatDay,
  formatDeadline,
} from "../../utils/mealPlanDates";

// Top of the staff home page. Loud while next week's menu is
// published and the staff member hasn't submitted; quiet once they have.
export default function MealPlanBanner() {
  const { data: plan } = useMyMealPlan();

  if (!plan?.week.isOpen) {
    return null;
  }

  const weekOf = formatDay(plan.week.weekStart, {
    day: "numeric",
    month: "long",
  });

  if (plan.submission) {
    return (
      <div className="flex flex-col gap-3 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-800 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-2 font-medium">
          <CheckCircle2 size={18} />
          Your meals for the week of {weekOf} are submitted.
        </p>

        <Link
          to="/meal-plan"
          className="font-semibold underline-offset-2 hover:underline"
        >
          Review or change
        </Link>
      </div>
    );
  }

  return (
    <div
      role="alert"
      className="relative overflow-hidden rounded-3xl bg-linear-to-r from-[#760408] via-[#b50315] to-[#c70519] p-6 text-white shadow-lg sm:p-8"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15">
            <UtensilsCrossed size={24} />
          </div>

          <div>
            <h2 className="text-xl font-bold sm:text-2xl">
              Next week's menu is ready
            </h2>

            <p className="mt-1 text-sm text-white/85 sm:text-base">
              Choose your meals for the week of {weekOf} by{" "}
              <span className="font-semibold text-white">
                {formatDeadline(plan.week.deadline)}
              </span>
              .
            </p>
          </div>
        </div>

        <Link
          to="/meal-plan"
          className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-[#B10F16] shadow transition hover:bg-red-50"
        >
          Choose my meals
          <ChevronRight size={18} />
        </Link>
      </div>
    </div>
  );
}
