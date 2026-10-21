# Known Issues & Tech Debt

Found during the documentation review on 2026-09-30. When you fix one, move it to **Resolved** with the date and PR,
and add a CHANGELOG entry. `FE` = this repo, `BE` = backend repo `mealSync`.

Severity: 🔴 fix soon · 🟠 important · 🟡 minor / cleanup

## Security & data safety

| # | Sev | Where | Issue |
|---|---|---|---|
| S4 | 🟡 | BE auth | No server-side token revocation. A stolen token works until it expires (90 days), unless the account is deactivated, which blocks refresh but not the current token. |
| S5 | 🟠 | BE `staffAuth` | 4-digit PIN with **no rate limiting or lockout**, so it can be brute-forced. |
| S8 | 🟡 | FE `.env` | `.env` is committed and not in `.gitignore`. It only holds `VITE_API_URL` (not secret), but add `.env` to `.gitignore` before secrets land there. |
| S9 | 🟡 | FE | JWT kept in `localStorage` (XSS exposure). Role is trusted from `localStorage` until `/me` returns. |
| S10 | 🟡 | FE Navbar | Hotlinks an avatar image from a third-party site on every page load. |

## Functional bugs

| # | Sev | Where | Issue |
|---|---|---|---|
| F3 | 🟠 | FE `mealplan/weeklyplan.tsx` | Submitting needs all 5 days, but past days are locked. A staff member who missed a day can't save the rest of the week. Locked days are also re-sent on submit. |
| F4 | 🟠 | FE `weeklyplan.tsx` | `submitted` never resets when changing week, so the button stays disabled. The spinner ignores the update mutation. |
| F5 | 🟠 | FE `stafff/staffTable.tsx:77` | Staff **Edit button does nothing**. There's no UI to activate or deactivate staff, though the API supports it. |
| F6 | 🟠 | BE socket plugin + CORS | Socket.IO CORS only allows `localhost:5173`. The frontend doesn't listen to `attendance:new` anyway. |
| F7 | 🟡 | BE reports | Scanning, serving and the dashboard now use the Lagos day (`businessToday()`). The reports module still uses `startOfDay()` in the server's time zone; correct while Render runs in UTC, but should be moved to `businessToday()` too. |
| F8 | 🟡 | FE `login.tsx:77, 218` | Navigates to `/dashboard` and `/staff/dashboard`, which don't exist. It only works through the `*` redirect. |
| F9 | 🟡 | FE `AppRoutes.tsx:49-50` | `/check-meal` and `/history` have no role guard, so staff can open them by URL. |
| F10 | 🟡 | FE routes/sidebar | SUPER_ADMIN can't open Food Management, and ADMIN has no History link. Confirm this is intended. |
| F11 | 🟡 | FE `DemandSummaryCard.tsx:45` | Title says "Today's Meal Demand" whatever date is picked. |
| F12 | 🟡 | FE Navbar / DashboardHeader | Hard-coded "Welcome back, Staff Chef" for every user. The "Chef Choice" pill and bell button do nothing. |
| F13 | 🟡 | FE scan | The staff's QR image is shown as their photo. |
| F14 | 🟡 | FE QR download | `<a download>` is ignored for cross-origin URLs. |
| F16 | 🟡 | FE food management | Errors only go to `console.error`. The image is a URL text field with no upload. |

## Weekly meal planning: known limitations

| # | Sev | Issue |
|---|---|---|
| P1 | 🟡 | After publishing, the chef can still change a dish's date or disable it in Food Management. Staff who chose it keep that choice and the summary still counts it (shown as "disabled"). Consider locking dishes of published weeks. |
| P2 | 🟡 | SUPER_ADMIN can open Weekly Planning but not Food Management, so can't add dishes. |
| P3 | 🟡 | The Food Management "Meal Demand" card still exists alongside the new summary. Consider removing it. |
| P4 | 🟡 | The dev database contains test data: staff `DEVTEST01` and `DEVTEST02` and "(dev test)" dishes for 26–29 Oct. |

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
| S6 Anyone could change or delete anyone's meal selection by ID | 2026-10-21 | `feature/weekly-meal-planning`: old write endpoints removed; selections are written only for the caller via `PUT /meal-plan` |
| Invalid input returned 500 "Internal Server Error" instead of a 400 with the reason | 2026-10-21 | `feature/weekly-meal-planning`: `plugins/zod.ts` and error handler |
| Link colours from Tailwind classes were ignored (global `a { color: inherit }` outside a layer) | 2026-10-21 | `feature/weekly-meal-planning`: `index.css` |
| After a reload, staff were treated as admins (role missing from `/staff-auth/me`) | 2026-10-21 | `fix/api-auth-and-toasts` |
| S1 No authentication on staff, attendance, dashboard and reports API routes | 2026-10-21 | `fix/api-auth-and-toasts`: staff management requires SUPER_ADMIN; attendance, dashboard and reports require ADMIN or SUPER_ADMIN |
| F1 No `<Toaster />` mounted, so pop-up messages never showed | 2026-10-21 | `fix/api-auth-and-toasts` |
| S2 Local development used the production database | 2026-10-20 | Neon dev child branch |
| S3 `JWT_SECRET` unset on Render / public default | 2026-10-20 | Set on Render; server now refuses to start without it (PR #1) |
| S7 Seed accounts with the public password in production | 2026-10-20 | Passwords changed directly in production |
| F2 No logout button | 2026-10-20 | `feature/sliding-sessions`: Log out in the sidebar |
| F15 No 401 handling; cache not cleared on logout | 2026-10-20 | `feature/sliding-sessions` |
| S4 (part) JWTs never expired | 2026-10-20 | `feature/sliding-sessions`: 90-day sliding expiry |
| Admin login response included the bcrypt password hash | 2026-10-20 | `feature/sliding-sessions` |
| A network error on page load logged the user out | 2026-10-20 | `feature/sliding-sessions` |
