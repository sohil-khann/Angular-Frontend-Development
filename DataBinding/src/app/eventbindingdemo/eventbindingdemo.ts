import { Component } from '@angular/core';

@Component({
  selector: 'app-eventbindingdemo',
  imports: [],
  templateUrl: './eventbindingdemo.html',
  styleUrl: './eventbindingdemo.css',
})
export class Eventbindingdemo {

  // 1) DISPLAY DATA (Real-time values usually come from API)
  customerName: string = 'Pranaya Rout'; // Logged-in customer name
  orderId: string = 'ORD-10021';         // Current order reference number
  productName: string = 'Angular Course - Full Stack Bundle'; // Product/title to show on UI
  price: number = 4999; // Product price (per unit)

  // 2) UI STATE (User-driven values change via Event Binding)
  quantity: number = 1;        // Quantity selected by user (via buttons / typing)
  couponCode: string = '';     // Coupon code typed by user
  shippingOption: string = 'Standard'; // Dropdown selection

  // 3) STATUS FLAGS (These control UI badges, enable/disable etc.)
  isPremiumCustomer: boolean = true; // Premium gets discount
  isPaymentDone: boolean = false;    // Payment status controls Pay/Place Order buttons

  // 4) INVENTORY / DELIVERY (Common in e-commerce dashboards)
  stockLeft: number = 3;              // Remaining inventory shown to user/admin
  deliveryProgressPercent: number = 35; // Progress bar fill (0 to 100)

  // 5) UI FEEDBACK MESSAGE
  uiMessage: string = ''; // Displays success/error messages after user actions

  // 6) DISPLAY HELPERS (Used by Interpolation + Class/Style Binding)
  // Returns a label for the Payment badge
  // Used in template like: {{ getPaymentLabel() }}
  getPaymentLabel(): string {
    return this.isPaymentDone ? 'Paid' : 'Pending';
  }

  // Returns a label for the Membership badge
  // Used in template like: {{ getMembershipLabel() }}
  getMembershipLabel(): string {
    return this.isPremiumCustomer ? 'Premium' : 'Regular';
  }

  // Computes the final payable amount based on business rules
  // Real-time rule: Premium users get 20% discount
  // Used in template like: ₹{{ getFinalPayable() }}
  getFinalPayable(): number {
    const total = this.price * this.quantity;                    // base total = unit price × quantity
    const discount = this.isPremiumCustomer ? total * 0.2 : 0;   // 20% discount for premium
    return total - discount;                                     // final payable amount
  }

  // 7) EVENT HANDLERS (Event Binding: View → Component)
  // These methods are called when the user clicks/types/selects.
  // After data changes here, Angular automatically updates the UI.

  // (click) Increase quantity button
  // Real-time: Cart quantity should not exceed a practical limit (demo: max 10)
  increaseQuantity(): void {
    if (this.quantity < 10) {
      this.quantity++; // update the state
      this.uiMessage = `Quantity updated to ${this.quantity}.`; // show feedback message
    }
  }

  // (click) Decrease quantity button
  // Real-time: Quantity should not go below 1
  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--; // update the state
      this.uiMessage = `Quantity updated to ${this.quantity}.`; // show feedback message
    }
  }

  // (input) Quantity typed into the textbox
  // NOTE: We are not using ngModel yet. So we manually read the input from $event.
  onQuantityInput(event: Event): void {
    // Read current input value from the textbox
    const value = (event.target as HTMLInputElement).value;

    // Convert the string value to a number
    const parsed = Number(value);

    // Basic validation: must be a valid number and within 1..10
    if (!Number.isNaN(parsed) && parsed >= 1 && parsed <= 10) {
      this.quantity = parsed; // store in component state
      this.uiMessage = `Quantity set to ${this.quantity}.`;
    } else {
      // If user types invalid input, we don't update quantity
      this.uiMessage = 'Quantity must be between 1 and 10.';
    }
  }

  // (input) Coupon code typed into textbox
  // We store the latest typed value in couponCode
  onCouponInput(event: Event): void {
    this.couponCode = (event.target as HTMLInputElement).value;
  }

  // (click) Apply Coupon OR (keyup.enter) Apply Coupon
  // Real-time: coupon validation usually happens via API, here we simulate it with a simple rule
  applyCoupon(): void {
    const code = this.couponCode.trim().toUpperCase(); // normalize coupon input

    // If empty, show guidance
    if (code === '') {
      this.uiMessage = 'Please enter a coupon code.';
      return;
    }

    // Demo rule: only SAVE10 is considered valid
    if (code === 'SAVE10') {
      this.uiMessage = 'Coupon applied: SAVE10.';
    } else {
      this.uiMessage = `Invalid coupon: ${code}`;
    }
  }

  // (change) Shipping dropdown selection changed
  // Real-time: shipping changes can affect delivery ETA & price (demo shows only message)
  onShippingChange(event: Event): void {
    this.shippingOption = (event.target as HTMLSelectElement).value;
    this.uiMessage = `Shipping set to: ${this.shippingOption}`;
  }

  // (click) Pay Now button
  // Real-time: payment success changes multiple UI elements:
  // - payment badge becomes "Paid"
  // - Pay Now button gets disabled
  // - Place Order becomes enabled
  // - progress increases
  payNow(): void {
    this.isPaymentDone = true; // update payment status flag
    this.uiMessage = `Payment received for ${this.orderId}. You can now place the order.`;

    // Demo: once paid, order moves forward in workflow
    this.deliveryProgressPercent = 60;
  }

  // (submit) Place Order form submit
  // Real-time: final confirmation should not happen unless payment is done
  placeOrder(event: Event): void {
    event.preventDefault(); // prevent full page reload on form submit

    // Validate payment state first
    if (!this.isPaymentDone) {
      this.uiMessage = 'Please complete payment before placing the order.';
      return;
    }

    // Payment done: order can be placed successfully
    this.uiMessage = `Order placed successfully! Order Id: ${this.orderId}`;
    this.deliveryProgressPercent = 100; // demo: show as completed
  }

  // (click) Toggle Membership button
  // Real-time: membership changes can affect pricing (discount) and UI badge
  toggleMembership(): void {
    this.isPremiumCustomer = !this.isPremiumCustomer; // flip the membership flag
    this.uiMessage = `Membership changed to: ${this.getMembershipLabel()}`;
  }
}


