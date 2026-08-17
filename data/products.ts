export type Product = {
  id: number;
  name: string;
  category: "office" | "tech" | "lifestyle";
  price: number;
  owner?: string;
};
export const products: Product[] = [
  { id: 1, name: "Standing Desk", category: "office", price: 299.99 },
  { id: 2, name: "Ergonomic Chair", category: "office", price: 189.5},
  { id: 3, name: "Desk Lamp", category: "tech", price: 24.99 },
  { id: 4, name: "Wireless Mouse", category: "tech", price: 39.99 },
  { id: 5, name: "Mechanical Keyboard", category: "tech", price: 89.99 },
  { id: 6, name: "USB-C Hub", category: "tech", price: 29.99 },
  { id: 7, name: "27-inch Monitor", category: "tech", price: 249.0 },
  { id: 8, name: "Yoga Mat", category: "lifestyle", price: 19.99 },
  { id: 9, name: "Water Bottle", category: "lifestyle", price: 14.99 },
  { id: 10, name: "Travel Backpack", category: "lifestyle", price: 79.99 },
];
