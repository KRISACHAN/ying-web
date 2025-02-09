[English Documentation](/README.md)

# @ying-web 🌟

## 关于我 👋

大家好！我是陈劲文（陈大鱼头），来自中国的全栈开发者，拥有8年开发经验！🚀

联系我：

-   📧 邮箱：[chenjinwen77@gmail.com](mailto:chenjinwen77@gmail.com)
-   🐙 Github：[https://github.com/KRISACHAN](https://github.com/KRISACHAN)
-   💬 微信：krisChans95

PS：目前正在寻找新的机会，欢迎联系！🤝

## 为什么叫"ying"? 🤔

熟悉中文互联网文化的同学应该知道这个梗啦！😉

源自中文拟声词"**嘤**"——想象可爱女生的撒娇声，超卡哇伊的对吧？🎀

## 关于 @ying-web 📚

把`@ying-web`看作我的代码百宝箱！💎

多年辗转于GitHub、GitLab和Gitee（确实有点混乱😅）后，我决定让所有项目在`@ying-web`体系下重聚。

我的使命？🎯

1. 让一切井然有序
2. 全面采用英文文档
3. 迁移至GitHub
4. 为每个项目配置专属URL
5. 实现自动化部署

## 总体规划 🗺️

当前进行中的项目：

### 项目结构 🏗️

现代项目需要坚实基础：

#### 根目录配置 🌳

-   ✅ `husky` + `lint-staged` + `commitlint`
-   🚧 `Webhook` (GitHub Actions/Vercel等) + `Docker`

#### 项目级配置 🌱

-   ✅ `changeset`
-   🚧 完善文档
-   🚧 完整测试用例

### @ying-web/api-service 🔌

生态系统的核心！虽然起步简单，但终将成为整个`@ying-web`体系的动力源泉。敬请期待！🚀

详见 [README.md](./apps/api-service/README.md)

### @ying-web/admin 🎛️

基于`@ying-web/api-service` RBAC基础构建的优雅后台系统。

访问 [https://admin.krissarea.com](https://admin.krissarea.com) 体验！✨

详见 [README.md](./apps/admin/README.zh-CN.md)

### @ying-web/events ⛪

特别用心的项目——原用Vue3构建的基督教工具。鉴于海外React更流行，我正在进行React重构！🔄

访问 [https://events.krissarea.com](https://events.krissarea.com)

（悄悄说：可能会重命名为`@ying-web/christian`，但先完成重构！）

详见 [README.md](./apps/events/README.zh-CN.md)

### @ying-web/diary 📔

个人日记项目——记录思考与经历的专属空间。不止是博客，更是私人日志！📖

访问 [https://diary.krissarea.com](https://diary.krissarea.com)

详见 [README.md](./apps/diary/README.zh-CN.md)

### [开发中] @ying-web/home 🏠

主站（可能作为项目入口）[https://www.krissarea.com](https://www.krissarea.com)

正在构思如何打造独特体验！🎨

## 未来展望 🌈

谁知道下一个酷炫项目会是什么？我始终期待尝试新事物，让创意自由翱翔！

持续关注更多精彩内容！✨

记住：最好的代码总是饱含热情与趣味！🎮

## 快速开始 🚀

### 环境要求 📋

-   Node.js >= 18.16.0
-   PNPM: 9.14.4
-   Git

### 本地开发 💻

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
pnpm build:api-service # 构建API服务
```

### 部署指南 🌐

#### 前端项目

多数前端项目部署在Vercel：

-   管理后台: [admin.krissarea.com](https://admin.krissarea.com)
-   日记: [diary.krissarea.com](https://diary.krissarea.com)
-   活动平台: [events.krissarea.com](https://events.krissarea.com)

#### 后端服务

API服务使用PM2部署：

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

### 项目结构 📂

```txt
@ying-web/
├── apps/              # 前端应用
├── packages/         # 共享包
├── services/        # 后端服务
└── scripts/        # 构建部署脚本
```

## 开源协议 📄

本项目采用 MIT 协议 - 详见 [LICENSE](LICENSE) 文件。

## 作者 ✨

Kris（鱼头） - [个人网站](https://www.krissarea.com) - [联系邮箱](mailto:chenjinwen77@gmail.com)

---

来自 @ying-web ❤️
