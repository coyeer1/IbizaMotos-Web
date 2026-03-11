import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Motorcycle } from '@/types';

export function useMotorcycles() {
    const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchMotorcycles() {
            try {
                const { data, error } = await supabase
                    .from('web_motorcycles')
                    .select('*')
                    .order('brand', { ascending: true });

                if (error) throw error;

                // Map Supabase rows to our app's Motorcycle type Expected by UI
                const formatted: Motorcycle[] = data.map((item: any) => ({
                    ...item,
                    imagesByColor: item.images_by_color,
                    videoUrl: item.video_url,
                    id: item.slug || item.id, // Use slug for smoother URLs if it exists
                }));

                setMotorcycles(formatted);
            } catch (error) {
                console.error('Error fetching motorcycles from Supabase:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchMotorcycles();
    }, []);

    return { motorcycles, loading };
}
