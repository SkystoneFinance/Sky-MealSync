import {
  CalendarRange,
  ChartColumn,
  ChefHat,
  ClipboardCheck,
  House,
  QrCode,
  ScanLine,
  UsersRound,
  UtensilsCrossed,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

import type { Role } from "../types/auth";

export interface NavItem {
  title: string;
  path: string;
  icon: LucideIcon;
}

export const ROLE_LABEL: Record<Role, string> = {
  SUPER_ADMIN: "Administrator",
  ADMIN: "Kitchen",
  USER: "Staff",
};

export const navByRole: Record<Role, NavItem[]> = {
  SUPER_ADMIN: [
    { title: "Overview", path: "/", icon: House },
    { title: "Weekly planning", path: "/weekly-planning", icon: CalendarRange },
    { title: "Served today", path: "/check-meal", icon: ClipboardCheck },
    { title: "Reports", path: "/history", icon: ChartColumn },
    { title: "Scan", path: "/scan", icon: ScanLine },
    { title: "Staff", path: "/staff", icon: UsersRound },
  ],

  ADMIN: [
    { title: "Overview", path: "/", icon: House },
    { title: "Weekly planning", path: "/weekly-planning", icon: CalendarRange },
    { title: "Menu", path: "/food-management", icon: ChefHat },
    { title: "Scan", path: "/scan", icon: ScanLine },
    { title: "Served today", path: "/check-meal", icon: ClipboardCheck },
  ],

  USER: [
    { title: "Home", path: "/", icon: House },
    { title: "My meals", path: "/meal-plan", icon: UtensilsCrossed },
    { title: "My QR code", path: "/my-profile", icon: QrCode },
  ],
};
