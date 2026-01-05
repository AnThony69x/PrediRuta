"""
Schema para la solicitud de chat.
"""
from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    """
    Modelo para la solicitud de chat del usuario.
    """
    question: str = Field(
        ...,
        min_length=1,
        max_length=500,
        description="Pregunta del usuario sobre movilidad en Manta",
        examples=["¿Qué vía es más recomendable para ir de Tarqui al Centro?"]
    )
    
    class Config:
        json_schema_extra = {
            "example": {
                "question": "¿A qué hora hay menos tráfico en la Av. Malecón?"
            }
        }
