# Changelog — Sky MealSync Frontend

All notable changes to this repo are recorded here. Format based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Newest first.
Add entries under **Unreleased** in the same PR as the change. When a batch is deployed to production, rename the
heading to the deploy date (e.g. `## 2026-10-02`).

Sections: **Added** · **Changed** · **Fixed** · **Removed** · **Security**

## [Unreleased]

### Changed
- **Complete UI redesign** ("clean & light"): new shared UI kit (`src/components/ui`), new app shell (white sidebar with role-based navigation and a user card with logout, mobile top bar and drawer), and every screen rebuilt: sign-in, staff home, My meals, My QR code, Overview, Weekly planning, Menu, Scan, Served today, Reports, Staff.
- Font is now Futura (falls back to Jost, an open-source Futura revival, where Futura isn't installed). Only the Skystone logo, name and red (#B10F16) were kept.
- Navigation renamed per role: staff see Home, My meals and My QR code; the kitchen sees Overview, Weekly planning, Menu, Scan and Served today; administrators see Overview, Weekly planning, Served today, Reports, Scan and Staff.
- The Menu page is now a week-by-week dish editor.

### Added
- **Week arrows** on My meals and Weekly planning: view this week and past weeks read-only (including weeks chosen day by day before weekly planning), and plan up to two weeks ahead.
- Staff home shows today's meal and the status of the next two weeks.
- Staff can be edited and activated or deactivated from the Staff page.
- Served today shows the dish each person chose, and search matches dish names.

### Removed
- framer-motion animations, react-icons, the old Navbar/Sidebar and unused files (`App.tsx`, `pages/DashboardEntry.tsx`, `utils/download.ts`, unused history/report components and hooks, OTP types, `tailwind.config.ts`).

## 2026-10-21

### Added
- **Weekly meal planning.** Staff choose next week's meals (or "No meal required") on Select Meal, prompted by a prominent banner on their home page once the menu is published. A new **Weekly Planning** page (chef and SUPER_ADMIN) handles closed days, publishing, a copyable WhatsApp announcement, and the Meal Preparation Summary with Excel export. Dashboard banners remind the chef to publish (from Tuesday) and announce when the week is confirmed.

### Changed
- The staff dashboard shows next week's plan status and deadline instead of "X / 5 selected this week". Today's meal shows "No meal today" when chosen.
- Removed the old per-day selection page and its create/update calls.

### Fixed
- Tailwind text colours on links were overridden by a global CSS rule.
- After a reload, staff were treated as admins (now on `fix/api-auth-and-toasts`).

### Fixed
- Pop-up (toast) messages now appear: login errors, scan results, staff import results. The `<Toaster />` was never mounted.

## 2026-10-20

### Added
- **Log out** button in the sidebar (asks for confirmation).
- Sliding sessions: the app renews the login token on load and at most once a day while open (`src/lib/session.ts`), so active users never have to log in again. Needs backend `POST /auth/refresh`.
- If the API rejects the token (401), the user is returned to the login screen.
- Project documentation: rewrote `README.md` and added `docs/ARCHITECTURE.md`, `docs/PRD.md`, `docs/KNOWN_ISSUES.md`,
  `CHANGELOG.md`, `.env.example` and `CLAUDE.md`.

### Fixed
- A network error or server downtime while opening the app no longer logs the user out. Only a 401/403/404 from the server ends the session.
- Logging out clears cached data so the next user doesn't see the previous user's data.

---

## History before this changelog (reconstructed from git, 2026-07-27 → 2026-09-30)

Commit messages from this period are brief, so this is a summary rather than a precise record.

- **2026-09-30** — Meal plan: changing an existing day's selection now updates it instead of creating a new one ("Meal change logic").
- **2026-09-25 → 09-28** — Staff login reworked to staff number + 4-digit PIN with first-time activation. Error messages improved.
- **2026-09-24** — Scan flow: preview first, then "Mark as Eaten", with remaining servings shown. Food Management updates.
- **2026-09-16 → 09-21** — Food options (daily menu) management and staff weekly meal selection. Staff profile page with QR.
- **2026-09-01 → 09-02** — History page with period filters and Excel export.
- **2026-08-05 → 08-13** — UI refresh. Role-based access (SUPER_ADMIN / ADMIN / USER). Added `vercel.json` for SPA routing.
- **2026-07-27 → 07-30** — Initial app: dashboard, staff, attendance, QR scan, report download.
