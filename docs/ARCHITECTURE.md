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
| `SUPER_ADMIN` | HR / system owner | email + password | Overview, weekly planning, served today, reports, scan, **staff** |
| `ADMIN` | Kitchen / chef | email + password | Overview, weekly planning, **menu**, scan, served today |
| `USER` | Any employee | staff number + 4-digit PIN | Home, **my meals** (choose up to 2 weeks ahead, view past weeks), my QR code |

Admin accounts are created directly in the database (see `prisma/seed.ts` in the backend). Staff records are created
by a SUPER_ADMIN; staff then activate their own login.

## The meal lifecycle

```
 1. ONBOARD        2. MENU               3. SELECT               4. SUMMARY       5. SERVE (scan)                 6. REPORT
 SUPER_ADMIN       ADMIN (chef)          STAFF                   ADMIN (chef)     ADMIN at the counter            SUPER_ADMIN
 adds staff   ──▶  adds dishes for  ──▶  choose dish or     ──▶  confirmed  ──▶   scans QR ─▶ preview ─▶     ──▶  dashboard, history,
 (form/Excel)      next week,            "No meal" per day       Thu 19:00;       "Mark as eaten" = Attendance    Excel export
 → QR generated    publishes by Wed 17   by Thu 17:00            shop Friday      (max 3 servings/day)
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

### 3. Menu setup and publishing (chef), by Wednesday 17:00
- ADMIN creates **food options, each tied to one date**, in **Food Management** (`/food-management`).
- On **Weekly Planning** (`/weekly-planning`, ADMIN and SUPER_ADMIN), the chef reviews next week, ticks any
  **Kitchen closed** days and presses **Publish** → `POST /menu-weeks/:weekStart/publish`. That creates a `MenuWeek` row
  with `publishedAt`. The page then offers a copyable WhatsApp announcement.
- The chef dashboard shows a reminder banner from Tuesday until the menu is published (red once overdue).

### 4. Weekly meal selection (staff), by Thursday 17:00
- Once published, the staff home page shows a prominent **"Next week's menu is ready"** banner (`GET /meal-plan`).
- On **Select Meal** (`/meal-plan`) staff pick a dish **or "No meal required"** for each open day of **next week** and
  submit → `PUT /meal-plan`. That replaces their `MealSelection` rows for the week and upserts a `WeeklySubmission`
  (first submission time + last edit).
- Edits are allowed until the **hidden close at Thursday 19:00**; the UI only ever shows the 17:00 deadline.
- The rules and times live in `mealSync/src/modules/mealPlan/schedule.ts` (Africa/Lagos).

### 4b. Meal Preparation Summary
- After the close, the chef dashboard shows "Week confirmed" with a link to the summary on Weekly Planning
  (`GET /menu-weeks/:weekStart/summary`, Excel via `/summary/export`). See [PRD 4.4](PRD.md).

### 5. Serving (scan)
- At the counter an ADMIN opens **Scan** (`/scan`) on a phone or laptop with a camera.
- Scanning a QR sends `POST /attendance/scan` with the `qrCodeId`. This is a **preview only**. The API checks the staff
  member is active, has **selected a meal for today** (not "No meal required"), and hasn't hit the **3-servings-per-day** limit, then returns the
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
  main.tsx                 BrowserRouter > QueryProvider > AuthProvider > AppRoutes (+ Toaster)
  index.css                design tokens (@theme): Futura font stack, brand-50…900 reds, shadows
  app/routes/AppRoutes.tsx all routes + role guards              ← start here
  app/layout/AppShell.tsx  sidebar / mobile drawer, user card, page container
  config/sidebar.ts        navigation items and role labels
  components/ui/           UI kit: Button, Card, PageHeader, Badge, StatCard, Callout, Field, Input,
                           Select, Segmented, WeekSwitcher, Table, Avatar, Modal, EmptyState…
  lib/axios.ts             API client (VITE_API_URL, bearer token, 401 → logout)
  lib/session.ts           token storage + sliding refresh
  services/*.service.ts    one file per backend module; plain axios calls
  hooks/use*.ts            React Query wrappers around services
  types/                   API/DTO types
  utils/mealPlanDates.ts   week/date formatting (Africa/Lagos) and API error messages
  components/<feature>/    screens: auth, dashboard (Overview), mealplan (My meals + banner),
                           mealPlanning (Weekly planning + banner), foodManagement (Menu), scan,
                           attendance (Served today), history (Reports), stafff (Staff, staff home, My QR code)
```

Pattern for a feature: `component → hook (useQuery/useMutation) → service (axios) → backend route`.
New screens should be built from `components/ui` so the app stays consistent.

## Environments and deployment

| | Frontend | Backend | Database |
|---|---|---|---|
| Local dev | `npm run dev` → `http://localhost:5173` (set `VITE_API_URL` in `.env.local`) | `npm run dev` → `http://localhost:5000` | Neon dev child branch (once `.env` is switched) |
| Preview | Vercel preview per branch/PR | same production API | production |
| Production | `https://sky-meal-sync.vercel.app` (from `main`) | Render (from `main`) | Neon `production` branch |

There is no staging or dev database yet, so every environment shares production data. See [KNOWN_ISSUES.md](KNOWN_ISSUES.md).
