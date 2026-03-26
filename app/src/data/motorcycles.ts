import type { Motorcycle, Brand, Category, Testimonial, Service, Branch, SparePart } from '@/types';

export const brands: Brand[] = [
  { id: '1', name: 'Suzuki', logo: '/brands/Suzuki.png', slug: 'suzuki' },
  { id: '2', name: 'Vento', logo: '/brands/Vento.png', slug: 'vento' },
  { id: '3', name: 'Hero', logo: '/brands/Hero.png', slug: 'hero' },
  { id: '4', name: 'Honda', logo: '/brands/Honda.png', slug: 'honda' },
  { id: '5', name: 'Bajaj', logo: '/brands/Bajaj.png', slug: 'bajaj' },
  { id: '6', name: 'AKT', logo: '/brands/AKT.png', slug: 'akt' },
  { id: '7', name: 'Good Kidz', logo: '/brands/GoodKidz.png', slug: 'good-kidz' },
];

export const categories: Category[] = [
  { id: '1', name: 'Scooters', description: 'Ágil y económico', icon: 'Scooter', slug: 'scooters' },
  { id: '2', name: 'City', description: 'Perfecta para la ciudad', icon: 'Bike', slug: 'city' },
  { id: '3', name: 'Urban Sport', description: 'Estilo deportivo', icon: 'Zap', slug: 'urban-sport' },
  { id: '4', name: 'Rebels', description: 'Personalidad única', icon: 'Flame', slug: 'rebels' },
  { id: '5', name: 'Enduro', description: 'Todo terreno', icon: 'Mountain', slug: 'enduro' },
  { id: '6', name: 'Adventure', description: 'Larga distancia', icon: 'Compass', slug: 'adventure' },
  { id: '7', name: 'Eléctricas', description: 'Futuro sostenible', icon: 'Battery', slug: 'electricas' },
  { id: '8', name: 'Niños', description: 'Para los más pequeños', icon: 'Star', slug: 'ninos' },
];

