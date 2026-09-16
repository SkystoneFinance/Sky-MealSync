import { useAuth } from "../hooks/useAuth";

import Dashboard from "../components/dashboard/dashboard";
import StaffDashboard from "../components/stafff/staffDashboard";

export default function DashboardEntry() {
  const { user } = useAuth();

  if (user?.role === "USER") {
    return <StaffDashboard />;
  }

  return <Dashboard />;
}