export interface Category {
  id: string;
  name: string;
  slug: string;
  count: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: Category;
  sizes: string[];
  isNew: boolean;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  size: string;
  quantity: number;
}
