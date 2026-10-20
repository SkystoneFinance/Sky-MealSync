# Working in this repo

Sky MealSync frontend (React + Vite, deployed by Vercel from `main`). The backend is the sibling repo `mealSync`.
Read `docs/ARCHITECTURE.md` first for how the system fits together.

## Keep the docs current (required for every change)

In the same branch/PR as any code change:
- Add a line to `CHANGELOG.md` under **Unreleased**.
- Route, role, screen or flow changed → update `docs/ARCHITECTURE.md`.
- Business rule changed (locking, serving limits, who can do what) → update `docs/PRD.md` and its change log.
- Fixed or found a bug or security gap → update `docs/KNOWN_ISSUES.md` (move fixed items to **Resolved** with date and PR).
- New env var → update the `README.md` table and `.env.example`.
- If the backend changes too, follow `mealSync/CLAUDE.md` for the backend docs.

## Safety

- Never commit to `main`. Work on a branch, check the Vercel preview, then PR.
- `VITE_API_URL` may point at the production API and database, so treat any data you create or delete as real.
- Verify with `npm run build` and `npm run lint` (there are no tests).
