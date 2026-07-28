import { Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "../layout/dashboardLayout";

import Dashboard from "../../components/dashboard/dashboard";
import CheckMeal from "../../components/dashboard/dashboard";
import History from "../../components/dashboard/dashboard";
// import Scan from "../../pages/scan";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Protected Dashboard Layout */}
      <Route element={<AdminLayout />}>
        {/* Dashboard */}
        <Route
          index
          element={<Dashboard />}
        />

        {/* Check Meal */}
        <Route
          path="check-meal"
          element={<CheckMeal />}
        />

        {/* History */}
        <Route
          path="history"
          element={<History />}
        />

        {/* Scan */}
        {/*
        <Route
          path="scan"
          element={<Scan />}
        />
        */}
      </Route>

      {/* Redirect unknown routes */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}