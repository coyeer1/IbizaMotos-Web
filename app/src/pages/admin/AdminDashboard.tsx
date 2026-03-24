import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { buildGoogleCalendarUrl } from '@/lib/googleCalendar';
import {
  Bike, Plus, Pencil, Trash2, LogOut, Search, Save, X, Image as ImageIcon,
  ChevronDown, AlertCircle, CheckCircle2, Upload, Check, Palette,
  Calendar, Clock, Phone, User, Wrench, ChevronUp, RefreshCw
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import type { Motorcycle } from '@/types';
import { brands, categories } from '@/data/motorcycles';
import { ImageUploader } from '@/components/ImageUploader';

// ─── Available Colors with visual hex values ───
const AVAILABLE_COLORS: { name: string; hex: string }[] = [
  { name: 'Negro', hex: '#000000' },
  { name: 'Negro Mate', hex: '#1a1a1a' },
  { name: 'Rojo', hex: '#dc2626' },
  { name: 'Blanco', hex: '#f8f9fa' },
  { name: 'Azul', hex: '#2563eb' },
  { name: 'Azul Metálico', hex: '#1e40af' },
  { name: 'Verde', hex: '#16a34a' },
  { name: 'Verde Militar', hex: '#3f4f3a' },
  { name: 'Gris', hex: '#6b7280' },
  { name: 'Naranja', hex: '#f97316' },
  { name: 'Amarillo', hex: '#eab308' },
  { name: 'Morado', hex: '#9333ea' },
];

// ─── Input styling shortcut ───
const inputCls = "w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white text-sm outline-none focus:border-ibiza-red";
const selectCls = "w-full px-3 py-2.5 bg-[#1a1a1f] border border-white/[0.06] rounded-xl text-white text-sm outline-none focus:border-ibiza-red [&>option]:bg-[#1a1a1f] [&>option]:text-white";
const labelCls = "block text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1.5";

// ─── Motorcycle Form Modal ───
function MotoFormModal({
  isOpen,
  onClose,
  onSave,
  editingMoto,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  editingMoto: Motorcycle | null;
}) {
  const [saving, setSaving] = useState(false);
  const [activeColorTab, setActiveColorTab] = useState<string>('_general');

  // Basic form fields
  const [form, setForm] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    price: 0,
    category: '',
    description: '',
    engine: '',
    power: '',
    torque: '',
    transmission: '',
    weight: '',
    fuelCapacity: '',
    featured: false,
    slug: '',
    video_url: '',
  });

  // Color selection (array of selected color names)
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  // General images (not assigned to any color)
  const [generalImages, setGeneralImages] = useState('');

  // Images per color: { "Negro": "url1\nurl2", "Rojo": "url3" }
  const [imagesByColor, setImagesByColor] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingMoto) {
      const colors = editingMoto.specifications?.colors || [];
      setSelectedColors(colors);
      setActiveColorTab('_general');

      setForm({
        brand: editingMoto.brand,
        model: editingMoto.model,
        year: editingMoto.year,
        price: editingMoto.price,
        category: editingMoto.category,
        description: editingMoto.description,
        engine: editingMoto.specifications?.engine || '',
        power: editingMoto.specifications?.power || '',
        torque: editingMoto.specifications?.torque || '',
        transmission: editingMoto.specifications?.transmission || '',
        weight: editingMoto.specifications?.weight || '',
        fuelCapacity: editingMoto.specifications?.fuelCapacity || '',
        featured: editingMoto.featured,
        slug: editingMoto.id || '',
        video_url: editingMoto.videoUrl || '',
      });

      // Load general images
      setGeneralImages(editingMoto.images?.join('\n') || '');

      // Load images by color
      const ibc: Record<string, string> = {};
      if (editingMoto.imagesByColor) {
        for (const [colorName, urls] of Object.entries(editingMoto.imagesByColor)) {
          if (Array.isArray(urls)) {
            ibc[colorName] = urls.join('\n');
          }
        }
      }
      setImagesByColor(ibc);
    } else {
      setForm({
        brand: '', model: '', year: new Date().getFullYear(), price: 0,
        category: '', description: '', engine: '', power: '', torque: '',
        transmission: '', weight: '', fuelCapacity: '',
        featured: false, slug: '', video_url: '',
      });
      setSelectedColors([]);
      setGeneralImages('');
      setImagesByColor({});
      setActiveColorTab('_general');
    }
  }, [editingMoto, isOpen]);

  const generateSlug = () => {
    const slug = `${form.brand}-${form.model}`.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    setForm(prev => ({ ...prev, slug }));
  };

  const toggleColor = (colorName: string) => {
    setSelectedColors(prev => {
      if (prev.includes(colorName)) {
        // Remove color + its images
        const next = prev.filter(c => c !== colorName);
        const newIbc = { ...imagesByColor };
        delete newIbc[colorName];
        setImagesByColor(newIbc);
        if (activeColorTab === colorName) setActiveColorTab('_general');
        return next;
      } else {
        return [...prev, colorName];
      }
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Build general images array
      const generalArr = generalImages.split('\n').map(i => i.trim()).filter(Boolean);

      // Build images_by_color object for DB
      const ibcForDb: Record<string, string[]> = {};
      for (const color of selectedColors) {
        const urls = (imagesByColor[color] || '').split('\n').map(i => i.trim()).filter(Boolean);
        if (urls.length > 0) {
          ibcForDb[color] = urls;
        }
      }

      // "images" = general images + all color images combined (for backwards compat)
      const allColorImages = Object.values(ibcForDb).flat();
      const allImages = [...generalArr, ...allColorImages];
      // Deduplicate
      const uniqueImages = [...new Set(allImages)];

      const record = {
        brand: form.brand,
        model: form.model,
        year: form.year,
        price: form.price,
        category: form.category,
        description: form.description,
        specifications: {
          engine: form.engine,
          power: form.power,
          torque: form.torque,
          transmission: form.transmission,
          weight: form.weight,
          fuelCapacity: form.fuelCapacity,
          colors: selectedColors,
        },
        images: uniqueImages.length > 0 ? uniqueImages : generalArr,
        images_by_color: Object.keys(ibcForDb).length > 0 ? ibcForDb : null,
        featured: form.featured,
        slug: form.slug,
        video_url: form.video_url || null,
      };

      if (editingMoto) {
        const dbId = (editingMoto as any)._dbId || editingMoto.id;
        const { data: updatedData, error } = await supabase
          .from('web_motorcycles')
          .update(record)
          .eq('id', dbId)
          .select();

        if (error) throw error;

        if (!updatedData || updatedData.length === 0) {
          const { data: fallbackData, error: fallbackError } = await supabase
            .from('web_motorcycles')
            .update(record)
            .eq('slug', editingMoto.id)
            .select();
          if (fallbackError) throw fallbackError;
          if (!fallbackData || fallbackData.length === 0) {
            throw new Error('No se encontró la moto para actualizar.');
          }
        }
      } else {
        const { error } = await supabase
          .from('web_motorcycles')
          .insert(record);
        if (error) throw error;
      }

      onSave();
      onClose();
    } catch (err: any) {
      alert('Error guardando: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  const colorHex = (name: string) => AVAILABLE_COLORS.find(c => c.name === name)?.hex || '#888';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-start justify-center p-4 pt-10 bg-black/80 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl bg-[#111113] rounded-2xl border border-white/[0.06] shadow-2xl mb-20"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/[0.06]">
          <h2 className="font-display font-bold text-xl text-white">
            {editingMoto ? '✏️ Editar Moto' : '➕ Nueva Moto'}
          </h2>
          <button onClick={onClose} className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-white/40 hover:text-white hover:bg-white/[0.06] transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Row 1: Brand + Model + Year */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Marca</label>
              <select value={form.brand} onChange={(e) => setForm(prev => ({ ...prev, brand: e.target.value }))} className={selectCls}>
                <option value="">Seleccionar...</option>
                {brands.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Modelo</label>
              <input value={form.model} onChange={(e) => setForm(prev => ({ ...prev, model: e.target.value }))} className={inputCls} placeholder="Ej: GSX-R150" />
            </div>
            <div>
              <label className={labelCls}>Año</label>
              <input type="number" value={form.year} onChange={(e) => setForm(prev => ({ ...prev, year: Number(e.target.value) }))} className={inputCls} />
            </div>
          </div>

          {/* Row 2: Price + Category + Featured */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Precio (COP)</label>
              <input type="number" value={form.price} onChange={(e) => setForm(prev => ({ ...prev, price: Number(e.target.value) }))} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Categoría</label>
              <select value={form.category} onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))} className={selectCls}>
                <option value="">Seleccionar...</option>
                {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-3 cursor-pointer w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl">
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm(prev => ({ ...prev, featured: e.target.checked }))} className="w-4 h-4 accent-ibiza-red" />
                <span className="text-white text-sm">Destacada</span>
              </label>
            </div>
          </div>

          {/* Slug */}
          <div>
            <label className={labelCls}>Slug (URL)</label>
            <div className="flex gap-2">
              <input value={form.slug} onChange={(e) => setForm(prev => ({ ...prev, slug: e.target.value }))} className={"flex-1 " + inputCls} placeholder="bajaj-boxer-150" />
              <button type="button" onClick={generateSlug} className="px-4 py-2 bg-white/[0.06] border border-white/[0.06] rounded-xl text-white/40 text-xs font-bold hover:bg-white/[0.1] transition-all">Auto</button>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={labelCls}>Descripción</label>
            <textarea value={form.description} onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))} rows={3} className={inputCls + " resize-none"} placeholder="Descripción de la moto..." />
          </div>

          {/* Specifications */}
          <div>
            <p className="text-xs font-bold text-ibiza-red uppercase tracking-widest mb-3">⚙️ Especificaciones</p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Motor', key: 'engine', placeholder: '124cc, 4 tiempos' },
                { label: 'Potencia', key: 'power', placeholder: '10.3 HP @ 8,000 RPM' },
                { label: 'Torque', key: 'torque', placeholder: '10.4 Nm @ 6,000 RPM' },
                { label: 'Transmisión', key: 'transmission', placeholder: '5 velocidades' },
                { label: 'Peso', key: 'weight', placeholder: '98 kg' },
                { label: 'Combustible', key: 'fuelCapacity', placeholder: '10 litros' },
              ].map(spec => (
                <div key={spec.key}>
                  <label className={labelCls}>{spec.label}</label>
                  <input value={(form as any)[spec.key]} onChange={(e) => setForm(prev => ({ ...prev, [spec.key]: e.target.value }))} className={inputCls} placeholder={spec.placeholder} />
                </div>
              ))}
            </div>
          </div>

          {/* ═══ COLORS VISUAL PICKER ═══ */}
          <div>
            <p className="text-xs font-bold text-ibiza-red uppercase tracking-widest mb-3">
              <Palette className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
              Colores Disponibles
            </p>
            <p className="text-white/20 text-[11px] mb-3">Haz clic para seleccionar los colores en que la moto está disponible</p>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_COLORS.map(color => {
                const isSelected = selectedColors.includes(color.name);
                const isLight = ['Blanco', 'Amarillo'].includes(color.name);
                return (
                  <button
                    key={color.name}
                    type="button"
                    onClick={() => toggleColor(color.name)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
                      isSelected
                        ? 'border-ibiza-red bg-ibiza-red/10 text-white'
                        : 'border-white/[0.06] bg-white/[0.02] text-white/40 hover:border-white/20'
                    }`}
                  >
                    <span
                      className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: color.hex,
                        borderColor: isSelected ? '#E31937' : isLight ? '#999' : 'rgba(255,255,255,0.15)',
                      }}
                    >
                      {isSelected && <Check className="w-3 h-3" style={{ color: isLight ? '#000' : '#fff' }} />}
                    </span>
                    {color.name}
                  </button>
                );
              })}
            </div>
            {selectedColors.length > 0 && (
              <div className="mt-2 text-[11px] text-white/30">
                Seleccionados: {selectedColors.join(', ')}
              </div>
            )}
          </div>

          {/* ═══ IMAGES BY COLOR (Tabs) ═══ */}
          <div>
            <p className="text-xs font-bold text-ibiza-red uppercase tracking-widest mb-3">
              <ImageIcon className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" />
              Imágenes
            </p>

            {/* Tabs: General + each selected color */}
            <div className="flex flex-wrap gap-1.5 mb-3 border-b border-white/[0.04] pb-3">
              <button
                type="button"
                onClick={() => setActiveColorTab('_general')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeColorTab === '_general'
                    ? 'bg-ibiza-red text-white'
                    : 'bg-white/[0.03] text-white/30 hover:text-white/60'
                }`}
              >
                📷 Generales
              </button>
              {selectedColors.map(colorName => (
                <button
                  key={colorName}
                  type="button"
                  onClick={() => setActiveColorTab(colorName)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeColorTab === colorName
                      ? 'bg-ibiza-red text-white'
                      : 'bg-white/[0.03] text-white/30 hover:text-white/60'
                  }`}
                >
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: colorHex(colorName) }} />
                  {colorName}
                </button>
              ))}
            </div>

            {/* Active tab content */}
            {activeColorTab === '_general' ? (
              <div>
                <p className="text-white/20 text-[11px] mb-2">
                  Imágenes principales de la moto (se muestran cuando no hay color específico seleccionado).
                </p>
                <ImageUploader 
                  urls={generalImages}
                  onChange={(newUrls) => setGeneralImages(newUrls)}
                />
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-4 h-4 rounded-full" style={{ backgroundColor: colorHex(activeColorTab) }} />
                  <p className="text-white/40 text-[11px]">
                    Imágenes de la moto en color <strong className="text-white/70">{activeColorTab}</strong>.
                  </p>
                </div>
                <ImageUploader 
                  urls={imagesByColor[activeColorTab] || ''}
                  onChange={(newUrls) => setImagesByColor(prev => ({ ...prev, [activeColorTab]: newUrls }))}
                />
              </div>
            )}
          </div>

          {/* Video URL */}
          <div>
            <label className={labelCls}>🎬 Video YouTube (opcional)</label>
            <p className="text-white/20 text-[11px] mb-2">Puedes pegar cualquier link de YouTube (embed, compartir, o normal)</p>
            <input
              value={form.video_url}
              onChange={(e) => setForm(prev => ({ ...prev, video_url: e.target.value }))}
              className={inputCls}
              placeholder="https://youtu.be/... o https://www.youtube.com/watch?v=..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-white/[0.06]">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white/40 font-bold text-sm hover:bg-white/[0.06] transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !form.brand || !form.model || !form.slug}
            className="px-8 py-3 bg-ibiza-red hover:bg-ibiza-red/90 disabled:opacity-50 text-white font-display font-bold text-sm uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(227,25,55,0.2)] flex items-center gap-2"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {editingMoto ? 'Actualizar' : 'Guardar'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Admin Dashboard ───
export default function AdminDashboard() {
  const { isAuthenticated, logout } = useAdminAuth();
  const navigate = useNavigate();
  const [motos, setMotos] = useState<Motorcycle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingMoto, setEditingMoto] = useState<Motorcycle | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'inventory' | 'appointments'>('inventory');

  // ─── Citas state ────────────────────────────────────────────────────────────
  interface Appointment {
    id: string;
    created_at: string;
    name: string;
    phone: string;
    email?: string;
    motorcycle?: string;
    service: string;
    appt_date: string;
    appt_time: string;
    notes?: string;
    status: 'pending' | 'confirmed' | 'done' | 'cancelled';
    branch_name?: string;
    branch_address?: string;
  }
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [apptLoading, setApptLoading] = useState(false);
  const [apptFilter, setApptFilter] = useState<'all' | 'pending' | 'confirmed' | 'done' | 'cancelled'>('all');

  const SERVICE_LABELS: Record<string, string> = {
    mantenimiento: 'Mantenimiento',
    revision: 'Revisión General',
    frenos: 'Frenos y Suspensión',
    motor: 'Reparación Motor',
  };

  const STATUS_CONFIG = {
    pending:   { label: 'Pendiente',  color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
    confirmed: { label: 'Confirmada', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    done:      { label: 'Completada', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
    cancelled: { label: 'Cancelada',  color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  } as const;

  const fetchAppointments = async () => {
    setApptLoading(true);
    try {
      const { data, error } = await supabase
        .from('workshop_appointments')
        .select('*')
        .order('appt_date', { ascending: true })
        .order('appt_time', { ascending: true });
      if (error) throw error;
      setAppointments(data || []);
    } catch (err: any) {
      showToast('Error cargando citas: ' + err.message, 'error');
    } finally {
      setApptLoading(false);
    }
  };

  const updateApptStatus = async (id: string, status: Appointment['status']) => {
    const { error } = await supabase
      .from('workshop_appointments')
      .update({ status })
      .eq('id', id);
    if (error) {
      showToast('Error actualizando estado', 'error');
    } else {
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
      showToast('Estado actualizado ✓', 'success');
    }
  };

  const deleteAppt = async (id: string) => {
    const { error } = await supabase.from('workshop_appointments').delete().eq('id', id);
    if (error) {
      showToast('Error eliminando cita', 'error');
    } else {
      setAppointments(prev => prev.filter(a => a.id !== id));
      showToast('Cita eliminada ✓', 'success');
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin');
      return;
    }
    fetchMotos();
    fetchAppointments();
  }, [isAuthenticated, navigate]);

  const fetchMotos = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('web_motorcycles')
        .select('*')
        .order('brand', { ascending: true });

      if (error) throw error;

      const formatted: Motorcycle[] = data.map((item: any) => ({
        ...item,
        imagesByColor: item.images_by_color,
        videoUrl: item.video_url,
        _dbId: item.id,  // Preserve the real DB UUID
        id: item.slug || item.id,
      }));

      setMotos(formatted);
    } catch (err: any) {
      showToast('Error cargando motos: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = async (motoId: string) => {
    try {
      const moto = motos.find(m => m.id === motoId);
      const dbId = (moto as any)?._dbId || motoId;
      
      const { error } = await supabase
        .from('web_motorcycles')
        .delete()
        .eq('id', dbId);

      if (error) throw error;

      showToast('Moto eliminada correctamente', 'success');
      setDeleteConfirm(null);
      fetchMotos();
    } catch (err: any) {
      showToast('Error eliminando: ' + err.message, 'error');
    }
  };

  const handleEdit = (moto: Motorcycle) => {
    setEditingMoto(moto);
    setShowModal(true);
  };

  const handleNew = () => {
    setEditingMoto(null);
    setShowModal(true);
  };

  const handleSaved = () => {
    showToast(editingMoto ? 'Moto actualizada ✓' : 'Moto agregada ✓', 'success');
    fetchMotos();
  };

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  const filteredMotos = motos.filter(m =>
    m.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(price);

  const totalBrands = [...new Set(motos.map(m => m.brand))].length;

  return (
    <div className="min-h-screen bg-[#080808]">
      {/* ── TOP BAR ── */}
      <div className="bg-[#0c0c0e] border-b border-white/[0.04] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/Logo-Ibiza-motos.png" alt="Ibiza Motos" className="h-10" />
            <div className="h-6 w-px bg-white/10" />
            <span className="text-white/40 text-sm font-medium">Admin Panel</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-white/30 hover:text-ibiza-red text-sm font-medium transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* ── TABS ── */}
        <div className="flex gap-1 bg-white/[0.02] border border-white/[0.04] rounded-xl p-1 w-fit mb-8">
          {([
            { id: 'inventory', label: '🏍️ Inventario' },
            { id: 'appointments', label: `📅 Citas${appointments.filter(a => a.status === 'pending').length > 0 ? ` · ${appointments.filter(a => a.status === 'pending').length} nuevas` : ''}` },
          ] as const).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === tab.id ? 'bg-ibiza-red text-white shadow-sm' : 'text-white/30 hover:text-white/60'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── STATS CARDS ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total Motos', value: motos.length, icon: '🏍️', accent: 'ibiza-red' },
            { label: 'Marcas', value: totalBrands, icon: '🏷️', accent: 'blue-500' },
            { label: 'Destacadas', value: motos.filter(m => m.featured).length, icon: '⭐', accent: 'ibiza-gold' },
            { label: 'Con Video', value: motos.filter(m => m.videoUrl).length, icon: '🎬', accent: 'green-500' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white/[0.02] rounded-2xl p-5 border border-white/[0.04] hover:border-white/[0.08] transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{stat.icon}</span>
              </div>
              <p className="font-display font-black text-3xl text-white">{stat.value}</p>
              <p className="text-white/25 text-xs font-medium mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* ══════════════════════════ CITAS TAB ══════════════════════════ */}
        {activeTab === 'appointments' && (
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <h2 className="font-display font-bold text-2xl text-white">Citas del Taller</h2>
              <div className="flex gap-2 flex-wrap">
                {(['all','pending','confirmed','done','cancelled'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setApptFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${apptFilter === f ? 'bg-ibiza-red text-white' : 'bg-white/[0.03] text-white/30 border border-white/[0.06] hover:text-white/60'}`}
                  >
                    {f === 'all' ? 'Todas' : STATUS_CONFIG[f].label}
                    {f !== 'all' && (
                      <span className="ml-1.5 opacity-60">
                        ({appointments.filter(a => a.status === f).length})
                      </span>
                    )}
                  </button>
                ))}
                <button
                  onClick={fetchAppointments}
                  className="p-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-white/30 hover:text-white transition-colors"
                  title="Actualizar"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {apptLoading ? (
              <div className="flex justify-center py-20">
                <div className="w-10 h-10 border-4 border-ibiza-red/30 border-t-ibiza-red rounded-full animate-spin" />
              </div>
            ) : (() => {
              const filtered = apptFilter === 'all'
                ? appointments
                : appointments.filter(a => a.status === apptFilter);
              return filtered.length === 0 ? (
                <div className="text-center py-20 bg-white/[0.01] rounded-2xl border border-white/[0.04]">
                  <Calendar className="w-12 h-12 text-white/10 mx-auto mb-3" />
                  <p className="text-white/30 text-sm">No hay citas en esta categoría</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filtered.map(appt => {
                    const statusCfg = STATUS_CONFIG[appt.status];
                    return (
                      <div
                        key={appt.id}
                        className="bg-white/[0.02] border border-white/[0.04] rounded-2xl p-5 hover:border-white/[0.08] transition-all"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                          {/* Date + time badge */}
                          <div className="bg-ibiza-red/10 border border-ibiza-red/20 rounded-xl px-4 py-3 text-center shrink-0 min-w-[90px]">
                            <p className="font-display font-black text-ibiza-red text-lg leading-none">{appt.appt_date.slice(8)}</p>
                            <p className="text-white/40 text-[10px] uppercase tracking-wider mt-0.5">
                              {['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'][parseInt(appt.appt_date.slice(5,7)) - 1]}
                            </p>
                            <p className="text-white font-bold text-sm mt-1">{appt.appt_time}</p>
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusCfg.color}`}>
                                    {statusCfg.label}
                                  </span>
                                  <span className="text-white/30 text-[10px]">
                                    {new Date(appt.created_at).toLocaleDateString('es-CO')}
                                  </span>
                                </div>
                                <p className="font-display font-bold text-white">{appt.name}</p>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-white/40 mb-3">
                              <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{appt.phone}</span>
                              {appt.email && <span className="flex items-center gap-1">✉ {appt.email}</span>}
                              <span className="flex items-center gap-1"><Wrench className="w-3 h-3" />{SERVICE_LABELS[appt.service] || appt.service}</span>
                              {appt.motorcycle && <span className="flex items-center gap-1"><Bike className="w-3 h-3" />{appt.motorcycle}</span>}
                              {appt.branch_name && <span className="flex items-center gap-1 text-ibiza-gold/70">📍 {appt.branch_name}</span>}
                            </div>

                            {appt.notes && (
                              <p className="text-white/30 text-xs bg-white/[0.02] rounded-lg px-3 py-2 border border-white/[0.04] mb-3">
                                💬 {appt.notes}
                              </p>
                            )}

                            {/* Status actions */}
                            <div className="flex flex-wrap gap-2 items-center">
                              {(['pending','confirmed','done','cancelled'] as const).filter(s => s !== appt.status).map(s => (
                                <button
                                  key={s}
                                  onClick={() => updateApptStatus(appt.id, s)}
                                  className={`px-3 py-1 rounded-lg text-[11px] font-bold border transition-all hover:opacity-100 opacity-70 ${STATUS_CONFIG[s].color}`}
                                >
                                  → {STATUS_CONFIG[s].label}
                                </button>
                              ))}

                              {/* Botón Google Calendar */}
                              <a
                                href={buildGoogleCalendarUrl({
                                  service:    appt.service,
                                  appt_date:  appt.appt_date,
                                  appt_time:  appt.appt_time,
                                  name:       appt.name,
                                  phone:      appt.phone,
                                  email:      appt.email,
                                  motorcycle: appt.motorcycle,
                                  notes:      appt.notes,
                                })}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-bold border border-white/10 text-white/40 hover:text-white hover:border-white/30 transition-all"
                                title="Agregar al Google Calendar"
                              >
                                <svg viewBox="0 0 48 48" className="w-3 h-3 shrink-0">
                                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                                </svg>
                                Google Cal
                              </a>

                              <button
                                onClick={() => deleteAppt(appt.id)}
                                className="px-3 py-1 rounded-lg text-[11px] font-bold border border-red-500/20 text-red-400/60 hover:text-red-400 hover:border-red-500/40 transition-all ml-auto"
                              >
                                Eliminar
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}

            {/* ── Google Calendar embebido ─────────────────────────────── */}
            <div className="mt-10">
              <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" /> Vista del calendario · citas ibiza
              </p>
              <div className="rounded-2xl overflow-hidden border border-white/[0.06]">
                <iframe
                  src="https://calendar.google.com/calendar/embed?src=05aba167a7ac04235a7af0ab5c423c4916354668468d4ace968199e0cc059c3a%40group.calendar.google.com&ctz=America%2FBogota&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=0&showCalendars=0&mode=WEEK"
                  style={{ border: 0 }}
                  width="100%"
                  height="520"
                  frameBorder="0"
                  scrolling="no"
                  title="Calendario de citas Ibiza Motos"
                />
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════ INVENTARIO TAB ══════════════════════════ */}
        {activeTab === 'inventory' && <>

        {/* ── ACTIONS BAR ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h2 className="font-display font-bold text-2xl text-white">
            Inventario de Motos
          </h2>
          <div className="flex gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar..."
                className="w-full sm:w-56 pl-10 pr-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white text-sm placeholder:text-white/20 outline-none focus:border-ibiza-red"
              />
            </div>
            <button
              onClick={handleNew}
              className="flex items-center gap-2 px-5 py-2.5 bg-ibiza-red hover:bg-ibiza-red/90 text-white font-bold text-sm rounded-xl shadow-[0_0_20px_rgba(227,25,55,0.2)] transition-all whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              Agregar Moto
            </button>
          </div>
        </div>

        {/* ── MOTOS TABLE ── */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-ibiza-red/30 border-t-ibiza-red rounded-full animate-spin" />
          </div>
        ) : (
          <div className="bg-white/[0.02] rounded-2xl border border-white/[0.04] overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-[80px_1fr_120px_120px_140px_100px] gap-4 px-6 py-3 border-b border-white/[0.04] bg-white/[0.02]">
              <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Foto</span>
              <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Moto</span>
              <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Categoría</span>
              <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Año</span>
              <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Precio</span>
              <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest text-right">Acciones</span>
            </div>

            {/* Table rows */}
            {filteredMotos.length === 0 ? (
              <div className="text-center py-16">
                <Bike className="w-12 h-12 text-white/10 mx-auto mb-3" />
                <p className="text-white/30 text-sm">No se encontraron motos</p>
              </div>
            ) : (
              filteredMotos.map((moto) => (
                <div
                  key={moto.id}
                  className="grid grid-cols-[80px_1fr_120px_120px_140px_100px] gap-4 px-6 py-4 items-center border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors group"
                >
                  {/* Image */}
                  <div className="w-16 h-12 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                    {moto.images?.[0] ? (
                      <img src={moto.images[0]} alt={moto.model} className="w-full h-full object-contain" />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-gray-300" />
                    )}
                  </div>

                  {/* Name */}
                  <div>
                    <p className="font-display font-bold text-white text-sm">{moto.brand} {moto.model}</p>
                    <p className="text-white/20 text-xs">/{moto.id}</p>
                  </div>

                  {/* Category */}
                  <span className="text-white/40 text-sm">{moto.category}</span>

                  {/* Year */}
                  <span className="text-white/40 text-sm">{moto.year}</span>

                  {/* Price */}
                  <span className="font-display font-bold text-white text-sm">{formatPrice(moto.price)}</span>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => handleEdit(moto)}
                      className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-white/30 hover:text-blue-400 hover:border-blue-400/30 transition-all"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    {deleteConfirm === moto.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDelete(moto.id)}
                          className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 hover:bg-red-500 hover:text-white transition-all"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-white/30 hover:text-white transition-all"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(moto.id)}
                        className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-white/30 hover:text-red-400 hover:border-red-400/30 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        </>}

      </div>

      {/* ── FORM MODAL ── */}
      <AnimatePresence>
        <MotoFormModal
          isOpen={showModal}
          onClose={() => { setShowModal(false); setEditingMoto(null); }}
          onSave={handleSaved}
          editingMoto={editingMoto}
        />
      </AnimatePresence>

      {/* ── TOAST NOTIFICATION ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-6 right-6 z-[300] flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg border ${
              toast.type === 'success'
                ? 'bg-green-500/10 border-green-500/30 text-green-400'
                : 'bg-red-500/10 border-red-500/30 text-red-400'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span className="font-medium text-sm">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
