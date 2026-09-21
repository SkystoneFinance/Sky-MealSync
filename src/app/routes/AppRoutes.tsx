import { Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "../layout/dashboardLayout";
import ProtectedRoute from "../../components/auth/protectedRoutes";
import RoleRoute from "../../components/auth/roleRoutes";

import Login from "../../components/auth/login";
import Dashboard from "../../components/dashboard/dashboard";
import StaffDashboard from "../../components/stafff/staffDashboard";

import CheckMeal from "../../components/attendance/TodayAttendance";
import History from "../../components/history/History";
import Staffs from "../../components/stafff/staff";
import Scan from "../../components/scan/scan";

import MyProfile from "../../components/stafff/MyProfile";
import WeeklyMealPlan from "../../components/mealplan/weeklyplan";
import FoodManagement from "../../components/foodManagement/FoodManagement";


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
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>

          {/* DASHBOARD */}
          <Route index element={<DashboardEntry />} />

          {/* ADMIN / SUPER ADMIN */}
          <Route path="check-meal" element={<CheckMeal />} />
          <Route path="history" element={<History />} />

          <Route
            element={
              <RoleRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]} />
            }
          >
            <Route path="scan" element={<Scan />} />
          </Route>

          {/* SUPER ADMIN */}
          <Route
            element={<RoleRoute allowedRoles={["SUPER_ADMIN"]} />}
          >
            <Route path="staff" element={<Staffs />} />
          </Route>

          {/* NORMAL STAFF */}
          <Route
            element={<RoleRoute allowedRoles={["ADMIN"]} />}
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
  );
}