# 🐾 Pet Events - Frontend Interface

Una interfaz moderna y responsive para la plataforma de eventos para mascotas, implementada con React y Tailwind CSS.

## 🎨 Características del Diseño

- **Fidelidad Visual**: Replica exactamente el diseño de Figma proporcionado
- **Responsive**: Optimizado para desktop y mobile
- **Componentes Modulares**: Arquitectura de componentes reutilizables
- **Tailwind CSS**: Estilos utilitarios para desarrollo rápido
- **Tipografía**: Fuente Inter para una apariencia moderna y limpia

## 📁 Estructura de Archivos

```
pet-events-frontend/
├── index.html              # Archivo principal HTML
├── App.jsx                 # Componente principal de la aplicación
├── styles.css              # Estilos CSS adicionales
├── README.md              # Este archivo
└── components/
    ├── Header.jsx          # Navegación y perfil de usuario
    ├── EventTabs.jsx       # Botones de filtro (Próximos/Pasados)
    ├── EventCard.jsx       # Tarjeta individual de evento
    ├── MyEventsSection.jsx # Sección "Mis Eventos"
    └── OtherEventsSection.jsx # Sección "Otros Eventos"
```

## 🚀 Cómo Usar

### Opción 1: Servidor Local Simple
1. Clona o descarga los archivos
2. Abre `index.html` en tu navegador web
3. ¡Listo! La interfaz se cargará automáticamente

### Opción 2: Servidor HTTP Local
```bash
# Con Python 3
python -m http.server 8000

# Con Node.js (si tienes http-server instalado)
npx http-server

# Luego abre http://localhost:8000 en tu navegador
```

## 🎯 Componentes Principales

### Header
- Logo y título "Pet Events"
- Información del usuario (Luis Torres)
- Avatar del usuario
- Navegación (Salir)

### EventTabs
- Botón "Próximos" (activo por defecto)
- Botón "Pasados"
- Cambio de estado visual según selección

### EventCard
- Imagen del evento con overlay
- Badge de estado (Público/Privado/Inscrito)
- Información del evento (fecha, hora, ubicación)
- Mascotas asistentes con avatares
- Sistema de calificaciones

### MyEventsSection
- Título "🐾 Mis Eventos"
- Botón "Crear Evento"
- Grid responsive de eventos del usuario

### OtherEventsSection
- Título "🏠 Otros Eventos"
- Grid responsive de eventos públicos disponibles

## 🎨 Paleta de Colores

- **Primary**: `#8B5CF6` (Morado)
- **Secondary**: `#10B981` (Verde)
- **Accent**: `#F59E0B` (Amarillo)
- **Gray Custom**: `#6B7280`
- **Light Gray**: `#F9FAFB`

## 📱 Responsive Design

- **Desktop**: Grid de 4 columnas para eventos
- **Tablet**: Grid de 2-3 columnas
- **Mobile**: Grid de 1 columna
- **Navegación**: Se adapta automáticamente

## 🔧 Personalización

### Cambiar Colores
Edita la configuración de Tailwind en `index.html`:
```javascript
tailwind.config = {
    theme: {
        extend: {
            colors: {
                'primary': '#TU_COLOR_AQUI',
                // ... más colores
            }
        }
    }
}
```

### Agregar Nuevos Eventos
Modifica el array `myEvents` o `otherEvents` en `App.jsx`:
```javascript
const nuevoEvento = {
    id: 5,
    title: "Nuevo Evento",
    description: "Descripción del evento...",
    // ... más propiedades
};
```

### Modificar Componentes
Cada componente está en su propio archivo `.jsx` para fácil edición y mantenimiento.

## 🌟 Características Técnicas

- **React 18**: Última versión estable
- **Tailwind CSS**: Framework de utilidades CSS
- **Babel**: Transpilación de JSX en el navegador
- **Responsive Grid**: CSS Grid para layouts adaptativos
- **Hover Effects**: Animaciones suaves en interacciones
- **Semantic HTML**: Estructura accesible y semántica

## 📝 Notas de Desarrollo

- Los componentes usan `window.ComponentName` para exposición global
- Las imágenes usan Unsplash para demos (reemplazar con URLs reales)
- Los datos son estáticos (integrar con API real según necesidad)
- Optimizado para desarrollo rápido sin build tools

## 🎯 Próximos Pasos

1. **Integración con Backend**: Conectar con API real
2. **Estado Global**: Implementar Context API o Redux
3. **Routing**: Agregar React Router para navegación
4. **Testing**: Implementar tests unitarios
5. **Build Process**: Configurar Webpack/Vite para producción

---

**Desarrollado con ❤️ para la comunidad de mascotas**
