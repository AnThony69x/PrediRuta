"""
Rutas de la API para el chat del agente.
"""
from fastapi import APIRouter, HTTPException, status
from app.schemas.chat_request import ChatRequest
from app.schemas.chat_response import ChatResponse
from app.services.agent_service import process_question
import logging

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/api/v1",
    tags=["chat"]
)


@router.post(
    "/chat",
    response_model=ChatResponse,
    status_code=status.HTTP_200_OK,
    summary="Chat con el agente de movilidad",
    description="Envía una pregunta sobre movilidad urbana en Manta y recibe una respuesta del agente experto."
)
async def chat_agent(request: ChatRequest) -> ChatResponse:
    """
    Endpoint principal del agente de chat.
    
    Args:
        request: Objeto con la pregunta del usuario
        
    Returns:
        Respuesta del agente con información sobre movilidad en Manta
        
    Raises:
        HTTPException: Si hay algún error al procesar la pregunta
    """
    try:
        logger.info(f"Nueva consulta recibida")
        
        # Procesar la pregunta usando el servicio del agente
        answer = process_question(request.question)
        
        return ChatResponse(answer=answer)
        
    except Exception as e:
        logger.error(f"Error en endpoint /chat: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error al procesar tu pregunta. Por favor, intenta nuevamente."
        )


@router.get(
    "/health",
    status_code=status.HTTP_200_OK,
    summary="Health check",
    description="Verifica que el servicio del agente está funcionando correctamente."
)
async def health_check():
    """
    Endpoint de health check para verificar el estado del servicio.
    
    Returns:
        Mensaje indicando que el servicio está activo
    """
    return {
        "status": "healthy",
        "service": "PrediRuta Chat Agent",
        "message": "El agente de chat está funcionando correctamente"
    }
