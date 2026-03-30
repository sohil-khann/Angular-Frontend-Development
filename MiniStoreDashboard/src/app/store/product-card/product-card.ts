import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../store-models/store-models';      // Shared Product model (single source of truth)

@Component({
  // Selector used like:
  // <app-product-card></app-product-card>
  selector: 'app-product-card',

  // HTML + CSS files for this card component
  templateUrl: './product-card.html',
  styleUrls: ['./product-card.css']
})
export class ProductCard {

  /*
     @Input() product (Parent → Child communication)
    - Parent (ProductGrid) sends one Product object to this card.
    - Binding example: [product]="p"

    product! (Non-null assertion):
    - Tells TypeScript: "This will definitely be provided by parent"
    - Without this, TS may complain: product might be undefined.
  */
  @Input() product!: Product;

  /*
     @Output() add (Child → Parent communication)
    - This event is emitted when user clicks the "Add" button on the card
    - It sends the Product object to the parent
    - Parent listens like: (add)="onAdd($event)"
  */
  @Output() add = new EventEmitter<Product>();

  /*
     @Output() view (Child → Parent communication)
    - This event is emitted when user clicks the "View" button on the card
    - It sends the Product object to the parent
    - Parent listens like: (view)="onView($event)"
  */
  @Output() view = new EventEmitter<Product>();

  /*
     Called when user clicks "Add" button in product-card.html
    - Emits the current product to parent via (add) event
    - Child does NOT update cart count (parent handles that business logic)
  */
  addToCart() {
    this.add.emit(this.product); // Send selected product upward
  }

  /*
     Called when user clicks "View" button in product-card.html
    - Emits the current product to parent via (view) event
    - Parent sets selectedProduct and shows it in Quick View panel
  */
  viewNow() {
    this.view.emit(this.product); // Send selected product upward
  }
}