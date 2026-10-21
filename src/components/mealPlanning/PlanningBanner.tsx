import { Link } from "react-router-dom";

import {
  CalendarClock,
  CircleCheck,
  TriangleAlert,
} from "lucide-react";

import { useChefPlanStatus } from "../../hooks/useMealPlan";

import {
  formatDeadline,
  weekRangeLabel,
} from "../../utils/mealPlanDates";

import { Callout, buttonStyles } from "../ui";

// Top of the chef/admin overview:
// - from Tuesday until published: reminder to publish next week's menu
// - after selection closes (Thu 19:00): the confirmed summary is ready
export default function PlanningBanner() {
  const { data: status } = useChefPlanStatus();

  if (!status) return null;

  const week = weekRangeLabel(status.weekStart);

  const action = (label: string) => (
    <Link to="/weekly-planning" className={buttonStyles("secondary", "sm")}>
      {label}
    </Link>
  );

  if (status.showPublishReminder) {
    return status.isPublishOverdue ? (
      <Callout
        tone="danger"
        icon={<TriangleAlert size={18} />}
        title={`Next week's menu is overdue`}
        action={action("Plan the week")}
      >
        The menu for {week} was due {formatDeadline(status.publishDueAt)}. Staff must
        choose by {formatDeadline(status.deadline)}.
      </Callout>
    ) : (
      <Callout
        tone="warning"
        icon={<CalendarClock size={18} />}
        title="Publish next week's menu"
        action={action("Plan the week")}
      >
        The menu for {week} is due by {formatDeadline(status.publishDueAt)}.
      </Callout>
    );
  }

  if (status.isConfirmed) {
    return (
      <Callout
        tone="success"
        icon={<CircleCheck size={18} />}
        title={`${week} is confirmed`}
        action={action("View summary")}
      >
        Selection has closed. The meal preparation summary is ready.
      </Callout>
    );
  }

  return null;
}
