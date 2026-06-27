from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    neis_api_key: str = "test-key"
    neis_base_url: str = "https://open.neis.go.kr/hub"
    cors_origins: list[str] = ["http://localhost:5173", "http://localhost:4173"]
    
    model_config = SettingsConfigDict(env_file="../.env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()
