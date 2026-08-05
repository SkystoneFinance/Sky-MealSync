import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  path: string;
  icon: LucideIcon;
  onNavigate?: () => void;
}

export default function SidebarItem({
  title,
  path,
  icon: Icon,
  onNavigate,
}: Props) {
  return (
    <NavLink
      to={path}
      end={path === "/"}
      onClick={onNavigate}
      className="block"
    >
      {({ isActive }) => (
        <motion.div
          whileHover={{ x: 8, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{
            type: "spring",
            stiffness: 350,
            damping: 22,
          }}
          className={`relative overflow-hidden rounded-3xl px-4 py-3 transition-all sm:px-5 ${
            isActive
              ? "bg-white/85 shadow-[0_18px_35px_rgba(0,0,0,.12)] backdrop-blur-sm"
              : "hover:bg-white/55"
          }`}
        >
          {isActive && (
            <motion.div
              layoutId="sidebar-active"
              className="absolute bottom-3 left-0 top-3 w-1.5 rounded-full bg-[#B10F16]"
            />
          )}

          {/* Gloss */}
          <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-white/70 via-transparent to-transparent" />

          {/* Soft reflection */}
          <div className="absolute -top-10 left-0 h-20 w-full bg-white/20 blur-2xl" />

          <div className="relative flex items-center gap-3 sm:gap-4">
            <motion.div
              whileHover={{ rotate: -8 }}
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all sm:h-12 sm:w-12 ${
                isActive
                  ? "bg-[#FDEBEC]"
                  : "bg-white/40 backdrop-blur-xl"
              }`}
            >
              <Icon
                size={22}
                className={
                  isActive ? "text-[#B10F16]" : "text-slate-500"
                }
              />
            </motion.div>

            <span
              className={`text-sm font-semibold transition-colors sm:text-base ${
                isActive ? "text-slate-900" : "text-slate-600"
              }`}
            >
              {title}
            </span>
          </div>

          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(247,181,72,.28),transparent_55%)]" />
        </motion.div>
      )}
    </NavLink>
  );
}