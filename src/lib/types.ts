/**
 * Defines the specific names of icons used in the dashboard's stat cards.
 * This prevents typos and ensures only valid icon names are used.
 */
export type IconName = "dollar-sign" | "users" | "credit-card" | "activity";

/**
 * Represents a single statistic card displayed on the main dashboard.
 */
export interface Stat {
  id: number;
  title: string;
  value: string;
  change: string;
  icon: IconName; // Uses the IconName type for strictness
}

/**
 * Defines the structure for a single data point in the monthly sales chart.
 */
export interface SalesData {
  name: string; // e.g., "Jan", "Feb"
  total: number;
}

/**
 * Represents a single recent sale entry in the dashboard list.
 */
export interface RecentSale {
  id: number;
  name: string;
  email: string;
  amount: string;
  avatar: string;
}

/**
 * Represents a product variant, like a specific size or color.
 */
export interface Variant {
  id: string;
  type: string; // e.g., "Size", "Color"
  value: string; // e.g., "Medium", "Blue"
  price: number;
  stock: number;
}

/**
 * The main product interface, representing a single product in the inventory.
 */
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "Active" | "Draft" | "Archived";
  description: string;
  image: string;
  variants?: Variant[]; // A product can optionally have variants
}

/**
 * Defines the structure for the revenue overview chart, comparing revenue to a goal.
 */
export interface RevenueData {
  month: string;
  revenue: number;
  goal: number;
}

/**
 * Represents a single data point for the top-selling products pie chart.
 */
export interface TopProductData {
  name: string;
  sales: number;
  fill: string; // The color used for the pie chart slice
}
