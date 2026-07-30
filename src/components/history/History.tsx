import { useState } from "react";

import HistoryHeader from "./HistoryHeader";
import HistoryFilters from "./HistoryFilter";
import HistorySummary from "./summaryCard";
import AttendanceTable from "./AttendanceTable";

import {
  useTodayReport,
  useWeeklyReport,
  useMonthlyReport,
  useStaffSummary,
} from "../../hooks/useReport";

export default function History() {
  const [period, setPeriod] =
    useState("today");

  const today = useTodayReport();

  const weekly = useWeeklyReport();

  const monthly = useMonthlyReport();

  const summary =
    period === "today"
      ? today.data
      : period === "weekly"
      ? weekly.data
      : monthly.data;

  const {
    data = [],
    isLoading,
  } = useStaffSummary(period);

  return (
    <div className="space-y-7">
      <HistoryHeader period={period} />

      <HistoryFilters
        period={period}
        setPeriod={setPeriod}
      />

      {summary && (
        <HistorySummary
          summary={summary}
        />
      )}

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <AttendanceTable
          data={data}
        />
      )}
    </div>
  );
}