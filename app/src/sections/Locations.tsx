import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Store, Wrench } from 'lucide-react';
import { branches } from '@/data/motorcycles';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const branchMeta: Record<string, { type: string; color: string; icon: React.ReactNode; mapEmbed: string; image: string }> = {
  '1': {
    type: 'Showroom & Taller',
    color: '#c0392b',
    icon: <Store className="w-5 h-5" />,
    mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3977.4!2d-75.6811!3d4.5339!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNMKwMzInMDIuMCJOIDc1wrA0MCc1Mi4wIlc!5e0!3m2!1ses!2sco!4v1700000000',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=800',
  },
  '2': {
    type: 'Taller Autorizado',
    color: '#e67e22',
    icon: <Wrench className="w-5 h-5" />,
    mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3977.0!2d-75.690!3d4.545!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNMKwMzInNDIuMCJOIDc1wrA0MScyNC4wIlc!5e0!3m2!1ses!2sco!4v1700000001',
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=800',
  },
  '3': {
    type: 'Taller Autorizado',
    color: '#8e44ad',
    icon: <Wrench className="w-5 h-5" />,
    mapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3975.8!2d-75.635!3d4.618!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNMKwMzcnMDQuOCJOIDc1wrAzOCcwNi4wIlc!5e0!3m2!1ses!2sco!4v1700000002',
    image: 'https://images.unsplash.com/photo-1558981359-219d6364c9c8?auto=format&fit=crop&q=80&w=800',
  },
};

export default function Locations() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.05 });
  const [selectedBranch, setSelectedBranch] = useState(branches[0]);
  const meta = branchMeta[selectedBranch.id];

  const openGoogleMaps = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
  };

  return (
    <section id="contacto" className="locations-section" ref={ref}>
      {/* Background grid pattern */}
      <div className="locations-bg-pattern" />

      <div className="locations-container">
        {/* ── Header ── */}
        <motion.div
          className="locations-header"
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <span className="locations-eyebrow">
            <MapPin className="w-4 h-4" />
            Eje Cafetero
          </span>
          <h2 className="locations-title">NUESTRAS SUCURSALES</h2>
          <p className="locations-subtitle">
            Tres puntos estratégicos para servirte mejor. Showroom, taller autorizado
            y atención personalizada en cada sede.
          </p>
        </motion.div>

        {/* ── Content grid ── */}
        <div className="locations-grid">

          {/* Left: Branch cards */}
          <motion.div
            className="locations-cards-col"
            initial={{ opacity: 0, x: -40 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {branches.map((branch, i) => {
              const m = branchMeta[branch.id];
              const isActive = selectedBranch.id === branch.id;
              return (
                <motion.button
                  key={branch.id}
                  onClick={() => setSelectedBranch(branch)}
                  className={`branch-card ${isActive ? 'branch-card-active' : ''}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.12 }}
                  whileHover={{ y: -3 }}
                >
                  <div className="branch-card-inner">
                    {/* Thumbnail image */}
                    <div className="branch-thumbnail-wrapper">
                      <img src={m.image} alt={branch.name} loading="lazy" decoding="async" className="branch-thumbnail-img" />
                    </div>

                    <div className="branch-card-content">
                      <h3 className="branch-name">{branch.name}</h3>
                      <p className="branch-address">
                        {branch.name === 'Sede Principal'
                          ? 'Armenia, Quindío - Showroom & Taller Autorizado'
                          : 'Armenia, Quindío - Taller Autorizado'}
                      </p>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>

          {/* Right: Map + detail overlay */}
          <motion.div
            className="locations-map-col"
            initial={{ opacity: 0, x: 40 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.25 }}
          >
            {/* Map frame */}
            <div className="map-wrapper">
              <AnimatePresence mode="wait">
                <motion.iframe
                  key={selectedBranch.id}
                  src={meta.mapEmbed}
                  className="map-iframe"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                />
              </AnimatePresence>

              {/* Active branch pill on map */}
              <div className="map-branch-pill">
                <MapPin className="w-4 h-4 text-ibiza-red" />
                <span>{selectedBranch.name}</span>
              </div>

              {/* Overlaid Detail Card */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedBranch.id}
                  className="detail-card-overlay"
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ duration: 0.35 }}
                >
                  <div className="detail-card-cover">
                    <img src={meta.image} alt={selectedBranch.name} loading="lazy" decoding="async" className="detail-cover-img" />
                    <div className="detail-card-cover-gradient" />
                  </div>

                  <div className="detail-card-body">
                    <h3 className="detail-name text-center">{selectedBranch.name}</h3>
                    <p className="detail-subtitle text-center">
                      {selectedBranch.name === 'Sede Principal'
                        ? 'Armenia, Quindío - Showroom & Taller Autorizado'
                        : 'Armenia, Quindío - Taller Autorizado'}
                    </p>

                    <div className="detail-info-list mt-4">
                      <p className="detail-info-text text-center text-sm">{selectedBranch.address}</p>
                      <p className="detail-info-text text-center text-sm">Tél.: {selectedBranch.phone}</p>
                      <p className="detail-info-text text-center text-sm">Horarios: {selectedBranch.hours.replace('Lunes a Sábado: ', '')}</p>
                    </div>

                    <div className="detail-card-actions mt-6">
                      <button
                        onClick={() => openGoogleMaps(selectedBranch.coordinates.lat, selectedBranch.coordinates.lng)}
                        className="detail-btn-primary bg-ibiza-red"
                      >
                        CÓMO LLEGAR
                      </button>
                      <a
                        href={`https://wa.me/${selectedBranch.phone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="detail-btn-primary bg-ibiza-red"
                      >
                        LLAMAR
                      </a>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
