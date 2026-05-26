// ─── Brand Themes ─────────────────────────────────────────────────────────────
// Paleta de colores, video hero y datos editoriales por marca.
// Para agregar el video de una marca: llenar heroVideoId con el ID de YouTube
// (la parte final de la URL: youtube.com/watch?v=ESTE_ID).

export interface BrandTheme {
  primary: string;      // Color principal de la marca (hex)
  secondary: string;    // Color secundario (hex)
  bg: string;           // Fondo oscuro de la página (hex)
  glowRgb: string;      // Valores RGB para efectos de glow
  tagline: string;      // Eslogan oficial de la marca
  description: string;  // Historia de la marca en contexto Colombia/Ibiza Motos
  founded: string;      // Año de fundación
  origin: string;       // País de origen
  heroVideoId: string;  // ID de YouTube para el hero de la BrandPage (vacío = usa imagen)
  slideImage: string;   // Imagen fallback si no hay video
}

export const BRAND_THEMES: Record<string, BrandTheme> = {

  // ── SUZUKI ─────────────────────────────────────────────────────────────────
  // Azul cobalto japonés. Precisión centenaria. Fondo azul marino profundo.
  Suzuki: {
    primary: '#0062B1',
    secondary: '#003D6E',
    bg: '#070D18',
    glowRgb: '0, 98, 177',
    tagline: 'Way of Life',
    description:
      'Suzuki lleva más de 100 años perfeccionando el arte de montar. Sus motos combinan precisión japonesa con tecnología de punta, entregando una experiencia que va más allá del transporte — es un estilo de vida.',
    founded: '1909',
    origin: 'Japón',
    heroVideoId: '',
    slideImage: '/brand-slides/suzuki.jpg',
  },

  // ── HONDA ──────────────────────────────────────────────────────────────────
  // Rojo puro iconic. El sueño hecho realidad. Negro casi absoluto con alma roja.
  Honda: {
    primary: '#E60012',
    secondary: '#9A000C',
    bg: '#090101',
    glowRgb: '230, 0, 18',
    tagline: 'The Power of Dreams',
    description:
      'Honda es la marca de motos más vendida del mundo por una razón: confiabilidad sin compromisos. En Colombia, sus modelos han ganado la lealtad de generaciones enteras. Distribuidores autorizados en el Eje Cafetero.',
    founded: '1948',
    origin: 'Japón',
    heroVideoId: '',
    slideImage: '/brand-slides/honda.jpg',
  },

  // ── AKT ────────────────────────────────────────────────────────────────────
  // Naranja fuego colombiano. Hecha aquí, pensada para aquí. Negro cálido.
  AKT: {
    primary: '#FF4F00',
    secondary: '#C23B00',
    bg: '#0C0300',
    glowRgb: '255, 79, 0',
    tagline: 'Hecha en Colombia, para Colombia',
    description:
      'AKT es orgullo nacional. Diseñada para nuestras vías, nuestra cultura y nuestro bolsillo. Desde la primera aventura hasta la moto de trabajo diario, AKT tiene el modelo perfecto pensado para cada colombiano.',
    founded: '2005',
    origin: 'Colombia',
    heroVideoId: '',
    slideImage: '/brand-slides/akt.jpg',
  },

  // ── BAJAJ ──────────────────────────────────────────────────────────────────
  // Índigo Pulsar. ADN de pista, azul-morado agresivo. Negro casi violeta.
  Bajaj: {
    primary: '#3949AB',
    secondary: '#1A237E',
    bg: '#04040F',
    glowRgb: '57, 73, 171',
    tagline: 'Distinctly Ahead',
    description:
      'Bajaj Auto es el tercer fabricante de motocicletas más grande del mundo. Sus motos combinan diseño atrevido con ingeniería de alto rendimiento. La línea Pulsar redefine lo que significa andar en moto.',
    founded: '1945',
    origin: 'India',
    heroVideoId: '',
    slideImage: '/brand-slides/bajaj.jpg',
  },

  // ── HERO ───────────────────────────────────────────────────────────────────
  // Azul cielo vibrante. La marca #1 del mundo: confiable, fresca, accesible.
  Hero: {
    primary: '#0288D1',
    secondary: '#01579B',
    bg: '#01090F',
    glowRgb: '2, 136, 209',
    tagline: 'Future Is Here',
    description:
      'Hero MotoCorp es el fabricante de motocicletas número 1 en ventas globales. Tecnología innovadora, diseños modernos y una red de servicio robusta hacen de Hero la elección más inteligente del mercado.',
    founded: '1984',
    origin: 'India',
    heroVideoId: '',
    slideImage: '/brand-slides/hero.png',
  },

  // ── VENTO ──────────────────────────────────────────────────────────────────
  // Carmesí maduro. Energía latina sin límites. Rojo profundo, no rojo grito.
  Vento: {
    primary: '#C62828',
    secondary: '#7F0000',
    bg: '#0C0101',
    glowRgb: '198, 40, 40',
    tagline: 'Energía Sin Límites',
    description:
      'Vento trae al Eje Cafetero motos con diseño deportivo y precios accesibles. La combinación perfecta para quienes quieren presencia en la calle, rendimiento real y ahorro en cada kilómetro.',
    founded: '2001',
    origin: 'México',
    heroVideoId: '',
    slideImage: '/brand-slides/vento.jpg',
  },

  // ── GOOD KIDZ ──────────────────────────────────────────────────────────────
  // Verde fresco y natural. Los futuros grandes motociclistas empiezan aquí.
  'Good Kidz': {
    primary: '#43A047',
    secondary: '#1B5E20',
    bg: '#020A03',
    glowRgb: '67, 160, 71',
    tagline: 'El comienzo de la aventura',
    description:
      'Good Kidz introduce a los más pequeños del hogar al mundo de las dos ruedas de forma segura y divertida. Motos de pequeña cilindrada y eléctricas diseñadas para los futuros grandes motociclistas.',
    founded: '2015',
    origin: 'Colombia',
    heroVideoId: '',
    slideImage: '/brand-slides/goodkidz.jpg',
  },
};

export const DEFAULT_THEME: BrandTheme = {
  primary: '#d7263d',
  secondary: '#8B0000',
  bg: '#080808',
  glowRgb: '215, 38, 61',
  tagline: 'El placer en dos ruedas',
  description: '',
  founded: '',
  origin: '',
  heroVideoId: '',
  slideImage: '',
};

export function getBrandTheme(brandName: string): BrandTheme {
  return BRAND_THEMES[brandName] ?? DEFAULT_THEME;
}
