-- ===================================
-- DATOS DE EJEMPLO PARA PETSEVENTS
-- ===================================
-- Ejecuta este script en Supabase para agregar datos de prueba

-- Insertar dueños de ejemplo
INSERT INTO public.dueño (id, nombre, correo_electronico, contraseña_hashed, biografia) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'María García', 'maria@example.com', '$2b$10$example_hash_1', 'Amante de los perros, organizadora de eventos caninos'),
('550e8400-e29b-41d4-a716-446655440002', 'Carlos López', 'carlos@example.com', '$2b$10$example_hash_2', 'Veterinario y dueño de 3 gatos'),
('550e8400-e29b-41d4-a716-446655440003', 'Ana Martínez', 'ana@example.com', '$2b$10$example_hash_3', 'Entrenadora profesional de mascotas');

-- Insertar mascotas de ejemplo
INSERT INTO public.mascota (id, dueño_id, nombre, tipo, raza, edad, tamaño, foto_perfil, comportamiento_social, castrado, vacunaciones_al_dia) VALUES
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Max', 'perro', 'Golden Retriever', 3, 'grande', 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400', 'Muy sociable y amigable', true, true),
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Luna', 'perro', 'Border Collie', 2, 'mediano', 'https://images.unsplash.com/photo-1551717743-49959800b1f6?w=400', 'Energética, le encanta jugar', true, true),
('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'Michi', 'gato', 'Persa', 4, 'pequeño', 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400', 'Tranquilo y cariñoso', true, true),
('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440003', 'Rocky', 'perro', 'Pastor Alemán', 5, 'grande', 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=400', 'Protector pero sociable', true, true);

-- Insertar eventos de ejemplo
INSERT INTO public.evento (id, organizador_id, titulo, descripcion, tipo_evento, fecha_inicio, duracion_estimada, direccion_completa, link_google_maps, aforo_maximo, precio, restriccion_tipo, foto_portada, permite_comentarios, visibilidad, numero_mascotas_inscritas) VALUES
('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Paseo Grupal en el Parque Central', 'Un paseo relajante por el parque central de la ciudad. Perfecto para socializar a nuestras mascotas y conocer otros dueños.', 'paseo', '2024-12-15 10:00:00', '2 hours', 'Parque Central, Av. Principal 123, Ciudad', 'https://maps.google.com/?q=Parque+Central', 20, 0, 'perro', 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600', true, true, 5),
('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'Consulta Veterinaria Gratuita', 'Consultas veterinarias gratuitas para mascotas. Incluye revisión general y vacunación básica.', 'veterinario', '2024-12-20 14:00:00', '4 hours', 'Clínica Veterinaria San José, Calle 45 #67-89', 'https://maps.google.com/?q=Clinica+Veterinaria+San+Jose', 15, 0, null, 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=600', true, true, 8),
('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'Entrenamiento Básico para Cachorros', 'Sesión de entrenamiento básico para cachorros de 2-6 meses. Aprende comandos básicos y socialización.', 'entrenamiento', '2024-12-18 16:00:00', '1.5 hours', 'Centro de Entrenamiento Canino, Zona Norte', 'https://maps.google.com/?q=Centro+Entrenamiento+Canino', 10, 25.00, 'perro', 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600', true, true, 3),
('770e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', 'Competencia de Agilidad Canina', 'Competencia amistosa de agilidad para perros de todos los tamaños. ¡Premios para los ganadores!', 'competencia', '2024-12-22 09:00:00', '3 hours', 'Polideportivo Municipal, Sector Sur', 'https://maps.google.com/?q=Polideportivo+Municipal', 25, 15.00, 'perro', 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600', true, true, 12),
('770e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002', 'Evento de Adopción - Encuentra tu Compañero', 'Evento especial de adopción con mascotas rescatadas buscando hogar. Incluye asesoría y seguimiento.', 'adopción', '2024-11-25 10:00:00', '6 hours', 'Plaza de Armas, Centro Histórico', 'https://maps.google.com/?q=Plaza+de+Armas', 50, 0, null, 'https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?w=600', true, true, 25);

-- Insertar algunas inscripciones de ejemplo
INSERT INTO public.evento_mascota (evento_id, mascota_id) VALUES
('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001'),
('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440002'),
('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440003'),
('770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440004'),
('770e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440001');

-- Nota: Las contraseñas hasheadas son de ejemplo. En una aplicación real, 
-- los usuarios se registrarían a través de Supabase Auth y los perfiles 
-- se crearían automáticamente.
