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
| AUTH-6 | Forgotten PIN reset. _(Not implemented. **[Confirm]** the process — currently needs a DB change.)_ |

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
| MENU-3 | See demand for any date: selection count and share per option. |
| MENU-4 | **[Confirm]** SUPER_ADMIN currently cannot open Food Management (UI restriction only). |

### 4.4 Meal selection (USER)
| ID | Requirement |
|---|---|
| SEL-1 | Staff see a Monday–Friday week and the options for each day, and can browse other weeks. |
| SEL-2 | **One selection per staff per day.** |
| SEL-3 | **Lock rule:** a day's selection can't be created, changed or removed once that day is today or past. **Exception: on Mondays, Monday's selection stays editable.** No time-of-day cutoff. **[Confirm]** whether a cutoff (e.g. 10:00 on the day, or Friday for next week) is wanted. |
| SEL-4 | The UI requires all 5 days to be selected before saving the week. **[Confirm]** — this blocks staff who missed a day that is already locked. |
| SEL-5 | The staff dashboard shows today's meal and progress for the week (X / 5). |

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

1. Where is the backend hosted, and who owns the Neon and Vercel accounts?
2. Should selection lock at a specific time rather than at midnight? Should the Monday exception stay?
3. Is 3 servings per day correct? Should it count per meal period?
4. Should staff be deleted or only deactivated?
5. What is the process for a forgotten PIN?
6. Should the admin screens show live updates when someone is served (the API already emits `attendance:new`)?

## 7. Change log for this document
- 2026-10-20 — AUTH-4/5: long-lived sliding sessions and logout.
- 2026-09-30 — Initial version reverse-engineered from code.
