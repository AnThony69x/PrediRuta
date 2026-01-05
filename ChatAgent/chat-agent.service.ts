/**
 * Servicio para interactuar con el ChatAgent API
 * PrediRuta - Sistema de predicción de rutas
 */

// Configuración de la URL del ChatAgent
const CHATAGENT_URL = process.env.NEXT_PUBLIC_CHATAGENT_URL || 'http://localhost:8001';

/**
 * Interface para la respuesta del chat
 */
export interface ChatResponse {
  answer: string;
}

/**
 * Interface para el estado de salud
 */
export interface HealthResponse {
  status: string;
  service: string;
  message: string;
}

/**
 * Interface para información del servicio
 */
export interface ServiceInfo {
  name: string;
  version: string;
  description: string;
  endpoints: {
    chat: string;
    health: string;
    docs: string;
  };
}

/**
 * Clase de servicio para el ChatAgent
 */
export class ChatAgentService {
  private baseUrl: string;

  constructor(baseUrl: string = CHATAGENT_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Envía una pregunta al ChatAgent
   * @param question - Pregunta sobre movilidad en Manta
   * @returns Respuesta del agente
   */
  async askQuestion(question: string): Promise<ChatResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `Error ${response.status}: ${errorData.detail || 'Error al consultar el agente'}`
        );
      }

      const data: ChatResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error al consultar ChatAgent:', error);
      throw error;
    }
  }

  /**
   * Verifica el estado de salud del ChatAgent
   * @returns true si el servicio está disponible
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.ok;
    } catch (error) {
      console.error('ChatAgent no disponible:', error);
      return false;
    }
  }

  /**
   * Obtiene información detallada del estado de salud
   * @returns Información de salud del servicio
   */
  async getHealthInfo(): Promise<HealthResponse | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        return null;
      }

      const data: HealthResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener info de salud:', error);
      return null;
    }
  }

  /**
   * Obtiene información del servicio
   * @returns Información del servicio
   */
  async getServiceInfo(): Promise<ServiceInfo | null> {
    try {
      const response = await fetch(`${this.baseUrl}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        return null;
      }

      const data: ServiceInfo = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener info del servicio:', error);
      return null;
    }
  }

  /**
   * Prueba la conexión completa con el servicio
   * @returns Objeto con resultados de las pruebas
   */
  async testConnection(): Promise<{
    isHealthy: boolean;
    healthInfo: HealthResponse | null;
    serviceInfo: ServiceInfo | null;
    canAnswer: boolean;
    testAnswer?: ChatResponse;
    error?: string;
  }> {
    const results = {
      isHealthy: false,
      healthInfo: null as HealthResponse | null,
      serviceInfo: null as ServiceInfo | null,
      canAnswer: false,
      testAnswer: undefined as ChatResponse | undefined,
      error: undefined as string | undefined,
    };

    try {
      // Verificar health
      results.isHealthy = await this.checkHealth();
      
      // Obtener info de salud
      results.healthInfo = await this.getHealthInfo();
      
      // Obtener info del servicio
      results.serviceInfo = await this.getServiceInfo();
      
      // Probar con una pregunta simple
      if (results.isHealthy) {
        try {
          results.testAnswer = await this.askQuestion(
            '¿Cuáles son las vías principales de Manta?'
          );
          results.canAnswer = true;
        } catch (error) {
          results.error = error instanceof Error ? error.message : 'Error desconocido';
        }
      }
    } catch (error) {
      results.error = error instanceof Error ? error.message : 'Error desconocido';
    }

    return results;
  }
}

// Exportar instancia singleton
export const chatAgentService = new ChatAgentService();

// Exportar funciones de utilidad
export const askChatAgent = (question: string) => chatAgentService.askQuestion(question);
export const checkChatAgentHealth = () => chatAgentService.checkHealth();
export const getChatAgentInfo = () => chatAgentService.getServiceInfo();
