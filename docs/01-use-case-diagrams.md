# 📐 Diagramas UML — Sistema de Turismo Sucre

## Diagrama de Casos de Uso General

```mermaid
graph TB
    subgraph Actores
        T((👤 Turista))
        A((🔑 Administrador))
        IA((🤖 Asistente IA))
    end

    subgraph "Sistema de Turismo Sucre"
        UC1[UC-01: Explorar Mapa]
        UC2[UC-02: Buscar Lugares]
        UC3[UC-03: Ver Detalle de Lugar]
        UC4[UC-04: Generar Ruta con IA]
        UC5[UC-05: Chatear con Asistente]
        UC6[UC-06: Guardar Favoritos]
        UC7[UC-07: Dejar Reseña]
        UC8[UC-08: Ver Historial de Rutas]
        UC9[UC-09: Administrar Lugares]
        UC10[UC-10: Administrar Usuarios]
        UC11[UC-11: Gestionar Categorías]
        UC12[UC-12: Ver Estadísticas]
    end

    %% Relaciones Turista
    T --> UC1
    T --> UC2
    T --> UC3
    T --> UC4
    T --> UC5
    T --> UC6
    T --> UC7
    T --> UC8

    %% Relaciones Admin
    A --> UC1
    A --> UC2
    A --> UC3
    A --> UC9
    A --> UC10
    A --> UC11
    A --> UC12

    %% Relaciones IA
    IA --> UC4
    IA --> UC5

    %% Include/Extend
    UC4 ..>|"<<include>>"| UC5
    UC4 ..>|"<<include>>"| UC1
    UC3 ..>|"<<extend>>"| UC6
    UC3 ..>|"<<extend>>"| UC7
```

---

## Diagrama de Casos de Uso — Turista

```mermaid
graph LR
    subgraph "👤 Turista"
        direction TB
        UC01["UC-01: Explorar Mapa"]
        UC02["UC-02: Buscar Lugares"]
        UC03["UC-03: Ver Detalle de Lugar"]
        UC04["UC-04: Generar Ruta con IA"]
        UC05["UC-05: Chatear con Asistente"]
        UC06["UC-06: Guardar Favoritos"]
        UC07["UC-07: Dejar Reseña"]
        UC08["UC-08: Ver Historial de Rutas"]
    end

    subgraph "Flujos"
        F1["F1: Filtrar por Categoría"]
        F2["F2: Mi Ubicación"]
        F3["F3: Selección Rápida"]
        F4["F4: Personalizar Ruta"]
    end

    UC01 --> F1
    UC01 --> F2
    UC04 --> F3
    UC04 --> F4
    UC05 --> UC04
```

### Descripciones de Casos de Uso — Turista

| ID | Caso de Uso | Descripción | Precondición | Postcondición |
|----|------------|-------------|--------------|---------------|
| UC-01 | Explorar Mapa | El turista visualiza los lugares turísticos en un mapa interactivo de Sucre | Tiene acceso a la aplicación | Mapa cargado con marcadores |
| UC-02 | Buscar Lugares | El turista busca lugares por nombre o categoría | Está en la aplicación | Lista de lugares filtrados |
| UC-03 | Ver Detalle de Lugar | El turista ve información completa de un lugar (fotos, horarios, reseñas) | Ha seleccionado un lugar | Detalle del lugar mostrado |
| UC-04 | Generar Ruta con IA | La IA genera una ruta personalizada según tiempo, presupuesto y gustos | Turista autenticado | Ruta generada y mostrada en mapa |
| UC-05 | Chatear con Asistente | El turista interactúa con el chatbot para obtener recomendaciones | Turista autenticado | Respuestas personalizadas |
| UC-06 | Guardar Favoritos | El turista guarda un lugar en sus favoritos | Turista autenticado | Lugar guardado |
| UC-07 | Dejar Reseña | El turista califica y comenta un lugar visitado | Turista autenticado + visitó el lugar | Reseña publicada |
| UC-08 | Ver Historial de Rutas | El turista ve sus rutas generadas anteriormente | Turista autenticado | Lista de rutas |

