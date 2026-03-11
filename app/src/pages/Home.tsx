import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Motorcycle } from '@/types';
import Hero from '@/sections/Hero';
import Brands from '@/sections/Brands';
import Catalog from '@/sections/Catalog';
import SpareParts from '@/sections/SpareParts';
import Services from '@/sections/Services';
import Testimonials from '@/sections/Testimonials';
import Locations from '@/sections/Locations';

export default function Home() {
    const navigate = useNavigate();
    const [selectedBrand, setSelectedBrand] = useState('all');

    const handleViewDetails = (motorcycle: Motorcycle) => {
        navigate(`/moto/${motorcycle.id}`);
    };

    return (
        <>
            {/* Hero Section with 3D animations */}
            <Hero />

            {/* Brands scroll */}
            <Brands onBrandClick={(brand) => {
                navigate(`/marca/${brand.toLowerCase()}`);
            }} />

            {/* Full Catalog */}
            <Catalog
                onViewDetails={handleViewDetails}
                selectedBrand={selectedBrand}
                setSelectedBrand={setSelectedBrand}
            />

            {/* Spare Parts */}
            <SpareParts />

            {/* Services with appointment booking */}
            <Services />

            {/* Testimonials */}
            <Testimonials />

            {/* Locations / Contact */}
            <Locations />
        </>
    );
}
