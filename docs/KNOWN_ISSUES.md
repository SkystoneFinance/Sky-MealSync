# Known Issues & Tech Debt

Found during the documentation review on 2026-09-30. When you fix one, move it to **Resolved** with the date and PR,
and add a CHANGELOG entry. `FE` = this repo, `BE` = backend repo `mealSync`.

Severity: 🔴 fix soon · 🟠 important · 🟡 minor / cleanup

## Security & data safety

| # | Sev | Where | Issue |
|---|---|---|---|
| S1 | 🔴 | BE `staff`, `attendance`, `dashboard`, `reports` routes | **No authentication on the server.** Anyone who knows the API URL can list, create, edit or delete staff, record servings, and download reports. The UI hides these screens, but the API does not check. Add `authenticate` + `authorize(...)` preHandlers. |
| S2 | 🔴 | Environment | **Local development used the production database.** A Neon dev child branch now exists (2026-10-20). Make sure every local `.env` points at it. |
| S3 | 🔴 | Render env | `JWT_SECRET` falls back to a hard-coded string, and **confirmed 2026-10-20: it is not set on Render**. Production tokens are signed with the default string in the source code, so anyone with repo access can forge admin tokens. The code fix (refuse to start without it) is in `feature/sliding-sessions`. **Set `JWT_SECRET` on Render before merging**, or the deploy will fail to start. |
| S4 | 🟡 | BE auth | No server-side token revocation. A stolen token works until it expires (90 days), unless the account is deactivated, which blocks refresh but not the current token. |
| S5 | 🟠 | BE `staffAuth` | 4-digit PIN with **no rate limiting or lockout**, so it can be brute-forced. |
| S6 | 🟠 | BE `mealSelection` PATCH/DELETE `/:id` | Doesn't check that the selection belongs to the caller, so any logged-in user can change anyone's selection by ID. |
| S7 | 🔴 | BE `prisma/seed.ts` / production data | Seeds three accounts with a shared password that is visible in the **public** repo. **Confirmed 2026-10-20:** `admin@mealsync.com` (SUPER_ADMIN) logs in with it on the dev branch, which is a copy of production, so it very likely works in production too. Change the password or deactivate these accounts in production now. |
| S8 | 🟡 | FE `.env` | `.env` is committed and not in `.gitignore`. It only holds `VITE_API_URL` (not secret), but add `.env` to `.gitignore` before secrets land there. |
| S9 | 🟡 | FE | JWT kept in `localStorage` (XSS exposure). Role is trusted from `localStorage` until `/me` returns. |
| S10 | 🟡 | FE Navbar | Hotlinks an avatar image from a third-party site on every page load. |

## Functional bugs

| # | Sev | Where | Issue |
|---|---|---|---|
| F1 | 🔴 | FE app root | **No `<Toaster />` is mounted**, so every `react-hot-toast` message is invisible: login errors, scan results, max-serving errors, import results. |
| F3 | 🟠 | FE `mealplan/weeklyplan.tsx` | Submitting needs all 5 days, but past days are locked. A staff member who missed a day can't save the rest of the week. Locked days are also re-sent on submit. |
| F4 | 🟠 | FE `weeklyplan.tsx` | `submitted` never resets when changing week, so the button stays disabled. The spinner ignores the update mutation. |
| F5 | 🟠 | FE `stafff/staffTable.tsx:77` | Staff **Edit button does nothing**. There's no UI to activate or deactivate staff, though the API supports it. |
| F6 | 🟠 | BE socket plugin + CORS | Socket.IO CORS only allows `localhost:5173`. The frontend doesn't listen to `attendance:new` anyway. |
| F7 | 🟠 | BE dates | "Today" uses the server's time zone (`startOfDay(new Date())`). If the host runs UTC, day boundaries and locks shift. |
| F8 | 🟡 | FE `login.tsx:77, 218` | Navigates to `/dashboard` and `/staff/dashboard`, which don't exist. It only works through the `*` redirect. |
| F9 | 🟡 | FE `AppRoutes.tsx:49-50` | `/check-meal` and `/history` have no role guard, so staff can open them by URL. |
| F10 | 🟡 | FE routes/sidebar | SUPER_ADMIN can't open Food Management, and ADMIN has no History link. Confirm this is intended. |
| F11 | 🟡 | FE `DemandSummaryCard.tsx:45` | Title says "Today's Meal Demand" whatever date is picked. |
| F12 | 🟡 | FE Navbar / DashboardHeader | Hard-coded "Welcome back, Staff Chef" for every user. The "Chef Choice" pill and bell button do nothing. |
| F13 | 🟡 | FE scan | The staff's QR image is shown as their photo. |
| F14 | 🟡 | FE QR download | `<a download>` is ignored for cross-origin URLs. |
| F16 | 🟡 | FE food management | Errors only go to `console.error`. The image is a URL text field with no upload. |

## Dead code / cleanup

- **FE empty:** `src/lib/auth.ts`, `src/components/scan/scanResult.tsx`
- **FE fully commented out:** `services/history.service.ts`, `components/reports/report.tsx`, `components/dashboard/mealSection.tsx`
- **FE unused:** `src/App.tsx`, `pages/DashboardEntry.tsx`, `history/HistoryTable.tsx`, `history/ReportButtons.tsx`, `utils/download.ts`, `hooks/useHistory.ts` (duplicate of `useattendance.ts`), `types/history.ts`, OTP types in `types/auth.ts`, `authService.staffMe`
- **FE naming:** folder `stafff/`, package name `foodsystem`, `tailwind.config.ts` colour (`#991B1B`) not used (UI hard-codes `#B10F16`), `date-fns` / `autoprefixer` / `postcss` unused
- **BE empty placeholder files:** most of `src/shared/**`, `src/server.ts`, `src/middleware/authenticate.ts`, `src/modules/settings/socket.ts`
- **BE duplicates:** `middleware/role.ts` duplicates `auth.ts` + `authorize.ts`. `plugins/zod.ts` and `middleware/validation.ts` both define `validate()`
- **BE unused:** `NotificationService`, `utils/jwt.ts`, `Staff.phoneNumber` (from the removed OTP flow), `Staff.hasActivedAccount` (misspelt; not what activation checks)
- **Both:** no automated tests, no CI checks

## Resolved

| Was | Fixed | Change |
|---|---|---|
| F2 No logout button | 2026-10-20 | `feature/sliding-sessions`: Log out in the sidebar |
| F15 No 401 handling; cache not cleared on logout | 2026-10-20 | `feature/sliding-sessions` |
| S4 (part) JWTs never expired | 2026-10-20 | `feature/sliding-sessions`: 90-day sliding expiry |
| Admin login response included the bcrypt password hash | 2026-10-20 | `feature/sliding-sessions` |
| A network error on page load logged the user out | 2026-10-20 | `feature/sliding-sessions` |
