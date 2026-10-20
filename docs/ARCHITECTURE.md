# MealSync — How It Works End to End

MealSync is Skystone Finance's staff canteen system. Staff **pre-select a meal for each weekday**, the kitchen
**scans each person's QR code** at serving time to confirm they ordered and record that they ate, and admins get
**live attendance, history and Excel reports**.

## System overview

```
 ┌────────────────────────────┐        HTTPS / JSON (axios)        ┌─────────────────────────────┐        Prisma        ┌──────────────────┐
 │  Sky-MealSync (this repo)  │ ─────────────────────────────────▶ │  mealSync (backend repo)    │ ───────────────────▶ │  Neon            │
 │  React 19 + Vite SPA       │    Authorization: Bearer <JWT>     │  Fastify 5 API  /api/v1     │                      │  PostgreSQL      │
 │  Hosted on Vercel          │ ◀───────────────────────────────── │  Socket.IO (attendance:new) │ ◀─────────────────── │  (production)    │
 └────────────────────────────┘                                    └─────────────────────────────┘                      └──────────────────┘
        ▲  browser: admins, kitchen, staff (phone camera for scanning)
```

| Layer | Repo | Tech | Hosted |
|---|---|---|---|
| Frontend | [SkystoneFinance/Sky-MealSync](https://github.com/SkystoneFinance/Sky-MealSync) | React 19, TypeScript, Vite 8, Tailwind 4, React Query 5, axios, html5-qrcode | Vercel (auto-deploys `main`; preview per branch) |
| Backend | [SkystoneFinance/mealSync](https://github.com/SkystoneFinance/mealSync) | Fastify 5, Prisma 6, Zod, JWT, bcrypt, Socket.IO, ExcelJS | Render (auto-deploys `main`) |
| Database | — | Neon PostgreSQL (production branch + dev child branch) | Neon |

The frontend never talks to the database directly; everything goes through the backend API. The API base URL comes
from the frontend env var `VITE_API_URL`.

## Users and roles

| Role | Who | Logs in with | Can do |
|---|---|---|---|
| `SUPER_ADMIN` | HR / system owner | email + password | Dashboard, who has eaten, history & reports, scan, **staff management** |
| `ADMIN` | Kitchen / chef | email + password | Dashboard, who has eaten, scan, **food (menu) management** |
| `USER` | Any employee | staff number + 4-digit PIN | Own dashboard, **weekly meal selection**, profile & personal QR code |

Admin accounts are created directly in the database (see `prisma/seed.ts` in the backend). Staff records are created
by a SUPER_ADMIN; staff then activate their own login.

## The meal lifecycle

```
 1. ONBOARD        2. MENU             3. SELECT            4. SERVE (scan)                   5. REPORT
 SUPER_ADMIN       ADMIN (chef)        STAFF                ADMIN at the counter              SUPER_ADMIN
 adds staff   ──▶  adds dishes    ──▶  picks one dish  ──▶  scans staff QR ─▶ preview ─▶  ──▶ dashboard, history,
 (form/Excel)      per date            per weekday          "Mark as eaten" = Attendance row   Excel export
 → QR generated                        (locks on the day)   (max 3 servings/day)
```

### 1. Staff onboarding
- SUPER_ADMIN opens **Staff Management** (`/staff`) and creates staff one by one or imports an `.xlsx`
  (columns: staff number, first name, last name, department; header in row 1).
- The backend creates a `Staff` row with a random `qrCodeId` and stores the QR code image (PNG data-URL).
- The QR can be downloaded from the staff table, and staff can download their own from **My Profile**.

### 2. Staff account activation and login
- First time: on the login screen's **Staff** tab → *Activate*, the employee enters their staff number and chooses a
  4-digit PIN → `POST /staff-auth/activate`. This creates their linked `User` (role `USER`) with the hashed PIN.
- After that: staff number + PIN → `POST /staff-auth/login` → JWT.
- Admins use the **Admin** tab: email + password → `POST /auth/login` → JWT.
- The JWT and user object are kept in `localStorage` (`token`, `user`, `tokenRefreshedAt`). `src/lib/axios.ts` attaches the token to
  every request. On page load `AuthProvider` re-validates with `/staff-auth/me` or `/auth/me`. Only a 401/403/404 logs the user out;
  network errors keep the session.
- **Sliding sessions:** tokens last 90 days. The app calls `POST /auth/refresh` on load, on an hourly timer and when the tab becomes
  visible, but at most once a day (`src/lib/session.ts`). Anyone who opens the app at least every 90 days stays logged in.
  A 401 from any API call returns the user to the login screen. **Log out** is in the sidebar.

### 3. Menu setup (chef)
- ADMIN opens **Food Management** (`/food-management`) and creates **food options, each tied to one date**
  (name, image URL, date). Options can be disabled, edited or deleted.
- The same page shows **Meal Demand** for a chosen date: how many staff picked each dish, so the kitchen knows what to cook.

### 4. Weekly meal selection (staff)
- Staff open **Select Meal** (`/meal-plan`), which shows Monday–Friday of a week with the food options for each day
  (`GET /food-options/date`).
- They pick one dish per day and submit. Each day becomes one `MealSelection` (create or update).
- **Locking:** a day can't be changed once it is today or in the past. Exception: on Monday, Monday itself is still open.
  This is enforced in both the UI and the API.
- The staff dashboard shows today's meal and progress ("X / 5 selected this week").

### 5. Serving (scan)
- At the counter an ADMIN opens **Scan** (`/scan`) on a phone or laptop with a camera.
- Scanning a QR sends `POST /attendance/scan` with the `qrCodeId`. This is a **preview only**. The API checks the staff
  member is active, has **selected a meal for today**, and hasn't hit the **3-servings-per-day** limit, then returns the
  person, their dish and their remaining servings.
- The person serving clicks **Mark as Eaten** → `POST /attendance/serve` creates an `Attendance` row inside a transaction and
  emits the Socket.IO event `attendance:new`. The frontend does not listen for it yet.

### 6. Monitoring and reports
- **Dashboard** (`/`): total staff, meals served today, recent servings, headcount by department.
- **Check Meal** (`/check-meal`): today's servings, searchable and filterable by department.
- **History** (`/history`, SUPER_ADMIN): totals and attendance rate for today, this week and this month, per-staff meal
  counts, and **Excel export** for today, this/last week and this/last month (weeks start Monday).

## Data model (summary)

`Staff` 1–0..1 `User` · `Staff` 1–* `MealSelection` *–1 `FoodOption` · `Staff` 1–* `Attendance`.
Unique: one `MealSelection` per staff per date. Full details: backend [`docs/DATABASE.md`](https://github.com/SkystoneFinance/mealSync/blob/main/docs/DATABASE.md).
Endpoint list: backend [`docs/API.md`](https://github.com/SkystoneFinance/mealSync/blob/main/docs/API.md).

## Frontend code map

```
src/
  main.tsx                 BrowserRouter > QueryProvider > AuthProvider > AppRoutes
  app/routes/AppRoutes.tsx all routes + role guards              ← start here
  app/layout/              AdminLayout (Sidebar + Navbar + Outlet)
  config/sidebar.ts        menu items per role
  lib/axios.ts             API client (VITE_API_URL, bearer token)
  lib/queryClient.ts       React Query defaults (retry 2, 5-min staleTime)
  services/*.service.ts    one file per backend module; plain axios calls
  hooks/use*.ts            React Query wrappers around services
  types/                   API/DTO types
  components/<feature>/    screens: auth, dashboard, scan, attendance, history,
                           stafff (staff mgmt + staff dashboard + profile), foodManagement, mealplan
```

Pattern for a feature: `component → hook (useQuery/useMutation) → service (axios) → backend route`.

## Environments and deployment

| | Frontend | Backend | Database |
|---|---|---|---|
| Local dev | `npm run dev` → `http://localhost:5173` (set `VITE_API_URL` in `.env.local`) | `npm run dev` → `http://localhost:5000` | Neon dev child branch (once `.env` is switched) |
| Preview | Vercel preview per branch/PR | same production API | production |
| Production | `https://sky-meal-sync.vercel.app` (from `main`) | Render (from `main`) | Neon `production` branch |

There is no staging or dev database yet, so every environment shares production data. See [KNOWN_ISSUES.md](KNOWN_ISSUES.md).
