# 古韵今释 - 古籍智能解读平台

## 项目简介
基于AI大模型的古籍智能解读平台，支持古文翻译、词语注释、AI问答解读。

## 技术栈
- 前端：Vue3 + Element Plus
- 后端：Python Flask
- AI：DeepSeek API
- 部署：Vercel(前端) + Railway(后端)

## 项目结构
```
古籍解读项目/
├── frontend/          # Vue3前端
│   ├── src/
│   │   ├── views/     # 页面组件
│   │   ├── components/# 公共组件
│   │   ├── api/       # API接口
│   │   └── App.vue
│   └── package.json
├── backend/           # Python后端
│   ├── app.py         # 主程序
│   ├── requirements.txt
│   └── .env           # 环境变量
└── docs/              # 文档
    └── 部署指南.md
```

## 核心功能
1. 古文翻译：输入古文，AI翻译成现代白话文
2. 划词注释：点击词语显示释义和典故
3. AI问答：针对古文内容进行深度解读

## 快速开始

### 后端启动
```bash
cd backend
pip install -r requirements.txt
# 配置.env文件中的API密钥
python app.py
```

### 前端启动
```bash
cd frontend
npm install
npm run dev
```

## 作者
[你的名字]

## 时间
2026年4月
"# guwen-app" 
