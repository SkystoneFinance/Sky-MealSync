import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number | string;
  Icon: LucideIcon;
}

export default function StatsCard({
  title,
  value,
  Icon,
}: StatsCardProps) {
  return (
    <motion.div
      whileHover={{
        y: -5,
        scale: 1.02,
      }}
      transition={{
        duration: 0.25,
      }}
      className="flex h-28 items-center justify-between
        rounded-2xl bg-white px-5 shadow-[0_8px_25px_rgba(0,0,0,0.12)]">
      {/* Left */}

      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-600">
          {title}
        </p>

        <h2 className="text-5xl font-bold tracking-tight text-black">
          {value}
        </h2>
      </div>

      {/* Right */}

      <div
        className="
          flex h-16 w-16 items-center justify-center 
          rounded-2xl bg-gray-200 shadow-inner">
        <Icon
          size={30}
          className="text-gray-700"
        />
      </div>
    </motion.div>
  );
}