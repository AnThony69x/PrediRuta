'use client';

import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TerminosPage() {
  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-blue-950 dark:to-cyan-950 p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-cyan-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Términos y Condiciones
          </h1>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>1. Aceptación de los términos</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 dark:text-gray-300 space-y-2">
              <p>
                Al acceder y utilizar PrediRuta, usted acepta estar sujeto a estos términos y condiciones de uso.
                Si no está de acuerdo con alguno de estos términos, no debe utilizar este servicio.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>2. Uso del servicio</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 dark:text-gray-300 space-y-2">
              <p>
                PrediRuta es un sistema de predicción de tráfico vehicular diseñado para proporcionar información
                y pronósticos basados en datos históricos y análisis de inteligencia artificial.
              </p>
              <p>
                El usuario se compromete a utilizar el servicio de manera responsable y conforme a la legislación aplicable.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>3. Limitación de responsabilidad</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 dark:text-gray-300 space-y-2">
              <p>
                Las predicciones y análisis proporcionados por PrediRuta son estimaciones basadas en datos disponibles
                y no deben considerarse como información absoluta o garantizada.
              </p>
              <p>
                PrediRuta no se hace responsable de decisiones tomadas basándose en la información proporcionada.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>4. Propiedad intelectual</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 dark:text-gray-300 space-y-2">
              <p>
                Todo el contenido, diseño, logotipos y código fuente de PrediRuta están protegidos por derechos de autor
                y otras leyes de propiedad intelectual.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Modificaciones</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 dark:text-gray-300 space-y-2">
              <p>
                PrediRuta se reserva el derecho de modificar estos términos en cualquier momento.
                Los cambios serán efectivos inmediatamente después de su publicación en el sitio web.
              </p>
            </CardContent>
          </Card>

          <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            <p>Última actualización: {new Date().toLocaleDateString('es-ES')}</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
