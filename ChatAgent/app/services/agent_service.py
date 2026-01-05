"""
Servicio principal del agente de chat.
Procesa las preguntas del usuario y genera respuestas usando Gemini.
"""
from app.core.prompt import build_user_prompt
from app.core.gemini_client import ask_gemini
import logging

logger = logging.getLogger(__name__)


def process_question(question: str) -> str:
    """
    Procesa una pregunta del usuario sobre movilidad en Manta.
    
    Args:
        question: Pregunta del usuario
        
    Returns:
        Respuesta generada por el agente
        
    Raises:
        Exception: Si hay algún error al procesar la pregunta
    """
    try:
        logger.info(f"Procesando pregunta: {question[:50]}...")
        
        # Construir el prompt completo
        full_prompt = build_user_prompt(question)
        
        # Obtener respuesta de Gemini
        answer = ask_gemini(full_prompt)
        
        logger.info("Pregunta procesada exitosamente")
        return answer
        
    except Exception as e:
        logger.error(f"Error al procesar pregunta: {str(e)}")
        raise Exception(f"No se pudo procesar tu pregunta. Por favor, intenta nuevamente.")
