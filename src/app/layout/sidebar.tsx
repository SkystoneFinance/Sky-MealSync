import { motion } from "framer-motion";
import {
  LayoutDashboard,
  UtensilsCrossed,
  History,
  Scan,
} from "lucide-react";

import SidebarItem from "./sidebarItem";
import sidebarBg from "../../../public/foodbakground.jpg"


const menu = [
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
];

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-24 z-40 h-[calc(100vh-6rem)] w-72 overflow-hidden rounded-r-[42px]">
      {/* Background Image */}

      <img
          src={sidebarBg}
          alt=""
          className="absolute inset-0 h-full w-full object-cover scale-100"
      />

      <div className="absolute inset-0 bg-white/1" />

      {/* Main Glass */}

      <div className="absolute inset-0 rounded-r-[42px] border-r border-white/10 bg-white/28 backdrop-blur-sm shadow-[20px_0_60px_rgba(0,0,0,.12)]" />

      {/* White Glow */}

      <div className="absolute top-10 -right-20 h-80 w-80 rounded-full bg-white/90 blur-[120px]" />

      {/* Orange Glow */}

      <div className="absolute -bottom-24 -left-20 h-96 w-96 rounded-full bg-[#F7B548]/50 blur-[140px]" />

      {/* Soft Gradient */}

      <div className="absolute inset-0 bg-linear-to-b from-white/35 via-white/20 to-white/5" />

      {/* Highlight */}

      <div className="absolute right-0 top-0 h-full w-px bg-white/70" />

      {/* Noise Layer */}

      <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay bg-[radial-gradient(circle_at_1px_1px,#fff_1px,transparent_0)] bg-size-[18px_18px]" />

      <motion.div
        animate={{ y: [0, -3, 0] }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative flex h-full flex-col px-6 py-10">

        <div className="mt-8 flex flex-col gap-7">

          {menu.map((item) => (
            <SidebarItem
              key={item.title}
              {...item}
            />
          ))}

        </div>

        <div className="mt-auto border-t border-white/40 pt-6 text-sm text-slate-500">
          MealSync v1.0
        </div>

      </motion.div>

    </aside>
  );
}