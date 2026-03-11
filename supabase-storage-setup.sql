-- 1. Crear el bucket público
INSERT INTO storage.buckets (id, name, public)
VALUES ('motorcycles', 'motorcycles', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Permitir que cualquier persona pueda VER y descargar las imágenes (Lectura)
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'motorcycles' );

-- 3. Permitir que solo el Administrador (Autenticado) pueda SUBIR imágenes
CREATE POLICY "Admin Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'motorcycles' );

-- 4. Permitir que solo el Administrador pueda ACTUALIZAR imágenes
CREATE POLICY "Admin Update"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'motorcycles' );

-- 5. Permitir que solo el Administrador pueda BORRAR imágenes
CREATE POLICY "Admin Delete"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'motorcycles' );
