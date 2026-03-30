import { Component } from '@angular/core';

/*
  These are CHILD components used inside StoreContainer's template (store-container.html).
  Since this is a Standalone Component (no NgModule), we must explicitly import them.
*/
import { StoreHeader } from '../store-header/store-header';
import { ProductFilter } from '../product-filter/product-filter';
import { ProductGrid } from '../product-grid/product-grid';

/*
  Shared types (single source of truth)
  This avoids duplicate Product/Category definitions and prevents type mismatch issues.
*/
import { Category, Product } from '../../store-models/store-models';

@Component({
  // Selector to use this component in HTML: <app-store-container></app-store-container>
  selector: 'app-store-container',

  // Child components used in the template must be imported here.
  imports: [StoreHeader, ProductFilter, ProductGrid],

  // UI template and styles for this container component
  templateUrl: './store-container.html',
  styleUrls: ['./store-container.css']
})
export class StoreContainer {

  // Cart count shown in the header (StoreHeader)
  cartCount = 0;

  // Categories shown in the ProductFilter dropdown
  categories: Category[] = ['All', 'Laptop', 'Mobile', 'Accessories'];

  // Current selected category (used for filtering)
  selectedCategory: Category = 'All';

  // Search text entered by user (used for filtering)
  searchText = '';

  // Holds the product selected when user clicks "View"
  // If null => Quick View panel is hidden
  selectedProduct: Product | null = null;

  // In-memory product data (for learning/demo purpose)
  // In real projects, this data typically comes from API/service.
  products: Product[] = [
    { id: 1, name: 'ZenBook Pro', category: 'Laptop', price: 89999, rating: 4.6, inStock: true },
    { id: 2, name: 'Pixel Max', category: 'Mobile', price: 69999, rating: 4.4, inStock: true },
    { id: 3, name: 'Noise Cancelling Headphones', category: 'Accessories', price: 9999, rating: 4.2, inStock: false },
    { id: 4, name: 'Gaming Laptop X', category: 'Laptop', price: 109999, rating: 4.7, inStock: true },
    { id: 5, name: 'Wireless Charger', category: 'Accessories', price: 1999, rating: 4.1, inStock: true },
    { id: 6, name: 'SmartWatch Active', category: 'Accessories', price: 14999, rating: 4.3, inStock: true }
  ];

  /*
    filteredProducts is a "computed property" (getter).
    The template uses it like: [products]="filteredProducts"

    Why getter?
    - Always returns the latest filtered list
    - No need to manually recompute after each filter change
    - Keeps filtering logic inside the container (smart component)
  */
  get filteredProducts(): Product[] {
    return this.products
      // Filter by category (if All => no category filtering)
      .filter(p => (this.selectedCategory === 'All' ? true : p.category === this.selectedCategory))

      // Filter by search text (case-insensitive)
      .filter(p => p.name.toLowerCase().includes(this.searchText.trim().toLowerCase()));
  }

  /*
    Child (ProductFilter) → Parent (StoreContainer)
    The filter component emits filtersChanged event with selected category + search text.
    StoreContainer receives it and updates its own state.
  */
  onFiltersChanged(filters: { category: Category; searchText: string }) {
    this.selectedCategory = filters.category;
    this.searchText = filters.searchText;
  }

  /*
    Child (ProductGrid/ProductCard) → Parent (StoreContainer)
    When user clicks Add, the child emits the selected product.
    The container decides what to do (business logic).

    Here, we only increase cartCount if product is in stock.
  */
  onAddToCart(product: Product) {
    if (!product.inStock) return; // Prevent adding out-of-stock items
    this.cartCount++;
  }

  /*
    Child (ProductGrid/ProductCard) → Parent (StoreContainer)
    When user clicks "View", the child emits the selected product.
    We store it in selectedProduct so the Quick View panel can display details.
  */
  onViewDetails(product: Product) {
    this.selectedProduct = product;
  }

  /*
    Child (StoreHeader) → Parent (StoreContainer)
    When user clicks Clear Cart in the header, the header emits clearCart event.
    StoreContainer handles it by resetting the count.
  */
  onClearCart() {
    this.cartCount = 0;
  }

  /*
    Called when user clicks X (close) in Quick View panel.
    Setting selectedProduct to null hides the Quick View UI.
  */
  closeDetails() {
    this.selectedProduct = null;
  }
}