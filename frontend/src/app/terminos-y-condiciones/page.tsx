import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function TerminosCondicionesPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-3xl text-center dark:text-white">
              Términos y Condiciones de Uso
            </CardTitle>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
              Última actualización: 25 de octubre de 2025
            </p>
          </CardHeader>
          <CardContent className="space-y-6 text-gray-700 dark:text-gray-300">
            
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                1. Aceptación de los Términos
              </h2>
              <p className="leading-relaxed">
                Al acceder y utilizar PrediRuta, usted acepta estar sujeto a estos términos y condiciones de uso. 
                Si no está de acuerdo con alguna parte de estos términos, no debe utilizar nuestro servicio.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                2. Descripción del Servicio
              </h2>
              <p className="leading-relaxed">
                PrediRuta es una plataforma de predicción de tráfico que proporciona información en tiempo real 
                sobre condiciones de tráfico, rutas optimizadas y análisis predictivo para mejorar la movilidad urbana.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                3. Registro y Cuenta de Usuario
              </h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Debe proporcionar información precisa y actualizada durante el registro.</li>
                <li>Es responsable de mantener la confidencialidad de su contraseña.</li>
                <li>Debe notificar inmediatamente cualquier uso no autorizado de su cuenta.</li>
                <li>No puede compartir su cuenta con terceros.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                4. Uso Apropiado del Servicio
              </h2>
              <p className="leading-relaxed mb-2">El usuario se compromete a:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Utilizar el servicio únicamente con fines legales y autorizados.</li>
                <li>No intentar acceder sin autorización a sistemas o datos.</li>
                <li>No interferir con el funcionamiento normal del servicio.</li>
                <li>No realizar ingeniería inversa ni intentar extraer código fuente.</li>
                <li>No utilizar el servicio para actividades fraudulentas o maliciosas.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                5. Propiedad Intelectual
              </h2>
              <p className="leading-relaxed">
                Todo el contenido, marcas, logotipos y material disponible en PrediRuta son propiedad de 
                PrediRuta o sus licenciantes y están protegidos por leyes de propiedad intelectual. 
                No está permitida su reproducción sin autorización expresa.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                6. Limitación de Responsabilidad
              </h2>
              <p className="leading-relaxed">
                PrediRuta proporciona el servicio "tal cual" sin garantías de ningún tipo. No nos hacemos 
                responsables de daños directos, indirectos, incidentales o consecuentes derivados del uso 
                o imposibilidad de uso del servicio. Las predicciones de tráfico son estimaciones y pueden 
                no reflejar las condiciones reales en todo momento.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                7. Modificaciones del Servicio
              </h2>
              <p className="leading-relaxed">
                Nos reservamos el derecho de modificar, suspender o discontinuar cualquier aspecto del servicio 
                en cualquier momento sin previo aviso. También podemos actualizar estos términos periódicamente.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                8. Terminación de Cuenta
              </h2>
              <p className="leading-relaxed">
                Podemos suspender o terminar su cuenta si viola estos términos o si detectamos actividad 
                sospechosa o fraudulenta. Usted puede cancelar su cuenta en cualquier momento desde la 
                configuración de su perfil.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                9. Ley Aplicable y Jurisdicción
              </h2>
              <p className="leading-relaxed">
                Estos términos se regirán e interpretarán de acuerdo con las leyes vigentes. 
                Cualquier disputa será resuelta en los tribunales competentes correspondientes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                10. Contacto
              </h2>
              <p className="leading-relaxed">
                Si tiene preguntas sobre estos términos y condiciones, puede contactarnos a través de:
              </p>
              <ul className="list-none space-y-1 ml-4 mt-2">
                <li>📧 Email: soporte@prediruta.com</li>
                <li>📱 Teléfono: +1 (555) 123-4567</li>
                <li>🏢 Dirección: Cerca de mi casa</li>
              </ul>
            </section>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-8">
              <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                Al utilizar PrediRuta, usted reconoce que ha leído y acepta estos términos y condiciones.
              </p>
            </div>

            <div className="flex justify-center gap-4 mt-6">
              <Link
                href="/login"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Volver al inicio de sesión
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
