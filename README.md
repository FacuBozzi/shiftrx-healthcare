# ShiftRx Staffing Challenge

## [Loom Demo](https://www.loom.com/share/80a6af133ef147a8bcada1e95413a9f5?sid=d5256af5-5baf-441c-a670-c66c3ba860b7)

A Next.js App Router project that simulates a healthcare staffing marketplace. Providers can browse open shifts, track their applications, review hired assignments, and switch between mock user profiles—matching the visual language of the supplied ShiftRx dashboard.

## ✨ Highlights
- **Dashboard overview** with upcoming confirmed shifts, open opportunities, and performance metrics styled after the reference design.
- **User switcher** toggles between seeded providers without auth; selections persist via cookies.
- **Apply / withdraw flows** backed by Prisma with duplicate protection and optimistic UX via server actions.
- **Filterable shift list** with status pills and contextual actions (apply, confirmed, filled, cancelled).
- **Applications hub** summarizing every submission with live status.
- **Hire API** (`POST /api/hire`) flips a shift to `HIRED`, records the provider, and rejects competing applications (used for the follow-up interview requirement).
- **Jest tests** covering server actions and hire orchestration logic.

## 🧰 Stack
- Next.js 15 (App Router, Server Actions)
- TypeScript & Tailwind CSS 4
- Prisma ORM with SQLite
- Jest + Testing Library

## 🚀 Getting Started
Prerequisites: Node 20+, npm.

```bash
npm install
npm run db:migrate      # prisma migrate dev
npm run db:seed         # populate sample users/shifts/applications
npm run dev
```

Visit `http://localhost:3000` to explore the UI. The sidebar switcher lets you jump between providers and immediately see their personalized data.

### Testing

```bash
npm test
```

The suite exercises apply/withdraw server actions, the hire helper, and the error path for the hire API route.

## 🗃️ Seed Data
`npm run db:seed` loads three providers and a curated set of shifts:
- Peter Parker (default) has two confirmed shifts and one active application.
- Gwen Stacy & Miles Morales create realistic competition, including rejected apps.
- Shifts span `OPEN`, `HIRED`, and `CANCELLED` states to showcase UI edge cases.

Feel free to tweak `prisma/seed.ts` and rerun the seed script; Prisma will wipe existing records before inserting.

## 🔗 API Reference
### `POST /api/hire`
Marks a shift as hired and finalises application statuses.

```bash
curl -X POST http://localhost:3000/api/hire \
  -H 'Content-Type: application/json' \
  -d '{ "applicationId": "<app-id>", "shiftId": "<shift-id>" }'
```

**Response (200)**
```json
{
  "ok": true,
  "shift": {
    "id": "clxgreenvalley",
    "status": "HIRED",
    "hiredProviderId": "clxpeter"
  }
}
```

Errors (400) clarify missing payloads, mismatched shift/application pairs, or already-filled shifts.

## 🧭 Project Structure
- `src/app/(dashboard)/` – Home dashboard, shifts listing/detail, applications page, and group layout.
- `src/components/` – UI building blocks (layout shell, shift cards, promo banners, action buttons) plus a client-side active user context.
- `src/data/` – Prisma-backed query helpers for users, shifts, and applications.
- `src/server/actions/` – Server actions for applying, withdrawing, and hiring.
- `prisma/` – Schema, migration history, and seed script.

Enjoy exploring the staffing marketplace! Let me know if you’d like a Loom walkthrough or deployment instructions.
