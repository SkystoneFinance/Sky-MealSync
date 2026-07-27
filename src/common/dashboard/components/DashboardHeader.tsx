import { UserRound } from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .35 }}
      className="flex items-center justify-between"
    >
      <h1 className="text-4xl font-bold tracking-tight text-black">
        Dashboard
      </h1>

      <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 shadow-sm">
        <UserRound size={18} />

        <span className="text-sm font-medium">
          Chef Admin
        </span>
      </div>
    </motion.div>
  );
}