export type Category = 'All' | 'Laptop' | 'Mobile' | 'Accessories';

export interface Product {
  id: number;
  name: string;
  category: Category;
  price: number;
  rating: number;
  inStock: boolean;
}