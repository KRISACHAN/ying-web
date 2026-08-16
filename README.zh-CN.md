[English Documentation](/README.md) · [中文文档](/README.zh-CN.md)

# @ying-web

## 关于我

大家好！我是陈劲文（陈大鱼头），来自中国的前端开发工程师，拥有 9 年开发经验！

联系我：

-   📧 邮箱：[chenjinwen77@gmail.com](mailto:chenjinwen77@gmail.com)
-   🐙 Github：[https://github.com/KRISACHAN](https://github.com/KRISACHAN)
-   💬 微信：krisChans95
-   🌐 个人网站：[https://www.krissarea.com](https://www.krissarea.com)

PS：目前正在寻找新的机会，欢迎联系！

## 为什么叫"ying"?

当然是源于萌妹子嘤啦！

![ying](https://bucket.krissarea.com/img/ying.jpeg)

## 关于 @ying-web

`@ying-web` 算是我的一个代码集合库。早些年因为没有管理意识，所以项目（都是小项目）散落在 GitHub、GitLab 和 Gitee 上 😅。
所以为了避免后续维护的麻烦，就都放到这里了。

我想要做的是这些事：

1. 统一到 GITHUB
2. 实现自动化部署
3. 重要应用都配上专属域名
4. 添加中英文文档

## 总体规划

当前进行中的项目：

### 项目结构

基建尽量现代化吧：

#### 根目录配置

-   ✅ `husky` + `lint-staged` + `commitlint`
-   🚧 `Webhook` (GitHub Actions/Vercel等) + `Docker`

#### 项目级配置

-   ✅ `changeset`
-   🚧 完善文档
-   🚧 完整测试用例

### @ying-web/api-service

`@ying-web` 的核心服务层，虽然简单，但它是整个系统的基础，后续也会不断迭代吧。

详见 [README.md](./apps/api-service/README.md)

### @ying-web/admin

基于 `@ying-web/api-service` RBAC 基础构建的后台系统。

访问 [https://admin.krissarea.com](https://admin.krissarea.com) 体验！

详见 [README.md](./apps/admin/README.zh-CN.md)

### @ying-web/events

原用 Vue3 构建的基督教工具。鉴于海外 React 更流行，我正在进行 React 重构！

访问 [https://events.krissarea.com](https://events.krissarea.com)

（PS：可能会重命名为`@ying-web/christian`，但先完成重构！）

详见 [README.md](./apps/events/README.zh-CN.md)

### @ying-web/diary

个人日记项目——记录思考与经历的专属空间。不止是博客，更是私人日志！

访问 [https://diary.krissarea.com](https://diary.krissarea.com)

详见 [README.md](./apps/diary/README.zh-CN.md)

### @ying-web/www

使用 Next.js 15 和 React 19 构建的现代简历网站，支持 SSG/SSR 渲染和中英文双语切换。
它目前用来充当我的简历。后续可能会做更多事情吧。

访问 [https://www.krissarea.com](https://www.krissarea.com)

详见 [README.md](./apps/www/README.zh-CN.md)

### @ying-web/myth-engine

基于 Next.js 15 App Router 构建的中国神话知识网站，收录《山海经》《搜神记》《楚辞》《淮南子》四部典籍。人物、神祇、异兽、山川、草木金石均回溯到原文与注释，构建时预渲染 1500+ 静态页面。

详见 [README.md](./apps/myth-engine/README.md)

## 未来展望

我也不知道后续会做成什么样，看心情吧！

## 快速开始

### 环境要求

-   Node.js >= 18.16.0
-   PNPM: 9.14.4
-   Git

### 本地开发

1. 克隆仓库：

```bash
git clone https://github.com/KRISACHAN/ying-web.git
cd ying-web
```

2. 安装依赖：

```bash
pnpm install
```

3. 启动项目：

```bash
pnpm dev
# 从交互式CLI菜单中选择项目
```

4. 构建项目：

```bash
# 构建所有项目
pnpm build

# 构建指定项目
pnpm build:admin     # 构建管理后台
pnpm build:diary     # 构建日记站点
pnpm build:events    # 构建活动平台
pnpm build:myth-engine # 构建神话索引
pnpm build:api-service # 构建API服务
pnpm build:www       # 构建简历网站
```

### 部署指南

#### 前端项目

多数前端项目部署在Vercel：

-   管理后台: [admin.krissarea.com](https://admin.krissarea.com)
-   日记: [diary.krissarea.com](https://diary.krissarea.com)
-   活动平台: [events.krissarea.com](https://events.krissarea.com)
-   主页: [www.krissarea.com](https://www.krissarea.com)

#### 后端服务

API 服务使用 PM2 部署：

```bash
pnpm deploy
```

### 开发脚本 🛠

-   `pnpm dev` - 启动开发服务器（交互式）
-   `pnpm build` - 构建所有项目
-   `pnpm clean` - 清理构建产物
-   `pnpm deploy` - 部署服务
-   `pnpm test` - 运行测试
-   `pnpm lint` - 代码检查
-   `pnpm format` - 代码格式化
-   `pnpm cz` - 使用Commitizen提交变更
-   `pnpm changeset` - 创建变更集
-   `pnpm version` - 更新版本号
-   `pnpm release` - 发布包

### 项目结构

```txt
@ying-web/
├── apps/              # 前端应用
├── packages/         # 共享包
├── services/        # 后端服务
└── scripts/        # 构建部署脚本
```

## 开源协议

本项目采用 MIT 协议 - 详见 [LICENSE](LICENSE) 文件。
