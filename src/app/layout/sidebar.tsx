import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

import SidebarItem from "./sidebarItem";
import sidebarBg from "../../../public/foodbakground.jpg";

import { sidebarByRole } from "../../config/sidebar";
import { useAuth } from "../../context/AuthContext";

export default function Sidebar() {
  const { user } = useAuth();

  const menuItems = useMemo(() => {
    if (!user) return [];

    return sidebarByRole[user.role] ?? [];
  }, [user]);

  const [isOpen, setIsOpen] = useState(false);
  const [showMenuButton, setShowMenuButton] = useState(true);

  const lastScrollY = useRef(0);

  const closeSidebar = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (isOpen) {
        setShowMenuButton(true);
        lastScrollY.current = currentScrollY;
        return;
      }

      if (currentScrollY <= 20) {
        setShowMenuButton(true);
      } else if (currentScrollY > lastScrollY.current) {
        setShowMenuButton(false);
      } else if (currentScrollY < lastScrollY.current) {
        setShowMenuButton(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeSidebar();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isOpen}
        initial={false}
        animate={{
          y: showMenuButton || isOpen ? 0 : -100,
          opacity: showMenuButton || isOpen ? 1 : 0,
        }}
        transition={{
          duration: 0.25,
          ease: "easeOut",
        }}
        className={`fixed left-4 top-[5rem] z-[60] flex h-12 w-12 items-center justify-center rounded-2xl border border-white/40 bg-white/80 text-slate-700 shadow-lg backdrop-blur-xl lg:hidden ${
          showMenuButton || isOpen
            ? "pointer-events-auto"
            : "pointer-events-none"
        }`}
      >
        {isOpen ? <X /> : <Menu />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.button
            type="button"
            aria-label="Close navigation menu"
            onClick={closeSidebar}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-0 left-0 right-0 top-24 z-40 bg-slate-950/35 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed left-0 top-24 z-50 h-[calc(100dvh-6rem)] w-[min(18rem,88vw)] overflow-hidden rounded-r-[42px] transition-transform duration-300 ease-out lg:z-40 lg:w-72 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <img
          src={sidebarBg}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-white/1" />

        <div className="absolute inset-0 rounded-r-[42px] border-r border-white/10 bg-white/28 shadow-[20px_0_60px_rgba(0,0,0,.12)] backdrop-blur-sm" />

        <div className="absolute -right-20 top-10 h-80 w-80 rounded-full bg-white/90 blur-[120px]" />

        <div className="absolute -bottom-24 -left-20 h-96 w-96 rounded-full bg-[#F7B548]/50 blur-[140px]" />

        <div className="absolute inset-0 bg-linear-to-b from-white/35 via-white/20 to-white/5" />

        <div className="absolute right-0 top-0 h-full w-px bg-white/70" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#fff_1px,transparent_0)] bg-size-[18px_18px] opacity-[0.05] mix-blend-overlay" />

        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative flex h-full flex-col px-4 py-6 sm:px-6 lg:py-10"
        >
          <nav className="sidebar-scroll mt-14 flex flex-1 flex-col gap-3 pb-4 sm:gap-5 lg:mt-8 lg:gap-7">
            {menuItems.map((item) => (
              <SidebarItem
                key={item.path}
                {...item}
                onNavigate={closeSidebar}
              />
            ))}
          </nav>

          <div className="shrink-0 border-t border-white/40 pt-5 text-sm text-slate-500">
            MealSync v1.0
          </div>
        </motion.div>
      </aside>
    </>
  );
}