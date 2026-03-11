-- Este script crea un usuario 'oficial' en tu base de datos Supabase
-- para que el Panel de Administración tenga los permisos (RLS) correctos para subir imágenes y guardar bases de datos.

DO $$
DECLARE
  new_user_id uuid := gen_random_uuid();
BEGIN
  -- 1. Crear el usuario en la tabla de Autenticación de Supabase
  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password, email_confirmed_at, 
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
    role, confirmation_token, email_change, email_change_token_new, recovery_token
  )
  VALUES (
    new_user_id,
    '00000000-0000-0000-0000-000000000000',
    'admin@ibizamotos.com',
    crypt('ibiza2024', gen_salt('bf')), -- La clave definida
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"name": "Admin Ibiza"}',
    now(),
    now(),
    'authenticated',
    '', '', '', ''
  )
  ON CONFLICT (email) DO NOTHING;

  -- 2. Crear la identidad (necesario para que Supabase lo reconozca internamente)
  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  )
  VALUES (
    gen_random_uuid(),
    (SELECT id FROM auth.users WHERE email = 'admin@ibizamotos.com' LIMIT 1),
    format('{"sub":"%s","email":"%s"}', (SELECT id FROM auth.users WHERE email = 'admin@ibizamotos.com' LIMIT 1)::text, 'admin@ibizamotos.com')::jsonb,
    'email',
    (SELECT id FROM auth.users WHERE email = 'admin@ibizamotos.com' LIMIT 1)::text,
    now(),
    now(),
    now()
  )
  ON CONFLICT DO NOTHING;
END $$;
