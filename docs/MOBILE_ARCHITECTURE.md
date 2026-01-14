# Arquitectura Móvil con Mapbox

Esta documentación describe cómo integrar Mapbox en aplicaciones móviles para Android e iOS, utilizando los servicios backend centralizados.

## 📱 SDKs Oficiales de Mapbox

### Android
- **SDK:** Mapbox Maps SDK for Android
- **Documentación:** https://docs.mapbox.com/android/maps/guides/
- **Instalación:** Gradle

### iOS
- **SDK:** Mapbox Maps SDK for iOS
- **Documentación:** https://docs.mapbox.com/ios/maps/guides/
- **Instalación:** CocoaPods o Swift Package Manager

## 🏗️ Arquitectura Recomendada

```
┌─────────────────────────────────────┐
│       Aplicación Móvil              │
│   (Android / iOS)                   │
│                                     │
│  ┌───────────────────────────────┐ │
│  │   Mapbox Maps SDK             │ │
│  │   - Visualización de mapas    │ │
│  │   - Interacción del usuario   │ │
│  │   - Capas de tráfico          │ │
│  └───────────────────────────────┘ │
│                                     │
│  ┌───────────────────────────────┐ │
│  │   Cliente de API Backend      │ │
│  │   - Solicitar rutas           │ │
│  │   - Obtener tráfico           │ │
│  │   - Geocodificación           │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│      Backend (FastAPI)              │
│                                     │
│  ┌───────────────────────────────┐ │
│  │   Mapbox Services             │ │
│  │   - Directions API            │ │
│  │   - Geocoding API             │ │
│  │   - Static Images             │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│      Mapbox APIs                    │
└─────────────────────────────────────┘
```

## 🔑 Configuración de Tokens

### Android (build.gradle)
```gradle
android {
    defaultConfig {
        // Token público de Mapbox
        manifestPlaceholders = [
            mapboxAccessToken: "YOUR_MAPBOX_PUBLIC_TOKEN"
        ]
    }
}
```

### iOS (Info.plist)
```xml
<key>MBXAccessToken</key>
<string>YOUR_MAPBOX_PUBLIC_TOKEN</string>
```

### ⚠️ Importante
- **NO** hardcodear tokens en el código
- Usar tokens públicos con restricciones de URL/Bundle ID
- Los tokens privados solo deben estar en el backend

## 📡 Integración con Backend

### Ejemplo Android (Kotlin)

```kotlin
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.*

// Interfaz del servicio
interface MapboxApiService {
    @GET("api/mapbox/route")
    suspend fun getRoute(
        @Query("start_lon") startLon: Double,
        @Query("start_lat") startLat: Double,
        @Query("end_lon") endLon: Double,
        @Query("end_lat") endLat: Double,
        @Query("alternatives") alternatives: Boolean = true
    ): RouteResponse
    
    @GET("api/mapbox/geocode/forward")
    suspend fun geocodeForward(
        @Query("query") query: String,
        @Query("country") country: String = "EC",
        @Query("limit") limit: Int = 5
    ): GeocodeResponse
    
    @GET("api/traffic/point")
    suspend fun getTrafficStatus(
        @Query("lat") lat: Double,
        @Query("lon") lon: Double
    ): TrafficResponse
}

// Cliente Retrofit
object BackendClient {
    private const val BASE_URL = "https://your-backend-url.com/"
    
    val apiService: MapboxApiService by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(MapboxApiService::class.java)
    }
}

// Uso en Activity/Fragment
class MapActivity : AppCompatActivity() {
    private lateinit var mapboxMap: MapboxMap
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Inicializar mapa
        val mapView = MapView(this)
        mapView.getMapAsync { map ->
            mapboxMap = map
            
            // Configurar estilo con tráfico
            map.setStyle(Style.MAPBOX_STREETS) { style ->
                // Agregar capa de tráfico
                style.addLayer(TrafficPlugin(mapView, mapboxMap).trafficLayer)
                
                // Cargar ruta desde backend
                loadRoute()
            }
        }
    }
    
    private fun loadRoute() {
        lifecycleScope.launch {
            try {
                val route = BackendClient.apiService.getRoute(
                    startLon = -80.72,
                    startLat = -0.95,
                    endLon = -79.88,
                    endLat = -2.19
                )
                
                // Dibujar ruta en el mapa
                drawRouteOnMap(route)
            } catch (e: Exception) {
                Log.e("MapActivity", "Error loading route", e)
            }
        }
    }
    
    private fun drawRouteOnMap(route: RouteResponse) {
        // Implementar lógica de dibujo
        val lineString = LineString.fromPolyline(
            route.routes[0].geometry.coordinates,
            6
        )
        
        mapboxMap.style?.addSource(
            GeoJsonSource("route-source", lineString)
        )
        
        mapboxMap.style?.addLayer(
            LineLayer("route-layer", "route-source").withProperties(
                PropertyFactory.lineColor("#0074D9"),
                PropertyFactory.lineWidth(5f),
                PropertyFactory.lineOpacity(0.8f)
            )
        )
    }
}
```

### Ejemplo iOS (Swift)

