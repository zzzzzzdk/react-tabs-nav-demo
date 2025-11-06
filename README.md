# React 标签页导航演示项目

这是一个基于 React + TypeScript + Vite 构建的标签页导航演示项目，实现了类似浏览器标签页的导航体验和灵活的布局切换功能。

## 项目功能特性

- **标签页导航系统**：支持多标签页切换、标签页关闭、刷新和固定功能
- **布局切换**：支持侧边导航和顶部导航两种布局模式的自由切换
- **响应式设计**：适配不同屏幕尺寸的设备
- **路由管理**：使用 React Router 进行页面路由管理
- **状态管理**：使用 Redux Toolkit 管理应用状态
- **UI 组件**：使用 Ant Design 组件库

## 技术栈

- **框架**：React 18 + TypeScript
- **构建工具**：Vite
- **路由**：React Router
- **状态管理**：Redux Toolkit
- **UI 组件库**：Ant Design
- **代码规范**：ESLint

## 开始使用

### 安装依赖

```bash
npm install
```

### 开发环境运行

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 项目结构

```
src/
├── components/      # 组件目录
│   └── layout/      # 布局相关组件
├── pages/           # 页面组件
├── routes/          # 路由配置
├── store/           # Redux 状态管理
├── assets/          # 静态资源
├── App.tsx          # 应用入口组件
└── main.tsx         # 应用入口文件
```

## 核心功能说明

### 标签页系统

- **动态标签页**：导航时自动创建标签页
- **标签页管理**：支持关闭、刷新和固定标签页
- **智能关闭**：只剩一个标签页时不显示关闭按钮
- **右键菜单**：支持右键菜单对标签页进行操作

### 布局切换

- **侧边导航**：传统的侧边栏导航布局，支持折叠
- **顶部导航**：水平顶部导航布局
- **一键切换**：通过右上角按钮快速切换布局模式

## 开发指南

### 扩展 ESLint 配置

如果要开发生产级应用，推荐更新 ESLint 配置以启用类型感知的 lint 规则：

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // 其他配置...

      // 移除 tseslint.configs.recommended 并替换为
      tseslint.configs.recommendedTypeChecked,
      // 或者使用更严格的规则
      tseslint.configs.strictTypeChecked,
      // 可选地，添加样式规则
      tseslint.configs.stylisticTypeChecked,

      // 其他配置...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // 其他选项...
    },
  },
])
```

### React Compiler

当前模板未启用 React Compiler，因为它会影响开发和构建性能。如需添加，请参考 [官方文档](https://react.dev/learn/react-compiler/installation)。
