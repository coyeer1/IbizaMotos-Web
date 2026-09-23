// Datos reales de las sucursales de Ibiza Motos.
// Fuente oficial: BASE DATOS PUNTOS IBIZA Y CLASSE MOTOS.xlsx (hoja Ibiza).
// Fuente única compartida por SucursalesPage, OpinionPage y el panel admin (QR + opiniones).
export interface Sucursal {
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
  /** Sale en la web con el aviso "Cerrado temporalmente". */
  estado?: 'cerrado-temporal';
}

export const SUCURSALES: Sucursal[] = [
  // ── Pereira ──────────────────────────────────────────────────────────────────
  {
    id: 1, marca: 'Suzuki', asesor: 'Luisa Arboleda',
    telefono: '3023649306', correo: 'asesoribizamotos7@gmail.com',
    ciudad: 'Pereira', departamento: 'Risaralda',
    direccion: 'Av. 30 de Agosto #48-60',
    fotos: [], // las fotos eran del local anterior al terremoto
    color: '#1a73e8',
    // Aprox. (±60 m): esquina Av. 30 de Agosto x Calle 48 (OpenStreetMap). Cambiar
    // por las exactas y agregar placeUrl cuando exista la ficha en Google Maps.
    lat: 4.815645, lng: -75.718636,
  },
  {
    id: 2, marca: 'Honda', asesor: 'Kelly Ramirez',
    telefono: '3013722506', correo: 'ibizamotosasesor6@gmail.com',
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
    estado: 'cerrado-temporal',
  },
  {
    id: 3, marca: 'AKT', asesor: 'Stefania Villa',
    telefono: '3052010678', correo: 'ibizamotosasesor1@gmail.com',
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
    id: 4, marca: 'Hero', asesor: 'Karen Galves',
    telefono: '3013722506', correo: 'ibizamotosasesor6@gmail.com',
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
    id: 6, marca: 'Hero', asesor: 'John Edison Gallego Martínez',
    telefono: '3185358870', correo: 'tslventas14@gmail.com',
    ciudad: 'Dosquebradas', departamento: 'Risaralda',
    direccion: 'Av. Simón Bolívar #32-24 (frente a La Rosa)',
    fotos: [], // las fotos eran del local anterior al terremoto
    color: '#8b0000',
    // Aprox.: esquina de la direccion segun OpenStreetMap. Cambiar por las exactas
    // y agregar placeUrl cuando exista la ficha en Google Maps.
    lat: 4.832653, lng: -75.674104,
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
  {
    id: 20, marca: 'Multimarca', asesor: 'Melanny Lopez',
    telefono: '3243942165', correo: 'asesordigitalibizamotos1@gmail.com',
    ciudad: 'Santa Rosa de Cabal', departamento: 'Risaralda',
    direccion: 'Cra 14 #18-13 Local comercial',
    fotos: [],
    color: '#d7263d',
    // Aprox.: esquina de la direccion segun OpenStreetMap. Cambiar por las exactas
    // y agregar placeUrl cuando exista la ficha en Google Maps.
    lat: 4.869773, lng: -75.622176,
  },
  {
    id: 21, marca: 'Honda', asesor: 'Melanny Lopez',
    telefono: '3243942165', correo: 'asesordigitalibizamotos1@gmail.com',
    ciudad: 'Santa Rosa de Cabal', departamento: 'Risaralda',
    direccion: 'Cra 11 #15-27',
    fotos: [],
    color: '#cc0000',
    // Aprox.: esquina de la direccion segun OpenStreetMap. Cambiar por las exactas
    // y agregar placeUrl cuando exista la ficha en Google Maps.
    lat: 4.868020, lng: -75.618922,
    estado: 'cerrado-temporal',
  },
  // ── Quimbaya ─────────────────────────────────────────────────────────────────
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
  {
    id: 22, marca: 'Suzuki', asesor: 'Roberth José Baena Martinez',
    telefono: '3043465599', correo: 'suzukiquimbayaibizamotos@gmail.com',
    ciudad: 'Quimbaya', departamento: 'Quindío',
    direccion: 'Cra 4 #19-04',
    fotos: [],
    color: '#1a73e8',
    // Aprox.: esquina de la direccion segun OpenStreetMap. Cambiar por las exactas
    // y agregar placeUrl cuando exista la ficha en Google Maps.
    lat: 4.621703, lng: -75.765542,
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
    direccion: 'Cra 8 #5-03',
    fotos: [
      '/sucursales/14/foto-fachada-1-(1).webp',
      '/sucursales/14/foto-fachada-2.webp',
    ],
    color: '#e65c00',
    // Aprox.: esquina de la direccion segun OpenStreetMap. Cambiar por las exactas
    // y agregar placeUrl cuando exista la ficha en Google Maps.
    lat: 5.064509, lng: -75.872221,
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
    id: 17, marca: 'Vento', asesor: 'Alejandra Medina',
    telefono: '3052884548', correo: 'ventoibizamotosneiva@gmail.com',
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
  {
    id: 23, marca: 'Vento', asesor: 'Sebastian Artunduaga',
    telefono: '3043953035', correo: 'ibizamotosbajajneiva@gmail.com',
    ciudad: 'Neiva', departamento: 'Huila',
    direccion: 'Calle 12 #5-108',
    fotos: [],
    color: '#006633',
    // Aprox.: esquina de la direccion segun OpenStreetMap. Cambiar por las exactas
    // y agregar placeUrl cuando exista la ficha en Google Maps.
    lat: 2.930443, lng: -75.290285,
  },
  {
    id: 24, marca: 'Vento', asesor: 'Roger Mauricio',
    telefono: '3219290428', correo: 'asesoribizaventocra7@gmail.com',
    ciudad: 'Neiva', departamento: 'Huila',
    direccion: 'Calle 6 #7-37',
    fotos: [],
    color: '#006633',
    // Aprox.: esquina de la direccion segun OpenStreetMap. Cambiar por las exactas
    // y agregar placeUrl cuando exista la ficha en Google Maps.
    lat: 2.926184, lng: -75.285672,
  },
];
