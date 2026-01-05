"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { AppLayout } from "@/components/layout/AppLayout";
import { Bot, Send, Loader2, Sparkles, User, Zap, MapPin, Clock, TrendingUp } from "lucide-react";

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Preguntas frecuentes categorizadas
const FREQUENT_QUESTIONS = [
  {
    icon: MapPin,
    color: "from-blue-500 to-blue-600",
    questions: [
      "¿Qué vía es más recomendable para ir de Tarqui al Centro?",
      "¿Cuál es la mejor ruta para ir del Mall del Pacífico al aeropuerto?",
    ]
  },
  {
    icon: Clock,
    color: "from-purple-500 to-purple-600",
    questions: [
      "¿A qué hora hay menos tráfico en la Av. Malecón?",
      "¿Cuáles son las horas pico en Manta?",
    ]
  },
  {
    icon: TrendingUp,
    color: "from-green-500 to-green-600",
    questions: [
      "Dame alternativas para evitar el tráfico en hora pico",
      "¿Cuáles son las vías principales de Manta?",
    ]
  },
];

export default function AsistentePage() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '¡Hola! 👋 Soy PrediRuta Assistant, tu asistente experto en movilidad urbana de Manta. Puedo ayudarte con rutas, horarios de menor tráfico y recomendaciones de vías. ¿En qué puedo ayudarte hoy?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Ocultar sugerencias después del primer mensaje del usuario
  useEffect(() => {
    if (messages.length > 1) {
      setShowSuggestions(false);
    }
  }, [messages.length]);

  const handleQuestionClick = (question: string) => {
    setInput(question);
    inputRef.current?.focus();
    // Auto-enviar la pregunta
    setTimeout(() => {
      sendMessage(question);
    }, 100);
  };

  const sendMessage = async (messageContent: string) => {
    const content = messageContent || input.trim();
    if (!content || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: content }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al comunicarse con el asistente');
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, asegúrate de que el ChatAgent esté corriendo en http://localhost:8001 e intenta de nuevo.',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleSendMessage = async () => {
    await sendMessage(input.trim());
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <AppLayout hideFooter>
      <div className="h-[calc(100vh-4rem)] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                Asistente Virtual
                <Sparkles className="w-4 h-4 text-yellow-500" />
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Impulsado por Gemini AI
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-gray-950">
          {/* Preguntas frecuentes - Solo se muestran al inicio */}
          {showSuggestions && messages.length === 1 && (
            <div className="mb-6 animate-fade-in">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-yellow-500" />
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Preguntas frecuentes
                </h3>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {FREQUENT_QUESTIONS.map((category, idx) => (
                  <div key={idx} className="space-y-2">
                    {category.questions.map((question, qIdx) => (
                      <button
                        key={qIdx}
                        onClick={() => handleQuestionClick(question)}
                        className={`
                          w-full text-left px-4 py-3 rounded-xl
                          bg-white dark:bg-gray-800
                          border-2 border-gray-200 dark:border-gray-700
                          hover:border-blue-500 dark:hover:border-blue-400
                          transition-all duration-200
                          group relative overflow-hidden
                          hover:shadow-lg hover:scale-[1.02]
                        `}
                      >
                        <div className={`
                          absolute inset-0 bg-gradient-to-r ${category.color} opacity-0
                          group-hover:opacity-5 transition-opacity duration-200
                        `} />
                        <div className="flex items-start gap-3 relative z-10">
                          <div className={`
                            p-2 rounded-lg bg-gradient-to-br ${category.color}
                            flex-shrink-0 transform group-hover:scale-110 transition-transform duration-200
                          `}>
                            <category.icon className="w-4 h-4 text-white" />
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed flex-1 pt-1">
                            {question}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                </div>
              )}

              <div
                className={`
                  max-w-[70%] rounded-2xl px-4 py-3
                  ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                  }
                `}
              >
                <p className="whitespace-pre-wrap break-words">{message.content}</p>
                <p
                  className={`
                    text-xs mt-2
                    ${
                      message.role === 'user'
                        ? 'text-blue-100'
                        : 'text-gray-500 dark:text-gray-400'
                    }
                  `}
                >
                  {message.timestamp.toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>

              {message.role === 'user' && (
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  </div>
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  <span className="text-gray-500 dark:text-gray-400">Pensando...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-4 flex-shrink-0">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-2 items-end">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  // Auto-resize textarea
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
                }}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu mensaje... (Shift+Enter para nueva línea)"
                className="
                  flex-1 resize-none rounded-xl px-4 py-3
                  bg-gray-100 dark:bg-gray-800
                  border border-gray-300 dark:border-gray-600
                  text-gray-900 dark:text-white
                  placeholder-gray-500 dark:placeholder-gray-400
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                  overflow-hidden
                "
                style={{ height: '52px', maxHeight: '128px' }}
                rows={1}
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!input.trim() || isLoading}
                className="
                  px-6 py-3 rounded-xl h-[52px]
                  bg-gradient-to-r from-blue-600 to-purple-600
                  text-white font-medium
                  hover:from-blue-700 hover:to-purple-700
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-200
                  flex items-center gap-2 flex-shrink-0
                "
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
