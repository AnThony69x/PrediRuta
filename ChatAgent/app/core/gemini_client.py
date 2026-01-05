"""
Cliente para interactuar con la API de Google Gemini.
"""
import google.generativeai as genai
from app.core.config import settings
import logging

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configurar Gemini con la API key
genai.configure(api_key=settings.GEMINI_API_KEY)

# Inicializar el modelo (gemini-2.5-flash es el modelo más reciente y rápido)
model = genai.GenerativeModel("gemini-2.5-flash")


def ask_gemini(prompt: str) -> str:
    """
    Envía un prompt a Gemini y obtiene la respuesta.
    
    Args:
        prompt: El prompt completo a enviar a Gemini
        
    Returns:
        La respuesta generada por Gemini
        
    Raises:
        Exception: Si hay algún error al comunicarse con la API
    """
    try:
        logger.info("Enviando consulta a Gemini...")
        response = model.generate_content(prompt)
        logger.info("Respuesta recibida de Gemini exitosamente")
        return response.text
    except Exception as e:
        logger.error(f"Error al consultar Gemini: {str(e)}")
        raise Exception(f"Error al procesar la consulta con Gemini: {str(e)}")
