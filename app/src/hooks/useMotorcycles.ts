import { motorcycles } from '@/data/motorcycles';
import type { Motorcycle } from '@/types';

export function useMotorcycles(): { motorcycles: Motorcycle[]; loading: boolean } {
    return { motorcycles, loading: false };
}
