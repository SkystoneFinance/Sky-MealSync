import { UserCheck, UserX, UtensilsCrossed } from "lucide-react";

import { StatCard } from "../ui";
import type { DashboardStats } from "../../types/dashboard";

function Placeholder() {
  return (
    <span className="inline-block h-8 w-16 animate-pulse rounded-md bg-zinc-100 align-middle">
      <span className="sr-only">Loading</span>
    </span>
  );
}

interface Props {
  stats: DashboardStats | undefined;
  error: boolean;
}

export default function StatsSection({ stats, error }: Props) {
  const empty = error ? "–" : <Placeholder />;

  const served = stats?.mealsServedToday ?? 0;
  const active = stats?.activeStaff ?? 0;
  const notServed = Math.max(0, active - served);
  const servedShare = active > 0 ? Math.round((served / active) * 100) : 0;

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <StatCard
        label="Served today"
        value={stats ? served.toLocaleString() : empty}
        hint={stats ? `${servedShare}% of active staff` : undefined}
        icon={<UtensilsCrossed size={16} />}
        tone="brand"
      />
      <StatCard
        label="Not yet served"
        value={stats ? notServed.toLocaleString() : empty}
        hint="Active staff without a meal today"
        icon={<UserX size={16} />}
      />
      <StatCard
        label="Active staff"
        value={stats ? active.toLocaleString() : empty}
        hint={
          stats
            ? `${stats.inactiveStaff.toLocaleString()} inactive · ${stats.totalStaff.toLocaleString()} total`
            : undefined
        }
        icon={<UserCheck size={16} />}
      />
    </div>
  );
}
