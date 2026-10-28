export interface Product {
  id: string;
  name: string;
  tagline: string;
  price: number;
  originalPrice: number;
  volume: string;
  doses: number;
  ph: number;
  variant: string;
  inStock: boolean;
  description: string;
  keyEnzymes: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant: string;
}

export interface B2BLead {
  restaurantName: string;
  contactPerson: string;
  phone: string;
  email: string;
  location: string;
  averageDishesPerDay: string;
  currentDetergent: string;
  notes?: string;
}
