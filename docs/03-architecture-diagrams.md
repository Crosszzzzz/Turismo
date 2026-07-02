# 🏗️ Arquitectura del Sistema — Sucre Turismo

## Diagrama de Arquitectura de Alto Nivel

```mermaid
graph TB
    subgraph "Frontend (PWA)"
        UI[React 19 + Next.js 16]
        MAP[Leaflet + OpenStreetMap]
        CHAT[Chat UI Component]
        STORE[React State + Hooks]
    end

    subgraph "Backend (Next.js API Routes)"
        API[API Layer]
        AUTH[Supabase Auth]
        AI[ Gemini AI Engine]
        GEO[Geolocation Service]
    end

    subgraph "Data Layer"
        DB[(Supabase PostgreSQL)]
        STORAGE[Supabase Storage]
        CACHE[Browser Cache]
    end

    subgraph "External Services"
        GEMINI[Gemini API]
        OSM[OpenStreetMap Tiles]
        GEOCODER[Nominatim Geocoder]
    end

    %% Frontend connections
    UI --> API
    UI --> MAP
    UI --> CHAT
    UI --> STORE

    %% Backend connections
    API --> AUTH
    API --> AI
    API --> GEO
    API --> DB
    API --> STORAGE

    %% External connections
    AI --> GEMINI
    MAP --> OSM
    GEO --> GEOCODER
    AUTH --> DB

    %% Data flow
    DB -.->|Realtime| UI
    CACHE -.->|Offline| UI
```

---

## Diagrama de Componentes

```mermaid
graph TB
    subgraph "Presentation Layer"
        direction LR
        HOME[Home Page]
        MAP_VIEW[Map View]
        PLACE_DETAIL[Place Detail]
        CHAT_PANEL[Chat Panel]
        ROUTE_VIEW[Route View]
        FAVORITES[Favorites]
        PROFILE[Profile]
        ADMIN_DASH[Admin Dashboard]
    end

    subgraph "Business Logic Layer"
        direction LR
        ROUTE_GEN[Route Generator]
        GEO_OPT[Geographic Optimizer]
        AI_CHAT[AI Chat Handler]
        SEARCH[Search Engine]
        FILTER[Filter Service]
    end

    subgraph "Data Access Layer"
        direction LR
        SUPA_CLIENT[Supabase Client]
        SUPA_SERVER[Supabase Server]
        API_ROUTES[API Routes]
    end

    subgraph "External Services Layer"
        direction LR
        GEMINI_SDK[Gemini SDK]
        LEAFLET_MAP[Leaflet Map]
        TILE_SERVER[Tile Server]
    end

    %% Connections
    HOME --> MAP_VIEW
    HOME --> CHAT_PANEL
    MAP_VIEW --> PLACE_DETAIL
    CHAT_PANEL --> ROUTE_VIEW
    PLACE_DETAIL --> FAVORITES

    MAP_VIEW --> GEO_OPT
    CHAT_PANEL --> AI_CHAT
    SEARCH --> FILTER
    ROUTE_VIEW --> ROUTE_GEN

    ROUTE_GEN --> SUPA_SERVER
    AI_CHAT --> GEMINI_SDK
    GEO_OPT --> LEAFLET_MAP
    LEAFLET_MAP --> TILE_SERVER

    API_ROUTES --> SUPA_CLIENT
    API_ROUTES --> SUPA_SERVER
```

---

## Diagrama de Despliegue

```mermaid
graph TB
    subgraph "Client (Browser/Mobile)"
        PWA[PWA App]
        IDB[(IndexedDB Cache)]
        SW[Service Worker]
    end

    subgraph "Vercel Edge Network"
        EDGE[Edge Functions]
        ISR[ISR Pages]
        SERVERLESS[Serverless Functions]
    end

    subgraph "Supabase Cloud"
        AUTH_SVC[Auth Service]
        PG[(PostgreSQL)]
        STORAGE_SVC[Storage]
        REALTIME[Realtime]
    end

    subgraph "Google Cloud"
        GEMINI_SVC[Gemini API]
    end

    subgraph "OpenStreetMap"
        TILE_SVC[Tile Server]
        NOMINATIM[Nominatim]
    end

    PWA --> EDGE
    SW --> IDB
    EDGE --> ISR
    EDGE --> SERVERLESS

    SERVERLESS --> AUTH_SVC
    SERVERLESS --> PG
    SERVERLESS --> STORAGE_SVC
    SERVERLESS --> GEMINI_SVC

    AUTH_SVC --> PG
    REALTIME --> PWA

    PWA --> TILE_SVC
    PWA --> NOMINATIM
```

---

## Diagrama de Secuencia: Generación de Ruta

```mermaid
sequenceDiagram
    actor T as 👤 Turista
    participant UI as Frontend
    participant API as API Route
    participant AI as Gemini AI
    participant DB as Supabase DB

    T->>UI: Abre chat y describe preferencias
    UI->>API: POST /api/ai/chat {messages}
    
    API->>DB: SELECT places (lugares activos)
    DB-->>API: places[] con coordenadas
    
    API->>AI: chatWithAI(messages, placesContext)
    Note over AI: System prompt +<br/>places data +<br/>conversation history
    
    AI-->>API: Respuesta con JSON de ruta
    
    API->>API: Parse JSON route
    
    alt Ruta generada
        API-->>UI: {reply, route}
        UI->>UI: Mostrar preview de ruta
        UI->>T: "¿Ver en mapa?"
        
        T->>UI: Toca "Ver en mapa"
        UI->>UI: Dibujar polyline + markers
        UI->>T: Ruta mostrada en mapa
    else Solo respuesta
        API-->>UI: {reply, route: null}
        UI->>T: Mostrar respuesta del asistente
    end
```

---

## Diagrama de Secuencia: Autenticación

```mermaid
sequenceDiagram
    actor T as 👤 Turista
    participant UI as Frontend
    participant AUTH as Supabase Auth
    participant DB as PostgreSQL

    T->>UI: Ingresa email + contraseña
    UI->>AUTH: signInWithPassword(email, password)
    
    AUTH->>DB: SELECT user WHERE email = ?
    
    alt Credenciales válidas
        DB-->>AUTH: user record
        AUTH-->>UI: JWT token + session
        UI->>UI: Guardar JWT en cookie
        UI->>DB: SELECT profiles WHERE id = user.id
        DB-->>UI: profile (role, name, etc.)
        UI->>UI: Actualizar estado global
        UI->>T: Redirigir a Home
    else Credenciales inválidas
        AUTH-->>UI: Error: invalid credentials
        UI->>T: Mostrar error
    end
```

---

## Diagrama de Secuencia: Reseñas

```mermaid
sequenceDiagram
    actor T as 👤 Turista
    participant UI as Frontend
    participant API as API Route
    participant DB as PostgreSQL

    T->>UI: Selecciona lugar
    UI->>API: GET /api/places/:id
    API->>DB: SELECT place + images
    DB-->>API: place data
    API-->>UI: Detalle del lugar

    T->>UI: Toca "Dejar Reseña"
    UI->>T: Formulario reseña

    T->>UI: Califica 4★ + comentario
    UI->>API: POST /api/reviews {user_id, place_id, rating, comment}
    
    API->>DB: INSERT INTO reviews
    DB-->>API: review created
    
    API->>DB: Trigger: update_place_rating()
    Note over DB: AVG(rating) recalculado
    
    API-->>UI: Review guardada
    UI->>T: Reseña publicada

    UI->>API: GET /api/places/:id (refrescar)
    API->>DB: SELECT rating_avg
    DB-->>API: nuevo rating_avg
    API-->>UI: Rating actualizado
```
