import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import type { Motorcycle } from '@/types';
import Catalog from '@/sections/Catalog';
import { brands } from '@/data/motorcycles';

export default function BrandPage() {
    const { brandId } = useParams<{ brandId: string }>();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const initialCategory = searchParams.get('categoria') || 'all';

    // We maintain state so Catalog works properly
    const [selectedBrand, setSelectedBrand] = useState<string>('all');

    useEffect(() => {
        // Sync URL param to state on mount or param change
        const found = brands.find(b => b.name.toLowerCase() === brandId?.toLowerCase());
        setSelectedBrand(found ? found.name : 'all');
        window.scrollTo(0, 0);
    }, [brandId]);

    // Active brand based on CURRENT selection (syncs with Pills click in Catalog)
    const activeBrandData = brands.find(b => b.name === selectedBrand);

    const handleViewDetails = (motorcycle: Motorcycle) => {
        navigate(`/moto/${motorcycle.id}`);
    };

    return (
        <div className="min-h-screen bg-ibiza-black pt-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 mb-4">
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors duration-200 mb-6 group"
                >
                    <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform duration-200" />
                    <span className="text-sm font-medium">Volver</span>
                </button>
                {activeBrandData ? (
                    <div className="flex items-center gap-6">
                        <div className="w-32 h-20 rounded-xl flex items-center justify-center bg-white p-4 border border-white/10 shadow-sm">
                            <img src={activeBrandData.logo} alt={activeBrandData.name} className="w-full h-full object-contain" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-display font-bold text-white">Catálogo {activeBrandData.name}</h1>
                            <p className="text-gray-400 mt-2">Explora todos los modelos disponibles</p>
                        </div>
                    </div>
                ) : (
                    <div>
                        <h1 className="text-4xl font-display font-bold text-white">
                            {initialCategory !== 'all' ? initialCategory : 'Catálogo completo'}
                        </h1>
                        <p className="text-gray-400 mt-2">Todas las marcas · Todas las motos</p>
                    </div>
                )}
            </div>

            {/* Reuse Catalog component */}
            <Catalog
                onViewDetails={handleViewDetails}
                selectedBrand={selectedBrand}
                setSelectedBrand={setSelectedBrand}
                hideTitle={true}
                initialCategory={initialCategory}
            />
        </div>
    );
}
