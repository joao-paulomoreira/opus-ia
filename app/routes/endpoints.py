from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import logging
from app.model.model import InaModel
from app.model.utils import carregar_pdfs, buscar_resposta, detectar_idioma, get_system_prompt
from app.model.config import OPENAI_API_KEY, API_VERSION
import datetime

router = APIRouter()
model = InaModel()

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]

class ChatResponse(BaseModel):
    response: str
    pdf_matches: Optional[List[str]] = None

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        last_user_message = next(
            (msg.content for msg in reversed(request.messages) if msg.role == 'user'),
            ""
        )
        
        idioma = detectar_idioma(last_user_message)
        textos_pdf = carregar_pdfs()
        pdf_matches = buscar_resposta(textos_pdf, last_user_message)
        
        messages = [{"role": msg.role, "content": msg.content} for msg in request.messages]
        
        response = await model.get_response(messages)
        
        return ChatResponse(
            response=response,
            pdf_matches=pdf_matches
        )
    
    except Exception as e:
        logging.error(f"Erro no endpoint de chat: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/status")
async def status():
    return {
        "status": "online",
        "model": "Ina - Opuspac University AI"
    }
    
@router.get("/health")
async def health_check():
    return {
        "status": "onlie",
        "version": API_VERSION,
        "timestamp": datetime.datetime.now().isoformat(),
        "services": {
            "openai": "conenected" if OPENAI_API_KEY else "disconnected"
        }
    }