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

function renderBody(paragraph: string, index: number) {
  const parts = paragraph.split(/\*\*(.*?)\*\*/g);
  return (
    <p key={index} className="text-gray-300 text-base md:text-lg leading-relaxed">
      {parts.map((part, j) =>
        j % 2 === 1
          ? <strong key={j} className="text-white font-semibold">{part}</strong>
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

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [id]);

  if (!post) {
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center gap-6 text-center px-4">
        <BookOpen className="w-16 h-16 text-white/10" />
        <h1 className="font-display font-black text-3xl text-white">Artículo no encontrado</h1>
        <p className="text-gray-500">El artículo que buscas no existe o fue eliminado.</p>
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
    <div className="min-h-screen bg-[#09090b]">
      {/* Hero image */}
      <div className="relative h-64 md:h-[480px] overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-[#09090b]" />

        {/* Back button */}
        <div className="absolute top-6 left-0 right-0 max-w-4xl mx-auto px-4 sm:px-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors bg-black/40 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-full"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </button>
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
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mt-6 mb-5">
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{post.readTime} de lectura</span>
            <span className="w-1 h-1 rounded-full bg-gray-700" />
            <span>{post.date}</span>
            <span className="w-1 h-1 rounded-full bg-gray-700" />
            <span className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" />{post.views.toLocaleString()} vistas</span>
          </div>

          {/* Title */}
          <h1 className="font-display font-black text-3xl md:text-5xl text-white leading-tight mb-8">
            {post.title}
          </h1>

          {/* Excerpt (lead) */}
          <p className="text-gray-400 text-lg md:text-xl leading-relaxed border-l-2 border-ibiza-red pl-5 mb-10">
            {post.excerpt}
          </p>

          {/* Body paragraphs */}
          <div className="space-y-5 mb-10">
            {post.body.map((p, i) => renderBody(p, i))}
          </div>

          {/* Tags + actions */}
          <div className="flex flex-wrap items-center gap-3 pt-8 border-t border-white/[0.06]">
            {post.tags.map(tag => (
              <span key={tag} className="flex items-center gap-1.5 text-xs text-white/40 bg-white/[0.04] border border-white/[0.06] px-3 py-1.5 rounded-lg">
                <Tag className="w-3 h-3" />{tag}
              </span>
            ))}
            <div className="ml-auto flex items-center gap-4">
              <button
                onClick={() => setLiked(l => !l)}
                className={`flex items-center gap-1.5 text-sm font-bold transition-colors ${liked ? 'text-ibiza-red' : 'text-white/30 hover:text-ibiza-red'}`}
              >
                <Heart className={`w-5 h-5 transition-all ${liked ? 'fill-ibiza-red scale-110' : ''}`} />
                {post.likes + (liked ? 1 : 0)}
              </button>
              <button
                onClick={handleShare}
                className="text-white/30 hover:text-white transition-colors"
                title="Compartir"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* WhatsApp CTA */}
          <div className="mt-12 rounded-2xl bg-gradient-to-r from-ibiza-red/10 to-transparent border border-ibiza-red/20 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-5">
            <div className="flex-1">
              <p className="text-white font-display font-bold text-lg mb-1">¿Tienes dudas? Consúltanos</p>
              <p className="text-gray-400 text-sm">Nuestros asesores están disponibles en WhatsApp para ayudarte.</p>
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
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-16"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-2xl text-white">Más artículos</h2>
              <Link
                to="/#blog"
                className="text-xs text-ibiza-red font-bold flex items-center gap-1 hover:gap-2 transition-all"
              >
                Ver todos <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {suggestions.map(rel => (
                <Link
                  key={rel.id}
                  to={`/blog/${rel.id}`}
                  className="group bg-white/[0.02] rounded-2xl overflow-hidden border border-white/[0.04] hover:border-ibiza-red/20 hover:bg-white/[0.04] transition-all duration-300"
                >
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={rel.image}
                      alt={rel.title}
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
                    <p className="text-[11px] text-gray-600 mb-1">{rel.date}</p>
                    <h4 className="font-display font-bold text-sm text-white leading-snug group-hover:text-ibiza-red transition-colors duration-300 line-clamp-2">
                      {rel.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
