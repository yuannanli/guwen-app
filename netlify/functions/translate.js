// Auto-generated - no external dependencies
exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: {"Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type", "Content-Type": "application/json"}, body: "" };
  }
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: {"Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type", "Content-Type": "application/json"}, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  try {
    const data = JSON.parse(event.body || "{}");
    const text = data.text;
    if (!text) {
      return { statusCode: 400, headers: {"Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type", "Content-Type": "application/json"}, body: JSON.stringify({ error: "输入不能为空" }) };
    }

    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return { statusCode: 500, headers: {"Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type", "Content-Type": "application/json"}, body: JSON.stringify({ error: "API key未配置" }) };
    }

    const context = data.context || "";
    const userContent = text;

    const resp = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: "你是一位精通古籍的学者，用现代白话准确流畅地翻译文言文。\n翻译要求：\n1. 保留原句文意准确性和风格韵味\n2. 译文自然流畅，符合现代汉语表达习惯\n3. 注意古今词义差异，在译文中体现\n4. 保留原味的诗词韵味，在翻译后加以注释" },
          { role: "user", content: userContent }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    const result = await resp.json();
    if (!resp.ok) {
      return { statusCode: 502, headers: {"Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type", "Content-Type": "application/json"}, body: JSON.stringify({ error: result.error?.message || "DeepSeek API错误" }) };
    }

    return {
      statusCode: 200,
      headers: {"Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type", "Content-Type": "application/json"},
      body: JSON.stringify({ success: true, text: result.choices[0].message.content }),
    };
  } catch (err) {
    return { statusCode: 500, headers: {"Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type", "Content-Type": "application/json"}, body: JSON.stringify({ error: err.message }) };
  }
};
