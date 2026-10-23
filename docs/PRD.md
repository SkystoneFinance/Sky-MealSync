# MealSync — Product Requirements Document

| | |
|---|---|
| Status | **Living document.** Reverse-engineered from the code on 2026-09-30; update it whenever a rule changes |
| Owner | _TBC_ |
| Repos | Frontend `Sky-MealSync` · Backend `mealSync` |

Items marked **[Confirm]** are how the code behaves today but may not be what the business intends. Please verify them with stakeholders.

## 1. Problem

Skystone Finance provides meals to staff. Without a system, the kitchen can't predict demand, can't verify who is
entitled to a meal, and management has no record of consumption per person or department.

## 2. Goals

1. The kitchen knows **in advance** how many of each dish to prepare.
2. Only registered, active staff who **ordered** are served, within a daily limit.
3. Management has accurate **attendance and consumption reports**, exportable to Excel.
4. Serving is fast: one QR scan and one tap per person.

**Non-goals (current):** payments or meal credits, dietary/allergy tracking, multiple meal periods per day
(breakfast/lunch/dinner), notifications, native mobile apps.

## 3. Users

| Persona | Role | Main jobs |
|---|---|---|
| HR / system owner | `SUPER_ADMIN` | Maintain the staff list, monitor attendance, pull reports |
| Chef / kitchen lead | `ADMIN` | Publish the daily menu, see demand, serve by scanning |
| Employee | `USER` | Choose meals for the week, show QR at the counter |

## 4. Functional requirements

### 4.1 Authentication
| ID | Requirement |
|---|---|
| AUTH-1 | Admins sign in with email and password. |
| AUTH-2 | Staff activate their account once with **staff number + a 4-digit numeric PIN** (entered twice). |
| AUTH-3 | Staff sign in with staff number + PIN. Inactive staff are refused. |
| AUTH-4 | **Long-lived sessions:** users should not have to log in again while they keep using the app. Implemented as a 90-day sliding token, renewed automatically at most once a day. A session ends after 90 days without use, on logout, or if the account is deactivated. Network problems never end a session. |
| AUTH-5 | Users can log out from the sidebar (with confirmation), e.g. on shared or lost devices. |
| AUTH-6 | Forgotten PIN: staff tap "Forgot your PIN?" on sign-in, which notifies administrators. An administrator resets (clears) the PIN from the request or the Staff page; the staff member chooses a new one with "Activate your account". PINs can't be retrieved (stored hashed). |

### 4.2 Staff management (SUPER_ADMIN)
| ID | Requirement |
|---|---|
| STF-1 | Create a staff member: staff number (unique), first name, last name, department. |
| STF-2 | Bulk import from `.xlsx`: columns A–D = staff number, first name, last name, department; row 1 is a header. Duplicate or incomplete rows are skipped and counted. |
| STF-3 | Each staff member automatically gets a unique QR code, downloadable as PNG. |
| STF-4 | Search staff by name/number and filter by department. |
| STF-5 | Delete staff (also deletes their selections and attendance history). **[Confirm]** Deactivation may be preferable so history is kept. |
| STF-6 | Edit staff details and activate/deactivate. _(API exists; UI Edit button not wired.)_ |

### 4.3 Menu / food options (ADMIN)
| ID | Requirement |
|---|---|
| MENU-1 | Create a food option with name, image (URL) and **the date it is served**. Several options per date are allowed. |
| MENU-2 | Edit, enable/disable and delete food options. Disabled options can't be newly selected. |
| MENU-5 | **Own photos (switch-over, from 2026-10-21):** dishes start with a pasted internet image because the food doesn't exist yet. On the day, the chef photographs each dish in the app; the photo is kept per dish name and replaces the internet image everywhere that dish appears, now and in future. Expected: all regular dishes covered within ~3 weeks, after which pasting URLs can be retired. |
| MENU-3 | See demand for any date: selection count and share per option. |
| MENU-4 | Both the kitchen (ADMIN) and administrators (SUPER_ADMIN) can edit the menu. |

### 4.4 Weekly meal planning

Staff choose meals for **next week** so the kitchen can get budget approval and shop on Friday.
All times are **Africa/Lagos**. The schedule lives in `mealSync/src/modules/mealPlan/schedule.ts`.

| When (for a week starting Monday M) | What happens |
|---|---|
| Tuesday 00:00 before M | Chef dashboard shows a reminder to publish (until published) |
| **Wednesday 17:00** before M | Menu due. Publishing later is allowed but flagged "Published late"; the banner turns red |
| Chef publishes | Staff see a prominent "Next week's menu is ready" banner the next time they open the app. The chef copies a ready-made WhatsApp announcement |
| **Thursday 17:00** before M | Deadline shown to staff |
| Thursday 19:00 before M | **Hidden hard close.** Submissions between 17:00 and 19:00 are accepted silently (submission time is still recorded). After 19:00 nothing is accepted and the summary is **confirmed** |
| Friday | Chef shops, using the confirmed summary |

