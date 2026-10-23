import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import AppShell from "../layout/AppShell";
import ProtectedRoute from "../../components/auth/protectedRoutes";
import RoleRoute from "../../components/auth/roleRoutes";

import Login from "../../components/auth/login";
import { PageLoader } from "../../components/ui";

// Pages load on demand so the first visit downloads less
const Dashboard = lazy(() => import("../../components/dashboard/dashboard"));
const StaffDashboard = lazy(() => import("../../components/stafff/staffDashboard"));
const CheckMeal = lazy(() => import("../../components/attendance/TodayAttendance"));
const History = lazy(() => import("../../components/history/History"));
const Staffs = lazy(() => import("../../components/stafff/staff"));
const Scan = lazy(() => import("../../components/scan/scan"));
const MyProfile = lazy(() => import("../../components/stafff/MyProfile"));
const WeeklyMealPlan = lazy(() => import("../../components/mealplan/weeklyplan"));
const FoodManagement = lazy(() => import("../../components/foodManagement/FoodManagement"));
const WeeklyPlanning = lazy(() => import("../../components/mealPlanning/WeeklyPlanning"));

import { useAuth } from "../../hooks/useAuth";

function DashboardEntry() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  if (user.role === "USER") {
    return <StaffDashboard />;
  }

  return <Dashboard />;
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>

          {/* DASHBOARD */}
          <Route index element={<DashboardEntry />} />

          {/* ADMIN / SUPER ADMIN */}
          <Route
            element={
              <RoleRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]} />
            }
          >
            <Route path="check-meal" element={<CheckMeal />} />
            <Route path="history" element={<History />} />
            <Route path="scan" element={<Scan />} />
            <Route path="weekly-planning" element={<WeeklyPlanning />} />
          </Route>

          {/* SUPER ADMIN */}
          <Route
            element={<RoleRoute allowedRoles={["SUPER_ADMIN"]} />}
          >
            <Route path="staff" element={<Staffs />} />
          </Route>

          {/* KITCHEN + ADMIN: menu editing */}
          <Route
            element={<RoleRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]} />}
          >
            <Route path="food-management" element={<FoodManagement />} />
          </Route>

          {/* NORMAL STAFF */}
          <Route
            element={<RoleRoute allowedRoles={["USER"]} />}
          >
            <Route path="meal-plan" element={<WeeklyMealPlan />} />
            <Route path="my-profile" element={<MyProfile />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </Suspense>
  );
}