# 급식 정보 조회 앱

School lunch (급식) menu lookup app using the NEIS Open API.

## Architecture

- **Backend**: FastAPI (Python 3.12) — proxies NEIS Open API
- **Frontend**: React + Vite + TypeScript — 3-step wizard UI
- **E2E**: Playwright

## Quick Start

```bash
cp .env.example .env
# Edit .env and set NEIS_API_KEY
docker compose up --build
```

Open http://localhost:8080

## Development

### Backend

```bash
cd api
uv sync
uv run uvicorn app.main:app --reload
```

### Frontend

```bash
cd web
npm install
npm run dev
```

### Tests

```bash
# API tests
cd api && uv run pytest

# Web unit tests
cd web && npm test

# E2E tests
cd e2e && npm install && npx playwright install && npm test
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEIS_API_KEY` | NEIS Open API key | Yes (runtime) |
| `WEB_PORT` | Web server port (default: 8080) | No |

Get your NEIS API key at https://open.neis.go.kr