| ID | Requirement |
|---|---|
| PLAN-1 | The chef creates dishes per date (Food Management), can mark days **Kitchen closed**, then **publishes** the week. Publishing requires at least one active dish on every open day. Closed days can't change after publishing. |
| PLAN-2 | The chef can publish **next week and the week after** (up to 2 weeks ahead). Staff can choose for either once it is published, until that week's Thursday 19:00 close. The current and past weeks are **read-only** for everyone (staff see their own choices; chef/admin see the summary). No late submissions. |
| PLAN-3 | For every open day, staff choose a dish **or "No meal required"**. A plan is submitted only when every open day has an answer. |
| PLAN-4 | Staff can change their plan freely until the hard close. The original submission time is kept, and the last edit time is shown as "edited". |
| PLAN-5 | Staff who don't submit get **no meals** that week and are listed as **"Did not submit"**, separately from "No meal required". |
| PLAN-6 | **Meal Preparation Summary** (chef and SUPER_ADMIN): employees who submitted; per day, the count for each dish, meals required, "No meal required" and did-not-submit; the list of employees who didn't submit (marking those who never activated their login); each submitter's submission time. It is live until the hard close, then marked **Confirmed**. Exportable to Excel. |
| PLAN-7 | At the scanner, staff who chose "No meal required" for today are refused with that reason. |
| PLAN-8 | A dish that someone has chosen can't be deleted (disable it instead). |
| PLAN-9 | **Late exception:** after the hard close and before the week starts, an administrator can reopen selection for one named staff member for 24 hours. Their submission is marked Late in the summary and the kitchen sees a note that numbers changed. |
| PLAN-10 | Submitting with any open day blank is refused; each blank day is highlighted with "choose a meal or No meal required". |

Notifications are in-app only (no email). The office also announces the menu on WhatsApp.

### 4.5 Serving (ADMIN; SUPER_ADMIN also has access)
| ID | Requirement |
|---|---|
| SRV-1 | Scan a staff QR with the device camera. |
| SRV-2 | Show a preview: staff name, number, department, the dish they selected today, and servings used/remaining. |
| SRV-3 | Refuse (with a reason) if the QR is unknown, the staff is inactive, **no meal was selected for today**, or the daily limit is reached. |
| SRV-4 | "Mark as Eaten" records one serving. **Maximum 3 servings per staff per day** (`MAX_DAILY_SERVINGS`). **[Confirm]** 3 is intended. |
| SRV-5 | Recording is safe against double-taps and concurrent scans (transaction with limit re-check). |

### 4.6 Monitoring & reports
| ID | Requirement |
|---|---|
| RPT-1 | Dashboard: total staff, meals served today, remaining staff, recent servings, staff per department. |
| RPT-2 | "Check who has eaten": today's servings, searchable and filterable by department. |
| RPT-3 | History (SUPER_ADMIN): total staff, meals served, attendance rate for today / this week / this month. Weeks start Monday. |
| RPT-4 | Per-staff meal counts and last meal for the chosen period. |
| RPT-5 | Excel export: today, current week, previous week, current month, previous month. |

### 4.7 Profile (USER)
| ID | Requirement |
|---|---|
| PRF-1 | Staff view their details and their QR code, and can download the QR. |

## 5. Non-functional requirements

| Area | Current state / requirement |
|---|---|
| Platforms | Responsive web; scanning needs a device with a camera and HTTPS. |
| Security | Every admin API route must enforce auth and role on the server. _(Gap today — see KNOWN_ISSUES.)_ |
| Data | Neon Postgres. Production branch plus a dev child branch for development/testing. |
| Time | "Today" uses the backend server's time zone. **[Confirm]** the target time zone (e.g. `Africa/Lagos`). |
| Performance | Scan-to-preview should feel instant (< 1 s on office Wi-Fi). |

## 6. Open questions

1. ~~Where is the backend hosted?~~ Render. Who owns the Neon, Vercel and Render accounts?
2. ~~Selection lock time / Monday exception?~~ Replaced by the weekly planning window (4.4).
3. Is 3 servings per day correct? Should it count per meal period?
4. Should staff be deleted or only deactivated?
5. What is the process for a forgotten PIN?
6. Should the admin screens show live updates when someone is served (the API already emits `attendance:new`)?

## 7. Change log for this document
- 2026-10-23 — AUTH-6 PIN resets, PLAN-9 reopen for one person, PLAN-10 blank-day errors, MENU-4 admins edit menus.
- 2026-10-21 — MENU-5: own dish photos.
- 2026-10-21 — PLAN-2: two planning weeks; read-only view of current/past weeks.
- 2026-10-21 — 4.4 rewritten: weekly meal planning (publish Wed 17:00, staff deadline Thu 17:00, hidden close Thu 19:00, "No meal required", chef summary). Replaces the day-by-day lock.
- 2026-10-20 — AUTH-4/5: long-lived sliding sessions and logout.
- 2026-09-30 — Initial version reverse-engineered from code.
