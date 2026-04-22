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
    const text = data.word;
    if (!text) {
      return { statusCode: 400, headers: {"Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type", "Content-Type": "application/json"}, body: JSON.stringify({ error: "输入不能为空" }) };
    }

    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return { statusCode: 500, headers: {"Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type", "Content-Type": "application/json"}, body: JSON.stringify({ error: "API key未配置" }) };
    }

    const context = data.context || "";
    const userContent = context
      ? `相关文献：\\n${context}\\n\\n问题：` + text
      : text;

    const resp = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: "你是一位古籍研究专家，愿意为用户挑选的字词提供详细注释。\n注释要求：\n1. 解释字词的基本含义\n2. 在古籍中的特殊用法和含义\n3. 相关的典故和出处\n4. 用通俗易懂的语言解释" },
          { role: "user", content: userContent }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    const result = await resp.json();
    if (!resp.ok) {
      return { statusCode: 502, headers: {"Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type", "Content-Type": "application/json"}, body: JSON.stringify({ error: result.error?.message || "DeepSeek API错误" }) };
    }

    return {
      statusCode: 200,
      headers: {"Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type", "Content-Type": "application/json"},
      body: JSON.stringify({ success: true, word: result.choices[0].message.content }),
    };
  } catch (err) {
    return { statusCode: 500, headers: {"Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type", "Content-Type": "application/json"}, body: JSON.stringify({ error: err.message }) };
  }
};