export const motorcycles: Motorcycle[] = [
  {
    id: '1',
    brand: 'AKT',
    model: "125 CR4",
    year: 2026,
    price: 5190000,
    category: 'Enduro',
    description: "La AKT 125 CR4 es una moto enduro de entrada perfecta para quienes quieren iniciar en el mundo del todo terreno. Su motor de 125cc confiable, suspensión de largo recorrido y neumáticos anchos te llevan con seguridad por cualquier camino.",
    specifications: {
      engine: "124cc, 4 tiempos, monocilíndrico",
      power: "8.5 HP @ 7,500 RPM",
      torque: "9.1 Nm @ 5,500 RPM",
      transmission: "5 velocidades",
      weight: "119 kg",
      fuelCapacity: "6 litros",
    },
    images: ["/moto_images/125-cr4/descarga (3).png","/moto_images/125-cr4/descarga.png"],
    stock: 'available',
  },
  {
    id: '2',
    brand: 'AKT',
    model: "125 TTR CBS",
    year: 2026,
    price: 5390000,
    category: 'Enduro',
    description: "La AKT 125 TTR CBS combina el espíritu trail con la seguridad del sistema CBS. Diseñada para quienes buscan aventura en caminos destapados sin renunciar a la comodidad y la economía de una moto de 125cc.",
    specifications: {
      engine: "124cc, 4 tiempos, monocilíndrico",
      power: "8.8 HP @ 7,500 RPM",
      torque: "9.3 Nm @ 5,500 RPM",
      transmission: "5 velocidades",
      weight: "121 kg",
      fuelCapacity: "6 litros",
    },
    images: ["/moto_images/125-ttr-cbs/descarga (1).png","/moto_images/125-ttr-cbs/descarga.png"],
    stock: 'available',
  },
  {
    id: '3',
    brand: 'AKT',
    model: "150 CR4",
    year: 2026,
    price: 6190000,
    category: 'Enduro',
    description: "La AKT 150 CR4 sube un escalón en potencia con su motor de 150cc. Cuadro de acero resistente, guardabarros alto y suspensión robusta para que cada salida al campo sea una aventura sin límites.",
    specifications: {
      engine: "149cc, 4 tiempos, monocilíndrico",
      power: "11.5 HP @ 7,500 RPM",
      torque: "11.8 Nm @ 5,500 RPM",
      transmission: "5 velocidades",
      weight: "127 kg",
      fuelCapacity: "8 litros",
    },
    images: ["/moto_images/150-cr4/descarga (1).png","/moto_images/150-cr4/descarga.png"],
    stock: 'available',
  },
  {
    id: '4',
    brand: 'AKT',
    model: "200 CR4",
    year: 2026,
    price: 7490000,
    category: 'Enduro',
    description: "La AKT 200 CR4 es la máquina todo terreno del portafolio AKT. Con 200cc de potencia, suspensión de largo recorrido delantera y trasera, y frenos de disco, está lista para los senderos más exigentes del país.",
    specifications: {
      engine: "197cc, 4 tiempos, monocilíndrico",
      power: "14.5 HP @ 7,500 RPM",
      torque: "14.8 Nm @ 6,000 RPM",
      transmission: "5 velocidades",
      weight: "135 kg",
      fuelCapacity: "10 litros",
    },
    images: ["/moto_images/200-cr4/descarga (1).png","/moto_images/200-cr4/descarga (2).png","/moto_images/200-cr4/descarga.png"],
    stock: 'available',
  },
  {
    id: '5',
    brand: 'AKT',
    model: "200 TT ABS",
    year: 2026,
    price: 8490000,
    category: 'Enduro',
    description: "La AKT 200 TT ABS es la versión más segura de la familia trail con ABS de serie. Frenos de disco en ambas ruedas con control antibloqueo, suspensión de largo recorrido y motor 200cc SOHC para explorar con confianza.",
    specifications: {
      engine: "197cc, 4 tiempos, SOHC",
      power: "14.2 HP @ 7,500 RPM",
      torque: "14.5 Nm @ 6,000 RPM",
      transmission: "5 velocidades",
      weight: "138 kg",
      fuelCapacity: "10 litros",
    },
    images: ["/moto_images/200-tt-abs/descarga (1).png","/moto_images/200-tt-abs/descarga (2).png","/moto_images/200-tt-abs/descarga.png"],
    stock: 'available',
  },
  {
    id: '6',
    brand: 'AKT',
    model: "110 NV CBS",
    year: 2026,
    price: 3990000,
    category: 'City',
    description: "La AKT 110 NV CBS es la moto de trabajo por excelencia. Económica, resistente y con sistema CBS para mayor seguridad en los frenos. Su motor de 110cc ofrece el consumo más bajo de la categoría, ideal para recorridos largos en la ciudad.",
    specifications: {
      engine: "109.7cc, 4 tiempos, monocilíndrico",
      power: "8 HP @ 7,000 RPM",
      torque: "8.8 Nm @ 5,000 RPM",
      transmission: "4 velocidades",
      weight: "108 kg",
      fuelCapacity: "9.5 litros",
    },
    images: ["/moto_images/ak-110-nv-cbs/descarga (1).png","/moto_images/ak-110-nv-cbs/descarga (2).png","/moto_images/ak-110-nv-cbs/descarga.png"],
    stock: 'available',
  },
  {
    id: '7',
    brand: 'AKT',
    model: "125 CHR CBS",
    year: 2026,
    price: 5490000,
    category: 'Urban Sport',
    description: "La AKT 125 CHR CBS es una naked urbana con carácter propio. Su diseño agresivo, motor de 125cc con CBS y posición de manejo deportiva la convierten en la opción ideal para los jóvenes que quieren destacar en la ciudad.",
    specifications: {
      engine: "124.8cc, 4 tiempos, SOHC",
      power: "9.4 HP @ 7,500 RPM",
      torque: "9.5 Nm @ 6,000 RPM",
      transmission: "5 velocidades",
      weight: "118 kg",
      fuelCapacity: "9 litros",
    },
    images: ["/moto_images/ak125chr-cbs/descarga (1).png","/moto_images/ak125chr-cbs/descarga (2).png","/moto_images/ak125chr-cbs/descarga.png"],
    stock: 'available',
  },
  {
    id: '8',
    brand: 'AKT',
    model: "125 NKD CBS",
    year: 2026,
    price: 5690000,
    category: 'Urban Sport',
    description: "La AKT 125 NKD CBS es la naked más popular de Colombia. Diseño moderno, farola LED, cuadro de doble cuna reforzado y sistema CBS para un frenado seguro. La combinación perfecta de estilo, practicidad y economía para la ciudad.",
    specifications: {
      engine: "124.8cc, 4 tiempos, SOHC",
      power: "9.4 HP @ 7,500 RPM",
      torque: "9.5 Nm @ 6,000 RPM",
      transmission: "5 velocidades",
      weight: "116 kg",
      fuelCapacity: "9 litros",
      colors: ["Blanco","Negro"],
    },
    imagesByColor: {
          "Blanco": [
                "/moto_images/ak125nkd-cbs/n blanca.png"
          ],
          "Negro": [
                "/moto_images/ak125nkd-cbs/negro brillante.png",
                "/moto_images/ak125nkd-cbs/nkd negra.png"
          ]
    },
    images: ["/moto_images/ak125nkd-cbs/descarga.png"],
    featured: true,
    stock: 'available',
  },
  {
    id: '9',
    brand: 'AKT',
    model: "125 NKD CBS Clásica V3",
    year: 2027,
    price: 5890000,
    category: 'Urban Sport',
    description: "La AKT 125 NKD CBS Clásica V3 es la edición 2027 con acabados premium. Nuevos colores exclusivos, detalles renovados en el carenado y el mismo motor confiable de 125cc con sistema CBS que la ha hecho la naked más vendida del mercado colombiano.",
    specifications: {
      engine: "124.8cc, 4 tiempos, SOHC",
      power: "9.4 HP @ 7,500 RPM",
      torque: "9.5 Nm @ 6,000 RPM",
      transmission: "5 velocidades",
      weight: "116 kg",
      fuelCapacity: "9 litros",
    },
    images: ["/moto_images/ak125nkd-cbs-clas-v3-27-pt/descarga.png"],
    stock: 'available',
  },
  {
    id: '10',
    brand: 'AKT',
    model: "125 NKD CBS FP",
    year: 2027,
    price: 5990000,
    category: 'Urban Sport',
    description: "La AKT 125 NKD CBS FP trae acabados Full Premium para el modelo 2027. Llantas de perfil bajo, tablero digital completo y la misma mecánica probada en miles de kilómetros por las calles colombianas. Una naked lista para el futuro.",
    specifications: {
      engine: "124.8cc, 4 tiempos, SOHC",
      power: "9.4 HP @ 7,500 RPM",
      torque: "9.5 Nm @ 6,000 RPM",
      transmission: "5 velocidades",
      weight: "116 kg",
      fuelCapacity: "9 litros",
    },
    images: ["/moto_images/ak125nkd-cbs-fp-27-pt/descarga (1).png"],
    stock: 'available',
  },
  {
    id: '11',
    brand: 'AKT',
    model: "250 R",
    year: 2026,
    price: 10990000,
    category: 'Urban Sport',
    description: "La AKT 250 R es la naked más poderosa de la marca colombiana. Motor de 250cc monocilíndrico, frenos de disco doble y diseño agresivo que la posiciona como competidora directa de importadas. Más potencia, más estilo, mismo precio accesible.",
    specifications: {
      engine: "249cc, 4 tiempos, SOHC",
      power: "21 HP @ 8,500 RPM",
      torque: "20.5 Nm @ 6,500 RPM",
      transmission: "5 velocidades",
      weight: "148 kg",
      fuelCapacity: "14 litros",
    },
    images: ["/moto_images/akt-250-r/descarga (3).png","/moto_images/akt-250-r/descarga.png"],
    featured: true,
    stock: 'available',
  },
  {
    id: '12',
    brand: 'AKT',
    model: "Dinamic RX 150",
    year: 2026,
    price: 6490000,
    category: 'City',
    description: "La AKT Dinamic RX 150 es la moto de trabajo más dinámica del mercado. Con motor de 150cc, freno de disco delantero y diseño deportivo, es la opción perfecta para domiciliarios, mensajeros y quienes necesitan moverse rápido y seguro en la ciudad.",
    specifications: {
      engine: "149cc, 4 tiempos, monocilíndrico",
      power: "11.8 HP @ 7,500 RPM",
      torque: "12 Nm @ 5,500 RPM",
      transmission: "5 velocidades",
      weight: "128 kg",
      fuelCapacity: "12 litros",
    },
    images: ["/moto_images/dinamic-rx-150/descarga (1).png","/moto_images/dinamic-rx-150/descarga (3).png","/moto_images/dinamic-rx-150/descarga.png"],
    stock: 'available',
  },
  {
    id: '13',
    brand: 'AKT',
    model: "DR 150 ABS",
    year: 2026,
    price: 7190000,
    category: 'Enduro',
    description: "La AKT DR 150 ABS es la moto de aventura urbana con frenos ABS de serie. Su diseño dual sport te lleva por la ciudad y el campo con igual destreza. Motor de 150cc, neumáticos mixtos y posición de manejo erguida para mayor control en todo terreno.",
    specifications: {
      engine: "149cc, 4 tiempos, SOHC",
      power: "12.5 HP @ 7,500 RPM",
      torque: "12.5 Nm @ 5,500 RPM",
      transmission: "5 velocidades",
      weight: "132 kg",
      fuelCapacity: "10 litros",
      colors: ["Amarillo","Blanco","Gris","Negro"],
    },
    imagesByColor: {
          "Amarillo": [
                "/moto_images/dr-150-abs/DR-150-AMARILLA-1385x800_0.png"
          ],
          "Blanco": [
                "/moto_images/dr-150-abs/DR-150-BLANCA-1385x800.png"
          ],
          "Gris": [
                "/moto_images/dr-150-abs/DR-150-GRIS-1385x800.png"
          ],
          "Negro": [
                "/moto_images/dr-150-abs/DR-150-NEGRA-1385x800.png"
          ]
    },
    images: ["/moto_images/dr-150-abs/DR-150-AMARILLA-1385x800_0.png"],
    stock: 'available',
  },
  {
    id: '14',
    brand: 'AKT',
    model: "DR 150 FI ABS",
    year: 2026,
    price: 7590000,
    category: 'Enduro',
    description: "La AKT DR 150 FI ABS da el siguiente paso con inyección electrónica de combustible. Mayor eficiencia en consumo, arranque fácil a cualquier temperatura y frenos ABS para la máxima seguridad. La dual sport más completa del segmento 150cc en Colombia.",
    specifications: {
      engine: "149cc, 4 tiempos, FI (inyección electrónica)",
      power: "13 HP @ 8,000 RPM",
      torque: "12.8 Nm @ 6,000 RPM",
      transmission: "5 velocidades",
      weight: "134 kg",
      fuelCapacity: "10 litros",
      colors: ["Amarillo","Azul","Negro","Rojo"],
    },
    imagesByColor: {
          "Amarillo": [
                "/moto_images/dr-150-fi-abs/DR-150-FI-ABS-AMARILLA-2-1.png"
          ],
          "Azul": [
                "/moto_images/dr-150-fi-abs/DR-AZUL-1385x800-1.png"
          ],
          "Negro": [
                "/moto_images/dr-150-fi-abs/DR-NEGRA-1385x800-1.png"
          ],
          "Rojo": [
                "/moto_images/dr-150-fi-abs/DR-ROJA-1385x800-1.png"
          ]
    },
    images: ["/moto_images/dr-150-fi-abs/DR-150-FI-ABS-AMARILLA-2-1.png"],
    stock: 'available',
  },
  {
    id: '15',
    brand: 'AKT',
    model: "DR Z4S",
    year: 2026,
    price: 11990000,
    category: 'Enduro',
    description: "La AKT DR Z4S es la moto enduro 250cc más completa de la marca. Suspensión invertida de competencia, frenos de disco con pinzas de 2 pistones, motor 250cc con inyección y ABS. Para los que lo quieren todo en una sola máquina.",
    specifications: {
      engine: "249cc, 4 tiempos, FI (inyección electrónica)",
      power: "22 HP @ 8,500 RPM",
      torque: "21 Nm @ 7,000 RPM",
      transmission: "5 velocidades",
      weight: "150 kg",
      fuelCapacity: "12 litros",
      colors: ["Amarillo"],
    },
    imagesByColor: {
          "Amarillo": [
                "/moto_images/dr-z4s/DR-Z4S-AMARILLA (1).png",
                "/moto_images/dr-z4s/DR-Z4S-AMARILLA.png"
          ]
    },
    images: ["/moto_images/dr-z4s/DR-Z4S-AMARILLA (1).png"],
    stock: 'available',
  },
  {
    id: '16',
    brand: 'AKT',
    model: "DR Z4SM",
    year: 2026,
    price: 12490000,
    category: 'Enduro',
    description: "La AKT DR Z4SM es la versión supermoto del DR Z4. Llantas de perfil bajo de supermoto, suspensión de mayor firmeza y geometría ajustada para el asfalto. La diversión del enduro con el comportamiento de una deportiva en carretera.",
    specifications: {
      engine: "249cc, 4 tiempos, FI (inyección electrónica)",
      power: "22 HP @ 8,500 RPM",
      torque: "21 Nm @ 7,000 RPM",
      transmission: "5 velocidades",
      weight: "148 kg",
      fuelCapacity: "12 litros",
      colors: ["Azul","Blanco"],
    },
    imagesByColor: {
          "Azul": [
                "/moto_images/dr-z4sm/DR-Z4SM-AZUL.png"
          ],
          "Blanco": [
                "/moto_images/dr-z4sm/DR-Z4SM-BLANCA.png"
          ]
    },
    images: ["/moto_images/dr-z4sm/DR-Z4SM-AZUL.png"],
    stock: 'available',
  },
  {
    id: '17',
    brand: 'AKT',
    model: "Dynamic Pro",
    year: 2026,
    price: 6290000,
    category: 'City',
    description: "La AKT Dynamic Pro está diseñada para el trabajo pesado en la ciudad. Su motor de 150cc robusto y fácil de mantener, chasis resistente y tanque de gran capacidad la convierten en la moto de carga y trabajo más solicitada del Eje Cafetero.",
    specifications: {
      engine: "149cc, 4 tiempos, monocilíndrico",
      power: "11.5 HP @ 7,500 RPM",
      torque: "11.8 Nm @ 5,500 RPM",
      transmission: "5 velocidades",
      weight: "126 kg",
      fuelCapacity: "13 litros",
    },
    images: ["/moto_images/dynamic-pro/descarga (1).png","/moto_images/dynamic-pro/descarga (2).png","/moto_images/dynamic-pro/descarga.png"],
    stock: 'available',
  },
  {
    id: '18',
    brand: 'AKT',
    model: "Flex CBS",
    year: 2026,
    price: 5990000,
    category: 'City',
    description: "La AKT Flex CBS ofrece la versatilidad que el ciclista colombiano necesita. Compatible con gasolina corriente y extra, sistema CBS para frenos más seguros y motor de 150cc para una potencia equilibrada. La flexibilidad hecha moto.",
    specifications: {
      engine: "149cc, 4 tiempos, monocilíndrico",
      power: "11 HP @ 7,500 RPM",
      torque: "11.5 Nm @ 5,500 RPM",
      transmission: "5 velocidades",
      weight: "124 kg",
      fuelCapacity: "12 litros",
    },
    images: ["/moto_images/flex-cbs/descarga (1).png","/moto_images/flex-cbs/descarga (3).png","/moto_images/flex-cbs/descarga.png"],
    stock: 'available',
  },
  {
    id: '19',
    brand: 'AKT',
    model: "TT200 ABS Rally",
    year: 2026,
    price: 9190000,
    category: 'Enduro',
    description: "La AKT TT200 ABS Rally está inspirada en el mundo del rally. Diseño de competencia, motor 200cc con ABS, guardabarros alto estilo rally y coloración exclusiva deportiva. Para los que sueñan con el Dakar sin salir de Colombia.",
    specifications: {
      engine: "197cc, 4 tiempos, SOHC",
      power: "14.5 HP @ 7,500 RPM",
      torque: "14.8 Nm @ 6,000 RPM",
      transmission: "5 velocidades",
      weight: "136 kg",
      fuelCapacity: "10 litros",
    },
    images: ["/moto_images/tt200-abs-rally/descarga (3).png"],
    stock: 'available',
  },
  {
    id: '20',
    brand: 'AKT',
    model: "Vivar Cool EIII",
    year: 2026,
    price: 4490000,
    category: 'Scooters',
    description: "La AKT Vivar Cool EIII es el scooter económico ideal para la ciudad. Diseño moderno con maletero bajo el asiento, motor de 109cc suave y eficiente, cumple con normas Euro III para mayor respeto al medio ambiente. El compañero ideal para el uso diario.",
    specifications: {
      engine: "109.7cc, 4 tiempos, monocilíndrico",
      power: "7.8 HP @ 7,500 RPM",
      torque: "8.5 Nm @ 5,500 RPM",
      transmission: "Automática (CVT)",
      weight: "95 kg",
      fuelCapacity: "5.5 litros",
      colors: ["Blanco","Negro"],
    },
    imagesByColor: {
          "Blanco": [
                "/moto_images/vivar-cool-eiii/VIVAR COOL EIII blanca.png"
          ],
          "Negro": [
                "/moto_images/vivar-cool-eiii/VIVAR COOL EIII negra.png"
          ]
    },
    images: ["/moto_images/vivar-cool-eiii/VIVAR COOL EIII blanca.png"],
    stock: 'available',
  },
  {
    id: '21',
    brand: 'Suzuki',
    model: "Address",
    year: 2026,
    price: 5490000,
    category: 'Scooters',
    description: "La Suzuki Address es el scooter urbano más eficiente de la gama. Con motor de 110cc de inyección electrónica, bajo consumo y diseño compacto, es la solución perfecta para moverse por la ciudad ahorrando combustible. Ligero, ágil y muy fácil de estacionar.",
    specifications: {
      engine: "110cc, 4 tiempos, inyección electrónica",
      power: "8.7 HP @ 8,000 RPM",
      torque: "9 Nm @ 6,000 RPM",
      transmission: "Automática (CVT)",
      weight: "93 kg",
      fuelCapacity: "5.2 litros",
      colors: ["Negro","Blanco","Plateado"],
    },
    imagesByColor: {
          "Negro": [
                "/moto_images/address/ADDRESS-NEGRA.png"
          ],
          "Blanco": [
                "/moto_images/address/ADRESS-BLANCA.png"
          ],
          "Plateado": [
                "/moto_images/address/ADRESS-PLATEADA.png"
          ]
    },
    images: ["/moto_images/address/ADDRESS-NEGRA.png"],
    stock: 'available',
  },
  {
    id: '22',
    brand: 'Suzuki',
    model: "Avenis",
    year: 2026,
    price: 7490000,
    category: 'Scooters',
    description: "La Suzuki Avenis es el scooter de nueva generación con alma deportiva. Motor de 125cc con inyección, tablero digital full color, LED en todos los puntos de iluminación y diseño aerodinámico moderno. El scooter que redefine el estilo urbano.",
    specifications: {
      engine: "124cc, 4 tiempos, inyección electrónica",
      power: "8.7 HP @ 6,500 RPM",
      torque: "10 Nm @ 5,000 RPM",
      transmission: "Automática (CVT)",
      weight: "104 kg",
      fuelCapacity: "5.2 litros",
      colors: ["Amarillo","Blanco","Dorado","Negro"],
    },
    imagesByColor: {
          "Amarillo": [
                "/moto_images/avenis/AVENIS AMARILLA.png"
          ],
          "Blanco": [
                "/moto_images/avenis/AVENIS BLANCA.png"
          ],
          "Dorado": [
                "/moto_images/avenis/AVENIS DORADO.png"
          ],
          "Negro": [
                "/moto_images/avenis/AVENIS NEGRA.png"
          ]
    },
    images: ["/moto_images/avenis/AVENIS AMARILLA.png"],
    stock: 'available',
  },
  {
    id: '23',
    brand: 'Suzuki',
    model: "AX4 EIII",
    year: 2026,
    price: 5490000,
    category: 'City',
    description: "La Suzuki AX4 EIII es la moto de trabajo confiable que ha ganado la fidelidad de miles de colombianos. Motor de 110cc probado en millones de kilómetros, bajo mantenimiento y gran durabilidad. La Suzuki para quienes exigen lo mejor en economía y resistencia.",
    specifications: {
      engine: "110cc, 4 tiempos, monocilíndrico",
      power: "8.5 HP @ 7,500 RPM",
      torque: "9 Nm @ 5,000 RPM",
      transmission: "4 velocidades",
      weight: "107 kg",
      fuelCapacity: "10 litros",
      colors: ["Azul","Negro","Rojo"],
    },
    imagesByColor: {
          "Azul": [
                "/moto_images/ax4-eiii/ax4 azul.png"
          ],
          "Negro": [
                "/moto_images/ax4-eiii/ax4 negra.png"
          ],
          "Rojo": [
                "/moto_images/ax4-eiii/ax4 roja.png"
          ]
    },
    images: ["/moto_images/ax4-eiii/ax4 azul.png"],
    stock: 'available',
  },
  {
    id: '24',
    brand: 'Suzuki',
    model: "AX4 ABS",
    year: 2026,
    price: 6990000,
    category: 'City',
    description: "La Suzuki AX4 ABS suma tecnología ABS al clásico de trabajo más querido de Colombia. Frenos más seguros en cualquier superficie, motor 110cc con inyección electrónica y diseño renovado. La evolución natural de la moto de trabajo más vendida del Eje.",
    specifications: {
      engine: "110cc, 4 tiempos, inyección electrónica",
      power: "8.7 HP @ 7,500 RPM",
      torque: "9.2 Nm @ 5,500 RPM",
      transmission: "4 velocidades",
      weight: "110 kg",
      fuelCapacity: "10 litros",
      colors: ["Azul","Blanco","Negro"],
    },
    imagesByColor: {
          "Azul": [
                "/moto_images/ax4-abs/AX4 ABS AZUL.png"
          ],
          "Blanco": [
                "/moto_images/ax4-abs/AX4 ABS BLANCA.png"
          ],
          "Negro": [
                "/moto_images/ax4-abs/AX4 ABS NEGRA.png"
          ]
    },
    images: ["/moto_images/ax4-abs/AX4 ABS AZUL.png"],
    stock: 'available',
  },
  {
    id: '25',
    brand: 'Suzuki',
    model: "BEST 125 FI",
    year: 2026,
    price: 5290000,
    category: 'City',
    description: "La Suzuki BEST 125 FI ofrece lo mejor de dos mundos: la confiabilidad legendaria de Suzuki con motor de inyección electrónica de 125cc. Freno de disco delantero, tablero digital y excelente consumo de combustible. La mejor opción en su segmento.",
    specifications: {
      engine: "124cc, 4 tiempos, FI (inyección electrónica)",
      power: "10.3 HP @ 8,000 RPM",
      torque: "10.5 Nm @ 5,500 RPM",
      transmission: "5 velocidades",
      weight: "115 kg",
      fuelCapacity: "10 litros",
      colors: ["Negro","Rojo"],
    },
    imagesByColor: {
          "Negro": [
                "/moto_images/best-125-fi/SUZUKI-NEW-BEST-125-NEGRA-min.png"
          ],
          "Rojo": [
                "/moto_images/best-125-fi/SUZUKI-NEW-BEST-125-ROJA-min.png"
          ]
    },
    images: ["/moto_images/best-125-fi/SUZUKI-NEW-BEST-125-NEGRA-min.png"],
    stock: 'available',
  },
  {
    id: '26',
    brand: 'Suzuki',
    model: "Burgman 200 FI",
    year: 2026,
    price: 14990000,
    category: 'Scooters',
    description: "La Suzuki Burgman 200 FI es el maxi-scooter premium de la gama. Motor de 200cc con inyección electrónica, gran espacio de almacenamiento, asiento amplio para dos y tecnología ABS. El lujo y la comodidad de un scooter ejecutivo al estilo Suzuki.",
    specifications: {
      engine: "199cc, 4 tiempos, inyección electrónica",
      power: "18.7 HP @ 7,500 RPM",
      torque: "18.5 Nm @ 5,500 RPM",
      transmission: "Automática (CVT)",
      weight: "175 kg",
      fuelCapacity: "12.5 litros",
      colors: ["Blanco","Dorado","Gris","Negro","Verde"],
    },
    imagesByColor: {
          "Blanco": [
                "/moto_images/burgman-fi/BURGMAN BLANCA.png"
          ],
          "Dorado": [
                "/moto_images/burgman-fi/BURGMAN DORADA.png"
          ],
          "Gris": [
                "/moto_images/burgman-fi/BURGMAN GRIS.png"
          ],
          "Negro": [
                "/moto_images/burgman-fi/BURGMAN NEGRA (1).png"
          ],
          "Verde": [
                "/moto_images/burgman-fi/BURGMAN VERDE.png"
          ]
    },
    images: ["/moto_images/burgman-fi/BURGMAN BLANCA.png"],
    featured: true,
    stock: 'available',
  },
  {
    id: '27',
    brand: 'Suzuki',
    model: "V-Strom 650 XT",
    year: 2026,
    price: 38990000,
    category: 'Adventure',
    description: "La Suzuki V-Strom 650 XT es la aventurera mediana más equilibrada del mundo. Motor V-Twin de 645cc, suspensión de larga distancia, guardabarros tipo pico de pájaro y modos de conducción para asfalto y off-road. El viaje largo que siempre soñaste, hoy es posible.",
    specifications: {
      engine: "645cc, V-Twin, DOHC, inyección electrónica",
      power: "71 HP @ 8,800 RPM",
      torque: "62 Nm @ 6,500 RPM",
      transmission: "6 velocidades",
      weight: "216 kg",
      fuelCapacity: "20 litros",
      colors: ["Negro","Azul","Amarillo"],
    },
    imagesByColor: {
          "Negro": [
                "/moto_images/dl650xt/V-STROM-DL650-BLK.jpg"
          ],
          "Azul": [
                "/moto_images/dl650xt/V-STROM-DL650-BLU.jpg"
          ],
          "Amarillo": [
                "/moto_images/dl650xt/V-STROM-DL650-YELLOW.jpg"
          ]
    },
    images: ["/moto_images/dl650xt/V-STROM-DL650-BLK.jpg"],
    featured: true,
    stock: 'order',
    videoUrl: 'https://www.youtube.com/embed/L7YXsyS9XqE?autoplay=0&rel=0',
  },
  {
    id: '28',
    brand: 'Suzuki',
    model: "Gixxer 250",
    year: 2026,
    price: 15880000,
    category: 'Urban Sport',
    description: "La Suzuki Gixxer 250 lleva el espíritu deportivo de las GSX-R a un formato accesible. Motor de 249cc con tecnología SOCS, frenos de disco doble con ABS y diseño inspirado en las motos de circuito. La puerta de entrada al mundo de las deportivas Suzuki.",
    specifications: {
      engine: "249cc, 4 tiempos, SOCS, inyección electrónica",
      power: "26.5 HP @ 9,300 RPM",
      torque: "22.2 Nm @ 7,300 RPM",
      transmission: "6 velocidades",
      weight: "156 kg",
      fuelCapacity: "12 litros",
      colors: ["Azul","Blanco","Negro"],
    },
    imagesByColor: {
          "Azul": [
                "/moto_images/gixxer-250/GIXXER-250-AZUL-2026_0.png"
          ],
          "Blanco": [
                "/moto_images/gixxer-250/GIXXER-250-BLANCA--2026_0_0_0.png"
          ],
          "Negro": [
                "/moto_images/gixxer-250/GIXXER-250-NEGRA-BRILLANTE.png"
          ]
    },
    images: ["/moto_images/gixxer-250/GIXXER-250-AZUL-2026_0.png"],
    featured: true,
    stock: 'available',
    videoUrl: 'https://www.youtube.com/embed/5MVZJG2QABQ?autoplay=0&rel=0',
  },
  {
    id: '29',
    brand: 'Suzuki',
    model: "Gixxer FI 150 ABS",
    year: 2026,
    price: 9490000,
    category: 'Urban Sport',
    description: "La Suzuki Gixxer FI 150 ABS es la naked deportiva más popular del segmento 150. Con inyección electrónica, ABS de serie y diseño Gixxer de alto impacto, ofrece rendimiento deportivo real con el consumo de una 150cc. Manejo ágil en ciudad y carretera.",
    specifications: {
      engine: "154.9cc, 4 tiempos, inyección electrónica",
      power: "14.8 HP @ 8,000 RPM",
      torque: "14 Nm @ 6,000 RPM",
      transmission: "5 velocidades",
      weight: "135 kg",
      fuelCapacity: "12 litros",
      colors: ["Negro","Rojo","Azul"],
    },
    imagesByColor: {
          "Negro": [
                "/moto_images/gixxer-fi-150-abs/GIXXER-150 FI ABS-NEGRA-2026.png"
          ],
          "Rojo": [
                "/moto_images/gixxer-fi-150-abs/GIXXER-150 FI ABS-ROJA-2026.png"
          ],
          "Azul": [
                "/moto_images/gixxer-fi-150-abs/GIXXER-150-FI-ABS-AZUL-2027.png"
          ]
    },
    images: ["/moto_images/gixxer-fi-150-abs/GIXXER-150 FI ABS-NEGRA-2026.png"],
    stock: 'available',
  },
  {
    id: '30',
    brand: 'Suzuki',
    model: "Gixxer SF 250",
    year: 2026,
    price: 17490000,
    category: 'Urban Sport',
    description: "La Suzuki Gixxer SF 250 es la versión full-fairing del Gixxer 250. Carenado deportivo completo inspirado en la GSX-R, ABS de serie, motor de 249cc con 26.5 HP y posición semi-carenada. La deportiva 250 más elegante del mercado colombiano.",
    specifications: {
      engine: "249cc, 4 tiempos, SOCS, inyección electrónica",
      power: "26.5 HP @ 9,300 RPM",
      torque: "22.2 Nm @ 7,300 RPM",
      transmission: "6 velocidades",
      weight: "161 kg",
      fuelCapacity: "12 litros",
      colors: ["Blanco/Azul","Negro"],
    },
    imagesByColor: {
          "Blanco/Azul": [
                "/moto_images/gixxer-sf-250/GIXXER-SF-250-BLANCA-AZUL (1).png",
                "/moto_images/gixxer-sf-250/GIXXER-SF-250-BLANCA-AZUL.png"
          ],
          "Negro": [
                "/moto_images/gixxer-sf-250/GIXXER-SF-250-NEGRA-2026 (1).png"
          ]
    },
    images: ["/moto_images/gixxer-sf-250/GIXXER-SF-250-BLANCA-AZUL (1).png"],
    featured: true,
    stock: 'available',
  },
  {
    id: '31',
    brand: 'Suzuki',
    model: "Gixxer SF FI 150 ABS",
    year: 2026,
    price: 10990000,
    category: 'Urban Sport',
    description: "La Suzuki Gixxer SF FI 150 ABS lleva el carenado deportivo completo al segmento 150cc. Motor con inyección electrónica, ABS y diseño full-fairing deportivo que imita las grandes. Para los que quieren el look de una deportiva de gran cilindrada con el bolsillo de una 150.",
    specifications: {
      engine: "154.9cc, 4 tiempos, inyección electrónica",
      power: "14.8 HP @ 8,000 RPM",
      torque: "14 Nm @ 6,000 RPM",
      transmission: "5 velocidades",
      weight: "139 kg",
      fuelCapacity: "12 litros",
      colors: ["Azul","Gris","Negro"],
    },
    imagesByColor: {
          "Azul": [
                "/moto_images/gixxer-sf-fi-150-abs/GIXXER--SF-150-FI-ABS-AZUL.png"
          ],
          "Gris": [
                "/moto_images/gixxer-sf-fi-150-abs/GIXXER-SF-150-GRIS-.png"
          ],
          "Negro": [
                "/moto_images/gixxer-sf-fi-150-abs/GIXXER-SF-150-NEGRA.png"
          ]
    },
    images: ["/moto_images/gixxer-sf-fi-150-abs/GIXXER--SF-150-FI-ABS-AZUL.png"],
    stock: 'available',
  },
  {
    id: '32',
    brand: 'Suzuki',
    model: "GN125 ABS",
    year: 2026,
    price: 7399000,
    category: 'City',
    description: "La Suzuki GN125 ABS es el clásico de trabajo con tecnología moderna. Motor de 124cc con inyección electrónica, sistema ABS para mayor seguridad al frenar y tablero digital completo. La evolución de la GN más querida de Colombia, ahora más segura que nunca.",
    specifications: {
      engine: "124cc, 4 tiempos, OHC, inyección electrónica",
      power: "11.4 HP @ 8,500 RPM",
      torque: "10.2 Nm @ 6,500 RPM",
      transmission: "5 velocidades",
      weight: "112 kg",
      fuelCapacity: "10 litros",
      colors: ["Azul/Negro","Negro","Rojo/Negro"],
    },
    imagesByColor: {
          "Azul/Negro": [
                "/moto_images/gn125-abs/GN125 ABS AZUL-NEGRO.png"
          ],
          "Negro": [
                "/moto_images/gn125-abs/GN125 ABS NARANJA - NEGRO.png",
                "/moto_images/gn125-abs/GN125 ABS NEGRA.png"
          ],
          "Rojo/Negro": [
                "/moto_images/gn125-abs/GN125 ABS ROJO-NEGRO.png"
          ]
    },
    images: ["/moto_images/gn125-abs/GN125 ABS AZUL-NEGRO.png"],
    stock: 'available',
  },
  {
    id: '33',
    brand: 'Suzuki',
    model: "GN125 EIII",
    year: 2026,
    price: 5490000,
    category: 'City',
    description: "La Suzuki GN125 EIII es la versión clásica de la moto de trabajo más reconocida. Motor de 124cc confiable, cumple normas Euro III, mantenimiento económico y piezas disponibles en todo el país. La fidelidad a la GN en su versión más accesible.",
    specifications: {
      engine: "124cc, 4 tiempos, OHC, carburador Euro III",
      power: "10.5 HP @ 8,000 RPM",
      torque: "9.8 Nm @ 6,000 RPM",
      transmission: "5 velocidades",
      weight: "110 kg",
      fuelCapacity: "10 litros",
      colors: ["Azul","Negro","Rojo"],
    },
    imagesByColor: {
          "Azul": [
                "/moto_images/suzuki-gn125-eiii/GN125 EIII AZUL.png"
          ],
          "Negro": [
                "/moto_images/suzuki-gn125-eiii/GN125 EIII NEGRA.png"
          ],
          "Rojo": [
                "/moto_images/suzuki-gn125-eiii/GN125 EIII ROJA.png"
          ]
    },
    images: ["/moto_images/suzuki-gn125-eiii/GN125 EIII AZUL.png"],
    stock: 'available',
  },
  {
    id: '34',
    brand: 'Suzuki',
    model: "GSX-8R",
    year: 2026,
    price: 35990000,
    category: 'Urban Sport',
    description: "La Suzuki GSX-8R es la supersport de mediana cilindrada que más emociones ofrece. Motor bicilíndrico paralelo de 776cc con 83 HP, control de tracción, modos de conducción y frenos Brembo. La evolución deportiva para quienes exigen más de cada curva.",
    specifications: {
      engine: "776cc, bicilíndrico paralelo, DOHC, inyección electrónica",
      power: "83 HP @ 8,500 RPM",
      torque: "78 Nm @ 6,800 RPM",
      transmission: "6 velocidades",
      weight: "203 kg",
      fuelCapacity: "14 litros",
      colors: ["Blanco","Naranja","Negro"],
    },
    imagesByColor: {
          "Blanco": [
                "/moto_images/gsx-8r/GSX-8R-BLANCA_0.png"
          ],
          "Naranja": [
                "/moto_images/gsx-8r/GSX-8R-NARANJA.png"
          ],
          "Negro": [
                "/moto_images/gsx-8r/GSX-8R-NEGRA_0.png"
          ]
    },
    images: ["/moto_images/gsx-8r/GSX-8R-BLANCA_0.png"],
    featured: true,
    stock: 'order',
  },
  {
    id: '35',
    brand: 'Suzuki',
    model: "GSX-8S",
    year: 2026,
    price: 35490000,
    category: 'Urban Sport',
    description: "La Suzuki GSX-8S es la naked que complementa la familia GSX-8. Mismo motor de 776cc del GSX-8R en configuración naked, con manillar alto para mayor comodidad y agilidad urbana sin sacrificar el rendimiento en autopista. El poder sin el carenado.",
    specifications: {
      engine: "776cc, bicilíndrico paralelo, DOHC, inyección electrónica",
      power: "83 HP @ 8,500 RPM",
      torque: "78 Nm @ 6,800 RPM",
      transmission: "6 velocidades",
      weight: "203 kg",
      fuelCapacity: "14 litros",
      colors: ["Negro","Azul"],
    },
    imagesByColor: {
          "Negro": [
                "/moto_images/gsx-8s/8S--NEGRA-ROJA-1385x800.png"
          ],
          "Azul": [
                "/moto_images/gsx-8s/8S-AZUL-1385x800.png"
          ]
    },
    images: ["/moto_images/gsx-8s/GSX-8S.png"],
    stock: 'order',
  },
  {
    id: '36',
    brand: 'Suzuki',
    model: "GSX-R1000R",
    year: 2026,
    price: 79990000,
    category: 'Urban Sport',
    description: "La Suzuki GSX-R1000R es la reina de la gama. Tecnología directa de MotoGP: Variable Valve Timing, Launch Control, Quick Shift bidireccional y control de tracción IMU de 6 ejes. 202 HP en un chasis de 203 kg. La superbike definitiva de Suzuki.",
    specifications: {
      engine: "999.8cc, 4 cilindros en línea, DOHC, inyección Suzuki Dual Injection",
      power: "202 HP @ 13,200 RPM",
      torque: "117.6 Nm @ 10,800 RPM",
      transmission: "6 velocidades",
      weight: "203 kg",
      fuelCapacity: "16 litros",
      colors: ["Azul"],
    },
    imagesByColor: {
          "Azul": [
                "/moto_images/gsx-r1000r/GSX R1000R AZUL.png"
          ]
    },
    images: ["/moto_images/gsx-r1000r/GSX R1000R AZUL.png"],
    featured: true,
    stock: 'order',
  },
  {
    id: '37',
    brand: 'Suzuki',
    model: "GSX-R150 ABS",
    year: 2026,
    price: 14990000,
    category: 'Urban Sport',
    description: "La Suzuki GSX-R150 ABS hereda el ADN de la familia GSX-R en formato 150cc. Motor DOHC de 147cc, carenado deportivo de doble faro LED, frenos de disco con ABS y chasis de aluminio. La manejabilidad de una deportiva de circuito en el paquete más accesible.",
    specifications: {
      engine: "147.3cc, 4 tiempos, DOHC, inyección electrónica",
      power: "18.9 HP @ 10,500 RPM",
      torque: "14 Nm @ 9,000 RPM",
      transmission: "6 velocidades",
      weight: "131 kg",
      fuelCapacity: "11 litros",
      colors: ["Negro","Rojo"],
    },
    imagesByColor: {
          "Negro": [
                "/moto_images/gsx-r150-abs/GSX R150 ABS NEGRA.png"
          ],
          "Rojo": [
                "/moto_images/gsx-r150-abs/GSX R150 ABS ROJA.png"
          ]
    },
    images: ["/moto_images/gsx-r150-abs/GSX R150 ABS NEGRA.png"],
    featured: true,
    stock: 'limited',
    videoUrl: 'https://www.youtube.com/embed/edLDAaTwjDM?autoplay=0&rel=0',
  },
  {
    id: '38',
    brand: 'Suzuki',
    model: "GSX-S1000",
    year: 2026,
    price: 42990000,
    category: 'Urban Sport',
    description: "La Suzuki GSX-S1000 es la naked que tiene el corazón de la legendaria GSX-R1000. Motor de 999cc con 152 HP, IMU de 6 ejes, control de tracción, frenos Brembo M50 y diseño agresivo con esculpida musculatura. La naked más pura y emocionante de Suzuki.",
    specifications: {
      engine: "999cc, 4 cilindros en línea, DOHC, inyección electrónica",
      power: "152 HP @ 11,000 RPM",
      torque: "106 Nm @ 9,250 RPM",
      transmission: "6 velocidades",
      weight: "213 kg",
      fuelCapacity: "17 litros",
      colors: ["Azul","Blanco","Negro"],
    },
    imagesByColor: {
          "Azul": [
                "/moto_images/gsx-s1000/GSX S1000 AZUL.png"
          ],
          "Blanco": [
                "/moto_images/gsx-s1000/GSX S1000 BLANCA.png"
          ],
          "Negro": [
                "/moto_images/gsx-s1000/GSX S1000 NEGRA.png"
          ]
    },
    images: ["/moto_images/gsx-s1000/GSX S1000 AZUL.png"],
    featured: true,
    stock: 'order',
  },
  {
    id: '39',
    brand: 'Suzuki',
    model: "GSX-S150 ABS",
    year: 2026,
    price: 13990000,
    category: 'Urban Sport',
    description: "La Suzuki GSX-S150 ABS es la versión naked del GSX-R150, con manillar alto para mayor versatilidad urbana. Motor DOHC de 147cc, frenos ABS de serie y el inconfundible diseño agresivo de la familia GSX-S. Agilidad y potencia en cada semáforo.",
    specifications: {
      engine: "147.3cc, 4 tiempos, DOHC, inyección electrónica",
      power: "18.7 HP @ 10,500 RPM",
      torque: "14 Nm @ 9,000 RPM",
      transmission: "6 velocidades",
      weight: "131 kg",
      fuelCapacity: "11 litros",
      colors: ["Negro"],
    },
    imagesByColor: {
          "Negro": [
                "/moto_images/gsx-s150-abs/GSX S150 ABS NEGRA (1).png",
                "/moto_images/gsx-s150-abs/GSX S150 ABS NEGRA.png"
          ]
    },
    images: ["/moto_images/gsx-s150-abs/GSX S150 ABS NEGRA (1).png"],
    stock: 'available',
  },
  {
    id: '40',
    brand: 'Suzuki',
    model: "Hayabusa",
    year: 2026,
    price: 79990000,
    category: 'Urban Sport',
    description: "La Suzuki Hayabusa es más que una motocicleta, es un ícono de la velocidad y el diseño. Motor de 1,340cc con 190 HP, sistema de gestión electrónica de última generación, carenado aerodinámico perfeccionado en túnel de viento. La Hayabusa: el ave rapaz más rápida del mundo.",
    specifications: {
      engine: "1,340cc, 4 cilindros en línea, DOHC, inyección electrónica Bosh",
      power: "190 HP @ 9,700 RPM",
      torque: "150 Nm @ 7,000 RPM",
      transmission: "6 velocidades",
      weight: "264 kg",
      fuelCapacity: "20 litros",
      colors: ["Azul","Blanco","Gris","Negro"],
    },
    imagesByColor: {
          "Azul": [
                "/moto_images/hayabusa/HAYABUSA AZUL.png"
          ],
          "Blanco": [
                "/moto_images/hayabusa/HAYABUSA BLANCA.png"
          ],
          "Gris": [
                "/moto_images/hayabusa/HAYABUSA GRIS.png"
          ],
          "Negro": [
                "/moto_images/hayabusa/HAYABUSA NEGRA.png"
          ]
    },
    images: ["/moto_images/hayabusa/HAYABUSA AZUL.png"],
    featured: true,
    stock: 'order',
    videoUrl: 'https://www.youtube.com/embed/1v4g4oo95Co?autoplay=0&rel=0',
  },
  {
    id: '41',
    brand: 'Suzuki',
    model: "SV650A",
    year: 2026,
    price: 27990000,
    category: 'Urban Sport',
    description: "La Suzuki SV650A es la naked V-Twin que enamora a todos los que la montan. Motor de 645cc V-Twin con 73 HP, sonido característico único y manejo equilibrado para principiantes avanzados y veteranos por igual. El sabor V-Twin más accesible del mercado.",
    specifications: {
      engine: "645cc, V-Twin, DOHC, inyección electrónica",
      power: "73 HP @ 8,500 RPM",
      torque: "64 Nm @ 8,100 RPM",
      transmission: "6 velocidades",
      weight: "197 kg",
      fuelCapacity: "14.5 litros",
      colors: ["Negro","Verde"],
    },
    imagesByColor: {
          "Negro": [
                "/moto_images/sv650a/SV650 NEGRA.png"
          ],
          "Verde": [
                "/moto_images/sv650a/SV650 VERDE.png"
          ]
    },
    images: ["/moto_images/sv650a/SV650 NEGRA.png"],
    featured: true,
    stock: 'available',
  },
  {
    id: '42',
    brand: 'Suzuki',
    model: "V-Strom 1050 DE",
    year: 2026,
    price: 55990000,
    category: 'Adventure',
    description: "La Suzuki V-Strom 1050 DE (Dual Explorer) es la aventurera grande con todo lo necesario para explorar el mundo. Motor V-Twin de 1,037cc, suspensión electrónica ajustable, control de tracción de 3 niveles y protecciones integrales. Para los viajeros que no conocen límites.",
    specifications: {
      engine: "1,037cc, V-Twin 90°, DOHC, inyección electrónica",
      power: "107 HP @ 8,500 RPM",
      torque: "100 Nm @ 6,000 RPM",
      transmission: "6 velocidades",
      weight: "247 kg",
      fuelCapacity: "20 litros",
      colors: ["Amarillo","Blanco","Negro"],
    },
    imagesByColor: {
          "Amarillo": [
                "/moto_images/v-strom-1050-de/V-STROM-1050DE-AMARILLA.png"
          ],
          "Blanco": [
                "/moto_images/v-strom-1050-de/V-STROM-1050DE-BLANCA.png"
          ],
          "Negro": [
                "/moto_images/v-strom-1050-de/V-STROM-1050DE-NEGRA.png"
          ]
    },
    images: ["/moto_images/v-strom-1050-de/V-STROM-1050DE-AMARILLA.png"],
    featured: true,
    stock: 'order',
  },
  {
    id: '43',
    brand: 'Suzuki',
    model: "V-Strom 160",
    year: 2026,
    price: 8990000,
    category: 'Adventure',
    description: "La Suzuki V-Strom 160 trae el espíritu aventurero V-Strom al segmento de entrada. Motor de 155cc con inyección electrónica, freno ABS de serie, posición de manejo erguida y diseño inspirado en la V-Strom 1000. La aventura comienza ahora.",
    specifications: {
      engine: "155cc, 4 tiempos, SOHC, inyección electrónica",
      power: "14.4 HP @ 8,000 RPM",
      torque: "13.8 Nm @ 6,000 RPM",
      transmission: "5 velocidades",
      weight: "149 kg",
      fuelCapacity: "12 litros",
      colors: ["Amarillo","Blanco","Negro"],
    },
    imagesByColor: {
          "Amarillo": [
                "/moto_images/v-strom-160/V-STROM 160 AMARILLA.png"
          ],
          "Blanco": [
                "/moto_images/v-strom-160/V-STROM 160 BLANCO.png"
          ],
          "Negro": [
                "/moto_images/v-strom-160/V-STROM 160 NEGRA.png"
          ]
    },
    images: ["/moto_images/v-strom-160/V-STROM 160 AMARILLA.png"],
    stock: 'available',
  },
  {
    id: '44',
    brand: 'Suzuki',
    model: "V-Strom 250 SX",
    year: 2027,
    price: 14990000,
    category: 'Adventure',
    description: "La Suzuki V-Strom 250 SX es la adventure mediana perfecta para los viajeros modernos. Motor de 249cc con inyección, modo de conducción Off-Road, suspensión de largo recorrido y protecciones laterales integrales. Diseñada para explorar todos los rincones del Eje Cafetero.",
    specifications: {
      engine: "249cc, 4 tiempos, SOCS, inyección electrónica",
      power: "26.5 HP @ 9,300 RPM",
      torque: "22.2 Nm @ 7,300 RPM",
      transmission: "6 velocidades",
      weight: "167 kg",
      fuelCapacity: "14 litros",
      colors: ["Blanco","Amarillo","Azul","Negro"],
    },
    imagesByColor: {
          "Blanco": [
                "/moto_images/v-strom-250-sx/V-STROM_250SX--2027-BLANCA.png"
          ],
          "Amarillo": [
                "/moto_images/v-strom-250-sx/V-STROM_250SX-2027-AMARILLA.png"
          ],
          "Azul": [
                "/moto_images/v-strom-250-sx/V-STROM_250SX-2027-AZUL.png"
          ],
          "Negro": [
                "/moto_images/v-strom-250-sx/V-STROM_250SX-2027-NEGRA.png"
          ]
    },
    images: ["/moto_images/v-strom-250-sx/V-STROM_250SX--2027-BLANCA.png"],
    featured: true,
    stock: 'available',
  },
  {
    id: '45',
    brand: 'Suzuki',
    model: "V-Strom 800 DE",
    year: 2026,
    price: 45990000,
    category: 'Adventure',
    description: "La Suzuki V-Strom 800 DE llena el hueco entre la 650 y la 1050 con una propuesta sin compromiso. Motor bicilíndrico de 776cc, suspensión KYB de largo recorrido, modos de conducción On/Off Road y nuevo diseño pico de pájaro más agresivo. La adventure perfecta para carreteras colombianas.",
    specifications: {
      engine: "776cc, bicilíndrico paralelo, DOHC, inyección electrónica",
      power: "84 HP @ 8,500 RPM",
      torque: "78 Nm @ 6,800 RPM",
      transmission: "6 velocidades",
      weight: "220 kg",
      fuelCapacity: "20 litros",
      colors: ["Amarillo","Blanco","Negro"],
    },
    imagesByColor: {
          "Amarillo": [
                "/moto_images/v-strom-800-de/V-STROM-800-DE-AMARILLA.png"
          ],
          "Blanco": [
                "/moto_images/v-strom-800-de/V-STROM-800-DE-BLANCA.png"
          ],
          "Negro": [
                "/moto_images/v-strom-800-de/V-STROM-800-DE-NEGRA.png"
          ]
    },
    images: ["/moto_images/v-strom-800-de/V-STROM-800-DE-AMARILLA.png"],
    stock: 'order',
  },
  {
    id: '46',
    brand: 'Suzuki',
    model: "XOOM 110",
    year: 2026,
    price: 4990000,
    category: 'Scooters',
    description: "La Suzuki XOOM 110 es el scooter de entrada ideal para la movilidad urbana. Diseño moderno y compacto, motor de 110cc eficiente, maletero bajo el asiento y peso muy ligero para maniobrar fácilmente en el tráfico de la ciudad. El scooter más accesible de Suzuki.",
    specifications: {
      engine: "110cc, 4 tiempos, monocilíndrico",
      power: "8.5 HP @ 7,500 RPM",
      torque: "9 Nm @ 5,500 RPM",
      transmission: "Automática (CVT)",
      weight: "91 kg",
      fuelCapacity: "5 litros",
      colors: ["Azul","Negro"],
    },
    imagesByColor: {
          "Azul": [
                "/moto_images/xoom-110/xoom110DiagAzul.png"
          ],
          "Negro": [
                "/moto_images/xoom-110/xoom110DiagNegra.png"
          ]
    },
    images: ["/moto_images/xoom-110/xoom110DiagAzul.png"],
    stock: 'available',
  },
  {
    id: '47',
    brand: 'Honda',
    model: "CB 100",
    year: 2026,
    price: 4490000,
    category: 'City',
    description: "La Honda CB 100 es la moto de aprendizaje y trabajo más confiable del mercado. Motor de 99cc con transmisión suave, frenos de disco delantera y diseño clásico que nunca pasa de moda. La primera Honda de miles de colombianos y la más recomendada para iniciar.",
    specifications: {
      engine: "99cc, 4 tiempos, OHC",
      power: "8.8 HP @ 8,000 RPM",
      torque: "8.1 Nm @ 5,500 RPM",
      transmission: "4 velocidades",
      weight: "103 kg",
      fuelCapacity: "10 litros",
      colors: ["Azul","Negro","Rojo"],
    },
    imagesByColor: {
          "Azul": [
                "/moto_images/cb-100/honda-cb-100-azul.webp"
          ],
          "Negro": [
                "/moto_images/cb-100/honda-cb-100-negra.webp"
          ],
          "Rojo": [
                "/moto_images/cb-100/honda-cb-100-rojo.webp"
          ]
    },
    images: ["/moto_images/cb-100/honda-cb-100-azul.webp"],
    stock: 'available',
  },
  {
    id: '48',
    brand: 'Honda',
    model: "CB 125F DLX",
    year: 2026,
    price: 6190000,
    category: 'City',
    description: "La Honda CB 125F DLX es la versión de lujo de la CB 125F con acabados mejorados. Motor de 124cc con inyección electrónica PGM-FI, freno de disco delantero, suspensión mejorada y nuevo tablero digital. La moto de ciudad con el toque Honda que mereces.",
    specifications: {
      engine: "124cc, 4 tiempos, OHC, PGM-FI",
      power: "10.4 HP @ 8,000 RPM",
      torque: "10.5 Nm @ 5,500 RPM",
      transmission: "5 velocidades",
      weight: "117 kg",
      fuelCapacity: "12 litros",
      colors: ["Negro","Rojo"],
    },
    imagesByColor: {
          "Negro": [
                "/moto_images/cb-125f-dlx/honda-cb125f-20-std-negro1.webp"
          ],
          "Rojo": [
                "/moto_images/cb-125f-dlx/honda-cb125f-20-std-rojo1.webp"
          ]
    },
    images: ["/moto_images/cb-125f-dlx/honda-cb125f-20-std-negro1.webp"],
    stock: 'available',
  },
  {
    id: '49',
    brand: 'Honda',
    model: "CB 190R 2.0",
    year: 2026,
    price: 12690000,
    category: 'Urban Sport',
    description: "La Honda CB 190R 2.0 es la naked deportiva que combina el rendimiento de un motor de 184cc con el diseño agresivo de la familia CB. Frenos de disco doble con ABS, tablero digital full y posición de manejo inspirada en las naked grandes. La puerta de entrada al segmento deportivo Honda.",
    specifications: {
      engine: "184.4cc, 4 tiempos, OHC, PGM-FI",
      power: "16.3 HP @ 8,500 RPM",
      torque: "16.2 Nm @ 7,000 RPM",
      transmission: "5 velocidades",
      weight: "140 kg",
      fuelCapacity: "12 litros",
      colors: ["Gris","Rojo"],
    },
    imagesByColor: {
          "Gris": [
                "/moto_images/cb-190r-20/honda-cb190r-gris.webp"
          ],
          "Rojo": [
                "/moto_images/cb-190r-20/honda-cb190r-rojo.webp"
          ]
    },
    images: ["/moto_images/cb-190r-20/honda-cb190r-gris.webp"],
    featured: true,
    stock: 'available',
    videoUrl: 'https://www.youtube.com/embed/OjNe1ixPrDk?autoplay=0&rel=0',
  },
  {
    id: '50',
    brand: 'Honda',
    model: "CB 300F",
    year: 2026,
    price: 18490000,
    category: 'Urban Sport',
    description: "La Honda CB 300F sube el listón con su motor monocilíndrico de 286cc DOHC. Diseño inspirado en la CB1000R, frenos radiales con ABS, suspensión invertida y tablero LCD de alta resolución. Una naked que compite de frente con motos de mayor cilindrada a precio más accesible.",
    specifications: {
      engine: "286cc, 4 tiempos, DOHC, inyección electrónica PGM-FI",
      power: "26.6 HP @ 8,500 RPM",
      torque: "26 Nm @ 7,000 RPM",
      transmission: "6 velocidades",
      weight: "158 kg",
      fuelCapacity: "12 litros",
      colors: ["Azul","Rojo","Gris"],
    },
    imagesByColor: {
          "Azul": [
                "/moto_images/cb-300f/Nueva-CB-300F-azul-mate.webp"
          ],
          "Rojo": [
                "/moto_images/cb-300f/Nueva-CB-300F-rojo.webp"
          ],
          "Gris": [
                "/moto_images/cb-300f/gris-mate-CB300F.webp"
          ]
    },
    images: ["/moto_images/cb-300f/Nueva-CB-300F-azul-mate.webp"],
    featured: true,
    stock: 'available',
  },
  {
    id: '51',
    brand: 'Honda',
    model: "DIO LED DLX",
    year: 2026,
    price: 5990000,
    category: 'Scooters',
    description: "La Honda DIO LED DLX es el scooter de ciudad con iluminación LED completa y acabados de lujo. Motor de 110cc eficiente con inyección, compartimento bajo el asiento amplio y diseño curvilíneo moderno. Tecnología Honda DLX para los que quieren más en su scooter.",
    specifications: {
      engine: "109.2cc, 4 tiempos, OHC, PGM-FI",
      power: "8.2 HP @ 7,000 RPM",
      torque: "9 Nm @ 5,500 RPM",
      transmission: "Automática (CVT)",
      weight: "95 kg",
      fuelCapacity: "5.5 litros",
      colors: ["Gris"],
    },
    imagesByColor: {
          "Gris": [
                "/moto_images/dio-led-dlx/nueva-dio-dlx-gris.webp"
          ]
    },
    images: ["/moto_images/dio-led-dlx/nueva-dio-dlx-gris.webp"],
    stock: 'available',
  },
  {
    id: '52',
    brand: 'Honda',
    model: "DIO LED STD",
    year: 2026,
    price: 5490000,
    category: 'Scooters',
    description: "La Honda DIO LED STD es el scooter básico con iluminación LED de alta eficiencia. Ligero, económico y fácil de maniobrar en el tráfico urbano. Motor de 110cc PGM-FI y el respaldo de garantía Honda que da tranquilidad en cada trayecto.",
    specifications: {
      engine: "109.2cc, 4 tiempos, OHC, PGM-FI",
      power: "8 HP @ 7,000 RPM",
      torque: "8.8 Nm @ 5,500 RPM",
      transmission: "Automática (CVT)",
      weight: "92 kg",
      fuelCapacity: "5.5 litros",
      colors: ["Azul","Rojo"],
    },
    imagesByColor: {
          "Azul": [
                "/moto_images/dio-led-std/nueva-dio-std-azul.webp"
          ],
          "Rojo": [
                "/moto_images/dio-led-std/nueva-dio-std-rojo.webp"
          ]
    },
    images: ["/moto_images/dio-led-std/nueva-dio-std-azul.webp"],
    stock: 'available',
  },
  {
    id: '53',
    brand: 'Honda',
    model: "Navi",
    year: 2026,
    price: 4990000,
    category: 'Rebels',
    description: "La Honda Navi es un híbrido único entre moto y scooter que rompe todos los esquemas. Diseño divertido y personalizable, motor de 109cc suave y económico, sin necesidad de cambiar marchas. La Navi es para los espíritus libres que quieren moverse diferente en la ciudad.",
    specifications: {
      engine: "109cc, 4 tiempos, OHC, PGM-FI",
      power: "7.8 HP @ 7,000 RPM",
      torque: "9 Nm @ 5,000 RPM",
      transmission: "Automática",
      weight: "103 kg",
      fuelCapacity: "5 litros",
      colors: ["Rojo"],
    },
    imagesByColor: {
          "Rojo": [
                "/moto_images/navi/navi-rojo-b.webp",
                "/moto_images/navi/navi-rojo-n.webp",
                "/moto_images/navi/navi-rojo-ne.webp"
          ]
    },
    images: ["/moto_images/navi/navi-rojo-b.webp"],
    stock: 'available',
  },
  {
    id: '54',
    brand: 'Honda',
    model: "Navi Adventure",
    year: 2026,
    price: 5490000,
    category: 'Rebels',
    description: "La Honda Navi Adventure es la versión explorer de la divertida Navi. Guarda barros alto, guardapatas extendidos y coloración aventurera para quienes quieren llevar el espíritu Navi más allá de la ciudad. Misma diversión, más carácter.",
    specifications: {
      engine: "109cc, 4 tiempos, OHC, PGM-FI",
      power: "7.8 HP @ 7,000 RPM",
      torque: "9 Nm @ 5,000 RPM",
      transmission: "Automática",
      weight: "105 kg",
      fuelCapacity: "5 litros",
      colors: ["Café"],
    },
    imagesByColor: {
          "Café": [
                "/moto_images/navi-adventure/Navi_Lateral_Derecha_Cafe2.webp"
          ]
    },
    images: ["/moto_images/navi-adventure/Navi_Lateral_Derecha_Cafe2.webp"],
    stock: 'available',
  },
  {
    id: '55',
    brand: 'Honda',
    model: "Navi Mix",
    year: 2026,
    price: 5290000,
    category: 'Rebels',
    description: "La Honda Navi Mix combina lo mejor del estilo urbano moderno con la practicidad de la Navi. Colores llamativos y combinaciones exclusivas que permiten expresar tu personalidad. El motor de 109cc automático y el diseño único hacen de cada viaje una experiencia diferente.",
    specifications: {
      engine: "109cc, 4 tiempos, OHC, PGM-FI",
      power: "7.8 HP @ 7,000 RPM",
      torque: "9 Nm @ 5,000 RPM",
      transmission: "Automática",
      weight: "103 kg",
      fuelCapacity: "5 litros",
      colors: ["Negro","Rojo"],
    },
    imagesByColor: {
          "Negro": [
                "/moto_images/navi-mix/navi-mix-negro.webp"
          ],
          "Rojo": [
                "/moto_images/navi-mix/navi-mix-roja.webp"
          ]
    },
    images: ["/moto_images/navi-mix/navi-mix-negro.webp"],
    stock: 'available',
  },
  {
    id: '56',
    brand: 'Honda',
    model: "NX 190",
    year: 2026,
    price: 13490000,
    category: 'Adventure',
    description: "La Honda NX 190 es la adventure mediana que mezcla la experiencia urbana con la capacidad off-road. Motor de 184cc con inyección, suspensión de largo recorrido, frenos ABS y diseño NX. Para el rider que quiere aventura sin límites en una sola moto.",
    specifications: {
      engine: "184.4cc, 4 tiempos, OHC, PGM-FI",
      power: "16.8 HP @ 8,500 RPM",
      torque: "16.5 Nm @ 7,000 RPM",
      transmission: "5 velocidades",
      weight: "145 kg",
      fuelCapacity: "13 litros",
      colors: ["Negro","Rojo"],
    },
    imagesByColor: {
          "Negro": [
                "/moto_images/nx-190/honda-nx190-negro-nueva.webp"
          ],
          "Rojo": [
                "/moto_images/nx-190/honda-nx190-rojo-nueva.webp"
          ]
    },
    images: ["/moto_images/nx-190/honda-nx190-negro-nueva.webp"],
    featured: true,
    stock: 'available',
  },
  {
    id: '57',
    brand: 'Honda',
    model: "PCX 160 ABS",
    year: 2026,
    price: 13990000,
    category: 'Scooters',
    description: "La Honda PCX 160 ABS es el maxi-scooter premium más vendido de su categoría. Motor de 156cc eSP+ con sistema Smart Power, frenos ABS, compartimento de carga enorme bajo el asiento y diseño premium de líneas fluidas. El mejor scooter del mercado, sin discusión.",
    specifications: {
      engine: "156cc, 4 tiempos, OHC eSP+, PGM-FI",
      power: "15.8 HP @ 8,500 RPM",
      torque: "15 Nm @ 6,500 RPM",
      transmission: "Automática (CVT)",
      weight: "132 kg",
      fuelCapacity: "8.1 litros",
      colors: ["Azul","Blanco","Gris","Rojo"],
    },
    imagesByColor: {
          "Azul": [
                "/moto_images/pcx-160-abs/Azul-8194f.webp"
          ],
          "Blanco": [
                "/moto_images/pcx-160-abs/Blanca-b3c5f.webp"
          ],
          "Gris": [
                "/moto_images/pcx-160-abs/Gris-54dba.webp"
          ],
          "Rojo": [
                "/moto_images/pcx-160-abs/Roja-6981e.webp"
          ]
    },
    images: ["/moto_images/pcx-160-abs/Azul-8194f.webp"],
    featured: true,
    stock: 'available',
  },
  {
    id: '58',
    brand: 'Honda',
    model: "Wave 110S",
    year: 2026,
    price: 5690000,
    category: 'City',
    description: "La Honda Wave 110S es la moto de trabajo más icónica de Honda en Colombia. Motor de 109cc PGM-FI de ultra bajo consumo, freno de disco delantero, suspensión trasera mejorada y tablero digital. La confiabilidad Honda en su máxima expresión práctica.",
    specifications: {
      engine: "109.2cc, 4 tiempos, OHC, PGM-FI",
      power: "8.8 HP @ 7,500 RPM",
      torque: "9.3 Nm @ 5,500 RPM",
      transmission: "4 velocidades",
      weight: "103 kg",
      fuelCapacity: "4 litros",
      colors: ["Blanco","Gris","Negro","Rojo"],
    },
    imagesByColor: {
          "Blanco": [
                "/moto_images/wave-110s-2026/nueva-honda-wave-110-blanca.webp"
          ],
          "Gris": [
                "/moto_images/wave-110s-2026/nueva-honda-wave-110-gris.webp"
          ],
          "Negro": [
                "/moto_images/wave-110s-2026/nueva-honda-wave-110-negra3.webp"
          ],
          "Rojo": [
                "/moto_images/wave-110s-2026/nueva-honda-wave-110-roja.webp"
          ]
    },
    images: ["/moto_images/wave-110s-2026/nueva-honda-wave-110-blanca.webp"],
    featured: true,
    stock: 'available',
  },
  {
    id: '59',
    brand: 'Honda',
    model: "XR 150L 2.0",
    year: 2026,
    price: 9490000,
    category: 'Enduro',
    description: "La Honda XR 150L 2.0 es la trail de trabajo y aventura más popular del mercado. Motor de 149cc con PGM-FI, suspensión de largo recorrido, frenos de disco en ambas ruedas y guardabarros alto. Perfecta para caminos destapados y uso diario en zonas rurales del Eje Cafetero.",
    specifications: {
      engine: "149.2cc, 4 tiempos, OHC, PGM-FI",
      power: "13.2 HP @ 8,000 RPM",
      torque: "12.8 Nm @ 6,500 RPM",
      transmission: "5 velocidades",
      weight: "130 kg",
      fuelCapacity: "7.5 litros",
      colors: ["Blanco","Negro","Rojo"],
    },
    imagesByColor: {
          "Blanco": [
                "/moto_images/xr-150l-20/XR150L-20-blanco-version.webp"
          ],
          "Negro": [
                "/moto_images/xr-150l-20/XR150L-20-negro.webp"
          ],
          "Rojo": [
                "/moto_images/xr-150l-20/XR150L-20-rojo.webp"
          ]
    },
    images: ["/moto_images/xr-150l-20/XR150L-20-blanco-version.webp"],
    featured: true,
    stock: 'available',
  },
  {
    id: '60',
    brand: 'Honda',
    model: "XR 190L 2.0",
    year: 2026,
    price: 10990000,
    category: 'Enduro',
    description: "La Honda XR 190L 2.0 es la aventurera 190cc más completa del portafolio Honda. Motor de 184cc PGM-FI, frenos de disco doble con ABS, suspensión de largo recorrido y diseño renovado 2.0. La opción perfecta para quienes ya dominan el off-road y quieren más potencia.",
    specifications: {
      engine: "184.4cc, 4 tiempos, OHC, PGM-FI",
      power: "15.6 HP @ 8,500 RPM",
      torque: "15.7 Nm @ 6,000 RPM",
      transmission: "5 velocidades",
      weight: "137 kg",
      fuelCapacity: "12 litros",
      colors: ["Blanco","Rojo"],
    },
    imagesByColor: {
          "Blanco": [
                "/moto_images/xr-190l-20/nueva-xr190l-abs-20-blanca.webp"
          ],
          "Rojo": [
                "/moto_images/xr-190l-20/xr-190l-abs-rojo.webp"
          ]
    },
    images: ["/moto_images/xr-190l-20/xr-190l-abs-beige.webp"],
    stock: 'available',
    videoUrl: 'https://www.youtube.com/embed/zKAlDMvp5AU?autoplay=0&rel=0',
  },
  {
    id: '61',
    brand: 'Honda',
    model: "XR 300L Tornado",
    year: 2026,
    price: 14990000,
    category: 'Enduro',
    description: "La Honda XR 300L Tornado es la bestia del segmento enduro Honda. Motor de 299cc de alto rendimiento, suspensión de competencia, frenos Nissin con ABS y diseño Tornado que impone respeto en cualquier terreno. Para los pilotos que van en serio con la aventura.",
    specifications: {
      engine: "299cc, 4 tiempos, DOHC, PGM-FI",
      power: "26 HP @ 8,500 RPM",
      torque: "26.5 Nm @ 7,000 RPM",
      transmission: "6 velocidades",
      weight: "152 kg",
      fuelCapacity: "12 litros",
      colors: ["Blanco","Gris","Rojo"],
    },
    imagesByColor: {
          "Blanco": [
                "/moto_images/xr-300l-tornado/blanco-honda-x300l-7ebd1.webp"
          ],
          "Gris": [
                "/moto_images/xr-300l-tornado/gris-honda-x300l-420d9.webp"
          ],
          "Rojo": [
                "/moto_images/xr-300l-tornado/roja-honda-x300l-8ebf2.webp"
          ]
    },
    images: ["/moto_images/xr-300l-tornado/blanco-honda-x300l-7ebd1.webp"],
    featured: true,
    stock: 'available',
  },
  {
    id: '62',
    brand: 'Bajaj',
    model: "Boxer CT 100 ES",
    year: 2026,
    price: 4190000,
    category: 'City',
    description: "La Bajaj Boxer CT 100 ES es la moto de trabajo más económica del portafolio Bajaj con arranque eléctrico. Motor de 99cc DTS-Si, bajo consumo de combustible y alta durabilidad. La opción más accesible para quienes necesitan transporte confiable sin gastar de más.",
    specifications: {
      engine: "99cc, 4 tiempos, DTS-Si",
      power: "8 HP @ 7,500 RPM",
      torque: "8.3 Nm @ 5,000 RPM",
      transmission: "4 velocidades",
      weight: "111 kg",
      fuelCapacity: "11 litros",
    },
    images: ["/moto_images/boxer-ct-100-es/descarga (1).png","/moto_images/boxer-ct-100-es/descarga (2).png","/moto_images/boxer-ct-100-es/descarga (3).png","/moto_images/boxer-ct-100-es/descarga (5).png","/moto_images/boxer-ct-100-es/descarga.png"],
    stock: 'available',
  },
  {
    id: '63',
    brand: 'Bajaj',
    model: "Boxer CT 100 KS",
    year: 2026,
    price: 3990000,
    category: 'City',
    description: "La Bajaj Boxer CT 100 KS es la versión de arranque por pedal, la más económica del portafolio. Motor de 99cc resistente, alta eficiencia de combustible y piezas de fácil consecución en toda Colombia. Para quienes priorizan el precio sin sacrificar la durabilidad Bajaj.",
    specifications: {
      engine: "99cc, 4 tiempos, DTS-Si",
      power: "7.5 HP @ 7,500 RPM",
      torque: "8 Nm @ 5,000 RPM",
      transmission: "4 velocidades",
      weight: "109 kg",
      fuelCapacity: "11 litros",
    },
    images: ["/moto_images/boxer-ct-100-ks/descarga (1).png","/moto_images/boxer-ct-100-ks/descarga (2).png","/moto_images/boxer-ct-100-ks/descarga (3).png","/moto_images/boxer-ct-100-ks/descarga (4).png","/moto_images/boxer-ct-100-ks/descarga.png"],
    stock: 'available',
  },
  {
    id: '64',
    brand: 'Bajaj',
    model: "Boxer CT 125",
    year: 2026,
    price: 5190000,
    category: 'City',
    description: "La Bajaj Boxer CT 125 trae 125cc de potencia al clásico Boxer de trabajo. Mayor torque para subidas y cargas, freno de disco delantero, arranque eléctrico y la misma robustez Boxer que se ha ganado la confianza de los trabajadores colombianos durante años.",
    specifications: {
      engine: "124.5cc, 4 tiempos, DTS-i",
      power: "10 HP @ 7,500 RPM",
      torque: "10.5 Nm @ 5,500 RPM",
      transmission: "5 velocidades",
      weight: "122 kg",
      fuelCapacity: "12 litros",
    },
    images: ["/moto_images/boxer-ct-125/descarga (1).png","/moto_images/boxer-ct-125/descarga (2).png","/moto_images/boxer-ct-125/descarga (4).png","/moto_images/boxer-ct-125/descarga.png"],
    stock: 'available',
  },
  {
    id: '65',
    brand: 'Bajaj',
    model: "Boxer 150X",
    year: 2026,
    price: 6490000,
    category: 'City',
    description: "La Bajaj Boxer 150X es el Boxer de trabajo evolucionado para quienes necesitan más potencia. Motor de 149cc DTS-i, freno de disco delantero, suspensión mejorada y diseño más robusto. La moto de carga más potente del portafolio Bajaj, lista para los trabajos más exigentes.",
    specifications: {
      engine: "149.5cc, 4 tiempos, DTS-i",
      power: "12 HP @ 8,000 RPM",
      torque: "12.5 Nm @ 5,000 RPM",
      transmission: "5 velocidades",
      weight: "135 kg",
      fuelCapacity: "13 litros",
    },
    images: ["/moto_images/boxer-150x/descarga (1).png","/moto_images/boxer-150x/descarga (2).png","/moto_images/boxer-150x/descarga.png"],
    stock: 'available',
  },
  {
    id: '66',
    brand: 'Bajaj',
    model: "Discover 125 ST-R",
    year: 2026,
    price: 5790000,
    category: 'City',
    description: "La Bajaj Discover 125 ST-R es la moto city sport más equilibrada del segmento. Motor de 124cc DTS-i, freno de disco delantero, panel digital y diseño sport que combina practicidad con estilo. Para quienes quieren más que una moto de trabajo pero sin el presupuesto de una deportiva.",
    specifications: {
      engine: "124.5cc, 4 tiempos, DTS-i, inyección electrónica",
      power: "10.6 HP @ 7,500 RPM",
      torque: "11 Nm @ 5,500 RPM",
      transmission: "5 velocidades",
      weight: "120 kg",
      fuelCapacity: "8 litros",
    },
    images: ["/moto_images/discover-125-st-r/descarga (1).png","/moto_images/discover-125-st-r/descarga (2).png","/moto_images/discover-125-st-r/descarga (3).png","/moto_images/discover-125-st-r/descarga.png"],
    stock: 'available',
  },
  {
    id: '67',
    brand: 'Bajaj',
    model: "Dominar 400 Pro Touring",
    year: 2026,
    price: 21990000,
    category: 'Adventure',
    description: "La Bajaj Dominar 400 Pro Touring es la aventurera 400 más accesible del mercado. Motor de 373cc con 40 HP, frenos Bybre con ABS dual canal, suspensión USD de 43mm y equipamiento touring completo. Para los viajeros que quieren cubrir kilómetros con estilo y seguridad.",
    specifications: {
      engine: "373.3cc, 4 tiempos, DOHC, inyección electrónica",
      power: "40 HP @ 8,800 RPM",
      torque: "35 Nm @ 6,500 RPM",
      transmission: "6 velocidades",
      weight: "187 kg",
      fuelCapacity: "13 litros",
    },
    images: ["/moto_images/dominar-400-pro-touring/descarga (4).png","/moto_images/dominar-400-pro-touring/descarga.png"],
    featured: true,
    stock: 'available',
  },
  {
    id: '68',
    brand: 'Bajaj',
    model: "Dominar 400 Volcano",
    year: 2026,
    price: 21990000,
    category: 'Adventure',
    description: "La Bajaj Dominar 400 Volcano es la edición especial con coloración exclusiva de volcán ardiente. Misma mecánica potente de 373cc con 40 HP del Dominar 400 en una presentación visual única y llamativa. Para los que quieren destacarse en la carretera.",
    specifications: {
      engine: "373.3cc, 4 tiempos, DOHC, inyección electrónica",
      power: "40 HP @ 8,800 RPM",
      torque: "35 Nm @ 6,500 RPM",
      transmission: "6 velocidades",
      weight: "187 kg",
      fuelCapacity: "13 litros",
    },
    images: ["/moto_images/dominar-400-volcano/descarga (1).png"],
    stock: 'limited',
  },
  {
    id: '69',
    brand: 'Bajaj',
    model: "Pulsar NS 125 UG",
    year: 2026,
    price: 6990000,
    category: 'Urban Sport',
    description: "La Bajaj Pulsar NS 125 UG es la naked más asequible de la familia NS. Motor de 124.5cc DTS-i, faros LED, freno de disco delantero y el diseño agresivo de la familia Pulsar NS. La puerta de entrada al mundo Pulsar para los nuevos riders.",
    specifications: {
      engine: "124.5cc, 4 tiempos, DTS-i, inyección electrónica",
      power: "12 HP @ 8,500 RPM",
      torque: "11 Nm @ 6,500 RPM",
      transmission: "5 velocidades",
      weight: "142 kg",
      fuelCapacity: "12 litros",
    },
    images: ["/moto_images/pulsar-ns-125-ug/descarga (1).png","/moto_images/pulsar-ns-125-ug/descarga (4).png","/moto_images/pulsar-ns-125-ug/descarga.png"],
    stock: 'available',
  },
  {
    id: '70',
    brand: 'Bajaj',
    model: "Pulsar N 125 FI",
    year: 2026,
    price: 7390000,
    category: 'Urban Sport',
    description: "La Bajaj Pulsar N 125 FI es la nueva generación de naked 125 con inyección electrónica. Diseño N-Series con faros LED de nueva firma, tablero LCD full y motor de 124.5cc DTS-i con FI. La Pulsar 125 más evolucionada del portafolio.",
    specifications: {
      engine: "124.5cc, 4 tiempos, DTS-i FI (inyección electrónica)",
      power: "12 HP @ 8,500 RPM",
      torque: "11 Nm @ 6,500 RPM",
      transmission: "5 velocidades",
      weight: "141 kg",
      fuelCapacity: "12 litros",
    },
    images: ["/moto_images/pulsar-n-125-fi/descarga (1).png","/moto_images/pulsar-n-125-fi/descarga (2).png","/moto_images/pulsar-n-125-fi/descarga (3).png","/moto_images/pulsar-n-125-fi/descarga.png"],
    stock: 'available',
  },
  {
    id: '71',
    brand: 'Bajaj',
    model: "Pulsar P 150 FI ABS",
    year: 2026,
    price: 8490000,
    category: 'Urban Sport',
    description: "La Bajaj Pulsar P 150 FI ABS es la Pulsar clásica evolucionada para la era moderna. Motor de 149cc DTS-i con inyección electrónica, ABS de serie, tablero digital y diseño retro-moderno de la familia P. La combinación perfecta de nostalgia Pulsar y tecnología actual.",
    specifications: {
      engine: "149.5cc, 4 tiempos, DTS-i FI (inyección electrónica)",
      power: "14 HP @ 8,500 RPM",
      torque: "13.5 Nm @ 6,500 RPM",
      transmission: "5 velocidades",
      weight: "143 kg",
      fuelCapacity: "12 litros",
    },
    images: ["/moto_images/pulsar-p-150-fi-abs/descarga (1).png","/moto_images/pulsar-p-150-fi-abs/descarga (3).png","/moto_images/pulsar-p-150-fi-abs/descarga.png"],
    stock: 'available',
  },
  {
    id: '72',
    brand: 'Bajaj',
    model: "Pulsar N 160 FI DC",
    year: 2026,
    price: 9990000,
    category: 'Urban Sport',
    description: "La Bajaj Pulsar N 160 FI DC es la naked 160 con el diseño N más reciente y doble canal de ABS. Motor de 164.82cc DTS-i con FI, frenos de disco doble con ABS en ambas ruedas, Slipper Clutch y el tablero digital más completo de su segmento.",
    specifications: {
      engine: "164.82cc, 4 tiempos, DTS-i FI, inyección electrónica",
      power: "16 HP @ 8,750 RPM",
      torque: "14.65 Nm @ 6,750 RPM",
      transmission: "5 velocidades",
      weight: "155 kg",
      fuelCapacity: "14 litros",
    },
    images: ["/moto_images/pulsar-n-160-fi-dc/1.webp","/moto_images/pulsar-n-160-fi-dc/2.webp","/moto_images/pulsar-n-160-fi-dc/3.webp","/moto_images/pulsar-n-160-fi-dc/4.webp","/moto_images/pulsar-n-160-fi-dc/frontal-bajaj-pulsar-n160-galgo-colombia__1_.webp"],
    featured: true,
    stock: 'available',
  },
  {
    id: '73',
    brand: 'Bajaj',
    model: "Pulsar N160 Pro",
    year: 2026,
    price: 10490000,
    category: 'Urban Sport',
    description: "La Bajaj Pulsar N160 Pro es la versión premium de la N 160 con equipamiento de alto nivel. Suspensión delantera USD de 37mm, Slipper Clutch, ABS dual canal y nuevos colores exclusivos Pro. Para los Pulsar riders que quieren lo máximo en un 160cc.",
    specifications: {
      engine: "164.82cc, 4 tiempos, DTS-i FI, inyección electrónica",
      power: "16.5 HP @ 8,750 RPM",
      torque: "14.65 Nm @ 6,750 RPM",
      transmission: "5 velocidades",
      weight: "153 kg",
      fuelCapacity: "14 litros",
    },
    images: ["/moto_images/pulsar-n160-pro/descarga (1).png","/moto_images/pulsar-n160-pro/descarga (2).png","/moto_images/pulsar-n160-pro/descarga (4).png","/moto_images/pulsar-n160-pro/descarga.png"],
    stock: 'available',
  },
  {
    id: '74',
    brand: 'Bajaj',
    model: "Pulsar NS 160 FI ABS UG2",
    year: 2026,
    price: 10790000,
    category: 'Urban Sport',
    description: "La Bajaj Pulsar NS 160 FI ABS UG2 trae la segunda generación de la NS 160 con mejoras integrales. Motor de 164.82cc más refinado, nueva suspensión trasera tipo mono shock, ABS de serie y diseño NS actualizado con nuevas aletas de refrigeración. Evolución pura.",
    specifications: {
      engine: "164.82cc, 4 tiempos, DTS-i FI, inyección electrónica",
      power: "16 HP @ 8,750 RPM",
      torque: "14.65 Nm @ 6,750 RPM",
      transmission: "5 velocidades",
      weight: "154 kg",
      fuelCapacity: "14 litros",
    },
    images: ["/moto_images/pulsar-ns-160-fi-abs-ug2/descarga (1).png","/moto_images/pulsar-ns-160-fi-abs-ug2/descarga (2).png","/moto_images/pulsar-ns-160-fi-abs-ug2/descarga (3).png","/moto_images/pulsar-ns-160-fi-abs-ug2/descarga.png"],
    stock: 'available',
  },
  {
    id: '75',
    brand: 'Bajaj',
    model: "Pulsar NS 200 FI ABS UG2",
    year: 2026,
    price: 13490000,
    category: 'Urban Sport',
    description: "La Bajaj Pulsar NS 200 FI ABS UG2 es la segunda generación de la naked 200 más popular de Colombia. Motor de 199.5cc con FI y 24.5 HP, frenos Bybre ABS doble canal, Slipper Clutch y nuevos detalles de diseño. La NS 200 que lo tiene todo.",
    specifications: {
      engine: "199.5cc, 4 tiempos, SOHC, DTS-i FI",
      power: "24.5 HP @ 9,750 RPM",
      torque: "18.7 Nm @ 8,000 RPM",
      transmission: "6 velocidades",
      weight: "160 kg",
      fuelCapacity: "12 litros",
    },
    images: ["/moto_images/pulsar-ns-200-fi-abs-ug2/descarga (1).png","/moto_images/pulsar-ns-200-fi-abs-ug2/descarga (2).png","/moto_images/pulsar-ns-200-fi-abs-ug2/descarga (4).png","/moto_images/pulsar-ns-200-fi-abs-ug2/descarga.png"],
    featured: true,
    stock: 'available',
  },
  {
    id: '76',
    brand: 'Bajaj',
    model: "Pulsar NS 200 FI SC",
    year: 2026,
    price: 12990000,
    category: 'Urban Sport',
    description: "La Bajaj Pulsar NS 200 FI SC es la versión con Single Channel ABS de la NS 200. Misma potencia de 24.5 HP con motor DTS-i de 199.5cc, pero con ABS en la rueda delantera, haciéndola más accesible sin sacrificar seguridad básica. El punto de entrada perfecto a la NS 200.",
    specifications: {
      engine: "199.5cc, 4 tiempos, SOHC, DTS-i FI",
      power: "24.5 HP @ 9,750 RPM",
      torque: "18.7 Nm @ 8,000 RPM",
      transmission: "6 velocidades",
      weight: "158 kg",
      fuelCapacity: "12 litros",
    },
    images: ["/moto_images/pulsar-ns-200-fi-sc/descarga (1).png","/moto_images/pulsar-ns-200-fi-sc/descarga (2).png","/moto_images/pulsar-ns-200-fi-sc/descarga (3).png","/moto_images/pulsar-ns-200-fi-sc/descarga.png"],
    stock: 'available',
  },
  {
    id: '77',
    brand: 'Bajaj',
    model: "Pulsar N 250 FI ABS",
    year: 2026,
    price: 16490000,
    category: 'Urban Sport',
    description: "La Bajaj Pulsar N 250 FI ABS es la naked 250 premium del portafolio Bajaj. Motor de 249cc OHC con 24.5 HP, tablero TFT touch color, Slipper Clutch, frenos de disco Bybre con ABS dual y diseño N-Series de última generación. La Pulsar más completa de la historia.",
    specifications: {
      engine: "249cc, 4 tiempos, SOHC, inyección electrónica",
      power: "24.5 HP @ 8,750 RPM",
      torque: "22 Nm @ 6,500 RPM",
      transmission: "5 velocidades",
      weight: "162 kg",
      fuelCapacity: "14 litros",
    },
    images: ["/moto_images/pulsar-n-250-fi-abs/descarga.png"],
    featured: true,
    stock: 'available',
  },
  {
    id: '78',
    brand: 'Bajaj',
    model: "Pulsar RS 200 ABS",
    year: 2026,
    price: 15490000,
    category: 'Urban Sport',
    description: "La Bajaj Pulsar RS 200 ABS es la deportiva full-fairing del portafolio Bajaj. Carenado aerodinámico completo, motor de 199.5cc con FI y 24.5 HP, frenos Bybre ABS y posición de manejo deportiva. La RS 200: agresiva por fuera, sofisticada por dentro.",
    specifications: {
      engine: "199.5cc, 4 tiempos, DTS-i FI, inyección electrónica",
      power: "24.5 HP @ 9,750 RPM",
      torque: "18.7 Nm @ 8,000 RPM",
      transmission: "6 velocidades",
      weight: "165 kg",
      fuelCapacity: "13 litros",
    },
    images: ["/moto_images/pulsar-rs-200-abs/01.webp","/moto_images/pulsar-rs-200-abs/04.webp","/moto_images/pulsar-rs-200-abs/07.webp"],
    stock: 'available',
  },
  {
    id: '79',
    brand: 'Bajaj',
    model: "Pulsar NS 400Z",
    year: 2026,
    price: 21490000,
    category: 'Urban Sport',
    description: "La Bajaj Pulsar NS 400Z es la naked más poderosa que Bajaj ha lanzado. Motor de 373.3cc con 40 HP del Dominar 400, frenos Bybre doble canal ABS, suspensión USD de 43mm y Slipper Clutch. Un 400cc naked accesible que compite con marcas europeas.",
    specifications: {
      engine: "373.3cc, 4 tiempos, DOHC, inyección electrónica",
      power: "40 HP @ 8,800 RPM",
      torque: "35 Nm @ 6,500 RPM",
      transmission: "6 velocidades",
      weight: "170 kg",
      fuelCapacity: "13 litros",
    },
    images: ["/moto_images/pulsar-ns-400z/descarga (1).png","/moto_images/pulsar-ns-400z/descarga (2).png","/moto_images/pulsar-ns-400z/descarga (3).png","/moto_images/pulsar-ns-400z/descarga.png"],
    featured: true,
    stock: 'available',
  },
  {
    id: '80',
    brand: 'Bajaj',
    model: "RE Auto TUK TUK",
    year: 2026,
    price: 28990000,
    category: 'City',
    description: "El Bajaj RE Auto TUK TUK es el tricimoto de trabajo más conocido del mundo. Motor de 200cc con inyección electrónica, cabina cerrada para pasajeros, capacidad de carga de 300 kg y construcción ultra resistente. La solución de movilidad y trabajo en uno para el Eje Cafetero.",
    specifications: {
      engine: "197cc, 4 tiempos, monocilíndrico, inyección electrónica",
      power: "11.6 HP @ 5,500 RPM",
      torque: "19 Nm @ 3,500 RPM",
      transmission: "4 velocidades + reversa",
      weight: "435 kg",
      fuelCapacity: "8 litros",
    },
    images: ["/moto_images/tuk-tuk/descarga.png"],
    stock: 'order',
  },
  {
    id: '81',
    brand: 'Hero',
    model: "ECO 100",
    year: 2026,
    price: 3990000,
    category: 'City',
    description: "La Hero ECO 100 es la moto de trabajo de más bajo consumo del mercado. Motor de 97cc ultra eficiente, diseño compacto y resistente, ideal para domicilios y uso urbano diario. La economía Hero al máximo: más kilómetros, menos combustible.",
    specifications: {
      engine: "97.2cc, 4 tiempos, OHC",
      power: "7.5 HP @ 7,500 RPM",
      torque: "7.9 Nm @ 5,000 RPM",
      transmission: "4 velocidades",
      weight: "107 kg",
      fuelCapacity: "9.5 litros",
      colors: ["Negro"],
    },
    imagesByColor: {
          "Negro": [
                "/moto_images/eco-100/eco 100 negra roja.jpg",
                "/moto_images/eco-100/eco 100 negra-roja.jpg"
          ]
    },
    images: ["/moto_images/eco-100/ECO-100-globito.png"],
    stock: 'available',
  },
  {
    id: '82',
    brand: 'Hero',
    model: "ECO CW",
    year: 2026,
    price: 4290000,
    category: 'City',
    description: "La Hero ECO CW es la versión city-worker de la familia ECO. Tablero renovado, mejorada ergonomía del manillar y suspensión mejorada para el trabajo pesado diario. El motor de 100cc confiable y económico que los trabajadores colombianos han elegido por años.",
    specifications: {
      engine: "97.2cc, 4 tiempos, OHC",
      power: "7.7 HP @ 7,500 RPM",
      torque: "8.1 Nm @ 5,000 RPM",
      transmission: "4 velocidades",
      weight: "108 kg",
      fuelCapacity: "9.5 litros",
      colors: ["Negro/Gris","Negro","Negro/Púrpura","Negro/Rojo"],
    },
    imagesByColor: {
          "Negro/Gris": [
                "/moto_images/eco-cw/eco-cw-negro-gris-motored-hero.webp"
          ],
          "Negro": [
                "/moto_images/eco-cw/eco-cw-negro-motored-hero.webp"
          ],
          "Negro/Púrpura": [
                "/moto_images/eco-cw/eco-cw-negro-purpura-motored-hero.webp"
          ],
          "Negro/Rojo": [
                "/moto_images/eco-cw/eco-cw-negro-rojo-motored-hero.webp"
          ]
    },
    images: ["/moto_images/eco-cw/eco-cw-negro-gris-motored-hero.webp"],
    stock: 'available',
  },
  {
    id: '83',
    brand: 'Hero',
    model: "ECO SP",
    year: 2026,
    price: 4490000,
    category: 'City',
    description: "La Hero ECO SP es la versión Sport Premium de la familia ECO. Faros LED, freno de disco delantero, tablero digital y acabados mejorados en un paquete ECO de bajo consumo. Más estilo sin sacrificar la economía que caracteriza a la familia ECO de Hero.",
    specifications: {
      engine: "97.2cc, 4 tiempos, OHC, inyección electrónica",
      power: "8.2 HP @ 8,000 RPM",
      torque: "8.3 Nm @ 5,500 RPM",
      transmission: "4 velocidades",
      weight: "110 kg",
      fuelCapacity: "9.5 litros",
      colors: ["Negro/Gris","Negro/Púrpura"],
    },
    imagesByColor: {
          "Negro/Gris": [
                "/moto_images/eco-sp/eco-sp-negro-gris-motored-hero.webp"
          ],
          "Negro/Púrpura": [
                "/moto_images/eco-sp/eco-sp-negro-purpura-motored-hero.webp"
          ]
    },
    images: ["/moto_images/eco-sp/eco-sp-negro-gris-motored-hero.webp"],
    stock: 'available',
  },
  {
    id: '84',
    brand: 'Hero',
    model: "ECO T 100",
    year: 2026,
    price: 4690000,
    category: 'City',
    description: "La Hero ECO T 100 es la evolución total de la familia ECO. Motor de 100cc de última generación con inyección electrónica, tablero digital full, LED en todos los focos y la mejor relación kilómetros/galón del segmento. La moto de trabajo del futuro, hoy.",
    specifications: {
      engine: "97.2cc, 4 tiempos, OHC, inyección electrónica",
      power: "8.5 HP @ 8,000 RPM",
      torque: "8.5 Nm @ 5,500 RPM",
      transmission: "4 velocidades",
      weight: "109 kg",
      fuelCapacity: "9.5 litros",
      colors: ["Azul","Negro"],
    },
    imagesByColor: {
          "Azul": [
                "/moto_images/eco-t-100/EcoT_NegraAzul.png"
          ],
          "Negro": [
                "/moto_images/eco-t-100/EcoT_Negra_Gris.png",
                "/moto_images/eco-t-100/EcoT_Negra_Roja.png"
          ]
    },
    images: ["/moto_images/eco-t-100/EcoT_NegraAzul.png"],
    stock: 'available',
  },
  {
    id: '85',
    brand: 'Hero',
    model: "Hunk 125R",
    year: 2026,
    price: 7490000,
    category: 'Urban Sport',
    description: "La Hero Hunk 125R es la naked deportiva de entrada con ADN de competencia. Motor de 124.7cc con inyección, freno de disco delantero y diseño musculoso inspirado en las Hunk más grandes. La primera naked Hero para quienes buscan estilo deportivo real a precio accesible.",
    specifications: {
      engine: "124.7cc, 4 tiempos, OHC, inyección electrónica",
      power: "11.4 HP @ 8,000 RPM",
      torque: "10.5 Nm @ 6,500 RPM",
      transmission: "5 velocidades",
      weight: "139 kg",
      fuelCapacity: "12.5 litros",
      colors: ["Negro","Rojo","Azul"],
    },
    imagesByColor: {
          "Negro": [
                "/moto_images/hunk-125r/hunk125R-Black.png"
          ],
          "Rojo": [
                "/moto_images/hunk-125r/hunk125R-Red.png"
          ],
          "Azul": [
                "/moto_images/hunk-125r/hunk125RBlue.png"
          ]
    },
    images: ["/moto_images/hunk-125r/hunk125R-Black.png"],
    stock: 'available',
  },
  {
    id: '86',
    brand: 'Hero',
    model: "Hunk 150 XT",
    year: 2026,
    price: 8990000,
    category: 'Urban Sport',
    description: "La Hero Hunk 150 XT Xtreme es la naked que lleva el estilo deportivo al siguiente nivel. Motor de 149.2cc con FI y 15.2 HP, frenos de disco doble, ABS de canal único y la carrocería más agresiva de la gama Hunk. Para los que miran las motos importadas pero piensan en colombiano.",
    specifications: {
      engine: "149.2cc, 4 tiempos, OHC, inyección electrónica",
      power: "15.2 HP @ 8,500 RPM",
      torque: "13.3 Nm @ 6,500 RPM",
      transmission: "5 velocidades",
      weight: "148 kg",
      fuelCapacity: "12.5 litros",
      colors: ["Negro","Azul"],
    },
    imagesByColor: {
          "Negro": [
                "/moto_images/hunk-150-xt/HUNK150Xtec_Black.png"
          ],
          "Azul": [
                "/moto_images/hunk-150-xt/HUNK150Xtec_Blue.png"
          ]
    },
    images: ["/moto_images/hunk-150-xt/HUNK150Xtec_Black.png"],
    stock: 'available',
  },
  {
    id: '87',
    brand: 'Hero',
    model: "Hunk 160 V2",
    year: 2026,
    price: 9490000,
    category: 'Urban Sport',
    description: "La Hero Hunk 160 V2 es la segunda generación de la naked 160 de Hero. Motor de 163cc con FI, 15.3 HP y el refinado diseño V2 con nuevas luces LED de firma y carenados laterales renovados. El equilibrio perfecto entre potencia, estilo y precio en el segmento 160cc.",
    specifications: {
      engine: "163cc, 4 tiempos, OHC, inyección electrónica",
      power: "15.3 HP @ 8,500 RPM",
      torque: "14.35 Nm @ 6,500 RPM",
      transmission: "5 velocidades",
      weight: "148.5 kg",
      fuelCapacity: "12 litros",
      colors: ["Negro","Blanco"],
    },
    imagesByColor: {
          "Negro": [
                "/moto_images/hunk-160-v2/hunk160 negra amarilla.png",
                "/moto_images/hunk-160-v2/hunk160r_Negra.png"
          ],
          "Blanco": [
                "/moto_images/hunk-160-v2/hunk160rV2Blanca.png"
          ]
    },
    images: ["/moto_images/hunk-160-v2/hunk160 negra amarilla.png"],
    featured: true,
    stock: 'available',
  },
  {
    id: '88',
    brand: 'Hero',
    model: "Hunk 160 4V Pro",
    year: 2026,
    price: 10990000,
    category: 'Urban Sport',
    description: "La Hero Hunk 160 4V Pro es la versión más avanzada de la familia Hunk con motor de 4 válvulas. Tecnología de 4 válvulas para mayor eficiencia y potencia, suspensión USD delantera, ABS dual canal, tablero TFT y las coloraciones más llamativas de la gama. La naked Hero definitiva.",
    specifications: {
      engine: "163cc, 4 tiempos, OHC, 4 válvulas, inyección electrónica",
      power: "16.3 HP @ 8,500 RPM",
      torque: "14.6 Nm @ 6,500 RPM",
      transmission: "5 velocidades",
      weight: "146 kg",
      fuelCapacity: "12 litros",
      colors: ["Negro/Lima","Negro/Rojo","Verde Neon"],
    },
    imagesByColor: {
          "Negro/Lima": [
                "/moto_images/hunk-160-4v/Hunk160R-4VProNegroLima.png"
          ],
          "Negro/Rojo": [
                "/moto_images/hunk-160-4v/Hunk160R-4VPro_negroRojo.png"
          ],
          "Verde Neon": [
                "/moto_images/hunk-160-4v/Hunk160R-4VPro_verdeNeon.png"
          ]
    },
    images: ["/moto_images/hunk-160-4v/Hunk160R-4VProNegroLima.png"],
    featured: true,
    stock: 'available',
  },
  {
    id: '89',
    brand: 'Hero',
    model: "Splendor X Pro",
    year: 2026,
    price: 6390000,
    category: 'City',
    description: "La Hero Splendor X Pro es la evolución de la moto más vendida del mundo. Diseño X totalmente renovado, motor de 100cc con inyección electrónica, tablero digital Bluetooth y conectividad con app. La Splendor para la era digital: económica, tecnológica y confiable.",
    specifications: {
      engine: "97.2cc, 4 tiempos, OHC, inyección electrónica",
      power: "8 HP @ 8,000 RPM",
      torque: "8.05 Nm @ 5,000 RPM",
      transmission: "4 velocidades",
      weight: "112 kg",
      fuelCapacity: "9.5 litros",
      colors: ["Gris/Lima","Negro/Azul","Negro/Rojo"],
    },
    imagesByColor: {
          "Gris/Lima": [
                "/moto_images/splendor/Splendor_Xpro_GrisLima.png"
          ],
          "Negro/Azul": [
                "/moto_images/splendor/Splendor_Xpro_NegroAzul.png"
          ],
          "Negro/Rojo": [
                "/moto_images/splendor/Splendor_Xpro_NegroRojo.png"
          ]
    },
    images: ["/moto_images/splendor/Splendor_Xpro_GrisLima.png"],
    featured: true,
    stock: 'available',
  },
  {
    id: '90',
    brand: 'Hero',
    model: "X-Blade 160",
    year: 2026,
    price: 9990000,
    category: 'Urban Sport',
    description: "La Hero X-Blade 160 es la naked más estilizada del portafolio Hero. Diseño de cuña agresivo inspirado en las supersport japonesas, motor de 163cc con FI, frenos de disco doble y colores exclusivos de edición limitada. La moto para los que quieren diferenciarse de la multitud.",
    specifications: {
      engine: "163cc, 4 tiempos, OHC, inyección electrónica",
      power: "15.3 HP @ 8,500 RPM",
      torque: "14.35 Nm @ 6,500 RPM",
      transmission: "5 velocidades",
      weight: "140 kg",
      fuelCapacity: "12 litros",
      colors: ["Gris","Rojo"],
    },
    imagesByColor: {
          "Gris": [
                "/moto_images/x-blade-160/xblade160-gris.webp"
          ],
          "Rojo": [
                "/moto_images/x-blade-160/xblade160-rojo.webp"
          ]
    },
    images: ["/moto_images/x-blade-160/xblade160-beige.webp"],
    stock: 'available',
  },
  {
    id: '91',
    brand: 'Hero',
    model: "XOOM 110",
    year: 2026,
    price: 5490000,
    category: 'Scooters',
    description: "La Hero XOOM 110 es el scooter moderno de la gama Hero con motor de inyección. Diseño contemporáneo con colores vivos, motor 110cc eficiente y ligero, maletero bajo el asiento y conectividad Bluetooth con la app Hero. El scooter perfecto para la generación digital.",
    specifications: {
      engine: "110cc, 4 tiempos, OHC, inyección electrónica",
      power: "8.15 HP @ 7,000 RPM",
      torque: "9.1 Nm @ 5,000 RPM",
      transmission: "Automática (CVT)",
      weight: "107 kg",
      fuelCapacity: "5.2 litros",
      colors: ["Azul","Negro"],
    },
    imagesByColor: {
          "Azul": [
                "/moto_images/xoom-110/xoom110DiagAzul.png"
          ],
          "Negro": [
                "/moto_images/xoom-110/xoom110DiagNegra.png"
          ]
    },
    images: ["/moto_images/xoom-110/xoom110DiagAzul.png"],
    stock: 'available',
  },
  {
    id: '92',
    brand: 'Hero',
    model: "XPulse 200 4V",
    year: 2026,
    price: 12390000,
    category: 'Adventure',
    description: "La Hero XPulse 200 4V es la adventure off-road más capaz de Hero. Motor de 199.6cc con 4 válvulas y 19 HP, suspensión de largo recorrido de 190mm delantera, frenos ABS desconectable, tablero TFT con navegación y modos rally. La moto de aventura al alcance de todos.",
    specifications: {
      engine: "199.6cc, 4 tiempos, OHC, 4 válvulas, inyección electrónica",
      power: "19 HP @ 8,500 RPM",
      torque: "16.5 Nm @ 6,500 RPM",
      transmission: "5 velocidades",
      weight: "154 kg",
      fuelCapacity: "13 litros",
      colors: ["Verde","Negro"],
    },
    imagesByColor: {
          "Verde": [
                "/moto_images/xpulse-200-4v/xpulse2004vGrisVerde.png"
          ],
          "Negro": [
                "/moto_images/xpulse-200-4v/xpulse2004vNegro.png"
          ]
    },
    images: ["/moto_images/xpulse-200-4v/xpulse2004vGrisVerde.png"],
    featured: true,
    stock: 'available',
    videoUrl: 'https://www.youtube.com/embed/r4Jjh2fWVjI?autoplay=0&rel=0',
  },
  {
    id: '93',
    brand: 'Hero',
    model: "XPulse 200 AD",
    year: 2026,
    price: 11990000,
    category: 'Adventure',
    description: "La Hero XPulse 200 AD es la versión All-Directions de la XPulse. Preparada para todo tipo de terreno con neumáticos todo-terreno, motor de 199.6cc y la suspensión de largo recorrido XPulse. La moto adventure urbana perfecta para el Eje Cafetero y sus montañas.",
    specifications: {
      engine: "199.6cc, 4 tiempos, OHC, inyección electrónica",
      power: "17.8 HP @ 8,500 RPM",
      torque: "16.5 Nm @ 6,500 RPM",
      transmission: "5 velocidades",
      weight: "154 kg",
      fuelCapacity: "13 litros",
      colors: ["Blanco/Azul","Negro/Azul","Negro/Rojo"],
    },
    imagesByColor: {
          "Blanco/Azul": [
                "/moto_images/xpulse-200-ad/Xpulse200Ad_BlancoAzulAr.png"
          ],
          "Negro/Azul": [
                "/moto_images/xpulse-200-ad/Xpulse200Ad_NegroAzulAr.png"
          ],
          "Negro/Rojo": [
                "/moto_images/xpulse-200-ad/Xpulse200Ad_NegroRojoAr.png"
          ]
    },
    images: ["/moto_images/xpulse-200-ad/Xpulse200Ad_BlancoAzulAr.png"],
    stock: 'available',
  },
  {
    id: '94',
    brand: 'Hero',
    model: "XPulse 200 Pro 4V",
    year: 2026,
    price: 13490000,
    category: 'Adventure',
    description: "La Hero XPulse 200 Pro 4V es la versión Pro con tablero TFT a color y equipamiento de alta gama. Motor 4V de 19 HP, suspensión ajustable, ABS desconectable para off-road y protecciones integrales. Para los aventureros serios que exigen la mejor tecnología en su moto.",
    specifications: {
      engine: "199.6cc, 4 tiempos, OHC, 4 válvulas, inyección electrónica",
      power: "19 HP @ 8,500 RPM",
      torque: "16.5 Nm @ 6,500 RPM",
      transmission: "5 velocidades",
      weight: "158 kg",
      fuelCapacity: "13 litros",
      colors: ["Negro"],
    },
    imagesByColor: {
          "Negro": [
                "/moto_images/xpulse-200-pro-4v/xpulse200Pro4vNegro.png"
          ]
    },
    images: ["/moto_images/xpulse-200-pro-4v/xpulse200Pro4vNegro.png"],
    featured: true,
    stock: 'available',
  },
  {
    id: '95',
    brand: 'Hero',
    model: "XPulse 200 R 4V",
    year: 2026,
    price: 14990000,
    category: 'Adventure',
    description: "La Hero XPulse 200 R 4V es la versión Rally más equipada de la gama XPulse. Colores de competencia, doble amortigiguador trasero, depósito auxiliar de combustible y tablero TFT con waypoints de rally. La XPulse que parece salida directamente de una etapa del Dakar.",
    specifications: {
      engine: "199.6cc, 4 tiempos, OHC, 4 válvulas, inyección electrónica",
      power: "19 HP @ 8,500 RPM",
      torque: "16.5 Nm @ 6,500 RPM",
      transmission: "5 velocidades",
      weight: "160 kg",
      fuelCapacity: "15 litros",
    },
    images: ["/moto_images/xpulse-200-r-4v/xpulseRallyColor.png"],
    stock: 'limited',
  },
  {
    id: '96',
    brand: 'Vento',
    model: "Alpina 300 EFI",
    year: 2026,
    price: 12490000,
    category: 'Enduro',
    description: "La Vento Alpina 300 EFI es la trail mediana con inyección electrónica de la gama Vento. Motor de 300cc monocilíndrico con FI, suspensión de largo recorrido, frenos de disco doble ABS y diseño retro-adventure de líneas clásicas. La moto para quien valora tradición y rendimiento.",
    specifications: {
      engine: "299cc, 4 tiempos, monocilíndrico, inyección electrónica",
      power: "24 HP @ 7,500 RPM",
      torque: "24 Nm @ 6,000 RPM",
      transmission: "5 velocidades",
      weight: "168 kg",
      fuelCapacity: "16 litros",
    },
    images: ["/moto_images/alpina-300-efi/vento-alpina-300-02.jpg","/moto_images/alpina-300-efi/vento-alpina-300-06.jpg","/moto_images/alpina-300-efi/vento-alpina-300-10.jpg","/moto_images/alpina-300-efi/vento-alpina-300-14.jpg","/moto_images/alpina-300-efi/vento-alpina-300-16.jpg"],
    featured: true,
    stock: 'available',
  },
  {
    id: '97',
    brand: 'Vento',
    model: "CrossMax 200 Pro",
    year: 2026,
    price: 10490000,
    category: 'Enduro',
    description: "La Vento CrossMax 200 Pro es la moto todo terreno que ha conquistado los caminos colombianos. Motor de 200cc resistente, suspensión de largo recorrido delantera y trasera, neumáticos anchos de barro y diseño robusto. Para dominar los caminos destapados del Eje Cafetero.",
    specifications: {
      engine: "197cc, 4 tiempos, monocilíndrico",
      power: "15.5 HP @ 8,000 RPM",
      torque: "15 Nm @ 6,000 RPM",
      transmission: "5 velocidades",
      weight: "148 kg",
      fuelCapacity: "12 litros",
    },
    images: ["/moto_images/crossmax-200/GAL-CROSSMAX200PRO-01-1024x819.jpg","/moto_images/crossmax-200/GAL-CROSSMAX200PRO-02-1024x819.jpg","/moto_images/crossmax-200/GAL-CROSSMAX200PRO-04-1024x819.jpg","/moto_images/crossmax-200/colombia-vento-crossmax-200-pro-360-1024x608.jpg"],
    featured: true,
    stock: 'available',
  },
  {
    id: '98',
    brand: 'Vento',
    model: "Falkon 125",
    year: 2026,
    price: 6990000,
    category: 'Urban Sport',
    description: "La Vento Falkon 125 es la naked de diseño europeo al precio colombiano. Motor de 125cc de alto rendimiento, faros LED, freno de disco doble y líneas inspiradas en las naked italianas. Para los jóvenes que quieren estilo premium sin el precio importado.",
    specifications: {
      engine: "124.8cc, 4 tiempos, monocilíndrico",
      power: "10.5 HP @ 8,000 RPM",
      torque: "10.5 Nm @ 6,000 RPM",
      transmission: "5 velocidades",
      weight: "128 kg",
      fuelCapacity: "12 litros",
    },
    images: ["/moto_images/falkon-125/GAL-VENTO-FALKON-220-02-1024x819.jpg","/moto_images/falkon-125/GAL-VENTO-FALKON-220-03-1024x819.jpg","/moto_images/falkon-125/GAL-VENTO-FALKON-220-04-1024x819.jpg","/moto_images/falkon-125/GAL-VENTO-FALKON-220-06-1024x819.jpg","/moto_images/falkon-125/GAL-VENTO-FALKON-220-08-1024x819.jpg"],
    stock: 'available',
  },
  {
    id: '99',
    brand: 'Vento',
    model: "GTS 300",
    year: 2026,
    price: 16990000,
    category: 'Scooters',
    description: "La Vento GTS 300 es el maxi-scooter de lujo con más espacio de carga del mercado. Motor de 300cc con inyección electrónica, frenos ABS, cajuela enorme para dos cascos y asiento calefactado como opción. El ejecutivo se mueve en GTS 300.",
    specifications: {
      engine: "299cc, 4 tiempos, monocilíndrico, inyección electrónica",
      power: "26 HP @ 7,500 RPM",
      torque: "26 Nm @ 5,500 RPM",
      transmission: "Automática (CVT)",
      weight: "195 kg",
      fuelCapacity: "11 litros",
    },
    images: ["/moto_images/gts-300/vento-gts-300-cajuela-02.jpg","/moto_images/gts-300/vento-gts-300-cajuela-08.jpg","/moto_images/gts-300/vento-gts-300-cajuela-10.jpg","/moto_images/gts-300/vento-gts-300-cajuela-13.jpg","/moto_images/gts-300/vento-gts-300-cajuela-16.jpg"],
    featured: true,
    stock: 'available',
  },
  {
    id: '100',
    brand: 'Vento',
    model: "Lithium 125",
    year: 2026,
    price: 7490000,
    category: 'City',
    description: "La Vento Lithium 125 es la naked con diseño naked moderno y motor de 125cc eficiente. Faros LED, frenos de disco en ambas ruedas, tablero digital y el estilo urbano que define a la gama Lithium de Vento. Moderna, práctica y con el respaldo de Vento.",
    specifications: {
      engine: "124.8cc, 4 tiempos, monocilíndrico",
      power: "10.5 HP @ 8,000 RPM",
      torque: "10.5 Nm @ 6,000 RPM",
      transmission: "5 velocidades",
      weight: "128 kg",
      fuelCapacity: "12 litros",
    },
    images: ["/moto_images/lithium-125/VENTO-LITHIUM-125-4-01.jpg","/moto_images/lithium-125/VENTO-LITHIUM-125-4-02.jpg","/moto_images/lithium-125/VENTO-LITHIUM-125-4-08.jpg"],
    stock: 'available',
  },
  {
    id: '101',
    brand: 'Vento',
    model: "Presley 200 ABS",
    year: 2026,
    price: 11990000,
    category: 'Rebels',
    description: "La Vento Presley 200 ABS es el cruiser que combina el estilo retro americano con la practicidad de una 200cc. Motor de 197cc suave y torquento, posición de manejo relajada de crucero, frenos ABS de serie y diseño inspirado en las grandes cruiser americanas. Para los que van al ritmo de su propia música.",
    specifications: {
      engine: "197cc, 4 tiempos, monocilíndrico",
      power: "14 HP @ 7,000 RPM",
      torque: "15 Nm @ 5,000 RPM",
      transmission: "5 velocidades",
      weight: "172 kg",
      fuelCapacity: "14 litros",
    },
    images: ["/moto_images/presley-200-abs/vento-latam-presley-200-01.jpg","/moto_images/presley-200-abs/vento-latam-presley-200-02.jpg","/moto_images/presley-200-abs/vento-latam-presley-200-05.jpg","/moto_images/presley-200-abs/vento-latam-presley-200-08.jpg","/moto_images/presley-200-abs/vento-latam-presley-200-13.jpg"],
    featured: true,
    stock: 'available',
  },
  {
    id: '102',
    brand: 'Vento',
    model: "Rapid 125",
    year: 2026,
    price: 6490000,
    category: 'City',
    description: "La Vento Rapid 125 es la moto city de Vento con el perfil más dinámico. Motor de 125cc ágil, freno de disco delantero, suspensión deportiva y diseño de líneas rápidas. Para moverse con estilo por la ciudad sin gastar de más en combustible ni mantenimiento.",
    specifications: {
      engine: "124.8cc, 4 tiempos, monocilíndrico",
      power: "10 HP @ 8,000 RPM",
      torque: "10 Nm @ 6,000 RPM",
      transmission: "5 velocidades",
      weight: "124 kg",
      fuelCapacity: "12 litros",
    },
    images: ["/moto_images/rapid-125/GAL-RAPID-125-01-1024x819.jpg","/moto_images/rapid-125/GAL-RAPID-125-02-1024x819.jpg","/moto_images/rapid-125/GAL-RAPID-125-04-1024x819.jpg","/moto_images/rapid-125/GAL-RAPID-125-05-1024x819.jpg","/moto_images/rapid-125/GAL-RAPID-125-07-1024x819.jpg"],
    stock: 'available',
  },
  {
    id: '103',
    brand: 'Vento',
    model: "Screamer 250 FI",
    year: 2026,
    price: 12990000,
    category: 'Urban Sport',
    description: "La Vento Screamer 250 FI es la deportiva 250 con inyección electrónica de la gama Vento. Motor de 249cc con FI y 25 HP, frenos de disco doble ABS, suspensión invertida y carenado deportivo completo. La deportiva que hace \"screamer\" con el motor y el bolsillo.",
    specifications: {
      engine: "249cc, 4 tiempos, monocilíndrico, inyección electrónica",
      power: "25 HP @ 9,000 RPM",
      torque: "23 Nm @ 7,000 RPM",
      transmission: "6 velocidades",
      weight: "165 kg",
      fuelCapacity: "14 litros",
    },
    images: ["/moto_images/screamer-250-fi/A-SCREAMER-SPORTIVO-250-02.jpg","/moto_images/screamer-250-fi/A-SCREAMER-SPORTIVO-250-09.jpg","/moto_images/screamer-250-fi/A-SCREAMER-SPORTIVO-250-12.jpg","/moto_images/screamer-250-fi/A-SCREAMER-SPORTIVO-250-16.jpg"],
    featured: true,
    stock: 'available',
  },
  {
    id: '104',
    brand: 'Vento',
    model: "Spirit 125 ZX",
    year: 2026,
    price: 6990000,
    category: 'City',
    description: "La Vento Spirit 125 ZX es la moto urbana con espíritu de aventura. Diseño semi-trail, motor de 125cc confiable, guardabarros alto de estilo adventure y posición de manejo ergonómica. Para quienes quieren la practicidad de una city con el carácter de una trail.",
    specifications: {
      engine: "124.8cc, 4 tiempos, monocilíndrico",
      power: "10 HP @ 7,500 RPM",
      torque: "10.2 Nm @ 5,500 RPM",
      transmission: "5 velocidades",
      weight: "128 kg",
      fuelCapacity: "12 litros",
    },
    images: ["/moto_images/spirit-125/GAL-VENTO-SPIRIT-125-ZX-02-1024x819.jpg","/moto_images/spirit-125/GAL-VENTO-SPIRIT-125-ZX-03-1024x819.jpg","/moto_images/spirit-125/GAL-VENTO-SPIRIT-125-ZX-05-1024x819.jpg","/moto_images/spirit-125/GAL-VENTO-SPIRIT-125-ZX-06-1024x819.jpg","/moto_images/spirit-125/GAL-VENTO-SPIRIT-125-ZX-07-1024x819.jpg"],
    stock: 'available',
  },
  {
    id: '105',
    brand: 'Good Kidz',
    model: "Motos de Niños",
    year: 2026,
    price: 1290000,
    category: 'Niños',
    description: "Las Good Kidz son las motos para niños más seguras del mercado colombiano. Disponibles en versiones de 60cc de 2 tiempos y 4 tiempos, con velocidad limitada, protecciones integrales y diseño colorido que los niños aman. El regalo perfecto para iniciar a los más pequeños en el mundo de las dos ruedas.",
    specifications: {
      engine: "60cc, 2T / 4T, monocilíndrico",
      power: "3-4 HP",
      torque: "4-5 Nm",
      transmission: "Automática / 3 velocidades",
      weight: "45 kg",
      fuelCapacity: "2 litros",
    },
    images: ["/moto_images/motos-nios/KB57 60CC 4T.jpg","/moto_images/motos-nios/KB57 60CC 4T2.jpg","/moto_images/motos-nios/MOTO 60CC 2T 1E.jpg","/moto_images/motos-nios/MOTO 60CC 2T 1E2.jpg","/moto_images/motos-nios/MOTO 60CC 2T 1E3.jpg"],
    stock: 'available',
  },
];

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Carlos M.',
    text: 'Excelente servicio y atención. Mi Vento Tornado 250 está impecable gracias al mantenimiento de Ibiza Motos.',
    rating: 5,
  },
  {
    id: '2',
    name: 'Laura G.',
    text: 'El mejor lugar del Eje Cafetero para comprar moto. Me asesoraron perfecto y encontré la ideal para mi.',
    rating: 5,
  },
  {
    id: '3',
    name: 'Andrés P.',
    text: 'Servicio técnico de primera. Diagnosticaron un problema que otros talleres no pudieron.',
    rating: 5,
  },
  {
    id: '4',
    name: 'María J.',
    text: 'Precios justos y motos de calidad. Totalmente recomendados.',
    rating: 5,
  },
  {
    id: '5',
    name: 'Diego R.',
    text: 'Desde que compré mi Suzuki aquí, no he ido a otro lugar. Son los mejores.',
    rating: 5,
  },
];

