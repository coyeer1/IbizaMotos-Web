import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Clock, Eye, Heart, Share2, Tag,
  BookOpen, ChevronRight, MessageCircle,
} from 'lucide-react';
import { posts, categoryStyles } from '@/data/blogPosts';
import { Button } from '@/components/ui/button';
import { getWhatsAppUrl } from '@/lib/config';
import { useBlogMetrics } from '@/hooks/useBlogMetrics';
import { useSEO } from '@/hooks/useSEO';

function renderBody(paragraph: string, index: number) {
  const parts = paragraph.split(/\*\*(.*?)\*\*/g);
  return (
    <p key={index} className="text-[#444444] text-base md:text-lg leading-relaxed">
      {parts.map((part, j) =>
        j % 2 === 1
          ? <strong key={j} className="text-[#111111] font-semibold">{part}</strong>
          : part
      )}
    </p>
  );
}

export default function BlogPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);

  const post = posts.find(p => p.id === Number(id));
  const related = posts.filter(p => p.id !== post?.id && p.category === post?.category).slice(0, 2);
  const otherPosts = posts.filter(p => p.id !== post?.id && !related.includes(p)).slice(0, 2 - related.length);
  const suggestions = [...related, ...otherPosts].slice(0, 3);

  const { metrics, recordView, recordLike } = useBlogMetrics();

  useSEO(
    post
      ? {
          title: `${post.title} | Blog Ibiza Motos`,
          description: post.excerpt,
          path: `/blog/${post.id}`,
          image: post.image,
          type: 'article',
        }
      : { title: 'Artículo no encontrado | Blog Ibiza Motos' }
  );

  useEffect(() => {
    window.scrollTo({ top: 0 });
    if (post) {
      recordView(post.id);
    }
  }, [id, post, recordView]);

  const viewCount = post ? post.views + (metrics[post.id]?.views_count || 0) : 0;
  const likeCount = post ? post.likes + (metrics[post.id]?.likes_count || 0) : 0;

  if (!post) {
    return (
      <div className="min-h-screen bg-[#ffffff] flex flex-col items-center justify-center gap-6 text-center px-4">
        <BookOpen className="w-16 h-16 text-[#999999]" />
        <h1 className="font-display font-black text-3xl text-[#111111]">Artículo no encontrado</h1>
        <p className="text-[#999999]">El artículo que buscas no existe o fue eliminado.</p>
        <Button onClick={() => navigate('/')} className="bg-ibiza-red hover:bg-ibiza-red/90 text-white font-bold rounded-xl">
          Volver al inicio
        </Button>
      </div>
    );
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: post.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="min-h-screen bg-[#ffffff]">
      {/* Hero image */}
      <div className="relative h-64 md:h-[480px] overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-[#ffffff]" />

        {/* Enhanced Navigation Bar inside the Hero */}
        <div className="absolute top-0 left-0 right-0 p-6 z-50 flex items-center justify-between">
          <button
            onClick={() => navigate('/#blog')}
            className="group flex items-center gap-2 text-sm text-white/80 hover:text-white transition-all bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10 px-5 py-2.5 rounded-full shadow-lg"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-semibold tracking-wide">Volver al Blog</span>
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-white/50 text-xs font-bold uppercase tracking-widest hidden sm:block">Ibiza Motos</span>
          </div>
        </div>

        {/* Category badge over image */}
        <div className="absolute bottom-8 left-0 right-0 max-w-4xl mx-auto px-4 sm:px-6">
          <span className={`inline-block text-[10px] font-bold tracking-widest px-3 py-1.5 rounded-full border uppercase ${categoryStyles[post.category]}`}>
            {post.category}
          </span>
        </div>
      </div>

      {/* Article content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-[#999999] mt-6 mb-5">
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{post.readTime} de lectura</span>
            <span className="w-1 h-1 rounded-full bg-[#cccccc]" />
            <span>{post.date}</span>
            <span className="w-1 h-1 rounded-full bg-[#cccccc]" />
            <span className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" />{viewCount.toLocaleString()} vistas</span>
          </div>

          {/* Title */}
          <h1 className="font-display font-black text-3xl md:text-5xl text-[#111111] leading-tight mb-8">
            {post.title}
          </h1>

          {/* Excerpt (lead) */}
          <p className="text-[#444444] text-lg md:text-xl leading-relaxed border-l-2 border-ibiza-red pl-5 mb-10">
            {post.excerpt}
          </p>

          {/* Body paragraphs */}
          <div className="space-y-5 mb-10">
            {post.body.map((p, i) => renderBody(p, i))}
          </div>

          {/* Tags + actions */}
          <div className="flex flex-wrap items-center gap-3 pt-8 border-t border-[#ececec]">
            {post.tags.map(tag => (
              <span key={tag} className="flex items-center gap-1.5 text-xs text-[#999999] bg-[#f7f7f7] border border-[#e8e8e8] px-3 py-1.5 rounded-lg">
                <Tag className="w-3 h-3" />{tag}
              </span>
            ))}
            <div className="ml-auto flex items-center gap-4">
              <button
                onClick={() => {
                  if (!liked && post) {
                    setLiked(true);
                    recordLike(post.id);
                  }
                }}
                className={`flex items-center gap-1.5 text-sm font-bold transition-colors ${liked ? 'text-ibiza-red cursor-default' : 'text-[#999999] hover:text-ibiza-red'}`}
              >
                <Heart className={`w-5 h-5 transition-all ${liked ? 'fill-ibiza-red scale-110' : ''}`} />
                {likeCount}
              </button>
              <button
                onClick={handleShare}
                className="text-[#999999] hover:text-[#111111] transition-colors"
                title="Compartir"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* WhatsApp CTA */}
          <div className="mt-12 rounded-2xl bg-gradient-to-r from-ibiza-red/10 to-transparent border border-ibiza-red/20 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-5">
            <div className="flex-1">
              <p className="text-[#111111] font-display font-bold text-lg mb-1">¿Tienes dudas? Consúltanos</p>
              <p className="text-[#444444] text-sm">Nuestros asesores están disponibles en WhatsApp para ayudarte.</p>
            </div>
            <a
              href={getWhatsAppUrl(`Hola, leí el artículo "${post.title}" y tengo una consulta.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20b858] text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors shrink-0"
            >
              <MessageCircle className="w-4 h-4" />
              Escríbenos
            </a>
          </div>
        </motion.div>

        {/* Related articles */}
        {suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="mt-16"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-2xl text-[#111111]">Más artículos</h2>
              <Link
                to="/#blog"
                className="text-xs text-ibiza-red font-bold flex items-center gap-1 hover:gap-2 transition-all"
              >
                Ver todos <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {suggestions.map((rel, i) => (
                <motion.div
                  key={rel.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.45, delay: Math.min(i, 6) * 0.07 }}
                >
                <Link
                  to={`/blog/${rel.id}`}
                  className="group bg-[#f7f7f7] rounded-2xl overflow-hidden border border-[#e8e8e8] hover:border-ibiza-red/30 hover:bg-[#ffffff] transition-all duration-300"
                >
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={rel.image}
                      alt={rel.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className={`text-[9px] font-bold tracking-widest px-2.5 py-1 rounded-full border uppercase ${categoryStyles[rel.category]}`}>
                        {rel.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-[11px] text-[#999999] mb-1">{rel.date}</p>
                    <h4 className="font-display font-bold text-sm text-[#111111] leading-snug group-hover:text-ibiza-red transition-colors duration-300 line-clamp-2">
                      {rel.title}
                    </h4>
                  </div>
                </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
