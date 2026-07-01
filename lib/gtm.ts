type GA4Product = {
  item_id: string;
  item_name: string;
  price: number;
  item_brand?: string;
  item_category?: string;
  quantity: number;
  item_variant?: string;
};

type GTMEvent = {
  event: string;
  ecommerce?: {
    currency?: string;
    value?: number;
    transaction_id?: string;
    coupon?: string;
    items: GA4Product[];
  };
  [key: string]: any;
};

const recentEvents = new Map<string, number>();

export const sendGTMEvent = (data: GTMEvent) => {
  if (typeof window !== "undefined") {
    const win = window as any;
    
    // Normalizar número telefónico a formato E.164 requerido por Meta Pixel y TikTok Pixel
    if (data.phone) {
      const clean = String(data.phone).replace(/\D/g, "");
      if (clean.length === 9 && clean.startsWith("9")) {
        data.phone = `+51${clean}`;
      } else if (clean.startsWith("51") && clean.length === 11) {
        data.phone = `+${clean}`;
      } else if (clean.length > 0) {
        data.phone = String(data.phone).startsWith("+") ? data.phone : `+${clean}`;
      }
    }
    
    // Evitar que eventos idénticos se disparen múltiples veces en ráfaga (ej: React Strict Mode en dev)
    try {
      const eventKey = JSON.stringify(data);
      const now = Date.now();
      const lastSent = recentEvents.get(eventKey);
      
      if (lastSent && now - lastSent < 500) {
        console.warn(`[GTM] Ignorando evento duplicado para evitar doble rastreo en píxeles (${data.event})`);
        return;
      }
      recentEvents.set(eventKey, now);
      
      // Limpiar mapa periódicamente para prevenir fugas de memoria
      if (recentEvents.size > 100) {
        for (const [key, timestamp] of recentEvents.entries()) {
          if (now - timestamp > 5000) {
            recentEvents.delete(key);
          }
        }
      }
    } catch (e) {
      // Ignorar fallas en la serialización (ej. referencias circulares) y proceder
    }

    win.dataLayer = win.dataLayer || [];
    win.dataLayer.push({ ecommerce: null }); // Limpiar el objeto ecommerce anterior
    win.dataLayer.push(data);
  }
};