export const services: Service[] = [
  {
    id: '1',
    name: 'Mantenimiento Preventivo',
    description: 'Revisión completa para mantener tu moto en perfecto estado. Incluye cambio de aceite, revisión de frenos, suspensión y sistema eléctrico.',
    icon: 'Wrench',
    price: 'Desde $150.000',
  },
  {
    id: '2',
    name: 'Reparación de Motor',
    description: 'Diagnóstico y reparación con equipos especializados. Técnicos certificados en todas las marcas.',
    icon: 'Cog',
    price: 'Cotización gratuita',
  },
  {
    id: '3',
    name: 'Sistema Eléctrico',
    description: 'Solución de problemas eléctricos y electrónicos. Diagnóstico computarizado y reparación de fallas.',
    icon: 'Zap',
    price: 'Desde $80.000',
  },
  {
    id: '4',
    name: 'Suspensión y Frenos',
    description: 'Seguridad en cada componente crítico. Revisión, mantenimiento y reparación de sistemas de suspensión y frenos.',
    icon: 'Shield',
    price: 'Desde $120.000',
  },
];

export const branches: Branch[] = [
  {
    id: '1',
    name: 'Sede Principal',
    address: 'Carrera 23 # 23-45, Armenia, Quindío',
    phone: '(+57) 321 456 7890',
    hours: 'Lunes a Sábado: 8:00 AM - 6:00 PM',
    coordinates: { lat: 4.5339, lng: -75.6811 },
  },
  {
    id: '2',
    name: 'Sede Norte',
    address: 'Calle 20 # 15-80, Armenia, Quindío',
    phone: '(+57) 321 456 7891',
    hours: 'Lunes a Sábado: 9:00 AM - 7:00 PM',
    coordinates: { lat: 4.545, lng: -75.69 },
  },
  {
    id: '3',
    name: 'Sede Circasia',
    address: 'Carrera 5 # 8-45, Circasia, Quindío',
    phone: '(+57) 321 456 7892',
    hours: 'Lunes a Sábado: 8:30 AM - 6:30 PM',
    coordinates: { lat: 4.618, lng: -75.635 },
  },
];

