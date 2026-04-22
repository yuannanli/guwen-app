exports.handler = async (event) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: corsHeaders, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  try {
    const { word, context } = JSON.parse(event.body || "{}");
    if (!word) {
      return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: "请提供要注释的词语" }) };
    }

    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: "API key not configured" }) };
    }

    let prompt = `请为以下古籍词语提供详细注释："${word}"`;
    if (context) prompt += `\n\n原文语境：${context}`;

    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: `你是一位古籍研究专家，愿意为用户挑选的字词提供详细注释。
注释要求：
1. 解释字词的基本含义
2. 在古籍中的特殊用法和含义
3. 相关的典故和出处
4. 用通俗易懂的语言解释`
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    const data = await response.json();
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ success: true, annotation: data.choices[0].message.content }),
    };
  } catch (err) {
    return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: err.message }) };
  }
};
