import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

##Configs básicas
BASE_DIR = Path(__file__).parent
DOCUMENTS_DIR = BASE_DIR / 'documents'
LOG_FILE = BASE_DIR / 'app_log.log'

##Configs API
API_TITLE = "Ina API"
API_DESCRIPTION = "API da Inteligência Artificial da Opuspac University"
API_VERSION = "1.0.0"
API_PREFIX = "/api/v1"

## Config OpenAI
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
DEFAULT_MODEL = "gpt-4o-mini-2024-07-18"
DEFAULT_MAX_TOKENS = 900
DEFAULT_TEMPERATURE = 0

## Logging config
LOG_CONFIG = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "default": {
            "format": "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
        }
    },
    
    "handlers":{
        "file":{
            "class": "logging.FileHandler",
            "filename": str(LOG_FILE),
            "formatter": "default",
        }
    },
    
    "root": {
        "level": "INFO",
        "handlers": ["file"]
    }
}

ENVIRONMENT = os.getenv("ENVIRONMENT", "development")