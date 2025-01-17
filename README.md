# @ying-web 🌟

## Who am I? 👋

Hey there! I'm Jinwen Chen (or just call me Kris), a passionate front-end developer from China with 8 years of experience under my belt! 🚀

Let's connect:

-   📧 Email: [chenjinwen77@gmail.com](mailto:chenjinwen77@gmail.com)
-   🐙 Github: [https://github.com/KRISACHAN](https://github.com/KRISACHAN)
-   💬 WeChat: krisChans95

PS: Currently on the lookout for exciting opportunities! If you've got something interesting, let's chat! 🤝

## Why "ying"? 🤔

If you're familiar with Chinese internet culture, you probably know this one! 😉

It's from the Chinese word "**嘤**" - imagine a cute girl's playful cry. Super kawaii, right? 🎀

## About @ying-web 📚

Think of `@ying-web` as my coding treasure chest! 💎

After years of spreading my projects across GitHub, GitLab, and Gitee (yeah, it got a bit messy 😅), I decided it was time for a grand reunion under the `@ying-web` umbrella.

My mission? 🎯

1. Make everything neat and tidy
2. Switch to all-English documentation
3. Move everything to GitHub
4. Set up proper URLs for each project
5. Get everything running and deploying automatically

## The Master Plan 🗺️

Here's what's cooking:

### Project Structure 🏗️

Every modern project needs a solid foundation:

#### Root Level 🌳

-   ✅ `husky` + `lint-staged` + `commitlint`
-   🚧 `Webhook` (GitHub Actions/Vercel/etc.) + `Docker`

#### Project Level 🌱

-   ✅ `changeset`
-   🚧 Detailed documentation
-   🚧 Completed test cases

### @ying-web/api-service 🔌

The backbone of our ecosystem! While it's starting simple, it's destined to power the entire `@ying-web` system. Watch this space! 🚀

And see the detail at [README.md](./apps/api-service/README.md)

### @ying-web/admin 🎛️

A sleek admin system built on our RBAC foundation in `@ying-web/api-service`.

Check it out at [https://admin.krissarea.com](https://admin.krissarea.com)! ✨

And see the detail at [README.md](./apps/admin/README.md)

### @ying-web/events ⛪

A special project close to my heart - a Christian tool originally built in Vue3. But hey, React is the talk of the town overseas, so we're giving it a React makeover! 🔄

Check it out at [https://events.krissarea.com](https://events.krissarea.com)

(Psst... might rename it to `@ying-web/christian` later, but first things first!)

And see the detail at [README.md](./apps/events/README.md)

### @ying-web/diary 📔

My personal diary project - a place to record my thoughts and experiences. It's not just a blog, it's a personal journal! 📖

Check it out at [https://diary.krissarea.com](https://diary.krissarea.com)

And see the detail at [README.md](./apps/diary/README.md)

### [wip] @ying-web/home 🏠

My main website (maybe just an entry of my projects) at [https://www.krissarea.com](https://www.krissarea.com).

Still brainstorming how to make it extra special! 🎨

## The Future is Bright! 🌈

Who knows what cool projects might pop into my head next? I'm always excited to try new things and let creativity guide the way!

Stay tuned for more awesome stuff! ✨

Remember: The best code is written with passion and a sprinkle of fun! 🎮

## Getting Started 🚀

### Prerequisites 📋

-   Node.js >= 18.16.0
-   PNPM: 9.14.4
-   Git

### Local Development 💻

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
pnpm build:admin     # Build admin dashboard
pnpm build:diary     # Build diary site
pnpm build:events    # Build events platform
pnpm build:api-service # Build API service
```

### Deployment 🌐

#### Frontend Projects

Most frontend projects are deployed on Vercel:

-   Admin Dashboard: [admin.krissarea.com](https://admin.krissarea.com)
-   Diary: [diary.krissarea.com](https://diary.krissarea.com)
-   Events: [events.krissarea.com](https://events.krissarea.com)
-   Documentation: [fe.krissarea.com](https://fe.krissarea.com)

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
-   `pnpm lint` - Run linting
-   `pnpm format` - Format code
-   `pnpm cz` - Commit changes using Commitizen
-   `pnpm changeset` - Create a changeset
-   `pnpm version` - Update versions
-   `pnpm release` - Publish packages

### Project Structure 📂

```txt
@ying-web/
├── apps/              # Frontend applications
├── packages/         # Shared packages
├── services/        # Backend services
└── scripts/        # Build & deployment scripts
```

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with ❤️ by the @ying-web
