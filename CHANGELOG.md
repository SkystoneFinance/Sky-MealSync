# Changelog — Sky MealSync Frontend

All notable changes to this repo are recorded here. Format based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Newest first.
Add entries under **Unreleased** in the same PR as the change. When a batch is deployed to production, rename the
heading to the deploy date (e.g. `## 2026-10-02`).

Sections: **Added** · **Changed** · **Fixed** · **Removed** · **Security**

## [Unreleased]

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
