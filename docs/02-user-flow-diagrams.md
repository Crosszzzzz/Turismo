# 🔄 Diagramas de Flujo — Sistema de Turismo Sucre

## Flujo Principal: Generación de Ruta con IA

```mermaid
flowchart TD
    Start([Inicio]) --> A[Usuario abre la app]
    A --> B{¿Está autenticado?}
    
    B -->|No| C[Mostrar pantalla de login]
    C --> D[Usuario se registra/inicia sesión]
    D --> E[Guardar perfil en BD]
    E --> F
    B -->|Sí| F[Mostrar mapa con lugares]
    
    F --> G[Usuario toca 💬 Asistente IA]
    G --> H[ Abrir panel de chat]
    H --> I[Mostrar saludo + acciones rápidas]
    
    I --> J[Usuario describe sus preferencias]
    J --> K[Enviar mensaje a /api/ai/chat]
    K --> L{¿La IA necesita más info?}
    
    L -->|Sí| M[IA pregunta: tiempo, presupuesto, gustos]
    M --> N[Usuario responde]
    N --> K
    
    L -->|No| O[IA genera ruta en JSON]
    O --> P[Mostrar preview de ruta en chat]
    P --> Q[Usuario toca "Ver en mapa"]
    
    Q --> R[Dibujar polyline en mapa]
    R --> S[Mostrar stops numerados]
    S --> T[Usuario sigue la ruta]
    T --> U{¿Completó la ruta?}
    
    U -->|Sí| V[Mostrar pantalla de finalización]
    V --> W{¿Quiere dejar reseña?}
    W -->|Sí| X[Formulario de reseña]
    X --> Y[Guardar reseña en BD]
    Y --> Z[Mostrar agradecimiento]
    W -->|No| Z
    U -->|No| T
    
    Z --> End([Fin])
```

---

## Flujo de Autenticación

```mermaid
flowchart TD
    Start([Inicio]) --> A[Usuario abre la app]
    A --> B{¿Tiene sesión activa?}
    
    B -->|Sí| C[Verificar token JWT]
    C --> D{¿Token válido?}
    D -->|Sí| E[Mostrar Home con mapa]
    D -->|No| F[Redirigir a login]
    
    B -->|No| F
    F --> G[Mostrar pantalla de login]
    
    G --> H{¿Qué quiere hacer?}
    
    H -->|Iniciar sesión| I[Email + contraseña]
    I --> J[Supabase auth.signInWithPassword]
    J --> K{¿Exitoso?}
    K -->|Sí| L[Guardar JWT en cookie]
    L --> E
    K -->|No| M[Mostrar error]
    M --> G
    
    H -->|Registrarse| N[Formulario: nombre, email, contraseña]
    N --> O[Supabase auth.signUp]
    O --> P{¿Exitoso?}
    P -->|Sí| Q[Enviar email de confirmación]
    Q --> R[Mostrar mensaje: "Revisá tu email"]
    R --> S[Usuario confirma email]
    S --> T[Auto-login]
    T --> E
    P -->|No| U[Mostrar error]
    U --> N
    
    H -->|Continuar sin cuenta| V[Modo anónimo]
    V --> W[Límite: explorar mapa, sin favoritos/rutas]
    W --> E
```

---

## Flujo de Búsqueda de Lugares

```mermaid
flowchart TD
    Start([Inicio]) --> A[Usuario en Home]
    A --> B[Toca barra de búsqueda]
    B --> C[Mostrar campo de búsqueda + filtros]
    
    C --> D{¿Qué hace el usuario?}
    
    D -->|Escribe texto| E[Buscar por nombre]
    E --> F[GET /api/places?search=query]
    F --> G[Mostrar resultados]
    
    D -->|Selecciona categoría| H[Filtrar por categoría]
    H --> I[GET /api/places?category=id]
    I --> G
    
    D -->|Usa ubicación| J[Geolocalizar]
    J --> K[Calcular lugares cercanos]
    K --> G
    
    G --> L{¿Hay resultados?}
    L -->|Sí| M[Mostrar tarjetas de lugares]
    M --> N[Usuario selecciona un lugar]
    N --> O[GET /api/places/id]
    O --> P[Mostrar detalle del lugar]
    
    L -->|No| Q[Mostrar: "No se encontraron lugares"]
    Q --> C
    
    P --> R{¿Qué quiere hacer?}
    R -->|Ver en mapa| S[Centrar mapa en el lugar]
    R -->|Guardar| T[POST /api/favorites]
    R -->|Reseñar| U[Formulario de reseña]
    R -->|Generar ruta| V[Ir a asistente IA]
```

