import { NextRequest, NextResponse } from 'next/server';

// URL del ChatAgent backend
const CHATAGENT_URL = process.env.NEXT_PUBLIC_CHATAGENT_URL || 'http://localhost:8001';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Llamar al ChatAgent backend
    const response = await fetch(`${CHATAGENT_URL}/api/v1/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: message,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('ChatAgent error:', errorData);
      return NextResponse.json(
        { 
          error: 'Error communicating with ChatAgent', 
          details: errorData,
          message: 'Asegúrate de que el ChatAgent está corriendo en http://localhost:8001'
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    // El ChatAgent devuelve { answer: "..." }
    const reply = data.answer || 'Lo siento, no pude generar una respuesta en este momento.';

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
