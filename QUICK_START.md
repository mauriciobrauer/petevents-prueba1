# 🚀 Inicio Rápido - PetsEvents

## ⚡ Configuración en 5 minutos

### 1. Configurar Supabase (2 minutos)
1. Ve a tu proyecto Supabase: https://wgdwzbkcdhxfcrmzhshc.supabase.co
2. Abre el **Editor SQL**
3. Copia y pega el contenido completo del archivo de este proyecto que se llama `README.md` (sección de configuración de Supabase)
4. Haz clic en **Run** para crear las tablas
5. Ejecuta también el contenido del archivo `supabase-functions.sql`

### 2. Ejecutar la aplicación (1 minuto)
```bash
cd pets-events
npm install
npm run dev
```

### 3. Probar la aplicación (2 minutos)
1. Abre http://localhost:3000
2. Haz clic en **"Registrarse"**
3. Crea una cuenta con cualquier email y contraseña
4. Ve a **"Mis Mascotas"** → **"Agregar Mascota"**
5. Registra tu primera mascota
6. Explora los eventos en la página principal

## 🎯 Funcionalidades Principales

### ✅ Lo que ya funciona:
- ✅ Registro e inicio de sesión
- ✅ Crear, editar y eliminar mascotas
- ✅ Crear, editar y eliminar eventos
- ✅ Unirse a eventos
- ✅ Ver eventos próximos y pasados
- ✅ Sistema de reseñas básico
- ✅ Filtros de eventos
- ✅ Navegación completa

### 🔧 Configuración incluida:
- ✅ Supabase configurado
- ✅ Variables de entorno listas
- ✅ Base de datos estructurada
- ✅ Autenticación funcionando
- ✅ Triggers automáticos

## 📊 Datos de Prueba (Opcional)

Si quieres datos de ejemplo para probar:
1. Ejecuta el contenido del archivo `sample-data.sql` en Supabase
2. Esto agregará eventos y mascotas de ejemplo

## 🐛 ¿Problemas?

### Error de conexión:
- Verifica que las tablas estén creadas en Supabase
- Revisa que las variables de entorno sean correctas

### No puedo unirme a eventos:
- Asegúrate de tener al menos una mascota registrada
- Verifica que estés autenticado

### Los contadores no funcionan:
- Ejecuta el archivo `supabase-functions.sql` en Supabase

## 🎉 ¡Listo!

Tu aplicación PetsEvents está funcionando. Puedes:
- Crear tu perfil y mascotas
- Explorar eventos existentes
- Crear tus propios eventos
- Invitar a otros usuarios

---

**Credenciales de Supabase ya configuradas:**
- URL: https://wgdwzbkcdhxfcrmzhshc.supabase.co
- API Key: Configurada en .env.local
