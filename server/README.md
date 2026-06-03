# VedaAI Backend

Node.js + Express (TypeScript) API for AI assessment generation.

## Stack

| Layer | Technology |
|-------|------------|
| API | Express 5 |
| Database | MongoDB (Mongoose) |
| Cache / job state | Redis (ioredis) |
| Queue | BullMQ |
| Real-time | WebSocket (`ws`) |
| AI (primary) | **Google Gemini** |
| AI (optional fallback) | OpenAI |
| AI (no keys) | Structured mock generator |

## Architecture

```
Client POST /api/assignments
    → Save assignment (MongoDB, status: generating)
    → Enqueue BullMQ job
    → WebSocket: job:queued

Worker
    → Redis job state + WS progress events
    → Build prompt → Gemini (or OpenAI / mock)
    → Parse JSON → QuestionPaper
    → Save to MongoDB + Redis cache
    → WebSocket: job:completed (includes paper)
```

## Prerequisites

- Node.js 18+
- **MongoDB** running locally (default port `27017`)
- **Redis** running locally (default port `6379`)

**macOS (Homebrew):**

```bash
brew install mongodb-community redis
brew services start mongodb-community
brew services start redis
```

## Setup

```bash
cd server
cp .env.example .env
npm install
npm run dev
```

**Do not run `node server.js` until you have built once** (or use `npm run dev` instead, which does not need a build).

| Command | When to use |
|---------|-------------|
| `npm run dev` | **Recommended** — runs TypeScript directly with hot reload |
| `npm run build` then `npm start` | Production-style run (`node dist/index.js`) |
| `node server.js` | Same as `npm start` after `npm run build` |

Server: **http://localhost:4000** · WebSocket: **ws://localhost:4000/ws**

### Environment

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | Mongo connection string |
| `REDIS_URL` | Redis connection string |
| `GEMINI_API_KEY` | **Required for AI** — [Google AI Studio](https://aistudio.google.com/apikey) (must start with `AIza...`) |
| `GEMINI_MODEL` | Default `gemini-2.5-flash` |
| `GEMINI_MODEL_FALLBACKS` | Comma-separated models if primary hits quota |
| `OPENAI_API_KEY` | Optional fallback (same JSON schema) |
| `CLIENT_URL` | Frontend origin for CORS |

## API

### `POST /api/assignments` (multipart)

| Field | Type | Required |
|-------|------|----------|
| `file` | PDF/TXT/JPEG/PNG | **yes** — questions are generated from this source |
| `dueDate` | `DD-MM-YYYY` | yes |
| `questionTypes` | JSON string array | yes (paper format) |
| `title` | string | no |
| `additionalInfo` | string | no |

**Source extraction:** TXT is read directly; PDF uses `pdf-parse` (Gemini vision fallback if sparse); images use Gemini vision. Generation sends both extracted text and the original file to Gemini when possible.

### Other routes

- `GET /api/assignments` — list
- `GET /api/assignments/:id` — detail + job state
- `GET /api/assignments/:id/paper` — question paper
- `POST /api/assignments/:id/regenerate` — re-queue
- `DELETE /api/assignments/:id`

### WebSocket

```json
{ "type": "subscribe", "assignmentId": "<mongoId>" }
```

Events: `job:queued`, `job:progress`, `job:completed`, `job:failed`

## LLM implementation

Code lives in `src/services/llm/`:

- **`gemini.provider.ts`** — primary; `responseMimeType: application/json`
- **`openai.provider.ts`** — optional fallback; same system/user + JSON contract
- **`ai.service.ts`** — Gemini → OpenAI → mock

Prompt building and Zod parsing are shared; clients always receive a typed `QuestionPaper`, never raw model output.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server + worker |
| `npm run build` | Compile to `dist/` |
| `npm start` | Run compiled server |
