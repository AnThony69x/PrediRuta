'use client';

import { AppLayout } from '@/components/layout/AppLayout';
import { useTranslation } from '@/hooks/useTranslation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { useState } from 'react';

export default function ContactoPage() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar el formulario
    console.log('Formulario enviado:', formData);
    // Resetear formulario
    setFormData({ name: '', email: '', subject: '', message: '' });
    alert('¡Mensaje enviado! Nos pondremos en contacto pronto.');
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-blue-950 dark:to-cyan-950 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-cyan-600 to-purple-600 bg-clip-text text-transparent mb-2">
              {t('footer.contact')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              ¿Tienes preguntas o sugerencias? Estamos aquí para ayudarte.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Formulario de contacto */}
            <Card className="border-blue-100 dark:border-blue-900">
              <CardHeader>
                <CardTitle className="text-blue-700 dark:text-blue-300">
                  Envíanos un mensaje
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nombre
                    </label>
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Tu nombre completo"
                      required
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('auth.email')}
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="tu@email.com"
                      required
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Asunto
                    </label>
                    <Input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="¿En qué podemos ayudarte?"
                      required
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Mensaje
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Escribe tu mensaje aquí..."
                      required
                      rows={5}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <Button type="submit" className="w-full flex items-center justify-center gap-2">
                    <Send className="h-4 w-4" />
                    Enviar mensaje
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Información de contacto */}
            <div className="space-y-6">
              <Card className="border-cyan-100 dark:border-cyan-900">
                <CardHeader>
                  <CardTitle className="text-cyan-700 dark:text-cyan-300">
                    Información de contacto
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">Email</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        soporte@prediruta.com
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">Teléfono</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        +593 (02) 123-4567
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">Dirección</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Quito, Ecuador
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-purple-100 dark:border-purple-900">
                <CardHeader>
                  <CardTitle className="text-purple-700 dark:text-purple-300">
                    Horario de atención
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Lunes - Viernes</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">8:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Sábado</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">9:00 AM - 2:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Domingo</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">Cerrado</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 border-blue-200 dark:border-blue-800">
                <CardContent className="pt-6">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>¿Necesitas ayuda inmediata?</strong>
                    <br />
                    Consulta nuestra <a href="/docs" className="text-blue-600 dark:text-blue-400 hover:underline">documentación</a> o visita la sección de <a href="/ayuda" className="text-blue-600 dark:text-blue-400 hover:underline">ayuda</a>.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
