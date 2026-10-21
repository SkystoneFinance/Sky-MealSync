import { useEffect, useState } from "react";

import StatsSection from "./statsSection";
import RecentAttendance from "./RecentAttendance";
import DepartmentSummary from "./DepartmentSummary";
import PlanningBanner from "../mealPlanning/PlanningBanner";

import { Callout, PageHeader } from "../ui";
import { useDashboard } from "../../hooks/useDashboard";
import { useRecentAttendance } from "../../hooks/useRecentAttendance";
import { useDepartmentSummary } from "../../hooks/useDepartmentSummary";
import { apiErrorMessage } from "../../utils/mealPlanDates";

// Re-render once a minute so the greeting and "x min ago" labels stay fresh.
function useNow(intervalMs = 60_000) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);

  return now;
}

function greeting(now: number) {
  const hour = new Date(now).getHours();

  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function Dashboard() {
  const now = useNow();

  const stats = useDashboard();
  const recent = useRecentAttendance();
  const departments = useDepartmentSummary();

  const today = new Date(now).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-6">
      <PageHeader eyebrow={greeting(now)} title="Overview" description={today} />

      <PlanningBanner />

      {stats.isError && (
        <Callout tone="danger" title="Couldn't load today's numbers">
          {apiErrorMessage(stats.error)}
        </Callout>
      )}

      <StatsSection stats={stats.data} error={stats.isError} />

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentAttendance
          loading={recent.isPending}
          error={recent.isError}
          data={recent.data ?? []}
          now={now}
        />
        <DepartmentSummary
          loading={departments.isPending}
          error={departments.isError}
          data={departments.data ?? []}
        />
      </div>
    </div>
  );
}
