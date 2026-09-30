export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { message, history = [], language = "fa" } = req.body || {};
  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Message is required." });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "OPENAI_API_KEY is not configured." });

  const safeHistory = Array.isArray(history)
    ? history.slice(-8).map(item => ({
        role: item.role === "assistant" ? "assistant" : "user",
        content: String(item.content || "").slice(0, 1500)
      }))
    : [];

  const systemPrompt = language === "en"
    ? `You are the AI assistant embedded in Arin Farahi's personal portfolio website.
Answer visitors clearly and briefly. You can explain Arin's website, portfolio, technologies,
projects, and general programming/web questions. Do not invent private facts about Arin.
If you don't know something about Arin, say so.`
    : `تو دستیار هوش مصنوعی داخل سایت شخصی آرین فرهی هستی.
به بازدیدکننده‌ها واضح، دوستانه و نسبتاً کوتاه جواب بده. می‌توانی درباره سایت، نمونه‌کارها،
فناوری‌های استفاده‌شده و سؤال‌های عمومی برنامه‌نویسی و وب توضیح بده.
درباره اطلاعات خصوصی آرین چیزی از خودت نساز؛ اگر چیزی را نمی‌دانی صادقانه بگو.`;

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-5.6-luna",
      input: [
        { role: "system", content: systemPrompt },
        ...safeHistory
      ],
      max_output_tokens: 500
    })
  });

  const data = await response.json();
  if (!response.ok) {
    console.error("OpenAI API error:", data);
    return res.status(502).json({ error: data?.error?.message || "OpenAI request failed." });
  }

  const answer =
    data.output_text ||
    data.output?.flatMap(item => item.content || [])
      ?.map(part => part.text || "")
      ?.join("")
      ?.trim() || "";

  return res.status(200).json({ answer });
}
