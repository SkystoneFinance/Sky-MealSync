import { useEffect, useState } from "react";

import {
  NavLink,
  Outlet,
  useLocation,
} from "react-router-dom";

import {
  LogOut,
  Menu,
  X,
} from "lucide-react";

import { useAuth } from "../../hooks/useAuth";

import {
  navByRole,
  ROLE_LABEL,
} from "../../config/sidebar";

import { displayName } from "../../lib/userDisplay";

import {
  Avatar,
  Button,
  cn,
} from "../../components/ui";

function Logo() {
  return (
    <NavLink to="/" className="flex items-center gap-3" aria-label="MealSync home">
      <img src="/logoblack.png" alt="Skystone" className="h-7 w-auto" />
      <span className="h-5 w-px bg-zinc-200" aria-hidden="true" />
      <span className="text-sm font-semibold tracking-wide text-zinc-900">
        MealSync
      </span>
    </NavLink>
  );
}

function Navigation({ onNavigate }: { onNavigate?: () => void }) {
  const { user } = useAuth();
  const items = user ? navByRole[user.role] ?? [] : [];

  return (
    <nav className="flex flex-col gap-0.5" aria-label="Main">
      {items.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === "/"}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              "group flex items-center gap-3 rounded-lg px-3 py-2 text-[15px] font-medium transition-colors",
              isActive
                ? "bg-brand-50 text-brand-700"
                : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
            )
          }
        >
          {({ isActive }) => (
            <>
              <item.icon
                size={18}
                strokeWidth={isActive ? 2.25 : 1.75}
                className={isActive ? "text-brand-600" : "text-zinc-400 group-hover:text-zinc-600"}
              />
              {item.title}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

function UserCard() {
  const { user, logout } = useAuth();

  if (!user) return null;

  const name = displayName(user);

  const handleLogout = () => {
    // Sessions are long-lived, so confirm before ending one
    if (window.confirm("Log out of MealSync?")) {
      logout();
    }
  };

  return (
    <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-2.5">
      <Avatar name={name} />
      <div className="min-w-0 flex-1 leading-tight">
        <p className="truncate text-sm font-semibold text-zinc-900">{name}</p>
        <p className="truncate text-xs text-zinc-500">{ROLE_LABEL[user.role]}</p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Log out"
        title="Log out"
        onClick={handleLogout}
        icon={<LogOut size={17} />}
      />
    </div>
  );
}

export default function AppShell() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Close the mobile drawer whenever the page changes
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-dvh">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-zinc-200 bg-white px-4 py-5 lg:flex">
        <div className="px-2">
          <Logo />
        </div>
        <div className="mt-8 flex-1 overflow-y-auto">
          <Navigation />
        </div>
        <UserCard />
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-zinc-200 bg-white/90 px-4 backdrop-blur lg:hidden">
        <Logo />
        <Button
          variant="ghost"
          size="icon"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen(true)}
          icon={<Menu size={20} />}
        />
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-zinc-950/30"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute inset-y-0 left-0 flex w-[min(18rem,85vw)] flex-col bg-white px-4 py-5 shadow-pop">
            <div className="flex items-center justify-between px-2">
              <Logo />
              <Button
                variant="ghost"
                size="icon"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                icon={<X size={20} />}
              />
            </div>
            <div className="mt-8 flex-1 overflow-y-auto">
              <Navigation onNavigate={() => setOpen(false)} />
            </div>
            <UserCard />
          </div>
        </div>
      )}

      <main className="lg:pl-64">
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-10 lg:px-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
