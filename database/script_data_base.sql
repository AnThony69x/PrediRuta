-- =========================================================
-- PrediRuta Database Initialization Script
-- Sistema de Predicción de Tráfico Vehicular con IA
-- =========================================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- =========================================================
-- TABLA: user_profiles
-- Perfiles de usuario (extiende la tabla auth.users de Supabase)
-- =========================================================
CREATE TABLE public.user_profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    avatar_url TEXT,
    phone VARCHAR(20),
    date_of_birth DATE,
    preferences JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========================================================
-- TABLA: road_segments
-- Segmentos de carretera para el análisis de tráfico
-- =========================================================
CREATE TABLE public.road_segments (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255),
    geometry GEOMETRY(LINESTRING, 4326) NOT NULL,
    road_type VARCHAR(50) CHECK (road_type IN ('highway', 'arterial', 'collector', 'local', 'residential')),
    speed_limit INTEGER DEFAULT 50,
    lanes INTEGER DEFAULT 2,
    surface_type VARCHAR(50) DEFAULT 'asphalt',
    length_km DECIMAL(10,3),
    city VARCHAR(100),
    province VARCHAR(100),
    country VARCHAR(3) DEFAULT 'EC',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========================================================
-- TABLA: traffic_data
-- Datos históricos y en tiempo real de tráfico
-- =========================================================
CREATE TABLE public.traffic_data (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    road_segment_id VARCHAR(255) REFERENCES public.road_segments(id) ON DELETE CASCADE,
    location GEOMETRY(POINT, 4326) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    speed_kmh DECIMAL(5,2) CHECK (speed_kmh >= 0 AND speed_kmh <= 200),
    traffic_level INTEGER CHECK (traffic_level BETWEEN 1 AND 5),
    vehicle_count INTEGER DEFAULT 0,
    congestion_factor DECIMAL(3,2) CHECK (congestion_factor >= 0 AND congestion_factor <= 1),
    weather_conditions JSONB DEFAULT '{}',
    data_source VARCHAR(50) DEFAULT 'system',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========================================================
-- TABLA: traffic_predictions
-- Predicciones de tráfico generadas por IA
-- =========================================================
CREATE TABLE public.traffic_predictions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    road_segment_id VARCHAR(255) REFERENCES public.road_segments(id) ON DELETE CASCADE,
    prediction_time TIMESTAMP WITH TIME ZONE NOT NULL,
    target_time TIMESTAMP WITH TIME ZONE NOT NULL,
    predicted_speed DECIMAL(5,2),
    predicted_traffic_level INTEGER CHECK (predicted_traffic_level BETWEEN 1 AND 5),
    congestion_probability DECIMAL(3,2) CHECK (congestion_probability >= 0 AND congestion_probability <= 1),
    confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
    model_version VARCHAR(50),
    features_used JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========================================================
-- TABLA: favorite_routes
-- Rutas favoritas de los usuarios
-- =========================================================
CREATE TABLE public.favorite_routes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    origin_name VARCHAR(255) NOT NULL,
    origin_coords GEOMETRY(POINT, 4326) NOT NULL,
    destination_name VARCHAR(255) NOT NULL,
    destination_coords GEOMETRY(POINT, 4326) NOT NULL,
    route_geometry GEOMETRY(LINESTRING, 4326),
    estimated_distance_km DECIMAL(8,3),
    estimated_duration_minutes INTEGER,
    preferences JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========================================================
-- TABLA: route_queries
-- Log de consultas de rutas realizadas por usuarios
-- =========================================================
CREATE TABLE public.route_queries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    session_id VARCHAR(255),
    origin_name VARCHAR(255),
    origin_coords GEOMETRY(POINT, 4326) NOT NULL,
    destination_name VARCHAR(255),
    destination_coords GEOMETRY(POINT, 4326) NOT NULL,
    departure_time TIMESTAMP WITH TIME ZONE,
    query_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    response_time_ms INTEGER,
    routes_returned INTEGER DEFAULT 0,
    selected_route_index INTEGER,
    preferences JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT
);

