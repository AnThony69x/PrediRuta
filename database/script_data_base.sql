-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.api_usage (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  endpoint character varying NOT NULL,
  method character varying NOT NULL,
  status_code integer,
  response_time_ms integer,
  request_size_bytes integer DEFAULT 0,
  response_size_bytes integer DEFAULT 0,
  ip_address inet,
  user_agent text,
  timestamp timestamp with time zone DEFAULT now(),
  CONSTRAINT api_usage_pkey PRIMARY KEY (id),
  CONSTRAINT api_usage_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_profiles(id)
);
CREATE TABLE public.favorite_routes (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  name character varying NOT NULL,
  origin_name character varying NOT NULL,
  origin_coords USER-DEFINED NOT NULL,
  destination_name character varying NOT NULL,
  destination_coords USER-DEFINED NOT NULL,
  route_geometry USER-DEFINED,
  estimated_distance_km numeric,
  estimated_duration_minutes integer,
  preferences jsonb DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT favorite_routes_pkey PRIMARY KEY (id),
  CONSTRAINT favorite_routes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_profiles(id)
);
CREATE TABLE public.ml_models (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name character varying NOT NULL,
  version character varying NOT NULL,
  model_type character varying NOT NULL,
  file_path text,
  training_data_range tstzrange,
  accuracy_metrics jsonb,
  features jsonb,
  parameters jsonb,
  is_active boolean DEFAULT false,
  deployed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT ml_models_pkey PRIMARY KEY (id)
);
CREATE TABLE public.road_segments (
  id character varying NOT NULL,
  name character varying,
  geometry USER-DEFINED NOT NULL,
  road_type character varying CHECK (road_type::text = ANY (ARRAY['highway'::character varying, 'arterial'::character varying, 'collector'::character varying, 'local'::character varying, 'residential'::character varying]::text[])),
  speed_limit integer DEFAULT 50,
  lanes integer DEFAULT 2,
  surface_type character varying DEFAULT 'asphalt'::character varying,
  length_km numeric,
  city character varying,
  province character varying,
  country character varying DEFAULT 'EC'::character varying,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT road_segments_pkey PRIMARY KEY (id)
);
CREATE TABLE public.route_options (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  query_id uuid,
  route_index integer NOT NULL,
  route_name character varying,
  route_geometry USER-DEFINED NOT NULL,
  distance_km numeric,
  duration_minutes integer,
  traffic_level integer CHECK (traffic_level >= 1 AND traffic_level <= 5),
  route_type character varying DEFAULT 'fastest'::character varying,
  toll_cost numeric DEFAULT 0,
  fuel_cost numeric DEFAULT 0,
  road_segments ARRAY DEFAULT '{}'::character varying[],
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT route_options_pkey PRIMARY KEY (id),
  CONSTRAINT route_options_query_id_fkey FOREIGN KEY (query_id) REFERENCES public.route_queries(id)
);
CREATE TABLE public.route_queries (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  session_id character varying,
  origin_name character varying,
  origin_coords USER-DEFINED NOT NULL,
  destination_name character varying,
  destination_coords USER-DEFINED NOT NULL,
  departure_time timestamp with time zone,
  query_time timestamp with time zone DEFAULT now(),
  response_time_ms integer,
  routes_returned integer DEFAULT 0,
  selected_route_index integer,
  preferences jsonb DEFAULT '{}'::jsonb,
  ip_address inet,
  user_agent text,
  CONSTRAINT route_queries_pkey PRIMARY KEY (id),
  CONSTRAINT route_queries_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_profiles(id)
);
CREATE TABLE public.spatial_ref_sys (
  srid integer NOT NULL CHECK (srid > 0 AND srid <= 998999),
  auth_name character varying,
  auth_srid integer,
  srtext character varying,
  proj4text character varying,
  CONSTRAINT spatial_ref_sys_pkey PRIMARY KEY (srid)
);
CREATE TABLE public.system_logs (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  level character varying CHECK (level::text = ANY (ARRAY['DEBUG'::character varying, 'INFO'::character varying, 'WARNING'::character varying, 'ERROR'::character varying, 'CRITICAL'::character varying]::text[])),
  message text NOT NULL,
  module character varying,
  function_name character varying,
  user_id uuid,
  request_id character varying,
  extra_data jsonb,
  timestamp timestamp with time zone DEFAULT now(),
  CONSTRAINT system_logs_pkey PRIMARY KEY (id),
  CONSTRAINT system_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user_profiles(id)
);
CREATE TABLE public.traffic_data (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  road_segment_id character varying,
  location USER-DEFINED NOT NULL,
  timestamp timestamp with time zone NOT NULL,
  speed_kmh numeric CHECK (speed_kmh >= 0::numeric AND speed_kmh <= 200::numeric),
  traffic_level integer CHECK (traffic_level >= 1 AND traffic_level <= 5),
  vehicle_count integer DEFAULT 0,
  congestion_factor numeric CHECK (congestion_factor >= 0::numeric AND congestion_factor <= 1::numeric),
  weather_conditions jsonb DEFAULT '{}'::jsonb,
  data_source character varying DEFAULT 'system'::character varying,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT traffic_data_pkey PRIMARY KEY (id),
  CONSTRAINT traffic_data_road_segment_id_fkey FOREIGN KEY (road_segment_id) REFERENCES public.road_segments(id)
);
CREATE TABLE public.traffic_predictions (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  road_segment_id character varying,
  prediction_time timestamp with time zone NOT NULL,
  target_time timestamp with time zone NOT NULL,
  predicted_speed numeric,
  predicted_traffic_level integer CHECK (predicted_traffic_level >= 1 AND predicted_traffic_level <= 5),
  congestion_probability numeric CHECK (congestion_probability >= 0::numeric AND congestion_probability <= 1::numeric),
  confidence_score numeric CHECK (confidence_score >= 0::numeric AND confidence_score <= 1::numeric),
  model_version character varying,
  features_used jsonb,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT traffic_predictions_pkey PRIMARY KEY (id),
  CONSTRAINT traffic_predictions_road_segment_id_fkey FOREIGN KEY (road_segment_id) REFERENCES public.road_segments(id)
);
CREATE TABLE public.user_profiles (
  id uuid NOT NULL,
  email character varying NOT NULL UNIQUE,
  full_name character varying,
  avatar_url text,
  phone character varying,
  date_of_birth date,
  preferences jsonb DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_profiles_pkey PRIMARY KEY (id),
  CONSTRAINT user_profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);