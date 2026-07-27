import DashboardHeader from "./components/DashboardHeader";
import StatsSection from "./components/statsSection";
import MealsSection from "./components/mealSection";

import { useDashboard } from "./api/useDashboard";

export default function Dashboard() {
  const { data, isPending, isError } = useDashboard();

  if (isPending) {
    return <p>Loading...</p>;
  }

  if (isError || !data) {
    return <p className="bg-red-800">Unable to load dashboard.</p>;
  }

  return (
    <div className="space-y-7">
      <DashboardHeader />

      <StatsSection stats={data.stats} />

      <MealsSection meals={data.meals} />
    </div>
  );
}