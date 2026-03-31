import { Component } from '@angular/core';
import { Order, OrderStatus } from '../models/order.model';

@Component({
  selector: 'app-orders-dashboard',
  standalone: true,
  templateUrl: './orders-dashboard.html'
})
export class OrdersDashboard {

  // FILTER STATE (Search + Status)
  // Search box text. We match this against a few main columns:
  // Order Id, Customer Name, Phone, City, Tracking Id.
  searchText = '';

  // Selected status .
  // any value from OrderStatus (i.e., 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled')
  // OR the special value 'All'
  selectedStatus: OrderStatus | 'All' = 'All';

  // PAGINATION STATE
  // Dropdown options shown in UI: "Rows per page"
  pageSizeOptions = [5, 10, 15, 20];

  // Default rows per page
  pageSize = 5;

  // Default Current page number
  currentPage = 1;

  // MODAL STATE
  // When user clicks "View", we store the selected row here.
  // If this is not null -> modal appears with full order details.
  selectedOrder: Order | null = null;

  // DUMMY DATA (15 HARDCODED RECORDS)
  orders: Order[] = [
    { id: 101, customerName: 'Ravi Kumar', customerPhone: '9876543210', city: 'Bhubaneswar', orderDate: '2026-01-10', itemsCount: 2, trackingId: 'TRK-101', status: 'Pending', deliveryStatus: 'NotDispatched', paymentMethod: 'COD', paymentStatus: 'Unpaid', totalAmount: 1499 },
    { id: 102, customerName: 'Anita Das', customerPhone: '9123456789', city: 'Cuttack', orderDate: '2026-01-11', itemsCount: 1, trackingId: 'TRK-102', status: 'Confirmed', deliveryStatus: 'NotDispatched', paymentMethod: 'UPI', paymentStatus: 'Paid', totalAmount: 799 },
    { id: 103, customerName: 'John Paul', customerPhone: '9988776655', city: 'Puri', orderDate: '2026-01-12', itemsCount: 3, trackingId: 'TRK-103', status: 'Shipped', deliveryStatus: 'Shipped', paymentMethod: 'Card', paymentStatus: 'Paid', totalAmount: 2599, deliveryPartner: 'Delhivery', awbNumber: 'DLV-784512369', pickedUpAt: '2026-01-12T16:10:00' },
    { id: 104, customerName: 'Suman Jena', customerPhone: '9090909090', city: 'Bhubaneswar', orderDate: '2026-01-13', itemsCount: 1, trackingId: 'TRK-104', status: 'Delivered', deliveryStatus: 'Delivered', paymentMethod: 'COD', paymentStatus: 'Paid', totalAmount: 499, deliveryPartner: 'Ecom Express', awbNumber: 'ECOM-11002457', pickedUpAt: '2026-01-13T10:05:00', deliveredAt: '2026-01-14T18:25:00' },
    { id: 105, customerName: 'Priya Singh', customerPhone: '7008123456', city: 'Rourkela', orderDate: '2026-01-14', itemsCount: 2, trackingId: 'TRK-105', status: 'Cancelled', deliveryStatus: 'NotDispatched', paymentMethod: 'Card', paymentStatus: 'Refunded', totalAmount: 999 },

    { id: 106, customerName: 'Amit Sharma', customerPhone: '7894561230', city: 'Sambalpur', orderDate: '2026-01-15', itemsCount: 4, trackingId: 'TRK-106', status: 'Shipped', deliveryStatus: 'InTransit', paymentMethod: 'UPI', paymentStatus: 'Paid', totalAmount: 1899, deliveryPartner: 'DTDC', awbNumber: 'DTDC-55890177', pickedUpAt: '2026-01-15T14:25:00' },
    { id: 107, customerName: 'Rakesh Nayak', customerPhone: '6370123456', city: 'Balasore', orderDate: '2026-01-16', itemsCount: 1, trackingId: 'TRK-107', status: 'Confirmed', deliveryStatus: 'NotDispatched', paymentMethod: 'COD', paymentStatus: 'Unpaid', totalAmount: 649 },
    { id: 108, customerName: 'Nandini Mishra', customerPhone: '9437123456', city: 'Berhampur', orderDate: '2026-01-17', itemsCount: 2, trackingId: 'TRK-108', status: 'Shipped', deliveryStatus: 'OutForDelivery', paymentMethod: 'Card', paymentStatus: 'Paid', totalAmount: 1299, deliveryPartner: 'Blue Dart', awbNumber: 'BD-990123445', pickedUpAt: '2026-01-17T09:40:00' },
    { id: 109, customerName: 'Sanjay Rout', customerPhone: '8249123456', city: 'Bhubaneswar', orderDate: '2026-01-18', itemsCount: 3, trackingId: 'TRK-109', status: 'Delivered', deliveryStatus: 'Delivered', paymentMethod: 'COD', paymentStatus: 'Paid', totalAmount: 2199, deliveryPartner: 'Delhivery', awbNumber: 'DLV-991120045', pickedUpAt: '2026-01-18T08:55:00', deliveredAt: '2026-01-19T15:10:00' },
    { id: 110, customerName: 'Pooja Patra', customerPhone: '7682123456', city: 'Cuttack', orderDate: '2026-01-19', itemsCount: 2, trackingId: 'TRK-110', status: 'Pending', deliveryStatus: 'NotDispatched', paymentMethod: 'UPI', paymentStatus: 'Paid', totalAmount: 999 },

    { id: 111, customerName: 'Kiran Das', customerPhone: '9556123456', city: 'Puri', orderDate: '2026-01-20', itemsCount: 1, trackingId: 'TRK-111', status: 'Confirmed', deliveryStatus: 'NotDispatched', paymentMethod: 'UPI', paymentStatus: 'Paid', totalAmount: 399 },
    { id: 112, customerName: 'Deepak Behera', customerPhone: '8895123456', city: 'Rourkela', orderDate: '2026-01-21', itemsCount: 4, trackingId: 'TRK-112', status: 'Shipped', deliveryStatus: 'InTransit', paymentMethod: 'COD', paymentStatus: 'Unpaid', totalAmount: 2799, deliveryPartner: 'India Post', awbNumber: 'IP-OD-77219011', pickedUpAt: '2026-01-21T12:30:00' },
    { id: 113, customerName: 'Manas Panda', customerPhone: '9337123456', city: 'Sambalpur', orderDate: '2026-01-22', itemsCount: 2, trackingId: 'TRK-113', status: 'Shipped', deliveryStatus: 'Shipped', paymentMethod: 'Card', paymentStatus: 'Paid', totalAmount: 1599, deliveryPartner: 'Ecom Express', awbNumber: 'ECOM-77890120', pickedUpAt: '2026-01-22T17:05:00' },
    { id: 114, customerName: 'Ritika Sahu', customerPhone: '7077123456', city: 'Balasore', orderDate: '2026-01-23', itemsCount: 1, trackingId: 'TRK-114', status: 'Cancelled', deliveryStatus: 'NotDispatched', paymentMethod: 'COD', paymentStatus: 'Unpaid', totalAmount: 549 },
    { id: 115, customerName: 'Alok Mohanty', customerPhone: '9861123456', city: 'Berhampur', orderDate: '2026-01-24', itemsCount: 3, trackingId: 'TRK-115', status: 'Delivered', deliveryStatus: 'Delivered', paymentMethod: 'Card', paymentStatus: 'Paid', totalAmount: 1999, deliveryPartner: 'DTDC', awbNumber: 'DTDC-88001429', pickedUpAt: '2026-01-24T09:15:00', deliveredAt: '2026-01-25T13:40:00' }
  ];

