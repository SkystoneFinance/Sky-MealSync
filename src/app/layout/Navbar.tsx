import { motion } from "framer-motion";
import { Bell } from "lucide-react";
import { FaThumbsUp } from "react-icons/fa";
import logo from "../../../public/logowhite.png";

export default function Navbar() {
  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: .45, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-[#f5f5f5] px-2 py-2 sm:px-3 md:px-4 lg:px-6">
      <div className="relative flex items-center justify-between overflow-hidden rounded-2xl border border-[#E31E24]/20 bg-linear-to-r from-[#760408] via-[#b50315] to-[#c70519] px-3 py-3 shadow-[0_20px_40px_rgba(0,0,0,.18)] sm:px-5 md:px-6 lg:rounded-3xl lg:px-8 lg:py-4">

        {/* Shine */}
        <div className="absolute inset-0 bg-linear-to-br from-[#E31E24]/20 via-transparent to-transparent pointer-events-none" />

        {/* Left */}
       <div className="flex items-center gap-3">

          <motion.img
            whileHover={{ rotate: -6, scale: 1.08 }}
            transition={{ type: "spring", stiffness: 300 }}
            src={logo}
            alt="MealSync Logo"
            className="brightness-0 invert object-contain w-26 md:w-42"
          />
        </div>

        {/* Right */}
        <div className="relative flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-6">

          <motion.div
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2.5 }}
          >
            <FaThumbsUp className="text-yellow-300 drop-shadow-lg text-xl sm:text-2xl md:text-3xl lg:text-[42px]" />
          </motion.div>

          <div className="leading-tight">

            <p className="text-[10px] text-red-100 sm:text-xs md:text-sm">
              Welcome back,
            </p>

            <h2 className="text-sm font-bold text-white sm:text-base md:text-lg lg:text-2xl">
              Staff Chef
            </h2>

          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: .95 }}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/15 backdrop-blur-xl sm:h-9 sm:w-9 md:h-10 md:w-10 lg:h-12 lg:w-12"
          >
            <Bell className="text-white" size={18} />
          </motion.button>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="h-9 w-9 overflow-hidden rounded-full border-2 border-white/30 bg-white shadow-xl sm:h-10 sm:w-10 md:h-12 md:w-12 lg:h-14 lg:w-14 lg:border-[3px]"
          >
            <img
              src="https://img.magnific.com/premium-vector/happy-female-chef-cartoon-avatar-culinary-brand_1300082-23459.jpg?semt=ais_hybrid&w=740&q=80"
              alt="Chef"
              className="h-full w-full object-cover"
            />
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
}