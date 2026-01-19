-- =====================================================
-- Script SQL para crear tablas de historial en Supabase
-- =====================================================

-- Tabla para almacenar el historial de rutas consultadas
CREATE TABLE IF NOT EXISTS historial_rutas (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    fecha TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    origen TEXT NOT NULL,
    destino TEXT NOT NULL,
    distancia DECIMAL(10, 2) NOT NULL, -- Distancia en kilómetros
    duracion INTEGER NOT NULL, -- Duración en minutos
    tiempo_ahorrado INTEGER NOT NULL, -- Tiempo ahorrado en minutos
    trafico TEXT CHECK (trafico IN ('fluido', 'moderado', 'congestionado')),
    coordenadas_origen JSONB, -- { lat: number, lng: number }
    coordenadas_destino JSONB, -- { lat: number, lng: number }
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para almacenar el historial de predicciones consultadas
CREATE TABLE IF NOT EXISTS historial_predicciones (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    fecha DATE NOT NULL,
    zona TEXT NOT NULL,
    hora_consulta TEXT NOT NULL,
    precision_real INTEGER NOT NULL CHECK (precision_real >= 0 AND precision_real <= 100),
    congestion_predicha DECIMAL(3, 2) NOT NULL CHECK (congestion_predicha >= 0 AND congestion_predicha <= 1),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar el rendimiento de consultas
CREATE INDEX IF NOT EXISTS idx_historial_rutas_user_id ON historial_rutas(user_id);
CREATE INDEX IF NOT EXISTS idx_historial_rutas_fecha ON historial_rutas(fecha DESC);
CREATE INDEX IF NOT EXISTS idx_historial_rutas_user_fecha ON historial_rutas(user_id, fecha DESC);

CREATE INDEX IF NOT EXISTS idx_historial_predicciones_user_id ON historial_predicciones(user_id);
CREATE INDEX IF NOT EXISTS idx_historial_predicciones_fecha ON historial_predicciones(fecha DESC);
CREATE INDEX IF NOT EXISTS idx_historial_predicciones_user_fecha ON historial_predicciones(user_id, fecha DESC);

-- Función para actualizar automáticamente updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualizar updated_at automáticamente
DROP TRIGGER IF EXISTS update_historial_rutas_updated_at ON historial_rutas;
CREATE TRIGGER update_historial_rutas_updated_at
    BEFORE UPDATE ON historial_rutas
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_historial_predicciones_updated_at ON historial_predicciones;
CREATE TRIGGER update_historial_predicciones_updated_at
    BEFORE UPDATE ON historial_predicciones
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- Políticas de seguridad (Row Level Security - RLS)
-- =====================================================

-- Habilitar RLS en ambas tablas
ALTER TABLE historial_rutas ENABLE ROW LEVEL SECURITY;
ALTER TABLE historial_predicciones ENABLE ROW LEVEL SECURITY;

-- Política para historial_rutas: Los usuarios solo pueden ver, insertar y eliminar sus propias rutas
DROP POLICY IF EXISTS "Users can view their own route history" ON historial_rutas;
CREATE POLICY "Users can view their own route history"
    ON historial_rutas
    FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own route history" ON historial_rutas;
CREATE POLICY "Users can insert their own route history"
    ON historial_rutas
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own route history" ON historial_rutas;
CREATE POLICY "Users can delete their own route history"
    ON historial_rutas
    FOR DELETE
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own route history" ON historial_rutas;
CREATE POLICY "Users can update their own route history"
    ON historial_rutas
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Política para historial_predicciones: Los usuarios solo pueden ver, insertar y eliminar sus propias predicciones
DROP POLICY IF EXISTS "Users can view their own prediction history" ON historial_predicciones;
CREATE POLICY "Users can view their own prediction history"
    ON historial_predicciones
    FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own prediction history" ON historial_predicciones;
CREATE POLICY "Users can insert their own prediction history"
    ON historial_predicciones
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own prediction history" ON historial_predicciones;
CREATE POLICY "Users can delete their own prediction history"
    ON historial_predicciones
    FOR DELETE
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own prediction history" ON historial_predicciones;
CREATE POLICY "Users can update their own prediction history"
    ON historial_predicciones
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- Comentarios para documentación
-- =====================================================

COMMENT ON TABLE historial_rutas IS 'Almacena el historial de rutas consultadas por los usuarios';
COMMENT ON TABLE historial_predicciones IS 'Almacena el historial de predicciones de tráfico consultadas por los usuarios';

COMMENT ON COLUMN historial_rutas.id IS 'Identificador único de la ruta consultada';
COMMENT ON COLUMN historial_rutas.user_id IS 'ID del usuario que consultó la ruta';
COMMENT ON COLUMN historial_rutas.fecha IS 'Fecha y hora de la consulta';
COMMENT ON COLUMN historial_rutas.origen IS 'Ubicación de origen';
COMMENT ON COLUMN historial_rutas.destino IS 'Ubicación de destino';
COMMENT ON COLUMN historial_rutas.distancia IS 'Distancia total de la ruta en kilómetros';
COMMENT ON COLUMN historial_rutas.duracion IS 'Duración estimada del viaje en minutos';
COMMENT ON COLUMN historial_rutas.tiempo_ahorrado IS 'Tiempo ahorrado estimado en minutos';
COMMENT ON COLUMN historial_rutas.trafico IS 'Nivel de tráfico: fluido, moderado o congestionado';
COMMENT ON COLUMN historial_rutas.coordenadas_origen IS 'Coordenadas geográficas del origen (lat, lng)';
COMMENT ON COLUMN historial_rutas.coordenadas_destino IS 'Coordenadas geográficas del destino (lat, lng)';

COMMENT ON COLUMN historial_predicciones.id IS 'Identificador único de la predicción';
COMMENT ON COLUMN historial_predicciones.user_id IS 'ID del usuario que consultó la predicción';
COMMENT ON COLUMN historial_predicciones.fecha IS 'Fecha de la predicción';
COMMENT ON COLUMN historial_predicciones.zona IS 'Zona geográfica de la predicción';
COMMENT ON COLUMN historial_predicciones.hora_consulta IS 'Hora de la consulta en formato HH:MM';
COMMENT ON COLUMN historial_predicciones.precision_real IS 'Precisión real de la predicción (0-100%)';
COMMENT ON COLUMN historial_predicciones.congestion_predicha IS 'Nivel de congestión predicho (0-1)';

-- =====================================================
-- Vista para estadísticas de usuario
-- =====================================================

CREATE OR REPLACE VIEW estadisticas_historial_usuario AS
SELECT 
    hr.user_id,
    COUNT(DISTINCT hr.id) as total_rutas_consultadas,
    SUM(hr.distancia) as kilometros_totales,
    SUM(hr.tiempo_ahorrado) as minutos_ahorrados_totales,
    AVG(hp.precision_real) as precision_promedio_predicciones,
    COUNT(DISTINCT hp.id) as total_predicciones_consultadas
FROM historial_rutas hr
LEFT JOIN historial_predicciones hp ON hr.user_id = hp.user_id
GROUP BY hr.user_id;

COMMENT ON VIEW estadisticas_historial_usuario IS 'Estadísticas agregadas del historial por usuario';

-- =====================================================
-- Función para limpiar historial antiguo (opcional)
-- =====================================================

CREATE OR REPLACE FUNCTION limpiar_historial_antiguo(dias_antiguedad INTEGER DEFAULT 90)
RETURNS INTEGER AS $$
DECLARE
    registros_eliminados INTEGER;
BEGIN
    -- Eliminar rutas más antiguas que X días
    WITH deleted AS (
        DELETE FROM historial_rutas
        WHERE fecha < NOW() - INTERVAL '1 day' * dias_antiguedad
        RETURNING id
    )
    SELECT COUNT(*) INTO registros_eliminados FROM deleted;
    
    -- Eliminar predicciones más antiguas que X días
    WITH deleted AS (
        DELETE FROM historial_predicciones
        WHERE created_at < NOW() - INTERVAL '1 day' * dias_antiguedad
        RETURNING id
    )
    SELECT registros_eliminados + COUNT(*) INTO registros_eliminados FROM deleted;
    
    RETURN registros_eliminados;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION limpiar_historial_antiguo IS 'Elimina registros del historial más antiguos que el número de días especificado';

-- =====================================================
-- Datos de ejemplo (OPCIONAL - Solo para desarrollo)
-- =====================================================

-- DESCOMENTAR SOLO EN DESARROLLO:
-- INSERT INTO historial_rutas (id, user_id, fecha, origen, destino, distancia, duracion, tiempo_ahorrado, trafico, coordenadas_origen, coordenadas_destino)
-- SELECT 
--     'ruta_' || generate_series || '_' || substr(md5(random()::text), 1, 8),
--     auth.uid(),
--     NOW() - (random() * interval '30 days'),
--     'Origen ' || generate_series,
--     'Destino ' || generate_series,
--     (random() * 50 + 5)::DECIMAL(10,2),
--     (random() * 60 + 10)::INTEGER,
--     (random() * 15 + 3)::INTEGER,
--     (ARRAY['fluido', 'moderado', 'congestionado'])[floor(random() * 3 + 1)],
--     jsonb_build_object('lat', -2.0 + random() * 0.5, 'lng', -79.0 + random() * 0.5),
--     jsonb_build_object('lat', -2.0 + random() * 0.5, 'lng', -79.0 + random() * 0.5)
-- FROM generate_series(1, 10)
-- WHERE auth.uid() IS NOT NULL;

-- =====================================================
-- Fin del script
-- =====================================================

-- Para aplicar este script en Supabase:
-- 1. Ve a tu proyecto en https://supabase.com
-- 2. Navega a SQL Editor en el menú lateral
-- 3. Crea una nueva query
-- 4. Copia y pega este script completo
-- 5. Ejecuta el script
-- 6. Verifica que las tablas se crearon correctamente en la sección "Table Editor"
