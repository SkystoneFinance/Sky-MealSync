import DashboardHeader from "./DashboardHeader";
import StatsSection from "./statsSection";
import RecentAttendance from "./RecentAttendance";
import DepartmentSummary from "./DepartmentSummary";

import { useDashboard } from "../../hooks/useDashboard";
import { useRecentAttendance } from "../../hooks/useRecentAttendance";
import { useDepartmentSummary } from "../../hooks/useDepartmentSummary";

export default function Dashboard() {
  const {
    data: stats,
    isPending,
    isError,
  } = useDashboard();

  const {
    data: recentAttendance,
    isPending: attendanceLoading,
  } = useRecentAttendance();

  const {
    data: departmentSummary,
    isPending: departmentLoading,
  } = useDepartmentSummary();

  if (isPending) {
    return (
      <div className="p-6">
        Loading Dashboard...
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <div className="p-6 text-red-600">
        Unable to load dashboard.
      </div>
    );
  }

  return (
    <div className="space-y-8">

      <DashboardHeader />

      <StatsSection
        stats={stats}
      />

      <div className="grid gap-6 lg:grid-cols-2">

        <RecentAttendance
          loading={attendanceLoading}
          data={recentAttendance ?? []}
        />

        <DepartmentSummary
          loading={departmentLoading}
          data={departmentSummary ?? []}
        />

      </div>

    </div>
  );
}