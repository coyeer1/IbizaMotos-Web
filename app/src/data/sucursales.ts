// Datos reales de las 19 sucursales de Ibiza Motos.
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
}

export const SUCURSALES: Sucursal[] = [
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
