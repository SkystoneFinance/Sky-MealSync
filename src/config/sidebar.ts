import {
  LayoutDashboard,
  UtensilsCrossed,
  History,
  Scan,
  Users,
  User,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

import type { Role } from "../types/auth";

export interface SidebarItemConfig {
  title: string;
  path: string;
  icon: LucideIcon;
}

export const sidebarByRole: Record<Role, SidebarItemConfig[]> = {
  // ==================================
  // SUPER ADMIN
  // ==================================

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

  // ==================================
  // ADMIN
  // ==================================

  ADMIN: [
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
      title: "Scan QR Code",
      path: "/scan",
      icon: Scan,
    },

    {
      title: "Food Management",
      path: "/food-management",
      icon: User,
    },
  ],

  // ==================================
  // NORMAL USER / STAFF
  // ==================================

  USER: [
    {
      title: "Dashboard",
      path: "/",
      icon: LayoutDashboard,
    },

    {
      title: "Select Meal",
      path: "/meal-plan",
      icon: UtensilsCrossed,
    },

    {
      title: "My Profile",
      path: "/my-profile",
      icon: User,
    },
  ],
};