export const spareParts: SparePart[] = [
  {
    id: '1',
    name: 'Filtro de Aceite',
    category: 'Motor',
    price: 25000,
    compatibility: ['Honda', 'Suzuki', 'Vento'],
    image: '/spares/filtro-aceite.jpg',
    stock: true,
  },
  {
    id: '2',
    name: 'Pastillas de Freno Delanteras',
    category: 'Frenos',
    price: 45000,
    compatibility: ['Bajaj', 'AKT', 'Hero'],
    image: '/spares/pastillas-freno.jpg',
    stock: true,
  },
  {
    id: '3',
    name: 'Batería 12V 5Ah',
    category: 'Eléctrico',
    price: 120000,
    compatibility: ['Todas las marcas'],
    image: '/spares/bateria.jpg',
    stock: true,
  },
  {
    id: '4',
    name: 'Cadena 428H',
    category: 'Transmisión',
    price: 85000,
    compatibility: ['Suzuki', 'Vento', 'Bajaj'],
    image: '/spares/cadena.jpg',
    stock: true,
  },
  {
    id: '5',
    name: 'Kit de Arrastre',
    category: 'Transmisión',
    price: 145000,
    compatibility: ['Honda', 'AKT', 'Hero'],
    image: '/spares/kit-arrastre.jpg',
    stock: false,
  },
  {
    id: '6',
    name: 'Aceite 20W-50',
    category: 'Lubricantes',
    price: 35000,
    compatibility: ['Todas las marcas'],
    image: '/spares/aceite.jpg',
    stock: true,
  },
  {
    id: '7',
    name: 'Filtro de Aire',
    category: 'Motor',
    price: 30000,
    compatibility: ['Vento', 'Bajaj', 'AKT'],
    image: '/spares/filtro-aire.jpg',
    stock: true,
  },
  {
    id: '8',
    name: 'Bujía NGK',
    category: 'Encendido',
    price: 18000,
    compatibility: ['Todas las marcas'],
    image: '/spares/bujia.jpg',
    stock: true,
  },
];

export const getFeaturedMotorcycles = (): Motorcycle[] => {
  return motorcycles.filter(m => m.featured);
};

export const getMotorcyclesByBrand = (brand: string): Motorcycle[] => {
  return motorcycles.filter(m => m.brand.toLowerCase() === brand.toLowerCase());
};

export const getMotorcyclesByCategory = (category: string): Motorcycle[] => {
  return motorcycles.filter(m => m.category.toLowerCase() === category.toLowerCase());
};

export const getMotorcycleById = (id: string): Motorcycle | undefined => {
  return motorcycles.find(m => m.id === id);
};
