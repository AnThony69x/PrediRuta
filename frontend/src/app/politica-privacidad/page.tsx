import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function PoliticaPrivacidadPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-3xl text-center dark:text-white">
              Política de Privacidad
            </CardTitle>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
              Última actualización: 25 de octubre de 2025
            </p>
          </CardHeader>
          <CardContent className="space-y-6 text-gray-700 dark:text-gray-300">
            
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                1. Introducción
              </h2>
              <p className="leading-relaxed">
                En PrediRuta, nos comprometemos a proteger su privacidad y sus datos personales. 
                Esta política describe cómo recopilamos, usamos, almacenamos y protegemos su información 
                cuando utiliza nuestros servicios.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                2. Información que Recopilamos
              </h2>
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    2.1 Información de Registro
                  </h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Nombre completo</li>
                    <li>Dirección de correo electrónico</li>
                    <li>Contraseña (encriptada)</li>
                    <li>Fecha de registro</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    2.2 Información de Uso
                  </h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Ubicación geográfica (si autoriza)</li>
                    <li>Rutas consultadas y buscadas</li>
                    <li>Preferencias de tráfico</li>
                    <li>Historial de búsquedas</li>
                    <li>Dispositivo y navegador utilizado</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    2.3 Información Técnica
                  </h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Dirección IP</li>
                    <li>Tipo de navegador</li>
                    <li>Sistema operativo</li>
                    <li>Cookies y tecnologías similares</li>
                    <li>Registros de acceso y errores</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                3. Cómo Usamos su Información
              </h2>
              <p className="leading-relaxed mb-2">Utilizamos su información para:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Proporcionar y mantener nuestros servicios</li>
                <li>Personalizar su experiencia de usuario</li>
                <li>Mejorar nuestras predicciones de tráfico</li>
                <li>Enviar notificaciones importantes sobre el servicio</li>
                <li>Analizar tendencias y patrones de uso</li>
                <li>Prevenir fraude y garantizar la seguridad</li>
                <li>Cumplir con obligaciones legales</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                4. Compartir Información con Terceros
              </h2>
              <p className="leading-relaxed mb-2">
                No vendemos ni alquilamos su información personal. Podemos compartir datos limitados con:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Proveedores de servicios:</strong> Empresas que nos ayudan a operar la plataforma 
                  (hosting, análisis, autenticación).
                </li>
                <li>
                  <strong>Autoridades legales:</strong> Cuando sea requerido por ley o para proteger derechos.
                </li>
                <li>
                  <strong>Socios de mapas:</strong> Servicios de geolocalización para predicciones de tráfico.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                5. Seguridad de los Datos
              </h2>
              <p className="leading-relaxed mb-2">Implementamos medidas de seguridad como:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Encriptación de contraseñas con algoritmos seguros</li>
                <li>Conexiones HTTPS para todas las comunicaciones</li>
                <li>Autenticación de dos factores (opcional)</li>
                <li>Monitoreo continuo de seguridad</li>
                <li>Bloqueo temporal tras intentos fallidos de inicio de sesión</li>
                <li>Auditorías regulares de seguridad</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                6. Sus Derechos
              </h2>
              <p className="leading-relaxed mb-2">Usted tiene derecho a:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Acceso:</strong> Solicitar una copia de sus datos personales</li>
                <li><strong>Rectificación:</strong> Corregir información inexacta</li>
                <li><strong>Eliminación:</strong> Solicitar la eliminación de su cuenta y datos</li>
                <li><strong>Portabilidad:</strong> Obtener sus datos en formato exportable</li>
                <li><strong>Oposición:</strong> Objetar ciertos usos de sus datos</li>
                <li><strong>Revocación:</strong> Retirar el consentimiento en cualquier momento</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                7. Cookies y Tecnologías de Seguimiento
              </h2>
              <p className="leading-relaxed">
                Utilizamos cookies para mejorar la funcionalidad del sitio, recordar sus preferencias y 
                analizar el tráfico. Puede configurar su navegador para rechazar cookies, aunque esto 
                puede limitar algunas funcionalidades del servicio.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                8. Retención de Datos
              </h2>
              <p className="leading-relaxed">
                Conservamos su información personal mientras su cuenta esté activa o según sea necesario 
                para proporcionar servicios. Los datos pueden conservarse por períodos más largos si así 
                lo requiere la ley o para resolver disputas.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                9. Privacidad de Menores
              </h2>
              <p className="leading-relaxed">
                Nuestro servicio no está dirigido a menores de 18 años. No recopilamos intencionalmente 
                información personal de menores. Si descubrimos que hemos recopilado datos de un menor, 
                los eliminaremos de inmediato.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                10. Cambios en esta Política
              </h2>
              <p className="leading-relaxed">
                Podemos actualizar esta política de privacidad periódicamente. Le notificaremos sobre 
                cambios significativos mediante correo electrónico o un aviso destacado en nuestro sitio.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                11. Contacto
              </h2>
              <p className="leading-relaxed mb-2">
                Para preguntas sobre esta política de privacidad o ejercer sus derechos:
              </p>
              <ul className="list-none space-y-1 ml-4">
                <li>📧 Email: privacidad@prediruta.com</li>
                <li>📱 Teléfono: +1 (555) 123-4567</li>
                <li>🏢 Dirección: Cerca de mi casa</li>
                <li>👤 Oficial de Protección de Datos: dpo@prediruta.com</li>
              </ul>
            </section>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-8">
              <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                Al utilizar PrediRuta, usted consiente la recopilación y uso de información según 
                se describe en esta política de privacidad.
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
