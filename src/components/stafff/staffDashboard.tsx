import { Link } from "react-router-dom";

import {
  ArrowRight,
  Ban,
  CircleCheck,
  Clock,
  QrCode,
  UtensilsCrossed,
} from "lucide-react";

import { useAuth } from "../../hooks/useAuth";
import { useMyMealSelections } from "../../hooks/useMealSelection";
import { useMyPlanStatus } from "../../hooks/useMealPlan";

import MealPlanBanner from "../mealplan/MealPlanBanner";

import {
  dishImageUrl,
  formatDeadline,
  formatTimestamp,
  weekRangeLabel,
} from "../../utils/mealPlanDates";

import type { StaffWeekStatus } from "../../types/mealPlan";

import {
  Badge,
  Card,
  CardHeader,
  PageHeader,
} from "../ui";

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

// Local calendar date as YYYY-MM-DD (meal dates are date-only)
function todayKey() {
  const d = new Date();
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("-");
}

export default function StaffDashboard() {
  const { user } = useAuth();
  const { data: selections = [], isLoading } = useMyMealSelections();
  const { data: weeks = [] } = useMyPlanStatus();

  const firstName =
    user && "firstName" in user ? user.firstName : "";

  const today = selections.find((s) => s.mealDate.startsWith(todayKey()));

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={new Date().toLocaleDateString("en-GB", {
          weekday: "long",
          day: "numeric",
          month: "long",
        })}
        title={`${greeting()}${firstName ? `, ${firstName}` : ""}`}
      />

      <MealPlanBanner />

      <div className="grid gap-6 lg:grid-cols-5">
        {/* TODAY */}
        <Card className="lg:col-span-3">
          <CardHeader title="Today's lunch" />
          <div className="flex items-center gap-4 p-5">
            {isLoading ? (
              <p className="text-sm text-zinc-500">Loading…</p>
            ) : today?.noMeal ? (
              <TodayRow icon={<Ban size={22} />} title="No meal today" text="You chose “No meal required”." />
            ) : today?.foodOption ? (
              <>
                {today.foodOption.image ? (
                  <img
                    src={dishImageUrl(today.foodOption.image)}
                    alt=""
                    className="h-20 w-20 shrink-0 rounded-xl bg-zinc-100 object-cover"
                  />
                ) : null}
                <div>
                  <p className="text-lg font-semibold text-zinc-900">{today.foodOption.name}</p>
                  <p className="mt-0.5 text-sm text-zinc-500">
                    Show your QR code at the counter.
                  </p>
                </div>
              </>
            ) : (
              <TodayRow
                icon={<UtensilsCrossed size={22} />}
                title="Nothing booked for today"
                text="Meals are chosen in advance for each week."
              />
            )}
          </div>
        </Card>

        {/* QR */}
        <Link to="/my-profile" className="group lg:col-span-2">
          <Card className="flex h-full items-center gap-4 p-5 transition group-hover:border-zinc-300">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700">
              <QrCode size={24} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-zinc-900">My QR code</p>
              <p className="text-sm text-zinc-500">Scan it at the counter to get your meal.</p>
            </div>
            <ArrowRight size={18} className="text-zinc-400 transition group-hover:translate-x-0.5 group-hover:text-zinc-700" />
          </Card>
        </Link>
      </div>

      {/* UPCOMING WEEKS */}
      <Card>
        <CardHeader
          title="Upcoming weeks"
          actions={
            <Link to="/meal-plan" className="text-sm font-medium text-brand-600 hover:text-brand-700">
              My meals
            </Link>
          }
        />
        <ul className="divide-y divide-zinc-100">
          {weeks.map((w) => (
            <WeekRow key={w.weekStart} week={w} />
          ))}
        </ul>
      </Card>
    </div>
  );
}

function TodayRow({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <>
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500">
        {icon}
      </span>
      <div>
        <p className="font-semibold text-zinc-900">{title}</p>
        <p className="mt-0.5 text-sm text-zinc-500">{text}</p>
      </div>
    </>
  );
}

function WeekRow({ week }: { week: StaffWeekStatus }) {
  const state = week.submittedAt
    ? {
        badge: <Badge tone="success" icon={<CircleCheck size={12} />}>Submitted</Badge>,
        text: `Submitted ${formatTimestamp(week.submittedAt)}`,
      }
    : week.isOpen
      ? {
          badge: <Badge tone="brand" icon={<Clock size={12} />}>Choose now</Badge>,
          text: `Choose by ${formatDeadline(week.deadline)}`,
        }
      : week.isPublished
        ? { badge: <Badge>Closed</Badge>, text: "Selection has closed" }
        : { badge: <Badge>Menu not out yet</Badge>, text: "Usually published the Wednesday before" };

  return (
    <li>
      <Link
        to="/meal-plan"
        className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-zinc-50"
      >
        <div className="min-w-0">
          <p className="font-medium text-zinc-900">{weekRangeLabel(week.weekStart)}</p>
          <p className="truncate text-sm text-zinc-500">{state.text}</p>
        </div>
        {state.badge}
      </Link>
    </li>
  );
}
