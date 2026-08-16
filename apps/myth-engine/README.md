# 中国神话索引 · `@ying-web/myth-engine`

`ying-web` monorepo 中的中国神话知识库网站，基于《山海经》《搜神记》《楚辞》《淮南子》四部典籍。
人物、神祇、异兽、禽鱼、山川、邦国、草木金石——每条知识都可回溯到原文与注释，**所见皆有据，资料未载者不补**。

- **Workspace 包名**：`@ying-web/myth-engine`
- **技术栈**：Next.js 15 App Router、React 18、TypeScript、Tailwind CSS
- **数据来源**：[`data/`](./data/) 下的结构化 JSON
- **渲染方式**：构建时通过 `generateStaticParams` 预渲染典籍、章节和实体页面

## 目录结构

```text
apps/myth-engine/
  data/                  结构化知识库，网站构建时读取
    books.json           典籍 / 篇章索引
    entities.json        实体摘要目录
    entities/<名>.json   实体详情（出处、原文片段、注释）
    chapters/<书>/<篇>.json  篇章条目（原文、注释、译文、实体引用）
    relations.json       实体关系
  docs/                  项目文档与素材
  scripts/               数据构建、抓取和校验脚本（Python 标准库）
  sources/               维基文库原典文本和校验参照
  src/
    app/                 Next.js App Router 页面
    components/          站点组件
    lib/                 数据加载层与类型定义
```

> `src/lib/data.ts` 使用 `process.cwd()` 读取应用根目录下的 `data/`。通过 pnpm/Turbo 在 workspace 包目录执行命令时可正确定位数据目录。

## 本地开发

请在 monorepo 根目录执行：

```bash
pnpm install
pnpm --filter @ying-web/myth-engine dev
```

开发服务器运行在 `http://localhost:8082`。

常用命令：

```bash
# 启动当前应用
pnpm --filter @ying-web/myth-engine dev

# 只构建当前应用
pnpm build:myth-engine

# 预览生产构建
pnpm --filter @ying-web/myth-engine start

# 代码检查
pnpm --filter @ying-web/myth-engine lint
pnpm --filter @ying-web/myth-engine stylelint
```

## 数据脚本

数据由 [`scripts/`](./scripts/) 中的 Python 脚本维护：

- `build_knowledge.py`：从原始资料生成 `data/`
- `scrape_wikisource.py`：抓取维基文库原典
- `validate_against_wikisource.py`：逐篇比对原典与结构化数据

`data/` 和 `sources/` 已加入根目录 `.prettierignore`，避免格式化大型语料和生成数据。

## 部署

该应用是标准 Next.js workspace app，Vercel 可自动识别 Next.js 框架并执行构建。生产构建会生成 1500+ 个静态页面，无需数据库或额外环境变量。

## 数据原则

- 所有实体、别名、释义、关系均源自所收录典籍的原文与注释。
- 跨书同名 / 异名实体经归一化合并，并保留别名。
- 对注释中没有解释的名称，`description` 为 `null`，网站显示「资料未载」。
- 原典以维基文库所收版本逐篇校验，详见 [`data/VALIDATION_REPORT.md`](./data/VALIDATION_REPORT.md)。
