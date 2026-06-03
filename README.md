# VedaAI – AI Assessment Creator

Full-stack internship project: teachers create assignments, AI generates structured question papers, and students view exam-style output in real time.

## Project structure

```
vedai/
├── client/          # Next.js frontend
└── server/          # Express + MongoDB + Redis + BullMQ + WebSocket
```

## Prerequisites (local install)

Install and run locally (no Docker):

- **MongoDB** — [mongodb.com/try](https://www.mongodb.com/try) or `brew install mongodb-community` then `brew services start mongodb-community`
- **Redis** — `brew install redis` then `brew services start redis`, or [redis.io](https://redis.io/docs/latest/operate/oss_and_stack/install/install-redis/)

Default URLs (configure in `server/.env` if different):

- MongoDB: `mongodb://127.0.0.1:27017/vedaai`
- Redis: `redis://127.0.0.1:6379`

## Quick start

### 1. Backend

```bash
cd server
cp .env.example .env
# Add GEMINI_API_KEY from https://aistudio.google.com/apikey
npm install
npm run dev
```

### 2. Frontend

```bash
cd client
cp .env.example .env.local
npm install
npm run dev
```

Open **http://localhost:3000**

## AI providers

| Priority | Provider | Env var |
|----------|----------|---------|
| 1 | **Gemini** (default) | `GEMINI_API_KEY` |
| 2 | OpenAI (optional fallback) | `OPENAI_API_KEY` |
| 3 | Structured mock | if neither key is set |

## Features implemented

### Frontend
- Teacher dashboard, My Groups, assignments UI
- Create assignment form with validation (Zustand)
- Structured output page (sections, difficulties, marks, answer key)
- WebSocket progress on generation

### Backend
- REST API for assignments CRUD + generation trigger
- MongoDB persistence
- Redis job state + paper cache
- BullMQ background worker
- WebSocket notifications
- Gemini API (+ optional OpenAI) with prompt builder and JSON parser

## Submission checklist

- [ ] GitHub repo with clean commits
- [ ] README (`README.md`, `server/README.md`, `client/README.md`)
- [ ] Deploy frontend + backend with env vars
- [ ] Demo: create assignment → progress → view paper

## Approach

Generation is asynchronous: the API saves the assignment and enqueues a BullMQ job. The worker builds a structured JSON prompt, calls **Gemini** (or OpenAI/mock), parses with Zod, stores `QuestionPaper` in MongoDB, and notifies the client over WebSocket. The frontend never renders raw LLM text.
