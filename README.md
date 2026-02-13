# 微信小程序贪吃蛇

一个基于 Canvas 2D 的简单贪吃蛇微信小程序。支持触控滑动与按钮操作，包含计分与重开。

## 技术方案

- 原生微信小程序
- Canvas 2D 渲染
- 游戏逻辑与渲染解耦（游戏核心放在 utils 中）

## 目录结构

```
.
├── app.js
├── app.json
├── app.wxss
├── project.config.json
├── sitemap.json
├── pages
│   └── index
│       ├── index.js
│       ├── index.json
│       ├── index.wxml
│       └── index.wxss
└── utils
    └── snake-game.js
```

## 运行方式

1. 打开微信开发者工具
2. 导入项目，目录选择本项目根目录
3. 使用测试号 AppID 或替换为自己的 AppID
4. 点击编译即可运行

## 操作说明

- 点击方向按钮或在画布上滑动来控制方向
- 吃到红色食物得分
- 撞墙或撞到自身游戏结束，可点击 Restart 重新开始

## 关键文件

- [index.js](file:///home/likefallwind/code/learnvibecoding/pages/index/index.js)
- [index.wxml](file:///home/likefallwind/code/learnvibecoding/pages/index/index.wxml)
- [index.wxss](file:///home/likefallwind/code/learnvibecoding/pages/index/index.wxss)
- [snake-game.js](file:///home/likefallwind/code/learnvibecoding/utils/snake-game.js)