---

## Diagrama de Casos de Uso — Administrador

```mermaid
graph LR
    subgraph "🔑 Administrador"
        direction TB
        UC09["UC-09: Administrar Lugares"]
        UC10["UC-10: Administrar Usuarios"]
        UC11["UC-11: Gestionar Categorías"]
        UC12["UC-12: Ver Estadísticas"]
    end

    subgraph "Operaciones CRUD"
        C["Crear"]
        R["Leer"]
        U["Actualizar"]
        D["Eliminar"]
    end

    UC09 --> C
    UC09 --> R
    UC09 --> U
    UC09 --> D
    UC10 --> R
    UC10 --> U
    UC11 --> C
    UC11 --> U
    UC11 --> D
```

### Descripciones de Casos de Uso — Administrador

| ID | Caso de Uso | Descripción | Precondición | Postcondición |
|----|------------|-------------|--------------|---------------|
| UC-09 | Administrar Lugares | CRUD completo de lugares turísticos (crear, editar, activar/desactivar) | Admin autenticado | Lugares actualizados |
| UC-10 | Administrar Usuarios | Ver usuarios, cambiar roles (tourist ↔ admin) | Admin autenticado | Roles actualizados |
| UC-11 | Gestionar Categorías | Crear, editar y eliminar categorías de lugares | Admin autenticado | Categorías actualizadas |
| UC-12 | Ver Estadísticas | Dashboard con métricas: lugares más visitados, rutas generadas, reseñas | Admin autenticado | Estadísticas mostradas |

---

## Diagrama de Clases

```mermaid
classDiagram
    class User {
        +UUID id
        +String full_name
        +String avatar_url
        +UserRole role
        +String preferred_language
        +BudgetLevel budget_level
        +DateTime created_at
    }

    class Place {
        +UUID id
        +String name
        +String description
        +UUID category_id
        +Decimal latitude
        +Decimal longitude
        +String address
        +Decimal avg_cost
        +Int avg_visit_time
        +JSONB opening_hours
        +Boolean is_free
        +Difficulty difficulty_access
        +Decimal rating_avg
        +Boolean is_active
    }

    class PlaceCategory {
        +UUID id
        +String name
        +String icon
        +String color
    }

    class PlaceImage {
        +UUID id
        +UUID place_id
        +String image_url
        +String alt_text
        +Int display_order
    }

    class Route {
        +UUID id
        +UUID user_id
        +String title
        +String description
        +Int total_duration
        +Decimal total_cost
        +Decimal total_distance
        +Difficulty difficulty
        +Boolean is_dynamic
        +JSONB context_snapshot
    }

    class RouteStop {
        +UUID id
        +UUID route_id
        +UUID place_id
        +Int stop_order
        +DateTime arrival_time
        +Int stay_duration
        +String notes
    }

    class Review {
        +UUID id
        +UUID user_id
        +UUID place_id
        +Int rating
        +String comment
        +Date visit_date
    }

    class Favorite {
        +UUID user_id
        +UUID place_id
        +DateTime created_at
    }

    class AIConversation {
        +UUID id
        +UUID user_id
        +JSONB messages
        +UUID route_generated
    }

    User "1" --> "*" Route : genera
    User "1" --> "*" Review : escribe
    User "1" --> "*" Favorite : tiene
    User "1" --> "*" AIConversation : inicia

    PlaceCategory "1" --> "*" Place : agrupa
    Place "1" --> "*" PlaceImage : tiene
    Place "1" --> "*" Review : recibe
    Place "1" --> "*" Favorite : es guardado
    Place "1" --> "*" RouteStop : aparece en

    Route "1" --> "*" RouteStop : contiene
    Route "1" --> "*" RouteFeedback : recibe
    AIConversation "*" --> "0..1" Route : genera
```
