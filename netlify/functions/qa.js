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
    const text = data.question;
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
          { role: "system", content: "你是一位博学的古籍研究学者，愿意用所学的知识回答用户的问题。\n回答要求：\n1. 准确引用相关的历史典故和出处\n2. 结合历史背景进行分析和解答\n3. 运用通俗易懂的语言深入浅出\n4. 结合相关的历史人物和文化背景进行分析和解读" },
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
      body: JSON.stringify({ success: true, question: result.choices[0].message.content }),
    };
  } catch (err) {
    return { statusCode: 500, headers: {"Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type", "Content-Type": "application/json"}, body: JSON.stringify({ error: err.message }) };
  }
};