  // FILTER ACTIONS (UI EVENTS)
  // When user clicks a status:
  //   1) update selectedStatus
  //   2) reset page to 1
  setStatus(status: OrderStatus | 'All') {
    this.selectedStatus = status;
    this.currentPage = 1;
  }

  // Clears search and resets page when the use click on the Clear button
  clearSearch() {
    this.searchText = '';
    this.currentPage = 1;
  }

  // Runs on typing in search box; resets page
  onSearchChange(value: string) {
    this.searchText = value;
    this.currentPage = 1;
  }

  // MODAL ACTIONS
  // Open the Model
  openModal(order: Order) {
    this.selectedOrder = order;
  }

  // Close the Model
  closeModal() {
    this.selectedOrder = null;
  }

  // FILTERING with PAGINATION
  // In TypeScript, get means we are creating a getter property
  // filteredOrders looks like a variable, but it’s actually a method that runs automatically when you access it.

  // What it does:
  // 1) Search Filter:
  //    - If searchText is empty => allow all records
  //    - Otherwise => match searchText against key columns:
  //      OrderId, CustomerName, Phone, City, TrackingId
  //
  // 2) Status Filter:
  //    - If selectedStatus is 'All' => allow all statuses
  //    - Otherwise => keep only orders matching the selected status
  //
  // Output:
  // - Returns a new array containing only matching orders.
  // - Pagination later takes this filtered array and slices it per page.
  get filteredOrders(): Order[] {
    const text = this.searchText.trim().toLowerCase();

    return this.orders.filter(o => {
      // Search match:
      // true if search is empty OR any field contains the typed text
      const matchesText =
        !text ||
        String(o.id).includes(text) ||
        o.customerName.toLowerCase().includes(text) ||
        o.customerPhone.includes(text) ||
        o.city.toLowerCase().includes(text) ||
        o.trackingId.toLowerCase().includes(text);

      // Status match:
      // true if user selected 'All' OR order status equals selectedStatus
      const matchesStatus =
        this.selectedStatus === 'All' || o.status === this.selectedStatus;

      // Order is included only if it matches BOTH search + status criteria
      return matchesText && matchesStatus;
    });
  }

