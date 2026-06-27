FROM python:3.12-slim AS builder
WORKDIR /app
RUN pip install uv
COPY pyproject.toml .
RUN uv sync --no-dev --frozen || true

FROM python:3.12-slim AS runtime
WORKDIR /app
RUN useradd -r -u 1001 appuser
COPY --from=builder /app/.venv /app/.venv
COPY app/ app/
USER appuser
ENV PATH="/app/.venv/bin:$PATH"
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
