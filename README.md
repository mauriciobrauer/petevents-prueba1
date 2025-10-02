# 🐾 PetsEvents - Plataforma de Eventos para Mascotas

Una aplicación completa desarrollada con Next.js y Supabase que permite a los usuarios crear y participar en eventos para mascotas.

## ✨ Características

- **Autenticación completa**: Registro e inicio de sesión de usuarios
- **Gestión de mascotas**: Crear, editar y eliminar perfiles de mascotas
- **Eventos**: Crear, editar, eliminar y participar en eventos
- **Sistema de reseñas**: Comentarios y calificaciones para eventos pasados
- **Filtros**: Ver eventos próximos, pasados y propios
- **Responsive**: Diseño adaptable para diferentes dispositivos

## 🚀 Instalación y Configuración

### 1. Prerrequisitos

- Node.js (versión 14 o superior)
- Una cuenta en Supabase
- Git

### 2. Configuración de Supabase

Antes de ejecutar la aplicación, debes configurar las tablas en Supabase:

1. Ve a tu proyecto en [Supabase](https://supabase.com)
2. Abre el editor SQL
3. Ejecuta el siguiente script para crear las tablas:

```sql
-- ==========================
-- TABLA: DUEÑO
-- ==========================
CREATE TABLE public.dueño (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL,
    foto_perfil TEXT,
    correo_electronico TEXT UNIQUE NOT NULL,
    contraseña_hashed TEXT NOT NULL,
    biografia TEXT,
    preferencia_notificaciones BOOLEAN DEFAULT true,
    idioma_preferido TEXT DEFAULT 'es',
    fecha_registro TIMESTAMP DEFAULT now()
);

-- ==========================
-- TABLA: EVENTO
-- ==========================
CREATE TABLE public.evento (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organizador_id UUID REFERENCES public.dueño(id) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    descripcion TEXT,
    tipo_evento TEXT,
    fecha_inicio TIMESTAMP NOT NULL,
    duracion_estimada INTERVAL,
    direccion_completa TEXT,
    link_google_maps TEXT,
    aforo_maximo INTEGER,
    precio NUMERIC(10,2) DEFAULT 0,
    restriccion_tipo TEXT,
    restriccion_tamaño TEXT,
    estado TEXT DEFAULT 'pendiente',
    visibilidad BOOLEAN DEFAULT true,
    foto_portada TEXT,
    galeria_fotos TEXT[],
    fecha_creacion TIMESTAMP DEFAULT now(),
    permite_comentarios BOOLEAN DEFAULT true,
    puntuacion_promedio NUMERIC(3,2) DEFAULT 0,
    numero_mascotas_inscritas INTEGER DEFAULT 0
);

-- ==========================
-- TABLA: MASCOTA
-- ==========================
CREATE TABLE public.mascota (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dueño_id UUID REFERENCES public.dueño(id) ON DELETE CASCADE,
    nombre TEXT NOT NULL,
    tipo TEXT NOT NULL,
    raza TEXT,
    edad INTEGER,
    tamaño TEXT,
    foto_perfil TEXT,
    comportamiento_social TEXT,
    castrado BOOLEAN DEFAULT false,
    vacunaciones_al_dia BOOLEAN DEFAULT false,
    restricciones_dieta TEXT,
    fecha_creacion TIMESTAMP DEFAULT now(),
    url_red_social TEXT
);

-- ==========================
-- TABLAS PUENTE (N:M)
-- ==========================

-- Eventos a los que ha acudido una mascota (histórico)
CREATE TABLE public.mascota_evento (
    mascota_id UUID REFERENCES public.mascota(id) ON DELETE CASCADE,
    evento_id UUID REFERENCES public.evento(id) ON DELETE CASCADE,
    PRIMARY KEY (mascota_id, evento_id)
);

-- Lista de mascotas inscritas a un evento (participación actual)
CREATE TABLE public.evento_mascota (
    evento_id UUID REFERENCES public.evento(id) ON DELETE CASCADE,
    mascota_id UUID REFERENCES public.mascota(id) ON DELETE CASCADE,
    PRIMARY KEY (evento_id, mascota_id)
);
```

4. Ejecuta también las funciones auxiliares del archivo `supabase-functions.sql`:

```sql
-- Función para incrementar el contador de mascotas inscritas en un evento
CREATE OR REPLACE FUNCTION increment_event_pets(event_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE evento 
  SET numero_mascotas_inscritas = numero_mascotas_inscritas + 1
  WHERE id = event_id;
END;
$$ LANGUAGE plpgsql;

-- Función para decrementar el contador de mascotas inscritas en un evento
CREATE OR REPLACE FUNCTION decrement_event_pets(event_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE evento 
  SET numero_mascotas_inscritas = GREATEST(numero_mascotas_inscritas - 1, 0)
  WHERE id = event_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar automáticamente el contador cuando se inserta/elimina en evento_mascota
CREATE OR REPLACE FUNCTION update_event_pets_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE evento 
    SET numero_mascotas_inscritas = numero_mascotas_inscritas + 1
    WHERE id = NEW.evento_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE evento 
    SET numero_mascotas_inscritas = GREATEST(numero_mascotas_inscritas - 1, 0)
    WHERE id = OLD.evento_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Crear el trigger
DROP TRIGGER IF EXISTS evento_mascota_count_trigger ON evento_mascota;
CREATE TRIGGER evento_mascota_count_trigger
  AFTER INSERT OR DELETE ON evento_mascota
  FOR EACH ROW EXECUTE FUNCTION update_event_pets_count();
```

### 3. Instalación del Proyecto

1. Clona o descarga el proyecto
2. Navega al directorio del proyecto:
   ```bash
   cd pets-events
   ```

3. Instala las dependencias:
   ```bash
   npm install
   ```

4. Las variables de entorno ya están configuradas en `.env.local`

### 4. Ejecutar la Aplicación

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## 📱 Uso de la Aplicación

### 1. Registro e Inicio de Sesión
- Visita `/auth/register` para crear una cuenta
- Usa `/auth/login` para iniciar sesión
- Una vez autenticado, tendrás acceso completo a todas las funciones

### 2. Gestión de Mascotas
- Ve a "Mis Mascotas" en la navegación
- Haz clic en "Agregar Mascota" para registrar tu primera mascota
- Puedes editar o eliminar mascotas existentes

### 3. Eventos
- **Ver eventos**: La página principal muestra eventos próximos
- **Crear eventos**: Usa "Crear Evento" en la navegación (requiere autenticación)
- **Participar**: Haz clic en "Unirse" en cualquier evento (requiere tener al menos una mascota registrada)
- **Gestionar**: Ve a "Eventos" > "Mis Eventos" para editar o eliminar tus eventos

### 4. Reseñas
- Después de que un evento haya pasado, puedes dejar reseñas y calificaciones
- Las reseñas son visibles en la página de detalles del evento

## 🏗️ Estructura del Proyecto

```
pets-events/
├── src/
│   ├── components/
│   │   └── Navbar.js          # Componente de navegación
│   ├── contexts/
│   │   └── AuthContext.js     # Contexto de autenticación
│   ├── lib/
│   │   └── supabase.js        # Configuración de Supabase
│   └── pages/
│       ├── auth/
│       │   ├── login.js       # Página de inicio de sesión
│       │   └── register.js    # Página de registro
│       ├── events/
│       │   ├── [id].js        # Detalles del evento
│       │   ├── create.js      # Crear evento
│       │   ├── index.js       # Lista de eventos
│       │   └── edit/[id].js   # Editar evento
│       ├── pets/
│       │   ├── create.js      # Crear mascota
│       │   ├── index.js       # Lista de mascotas
│       │   └── edit/[id].js   # Editar mascota
│       ├── _app.js            # Configuración de la app
│       └── index.js           # Página principal
├── .env.local                 # Variables de entorno
├── supabase-functions.sql     # Funciones SQL para Supabase
└── README.md                  # Este archivo
```

## 🔧 Tecnologías Utilizadas

- **Frontend**: Next.js 14 (JavaScript)
- **Base de datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **Estilos**: CSS inline (sin frameworks)
- **Hosting**: Listo para desplegar en Vercel

## 🚀 Despliegue en Vercel

### Configuración de Variables de Entorno

1. **Para desarrollo local**: 
   - Copia el archivo `env.template` a `.env.local`
   - Completa las variables con los valores de tu proyecto Supabase

2. **Para despliegue en Vercel**:
   - Sube el código a GitHub
   - Conecta tu repositorio con Vercel
   - En la configuración del proyecto en Vercel, agrega las siguientes variables de entorno:
     - `NEXT_PUBLIC_SUPABASE_URL`: Tu URL del proyecto Supabase
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Tu clave anónima de Supabase
   - Despliega

### Obtener las Variables de Supabase

1. Ve a tu proyecto en [Supabase](https://supabase.com)
2. Navega a **Settings** > **API**
3. Copia el **Project URL** para `NEXT_PUBLIC_SUPABASE_URL`
4. Copia la clave **anon public** para `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 📝 Notas Importantes

- **Autenticación**: La aplicación usa Supabase Auth con email/contraseña
- **Perfiles**: Se crean automáticamente perfiles de dueño al registrarse
- **Mascotas**: Debes tener al menos una mascota registrada para unirte a eventos
- **Eventos**: Solo los organizadores pueden editar/eliminar sus propios eventos
- **Reseñas**: Solo se pueden dejar reseñas en eventos pasados

## 🐛 Solución de Problemas

### Error de conexión a Supabase
- Verifica que las variables de entorno estén correctamente configuradas
- Asegúrate de que las tablas estén creadas en Supabase

### No puedo unirme a eventos
- Verifica que tengas al menos una mascota registrada
- Asegúrate de estar autenticado

### Los contadores no se actualizan
- Ejecuta las funciones SQL del archivo `supabase-functions.sql`
- Verifica que los triggers estén activos en Supabase

## 🤝 Contribuciones

Este es un proyecto de demostración. Para mejoras futuras se podrían agregar:
- Subida de imágenes a Supabase Storage
- Notificaciones en tiempo real
- Sistema de mensajería entre usuarios
- Geolocalización para eventos cercanos
- Integración con redes sociales

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.