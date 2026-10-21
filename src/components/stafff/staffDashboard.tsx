import {
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  UtensilsCrossed,
} from "lucide-react";

import { Link } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";
import { useMyMealSelections } from "../../hooks/useMealSelection";
import { useMyMealPlan } from "../../hooks/useMealPlan";
import MealPlanBanner from "../mealplan/MealPlanBanner";
import {
  formatDay,
  formatDeadline,
} from "../../utils/mealPlanDates";
import type { StaffUser } from "../../types/auth";

export default function StaffDashboard() {
  const { user } = useAuth();   

  const {
    data: selections = [],
    isLoading,
  } = useMyMealSelections();

  const { data: plan } = useMyMealPlan();

  const staff: StaffUser | null =
    user && user.role === "USER" && "staffId" in user
      ? user
      : null;

  if (!staff) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-slate-500">
          Staff information unavailable.
        </p>
      </div>
    );
  }

  const fullName = `${staff.firstName} ${staff.lastName}`;

  // ==================================
  // TODAY
  // ==================================

  const today = new Date();

  const todayDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  const todaySelection = selections.find(
    (selection) =>
      selection.mealDate.startsWith(todayDate)
  );

  // ==================================
  // NEXT WEEK'S PLAN
  // ==================================

  const nextWeekOf = plan
    ? formatDay(plan.week.weekStart, {
        day: "numeric",
        month: "short",
      })
    : "";

  const nextWeekStatus = !plan
    ? "Loading..."
    : plan.submission
      ? "Submitted"
      : !plan.week.isPublished
        ? "Menu not out yet"
        : plan.week.isOpen
          ? "Not submitted"
          : "Missed";

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">

      {/* ================================= */}
      {/* HEADER */}
      {/* ================================= */}

      {/* Prompt to choose next week's meals */}
      <MealPlanBanner />

      <div>
        <p className="text-sm font-medium text-slate-500">
          Staff Dashboard
        </p>

        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          Welcome back, {staff.firstName} 👋
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Here's your meal activity for this week.
        </p>
      </div>


      {/* ================================= */}
      {/* STAFF CARD */}
      {/* ================================= */}

      <div className="rounded-3xl bg-[#B10F16] p-6 text-white shadow-sm">

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <p className="text-sm text-white/70">
              Staff Member
            </p>

            <h2 className="mt-1 text-xl font-bold">
              {fullName}
            </h2>

            <p className="mt-1 text-sm text-white/80">
              Staff No: {staff.staffNumber}
            </p>
          </div>

          <div className="rounded-2xl bg-white/10 px-5 py-4 backdrop-blur">
            <p className="text-xs text-white/70">
              Department
            </p>

            <p className="mt-1 font-semibold">
              {staff.department}
            </p>
          </div>

        </div>

      </div>


      {/* ================================= */}
      {/* STAT CARDS */}
      {/* ================================= */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

        {/* TODAY'S MEAL */}

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-[#B10F16]">
              <UtensilsCrossed size={21} />
            </div>

            <span className="text-xs font-medium text-slate-400">
              Today
            </span>

          </div>

          <p className="mt-5 text-sm text-slate-500">
            Today's Meal
          </p>

          <h3 className="mt-1 text-lg font-bold text-slate-900">
            {isLoading
              ? "Loading..."
              : todaySelection?.noMeal
                ? "No meal today"
                : todaySelection?.foodOption?.name ||
                  "Not selected"}
          </h3>

        </div>


        {/* WEEKLY SELECTION */}

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-50 text-green-600">
              <CalendarDays size={21} />
            </div>

            <span className="text-xs font-medium text-slate-400">
              Week of {nextWeekOf}
            </span>

          </div>

          <p className="mt-5 text-sm text-slate-500">
            Next Week's Plan
          </p>

          <h3 className="mt-1 text-lg font-bold text-slate-900">
            {nextWeekStatus}
          </h3>

        </div>


        {/* PLAN STATUS */}

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <CheckCircle2 size={21} />
            </div>

            <span className="text-xs font-medium text-slate-400">
              Status
            </span>

          </div>

          <p className="mt-5 text-sm text-slate-500">
            Deadline
          </p>

          <h3 className="mt-1 text-lg font-bold text-slate-900">
            {plan?.week.isOpen
              ? formatDeadline(plan.week.deadline)
              : "—"}
          </h3>

        </div>

      </div>


      {/* ================================= */}
      {/* WEEKLY SUMMARY */}
      {/* ================================= */}

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <div className="flex items-center gap-2">

              <Clock3
                size={18}
                className="text-[#B10F16]"
              />

              <h2 className="font-bold text-slate-900">
                Weekly Meal Plan
              </h2>

            </div>

            <p className="mt-2 text-sm text-slate-500">
              Meals are chosen a week ahead so the kitchen can shop on Friday.
            </p>

          </div>

          <Link
            to="/meal-plan"
            className="flex items-center justify-center gap-2 rounded-xl bg-[#B10F16] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#920C12]"
          >
            {plan?.submission
              ? "View Meal Plan"
              : "Select Meal"}

            <ChevronRight size={17} />
          </Link>

        </div>

      </div>

    </div>
  );
}