---

## Flujo de CRUD de Lugares (Admin)

```mermaid
flowchart TD
    Start([Inicio]) --> A[Admin en Dashboard]
    A --> B[Seleccionar "Gestionar Lugares"]
    
    B --> C[Mostrar lista de lugares]
    
    C --> D{¿Qué operación?}
    
    D -->|Crear| E[Formulario nuevo lugar]
    E --> F[Completar: nombre, categoría, coords, etc.]
    F --> G[Subir imagen]
    G --> H[POST /api/places]
    H --> I{¿Exitoso?}
    I -->|Sí| J[Agregar a mapa]
    I -->|No| K[Mostrar error]
    K --> E
    
    D -->|Editar| L[Seleccionar lugar]
    L --> M[Formulario con datos actuales]
    M --> N[Modificar campos]
    N --> O[PUT /api/places/id]
    O --> P{¿Exitoso?}
    P -->|Sí| Q[Actualizar en BD]
    P -->|No| R[Mostrar error]
    R --> N
    
    D -->|Eliminar| S[Confirmar eliminación]
    S --> T[DELETE /api/places/id]
    T --> U{¿Exitoso?}
    U -->|Sí| V[Remover del mapa]
    U -->|No| W[Mostrar error]
    
    D -->|Activar/Desactivar| X[Toggle is_active]
    X --> Y[PATCH /api/places/id]
    
    J --> C
    Q --> C
    V --> C
    Y --> C
```

---

## Flujo de Reseñas

```mermaid
flowchart TD
    Start([Inicio]) --> A[Usuario en detalle de lugar]
    A --> B[Toca "Dejar Reseña"]
    
    B --> C{¿Está autenticado?}
    C -->|No| D[Prompt de login]
    C -->|Sí| E[Mostrar formulario]
    
    E --> F[Seleccionar estrellas 1-5]
    F --> G[Escribir comentario]
    G --> H[Seleccionar fecha de visita]
    
    H --> I[POST /api/reviews]
    I --> J{¿Exitoso?}
    
    J -->|Sí| K[Mostrar reseña en la lista]
    K --> L[Actualizar rating_avg del lugar]
    L --> M[Trigger: update_place_rating]
    M --> End([Fin])
    
    J -->|No| N[Mostrar error]
    N --> E
```

---

## Flujo de Rutas Guardadas

```mermaid
flowchart TD
    Start([Inicio]) --> A[Usuario en "Mis Rutas"]
    A --> B[GET /api/routes/history]
    B --> C[Mostrar lista de rutas]
    
    C --> D{¿Qué quiere hacer?}
    
    D -->|Ver ruta| E[Seleccionar ruta]
    E --> F[GET /api/routes/id]
    F --> G[Mostrar detalle + mapa]
    G --> H[Polyline con stops]
    
    D -->|Regenerar| I[Enviar contexto a IA]
    I --> J[IA genera nueva ruta]
    J --> K[Comparar con anterior]
    K --> L{¿Diferente?}
    L -->|Sí| M[Mostrar nueva ruta]
    L -->|No| N[Sugerir ajustes]
    
    D -->|Compartir| O[Generar link de compartir]
    O --> P[Compartir via WhatsApp/Email]
    
    D -->|Eliminar| Q[Confirmar]
    Q --> R[DELETE /api/routes/id]
    
    H --> S{¿Quiere seguirla?}
    S -->|Sí| T[Modo navegación]
    S -->|No| C
```
