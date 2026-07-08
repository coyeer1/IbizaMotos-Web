import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface BlogMetrics {
  post_id: number;
  views_count: number;
  likes_count: number;
}

export function useBlogMetrics() {
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
    fetchMetrics();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('blog_metrics_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'blog_metrics'
        },
        (payload) => {
          const newMetric = payload.new as BlogMetrics;
          if (newMetric && newMetric.post_id) {
            setMetrics((prev) => ({
              ...prev,
              [newMetric.post_id]: newMetric
            }));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchMetrics]);

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
