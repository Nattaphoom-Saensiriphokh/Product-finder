import { Product } from "@/data/products";

export type ProductFilter = {
  query: string;
  category: string;
  sort: "name" | "price-asc" | "price-desc";
  minPrice?: number;
  maxPrice?: number;
};

export function filterProducts(
  products: Product[],
  filter: ProductFilter,
): Product[] {
  const query = filter.query.trim().toLowerCase();
  return products
    .filter((product) => {
      const matchesQuery = product.name.toLowerCase().includes(query);
      const matchesCategory =
        filter.category === "all" || product.category === filter.category;
      const matchesMin =
        filter.minPrice === undefined || product.price >= filter.minPrice;
      const matchesMax =
        filter.maxPrice === undefined || product.price <= filter.maxPrice;
      return matchesQuery && matchesCategory && matchesMin && matchesMax;
    })
    .sort((a, b) => {
      if (filter.sort === "price-asc") return a.price - b.price;
      if (filter.sort === "price-desc") return b.price - a.price;
      return a.name.localeCompare(b.name);
    });
}
