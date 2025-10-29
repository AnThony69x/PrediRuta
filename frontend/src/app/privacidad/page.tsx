'use client';

import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PrivacidadPage() {
  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-blue-950 dark:to-cyan-950 p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-cyan-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Política de Privacidad
          </h1>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>1. Información que recopilamos</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 dark:text-gray-300 space-y-2">
              <p>
                PrediRuta recopila la siguiente información:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Información de cuenta (nombre, correo electrónico)</li>
                <li>Datos de ubicación (cuando se otorga permiso)</li>
                <li>Historial de rutas y predicciones solicitadas</li>
                <li>Preferencias de usuario y configuraciones</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>2. Uso de la información</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 dark:text-gray-300 space-y-2">
              <p>
                Utilizamos la información recopilada para:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Proporcionar servicios de predicción de tráfico personalizados</li>
                <li>Mejorar nuestros algoritmos y modelos de IA</li>
                <li>Enviar notificaciones relevantes sobre el servicio</li>
                <li>Analizar patrones de uso para mejorar la experiencia del usuario</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>3. Protección de datos</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 dark:text-gray-300 space-y-2">
              <p>
                Implementamos medidas de seguridad técnicas y organizativas para proteger sus datos personales:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Encriptación de datos sensibles</li>
                <li>Acceso restringido a información personal</li>
                <li>Monitoreo continuo de seguridad</li>
                <li>Copias de seguridad regulares</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>4. Compartir información</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 dark:text-gray-300 space-y-2">
              <p>
                No vendemos ni compartimos su información personal con terceros, excepto:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Cuando sea requerido por ley</li>
                <li>Con proveedores de servicios que nos ayudan a operar la plataforma</li>
                <li>Con su consentimiento explícito</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>5. Sus derechos</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 dark:text-gray-300 space-y-2">
              <p>
                Usted tiene derecho a:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Acceder a sus datos personales</li>
                <li>Corregir información inexacta</li>
                <li>Solicitar la eliminación de sus datos</li>
                <li>Exportar sus datos en formato portable</li>
                <li>Revocar el consentimiento en cualquier momento</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Cookies y tecnologías similares</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 dark:text-gray-300 space-y-2">
              <p>
                Utilizamos cookies y tecnologías similares para mejorar la experiencia del usuario,
                recordar preferencias y analizar el uso del servicio.
              </p>
              <p>
                Puede gestionar las preferencias de cookies en la configuración de su navegador.
              </p>
            </CardContent>
          </Card>

          <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            <p>Última actualización: {new Date().toLocaleDateString('es-ES')}</p>
            <p className="mt-2">
              Para consultas sobre privacidad: <a href="/contacto" className="text-blue-600 dark:text-blue-400 hover:underline">contacto</a>
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
