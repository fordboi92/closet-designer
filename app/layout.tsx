import Link from "next/link";

export const metadata = { title: "AI Closet Designer", description: "Tailored Closet AI Design Tools" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#f5f5f5", minHeight: "100vh", fontFamily: "system-ui, sans-serif" }}>
        <nav style={{ background: "#1a1a1a", padding: "0 1rem", display: "flex", gap: 0 }}>
          <Link href="/" style={{ color: "#fff", textDecoration: "none", padding: "14px 20px", fontSize: 14, fontWeight: 500, borderBottom: "2px solid transparent", display: "inline-block" }}>
            AI Design Generator
          </Link>
          <Link href="/redesign" style={{ color: "#aaa", textDecoration: "none", padding: "14px 20px", fontSize: 14, fontWeight: 500, borderBottom: "2px solid transparent", display: "inline-block" }}>
            Photo Redesign
          </Link>
        </nav>
        {children}
      </body>
    </html>
  );
}
