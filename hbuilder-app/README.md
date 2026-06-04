# AI智能心灵伙伴 - HBuilderX 打包指南

## 📱 打包方案说明

你的项目是一个 **React + Vite + Express** 全栈 Web 应用，HBuilderX 不能直接打包 React 项目。

本方案使用 **HBuilderX 5+ App (HTML5+)** 创建一个原生的 WebView 壳子，将你部署好的 Web 应用封装成 Android/iOS App。

**架构图：**
```
┌─────────────────────────────────┐
│   HBuilderX 5+ App (APK/IPA)    │
│  ┌───────────────────────────┐  │
│  │    WebView (全屏浏览器)    │  │
│  │                           │  │
│  │  加载 Railway 部署的 URL   │  │
│  │  https://xxx.railway.app  │  │
│  │                           │  │
│  │  ┌─────────────────────┐  │  │
│  │  │ React 前端 (SPA)    │  │  │
│  │  │ /api/chat ──────────┼──┼──┼──→ Express 后端
│  │  │ /api/treehole        │  │  │    (同一 Railway 服务器)
│  │  │ /api/report          │  │  │
│  │  └─────────────────────┘  │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

## 🚀 第一步：部署后端到 Railway

你的项目已有 `railway.json` 配置，直接部署：

### 1.1 安装 Railway CLI（如果还没有）
```bash
npm install -g @railway/cli
```

### 1.2 登录并部署
```bash
cd "C:\Users\z'z's\Desktop\ai智能心灵伙伴"
railway login
railway init
railway up
```

### 1.3 获取部署地址
部署成功后 Railway 会给你一个 URL，类似：
```
https://ai智能心灵伙伴-production.up.railway.app
```

> ⚠️ **重要**：记下这个 URL，后续需要配置到 HBuilderX 项目中。

---

## 📦 第二步：配置 HBuilderX 项目

### 2.1 修改 WebView 加载地址

打开 `hbuilder-app/index.html`，找到第 10 行左右：

```javascript
var REMOTE_URL = 'https://你的应用.railway.app';
```

替换为你的 Railway 实际部署地址：
```javascript
var REMOTE_URL = 'https://ai智能心灵伙伴-production.up.railway.app';
```

### 2.2 准备应用图标

在 `hbuilder-app/` 下创建 `icon/` 文件夹，放入以下尺寸的图标（或使用 HBuilderX 的可视化图标编辑器自动生成）：

```
icon/
  ├── 72x72.png
  ├── 96x96.png
  ├── 120x120.png
  ├── 144x144.png
  ├── 180x180.png
  └── 1024x1024.png
```

> 💡 可以用在线工具 [icon.wuruihong.com](https://icon.wuruihong.com) 快速生成。

---

## 🛠 第三步：用 HBuilderX 打开并打包

### 3.1 下载安装 HBuilderX
- 官网下载：[https://www.dcloud.io/hbuilderx.html](https://www.dcloud.io/hbuilderx.html)
- 建议下载 **App开发版**（不是标准版）

### 3.2 导入项目
1. 打开 HBuilderX
2. 点击 **文件 → 导入 → 从本地目录导入**
3. 选择 `C:\Users\z'z's\Desktop\ai智能心灵伙伴\hbuilder-app` 文件夹
4. 项目类型选择 **5+ App**

### 3.3 配置应用信息
1. 在 HBuilderX 中打开 `manifest.json`
2. 在可视化界面设置：
   - **应用名称**: AI智能心灵伙伴
   - **AppID**: 点击云端获取（需要注册 DCloud 开发者账号）
   - **图标配置**: 上传各个尺寸的图标
   - **启动图片**: 配置启动屏（Splash Screen）
   - **权限配置**: 根据需要勾选权限

### 3.4 打包 APK
1. 在 HBuilderX 菜单栏选择 **发行 → 原生App-云打包**
2. 选择 **Android** 平台
3. 使用 **DCloud 公共证书**（测试用）或上传自己的证书（正式发布）
4. 点击 **打包**
5. 等待云端打包完成，下载 APK

---

## 🔧 高级配置

### 本地调试（局域网测试）

如果 Railway 还没部署好，可以本地调试：

1. 启动本地服务器：
```bash
cd "C:\Users\z'z's\Desktop\ai智能心灵伙伴"
npm run dev
```

2. 查看你电脑的局域网 IP：
```bash
ipconfig
```

3. 修改 `hbuilder-app/index.html` 中的 URL：
```javascript
var REMOTE_URL = 'http://192.168.1.xxx:3000';
```

4. 确保手机和电脑在**同一 WiFi** 下

### 离线包方案（进阶）

如果想减少网络依赖，可以把前端打包后放到 App 本地：

1. 构建前端：
```bash
npm run build
```

2. 把 `dist/` 文件夹复制到 `hbuilder-app/` 目录下

3. 修改 `index.html` 中的 WebView 加载地址为本地文件：
```javascript
var REMOTE_URL = '_www/dist/index.html';
```

4. 同时在 `manifest.json` 中把 `launch_path` 改为本地文件

> ⚠️ 注意：离线包方案下，API 请求需要配置绝对路径指向 Railway 服务器，需要在前端代码中修改 API base URL。

---

## ❓ 常见问题

### Q: 为什么不在 HBuilderX 中直接用 React 代码？
A: HBuilderX 的编译系统只支持 uni-app（Vue 框架）。React 项目无法被其打包系统识别。WebView 壳子是最快的解决方案。

### Q: 可以用这个方案上架应用商店吗？
A: 可以。WebView 包装的 App 完全可以上架 Google Play 和应用宝等主流商店。关键是：
- 拥有自己的 App 内容（而不是纯网页复刻）
- 通过应用审核的隐私政策和用户协议
- 在 `manifest.json` 中正确配置权限

### Q: API Key 安全吗？
A: 你的 API Key 在 `.env` 文件中，部署在 Railway 服务器端，不会被打包到 APK 里。App 通过 HTTPS 与服务器通信，是安全的。

---

## 📂 项目文件结构

```
ai智能心灵伙伴/
├── hbuilder-app/          ← HBuilderX 5+ App 工程（新创建）
│   ├── manifest.json      ← 应用配置
│   ├── index.html         ← WebView 入口页
│   └── icon/              ← 应用图标（需自己添加）
├── src/                   ← React 前端源码
├── server.ts              ← Express 后端
├── railway.json           ← Railway 部署配置
└── ...
```
