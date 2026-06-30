import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

// Genera un QR (PNG data URL) en el cliente. Sin estado global; cada instancia
// crea su propia imagen. Útil para la grilla de QR por sucursal del panel admin.
export function QRCodeImg({ value, size = 220 }: { value: string; size?: number }) {
  const [src, setSrc] = useState('');

  useEffect(() => {
    let active = true;
    QRCode.toDataURL(value, { width: size, margin: 1, errorCorrectionLevel: 'M' })
      .then((url) => { if (active) setSrc(url); })
      .catch(() => { if (active) setSrc(''); });
    return () => { active = false; };
  }, [value, size]);

  if (!src) {
    return <div style={{ width: size, height: size, background: '#f0f0f0', borderRadius: 8 }} />;
  }
  return <img src={src} width={size} height={size} alt="" style={{ display: 'block' }} />;
}
