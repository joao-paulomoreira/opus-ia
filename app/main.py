from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import logging.config
from app.model.config import API_TITLE, API_DESCRIPTION, API_VERSION, API_PREFIX, LOG_CONFIG
from app.routes import endpoints

logging.config.dictConfig(LOG_CONFIG)

app = FastAPI(
    title=API_TITLE,
    description=API_DESCRIPTION,
    version=API_VERSION,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="app/frontend"), name="static")

app.include_router(endpoints.router, prefix=API_PREFIX)

@app.get("/")
async def root():
    return{
        "message": "Bem vindo a API ina",
        "docs": "/docs",
        "version": API_VERSION
    }
    
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app", 
        host="0.0.0.0",
        port=8000,
        reload=True
    )