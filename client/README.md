# VedaAI – Frontend

Next.js frontend for the AI Assessment Creator internship assignment, matching the provided Figma designs.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — teacher **Home** dashboard.

Copy `.env.example` to `.env.local` when the backend is ready:

```bash
cp .env.example .env.local
```

## Routes

| Route | Screen |
|-------|--------|
| `/` | Teacher home (schedule, upcoming, stats) |
| `/groups` | My Groups — classroom grid (Google Classroom style) |
| `/groups/[id]` | Single class stream & classwork |
| `/assignments` | Assignments list (empty state or grid) |
| `/assignments/create` | Create assignment form |
| `/assignments/[id]/output` | Generated question paper + answer key |

## Stack

- **Next.js 16** (App Router) + TypeScript
- **Tailwind CSS v4**
- **Zustand** – form state, assignments list, persisted papers
- **WebSocket hook** – connects to `NEXT_PUBLIC_WS_URL`; falls back to simulated progress until the backend is running

## State & validation

- `store/assignmentStore.ts` – assignment form, question-type rows, totals, CRUD
- `lib/validation.ts` – due date (DD-MM-YYYY), positive counts/marks, optional file type/size
- `hooks/useWebSocket.ts` – job status events (`job:queued`, `job:progress`, `job:completed`, `job:failed`)

## Demo tips

On the assignments page (desktop):

- **Load samples** – populates the grid from Figma mock data
- **Preview empty** – toggles the empty state UI

Submitting the create form triggers mock generation and navigates to the output page with the structured exam paper layout.

## Project structure

```
components/
  layout/          Sidebar, header, mobile nav
  assignments/     Cards, empty state, toolbar
  create-assignment/  Form, file upload, question rows
  output/          Exam paper, answer key, AI header
store/             Zustand stores
hooks/             WebSocket
types/             Shared TypeScript types
```