  // PAGINATION (CALCULATIONS USED BY UI)

  // Total records AFTER applying search + status filter
  get totalRecords(): number {
    return this.filteredOrders.length;
  }

  // Total pages AFTER applying filters:
  // Example: 12 records, pageSize 5 => ceil(12/5) = 3 pages
  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalRecords / this.pageSize));
  }

  // Start index for label: "6 - 10 of 15"
  //
  // Explanation:
  // - (currentPage - 1) * pageSize = how many records are skipped before this page
  // - + 1 = UI numbering starts from 1, not 0
  //
  // Example (pageSize=5):
  // - Page 1 => (1-1)*5 + 1 = 1
  // - Page 2 => (2-1)*5 + 1 = 6
  get startRecordIndex(): number {
    if (this.totalRecords === 0) return 0;
    return ((this.currentPage - 1) * this.pageSize) + 1;
  }

  // End index for label: "6 - 10 of 15"
  //
  // Normally: currentPage * pageSize
  // But on the last page we may not have full records,
  // so Math.min keeps end index within totalRecords.
  //
  // Example (totalRecords=12, pageSize=5):
  // - Page 3 => min(3*5, 12) = 12
  get endRecordIndex(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalRecords);
  }

  // Returns only the rows to display on the CURRENT page.
  get pagedOrders(): Order[] {
    const start = (this.currentPage - 1) * this.pageSize;

    // slice() is an array method used to extract a part of an array and return it as a new array.
    return this.filteredOrders.slice(start, start + this.pageSize);
  }

  // When user changes "Rows per page", reset to page 1
  changePageSize(size: number) {
    this.pageSize = Number(size);
    this.currentPage = 1;
  }

  // PAGINATION BUTTON
  get isFirstPage(): boolean {
    return this.currentPage <= 1;
  }

  get isLastPage(): boolean {
    return this.currentPage >= this.totalPages;
  }

  firstPage() {
    this.currentPage = 1;
  }

  lastPage() {
    this.currentPage = this.totalPages;
  }

  prevPage() {
    if (!this.isFirstPage) this.currentPage--;
  }

  nextPage() {
    if (!this.isLastPage) this.currentPage++;
  }

  // BADGE HELPERS (BOOTSTRAP COLORS)
  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Pending':   return 'text-bg-warning text-dark';
      case 'Confirmed': return 'text-bg-info text-dark';
      case 'Shipped':   return 'text-bg-primary';
      case 'Delivered': return 'text-bg-success';
      case 'Cancelled': return 'text-bg-danger';
      default:          return 'text-bg-secondary';
    }
  }

  getPaymentBadgeClass(paymentStatus: string): string {
    switch (paymentStatus) {
      case 'Paid': return 'text-bg-success';
      case 'Unpaid': return 'text-bg-warning text-dark';
      case 'Refunded': return 'text-bg-secondary';
      default: return 'text-bg-dark';
    }
  }

  getDeliveryBadgeClass(deliveryStatus: string): string {
    switch (deliveryStatus) {
      case 'NotDispatched': return 'text-bg-secondary';
      case 'Shipped': return 'text-bg-primary';
      case 'InTransit': return 'text-bg-info text-dark';
      case 'OutForDelivery': return 'text-bg-warning text-dark';
      case 'Delivered': return 'text-bg-success';
      default: return 'text-bg-secondary';
    }
  }
}
