import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Phone, Mail, X, ChevronLeft, ChevronRight, Store, Navigation, Map, Search } from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';

// ─── Datos reales de las 19 sucursales ────────────────────────────────────────
interface Sucursal {
  id: number;
  marca: string;
  asesor: string;
  telefono: string;
  correo: string;
  ciudad: string;
  departamento: string;
  direccion: string;
  fotos: string[];
  color: string;
  lat: number;
  lng: number;
  placeUrl?: string;
}

const SUCURSALES: Sucursal[] = [
  // ── Pereira ──────────────────────────────────────────────────────────────────
  {
    id: 1, marca: 'Suzuki', asesor: 'Kevin Hinestroza',
    telefono: '3052884546', correo: 'suzukipereiraiibizamotos@gmail.com',
    ciudad: 'Pereira', departamento: 'Risaralda',
    direccion: 'Cra 7 #25-41 Parque Lago Uribe',
    fotos: [
      '/sucursales/1/foto-fachada-1.webp',
      '/sucursales/1/foto-fachada-2.webp',
      '/sucursales/1/foto-sala-1.webp',
      '/sucursales/1/foto-sala-2.webp',
      '/sucursales/1/foto-sala-3.webp',
    ],
    color: '#1a73e8',
    lat: 4.815230, lng: -75.699683,
    placeUrl: 'https://maps.app.goo.gl/zEkCHqbfjjEcfvvSA',
  },
  {
    id: 2, marca: 'Honda', asesor: 'Kelly Dahiana Ramírez Castaño',
    telefono: '3008142375', correo: 'ibizamotosasesor2@gmail.com',
    ciudad: 'Pereira', departamento: 'Risaralda',
    direccion: 'CRA 7 #26-31',
    fotos: [
      '/sucursales/2/foto-fachada-1.webp',
      '/sucursales/2/foto-fachada-2.webp',
      '/sucursales/2/foto-sala-1.webp',
      '/sucursales/2/foto-sala-2.webp',
    ],
    color: '#cc0000',
    lat: 4.815440, lng: -75.700313,
    placeUrl: 'https://maps.app.goo.gl/XVx4D95gzgi7hFuN9',
  },
  {
    id: 3, marca: 'AKT', asesor: 'Laura Marcela Correa',
    telefono: '3244147066', correo: 'asesoradigital04@gmail.com',
    ciudad: 'Pereira', departamento: 'Risaralda',
    direccion: 'CRA 7 #26-13',
    fotos: [
      '/sucursales/3/foto-fachada-1.webp',
      '/sucursales/3/foto-sala-1.webp',
    ],
    color: '#e65c00',
    lat: 4.815726, lng: -75.700176,
    placeUrl: 'https://maps.app.goo.gl/rSawM96UUb2HPNG29',
  },
  {
    id: 4, marca: 'Hero', asesor: 'Juan Esteban Velasquez',
    telefono: '3212541480', correo: 'heropereiraiibizamotos@gmail.com',
    ciudad: 'Pereira', departamento: 'Risaralda',
    direccion: 'Calle 26 #36-56',
    fotos: [
      '/sucursales/4/foto-fachada-1.webp',
      '/sucursales/4/foto-fachada-2.webp',
      '/sucursales/4/foto-sala-1.webp',
      '/sucursales/4/foto-sala-2.webp',
      '/sucursales/4/foto-sala-3.webp',
    ],
    color: '#8b0000',
    lat: 4.815606, lng: -75.700032,
    placeUrl: 'https://maps.app.goo.gl/4fMMKW8z8Fyv6y2i8',
  },
  // ── Dosquebradas ─────────────────────────────────────────────────────────────
  {
    id: 5, marca: 'AKT', asesor: 'Cristina Collazo',
    telefono: '3244147027', correo: 'cristinaibizamotos@gmail.com',
    ciudad: 'Dosquebradas', departamento: 'Risaralda',
    direccion: 'Av. Simón Bolívar #20-73 (junto a Frisby La Pradera)',
    fotos: [
      '/sucursales/5/foto-fachada-1.webp',
      '/sucursales/5/foto-fachada-2.webp',
    ],
    color: '#e65c00',
    lat: 4.828440, lng: -75.680520,
    placeUrl: 'https://maps.app.goo.gl/oh8zia1YXvxauVMN6',
  },
  {
    id: 6, marca: 'Hero', asesor: 'John Edison Gallego Martínez',
    telefono: '3185358870', correo: 'tslventas14@gmail.com',
    ciudad: 'Dosquebradas', departamento: 'Risaralda',
    direccion: 'CRA 16 #41-13',
    fotos: [
      '/sucursales/6/foto-fachada-1.webp',
      '/sucursales/6/foto-fachada-2.webp',
    ],
    color: '#8b0000',
    lat: 4.836115, lng: -75.669980,
    placeUrl: 'https://maps.app.goo.gl/tWyQbkaZo1uwKvmf8',
  },
  // ── Santa Rosa de Cabal ──────────────────────────────────────────────────────
  {
    id: 7, marca: 'Suzuki', asesor: 'Sandra Yurany Mora',
    telefono: '3161158040', correo: 'suzukisantarosaibiza@gmail.com',
    ciudad: 'Santa Rosa de Cabal', departamento: 'Risaralda',
    direccion: 'Calle 17 #14-32',
    fotos: [
      '/sucursales/7/foto-fachada-1.webp',
      '/sucursales/7/foto-fachada-2.webp',
    ],
    color: '#1a73e8',
    lat: 4.868862, lng: -75.622172,
    placeUrl: 'https://maps.app.goo.gl/ACroSXEKb1eskv818',
  },
  {
    id: 8, marca: 'AKT', asesor: 'Andrés Orlando Sánchez',
    telefono: '3013722562', correo: 'aktsantarosaibizamotos@gmail.com',
    ciudad: 'Santa Rosa de Cabal', departamento: 'Risaralda',
    direccion: 'Cr 14 #16-11',
    fotos: [
      '/sucursales/8/foto-fachada-1.webp',
      '/sucursales/8/foto-fachada-2.webp',
    ],
    color: '#e65c00',
    lat: 4.868254, lng: -75.621712,
    placeUrl: 'https://maps.app.goo.gl/VDHEMxcyC7cA2Kb87',
  },
  {
    id: 9, marca: 'Hero', asesor: 'Erika Julieth González Zuluaga',
    telefono: '3022028560', correo: 'delcafecredimotos@gmail.com',
    ciudad: 'Santa Rosa de Cabal', departamento: 'Risaralda',
    direccion: 'Cra 15 No 15-02',
    fotos: [
      '/sucursales/9/foto-fachada-1.webp',
      '/sucursales/9/foto-fachada-2.webp',
    ],
    color: '#8b0000',
    lat: 4.867045, lng: -75.622271,
    placeUrl: 'https://maps.app.goo.gl/LauQQRqCLCiVA6qG8',
  },
  {
    id: 10, marca: 'Honda', asesor: 'Jefferson Suárez Bartolo',
    telefono: '3105197509', correo: 'hondaibizamotos@gmail.com',
    ciudad: 'Santa Rosa de Cabal', departamento: 'Risaralda',
    direccion: 'Cra 14 #16-11',
    fotos: [
      '/sucursales/10/foto-fachada-1.webp',
      '/sucursales/10/foto-fachada-2.webp',
    ],
    color: '#cc0000',
    lat: 4.868254, lng: -75.621712,
    placeUrl: 'https://maps.app.goo.gl/VDHEMxcyC7cA2Kb87',
  },
  // ── Quimbaya ─────────────────────────────────────────────────────────────────
  {
    id: 11, marca: 'AKT', asesor: 'Yeferson Andrés Naranjo Arroyave',
    telefono: '3174332361', correo: 'quimbayaibizamotos@gmail.com',
    ciudad: 'Quimbaya', departamento: 'Quindío',
    direccion: 'Cr 6 #18-32',
    fotos: [
      '/sucursales/11/foto-fachada-2.webp',
    ],
    color: '#e65c00',
    lat: 4.623015, lng: -75.765215,
    placeUrl: 'https://maps.app.goo.gl/ow9YCC3hZHhQ7mPv7',
  },
  {
    id: 12, marca: 'Honda', asesor: 'Ingrid Giraldo',
    telefono: '3024055077', correo: 'ibizamotoshondaquimbaya@gmail.com',
    ciudad: 'Quimbaya', departamento: 'Quindío',
    direccion: 'Calle 19 #4-56 Esquina',
    fotos: [
      '/sucursales/12/foto-fachada-2.webp',
    ],
    color: '#cc0000',
    lat: 4.622387, lng: -75.765433,
    placeUrl: 'https://maps.app.goo.gl/eUuxhtrCnetLpuR2A',
  },
  // ── Montenegro ───────────────────────────────────────────────────────────────
  {
    id: 13, marca: 'AKT', asesor: 'Jonathan Darío Calvo Villa',
    telefono: '3244147070', correo: 'acatemontenegro@gmail.com',
    ciudad: 'Montenegro', departamento: 'Quindío',
    direccion: 'Cra 8 #19-07 Centro',
    fotos: [
      '/sucursales/13/foto-fachada-1-(1).webp',
      '/sucursales/13/foto-fachada-2.webp',
    ],
    color: '#e65c00',
    lat: 4.565374, lng: -75.751789,
    placeUrl: 'https://maps.app.goo.gl/3nzhi6wcycHpDCrMA',
  },
  // ── Viterbo ──────────────────────────────────────────────────────────────────
  {
    id: 14, marca: 'AKT', asesor: 'Santiago Zapata Cardona',
    telefono: '3228487328', correo: 'magranadaibizamotos2@gmail.com',
    ciudad: 'Viterbo', departamento: 'Caldas',
    direccion: 'Cra 9 #4-09',
    fotos: [
      '/sucursales/14/foto-fachada-1-(1).webp',
      '/sucursales/14/foto-fachada-2.webp',
    ],
    color: '#e65c00',
    lat: 5.064854, lng: -75.870363,
    placeUrl: 'https://maps.app.goo.gl/3oAhR8LZSgPp6dKm7',
  },
  // ── Chinchiná ────────────────────────────────────────────────────────────────
  {
    id: 15, marca: 'Suzuki', asesor: 'Dany Stiven González Rodríguez',
    telefono: '3006979437', correo: 'chinchinasuzuki@gmail.com',
    ciudad: 'Chinchiná', departamento: 'Caldas',
    direccion: 'Cra 4 #14-42 Local 8 Edén',
    fotos: [
      '/sucursales/15/foto-fachada-1-(1).webp',
      '/sucursales/15/foto-fachada-2-(1).webp',
    ],
    color: '#1a73e8',
    lat: 4.987730, lng: -75.607175,
    placeUrl: 'https://maps.app.goo.gl/wUvxtXAiHoyxwMKo6',
  },
  // ── Neiva ────────────────────────────────────────────────────────────────────
  {
    id: 16, marca: 'Honda', asesor: 'Maria Molano Polania',
    telefono: '3052884548', correo: 'Posneivaibizamotos@gmail.com',
    ciudad: 'Neiva', departamento: 'Huila',
    direccion: 'Cra 5 #12-48',
    fotos: [
      '/sucursales/16/foto-fachada-1.webp',
      '/sucursales/16/foto-fachada-2.webp',
    ],
    color: '#cc0000',
    lat: 2.930939, lng: -75.290289,
    placeUrl: 'https://maps.app.goo.gl/sTs1q4j5cA2XtMGG7',
  },
  {
    id: 17, marca: 'Vento', asesor: 'Maria Molano Polania',
    telefono: '3052884548', correo: 'Posneivaibizamotos@gmail.com',
    ciudad: 'Neiva', departamento: 'Huila',
    direccion: 'Carrera 5 #12-44',
    fotos: [
      '/sucursales/17/foto-fachada-1.webp',
      '/sucursales/17/foto-fachada-2.webp',
    ],
    color: '#006633',
    lat: 2.930734, lng: -75.290286,
    placeUrl: 'https://maps.app.goo.gl/byTk4yT5NnZgzFz59',
  },
  {
    id: 18, marca: 'Bajaj', asesor: 'John Ferney Gómez',
    telefono: '3014323989', correo: 'jgomezibizamoto@gmail.com',
    ciudad: 'Neiva', departamento: 'Huila',
    direccion: 'Carrera 2 #5-63 Centro',
    fotos: [
      '/sucursales/18/foto-fachada-1.webp',
      '/sucursales/18/foto-fachada-2.webp',
    ],
    color: '#003399',
    lat: 2.924088, lng: -75.290836,
    placeUrl: 'https://maps.app.goo.gl/hbtFi61wzHdMEUTcA',
  },
  {
    id: 19, marca: 'Honda', asesor: 'Tatiana Cortés Muñoz',
    telefono: '3209352165', correo: 'neivaasesoribizamotos@gmail.com',
    ciudad: 'Neiva', departamento: 'Huila',
    direccion: 'Cra 7 #4-46 Centro',
    fotos: [
      '/sucursales/19/foto-fachada-1.webp',
      '/sucursales/19/foto-sala-1.webp',
    ],
    color: '#cc0000',
    lat: 2.924856, lng: -75.285825,
    placeUrl: 'https://maps.app.goo.gl/qPP7ZQv7Mjd9kDuk7',
  },
];

