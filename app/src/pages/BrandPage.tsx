import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Motorcycle } from '@/types';
import Catalog from '@/sections/Catalog';
import { brands } from '@/data/motorcycles';

export default function BrandPage() {
    const { brandId } = useParams<{ brandId: string }>();
    const navigate = useNavigate();

    // Convert url parameter to proper brand name (e.g. 'suzuki' to 'Suzuki')
    const brandData = brands.find(b => b.name.toLowerCase() === brandId?.toLowerCase());

    // We maintain state so Catalog works properly, but initialized to the URL brand
    const [selectedBrand, setSelectedBrand] = useState<string>(brandData?.name || 'all');

    useEffect(() => {
        if (brandData) {
            setSelectedBrand(brandData.name);
        } else {
            // If brand not found, fallback to all
            setSelectedBrand('all');
        }
        window.scrollTo(0, 0);
    }, [brandData]);

    const handleViewDetails = (motorcycle: Motorcycle) => {
        navigate(`/moto/${motorcycle.id}`);
    };

    return (
        <div className="min-h-screen bg-ibiza-black pt-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-4">
                {brandData && (
                    <div className="flex items-center gap-6">
                        <div className="w-32 h-20 rounded-xl flex items-center justify-center bg-ibiza-gray-100 p-4 border border-border">
                            <img src={brandData.logo} alt={brandData.name} className="w-full h-full object-contain filter brightness-0 invert opacity-80" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-display font-bold text-white">Catálogo {brandData.name}</h1>
                            <p className="text-gray-400 mt-2">Explora todos los modelos disponibles</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Reuse Catalog component */}
            <Catalog
                onViewDetails={handleViewDetails}
                selectedBrand={selectedBrand}
                setSelectedBrand={setSelectedBrand}
                hideTitle={true}
            />
        </div>
    );
}
