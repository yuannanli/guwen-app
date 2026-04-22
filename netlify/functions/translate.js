const { createClient } = require("@deepseek-client/core");

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
    const { text } = JSON.parse(event.body || "{}");
    if (!text) {
      return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: "文本不能为空" }) };
    }

    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: "API key not configured" }) };
    }

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
            content: `你是一位精通古籍的学者，用现代白话准确流畅地翻译文言文。
翻译要求：
1. 保留原句文意准确性和风格韵味
2. 译文自然流畅，符合现代汉语表达习惯
3. 注意古今词义差异，在译文中体现
4. 保留原味的诗词韵味，在翻译后加以注释`
          },
          { role: "user", content: `请将以下文言文翻译成现代汉语：\n\n${text}` }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: data.error?.message || "API error" }) };
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ success: true, translation: data.choices[0].message.content }),
    };
  } catch (err) {
    return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: err.message }) };
  }
};
