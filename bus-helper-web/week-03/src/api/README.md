# 급식 API

FastAPI backend that proxies the NEIS Open API.

## Development

```bash
uv sync
uv run uvicorn app.main:app --reload
```

## Testing

```bash
uv run pytest
uv run pytest -m unit
uv run pytest -m integration
uv run pytest --cov=app
```

## Endpoints

- `GET /api/health` — health check
- `GET /api/schools?q={name}` — search schools
- `GET /api/meals?edu_office_code=&school_code=&from_date=&to_date=` — get meal menus
