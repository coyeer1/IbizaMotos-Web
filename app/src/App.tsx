import { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/sections/Footer';
import Home from '@/pages/Home';
import { AdminAuthProvider } from '@/hooks/useAdminAuth';
import Analytics from '@/components/Analytics';
import { WhatsAppFloat } from '@/components/WhatsAppFloat';
import { ComparatorProvider } from '@/components/MotoComparator';
import { SearchProvider } from '@/components/SearchOverlay';
import ScrollRestorer from '@/components/ScrollRestorer';

// Lazy-loaded pages — cada una solo se descarga cuando el usuario la visita
const MotorcyclePage  = lazy(() => import('@/pages/MotorcyclePage'));
const BrandPage       = lazy(() => import('@/pages/BrandPage'));
const BlogPage        = lazy(() => import('@/pages/BlogPage'));
const FinancingPage   = lazy(() => import('@/pages/FinancingPage'));
const AppointmentPage = lazy(() => import('@/pages/AppointmentPage'));
const OpinionPage     = lazy(() => import('@/pages/OpinionPage'));
const SucursalesPage  = lazy(() => import('@/pages/SucursalesPage'));
const AdminLogin      = lazy(() => import('@/pages/admin/AdminLogin'));
const AdminDashboard  = lazy(() => import('@/pages/admin/AdminDashboard'));
const NotFoundPage    = lazy(() => import('@/pages/NotFoundPage'));
const PrivacyPage      = lazy(() => import('@/pages/PrivacyPage'));
const TermsPage        = lazy(() => import('@/pages/TermsPage'));
const DataDeletionPage = lazy(() => import('@/pages/DataDeletionPage'));

// Spinner minimalista mientras carga la página
function PageLoader() {
  return (
    <div className="min-h-screen bg-ibiza-black flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-ibiza-red border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-ibiza-black">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[200] focus:bg-ibiza-red focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:font-bold"
      >
        Ir al contenido principal
      </a>
      {!isAdminRoute && <Navbar />}

      <main id="main-content">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/"                element={<Home />} />
            <Route path="/marca/:brandId"  element={<BrandPage />} />
            <Route path="/moto/:id"        element={<MotorcyclePage />} />
            <Route path="/blog/:id"        element={<BlogPage />} />
            <Route path="/financiamiento"  element={<FinancingPage />} />
            <Route path="/citas"           element={<AppointmentPage />} />
            <Route path="/opinion"         element={<OpinionPage />} />
            <Route path="/sucursales"      element={<SucursalesPage />} />
            <Route path="/privacidad"      element={<PrivacyPage />} />
            <Route path="/terminos"        element={<TermsPage />} />
            <Route path="/eliminacion-datos" element={<DataDeletionPage />} />
            <Route path="/admin"           element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="*"               element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>

      {!isAdminRoute && <Footer />}

      <ScrollRestorer />
      <Analytics />
      {!isAdminRoute && <WhatsAppFloat />}
    </div>
  );
}

function App() {
  return (
    <AdminAuthProvider>
      <SearchProvider>
        <ComparatorProvider>
          <AppContent />
        </ComparatorProvider>
      </SearchProvider>
    </AdminAuthProvider>
  );
}

export default App;
