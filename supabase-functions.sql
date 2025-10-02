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
