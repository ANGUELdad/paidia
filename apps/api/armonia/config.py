from __future__ import annotations

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = "Armonia API"
    environment: str = "development"
    database_url: str = "file:./dev.db"
    session_secret: str = "dev-change-me-armonia-session-secret-32b"
    cookie_secure: bool = False
    webauthn_origin: str = "http://localhost:3000"
    webauthn_rp_id: str = "localhost"
    webauthn_rp_name: str = "Armonia Thassos"
    groq_api_key: str = ""
    groq_model: str = "llama-3.3-70b-versatile"
    omniroute_base_url: str = "http://127.0.0.1:4000"
    omniroute_api_key: str = "local"
    omniroute_models: str = "openai/gpt-oss-120b,llama-3.3-70b,gemma2-9b,qwen2.5-72b"
    openrouter_api_key: str = ""
    openrouter_models: str = "meta-llama/llama-3.3-70b-instruct:free,google/gemma-2-9b-it:free,qwen/qwen-2.5-72b-instruct:free"
    llm_provider: str = "auto"  # auto|groq|omniroute|openrouter
    chat_model: str = "openai/gpt-oss-120b"
    zoai_knowledge_chars: int = 5500
    broadcast_cooldown: int = 45
    broadcast_max: int = 80
    vapid_public_key: str = ""
    vapid_private_key: str = ""
    vapid_subject: str = "mailto:admin@armonia.local"
    cors_origins: str = "http://localhost:3000,http://127.0.0.1:3000"


@lru_cache
def get_settings() -> Settings:
    return Settings()
