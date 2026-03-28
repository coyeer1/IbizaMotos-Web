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

export default function Home() {
    const navigate = useNavigate();

    return (
        <>
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
