import Link from "next/link";
import type { CSSProperties } from "react";
import { filterProducts } from "@/lib/filter-products";
import { Product, products } from "@/data/products";

const PAGE_SIZE = 4;

const CATEGORIES = [
  { value: "all", label: "ทั้งหมด" },
  { value: "office", label: "Office" },
  { value: "tech", label: "Tech" },
  { value: "lifestyle", label: "Lifestyle" },
];

const SORT_OPTIONS = [
  { value: "name", label: "ชื่อ (ก-ฮ)" },
  { value: "price-asc", label: "ราคา: น้อย → มาก" },
  { value: "price-desc", label: "ราคา: มาก → น้อย" },
];

type PageProps = {
  searchParams: Promise<{
    q?: string;
    category?: string;
    sort?: string;
    page?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
};

// รับค่าจาก query string มาเป็นตัวเลข "ราคา" — ถ้าไม่ใช่ตัวเลขหรือติดลบ ให้ถือว่าไม่ได้กรอง
function parsePriceParam(value: string | undefined): number | undefined {
  if (value === undefined || value.trim() === "") return undefined;
  const parsed = Number(value);
  if (Number.isNaN(parsed) || parsed < 0) return undefined;
  return parsed;
}

// รับค่า page จาก query string
// - ไม่มีค่า / ไม่ใช่ตัวเลข (เช่น "abc") / น้อยกว่า 1 (เช่น -5) -> fallback เป็นหน้า 1
function parsePageParam(value: string | undefined): number {
  if (value === undefined) return 1;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) return 1;
  return parsed;
}

// สร้าง query string จาก object โดยตัด key ที่เป็น undefined ทิ้ง
function buildQueryString(
  params: Record<string, string | number | undefined>,
): string {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      search.set(key, String(value));
    }
  });
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = params.q ?? "";
  const category = params.category ?? "all";
  const sort =
    params.sort === "price-asc" || params.sort === "price-desc"
      ? params.sort
      : "name";
  const minPrice = parsePriceParam(params.minPrice);
  const maxPrice = parsePriceParam(params.maxPrice);

  const filtered: Product[] = filterProducts(products, {
    query,
    category,
    sort,
    minPrice,
    maxPrice,
  });

  // คำนวณจำนวนหน้าทั้งหมดจากผลลัพธ์ที่กรองแล้ว (อย่างน้อย 1 หน้าเสมอ แม้ผลลัพธ์จะว่าง)
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  // ถ้า page เกินจำนวนหน้าจริง (เช่น ?page=999) ให้ "หนีบ" ไว้ที่หน้าสุดท้ายแทนที่จะแสดงหน้าว่าง
  const requestedPage = parsePageParam(params.page);
  const currentPage = Math.min(requestedPage, totalPages);

  const start = (currentPage - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);

  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  // พารามิเตอร์อื่น ๆ ที่ต้องคงไว้เวลาเปลี่ยนหน้า (ไม่ใส่ค่า default เพื่อให้ URL สะอาด)
  const baseParams = {
    q: query || undefined,
    category: category !== "all" ? category : undefined,
    sort: sort !== "name" ? sort : undefined,
    minPrice,
    maxPrice,
  };

  const prevHref = buildQueryString({
    ...baseParams,
    page: currentPage - 1 > 1 ? currentPage - 1 : undefined,
  });
  const nextHref = buildQueryString({
    ...baseParams,
    page: currentPage + 1,
  });

  const linkStyle: CSSProperties = {
    padding: "0.4rem 0.9rem",
    border: "1px solid #333",
    borderRadius: "6px",
    textDecoration: "none",
    color: "inherit",
  };

  const disabledStyle: CSSProperties = {
    ...linkStyle,
    color: "#999",
    borderColor: "#ddd",
  };

  return (
    <div style={{ maxWidth: "720px", margin: "0 auto", padding: "2rem" }}>
      <h1>Product page.</h1>

      {/* ฟอร์มสำหรับกรองสินค้า — ใช้ GET เพื่อให้ตัวกรองอยู่ใน query string และกลับหน้า 1 เสมอ */}
      <form
        method="get"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.75rem",
          alignItems: "flex-end",
          padding: "1rem",
          border: "1px solid #ddd",
          borderRadius: "8px",
          marginBottom: "1.5rem",
        }}
      >
        <label style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          ค้นหา
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="ชื่อสินค้า..."
            style={{ padding: "0.4rem", border: "1px solid #ccc", borderRadius: "4px" }}
          />
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          หมวดหมู่
          <select
            name="category"
            defaultValue={category}
            style={{ padding: "0.4rem", border: "1px solid #ccc", borderRadius: "4px" }}
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          เรียงตาม
          <select
            name="sort"
            defaultValue={sort}
            style={{ padding: "0.4rem", border: "1px solid #ccc", borderRadius: "4px" }}
          >
            {SORT_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          ราคาต่ำสุด
          <input
            type="number"
            name="minPrice"
            min={0}
            step="0.01"
            defaultValue={minPrice ?? ""}
            placeholder="0"
            style={{ padding: "0.4rem", border: "1px solid #ccc", borderRadius: "4px", width: "6rem" }}
          />
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          ราคาสูงสุด
          <input
            type="number"
            name="maxPrice"
            min={0}
            step="0.01"
            defaultValue={maxPrice ?? ""}
            placeholder="ไม่จำกัด"
            style={{ padding: "0.4rem", border: "1px solid #ccc", borderRadius: "4px", width: "6rem" }}
          />
        </label>

        <button
          type="submit"
          style={{
            padding: "0.5rem 1.2rem",
            border: "1px solid #333",
            borderRadius: "6px",
            background: "#171717",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          กรอง
        </button>
        <Link href="/products" style={{ alignSelf: "center", fontSize: "0.9rem" }}>
          ล้างตัวกรอง
        </Link>
      </form>

      <h6>q : {query}</h6>
      <h6>category : {category}</h6>
      <h6>sort : {sort}</h6>
      <h6>minPrice : {minPrice ?? "-"}</h6>
      <h6>maxPrice : {maxPrice ?? "-"}</h6>
      <h6>
        page : {currentPage} / {totalPages}
      </h6>
      <hr />
      {pageItems.length === 0 && <p>ไม่พบสินค้าที่ตรงกับเงื่อนไข</p>}
      {pageItems.map((item: Product) => (
        <h1 key={item.id} style={{ fontSize: "1.1rem" }}>
          {item.name} — ${item.price.toFixed(2)}
        </h1>
      ))}
      <hr />
      <nav style={{ display: "flex", gap: "1rem" }}>
        {hasPrev ? (
          <Link href={prevHref} style={linkStyle}>
            Previous
          </Link>
        ) : (
          <span aria-disabled="true" style={disabledStyle}>
            Previous
          </span>
        )}
        {hasNext ? (
          <Link href={nextHref} style={linkStyle}>
            Next
          </Link>
        ) : (
          <span aria-disabled="true" style={disabledStyle}>
            Next
          </span>
        )}
      </nav>
    </div>
  );
}
