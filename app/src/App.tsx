import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/sections/Footer';
import Home from '@/pages/Home';
import MotorcyclePage from '@/pages/MotorcyclePage';
import BrandPage from '@/pages/BrandPage';
import AdminLogin from '@/pages/admin/AdminLogin';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import BlogPage from '@/pages/BlogPage';
import FinancingPage from '@/pages/FinancingPage';
import AppointmentPage from '@/pages/AppointmentPage';
import NotFoundPage from '@/pages/NotFoundPage';
import { AdminAuthProvider } from '@/hooks/useAdminAuth';
import Analytics from '@/components/Analytics';
import { WhatsAppFloat } from '@/components/WhatsAppFloat';
import { ComparatorProvider } from '@/components/MotoComparator';
import ScrollRestorer from '@/components/ScrollRestorer';

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-ibiza-black">
      {/* Navigation — hidden on admin pages */}
      {!isAdminRoute && <Navbar />}

      {/* Main content */}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/marca/:brandId" element={<BrandPage />} />
          <Route path="/moto/:id" element={<MotorcyclePage />} />
          <Route path="/blog/:id" element={<BlogPage />} />
          <Route path="/financiamiento" element={<FinancingPage />} />
          <Route path="/citas" element={<AppointmentPage />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {/* Footer — hidden on admin pages */}
      {!isAdminRoute && <Footer />}

      {/* Global Utilities */}
      <ScrollRestorer />
      <Analytics />
      {!isAdminRoute && <WhatsAppFloat />}
    </div>
  );
}

function App() {
  return (
    <AdminAuthProvider>
      <ComparatorProvider>
        <AppContent />
      </ComparatorProvider>
    </AdminAuthProvider>
  );
}

export default App;