```swift
import Mapbox
import Alamofire

// Servicio de API
class BackendService {
    static let shared = BackendService()
    private let baseURL = "https://your-backend-url.com"
    
    func getRoute(
        startLon: Double,
        startLat: Double,
        endLon: Double,
        endLat: Double,
        completion: @escaping (Result<RouteResponse, Error>) -> Void
    ) {
        let params: Parameters = [
            "start_lon": startLon,
            "start_lat": startLat,
            "end_lon": endLon,
            "end_lat": endLat,
            "alternatives": true
        ]
        
        AF.request("\(baseURL)/api/mapbox/route", parameters: params)
            .responseDecodable(of: RouteResponse.self) { response in
                completion(response.result)
            }
    }
    
    func geocodeForward(
        query: String,
        completion: @escaping (Result<GeocodeResponse, Error>) -> Void
    ) {
        let params: Parameters = [
            "query": query,
            "country": "EC",
            "limit": 5
        ]
        
        AF.request("\(baseURL)/api/mapbox/geocode/forward", parameters: params)
            .responseDecodable(of: GeocodeResponse.self) { response in
                completion(response.result)
            }
    }
}

// Uso en ViewController
class MapViewController: UIViewController {
    var mapView: MGLMapView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Inicializar mapa
        mapView = MGLMapView(frame: view.bounds)
        mapView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        mapView.delegate = self
        view.addSubview(mapView)
        
        // Cargar ruta
        loadRoute()
    }
    
    func loadRoute() {
        BackendService.shared.getRoute(
            startLon: -80.72,
            startLat: -0.95,
            endLon: -79.88,
            endLat: -2.19
        ) { [weak self] result in
            switch result {
            case .success(let routeResponse):
                self?.drawRoute(routeResponse)
            case .failure(let error):
                print("Error loading route: \(error)")
            }
        }
    }
    
    func drawRoute(_ response: RouteResponse) {
        guard let route = response.routes.first,
              let coordinates = route.geometry.coordinates else {
            return
        }
        
        // Convertir coordenadas
        let coords = coordinates.map { CLLocationCoordinate2D(latitude: $0[1], longitude: $0[0]) }
        
        // Crear polyline
        let polyline = MGLPolyline(coordinates: coords, count: UInt(coords.count))
        
        // Agregar al mapa
        mapView.addAnnotation(polyline)
        
        // Ajustar vista
        mapView.setVisibleCoordinateBounds(
            MGLCoordinateBounds(sw: coords.first!, ne: coords.last!),
            edgePadding: UIEdgeInsets(top: 50, left: 50, bottom: 50, right: 50),
            animated: true
        )
    }
}

extension MapViewController: MGLMapViewDelegate {
    func mapView(_ mapView: MGLMapView, strokeColorForShapeAnnotation annotation: MGLShape) -> UIColor {
        return .blue
    }
    
    func mapView(_ mapView: MGLMapView, lineWidthForPolylineAnnotation annotation: MGLPolylineAnnotation) -> CGFloat {
        return 5.0
    }
}
```

## 🎨 Características Móviles

### Mapas Interactivos
- **Zoom, Pan, Rotación:** Gestos nativos incluidos
- **Estilos:** Mismo acceso a estilos que en web
- **Marcadores:** Personalizables con vistas nativas

### Tráfico en Tiempo Real
```kotlin
// Android
val trafficPlugin = TrafficPlugin(mapView, mapboxMap)
trafficPlugin.setVisibility(true)
```

```swift
// iOS
mapView.styleURL = MGLStyle.trafficDayStyleURL
```

### Navegación Turn-by-Turn
- **SDK adicional:** Mapbox Navigation SDK
- Navegación guiada paso a paso
- Recalculación automática de rutas

### Offline
- Descargar regiones para uso sin conexión
- Mapas, geocoding y rutas funcionan offline
- Sincronización automática

## 📊 Optimización de Consumo

### Límites del Plan Gratuito
- **Mobile MAU:** 25,000 usuarios activos mensuales
- Contar como "activo" = abrir app y cargar mapa al menos una vez al mes

### Buenas Prácticas
1. **Cache local:** Guardar rutas y datos de tráfico
2. **Batch requests:** Agrupar solicitudes cuando sea posible
3. **Lazy loading:** Cargar datos solo cuando se necesiten
4. **Offline-first:** Priorizar datos locales

## 🔐 Seguridad

### Tokens Públicos
- Usar tokens con restricciones de Bundle ID (iOS) o Package Name (Android)
- Configurar URLs permitidas en Mapbox dashboard

### Datos Sensibles
- **NUNCA** incluir tokens privados en apps móviles
- Todas las operaciones sensibles deben pasar por el backend
- Validar permisos en el backend

## 📚 Recursos

### Documentación Oficial
- Android: https://docs.mapbox.com/android/
- iOS: https://docs.mapbox.com/ios/
- Navigation SDK: https://docs.mapbox.com/android/navigation/
- Unity SDK: https://docs.mapbox.com/unity/

### Ejemplos de Código
- Android: https://github.com/mapbox/mapbox-maps-android
- iOS: https://github.com/mapbox/mapbox-maps-ios
- React Native: https://github.com/rnmapbox/maps

### Stack Overflow
- Tag: [mapbox-android]
- Tag: [mapbox-ios]

## ✅ Checklist de Implementación

### Configuración Inicial
- [ ] Obtener token público de Mapbox
- [ ] Configurar restricciones de token (Bundle ID / Package Name)
- [ ] Agregar SDK a proyecto (Gradle/CocoaPods)
- [ ] Configurar token en app

### Integración con Backend
- [ ] Implementar cliente HTTP (Retrofit/Alamofire)
- [ ] Definir endpoints de API
- [ ] Implementar modelos de datos
- [ ] Manejar errores y reintentos

### Funcionalidades
- [ ] Mostrar mapa interactivo
- [ ] Agregar capa de tráfico
- [ ] Dibujar rutas
- [ ] Implementar geocodificación
- [ ] Agregar marcadores
- [ ] Búsqueda de lugares

### Optimización
- [ ] Implementar cache local
- [ ] Configurar regiones offline
- [ ] Lazy loading de datos
- [ ] Monitoreo de uso de API

### Testing
- [ ] Probar en diferentes dispositivos
- [ ] Verificar uso de datos
- [ ] Probar modo offline
- [ ] Performance testing
