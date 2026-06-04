# AI智能心灵伙伴 - HBuilderX 打包指南

## 工作原理

```
┌──────────────────────────────────────────┐
│         HBuilderX 5+ App (.apk)          │
│                                          │
│   api-interceptor.js（拦截所有 /api/*）    │
│   ├─ 有网络 → 原生 HTTP 调用 SiliconFlow  │
│   │           AI 完整回复                 │
│   └─ 无网络 → 内置智能回复（4个伙伴+树洞） │
│                                          │
│   React 前端（本地文件，秒开）              │
│   └─ 不需要任何服务器！                   │
└──────────────────────────────────────────┘
```

## 打包步骤

### 1. 下载 HBuilderX
去 [dcloud.io/hbuilderx.html](https://www.dcloud.io/hbuilderx.html) 下载 **App开发版**

### 2. 打开项目
- 启动 HBuilderX
- 菜单：**文件 → 打开目录**
- 选择 `hbuilder-app` 文件夹

### 3. 配置 manifest.json
- 在项目管理器中点击 `manifest.json`
- **基础配置**：设置应用名称为「AI智能心灵伙伴」
- **AppID**：点击「云端获取」，登录 DCloud 账号后自动分配（免费注册）
- **图标配置**：上传应用图标（可用 HBuilderX 自带的图标生成器）
- **模块权限**：不需要额外勾选（AI 调用用的是 HTTP 请求）

### 4. 打包 APK
- 菜单：**发行 → 原生App-云打包**
- 勾选 **Android**
- 证书：选 **DCloud 公共测试证书**（先测试用）
- 点击 **打包**
- 等待云端构建（约 3-5 分钟）
- 下载 APK，安装到手机

---

## 文件说明

| 文件 | 用途 |
|------|------|
| `manifest.json` | App 配置（名称、权限、图标等） |
| `index.html` | 入口页面（含启动画面 + React 应用） |
| `assets/` | React 前端构建产物（CSS + JS） |
| `js/api-interceptor.js` | ★ 核心：拦截 API 调用，直接调 AI 或使用本地回复 |
| `icon/` | 应用图标（打包前放入各尺寸 PNG） |

## 重新构建

如果你修改了 React 源码，需要重新构建：

```bash
cd "C:\Users\z'z's\Desktop\ai智能心灵伙伴"
npm run build
# 然后把 dist/assets/ 复制到 hbuilder-app/assets/
# 更新 index.html 中的资源引用路径
```
