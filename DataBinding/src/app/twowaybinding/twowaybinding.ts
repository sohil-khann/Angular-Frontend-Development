import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-twowaybinding',
  imports: [FormsModule],
  templateUrl: './twowaybinding.html',
  styleUrl: './twowaybinding.css',
})
export class Twowaybinding {
 

  // 1) DISPLAY DATA (Normally comes from API / logged-in session)
  // Purpose:
  // - These are the "read-only" values we show on the screen.
  // - In real projects, these typically come from backend services.
  customerName: string = 'Pranaya Rout';                   // Customer name shown in summary
  orderId: string = 'ORD-10021';                           // Unique order reference
  productName: string = 'Angular Course - Full Stack Bundle'; // Product name shown in UI
  price: number = 4999;                                    // Per-unit price (₹)

  // 2) TWO-WAY BINDING STATE ([(ngModel)] keeps UI <-> TS synced)
  // Purpose:
  // - These values are changed by the user (typing/selecting).
  // - Two-way binding ensures:
  //   UI changes update TS automatically AND TS changes update UI.
  quantity: number = 1;                // User-selected quantity (default 1)
  couponCode: string = '';             // Coupon typed by the user
  shippingOption: string = 'Standard'; // Default selection in dropdown

  // 3) STATUS FLAGS (Used for Class/Property/Style Binding)
  // Purpose:
  // - These booleans drive visual state (Paid/Pending, Premium/Regular)
  // - Also used to enable/disable buttons in the template.
  isPremiumCustomer: boolean = true;  // Premium users get discount
  isPaymentDone: boolean = false;     // Controls Pay/Place Order flow

  // 4) INVENTORY + DELIVERY (Common dashboard fields)
  // Purpose:
  // - stockLeft can show warnings (low-stock highlighting)
  // - deliveryProgressPercent drives a progress bar UI (0..100)
  stockLeft: number = 3;                 // Inventory left
  deliveryProgressPercent: number = 35;  // Delivery progress percentage

  // 5) UI FEEDBACK MESSAGE (Displayed to user after actions)
  // Purpose:
  // - After any click/input action, show a short message.
  // - This is a typical UX pattern in real checkout flows.
  uiMessage: string = ''; // Example: "Coupon applied", "Quantity updated", etc.

  // 6) HELPER METHODS (Used mainly for display in template)
  // Purpose:
  // - Keep template clean by preparing readable text in TS.
  // - Used via interpolation: {{ getPaymentLabel() }}

  // Returns a human-friendly label for payment status badge.
  getPaymentLabel(): string {
    // If payment completed -> Paid, else -> Pending
    return this.isPaymentDone ? 'Paid' : 'Pending';
  }

  // Returns a human-friendly label for membership badge.
  getMembershipLabel(): string {
    // If premium -> Premium, else -> Regular
    return this.isPremiumCustomer ? 'Premium' : 'Regular';
  }

  // Calculates final payable amount using business rules.
  // Real-time rule:
  // - Premium customers get 20% discount on total amount.
  // This method is displayed in UI as: ₹{{ getFinalPayable() }}
  getFinalPayable(): number {
    const total = this.price * this.quantity;                  // Total = price × quantity
    const discount = this.isPremiumCustomer ? total * 0.2 : 0; // 20% discount for premium users
    return total - discount;                                   // Final amount after discount
  }

  // 7) EVENT HANDLERS (Triggered by user actions in the template)
  // Purpose:
  // - These methods are called via event binding: (click), (submit), etc.
  // - After updating component state, Angular automatically updates the UI.

  // Increase quantity (called by + button)
  // Real-time rule:
  // - E-commerce apps usually cap quantity to avoid unrealistic orders.
  // - Demo cap: max 10.
  increaseQuantity(): void {
    if (this.quantity < 10) {
      this.quantity++; // Update quantity in component state
      this.uiMessage = `Quantity updated to ${this.quantity}.`; // User feedback
    }
  }

  // Decrease quantity (called by - button)
  // Real-time rule:
  // - Quantity should not go below 1.
  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--; // Update quantity in component state
      this.uiMessage = `Quantity updated to ${this.quantity}.`; // User feedback
    }
  }

  // Called when quantity changes via [(ngModel)] input typing.
  // Why do we need this even with ngModel?
  // - Because user can type invalid numbers (0, -5, 999, empty, etc.)
  // - We validate and keep the state safe.
  onQuantityChanged(value: number): void {
    const parsed = Number(value); // Convert to number safely

    // Valid range check: 1..10
    if (!Number.isNaN(parsed) && parsed >= 1 && parsed <= 10) {
      this.quantity = parsed; // Accept valid input
      this.uiMessage = `Quantity set to ${this.quantity}.`;
    } else {
      // Reset to safe default and inform the user
      this.quantity = 1;
      this.uiMessage = 'Quantity must be between 1 and 10. Reset to 1.';
    }
  }

  // Apply coupon (called by Apply button or Enter key)
  // Real-world note:
  // - Usually coupon validation happens via API call.
  // - Here we simulate it with a simple rule for learning.
  applyCoupon(): void {
    const code = this.couponCode.trim().toUpperCase(); 
    // trim() removes extra spaces, toUpperCase() standardizes input

    // Empty coupon => show guidance
    if (code === '') {
      this.uiMessage = 'Please enter a coupon code.';
      return;
    }

    // Demo rule: Only SAVE10 is valid
    if (code === 'SAVE10') {
      this.uiMessage = 'Coupon applied: SAVE10.';
    } else {
      this.uiMessage = `Invalid coupon: ${code}`;
    }
  }

  // Called when shipping dropdown changes.
  // Real-world note:
  // - Shipping selection often affects delivery estimate and charges.
  // - Here we show a confirmation message for learning.
  onShippingChanged(value: string): void {
    this.shippingOption = value; // Update selected option
    this.uiMessage = `Shipping set to: ${this.shippingOption}`;
  }

  // Toggle membership (demo action)
  // Real-world note:
  // - Membership may come from user profile / subscription.
  // - We keep a toggle only for learning how UI changes with state.
  toggleMembership(): void {
    this.isPremiumCustomer = !this.isPremiumCustomer; // Flip boolean
    this.uiMessage = `Membership changed to: ${this.getMembershipLabel()}.`;
  }

  // Pay Now action
  // Real-world behaviour:
  // - Payment success changes the application workflow:
  //   1) Payment badge turns to Paid
  //   2) Pay Now button disables
  //   3) Place Order becomes enabled
  //   4) Progress moves forward
  payNow(): void {
    this.isPaymentDone = true; // Payment marked as completed
    this.uiMessage = `Payment received for ${this.orderId}. You can now place the order.`;

    // Demo: After payment, delivery process advances
    this.deliveryProgressPercent = 60;
  }

  // Place Order action (form submit)
  // Why preventDefault?
  // - HTML forms try to reload the page on submit.
  // - In SPA apps like Angular, we avoid full reload.
  placeOrder(event: Event): void {
    event.preventDefault(); // Stop browser default form submission

    // Safety validation: Don't allow placing order before payment
    if (!this.isPaymentDone) {
      this.uiMessage = 'Please complete payment before placing the order.';
      return;
    }

    // Success scenario
    this.uiMessage = `Order placed successfully! Order Id: ${this.orderId}`;

    // Demo: Mark delivery progress as complete
    this.deliveryProgressPercent = 100;
  }
}

