import {
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  UtensilsCrossed,
} from "lucide-react";

import { useAuth } from "../../hooks/useAuth";
import { useMyMealSelections } from "../../hooks/useMealSelection";
import type { StaffUser } from "../../types/auth";

export default function StaffDashboard() {
  const { user } = useAuth();   

  const {
    data: selections = [],
    isLoading,
  } = useMyMealSelections();

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
  // CURRENT WEEK
  // ==================================

  const monday = new Date(today);

  const day = monday.getDay();

  const difference =
    day === 0 ? -6 : 1 - day;

  monday.setDate(
    monday.getDate() + difference
  );

  monday.setHours(0, 0, 0, 0);

  const friday = new Date(monday);

  friday.setDate(
    monday.getDate() + 4
  );

  const currentWeekSelections =
    selections.filter((selection) => {

      const mealDate =
        new Date(selection.mealDate);

      return (
        mealDate >= monday &&
        mealDate <= friday
      );
    });

  const selectedCount =
    currentWeekSelections.length;

  const completed =
    selectedCount === 5;

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">

      {/* ================================= */}
      {/* HEADER */}
      {/* ================================= */}

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
              This Week
            </span>

          </div>

          <p className="mt-5 text-sm text-slate-500">
            Meals Selected
          </p>

          <h3 className="mt-1 text-lg font-bold text-slate-900">
            {selectedCount} / 5
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
            Meal Plan
          </p>

          <h3 className="mt-1 text-lg font-bold text-slate-900">
            {completed
              ? "Completed"
              : "In Progress"}
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
              {completed
                ? "Your meal plan is complete for this week."
                : `You have selected ${selectedCount} out of 5 meals.`}
            </p>

          </div>

          <a
            href="/meal-plan"
            className="flex items-center justify-center gap-2 rounded-xl bg-[#B10F16] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#920C12]"
          >
            {completed
              ? "View Meal Plan"
              : "Select Meal"}

            <ChevronRight size={17} />
          </a>

        </div>

      </div>

    </div>
  );
}