import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProductCard } from '../product-card/product-card'; // Child component used inside ProductGrid template
import { Product } from '../../store-models/store-models'; // Shared Product model (single source of truth)

@Component({
  // Selector used in parent template like:
  // <app-product-grid></app-product-grid>
  selector: 'app-product-grid',

  /*
   Imports needed by this component template:
    - CommonModule: for *ngFor / pipes, etc.
    - ProductCard: because template uses <app-product-card>
  */
  imports: [ProductCard],

  // HTML + CSS files for this component
  templateUrl: './product-grid.html',
  styleUrls: ['./product-grid.css']
})
export class ProductGrid {

  /*
    @Input() products (Parent → Child)
    - Parent (StoreContainer) sends the product list to display
    - Example binding: [products]="filteredProducts"
  */
  @Input() products: Product[] = [];

  /*
    @Output() addToCart (Child → Parent)
    - ProductGrid will emit the product when user clicks "Add" inside ProductCard
    - Parent listens like: (addToCart)="onAddToCart($event)"
  */
  @Output() addToCart = new EventEmitter<Product>();

  /*
     @Output() viewDetails (Child → Parent)
    - ProductGrid will emit the product when user clicks "View" inside ProductCard
    - Parent listens like: (viewDetails)="onViewDetails($event)"
  */
  @Output() viewDetails = new EventEmitter<Product>();

  /*
     Called when ProductCard raises its (add) event.
    - This method simply forwards the same product upward to the parent.
    - ProductGrid itself does NOT update cart count (parent handles that logic).
  */
  onAdd(product: Product) {
    this.addToCart.emit(product); // Emit selected product to StoreContainer
  }

  /*
     Called when ProductCard raises its (view) event.
    - This method forwards the product upward to the parent.
    - Parent sets selectedProduct and shows Quick View panel.
  */
  onView(product: Product) {
    this.viewDetails.emit(product); // Emit selected product to StoreContainer
  }
}