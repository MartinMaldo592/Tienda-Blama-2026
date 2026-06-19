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

export const sendGTMEvent = (data: GTMEvent) => {
  if (typeof window !== "undefined") {
    const win = window as any;
    win.dataLayer = win.dataLayer || [];
    win.dataLayer.push({ ecommerce: null }); // Limpiar el objeto ecommerce anterior
    win.dataLayer.push(data);
  }
};
