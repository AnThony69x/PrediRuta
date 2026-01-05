from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """
    Configuración de la aplicación del agente de chat.
    Las variables se cargan desde el archivo .env
    """
    GEMINI_API_KEY: str
    APP_NAME: str = "PrediRuta Chat Agent"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    HOST: str = "0.0.0.0"
    PORT: int = 8001
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
