// It's a best practice to define specific string literal types as their own type alias.

export type IconName = "dollar-sign" | "users" | "credit-card" | "activity";
export type OrderStatus = "Pending" | "Fulfilled" | "Cancelled";
export type VariantType = "Size" | "Color" | "Material" | "Layout";
export type PaymentMethod = "Credit Card" | "PayPal" | "Bank Transfer";
export type ProductStatus = "Active" | "Draft" | "Archived";

// --- Data Visualization Types ---

export interface RevenueData {
  month: string;
  revenue: number;
  goal: number;
}

export interface TopProductData {
  name: string;
  sales: number;
  fill: string;
}

export interface Stat {
  id: number;
  title: string;
  value: string;
  change: string;
  icon: IconName;
}

// --- Core E-Commerce Types ---

export interface Variant {
  id: string;
  type: VariantType;
  value: string;
  price: number;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: ProductStatus;
  description: string;
  image: string;
  variants?: Variant[];
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  totalOrders: number;
  totalSpent: number;
}

export interface RecentSale {
  id: number;
  name: string;
  email: string;
  amount: string;
  avatar: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  variantType?: VariantType;
  variantValue?: string;
}

export interface Order {
  id: string;
  customerId?: string; // Optional link to a customer
  customerName: string;
  customerEmail: string;
  date: string;
  status: OrderStatus;
  items: OrderItem[];
  shippingAddress: {
    street: string;
    city: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: PaymentMethod;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}
