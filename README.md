# AI E-com Studio

单页高保真前端原型，用于演示 AI 生成电商产品图与营销文案的流程。页面包含左侧表单与右侧结果画布，支持图片预览、生成加载态与多卡片结果展示。

## 技术栈

- React (Vite)
- Tailwind CSS
- lucide-react
- framer-motion

## 本地运行

```bash
npm install
npm run dev
```

## 功能概览

- 左侧固定 380px 控制面板：图片上传预览、产品名、卖点、风格选择
- 右侧可滚动画布：空状态占位、生成后 4 张产品卡片
- 生成动效：点击生成后 1.5 秒加载，再填充卡片文案与样式
