import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const categories = [
  {
    slug: 'urbanas',
    name: 'Urbanas',
    description: 'Para el trabajo diario en la ciudad',
    filterCategory: 'City',
    image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=1200',
    accent: '#d7263d',
    position: 'center center',
  },
  {
    slug: 'sport',
    name: 'Sport',
    description: 'Adrenalina y rendimiento deportivo',
    filterCategory: 'Urban Sport',
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&q=80&w=1200',
    accent: '#E53E3E',
    position: 'center center',
  },
  {
    slug: 'enduro',
    name: 'Enduro',
    description: 'Conquista cualquier terreno',
    filterCategory: 'Enduro',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1200',
    accent: '#38A169',
    position: 'center center',
  },
  {
    slug: 'adventure',
    name: 'Adventure',
    description: 'Diseñadas para la larga distancia',
    filterCategory: 'Adventure',
    image: 'https://images.unsplash.com/photo-1547149600-a6cdf8fce60c?auto=format&fit=crop&q=80&w=1200',
    accent: '#DD6B20',
    position: 'center center',
  },
  {
    slug: 'scooters',
    name: 'Scooters',
    description: 'Agilidad y comodidad automática',
    filterCategory: 'Scooters',
    image: 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&q=80&w=1200',
    accent: '#3182CE',
    position: 'center center',
  },
  {
    slug: 'ninos',
    name: 'Para Niños',
    description: 'Sus primeras aventuras sobre ruedas',
    filterCategory: 'Niños',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=1200',
    accent: '#805AD5',
    position: 'center center',
  },
];

export default function Categories() {
  const navigate = useNavigate();

  const handleCategoryClick = (filterCategory: string) => {
    navigate(`/?categoria=${filterCategory}`);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8">
          <div>
            <p className="text-ibiza-red font-display font-semibold text-xs tracking-[0.25em] uppercase mb-2">
              Explora por tipo
            </p>
            <h2 className="font-display font-black text-4xl md:text-5xl text-gray-900 tracking-tight leading-none">
              NUESTRAS<br />CATEGORÍAS
            </h2>
          </div>
          <button
            onClick={() => navigate('/marca/suzuki')}
            className="inline-flex items-center gap-2 text-ibiza-red font-display font-semibold text-sm hover:gap-3 transition-all duration-300 self-start sm:self-auto"
          >
            Ver todo el catálogo <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Bento grid — 2 cols on mobile, 3 cols on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {categories.map((cat, i) => (
            <motion.button
              key={cat.slug}
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              onClick={() => handleCategoryClick(cat.filterCategory)}
              className="group relative overflow-hidden rounded-2xl cursor-pointer"
              style={{ minHeight: '260px' }}
            >
              {/* Background image */}
              <img
                src={cat.image}
                alt={cat.name}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                style={{ objectPosition: cat.position }}
              />

              {/* Gradient overlay — lighter at top so bike shows, heavier at bottom for text */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />

              {/* Accent line bottom */}
              <div
                className="absolute bottom-0 left-0 right-0 h-[3px]"
                style={{ background: cat.accent }}
              />

              {/* Content bottom */}
              <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-5">
                <p className="font-display font-black text-white text-xl sm:text-2xl leading-tight">
                  {cat.name}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-white/60 text-xs leading-snug hidden sm:block">
                    {cat.description}
                  </p>
                  <div
                    className="flex items-center justify-center w-8 h-8 rounded-full ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300 flex-shrink-0"
                    style={{ background: cat.accent }}
                  >
                    <ArrowRight className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
