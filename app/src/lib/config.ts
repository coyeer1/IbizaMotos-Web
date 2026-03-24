// ─── Business Configuration ───
// Centralized config so you can change phone numbers, etc. in one place

export const BUSINESS = {
  name: 'Ibiza Motos del Eje Cafetero',
  slogan: 'El placer en dos ruedas',
  phone: '+573214567890',
  whatsappNumber: '573214567890',
  email: 'info@ibizamotos.com',
  website: 'https://www.ibizamotos.com',
  address: 'Carrera 23 # 23-45, Armenia, Quindío',
  city: 'Armenia',
  region: 'Quindío',
  country: 'Colombia',
} as const;

// Generate WhatsApp URL with pre-filled message
export function getWhatsAppUrl(message: string): string {
  return `https://wa.me/${BUSINESS.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

// Common WhatsApp messages
export function getQuoteWhatsApp(brand: string, model: string): string {
  return getWhatsAppUrl(`Hola, quiero cotizar la ${brand} ${model}. ¿Me pueden dar más información?`);
}

export function getBuyWhatsApp(brand: string, model: string, color?: string): string {
  const colorText = color ? ` color ${color}` : '';
  return getWhatsAppUrl(`Hola, estoy interesado en comprar la ${brand} ${model}${colorText}. ¿Cuál es el proceso?`);
}

export function getServiceWhatsApp(serviceName: string): string {
  return getWhatsAppUrl(`Hola, quiero agendar una cita para el servicio de ${serviceName}.`);
}

export function getPartWhatsApp(partName: string): string {
  return getWhatsAppUrl(`Hola, quiero consultar por el repuesto: ${partName}. ¿Está disponible?`);
}

export function getGeneralWhatsApp(): string {
  return getWhatsAppUrl('Hola, quiero más información sobre sus motos y servicios.');
}

// ─── Contactos por marca ───────────────────────────────────────────────────────
// Reemplaza cada número con el WhatsApp real del encargado de esa marca.
// Formato: código de país + número sin espacios ni guiones (ej: 573001234567)
export const BRAND_CONTACTS: Record<string, { sales: string; parts: string }> = {
  Suzuki:      { sales: '573214567890', parts: '573214567890' },
  Vento:       { sales: '573214567890', parts: '573214567890' },
  Hero:        { sales: '573214567890', parts: '573214567890' },
  Honda:       { sales: '573214567890', parts: '573214567890' },
  Bajaj:       { sales: '573214567890', parts: '573214567890' },
  AKT:         { sales: '573214567890', parts: '573214567890' },
  'Good Kidz': { sales: '573214567890', parts: '573214567890' },
};

export function getBrandSalesWhatsApp(brandName: string): string {
  const number = BRAND_CONTACTS[brandName]?.sales ?? BUSINESS.whatsappNumber;
  return `https://wa.me/${number}?text=${encodeURIComponent(`Hola, quiero información sobre motos ${brandName}. ¿Me pueden ayudar?`)}`;
}

export function getBrandPartsWhatsApp(brandName: string): string {
  const number = BRAND_CONTACTS[brandName]?.parts ?? BUSINESS.whatsappNumber;
  return `https://wa.me/${number}?text=${encodeURIComponent(`Hola, necesito repuestos originales de ${brandName}. ¿Tienen disponibilidad?`)}`;
}