-- =========================================================
-- TABLA: route_options
-- Opciones de ruta sugeridas para cada consulta
-- =========================================================
CREATE TABLE public.route_options (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    query_id UUID REFERENCES public.route_queries(id) ON DELETE CASCADE,
    route_index INTEGER NOT NULL,
    route_name VARCHAR(255),
    route_geometry GEOMETRY(LINESTRING, 4326) NOT NULL,
    distance_km DECIMAL(8,3),
    duration_minutes INTEGER,
    traffic_level INTEGER CHECK (traffic_level BETWEEN 1 AND 5),
    route_type VARCHAR(50) DEFAULT 'fastest',
    toll_cost DECIMAL(8,2) DEFAULT 0,
    fuel_cost DECIMAL(8,2) DEFAULT 0,
    road_segments VARCHAR[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========================================================
-- TABLA: ml_models
-- Metadatos de los modelos de machine learning
-- =========================================================
CREATE TABLE public.ml_models (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    version VARCHAR(50) NOT NULL,
    model_type VARCHAR(100) NOT NULL,
    file_path TEXT,
    training_data_range TSTZRANGE,
    accuracy_metrics JSONB,
    features JSONB,
    parameters JSONB,
    is_active BOOLEAN DEFAULT FALSE,
    deployed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(name, version)
);

-- =========================================================
-- TABLA: system_logs
-- Logs del sistema para monitoreo y debugging
-- =========================================================
CREATE TABLE public.system_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    level VARCHAR(20) CHECK (level IN ('DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL')),
    message TEXT NOT NULL,
    module VARCHAR(100),
    function_name VARCHAR(100),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    request_id VARCHAR(255),
    extra_data JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========================================================
-- TABLA: api_usage
-- Seguimiento del uso de la API
-- =========================================================
CREATE TABLE public.api_usage (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    endpoint VARCHAR(255) NOT NULL,
    method VARCHAR(10) NOT NULL,
    status_code INTEGER,
    response_time_ms INTEGER,
    request_size_bytes INTEGER DEFAULT 0,
    response_size_bytes INTEGER DEFAULT 0,
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========================================================
-- ÍNDICES para optimización de consultas
-- =========================================================

-- Índices para user_profiles
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_created_at ON public.user_profiles(created_at);

-- Índices para road_segments
CREATE INDEX idx_road_segments_geometry ON public.road_segments USING GIST(geometry);
CREATE INDEX idx_road_segments_type ON public.road_segments(road_type);
CREATE INDEX idx_road_segments_city ON public.road_segments(city);
CREATE INDEX idx_road_segments_active ON public.road_segments(is_active);

-- Índices para traffic_data
CREATE INDEX idx_traffic_data_location ON public.traffic_data USING GIST(location);
CREATE INDEX idx_traffic_data_timestamp ON public.traffic_data(timestamp);
CREATE INDEX idx_traffic_data_road_segment ON public.traffic_data(road_segment_id);
CREATE INDEX idx_traffic_data_timestamp_segment ON public.traffic_data(road_segment_id, timestamp);
CREATE INDEX idx_traffic_data_level ON public.traffic_data(traffic_level);

-- Índices para traffic_predictions
CREATE INDEX idx_traffic_predictions_segment_target ON public.traffic_predictions(road_segment_id, target_time);
CREATE INDEX idx_traffic_predictions_prediction_time ON public.traffic_predictions(prediction_time);
CREATE INDEX idx_traffic_predictions_confidence ON public.traffic_predictions(confidence_score);

-- Índices para favorite_routes
CREATE INDEX idx_favorite_routes_user_id ON public.favorite_routes(user_id);
CREATE INDEX idx_favorite_routes_origin_coords ON public.favorite_routes USING GIST(origin_coords);
CREATE INDEX idx_favorite_routes_destination_coords ON public.favorite_routes USING GIST(destination_coords);
CREATE INDEX idx_favorite_routes_active ON public.favorite_routes(is_active);

-- Índices para route_queries
CREATE INDEX idx_route_queries_user_id ON public.route_queries(user_id);
CREATE INDEX idx_route_queries_query_time ON public.route_queries(query_time);
CREATE INDEX idx_route_queries_session_id ON public.route_queries(session_id);
CREATE INDEX idx_route_queries_origin_coords ON public.route_queries USING GIST(origin_coords);
CREATE INDEX idx_route_queries_destination_coords ON public.route_queries USING GIST(destination_coords);

-- Índices para route_options
CREATE INDEX idx_route_options_query_id ON public.route_options(query_id);
CREATE INDEX idx_route_options_route_geometry ON public.route_options USING GIST(route_geometry);
CREATE INDEX idx_route_options_traffic_level ON public.route_options(traffic_level);

-- Índices para ml_models
CREATE INDEX idx_ml_models_active ON public.ml_models(is_active);
CREATE INDEX idx_ml_models_type ON public.ml_models(model_type);
CREATE INDEX idx_ml_models_created_at ON public.ml_models(created_at);

-- Índices para system_logs
CREATE INDEX idx_system_logs_level ON public.system_logs(level);
CREATE INDEX idx_system_logs_timestamp ON public.system_logs(timestamp);
CREATE INDEX idx_system_logs_module ON public.system_logs(module);
CREATE INDEX idx_system_logs_user_id ON public.system_logs(user_id);

-- Índices para api_usage
CREATE INDEX idx_api_usage_user_id ON public.api_usage(user_id);
CREATE INDEX idx_api_usage_endpoint ON public.api_usage(endpoint);
CREATE INDEX idx_api_usage_timestamp ON public.api_usage(timestamp);
CREATE INDEX idx_api_usage_status_code ON public.api_usage(status_code);

-- =========================================================
-- FUNCIONES Y TRIGGERS
-- =========================================================

-- Función para actualizar timestamp de updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Función RPC para insertar un punto de tráfico (crea geometry desde lat/lon)
CREATE OR REPLACE FUNCTION public.insert_traffic_point(
    p_road_segment_id VARCHAR(255),
    p_lat DOUBLE PRECISION,
    p_lon DOUBLE PRECISION,
    p_timestamp TIMESTAMP WITH TIME ZONE,
    p_speed_kmh DECIMAL(5,2),
    p_traffic_level INTEGER,
    p_vehicle_count INTEGER,
    p_congestion_factor DECIMAL(3,2),
    p_data_source VARCHAR(50)
)
RETURNS TABLE(id UUID) AS $$
DECLARE
    v_id UUID;
BEGIN
    INSERT INTO public.traffic_data (
        road_segment_id, location, timestamp, speed_kmh, traffic_level, vehicle_count, congestion_factor, data_source
    ) VALUES (
        p_road_segment_id,
        ST_SetSRID(ST_Point(p_lon, p_lat), 4326),
        p_timestamp,
        p_speed_kmh,
        p_traffic_level,
        p_vehicle_count,
        p_congestion_factor,
        p_data_source
    ) RETURNING traffic_data.id INTO v_id;

    RETURN QUERY SELECT v_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.insert_traffic_point(
    VARCHAR, DOUBLE PRECISION, DOUBLE PRECISION, TIMESTAMPTZ, DECIMAL, INTEGER, INTEGER, DECIMAL, VARCHAR
) TO anon, authenticated, service_role;

-- Triggers para updated_at
CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON public.user_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_road_segments_updated_at 
    BEFORE UPDATE ON public.road_segments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_favorite_routes_updated_at 
    BEFORE UPDATE ON public.favorite_routes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ml_models_updated_at 
    BEFORE UPDATE ON public.ml_models 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================

-- Habilitar RLS en tablas que lo requieren
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorite_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.route_queries ENABLE ROW LEVEL SECURITY;

-- Políticas para user_profiles
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Políticas para favorite_routes
CREATE POLICY "Users can manage own favorite routes" ON public.favorite_routes
    FOR ALL USING (auth.uid() = user_id);

-- Políticas para route_queries
CREATE POLICY "Users can view own queries" ON public.route_queries
    FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert own queries" ON public.route_queries
    FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- =========================================================
-- VISTAS para consultas comunes
-- =========================================================

-- Vista de tráfico actual por segmento
CREATE OR REPLACE VIEW public.current_traffic_view AS
SELECT DISTINCT ON (road_segment_id)
    road_segment_id,
    rs.name as road_name,
    rs.city,
    td.speed_kmh,
    td.traffic_level,
    td.congestion_factor,
    td.timestamp,
    rs.geometry
FROM public.traffic_data td
JOIN public.road_segments rs ON td.road_segment_id = rs.id
WHERE td.timestamp >= NOW() - INTERVAL '1 hour'
ORDER BY road_segment_id, td.timestamp DESC;

-- Vista de rutas populares
CREATE OR REPLACE VIEW public.popular_routes_view AS
SELECT 
    origin_name,
    destination_name,
    COUNT(*) as query_count,
    AVG(response_time_ms) as avg_response_time,
    COUNT(DISTINCT user_id) as unique_users
FROM public.route_queries
WHERE query_time >= NOW() - INTERVAL '30 days'
GROUP BY origin_name, destination_name
HAVING COUNT(*) >= 5
ORDER BY query_count DESC;

-- =========================================================
-- COMENTARIOS DE DOCUMENTACIÓN
-- =========================================================

COMMENT ON TABLE public.user_profiles IS 'Perfiles extendidos de usuarios del sistema';
COMMENT ON TABLE public.road_segments IS 'Segmentos de carretera con información geográfica y características';
COMMENT ON TABLE public.traffic_data IS 'Datos históricos y en tiempo real del tráfico vehicular';
COMMENT ON TABLE public.traffic_predictions IS 'Predicciones de tráfico generadas por modelos de IA';
COMMENT ON TABLE public.favorite_routes IS 'Rutas favoritas guardadas por usuarios';
COMMENT ON TABLE public.route_queries IS 'Log de todas las consultas de rutas realizadas';
COMMENT ON TABLE public.route_options IS 'Opciones de ruta devueltas para cada consulta';
COMMENT ON TABLE public.ml_models IS 'Metadatos y versiones de los modelos de machine learning';
COMMENT ON TABLE public.system_logs IS 'Logs del sistema para monitoreo y debugging';
COMMENT ON TABLE public.api_usage IS 'Métricas de uso de la API REST';

-- =========================================================
-- DATOS INICIALES (opcional)
-- =========================================================

-- Insertar modelo ML inicial
INSERT INTO public.ml_models (name, version, model_type, is_active, features, parameters)
VALUES (
    'traffic_predictor',
    '1.0.0',
    'RandomForestRegressor',
    true,
    '["hour", "day_of_week", "weather_factor", "historical_avg_speed", "road_type"]',
    '{"n_estimators": 100, "max_depth": 20, "random_state": 42}'
);

-- Mensaje de finalización
DO $$
BEGIN
    RAISE NOTICE 'PrediRuta Database initialized successfully!';
    RAISE NOTICE 'Total tables created: 10';
    RAISE NOTICE 'Total indexes created: 25+';
    RAISE NOTICE 'RLS policies: Enabled for sensitive tables';
END $$;