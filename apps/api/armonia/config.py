from __future__ import annotations

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict

DEFAULT_SESSION_SECRET = "dev-change-me-armonia-session-secret-32b"
_DEV_ENVS = frozenset({"development", "dev", "test", "local"})


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = "Armonia API"
    environment: str = "development"
    database_url: str = "file:./dev.db"
    session_secret: str = DEFAULT_SESSION_SECRET
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
    max_body_bytes: int = 262_144


def _assert_production_safe(settings: Settings) -> None:
    env = (settings.environment or "").strip().lower()
    if env in _DEV_ENVS:
        return
    if settings.session_secret == DEFAULT_SESSION_SECRET or len(settings.session_secret) < 32:
        raise RuntimeError("SESSION_SECRET must be a unique high-entropy value (≥32 chars) outside development")
    if not settings.cookie_secure:
        raise RuntimeError("COOKIE_SECURE must be true outside development")


@lru_cache
def get_settings() -> Settings:
    settings = Settings()
    _assert_production_safe(settings)
    return settings
