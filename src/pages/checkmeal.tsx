import { useMemo, useState } from "react";
import { StaffCard } from "../components/staffCard";

type StaffWithStatus = {
  id: number;
  name: string;
  department: string;
  createdAt: string;
  updatedAt: string;
  eatenToday: boolean;
  weeklyCount: number;
  weeklyTarget: number;
};

type WeeklyStats = {
  totalStaff: number;
  totalMealsThisWeek: number;
  averagePerStaff: number;
};

// ============================================
// Mock data — stands in for the API until the
// backend (Express + Prisma + Postgres) is wired up
// ============================================
const initialStaff: StaffWithStatus[] = [
  { id: 1, name: "John Doe", department: "Kitchen", createdAt: "", updatedAt: "", eatenToday: true, weeklyCount: 3, weeklyTarget: 5 },
  { id: 2, name: "Jane Smith", department: "Bar", createdAt: "", updatedAt: "", eatenToday: false, weeklyCount: 4, weeklyTarget: 5 },
  { id: 3, name: "Bob Johnson", department: "Floor", createdAt: "", updatedAt: "", eatenToday: true, weeklyCount: 2, weeklyTarget: 5 },
  { id: 4, name: "Mary Wilson", department: "Kitchen", createdAt: "", updatedAt: "", eatenToday: true, weeklyCount: 5, weeklyTarget: 5 },
  { id: 5, name: "Ahmed Musa", department: "Floor", createdAt: "", updatedAt: "", eatenToday: false, weeklyCount: 1, weeklyTarget: 5 },
  { id: 6, name: "Grace Okafor", department: "Bar", createdAt: "", updatedAt: "", eatenToday: false, weeklyCount: 3, weeklyTarget: 5 },
];

function computeWeeklyStats(staff: StaffWithStatus[]): WeeklyStats {
  const totalStaff = staff.length;
  const totalMealsThisWeek = staff.reduce((sum, s) => sum + s.weeklyCount, 0);
  const averagePerStaff = totalStaff === 0
    ? 0
    : Math.round((totalMealsThisWeek / totalStaff) * 10) / 10;

  return { totalStaff, totalMealsThisWeek, averagePerStaff };
}

export function Dashboard() {
  const [staff, setStaff] = useState<StaffWithStatus[]>(initialStaff);

  const stats = useMemo(() => computeWeeklyStats(staff), [staff]);

  const today = useMemo(
    () =>
      new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    []
  );

  function handleMarkEaten(staffId: number) {
    setStaff((prev) =>
      prev.map((s) =>
        s.id === staffId
          ? { ...s, eatenToday: true, weeklyCount: s.weeklyCount + 1 }
          : s
      )
    );
  }

  function handleUndo(staffId: number) {
    setStaff((prev) =>
      prev.map((s) =>
        s.id === staffId
          ? { ...s, eatenToday: false, weeklyCount: Math.max(0, s.weeklyCount - 1) }
          : s
      )
    );
  }

  return (
    <div className="min-h-screen bg-surface-bg p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between mb-4">
        <h1 className="text-page-title font-bold text-primary">
          Chef's Meal Tracker
        </h1>
        <p className="text-meta text-text-light">{today}</p>
      </div>

      {/* Weekly stats bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <StatCard label="Staff members" value={stats.totalStaff} />
        <StatCard label="Served this week" value={stats.totalMealsThisWeek} />
        <StatCard label="Average per staff" value={stats.averagePerStaff} />
      </div>

      {/* Nav actions — wired up as real routes later */}
      <div className="flex flex-wrap gap-2 mb-6">
        <NavButton label="Manage staff" />
        <NavButton label="History" />
        <NavButton label="Export reports" />
      </div>

      {/* Staff grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {staff.map((s) => (
          <StaffCard
            key={s.id}
            staff={s}
            onMarkEaten={handleMarkEaten}
            onUndo={handleUndo}
          />
        ))}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-surface-card border border-surface-border p-4 shadow-card">
      <p className="text-stat font-bold text-primary">{value}</p>
      <p className="text-meta text-text-light">{label}</p>
    </div>
  );
}

function NavButton({ label }: { label: string }) {
  return (
    <button className="rounded-md border border-surface-border bg-surface-card px-4 py-2 text-meta font-semibold text-text hover:bg-primary-light transition-colors duration-fast min-h-tap">
      {label}
    </button>
  );
}
