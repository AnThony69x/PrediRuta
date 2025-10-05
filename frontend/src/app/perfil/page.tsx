"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Link from "next/link";

function PerfilPageContent() {
  const { user, loading: authLoading, signOut, applyDarkMode } = useAuth();
  const [perfil, setPerfil] = useState<any>(null);
  const [nombre, setNombre] = useState("");
  const [idioma, setIdioma] = useState("es");
  const [avatar, setAvatar] = useState("");
  const [modoOscuro, setModoOscuro] = useState(false);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [subiendoAvatar, setSubiendoAvatar] = useState(false);
  const [storageDisponible, setStorageDisponible] = useState(true);
  const [conectado, setConectado] = useState(true);
  
  // Estados para detectar cambios
  const [valoresOriginales, setValoresOriginales] = useState({
    nombre: '',
    idioma: 'es',
    avatar: '',
    modoOscuro: false
  });
  const [hayCambios, setHayCambios] = useState(false);

  // Función para detectar cambios
  function detectarCambios() {
    const cambiosDetectados = 
      nombre !== valoresOriginales.nombre ||
      idioma !== valoresOriginales.idioma ||
      avatar !== valoresOriginales.avatar ||
      modoOscuro !== valoresOriginales.modoOscuro;
    
    setHayCambios(cambiosDetectados);
  }

  // Efecto para detectar cambios cuando cambian los valores
  useEffect(() => {
    detectarCambios();
  }, [nombre, idioma, avatar, modoOscuro, valoresOriginales]);

  // Verificar conexión y storage
  useEffect(() => {
    async function verificarServicios() {
      // Verificar conexión general
      try {
        const { error: authError } = await supabase.auth.getSession();
        if (authError && authError.message.includes('Failed to fetch')) {
          setConectado(false);
          setErr('❌ Sin conexión a internet. Verifica tu conexión.');
        } else {
          setConectado(true);
        }
      } catch (error) {
        setConectado(false);
        setErr('❌ Sin conexión a internet. Verifica tu conexión.');
      }

      // Verificar storage solo si hay conexión
      if (conectado) {
        try {
          const { error } = await supabase.storage
            .from('avatars')
            .list('', { limit: 1 });
          
          if (error && (error.message.includes('not found') || error.message.includes('bucket'))) {
            setStorageDisponible(false);
            console.warn('Storage bucket "avatars" no está configurado');
          } else {
            setStorageDisponible(true);
          }
        } catch (error) {
          console.warn('No se pudo verificar el storage:', error);
          setStorageDisponible(false);
        }
      }
    }
    
    verificarServicios();
    
    // Verificar conexión cada 30 segundos
    const intervalo = setInterval(() => {
      if (!conectado) {
        verificarServicios();
      }
    }, 30000);
    
    return () => clearInterval(intervalo);
  }, [conectado]);

  // Consultar perfil al cargar
  useEffect(() => {
    async function fetchProfile() {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        // Intentar obtener desde user_profiles, si no existe usar metadata del user
        const { data, error } = await supabase
          .from("user_profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          // Error diferente a "no encontrado"
          console.error('Error al cargar perfil:', error);
          
          // Manejar errores específicos
          if (error.message.includes('JWT')) {
            setErr('❌ Sesión expirada. Por favor, inicia sesión nuevamente.');
          } else if (error.message.includes('permission')) {
            setErr('❌ No tienes permisos para acceder a tu perfil. Contacta al administrador.');
          } else if (error.message.includes('connection')) {
            setErr('❌ Error de conexión. Verifica tu conexión a internet.');
          } else {
            setErr(`❌ Error al cargar perfil: ${error.message}`);
          }
          
          // Usar datos básicos del usuario como fallback
          const fallbackProfile = {
            id: user.id,
            email: user.email || '',
            full_name: user.user_metadata?.full_name || user.user_metadata?.name || '',
            avatar_url: user.user_metadata?.avatar_url || '',
            preferences: { idioma: 'es', modo_oscuro: false }
          };
          setPerfil(fallbackProfile);
          setNombre(fallbackProfile.full_name);
          setAvatar(fallbackProfile.avatar_url);
          setIdioma('es');
          setModoOscuro(false);
          
          // Establecer valores originales
          setValoresOriginales({
            nombre: fallbackProfile.full_name,
            idioma: 'es',
            avatar: fallbackProfile.avatar_url,
            modoOscuro: false
          });
          
        } else if (data) {
          // Perfil encontrado en la tabla
          setPerfil(data);
          const nombrePerfil = data.full_name || '';
          const idiomaPerfil = data.preferences?.idioma || 'es';
          const avatarPerfil = data.avatar_url || '';
          const modoOscuroPerfil = data.preferences?.modo_oscuro || false;
          
          setNombre(nombrePerfil);
          setIdioma(idiomaPerfil);
          setAvatar(avatarPerfil);
          setModoOscuro(modoOscuroPerfil);
          
          // Establecer valores originales
          setValoresOriginales({
            nombre: nombrePerfil,
            idioma: idiomaPerfil,
            avatar: avatarPerfil,
            modoOscuro: modoOscuroPerfil
          });
        } else {
          // No hay perfil en la tabla, usar datos del user
          const profileFromUser = {
            id: user.id,
            email: user.email || '',
            full_name: user.user_metadata?.full_name || user.user_metadata?.name || '',
            avatar_url: user.user_metadata?.avatar_url || '',
            preferences: { idioma: 'es', modo_oscuro: false }
          };
          setPerfil(profileFromUser);
          setNombre(profileFromUser.full_name);
          setAvatar(profileFromUser.avatar_url);
          setIdioma('es');
          setModoOscuro(false);
          
          // Establecer valores originales
          setValoresOriginales({
            nombre: profileFromUser.full_name,
            idioma: 'es',
            avatar: profileFromUser.avatar_url,
            modoOscuro: false
          });
        }
      } catch (error: any) {
        console.error('Error inesperado al cargar perfil:', error);
        setErr('❌ Error inesperado al cargar tu perfil. Intenta recargar la página.');
        
        // Fallback con datos mínimos
        const minimalProfile = {
          id: user.id,
          email: user.email || 'usuario@ejemplo.com',
          full_name: '',
          avatar_url: '',
          preferences: { idioma: 'es', modo_oscuro: false }
        };
        setPerfil(minimalProfile);
        setNombre('');
        setAvatar('');
        setIdioma('es');
        setModoOscuro(false);
        
        // Establecer valores originales
        setValoresOriginales({
          nombre: '',
          idioma: 'es',
          avatar: '',
          modoOscuro: false
        });
      } finally {
        setLoading(false);
      }
    }
    
    if (!authLoading && user) {
      fetchProfile();
    } else if (!authLoading && !user) {
      setLoading(false);
      setErr('❌ No se encontró información de usuario. Por favor, inicia sesión.');
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (msg) {
      const timer = setTimeout(() => setMsg(""), 2000);
      return () => clearTimeout(timer);
    }
  }, [msg]);

  // Aplicar modo oscuro globalmente
  useEffect(() => {
    applyDarkMode(modoOscuro);
  }, [modoOscuro, applyDarkMode]);

  // Función para subir avatar
  const subirAvatar = async (archivo: File) => {
    if (!user) {
      setErr('❌ Error de autenticación. Por favor, inicia sesión nuevamente.');
      return;
    }
    
    setSubiendoAvatar(true);
    setErr('');
    setMsg('');
    
    try {
      // Validar tipo de archivo
      const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!tiposPermitidos.includes(archivo.type)) {
        throw new Error('Formato no válido. Solo se permiten archivos JPG, PNG, GIF y WebP');
      }
      
      // Validar tamaño (máximo 2MB)
      if (archivo.size > 2 * 1024 * 1024) {
        throw new Error('El archivo es demasiado grande. El tamaño máximo es 2MB');
      }
      
      // Validar dimensiones mínimas (opcional)
      const img = new Image();
      const validarImagen = new Promise<boolean>((resolve, reject) => {
        img.onload = () => {
          if (img.width < 50 || img.height < 50) {
            reject(new Error('La imagen debe ser de al menos 50x50 píxeles'));
          } else {
            resolve(true);
          }
        };
        img.onerror = () => reject(new Error('Archivo de imagen corrupto'));
        img.src = URL.createObjectURL(archivo);
      });
      
      await validarImagen;
      
      // Generar nombre único para el archivo
      const extension = archivo.name.split('.').pop()?.toLowerCase() || 'jpg';
      const nombreArchivo = `${user.id}/avatar-${Date.now()}.${extension}`;
      
      // Intentar subir archivo a Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(nombreArchivo, archivo, {
          cacheControl: '3600',
          upsert: true // Permitir sobrescribir
        });
      
      if (uploadError) {
        // Manejar errores específicos de Storage
        if (uploadError.message.includes('not found') || uploadError.message.includes('bucket')) {
          throw new Error('El servicio de almacenamiento no está configurado. Contacta al administrador.');
        } else if (uploadError.message.includes('policy')) {
          throw new Error('No tienes permisos para subir archivos. Contacta al administrador.');
        } else if (uploadError.message.includes('size')) {
          throw new Error('El archivo es demasiado grande para el servidor.');
        } else {
          throw new Error(`Error al subir archivo: ${uploadError.message}`);
        }
      }
      
      if (!data?.path) {
        throw new Error('No se pudo obtener la ruta del archivo subido');
      }
      
      // Obtener URL pública del archivo
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(data.path);
      
      if (!urlData?.publicUrl) {
        throw new Error('No se pudo generar la URL pública del avatar');
      }
      
      // Actualizar estado local
      setAvatar(urlData.publicUrl);
      setMsg('✅ Avatar subido correctamente. No olvides guardar los cambios para que sean permanentes.');
      
      // Limpiar el objeto URL temporal
      URL.revokeObjectURL(img.src);
      
    } catch (error: any) {
      console.error('Error al subir avatar:', error);
      
      // Mensaje de error más específico
      if (error.message.includes('Failed to fetch')) {
        setErr('❌ Error de conexión. Verifica tu conexión a internet e intenta nuevamente.');
      } else if (error.message.includes('not found') || error.message.includes('bucket')) {
        setErr('❌ Servicio de almacenamiento no disponible temporalmente. Intenta más tarde.');
      } else {
        setErr(`❌ ${error.message}`);
      }
    } finally {
      setSubiendoAvatar(false);
    }
  };
  
  // Función para manejar la selección de archivo
  const manejarSeleccionArchivo = (event: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = event.target.files?.[0];
    if (archivo) {
      subirAvatar(archivo);
    }
  };

  async function actualizarPerfil(e: React.FormEvent) {
    e.preventDefault();
    setMsg('');
    setErr('');
    setGuardando(true);
    
    try {
      // Validaciones mejoradas
      if (!nombre.trim()) {
        throw new Error('El nombre es obligatorio');
      }
      
      if (nombre.trim().length < 2) {
        throw new Error('El nombre debe tener al menos 2 caracteres');
      }
      
      if (nombre.trim().length > 100) {
        throw new Error('El nombre no puede tener más de 100 caracteres');
      }
      
      // Validar caracteres especiales
      const nombreRegex = /^[a-zA-ZñÑáéíóúÁÉÍÓÚüÜ\s]+$/;
      if (!nombreRegex.test(nombre.trim())) {
        throw new Error('El nombre solo puede contener letras y espacios');
      }
      
      if (!user) {
        throw new Error('Error de autenticación. Por favor, inicia sesión nuevamente.');
      }

      // Datos del perfil con todas las preferencias
      const profileData = {
        id: user.id,
        email: user.email || '',
        full_name: nombre.trim(),
        avatar_url: avatar,
        preferences: { 
          ...(perfil?.preferences || {}), 
          idioma, 
          modo_oscuro: modoOscuro 
        },
        updated_at: new Date().toISOString()
      };

      const { error: upsertError } = await supabase
        .from('user_profiles')
        .upsert(profileData, { onConflict: 'id' });

      if (upsertError) {
        // Manejar errores específicos de la base de datos
        if (upsertError.message.includes('JWT')) {
          throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
        } else if (upsertError.message.includes('permission')) {
          throw new Error('No tienes permisos para actualizar tu perfil.');
        } else if (upsertError.message.includes('connection')) {
          throw new Error('Error de conexión. Verifica tu conexión a internet.');
        } else {
          throw new Error(`Error al guardar en la base de datos: ${upsertError.message}`);
        }
      }
      
      // Actualizar estado local
      setPerfil(profileData);
      
      // También actualizar los metadatos del usuario en auth (con manejo de errores)
      try {
        await supabase.auth.updateUser({
          data: { 
            full_name: nombre.trim(),
            avatar_url: avatar,
            preferences: {
              idioma,
              modo_oscuro: modoOscuro
            }
          }
        });
        
        // Aplicar modo oscuro globalmente después de guardar
        applyDarkMode(modoOscuro);
        
      } catch (authError: any) {
        console.warn('No se pudieron actualizar los metadatos de autenticación:', authError);
        // No fallar completamente si los metadatos no se actualizan
      }
      
      setMsg('✅ Perfil actualizado correctamente. Todos los cambios han sido guardados.');
      
      // Actualizar valores originales después de guardar
      setValoresOriginales({
        nombre: nombre.trim(),
        idioma,
        avatar,
        modoOscuro
      });
      
    } catch (error: any) {
      console.error('Error al actualizar perfil:', error);
      
      // Mensajes de error más específicos
      if (error.message.includes('Failed to fetch')) {
        setErr('❌ Error de conexión. Verifica tu conexión a internet e intenta nuevamente.');
      } else {
        setErr(`❌ ${error.message}`);
      }
    } finally {
      setGuardando(false);
    }
  }

  async function cerrarSesion() {
    try {
      setGuardando(true); // Usar el mismo estado para mostrar loading
      setErr('');
      setMsg('');
      
      await signOut();
      
      // El hook useAuth ya maneja la redirección automáticamente
      setMsg('✅ Sesión cerrada correctamente. Redirigiendo...');
      
    } catch (error: any) {
      console.error('Error al cerrar sesión:', error);
      
      if (error.message.includes('Failed to fetch')) {
        setErr('❌ Error de conexión al cerrar sesión. Intenta recargar la página.');
      } else {
        setErr(`❌ Error al cerrar sesión: ${error.message}`);
      }
    } finally {
      setGuardando(false);
    }
  }

  if (authLoading || loading) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg max-w-md">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent mx-auto"></div>
        <span className="block text-center mt-4 text-gray-600 dark:text-gray-300">
          {authLoading ? 'Verificando autenticación...' : 'Cargando perfil...'}
        </span>
      </div>
    </div>
  );
  
  if (!perfil) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg max-w-md text-center">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Error al cargar perfil</h2>
        <p className="text-red-600 dark:text-red-400 mb-4">No se pudo cargar tu información de perfil.</p>
        <div className="space-y-2">
          <Link 
            href="/dashboard" 
            className="block w-full bg-blue-600 text-white rounded-lg py-2 px-4 hover:bg-blue-700 transition-colors"
          >
            Volver al Dashboard
          </Link>
          <button 
            onClick={() => window.location.reload()} 
            className="block w-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg py-2 px-4 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Recargar página
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
      {/* Indicador de estado de conexión */}
      {!conectado && (
        <div className="bg-red-600 text-white p-2 text-center text-sm">
          <div className="flex items-center justify-center space-x-2">
            <svg className="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Sin conexión a internet - Verificando conexión...</span>
          </div>
        </div>
      )}
      
      {conectado && !storageDisponible && (
        <div className="bg-yellow-600 text-white p-2 text-center text-sm">
          <div className="flex items-center justify-center space-x-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span>Subida de archivos no disponible - Bucket no configurado</span>
          </div>
        </div>
      )}
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mr-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Mi Perfil</h1>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {user?.email}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start mb-8 space-y-4 sm:space-y-0 sm:space-x-6">
            {/* Avatar con previsualización mejorada */}
            <div className="relative group">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-blue-200 dark:border-blue-700 shadow-lg">
                {avatar ? (
                  <img 
                    src={avatar} 
                    alt="Avatar del usuario" 
                    className="w-full h-full object-cover"
                    onError={() => setAvatar('')} // Fallback si la imagen falla
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl sm:text-4xl font-bold">
                    {nombre ? nombre.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              
              {/* Overlay para subir imagen */}
              <div className={`absolute inset-0 bg-black rounded-full flex flex-col items-center justify-center transition-all duration-200 ${
                !storageDisponible 
                  ? 'bg-opacity-30 opacity-100' 
                  : 'bg-opacity-50 opacity-0 group-hover:opacity-100'
              }`}>
                <label htmlFor="avatar-upload" className={`flex flex-col items-center text-white ${storageDisponible ? 'cursor-pointer' : 'cursor-not-allowed'}`}>
                  {subiendoAvatar ? (
                    <>
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-2"></div>
                      <span className="text-xs font-medium">Subiendo...</span>
                    </>
                  ) : !storageDisponible ? (
                    <>
                      <svg className="w-8 h-8 mb-2 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <span className="text-xs font-medium text-center text-yellow-400">No<br/>disponible</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span className="text-xs font-medium text-center">Cambiar<br/>foto</span>
                    </>
                  )}
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={manejarSeleccionArchivo}
                  className="hidden"
                  disabled={subiendoAvatar || !storageDisponible}
                />
              </div>
              
              {/* Botón para quitar avatar */}
              {avatar && (
                <button
                  type="button"
                  onClick={() => setAvatar('')}
                  className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg transition-colors"
                  title="Quitar avatar"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            
            {/* Información del usuario */}
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {nombre || 'Usuario'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-3">{user?.email}</p>
              
              <div className="space-y-2">
                <div className="flex items-center justify-center sm:justify-start space-x-2">
                  <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Idioma: {idioma === 'es' ? '🇪🇸 Español' : '🇺🇸 English'}
                  </span>
                </div>
                
                <div className="flex items-center justify-center sm:justify-start space-x-2">
                  <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Tema: {modoOscuro ? '🌙 Oscuro' : '☀️ Claro'}
                  </span>
                </div>
              </div>
              
              {/* Instrucciones para el avatar */}
              <div className="mt-4 space-y-2">
                {!storageDisponible && (
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <p className="text-xs text-yellow-700 dark:text-yellow-300 text-center sm:text-left">
                      <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      ⚠️ Subida de archivos temporalmente no disponible. Contacta al administrador.
                    </p>
                  </div>
                )}
                
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-xs text-blue-700 dark:text-blue-300 text-center sm:text-left">
                    <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {storageDisponible 
                      ? 'Haz clic en tu foto para cambiarla. Formatos: JPG, PNG, GIF (máx. 2MB)'
                      : 'Subida de imágenes no disponible temporalmente'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={actualizarPerfil} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nombre completo *
              </label>
              <input
                type="text"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Ingresa tu nombre completo"
                required
                minLength={2}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Correo electrónico
              </label>
              <input
                type="email"
                value={perfil.email || ''}
                disabled
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-gray-300 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">No puedes cambiar tu correo electrónico</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Idioma preferido
              </label>
              <select
                value={idioma}
                onChange={e => setIdioma(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="es">🇪🇸 Español</option>
                <option value="en">🇺🇸 Inglés</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Preferencias de visualización
              </label>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Modo oscuro</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Se aplicará en toda la aplicación al guardar</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setModoOscuro(!modoOscuro)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${modoOscuro ? 'bg-blue-600' : 'bg-gray-200'}`}
                    role="switch"
                    aria-checked={modoOscuro}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${modoOscuro ? 'translate-x-5' : 'translate-x-0'}`}
                    />
                  </button>
                </div>
              </div>
            </div>
            {msg && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-green-700 dark:text-green-300 text-sm">{msg}</p>
                </div>
              </div>
            )}
            
            {err && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-red-600 dark:text-red-400 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-red-700 dark:text-red-300 text-sm">{err}</p>
                    
                    {/* Información adicional para errores de storage */}
                    {(err.includes('almacenamiento') || err.includes('bucket') || err.includes('Storage')) && (
                      <div className="mt-3 p-3 bg-red-100 dark:bg-red-800/30 rounded border border-red-200 dark:border-red-700">
                        <p className="text-xs text-red-600 dark:text-red-400 mb-2 font-medium">
                          📋 Información para el administrador:
                        </p>
                        <ul className="text-xs text-red-600 dark:text-red-400 space-y-1 list-disc list-inside">
                          <li>Crear bucket 'avatars' en Supabase Storage</li>
                          <li>Configurar políticas RLS para permitir subida/descarga</li>
                          <li>Verificar permisos de acceso público</li>
                        </ul>
                      </div>
                    )}
                    
                    {/* Botón para reintentar verificación de storage */}
                    {err.includes('almacenamiento') && (
                      <button
                        onClick={async () => {
                          setErr('');
                          try {
                            const { error } = await supabase.storage.from('avatars').list('', { limit: 1 });
                            if (!error) {
                              setStorageDisponible(true);
                              setMsg('✅ Servicio de almacenamiento restaurado');
                            }
                          } catch (error) {
                            setErr('❌ El servicio de almacenamiento sigue no disponible');
                          }
                        }}
                        className="mt-2 text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition-colors"
                      >
                        🔄 Verificar nuevamente
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                disabled={guardando || !hayCambios}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg py-3 px-6 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <span className="flex items-center justify-center">
                  {guardando ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Guardando...
                    </>
                  ) : (
                    <>
                      {hayCambios ? (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Guardar cambios
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                          </svg>
                          Sin cambios
                        </>
                      )}
                    </>
                  )}
                </span>
              </button>
              
              <button
                type="button"
                onClick={cerrarSesion}
                disabled={guardando}
                className="sm:w-auto bg-red-600 text-white rounded-lg py-3 px-6 hover:bg-red-700 transform hover:scale-105 transition-all duration-200 font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <span className="flex items-center justify-center">
                  {guardando ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Cerrando...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Cerrar sesión
                    </>
                  )}
                </span>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default function PerfilPage() {
  return (
    <ProtectedRoute>
      <PerfilPageContent />
    </ProtectedRoute>
  );
}