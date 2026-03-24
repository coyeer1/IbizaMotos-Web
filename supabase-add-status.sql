-- Agrega la columna `status` a workshop_appointments si no existe.
-- Ejecutar una sola vez desde Supabase > SQL Editor.

ALTER TABLE workshop_appointments
  ADD COLUMN IF NOT EXISTS status TEXT
    NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','confirmed','done','cancelled'));

-- Marca las filas viejas (sin status) como 'pending' (ya lo hace el DEFAULT, pero por si acaso)
UPDATE workshop_appointments SET status = 'pending' WHERE status IS NULL;
