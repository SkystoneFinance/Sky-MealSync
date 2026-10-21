import { Link } from "react-router-dom";

import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";

import { useChefPlanStatus } from "../../hooks/useMealPlan";

import {
  formatDay,
  formatDeadline,
} from "../../utils/mealPlanDates";

// Top of the chef/admin dashboard:
// - from Tuesday until published: reminder to publish next week's menu
// - after selection closes (Thu 19:00): the confirmed summary is ready
export default function PlanningBanner() {
  const { data: status } = useChefPlanStatus();

  if (!status) {
    return null;
  }

  const weekOf = formatDay(status.weekStart, {
    day: "numeric",
    month: "long",
  });

  if (status.showPublishReminder) {
    const overdue = status.isPublishOverdue;

    return (
      <Banner
        tone={overdue ? "red" : "amber"}
        icon={overdue ? <AlertTriangle size={22} /> : <CalendarClock size={22} />}
        title={
          overdue
            ? `Next week's menu is overdue`
            : `Publish next week's menu`
        }
        text={
          overdue
            ? `The menu for the week of ${weekOf} was due ${formatDeadline(status.publishDueAt)}. Staff must choose by ${formatDeadline(status.deadline)}.`
            : `The menu for the week of ${weekOf} is due by ${formatDeadline(status.publishDueAt)}.`
        }
        action="Plan the week"
      />
    );
  }

  if (status.isConfirmed) {
    return (
      <Banner
        tone="green"
        icon={<CheckCircle2 size={22} />}
        title={`Week of ${weekOf} confirmed`}
        text="Selection has closed. The Meal Preparation Summary is ready."
        action="View summary"
      />
    );
  }

  return null;
}

const TONES = {
  amber: "border-amber-200 bg-amber-50 text-amber-900",
  red: "border-red-200 bg-red-50 text-red-900",
  green: "border-green-200 bg-green-50 text-green-900",
};

function Banner({
  tone,
  icon,
  title,
  text,
  action,
}: {
  tone: keyof typeof TONES;
  icon: React.ReactNode;
  title: string;
  text: string;
  action: string;
}) {
  return (
    <div
      role="status"
      className={`flex flex-col gap-4 rounded-2xl border p-5 sm:flex-row sm:items-center sm:justify-between ${TONES[tone]}`}
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 shrink-0">{icon}</span>

        <div>
          <p className="font-bold">{title}</p>
          <p className="mt-1 text-sm opacity-90">{text}</p>
        </div>
      </div>

      <Link
        to="/weekly-planning"
        className="flex shrink-0 items-center justify-center gap-1 rounded-xl bg-white/80 px-4 py-2 text-sm font-semibold shadow-sm hover:bg-white"
      >
        {action}
        <ChevronRight size={16} />
      </Link>
    </div>
  );
}
