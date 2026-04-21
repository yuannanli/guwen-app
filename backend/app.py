"""
古韵今释 - 后端API服务
基于Flask + DeepSeek API
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from openai import OpenAI
import os

# 加载环境变量
load_dotenv()

app = Flask(__name__)
CORS(app)  # 允许跨域

# 延迟初始化DeepSeek客户端，避免启动时因缺少API Key崩溃
client = None

def get_client():
    global client
    if client is None:
        api_key = os.getenv("DEEPSEEK_API_KEY", "")
        if not api_key:
            raise ValueError("DEEPSEEK_API_KEY 环境变量未设置")
        client = OpenAI(api_key=api_key, base_url="https://api.deepseek.com")
    return client

# 系统提示词
TRANSLATE_SYSTEM_PROMPT = """你是一位精通古籍的学者，擅长将古文翻译成通俗易懂的现代白话文。
翻译要求：
1. 保持原文意境，准确传达含义
2. 语言流畅自然，符合现代汉语习惯
3. 对于典故和生僻词，在翻译后用括号注释
4. 保留原文的诗意美感"""

ANNOTATE_SYSTEM_PROMPT = """你是一位古籍研究专家，请为用户选中的古文词语提供详细注释。
注释要求：
1. 词语的基本含义
2. 在古文中的用法和引申义
3. 相关的典故或出处（如有）
4. 用简洁清晰的语言解释"""

QA_SYSTEM_PROMPT = """你是一位博学的古籍研究学者，擅长解读古文的深层含义。
请根据用户提供的古文内容，回答用户的问题。
回答要求：
1. 准确理解古文的背景和含义
2. 结合历史背景、作者生平进行分析
3. 语言通俗易懂，深入浅出
4. 如有相关典故或其他古籍关联，可以提及"""




@app.route("/", methods=["GET"])
def index():
    """Root health check"""
    return jsonify({"status": "ok", "service": "guwen-api"})
@app.route('/api/translate', methods=['POST'])
def translate():
    """古文翻译接口"""
    try:
        data = request.json
        text = data.get('text', '')
        
        if not text:
            return jsonify({"error": "请输入古文内容"}), 400
        
        ai = get_client()
        response = ai.chat.completions.create(
            model="deepseek-chat",
            messages=[
                {"role": "system", "content": TRANSLATE_SYSTEM_PROMPT},
                {"role": "user", "content": f"请将以下古文翻译成现代白话文：\n\n{text}"}
            ],
            temperature=0.7,
            max_tokens=2000
        )
        
        result = response.choices[0].message.content
        
        return jsonify({
            "success": True,
            "translation": result
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/annotate', methods=['POST'])
def annotate():
    """词语注释接口"""
    try:
        data = request.json
        word = data.get('word', '')
        context = data.get('context', '')
        
        if not word:
            return jsonify({"error": "请提供要注释的词语"}), 400
        
        prompt = f"请为以下古文词语提供详细注释：\"{word}\""
        if context:
            prompt += f"\n\n上下文：{context}"
        
        ai = get_client()
        response = ai.chat.completions.create(
            model="deepseek-chat",
            messages=[
                {"role": "system", "content": ANNOTATE_SYSTEM_PROMPT},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=1000
        )
        
        result = response.choices[0].message.content
        
        return jsonify({
            "success": True,
            "annotation": result
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/qa', methods=['POST'])
def qa():
    """AI问答接口"""
    try:
        data = request.json
        question = data.get('question', '')
        context = data.get('context', '')
        
        if not question:
            return jsonify({"error": "请输入问题"}), 400
        
        prompt = f"古文内容：\n{context}\n\n问题：{question}" if context else question
        
        ai = get_client()
        response = ai.chat.completions.create(
            model="deepseek-chat",
            messages=[
                {"role": "system", "content": QA_SYSTEM_PROMPT},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=2000
        )
        
        result = response.choices[0].message.content
        
        return jsonify({
            "success": True,
            "answer": result
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/health', methods=['GET'])
def health():
    """健康检查接口"""
    return jsonify({"status": "ok"})


if __name__ == '__main__':
    # 开发环境
    app.run(host='0.0.0.0', port=5000, debug=True)
    
# 生产环境使用: gunicorn -w 4 -b 0.0.0.0:5000 app:app
