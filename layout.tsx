export const metadata = { title: "AI Closet Designer", description: "Tailored Closet AI Design Generator" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#f5f5f5", minHeight: "100vh" }}>{children}</body>
    </html>
  );
}
