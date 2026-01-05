"""
Schema para la respuesta de chat.
"""
from pydantic import BaseModel, Field


class ChatResponse(BaseModel):
    """
    Modelo para la respuesta del agente de chat.
    """
    answer: str = Field(
        ...,
        description="Respuesta generada por el agente sobre movilidad en Manta"
    )
    
    class Config:
        json_schema_extra = {
            "example": {
                "answer": "En Manta, la Av. Malecón suele tener menos tráfico entre las 10:00 y 11:30 AM, y también entre las 2:00 y 4:00 PM. Te recomiendo evitar las horas pico de 7:00-9:00 AM y 5:00-7:00 PM cuando el tráfico es más intenso."
            }
        }
