import { useState } from "react";

import { Percent, Users, UtensilsCrossed } from "lucide-react";

import HistoryHeader from "./HistoryHeader";
import AttendanceTable from "./AttendanceTable";

import { Callout, Segmented, StatCard } from "../ui";
import { useReportSummary, useStaffSummary } from "../../hooks/useReport";
import type { ReportPeriod } from "../../types/report";
import { apiErrorMessage } from "../../utils/mealPlanDates";

const PERIODS: { value: ReportPeriod; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "weekly", label: "This week" },
  { value: "monthly", label: "This month" },
];

function formatRate(rate: number) {
  return `${Number.isInteger(rate) ? rate : rate.toFixed(1)}%`;
}

function Placeholder() {
  return (
    <span className="inline-block h-8 w-16 animate-pulse rounded-md bg-zinc-100 align-middle">
      <span className="sr-only">Loading</span>
    </span>
  );
}

export default function History() {
  const [period, setPeriod] = useState<ReportPeriod>("today");

  const summary = useReportSummary(period);
  const staff = useStaffSummary(period);

  const periodLabel =
    PERIODS.find((item) => item.value === period)?.label ?? "Today";

  const stats = summary.data;
  const empty = summary.isError ? "–" : <Placeholder />;

  return (
    <div className="space-y-6">
      <HistoryHeader />

      <Segmented
        value={period}
        onChange={setPeriod}
        options={PERIODS}
        className="w-full sm:w-auto"
      />

      {summary.isError && (
        <Callout tone="danger" title="Couldn't load the summary">
          {apiErrorMessage(summary.error)}
        </Callout>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Meals served"
          value={stats ? stats.served.toLocaleString() : empty}
          hint={periodLabel}
          icon={<UtensilsCrossed size={16} />}
          tone="brand"
        />
        <StatCard
          label="Staff"
          value={stats ? stats.totalStaff.toLocaleString() : empty}
          hint="Active staff members"
          icon={<Users size={16} />}
        />
        <StatCard
          label="Attendance rate"
          value={stats ? formatRate(stats.attendanceRate) : empty}
          hint={
            period === "today"
              ? "Of active staff served today"
              : "Meals served ÷ active staff"
          }
          icon={<Percent size={16} />}
        />
      </div>

      <AttendanceTable
        data={staff.data ?? []}
        loading={staff.isPending}
        error={staff.isError}
        periodLabel={periodLabel}
      />
    </div>
  );
}
