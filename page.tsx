"use client";

import { useState } from "react";

const PRIORITIES = [
  { label: "Long hanging", value: "Hanging clothes (long)" },
  { label: "Short hanging", value: "Hanging clothes (short/folded)" },
  { label: "Shoe storage", value: "Shoe storage" },
  { label: "Drawers", value: "Drawer units" },
  { label: "Folded items", value: "Shelving for folded items" },
  { label: "Accessories", value: "Accessory storage (belts, ties, jewelry)" },
  { label: "Seasonal items", value: "Seasonal/overhead storage" },
  { label: "Hamper", value: "Hamper/laundry integration" },
];

const STYLES = [
  { label: "Modern / minimalist", value: "modern and clean with a minimalist aesthetic" },
  { label: "Traditional / classic", value: "traditional and classic with warm wood tones" },
  { label: "Luxury", value: "luxurious and high-end with premium finishes" },
  { label: "Functional / utilitarian", value: "functional and maximized storage above all else" },
];

const SPACE_TYPES = [
  "Walk-in closet",
  "Reach-in closet",
  "Pantry",
  "Garage",
  "Home office",
  "Laundry room",
  "Mudroom",
];

export default function Home() {
  const [width, setWidth] = useState("8");
  const [depth, setDepth] = useState("6");
  const [height, setHeight] = useState("9");
  const [spaceType, setSpaceType] = useState("Walk-in closet");
  const [users, setUsers] = useState("1 person");
  const [notes, setNotes] = useState("");
  const [priorities, setPriorities] = useState(["Hanging clothes (long)", "Hanging clothes (short/folded)"]);
  const [style, setStyle] = useState("modern and clean with a minimalist aesthetic");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);

  function togglePriority(val: string) {
    setPriorities((prev) =>
      prev.includes(val) ? prev.filter((p) => p !== val) : [...prev, val]
    );
  }

  async function generateDesign() {
    setLoading(true);
    setResult("");
    const sqft = (parseFloat(width) * parseFloat(depth)).toFixed(0);

    const prompt = `You are an expert closet and home organization designer working for a Tailored Closet franchise.

Generate a detailed closet design recommendation for the following space:

SPACE DETAILS:
- Type: ${spaceType}
- Dimensions: ${width}ft wide x ${depth}ft deep x ${height}ft tall (${sqft} sq ft)
- Users: ${users}
- Style preference: ${style}
- Storage priorities: ${priorities.length > 0 ? priorities.join(", ") : "general storage"}
${notes ? `- Additional notes: ${notes}` : ""}

Please provide:
1. LAYOUT OVERVIEW - describe the wall-by-wall layout (left wall, right wall, back wall, center if applicable)
2. ZONE BREAKDOWN - list each storage zone with dimensions and what goes there
3. PRODUCT RECOMMENDATIONS - specific types of units (tower units, hang rods, shelf heights, drawer units) with approximate dimensions
4. DESIGN TIPS - 2-3 tips specific to this space and user
5. EXPORT SUMMARY - a concise bullet list of all components that could be used to build a product list or import into design software

Keep the response practical and specific. Use measurements where possible.`;

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      setResult(data.result || "No response received.");
    } catch {
      setResult("Error generating design. Please check your API key and try again.");
    }
    setLoading(false);
  }

  function copyResult() {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function downloadResult() {
    const blob = new Blob([result], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "closet-design.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main style={{ maxWidth: 700, margin: "0 auto", padding: "2rem 1rem", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: 26, fontWeight: 600, margin: "0 0 6px" }}>AI Closet Design Generator</h1>
        <p style={{ color: "#666", margin: 0, fontSize: 15 }}>Enter room details to generate a custom Tailored Closet design</p>
      </div>

      <section style={cardStyle}>
        <p style={sectionTitle}>Room dimensions</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 12 }}>
          <div>
            <label style={labelStyle}>Width (ft)</label>
            <input type="number" value={width} onChange={(e) => setWidth(e.target.value)} style={inputStyle} min="1" max="40" />
          </div>
          <div>
            <label style={labelStyle}>Depth (ft)</label>
            <input type="number" value={depth} onChange={(e) => setDepth(e.target.value)} style={inputStyle} min="1" max="40" />
          </div>
          <div>
            <label style={labelStyle}>Height (ft)</label>
            <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} style={inputStyle} min="6" max="14" />
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label style={labelStyle}>Space type</label>
            <select value={spaceType} onChange={(e) => setSpaceType(e.target.value)} style={inputStyle}>
              {SPACE_TYPES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Number of users</label>
            <select value={users} onChange={(e) => setUsers(e.target.value)} style={inputStyle}>
              <option>1 person</option>
              <option>2 people</option>
              <option>Family (3+)</option>
            </select>
          </div>
        </div>
      </section>

      <section style={cardStyle}>
        <p style={sectionTitle}>Storage priorities</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {PRIORITIES.map((p) => (
            <button key={p.value} onClick={() => togglePriority(p.value)}
              style={{ ...chipStyle, ...(priorities.includes(p.value) ? activeChipStyle : {}) }}>
              {p.label}
            </button>
          ))}
        </div>
      </section>

      <section style={cardStyle}>
        <p style={sectionTitle}>Style preference</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {STYLES.map((s) => (
            <button key={s.value} onClick={() => setStyle(s.value)}
              style={{ ...chipStyle, ...(style === s.value ? activeChipStyle : {}) }}>
              {s.label}
            </button>
          ))}
        </div>
      </section>

      <section style={cardStyle}>
        <p style={sectionTitle}>Additional notes (optional)</p>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. has a window on left wall, client has lots of dresses, needs center island..."
          rows={3} style={{ ...inputStyle, width: "100%", resize: "vertical", boxSizing: "border-box" as const }} />
      </section>

      <button onClick={generateDesign} disabled={loading}
        style={{ width: "100%", padding: "13px", fontSize: 15, fontWeight: 600, background: "#1a1a1a", color: "#fff",
          border: "none", borderRadius: 10, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, marginBottom: "1.5rem" }}>
        {loading ? "Generating design..." : "Generate AI design"}
      </button>

      {result && (
        <section style={cardStyle}>
          <p style={sectionTitle}>Design recommendation</p>
          <pre style={{ whiteSpace: "pre-wrap", fontSize: 14, lineHeight: 1.7, margin: "0 0 1rem", color: "#1a1a1a" }}>{result}</pre>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={copyResult} style={actionBtnStyle}>{copied ? "Copied!" : "Copy"}</button>
            <button onClick={downloadResult} style={actionBtnStyle}>Download .txt</button>
          </div>
        </section>
      )}
    </main>
  );
}

const cardStyle = { background: "#fff", border: "1px solid #e5e5e5", borderRadius: 12, padding: "1.25rem", marginBottom: "1rem" };
const sectionTitle = { fontSize: 11, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.06em", color: "#888", margin: "0 0 1rem" };
const labelStyle = { display: "block", fontSize: 13, color: "#555", marginBottom: 6 };
const inputStyle = { width: "100%", padding: "8px 10px", fontSize: 14, border: "1px solid #ddd", borderRadius: 8, boxSizing: "border-box" as const, background: "#fafafa" };
const chipStyle = { padding: "6px 14px", borderRadius: 20, border: "1px solid #ddd", fontSize: 13, cursor: "pointer", background: "#fff", color: "#555" };
const activeChipStyle = { background: "#EBF4FF", borderColor: "#3B82F6", color: "#1D4ED8" };
const actionBtnStyle = { padding: "8px 18px", fontSize: 13, border: "1px solid #ddd", borderRadius: 8, background: "#fff", cursor: "pointer" };
