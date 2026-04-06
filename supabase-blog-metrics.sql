CREATE TABLE IF NOT EXISTS blog_metrics (
  post_id INTEGER PRIMARY KEY,
  views_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0
);

-- Activar RLS
ALTER TABLE blog_metrics ENABLE ROW LEVEL SECURITY;

-- Permitir que todos lean
CREATE POLICY "Anyone can read blog metrics"
  ON blog_metrics FOR SELECT
  USING (true);

-- Permitir inserciones 
CREATE POLICY "Anyone can insert blog metrics"
  ON blog_metrics FOR INSERT
  WITH CHECK (true);

-- Permitir actualizaciones
CREATE POLICY "Anyone can update blog metrics"
  ON blog_metrics FOR UPDATE
  USING (true);

-- Función segura para incrementar vistas
CREATE OR REPLACE FUNCTION increment_blog_view(metric_post_id INTEGER)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO blog_metrics (post_id, views_count, likes_count)
  VALUES (metric_post_id, 1, 0)
  ON CONFLICT (post_id)
  DO UPDATE SET views_count = blog_metrics.views_count + 1;
END;
$$;

-- Función segura para incrementar likes
CREATE OR REPLACE FUNCTION increment_blog_like(metric_post_id INTEGER)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO blog_metrics (post_id, views_count, likes_count)
  VALUES (metric_post_id, 0, 1)
  ON CONFLICT (post_id)
  DO UPDATE SET likes_count = blog_metrics.likes_count + 1;
END;
$$;
