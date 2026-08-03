import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface BlogMetrics {
  post_id: number;
  views_count: number;
  likes_count: number;
}

interface UseBlogMetricsOptions {
  /**
   * `false` no consulta nada. Lo usa la sección Blog del home, que solo activa
   * las métricas cuando el visitante se asoma al blog — así una visita normal
   * no gasta ni una ida a la base de datos.
   */
  enabled?: boolean;
}

export function useBlogMetrics({ enabled = true }: UseBlogMetricsOptions = {}) {
  const [metrics, setMetrics] = useState<Record<number, BlogMetrics>>({});
  const [loading, setLoading] = useState(true);

  const fetchMetrics = useCallback(async () => {
    try {
      // Timeout: si Supabase está pausado/lento (plan Free se pausa solo), esta
      // llamada NO debe dejar el home colgado. A los 3s seguimos sin métricas.
      const result = await Promise.race([
        supabase.from('blog_metrics').select('*'),
        new Promise<{ data: null; error: unknown }>((resolve) =>
          setTimeout(() => resolve({ data: null, error: 'timeout' }), 3000)
        ),
      ]);
      const { data, error } = result as { data: BlogMetrics[] | null; error: unknown };

      if (error) {
        console.warn('Métricas del blog no disponibles; se continúa sin ellas.');
        return;
      }

      if (data) {
        const metricsMap: Record<number, BlogMetrics> = {};
        data.forEach((item) => {
          metricsMap[item.post_id] = item;
        });
        setMetrics(metricsMap);
      }
    } catch (err) {
      console.warn('Fallo al cargar métricas del blog (ignorado):', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }
    fetchMetrics();
    // A propósito SIN suscripción realtime: abría un WebSocket permanente a
    // Supabase en CADA visita, solo para ver subir contadores de vistas/likes
    // que nadie mira en vivo, y gastaba la cuota de conexiones del plan Free.
  }, [enabled, fetchMetrics]);

  const recordView = useCallback(async (postId: number) => {
    try {
      // Optimistic update
      setMetrics((prev) => ({
        ...prev,
        [postId]: {
          post_id: postId,
          views_count: (prev[postId]?.views_count || 0) + 1,
          likes_count: prev[postId]?.likes_count || 0,
        }
      }));

      await supabase.rpc('increment_blog_view', { metric_post_id: postId });
    } catch (err) {
      console.error('Error recording view:', err);
    }
  }, []);

  const recordLike = useCallback(async (postId: number) => {
    try {
      // Optimistic update
      setMetrics((prev) => ({
        ...prev,
        [postId]: {
          post_id: postId,
          views_count: prev[postId]?.views_count || 0,
          likes_count: (prev[postId]?.likes_count || 0) + 1,
        }
      }));

      await supabase.rpc('increment_blog_like', { metric_post_id: postId });
    } catch (err) {
      console.error('Error recording like:', err);
    }
  }, []);

  return {
    metrics,
    loading,
    recordView,
    recordLike,
    refetch: fetchMetrics
  };
}
