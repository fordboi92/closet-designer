import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ result: "Error: API key not configured." }, { status: 500 });
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: ""claude-sonnet-4-5",
        max_tokens: 1500,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json({ result: `API error: ${response.status} - ${error}` }, { status: 500 });
    }

    const data = await response.json();
    const result = data.content?.map((b: { text?: string }) => b.text || "").join("") || "No response.";
    return NextResponse.json({ result });

  } catch (err) {
    return NextResponse.json({ result: `Server error: ${String(err)}` }, { status: 500 });
  }
}
