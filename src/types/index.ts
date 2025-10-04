export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  address?: Address[];
  createdAt: string;
}

export interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentCategory?: string;
  image?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  images: string[];
  tags: string[];
  rating?: number;
  reviews?: number;
  variants?: ProductVariant[];
  createdAt: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  options: string[];
}

export interface CartItem {
  productId: string;
  quantity: number;
  variant?: Record<string, string>;
}

export interface Order {
  id: string;
  userId: string;
  products: OrderProduct[];
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  totalPrice: number;
  shippingAddress: Address;
  createdAt: string;
  updatedAt: string;
}

export interface OrderProduct {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  image?: string;
}
