# @ying-web/events 🎉

Hey there! Welcome to our super cool Christian events project! 🙏

## What's This? 🤔

This is a fun and interactive web app built for Christian events and activities. Think of it as a digital space where faith meets modern tech! ✨

## Tech Stack 🚀

I'm using some pretty awesome stuff here:

-   **React 18** - Latest and greatest! 💪
-   **TypeScript** - Because we love our types! 🎯
-   **Material UI** - For those sleek, modern vibes ✨
-   **Tailwind CSS** - Styling made super easy! 🎨
-   **Vite** - Lightning fast builds! ⚡

## Features 🌟

-   **Lucky Number Draw** - Get your blessed number! 🎲
    -   Real-time updates
    -   Interactive UI
    -   Name registration
-   **Bible Verse Generator** - Daily dose of wisdom! 📖
    -   Random verse selection
    -   Beautiful animations
-   _More exciting features coming soon!_ 🔥

## Development 🛠️

### Prerequisites

-   Node.js >= 18
-   pnpm >= 8

### Getting Started 🏃‍♀️

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

### Code Quality 🧹

We keep our code squeaky clean with:

```bash
# Lint your code
pnpm lint        # ESLint for JS/TS files
pnpm lint:all    # ESLint for all files

# Format your code
pnpm prettier        # Prettier for src directory
pnpm prettier:all    # Prettier for all files

# Style linting
pnpm stylelint      # Check CSS/LESS files
pnpm stylelint:fix  # Auto-fix style issues
```

### Project Structure 📁

```
src/
├── components/     # Reusable components
├── contexts/       # React contexts (e.g., HeaderContext)
├── hooks/         # Custom hooks (e.g., useLuckyNumber)
├── layouts/       # Layout components
├── pages/         # Page components
│   ├── LuckyNumber/   # Lucky number feature
│   └── Promise/       # Bible verse feature
└── services/      # API services
```

## Environment Variables 🌍

Copy `.env.example` to `.env` and configure:

```bash
VITE_REQUEST_BASE_URL=your_api_base_url
```

## Contributing 🤝

Feel free to jump in! I'm always happy to have more hands on deck! 🚢

1. Fork it
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License 📝

MIT - Go wild! Just remember to spread the love! ❤️

---

Made with ❤️ by [@ying-web](https://github.com/KRISACHAN/ying-web)

_"Love the Lord your God with all your heart and with all your soul and with all your mind."_ - Matthew 22:37 📖
