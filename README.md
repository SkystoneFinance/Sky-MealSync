# Sky MealSync — Frontend

Web app for **MealSync**, Skystone Finance's staff meal system. Staff choose their meals for the week, the kitchen serves
them by scanning each person's QR code, and admins track attendance and export reports.

**Production:** https://sky-meal-sync.vercel.app

## Documentation

| Doc | What's in it |
|---|---|
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | **Start here.** How the whole system works end to end: roles, meal lifecycle, code map, environments |
| [docs/PRD.md](docs/PRD.md) | Product requirements and business rules (living) |
| [docs/KNOWN_ISSUES.md](docs/KNOWN_ISSUES.md) | Bugs, security gaps and tech debt, with severity |
| [CHANGELOG.md](CHANGELOG.md) | What changed and when |
| Backend: [mealSync README](https://github.com/SkystoneFinance/mealSync) · [API](https://github.com/SkystoneFinance/mealSync/blob/main/docs/API.md) · [Database](https://github.com/SkystoneFinance/mealSync/blob/main/docs/DATABASE.md) | The API this app calls |

## Stack

React 19 · TypeScript · Vite 8 · Tailwind CSS 4 · React Router 7 · TanStack React Query 5 · axios ·
html5-qrcode (camera scanning) · framer-motion · lucide-react · react-hot-toast · oxlint

## Getting started

Requires Node 20+ and a running backend (see the [mealSync repo](https://github.com/SkystoneFinance/mealSync)).

```bash
npm install
cp .env.example .env.local   # set VITE_API_URL (.env.local is gitignored and overrides .env)
npm run dev              # http://localhost:5173
```

| Env var | Purpose |
|---|---|
| `VITE_API_URL` | Backend base URL **including `/api/v1`**, e.g. `http://localhost:5000/api/v1` |

> ⚠️ If `VITE_API_URL` points at the production API, you're working with **live data**. See [KNOWN_ISSUES S2](docs/KNOWN_ISSUES.md).
> The backend only accepts browser requests from `http://localhost:5173` and the production Vercel URL (CORS).

| Script | What it does |
|---|---|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Type-check (`tsc -b`) and production build to `dist/` |
| `npm run preview` | Serve the built `dist/` locally |
| `npm run lint` | oxlint |

There are no automated tests yet. At minimum, run `npm run build` and `npm run lint` before opening a PR.

## Code layout

```
src/app/routes/AppRoutes.tsx   routes + role guards (start here)
src/config/sidebar.ts          sidebar items per role
src/lib/axios.ts               API client
src/services/                  one file per backend module
src/hooks/                     React Query hooks
src/components/<feature>/      screens
```

Full map in [ARCHITECTURE.md](docs/ARCHITECTURE.md#frontend-code-map).

## Deployment

Vercel is connected to this GitHub repo:
- a push or merge to **`main`** deploys to **production**
- every other branch or PR gets a **preview URL**

`vercel.json` rewrites all paths to `index.html` for client-side routing. `VITE_API_URL` for each environment is set in the
Vercel project settings.

> Preview deployments call whatever API `VITE_API_URL` points at. The backend's CORS list (`mealSync/src/plugins/cors.ts`)
> must include the preview domain for them to work.

## Contributing workflow

1. Branch from `main`: `feature/…`, `fix/…`, `docs/…`.
2. Make the change and test it locally (`npm run dev`, `npm run build`, `npm run lint`).
3. **Update the docs in the same PR:** add a line to `CHANGELOG.md` under *Unreleased*. Update `docs/PRD.md` if a
   business rule changed, `docs/ARCHITECTURE.md` if a flow, route or role changed, and `docs/KNOWN_ISSUES.md` if you fixed or found an issue.
4. Push the branch, check the Vercel preview, and open a PR into `main`.
5. Merge. Vercel deploys production.
