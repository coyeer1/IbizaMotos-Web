import { useState, useRef } from 'react';
import { X, Loader2, ImagePlus, Link } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface ImageUploaderProps {
  urls: string; // newline separated URLs
  onChange: (urls: string) => void;
  bucketName?: string;
  folderPath?: string;
}

export function ImageUploader({ urls, onChange, bucketName = 'motorcycles', folderPath = '' }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const urlArray = urls.split('\n').map(u => u.trim()).filter(Boolean);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      
      // Generate clean unique name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 12)}_${Date.now()}.${fileExt}`;
      const filePath = folderPath ? `${folderPath}/${fileName}` : fileName;

      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData.publicUrl;

      onChange([...urlArray, publicUrl].join('\n'));
      
    } catch (error: any) {
      alert('Error subiendo imagen. ¿Aseguraste crear el Bucket en Supabase?: ' + error.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeUrl = (index: number) => {
    const updated = [...urlArray];
    updated.splice(index, 1);
    onChange(updated.join('\n'));
  };

  return (
    <div className="space-y-4">
      {/* Upload & Grid Area */}
      <div className="flex flex-wrap gap-3">
        {urlArray.map((url, i) => (
          <div key={i} className="relative w-24 h-24 bg-white/5 rounded-xl border border-white/10 group overflow-hidden">
            <img src={url} alt={`Imagen ${i}`} loading="lazy" decoding="async" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Error'; }} />
            <button
              type="button"
              onClick={() => removeUrl(i)}
              className="absolute top-1 right-1 bg-red-500/90 hover:bg-red-600 text-white rounded-full p-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-md"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-24 h-24 bg-white/[0.02] hover:bg-white/[0.05] border border-dashed border-white/20 hover:border-ibiza-red/50 rounded-xl flex flex-col items-center justify-center gap-2 text-white/40 hover:text-white transition-all cursor-pointer"
        >
          {uploading ? (
            <Loader2 className="w-5 h-5 animate-spin text-ibiza-red" />
          ) : (
            <ImagePlus className="w-6 h-6" />
          )}
          <span className="text-[10px] font-medium leading-tight text-center px-1">
            {uploading ? 'Subiendo...' : 'Subir Foto'}
          </span>
        </button>
      </div>
      
      {/* File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Manual URL Input Toggle */}
      <div>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="flex items-center gap-1.5 text-[10px] font-bold text-white/30 hover:text-white/60 uppercase tracking-widest transition-colors"
        >
          <Link className="w-3 h-3" />
          {showUrlInput ? 'Ocultar pegado manual de URLs' : 'Pegar URLs manualmente'}
        </button>

        {showUrlInput && (
          <textarea
            value={urls}
            onChange={(e) => onChange(e.target.value)}
            rows={3}
            className="w-full px-3 py-2.5 mt-2 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white text-xs font-mono outline-none focus:border-ibiza-red resize-none"
            placeholder="Pega las URLs de las imágenes aquí, una por línea..."
          />
        )}
      </div>
    </div>
  );
}
