import { UserRound } from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .35 }}
      className="flex items-center justify-between sm:py-8 lg:py-10"
    >
      <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-black">
        Dashboard
      </h1>

      <div className="flex items-center gap-2 rounded-xl bg-red-800 p-4 shadow-sm">
        <UserRound className="text-white" size={18} />

        <span className="text-sm text-white font-medium">
          Chef Choice
        </span>
      </div>
    </motion.div>
  );
}