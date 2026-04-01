import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '@/sections/Hero';
import Brands from '@/sections/Brands';
import BrandSelector from '@/sections/BrandSelector';
import Categories from '@/sections/Categories';
import SpareParts from '@/sections/SpareParts';
import Services from '@/sections/Services';
import Testimonials from '@/sections/Testimonials';
import HappyCustomers from '@/sections/HappyCustomers';
import PromosBanner from '@/sections/PromosBanner';
import FinancingTeaser from '@/sections/FinancingTeaser';
import Blog from '@/sections/Blog';

function ScrollProgress() {
    const [progress, setProgress] = useState(0);
    useEffect(() => {
        const update = () => {
            const el = document.documentElement;
            const total = el.scrollHeight - el.clientHeight;
            setProgress(total > 0 ? (el.scrollTop / total) * 100 : 0);
        };
        window.addEventListener('scroll', update, { passive: true });
        return () => window.removeEventListener('scroll', update);
    }, []);
    return (
        <div className="fixed top-0 left-0 right-0 z-[100] h-[3px] pointer-events-none">
            <div className="h-full bg-ibiza-red" style={{ width: `${progress}%`, transition: 'width 80ms linear' }} />
        </div>
    );
}

export default function Home() {
    const navigate = useNavigate();

    return (
        <>
            <ScrollProgress />

            {/* Hero Section */}
            <Hero />

            {/* Promotions Banner */}
            <PromosBanner />

            {/* Brands scroll — logos animados */}
            <Brands onBrandClick={(brand) => {
                navigate(`/marca/${brand.toLowerCase()}`);
            }} />

            {/* Categories showcase */}
            <Categories />

            {/* Brand selector — 1 moto por marca → /marca/:brand */}
            <BrandSelector />

            {/* Financing Teaser → /financiamiento */}
            <FinancingTeaser />

            {/* Spare Parts */}
            <SpareParts />

            {/* Services */}
            <Services />

            {/* Blog */}
            <Blog />

            {/* Testimonials */}
            <Testimonials />

            {/* Clientes Felices */}
            <HappyCustomers />

        </>
    );
}
