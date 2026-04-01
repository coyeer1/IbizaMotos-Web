import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Clock, ArrowRight, Eye, Heart, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { posts, categoryStyles } from '@/data/blogPosts';

const CATEGORIES = ['Todos', 'Mantenimiento', 'Compra Inteligente', 'Seguridad', 'Tendencias', 'Técnica'];

export default function Blog() {
  const { ref, isVisible } = useScrollAnimation({ threshold: 0.05 });
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();

  const filtered = activeCategory === 'Todos'
    ? posts
    : posts.filter(p => p.category === activeCategory);

  const featured = posts.find(p => p.featured)!;
  const displayPosts = showAll ? filtered : filtered.slice(0, 5);

  return (
    <section id="blog" ref={ref} className="py-24 bg-white overflow-hidden relative">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-ibiza-red/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-slate-200/60 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10"
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-ibiza-red flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <p className="text-ibiza-red font-display font-semibold text-sm tracking-widest uppercase">
                Blog & Noticias
              </p>
            </div>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-gray-900">
              TIPS Y <span className="text-ibiza-red">NOVEDADES</span>
            </h2>
          </div>
          <p className="text-gray-500 max-w-xs text-sm">
            Guías, consejos y noticias del mundo de las motos en el Eje Cafetero.
          </p>
        </motion.div>

        {/* Category filter tabs */}
        <motion.div
          className="flex flex-wrap gap-2 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setShowAll(false); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-ibiza-red text-white shadow-[0_0_15px_rgba(227,25,55,0.3)]'
                  : 'bg-gray-50 text-gray-500 border border-gray-200 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {cat}
              {cat !== 'Todos' && (
                <span className="ml-1.5 text-[9px] opacity-60">
                  ({posts.filter(p => p.category === cat).length})
                </span>
              )}
            </button>
          ))}
        </motion.div>

        {/* Featured post — only when "Todos" */}
        {activeCategory === 'Todos' && (
          <motion.article
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            onClick={() => navigate(`/blog/${featured.id}`)}
            className="group cursor-pointer mb-8"
          >
            <div className="relative rounded-3xl overflow-hidden h-64 md:h-96">
              <img
                src={featured.image}
                alt={featured.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

              <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`text-[10px] font-bold tracking-widest px-3 py-1.5 rounded-full border uppercase ${categoryStyles[featured.category]}`}>
                    {featured.category}
                  </span>
                  <span className="bg-ibiza-red text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest">
                    Destacado
                  </span>
                </div>

                <h3 className="font-display font-black text-2xl md:text-4xl text-white leading-tight mb-3 max-w-2xl group-hover:text-ibiza-gold transition-colors duration-300">
                  {featured.title}
                </h3>

                <div className="flex items-center gap-4 text-xs text-white/50">
                  <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{featured.readTime}</span>
                  <span className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" />{featured.views.toLocaleString()} vistas</span>
                  <span className="flex items-center gap-1.5"><Heart className="w-3.5 h-3.5" />{featured.likes}</span>
                  <span className="ml-auto flex items-center gap-1.5 text-white font-bold text-sm group-hover:gap-3 transition-all">
                    Leer artículo <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          </motion.article>
        )}

        {/* Posts grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayPosts
            .filter(p => activeCategory !== 'Todos' || p.id !== featured.id)
            .map((post, i) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.08 }}
                onClick={() => navigate(`/blog/${post.id}`)}
                className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-ibiza-red/20 hover:bg-gray-50 transition-all duration-300 shadow-sm"
              >
                {/* Thumbnail */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className={`text-[9px] font-bold tracking-widest px-2.5 py-1 rounded-full border uppercase ${categoryStyles[post.category]}`}>
                      {post.category}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-full">
                    <Clock className="w-3 h-3 text-white/50" />
                    <span className="text-[10px] text-white/50">{post.readTime}</span>
                  </div>
                </div>

                <div className="p-5">
                  <p className="text-[11px] text-gray-600 mb-2">{post.date}</p>
                  <h4 className="font-display font-bold text-base text-gray-900 leading-snug mb-3 group-hover:text-ibiza-red transition-colors duration-300 line-clamp-2">
                    {post.title}
                  </h4>
                  <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-4">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      {post.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-[9px] text-gray-400 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-gray-600">
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{post.views >= 1000 ? `${(post.views/1000).toFixed(1)}k` : post.views}</span>
                      <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{post.likes}</span>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
        </div>

        {/* Show more */}
        {filtered.length > 5 && !showAll && (
          <motion.div
            className="text-center mt-8"
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : {}}
            transition={{ delay: 0.5 }}
          >
            <button
              onClick={() => setShowAll(true)}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl border border-gray-200 text-gray-500 text-sm font-bold hover:border-ibiza-red/30 hover:text-ibiza-red transition-all duration-300 group"
            >
              Ver todos los artículos
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
