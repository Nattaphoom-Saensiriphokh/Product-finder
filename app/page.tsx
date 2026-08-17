import Link from "next/link";

export default function Home() {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Hello</h1>
      <Link
        href="/products"
        style={{
          display: "inline-block",
          marginTop: "1rem",
          padding: "0.6rem 1.2rem",
          border: "1px solid #333",
          borderRadius: "6px",
          textDecoration: "none",
        }}
      >
        ไปหน้าค้นหาสินค้า
      </Link>
    </div>
  );
}
