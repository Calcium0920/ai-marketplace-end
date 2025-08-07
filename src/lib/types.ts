// src/lib/types.ts
export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  icon: string;
  rating: number;
  reviewCount: number;
  tags: string[];
  creator?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface CartItem extends Product {
  quantity?: number;
}