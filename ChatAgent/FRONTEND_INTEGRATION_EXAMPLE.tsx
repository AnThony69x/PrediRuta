// Ejemplo de integración del ChatAgent con el frontend de PrediRuta
// Este archivo muestra cómo consumir la API del ChatAgent desde Next.js

'use client';

import React from 'react';

/**
 * Servicio para interactuar con el ChatAgent
 */

const CHATAGENT_URL = process.env.NEXT_PUBLIC_CHATAGENT_URL || 'http://localhost:8001';

/**
 * Envía una pregunta al ChatAgent y obtiene la respuesta
 * @param {string} question - Pregunta sobre movilidad en Manta
 * @returns {Promise<{answer: string}>} - Respuesta del agente
 */
export async function askChatAgent(question: string): Promise<{ answer: string }> {
  try {
    const response = await fetch(`${CHATAGENT_URL}/api/v1/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al consultar ChatAgent:', error);
    throw error;
  }
}

/**
 * Verifica el estado del ChatAgent
 * @returns {Promise<boolean>} - true si el servicio está disponible
 */
export async function checkChatAgentHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${CHATAGENT_URL}/api/v1/health`);
    return response.ok;
  } catch (error) {
    console.error('ChatAgent no disponible:', error);
    return false;
  }
}

// Ejemplo de componente React que usa el ChatAgent
export default function ChatAgentExample() {
  const [question, setQuestion] = React.useState('');
  const [answer, setAnswer] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await askChatAgent(question);
      setAnswer(response.answer);
    } catch (error) {
      setAnswer('Error al obtener respuesta. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-agent-container">
      <h2>Asistente de Movilidad - Manta</h2>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="¿Qué vía es mejor para ir de Tarqui al Centro?"
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Consultando...' : 'Preguntar'}
        </button>
      </form>

      {answer && (
        <div className="answer-container">
          <h3>Respuesta:</h3>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}

// Ejemplos de preguntas sugeridas
export const suggestedQuestions = [
  "¿Qué vía es más recomendable para ir de Tarqui al Centro?",
  "¿A qué hora hay menos tráfico en la Av. Malecón?",
  "¿Cuál es la mejor ruta para ir del Mall del Pacífico al aeropuerto?",
  "¿Qué alternativa tengo para evitar el tráfico en hora pico?",
  "¿Cuáles son las vías principales de Manta?",
];