const CIUDADES = Array.from(new Set(SUCURSALES.map(s => s.ciudad)));

// Vista por ciudad: [lat, lng, zoom]
const CITY_VIEWS: Record<string, [number, number, number]> = {
  'Todas':               [4.35, -75.72, 8],
  'Pereira':             [4.8154, -75.6999, 17],
  'Dosquebradas':        [4.8323, -75.6753, 14],
  'Santa Rosa de Cabal': [4.8680, -75.6221, 16],
  'Quimbaya':            [4.6227, -75.7653, 16],
  'Montenegro':          [4.5654, -75.7518, 15],
  'Viterbo':             [5.0649, -75.8704, 15],
  'Chinchiná':           [4.9877, -75.6072, 15],
  'Neiva':               [2.9277, -75.2893, 14],
};

function getMapsUrl(s: Sucursal) {
  if (s.placeUrl) return s.placeUrl;
  const direccionLimpia = s.direccion.replace(/#/g, 'No.');
  const query = `Ibiza Motos ${s.marca}, ${direccionLimpia}, ${s.ciudad}, ${s.departamento}, Colombia`;
  return `https://maps.google.com/?q=${encodeURIComponent(query)}`;
}

function getWaUrl(s: Sucursal) {
  const msg = `Hola, vi su sucursal ${s.marca} en ${s.ciudad} (${s.direccion}). ¿Me pueden dar información sobre sus motos?`;
  return `https://wa.me/57${s.telefono}?text=${encodeURIComponent(msg)}`;
}

// ─── Placeholder cuando no hay fotos ─────────────────────────────────────────
function SinFoto({ marca, color }: { marca: string; color: string }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-2" style={{ backgroundColor: color + '15' }}>
      <Store className="w-12 h-12 opacity-30" style={{ color }} />
      <span className="text-xs text-[#999999]">{marca}</span>
    </div>
  );
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────
function Lightbox({ fotos, initialIndex, onClose }: { fotos: string[]; initialIndex: number; onClose: () => void }) {
  const [current, setCurrent] = useState(initialIndex);
  const prev = () => setCurrent(i => (i - 1 + fotos.length) % fotos.length);
  const next = () => setCurrent(i => (i + 1) % fotos.length);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 backdrop-blur-sm"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white z-10 bg-white/10 rounded-full p-2">
        <X className="w-6 h-6" />
      </button>
      {fotos.length > 1 && (
        <>
          <button onClick={e => { e.stopPropagation(); prev(); }} className="absolute left-3 text-white/70 hover:text-white z-10 bg-white/10 hover:bg-white/20 rounded-full p-3 transition-all">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button onClick={e => { e.stopPropagation(); next(); }} className="absolute right-3 text-white/70 hover:text-white z-10 bg-white/10 hover:bg-white/20 rounded-full p-3 transition-all">
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}
      <motion.img
        key={current}
        src={fotos[current]}
        alt=""
        className="max-h-[85vh] max-w-[88vw] object-contain rounded-xl shadow-2xl"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        onClick={e => e.stopPropagation()}
      />
      {fotos.length > 1 && (
        <div className="absolute bottom-5 flex gap-2">
          {fotos.map((_, i) => (
            <button key={i} onClick={e => { e.stopPropagation(); setCurrent(i); }}
              className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-white scale-125' : 'bg-white/35 hover:bg-white/60'}`}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ─── Tarjeta de sucursal ──────────────────────────────────────────────────────
function TarjetaSucursal({ s }: { s: Sucursal }) {
  const [fotoIdx, setFotoIdx] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const tienefotos = s.fotos.length > 0;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.35 }}
        className="bg-white rounded-2xl overflow-hidden border border-[#e8e8e8] transition-shadow duration-300 flex flex-col"
        style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}
      >
        {/* Foto principal */}
        <div
          className={`relative h-48 bg-[#f5f5f5] overflow-hidden ${tienefotos ? 'cursor-pointer group' : ''}`}
          onClick={() => tienefotos && setLightbox(fotoIdx)}
        >
          {tienefotos ? (
            <img
              src={s.fotos[fotoIdx]}
              alt={`${s.marca} ${s.ciudad}`}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <SinFoto marca={s.marca} color={s.color} />
          )}

          {/* Badge marca */}
          <div
            className="absolute top-3 left-3 px-3 py-1 rounded-full text-white text-xs font-bold shadow"
            style={{ backgroundColor: s.color }}
          >
            {s.marca}
          </div>

          {/* Miniaturas si hay más de 1 foto */}
          {s.fotos.length > 1 && (
            <div className="absolute bottom-2 right-2 flex gap-1">
              {s.fotos.map((f, i) => (
                <button
                  key={i}
                  onClick={e => { e.stopPropagation(); setFotoIdx(i); }}
                  className={`w-7 h-7 rounded overflow-hidden border-2 transition-all flex-shrink-0 ${
                    i === fotoIdx ? 'border-white scale-110' : 'border-white/40 opacity-60 hover:opacity-90'
                  }`}
                >
                  <img src={f} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4 flex flex-col gap-3 flex-1">
          <div>
            <h3 className="font-display font-bold text-[#111111] text-base leading-tight">{s.asesor}</h3>
            <p className="text-xs text-[#999999] mt-0.5 font-medium uppercase tracking-wide">{s.marca} — Ibiza Motos</p>
          </div>

          <div className="flex flex-col gap-1.5 text-sm text-[#666666]">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-0.5 text-ibiza-red flex-shrink-0" />
              <span className="leading-snug">{s.direccion}, {s.ciudad}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-ibiza-red flex-shrink-0" />
              <a href={`tel:+57${s.telefono}`} className="hover:text-ibiza-red transition-colors font-medium">
                {s.telefono}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-ibiza-red flex-shrink-0" />
              <a href={`mailto:${s.correo}`} className="hover:text-ibiza-red transition-colors truncate text-xs">
                {s.correo}
              </a>
            </div>
          </div>

          {/* Botones */}
          <div className="mt-auto flex flex-col gap-2 pt-1">
            <a
              href={getMapsUrl(s)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2 rounded-xl border-2 border-[#e8e8e8] text-[#666666] text-sm font-semibold hover:border-ibiza-red hover:text-ibiza-red transition-all duration-200"
            >
              <Navigation className="w-4 h-4" />
              Cómo llegar
            </a>

            <a
              href={getWaUrl(s)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90"
              style={{ backgroundColor: '#25D366' }}
            >
              <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Escribir al asesor
            </a>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {lightbox !== null && tienefotos && (
          <Lightbox fotos={s.fotos} initialIndex={lightbox} onClose={() => setLightbox(null)} />
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Marcador personalizado ───────────────────────────────────────────────────
const BRAND_ABBREV: Record<string, string> = {
  Suzuki: 'Su', Honda: 'Ho', AKT: 'AK', Hero: 'He',
  Vento: 'Ve', Bajaj: 'Bj', 'Good Kidz': 'GK',
};

function createPin(color: string, marca: string) {
  const abbrev = BRAND_ABBREV[marca] ?? marca.slice(0, 2);
  return L.divIcon({
    className: '',
    html: `
      <svg width="34" height="46" viewBox="0 0 34 46" xmlns="http://www.w3.org/2000/svg"
        style="filter:drop-shadow(0 4px 8px rgba(0,0,0,0.3))">
        <path d="M17 1C8.163 1 1 8.163 1 17c0 12.5 16 28 16 28S33 29.5 33 17C33 8.163 25.837 1 17 1z"
          fill="${color}" stroke="white" stroke-width="2"/>
        <text x="17" y="16.5" text-anchor="middle" dominant-baseline="central"
          font-family="'Arial Black', Arial, sans-serif" font-weight="900"
          font-size="11" fill="white" letter-spacing="0.3">${abbrev}</text>
      </svg>`,
    iconSize: [34, 46],
    iconAnchor: [17, 46],
    popupAnchor: [0, -48],
  });
}

// ─── FlyTo al cambiar ciudad ──────────────────────────────────────────────────
function FlyToHandler({ ciudad }: { ciudad: string }) {
  const map = useMap();
  useEffect(() => {
    const view = CITY_VIEWS[ciudad] ?? CITY_VIEWS['Todas'];
    map.flyTo([view[0], view[1]], view[2], { duration: 1.0 });
  }, [ciudad, map]);
  return null;
}

// ─── Mapa de sucursales ───────────────────────────────────────────────────────
function MapaSucursales({ sucursales, ciudadActiva }: { sucursales: Sucursal[]; ciudadActiva: string }) {
  const initialView = CITY_VIEWS['Todas'];

  return (
    <MapContainer
      center={[initialView[0], initialView[1]]}
      zoom={initialView[2]}
      scrollWheelZoom={true}
      className="w-full h-full"
      style={{ zIndex: 0 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FlyToHandler ciudad={ciudadActiva} />
      {sucursales.map(s => (
        <Marker key={s.id} position={[s.lat, s.lng]} icon={createPin(s.color, s.marca)}>
          <Popup minWidth={220} maxWidth={260}>
            <div className="font-sans">
              {/* Foto */}
              {s.fotos.length > 0 && (
                <img
                  src={s.fotos[0]}
                  alt={s.marca}
                  loading="lazy"
                  decoding="async"
                  style={{ width: '100%', height: '110px', objectFit: 'cover', borderRadius: '6px', marginBottom: '8px' }}
                />
              )}
              {/* Marca badge */}
              <span
                style={{
                  display: 'inline-block',
                  padding: '2px 10px',
                  borderRadius: '999px',
                  backgroundColor: s.color,
                  color: 'white',
                  fontSize: '11px',
                  fontWeight: 700,
                  marginBottom: '4px',
                }}
              >
                {s.marca}
              </span>
              <div style={{ fontWeight: 700, fontSize: '13px', color: '#111', lineHeight: 1.3, marginBottom: '2px' }}>
                {s.asesor}
              </div>
              <div style={{ fontSize: '12px', color: '#555', marginBottom: '8px' }}>
                {s.direccion}, {s.ciudad}
              </div>
              {/* Botones */}
              <div style={{ display: 'flex', gap: '6px' }}>
                <a
                  href={getMapsUrl(s)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    flex: 1, textAlign: 'center', padding: '5px 0',
                    border: '1.5px solid #d1d5db', borderRadius: '8px',
                    fontSize: '12px', fontWeight: 600, color: '#374151',
                    textDecoration: 'none',
                  }}
                >
                  Cómo llegar
                </a>
                <a
                  href={getWaUrl(s)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    flex: 1, textAlign: 'center', padding: '5px 0',
                    backgroundColor: '#25D366', borderRadius: '8px',
                    fontSize: '12px', fontWeight: 600, color: 'white',
                    textDecoration: 'none',
                  }}
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function SucursalesPage() {
  const [ciudadActiva, setCiudadActiva] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState('');

  useSEO({
    title: 'Nuestras 19 Sucursales en Pereira, Eje Cafetero y Neiva | Ibiza Motos',
    description: 'Encuentra tu sucursal Ibiza Motos más cercana: 19 puntos en Pereira, Dosquebradas, Santa Rosa de Cabal, Quimbaya, Montenegro, Viterbo, Chinchiná y Neiva. Direcciones, teléfonos y mapa.',
    path: '/sucursales',
  });

  const ciudadesFiltro = ['Todas', ...CIUDADES];

  const sucursalesFiltradas = useMemo(() => {
    let result = ciudadActiva === 'Todas'
      ? SUCURSALES
      : SUCURSALES.filter(s => s.ciudad === ciudadActiva);
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      result = result.filter(s =>
        s.asesor.toLowerCase().includes(q) ||
        s.marca.toLowerCase().includes(q) ||
        s.ciudad.toLowerCase().includes(q) ||
        s.direccion.toLowerCase().includes(q)
      );
    }
    return result;
  }, [ciudadActiva, searchQuery]);

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Header */}
      <div className="bg-white py-14 px-4 text-center border-b border-[#ececec]">
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center justify-center gap-2 mb-3">
            <Store className="w-5 h-5 text-ibiza-red" />
            <span className="text-ibiza-red font-display text-xs tracking-widest uppercase">Red de distribución</span>
          </div>
          <h1 className="font-display font-black text-4xl md:text-5xl text-[#111111] mb-3">
            Nuestras <span className="text-ibiza-red">Sucursales</span>
          </h1>
          <p className="text-[#666666] max-w-lg mx-auto text-base">
            <span className="text-[#111111] font-bold">19 puntos de venta</span> en Risaralda, Quindío, Caldas y Huila.
            Encuentra el más cercano a ti.
          </p>
        </motion.div>
      </div>

      {/* Buscador */}
      <div className="bg-white border-b border-[#ececec] px-4 py-4">
        <div className="max-w-xl mx-auto relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#999999] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Buscar por ciudad, marca o asesor…"
            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#e8e8e8] bg-white text-sm text-[#111111] placeholder-[#999999] focus:outline-none focus:ring-2 focus:ring-ibiza-red/30 focus:border-ibiza-red transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999999] hover:text-[#666666]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filtro por ciudad */}
      <div className="sticky top-16 z-10 bg-white border-b border-[#ececec] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex gap-2 overflow-x-auto no-scrollbar">
          {ciudadesFiltro.map(ciudad => {
            const count = ciudad === 'Todas' ? SUCURSALES.length : SUCURSALES.filter(s => s.ciudad === ciudad).length;
            return (
              <button
                key={ciudad}
                onClick={() => setCiudadActiva(ciudad)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0 border ${
                  ciudadActiva === ciudad
                    ? 'bg-ibiza-red text-white border-ibiza-red shadow scale-105'
                    : 'bg-white text-[#666666] border-[#e8e8e8] hover:border-ibiza-red hover:text-ibiza-red'
                }`}
              >
                {ciudad}
                <span className="ml-1.5 text-xs opacity-70">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={ciudadActiva}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {sucursalesFiltradas.map(s => (
              <TarjetaSucursal key={s.id} s={s} />
            ))}
          </motion.div>
        </AnimatePresence>

        {sucursalesFiltradas.length === 0 ? (
          <div className="text-center py-16 text-[#999999]">
            <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">Sin resultados para "{searchQuery}"</p>
            <button onClick={() => setSearchQuery('')} className="mt-2 text-ibiza-red text-sm hover:underline">
              Limpiar búsqueda
            </button>
          </div>
        ) : (
          <p className="text-center text-[#999999] text-sm mt-10">
            {sucursalesFiltradas.length} sucursal{sucursalesFiltradas.length !== 1 ? 'es' : ''}{' '}
            {searchQuery ? `con "${searchQuery}"` : ciudadActiva === 'Todas' ? 'en toda la red' : `en ${ciudadActiva}`}
          </p>
        )}
      </div>

      {/* ── Mapa ── */}
      <div className="border-t border-[#ececec]">
        {/* Header del mapa */}
        <div className="bg-white py-8 px-4 text-center border-b border-[#ececec]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              <Map className="w-5 h-5 text-ibiza-red" />
              <span className="text-ibiza-red font-display text-xs tracking-widest uppercase">Mapa de sucursales</span>
            </div>
            <h2 className="font-display font-black text-2xl md:text-3xl text-[#111111]">
              Encuéntranos en el <span className="text-ibiza-red">mapa</span>
            </h2>
            <p className="text-[#666666] text-sm mt-1">Haz clic en cualquier punto para ver la sucursal</p>
          </motion.div>
        </div>

        {/* Contenedor del mapa */}
        <div className="w-full h-[350px] md:h-[500px] lg:h-[600px]">
          <MapaSucursales sucursales={sucursalesFiltradas} ciudadActiva={ciudadActiva} />
        </div>
      </div>
    </div>
  );
}
