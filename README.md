[English Documentation](/README.md) · [中文文档](/README.zh-CN.md)

# @ying-web

## About Me

Hello everyone! I'm Jinwen Chen (Kris), a front-end developer from China with 10 years of development experience!

Contact me:

-   📧 Email: [chenjinwen77@gmail.com](mailto:chenjinwen77@gmail.com)
-   🐙 Github: [https://github.com/KRISACHAN](https://github.com/KRISACHAN)
-   💬 WeChat: krisChans95
-   🌐 Personal Website: [https://www.krissarea.com](https://www.krissarea.com)

PS: Currently looking for new opportunities, feel free to contact me!

## Why "ying"?

Of course, it comes from Chinese Internet buzzword "嘤"!

![ying](https://bucket.krissarea.com/img/ying.jpeg)

## About @ying-web

`@ying-web` is essentially my code collection repository. In the early years, due to lack of management awareness, my projects (all small projects) were scattered across GitHub, GitLab, and Gitee 😅. So to avoid future maintenance troubles, I've put them all here.

What I want to accomplish:

1. Unify everything on GitHub
2. Implement automated deployment
3. Give important applications dedicated domain names
4. Add bilingual documentation (Chinese and English)

## Overall Planning

Current ongoing projects:

### Project Structure

Let's make the infrastructure as modern as possible:

#### Root Directory Configuration

-   ✅ `husky` + `lint-staged` + `commitlint`
-   🚧 `Webhook` (GitHub Actions/Vercel, etc.) + `Docker`

#### Project-Level Configuration

-   ✅ `changeset`
-   🚧 Complete documentation
-   🚧 Complete test cases

### @ying-web/api-service

The core service layer of `@ying-web`. Although simple, it's the foundation of the entire system and will continue to iterate.

See details at [README.md](./services/api-service/README.md)

### @ying-web/admin

A backend system built on the RBAC foundation of `@ying-web/api-service`.

Visit [https://admin.krissarea.com](https://admin.krissarea.com) to experience it!

See details at [README.md](./apps/admin/README.md)

### @ying-web/events

A Christian tool originally built with Vue3. Given that React is more popular overseas, I'm currently doing a React refactor!

Visit [https://events.krissarea.com](https://events.krissarea.com)

(PS: Might rename it to `@ying-web/christian`, but let's finish the refactor first!)

See details at [README.md](./apps/events/README.md)

### @ying-web/diary

Personal diary project - a dedicated space for recording thoughts and experiences. It's not just a blog, it's a personal journal!

Visit [https://diary.krissarea.com](https://diary.krissarea.com)

See details at [README.md](./apps/diary/README.md)

### @ying-web/www

A modern resume website built with Next.js 15 and React 19, supporting SSG/SSR rendering and bilingual switching (Chinese and English).
It currently serves as my resume. Might do more things with it later.

Visit [https://www.krissarea.com](https://www.krissarea.com)

See details at [README.md](./apps/www/README.md)

### @ying-web/myth-engine

A Chinese mythology knowledge website built with Next.js 15 App Router, based on four classic texts: *Classic of Mountains and Seas* (*Shanhaijing*), *In Search of the Supernatural* (*Soushenji*), *Songs of Chu* (*Chuci*), and *Huainanzi*. All entries are traceable to their original sources, with 1500+ static pages pre-rendered at build time.

See details at [README.md](./apps/myth-engine/README.md)

## Future Outlook

I don't know what it will become in the future, depends on my mood!

## Quick Start

### Environment Requirements

-   Node.js >= 18.16.0
-   PNPM: 9.14.4
-   Git

### Local Development

1. Clone the repository:

```bash
git clone https://github.com/KRISACHAN/ying-web.git
cd ying-web
```

2. Install dependencies:

```bash
pnpm install
```

3. Start a project:

```bash
pnpm dev
# Select a project from the interactive CLI menu
```

4. Build projects:

```bash
# Build all projects
pnpm build

# Build specific project
pnpm build:admin     # Build admin backend
pnpm build:diary     # Build diary site
pnpm build:events    # Build events platform
pnpm build:myth-engine # Build mythology engine
pnpm build:api-service # Build API service
pnpm build:www       # Build resume website
```

### Deployment Guide

#### Frontend Projects

Most frontend projects are deployed on Vercel:

-   Admin Backend: [admin.krissarea.com](https://admin.krissarea.com)
-   Diary: [diary.krissarea.com](https://diary.krissarea.com)
-   Events Platform: [events.krissarea.com](https://events.krissarea.com)
-   Homepage: [www.krissarea.com](https://www.krissarea.com)

#### Backend Services

API Service is deployed using PM2:

```bash
pnpm deploy
```

### Development Scripts 🛠

-   `pnpm dev` - Start development server (interactive)
-   `pnpm build` - Build all projects
-   `pnpm clean` - Clean build artifacts
-   `pnpm deploy` - Deploy services
-   `pnpm test` - Run tests
-   `pnpm lint` - Code linting
-   `pnpm format` - Code formatting
-   `pnpm cz` - Commit changes using Commitizen
-   `pnpm changeset` - Create changeset
-   `pnpm version` - Update version numbers
-   `pnpm release` - Publish packages

### Project Structure

```txt
@ying-web/
├── apps/              # Frontend applications
├── packages/         # Shared packages
├── services/        # Backend services
└── scripts/        # Build & deployment scripts
```

## Open Source License

This project uses the MIT License - see the [LICENSE](LICENSE) file for details.
