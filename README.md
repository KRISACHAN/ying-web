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
3. Create some really cool stuff
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

### @ying-web/api-service 🔌

The backbone of our ecosystem! While it's starting simple, it's destined to power the entire `@ying-web` system. Watch this space! 🚀

### @ying-web/admin 🎛️

A sleek admin system built on our RBAC foundation in `@ying-web/api-service`. Coming soon to [https://admin.krissarea.com](https://admin.krissarea.com)! ✨

### @ying-web/events ⛪

A special project close to my heart - a Christian tool originally built in Vue3. But hey, React is the talk of the town overseas, so we're giving it a React makeover! 🔄

Check it out at [https://events.krissarea.com](https://events.krissarea.com)

(Psst... might rename it to `@ying-web/christian` later, but first things first!)

### @ying-web/docs 📚

Our brand new documentation hub built with [Nextra](https://nextra.site)! This is where you'll find:

-   📖 Comprehensive guides for all @ying-web packages
-   🔧 API references with TypeScript support
-   💡 Best practices and examples
-   🎨 Beautiful, modern UI with dark mode support
-   🚀 Fast and SEO-friendly static site

Check it out at [https://ying-web-docs.vercel.app](https://ying-web-docs.vercel.app)

### @ying-web/home 🏠

My digital home at [https://www.krissarea.com](https://www.krissarea.com). Still brainstorming how to make it extra special! 🎨

### @ying-web/tools 🛠️

My personal collection of handy utilities. Sure, npm has alternatives, but sometimes you just want to build your own tools, right? 😊

## What's Staying Outside? 📦

Some projects are happy where they are:

### [https://diary.krissarea.com](https://diary.krissarea.com) 📔

My personal diary - perfectly content on Vercel!

### [https://fe.krissarea.com](https://fe.krissarea.com) 📚

Front-end knowledge hub (especially interview stuff!) - Vercel's got this one too!

### [https://blog.krissarea.com](https://blog.krissarea.com) ✍️

My first Chinese FE blog on Gitee - might automate it later, but it's cozy where it is!

## The Future is Bright! 🌈

Who knows what cool projects might pop into my head next? I'm always excited to try new things and let creativity guide the way!

Stay tuned for more awesome stuff! ✨

Remember: The best code is written with passion and a sprinkle of fun! 🎮

## Prerequisites 🎯

-   Node.js >= 18.16.0
-   Pnpm: 9.14.2
-   MySQL >= 8.0 _(for api-service)_
-   PM2 _(optional, for api-service)_
-   Docker _(optional, for api-service)_

## Project Structure 📂

```
@ying-web/
├── apps/                   # Frontend applications
│   ├── admin/             # Administration platform
│   ├── docs/              # Documentation site
│   └── events/            # Christian events platform
├── packages/              # Shared packages
│   └── tools/             # Utility collection
└── services/              # Backend services
    └── api-service/       # Main API service
```

## Available Projects 📦

### Applications

#### [@ying-web/events](./apps/events)

A modern, TypeScript-powered Christian events platform:

-   🎲 Lucky Number Drawing
-   📖 Bible Promise Drawing
-   🎯 More Activities _(coming soon)_

#### [@ying-web/admin](./apps/admin)

The administration platform for the @ying-web ecosystem.

#### [@ying-web/docs](./apps/docs)

Documentation site built with Nextra, providing comprehensive guides and API references.

### Packages

#### [@ying-web/tools](./packages/tools)

A TypeScript utility collection:

-   📦 **Universal Storage**
    -   Multiple storage providers
    -   Type-safe operations
    -   Configurable prefixes and expiration times

_More utilities coming soon! 🚀_

### Services

#### [@ying-web/api-service](./services/api-service)

The backend service powering the @ying-web ecosystem.

## Getting Started 🚀

1. **Clone the Repository**

```bash
git clone https://github.com/KRISACHAN/ying-web.git
cd ying-web
```

2. **Install Dependencies**

```bash
pnpm install
```

3. **Development**

```bash
# Start all projects
pnpm dev

# Start specific project
pnpm dev --filter @ying-web/events
```

4. **Build**

```bash
# Build all projects
pnpm build

# Build specific project
pnpm build --filter @ying-web/api-service
```

## Scripts 📝

-   `pnpm dev`: Start development servers
-   `pnpm build`: Build all projects
-   `pnpm build:api-service`: Build API service
-   `pnpm clean`: Clean build artifacts
-   `pnpm deploy`: Deploy projects
-   `pnpm prepare`: Install husky

## Documentation 📚

Visit our [documentation site](https://ying-web-docs.vercel.app) for:

-   📖 Comprehensive guides
-   🔧 API references
-   💡 Best practices
-   🎯 Examples

## Contributing 🤝

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License 📄

MIT © @ying-web
