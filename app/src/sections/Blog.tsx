import { useState } from 'react';
import { Clock, ArrowRight, Eye, Heart, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Reveal from '@/components/Reveal';
import { posts, categoryStyles } from '@/data/blogPosts';
import { useBlogMetrics } from '@/hooks/useBlogMetrics';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const CATEGORIES = ['Todos', 'Mantenimiento', 'Compra Inteligente', 'Seguridad', 'Tendencias', 'Técnica'];

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();

  const filtered = activeCategory === 'Todos'
    ? posts
    : posts.filter(p => p.category === activeCategory);

  const featured = posts.find(p => p.featured)!;
  const displayPosts = showAll ? filtered : filtered.slice(0, 5);

  // El blog está al final del home y la mayoría de visitas nunca llegan hasta
  // acá. Solo pedimos las métricas a Supabase cuando la sección se asoma (200px
  // antes de entrar en pantalla) → una visita normal hace CERO consultas a la BD.
  const { ref: blogRef, isVisible: blogVisible } = useScrollAnimation({ threshold: 0, rootMargin: '200px' });
  const { metrics } = useBlogMetrics({ enabled: blogVisible });

  const getViewCount = (post: any) => post.views + (metrics[post.id]?.views_count || 0);
  const getLikeCount = (post: any) => post.likes + (metrics[post.id]?.likes_count || 0);

  return (
    <section id="blog" ref={blogRef} className="py-28 md:py-32 bg-white overflow-hidden relative" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <Reveal direction="up" className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <span
              className="inline-block uppercase mb-4"
              style={{ fontSize: 11, letterSpacing: '0.15em', color: '#999' }}
            >
              Blog &amp; Noticias
            </span>
            <h2
              className="font-display text-5xl md:text-6xl text-black"
              style={{ lineHeight: 0.95, letterSpacing: '-0.5px' }}
            >
              TIPS Y <span style={{ color: '#E31937' }}>NOVEDADES</span>
            </h2>
          </div>
          <p className="max-w-xs text-sm" style={{ color: '#777', fontWeight: 300, lineHeight: 1.65 }}>
            Guías, consejos y noticias del mundo de las motos en el Eje Cafetero.
          </p>
        </Reveal>

        {/* Category filter tabs */}
        <Reveal delay={0.08} direction="up" className="flex flex-wrap gap-2 mb-12">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setShowAll(false); }}
              className="text-xs font-semibold tracking-wide transition-all duration-200 hover:scale-[1.02]"
              style={
                activeCategory === cat
                  ? { padding: '8px 18px', borderRadius: 8, background: '#000', color: '#fff', border: '1px solid #000' }
                  : { padding: '8px 18px', borderRadius: 8, background: '#fff', color: '#888', border: '1px solid #e8e8e8' }
              }
            >
              {cat}
              {cat !== 'Todos' && (
                <span className="ml-1.5 text-[9px] opacity-60">
                  ({posts.filter(p => p.category === cat).length})
                </span>
              )}
            </button>
          ))}
        </Reveal>

        {/* Featured post — only when "Todos" */}
        {activeCategory === 'Todos' && (
          <Reveal delay={0.16} direction="up" className="mb-10">
          <article
            onClick={() => navigate(`/blog/${featured.id}`)}
            className="group cursor-pointer"
          >
            <div
              className="relative rounded-2xl overflow-hidden h-[28rem] md:h-[36rem] transition-shadow duration-300"
              style={{ border: '1px solid #e8e8e8', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
            >
              <img
                src={featured.image}
                alt={featured.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

              <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`text-[10px] font-bold tracking-widest px-3 py-1.5 rounded-full border uppercase ${categoryStyles[featured.category]}`}>
                    {featured.category}
                  </span>
                  <span
                    className="text-white text-[9px] font-bold px-2.5 py-1 rounded-full uppercase"
                    style={{ background: '#E31937', letterSpacing: '0.12em' }}
                  >
                    Destacado
                  </span>
                </div>

                <h3
                  className="font-display text-4xl md:text-6xl text-white mb-6 max-w-2xl"
                  style={{ lineHeight: 0.98, letterSpacing: '-0.5px' }}
                >
                  {featured.title}
                </h3>

                <div className="flex items-center gap-4 text-xs text-white/50">
                  <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{featured.readTime}</span>
                  <span className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" />{getViewCount(featured).toLocaleString()} vistas</span>
                  <span className="flex items-center gap-1.5"><Heart className="w-3.5 h-3.5" />{getLikeCount(featured)}</span>
                  <span className="ml-auto flex items-center gap-1.5 text-white font-bold text-sm group-hover:gap-3 transition-all">
                    Leer artículo <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          </article>
          </Reveal>
        )}

        {/* Posts grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayPosts
            .filter(p => activeCategory !== 'Todos' || p.id !== featured.id)
            .map((post, i) => (
              <Reveal
                key={post.id}
                delay={Math.min(i, 6) * 0.08}
                direction="up"
              >
              <article
                onClick={() => navigate(`/blog/${post.id}`)}
                className="group cursor-pointer bg-white rounded-xl p-3 hover:-translate-y-1.5 transition-all duration-300"
                style={{ border: '1px solid #e8e8e8' }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.08)'; e.currentTarget.style.borderColor = '#d8d8d8'; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = '#e8e8e8'; }}
              >
                {/* Thumbnail */}
                <div className="relative h-48 md:h-52 overflow-hidden rounded-lg mb-5">
                  <img
                    src={post.image}
                    alt={post.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className={`text-[9px] font-bold tracking-widest px-2.5 py-1 rounded-full border uppercase ${categoryStyles[post.category]}`}>
                      {post.category}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-full">
                    <Clock className="w-3 h-3 text-white/60" />
                    <span className="text-[10px] text-white/60">{post.readTime}</span>
                  </div>
                </div>

                <div className="px-3 pb-3">
                  <div className="flex items-center gap-3 mb-3">
                    <p className="text-[11px] font-medium uppercase tracking-wider" style={{ color: '#aaa' }}>{post.date}</p>
                  </div>
                  <h4
                    className="font-display text-xl mb-3 line-clamp-2 transition-colors duration-200"
                    style={{ color: '#000', lineHeight: 1.1, letterSpacing: '-0.2px' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#E31937'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#000'; }}
                  >
                    {post.title}
                  </h4>
                  <p className="text-xs leading-relaxed line-clamp-2 mb-4" style={{ color: '#888' }}>
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between mt-4 pt-4" style={{ borderTop: '1px solid #f0f0f0' }}>
                    <div className="flex gap-2">
                      {post.tags.slice(0, 2).map(tag => (
                        <span
                          key={tag}
                          className="text-[10px] uppercase tracking-wide font-semibold px-2 py-1 rounded-md"
                          style={{ color: '#888', background: '#f5f5f5', border: '1px solid #f0f0f0' }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-3 text-[10px]" style={{ color: '#999' }}>
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{getViewCount(post) >= 1000 ? `${(getViewCount(post)/1000).toFixed(1)}k` : getViewCount(post)}</span>
                      <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{getLikeCount(post)}</span>
                    </div>
                  </div>
                </div>
              </article>
              </Reveal>
            ))}
        </div>

        {/* Show more */}
        {filtered.length > 5 && !showAll && (
          <Reveal direction="fade" className="text-center mt-12">
            <button
              onClick={() => setShowAll(true)}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg text-sm font-semibold transition-all duration-200 group hover:bg-black hover:text-white hover:border-black"
              style={{ border: '1px solid #d0d0d0', color: '#000', background: 'transparent' }}
            >
              Ver todos los artículos
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </Reveal>
        )}
      </div>
    </section>
  );
}
