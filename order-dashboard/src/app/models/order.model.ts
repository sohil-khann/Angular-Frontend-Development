export type OrderStatus = 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
export type PaymentMethod = 'UPI' | 'Card' | 'COD';
export type PaymentStatus = 'Paid' | 'Unpaid' | 'Refunded';
export type DeliveryStatus = 'NotDispatched' | 'Shipped' | 'InTransit' | 'OutForDelivery' | 'Delivered';
export type DeliveryPartner = 'Delhivery' | 'Blue Dart' | 'DTDC' | 'Ecom Express' | 'India Post';

export interface Order {
  id: number;
  customerName: string;
  customerPhone: string;
  city: string;
  orderDate: string;
  itemsCount: number;
  trackingId: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  deliveryStatus: DeliveryStatus;
  totalAmount: number;

  //Note: ? means optional. So Pending/Confirmed orders can skip it.
  deliveryPartner?: DeliveryPartner;
  awbNumber?: string;      // Courier Tracking Number
  pickedUpAt?: string;     // When the courier picked the Order
  deliveredAt?: string;    // Set only when deliveryStatus === 'Delivered'
}
