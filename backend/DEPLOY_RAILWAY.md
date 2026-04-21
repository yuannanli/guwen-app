# Railway 部署指南

## 方法一：命令行部署（推荐）

在项目目录下执行：

```bash
# 1. 登录 Railway
railway login

# 2. 初始化项目
cd C:\Users\YuanNanLi\Desktop\古籍解读项目
railway init

# 3. 设置后端目录
railway add --environment production

# 4. 添加环境变量
railway variables set DEEPSEEK_API_KEY=sk-ff458b0435d74479ac0ddbd0d6488c91

# 5. 部署
railway up

# 6. 等待部署完成，获取URL
railway status
```

## 方法二：网页部署

1. 访问 https://railway.app/
2. GitHub 登录 → New Project → Empty Project
3. 在项目设置中添加以下文件：

### railway.json（已创建在 backend/ 目录）
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": { "builder": "NIXPACKS" },
  "deploy": {
    "startCommand": "gunicorn -w 4 -b 0.0.0.0:$PORT app:app",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

### 环境变量
```
DEEPSEEK_API_KEY = sk-ff458b0435d74479ac0ddbd0d6488c91
```

4. 点击 Deploy，等待完成后复制 Railway 分配的 URL（如 `https://guwen-api-xxxx.up.railway.app`）

---

部署完成后告诉我 Railway 的后端 URL，我立即部署前端！
