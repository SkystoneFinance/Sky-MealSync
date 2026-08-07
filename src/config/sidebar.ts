import {
  History,
  LayoutDashboard,
  QrCode,
  Scan,
  Users,
  UtensilsCrossed,
} from "lucide-react";

export const sidebarByRole = {
  SUPER_ADMIN: [
    {
      title: "Dashboard",
      path: "/",
      icon: LayoutDashboard,
    },
    {
      title: "Check Who Have Eaten",
      path: "/check-meal",
      icon: UtensilsCrossed,
    },
    {
      title: "History",
      path: "/history",
      icon: History,
    },
    {
      title: "Scan QR Code",
      path: "/scan",
      icon: Scan,
    },
    {
      title: "Staff Management",
      path: "/staff",
      icon: Users,
    },
  ],

  ADMIN: [
    {
      title: "Dashboard",
      path: "/",
      icon: LayoutDashboard,
    },
    {
      title: "Scan QR Code",
      path: "/scan",
      icon: Scan,
    },
    {
      title: "Check Who Have Eaten",
      path: "/check-meal",
      icon: UtensilsCrossed,
    },
  ],

  USER: [
    {
      title: "Dashboard",
      path: "/",
      icon: LayoutDashboard,
    },
    {
      title: "My QR Code",
      path: "/my-qr",
      icon: QrCode,
    },
    {
      title: "My Attendance",
      path: "/my-attendance",
      icon: History,
    },
  ],
};