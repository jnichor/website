export type Category =
  | "laptops"
  | "desktops"
  | "componentes"
  | "perifericos"
  | "monitores"
  | "networking"
  | "almacenamiento"
  | "audio"
  | "smart-home"
  | "accesorios";

export const CATEGORY_LABELS: Record<Category, string> = {
  laptops: "Laptops",
  desktops: "Desktops",
  componentes: "Componentes",
  perifericos: "Periféricos",
  monitores: "Monitores",
  networking: "Networking",
  almacenamiento: "Almacenamiento",
  audio: "Audio",
  "smart-home": "Smart Home",
  accesorios: "Accesorios",
};

export interface Spec {
  label: string;
  value: string;
}

export interface InstallmentPlan {
  months: number;
  monthly: number;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  brand: string;
  description: string;
  shortDescription: string;
  price: number;
  originalPrice?: number;
  installments?: InstallmentPlan[];
  image: string;
  images: string[];
  category: Category;
  tags: string[];
  specs: Spec[];
  highlights: string[];
  inBox?: string[];
  warrantyMonths: number;
  inStock: boolean;
  stockQty?: number;
  featured?: boolean;
  isNew?: boolean;
  isBestseller?: boolean;
  rating?: number;
  reviewCount?: number;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  slug: string;
  brand: string;
  price: number;
  image: string;
  quantity: number;
  stockQty: number;
  sku: string;
}

export interface ShippingZone {
  id: string;
  name: string;
  price: number;
  minDeliveryDays: number;
  maxDeliveryDays: number;
}

export type PaymentMethodId =
  | "yape"
  | "plin"
  | "visa-credit"
  | "mc-credit"
  | "visa-debit"
  | "mc-debit"
  | "transfer";

export type OrderStatus =
  | "pending"
  | "paid"
  | "preparing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "pending_verification";

export interface OrderInput {
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    district: string;
    city: string;
    reference?: string;
    documentType: "DNI" | "RUC";
    documentNumber: string;
    companyName?: string;
    fiscalAddress?: string;
  };
  items: { productId: string; quantity: number }[];
  shippingZoneId: string;
  invoiceType: "boleta" | "factura";
  paymentMethod: PaymentMethodId;
  installments?: number;
  acceptedTermsAt: string;
}
