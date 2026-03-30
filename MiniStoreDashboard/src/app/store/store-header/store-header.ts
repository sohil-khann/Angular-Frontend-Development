import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  // Selector used in parent template like:
  // <app-store-header></app-store-header>
  selector: 'app-store-header',

  // HTML + CSS files for this component
  templateUrl: './store-header.html',
  styleUrls: ['./store-header.css']
})
export class StoreHeader {

  /*
    @Input() (Parent → Child communication)
    - cartCount value comes from the parent (StoreContainer)
    - Parent binds it like: [cartCount]="cartCount"
    - This component only displays it (does not control it)
  */
  @Input() cartCount = 0;

  /*
     @Output() (Child → Parent communication)
    - clearCart is a custom event this child component can raise
    - EventEmitter<void> means:
      "I will emit an event, but I will not send any data with it"
    - Parent listens like: (clearCart)="onClearCart()"
  */
  @Output() clearCart = new EventEmitter<void>();

  /*
    Called when user clicks "Clear Cart" button in the header UI.
    - It emits (raises) the clearCart event.
    - The child does NOT clear the cart itself.
    - The parent decides what to do when it receives this event.
  */
  onClear() {
    this.clearCart.emit(); // Emit event to parent (no data is sent)
  }
}