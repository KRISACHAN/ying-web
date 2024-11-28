# @ying-web/docs 📚

Documentation site for the @ying-web ecosystem, built with [Nextra](https://nextra.site).

## Features 🌟

-   📖 Comprehensive guides for all @ying-web packages
-   🔧 API references with TypeScript support
-   💡 Best practices and examples
-   🎨 Beautiful, modern UI with dark mode support
-   🚀 Fast and SEO-friendly static site

## Prerequisites 🎯

-   Node.js >= 18.16.0
-   Pnpm: 9.14.2

## Project Structure 📂

```
docs/
├── components/           # React components
│   ├── layout/          # Layout components
│   ├── common/          # Common UI components
│   └── mdx/             # MDX-specific components
├── pages/               # Documentation pages
│   ├── _meta.json      # Navigation structure
│   ├── index.mdx       # Home page
│   └── tools/          # Tools documentation
├── public/             # Static assets
├── styles/             # Global styles
└── theme.config.tsx    # Nextra theme configuration
```

## Development 💻

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

## Code Style 🎨

We use several tools to maintain code quality:

-   **ESLint**: JavaScript/TypeScript linting
    ```bash
    pnpm lint
    ```

-   **Stylelint**: CSS/Less linting
    ```bash
    pnpm stylelint
    ```

-   **Prettier**: Code formatting
    ```bash
    pnpm prettier
    ```

### Configuration Files

-   `.prettierrc`: Prettier configuration
    -   Handles `.json` and `.code-workspace` files
    -   Uses 4-space indentation
    -   Enforces consistent code style

-   `.eslintrc.js`: ESLint configuration
    -   TypeScript support
    -   React hooks rules
    -   Import sorting

-   `tailwind.config.js`: Tailwind CSS configuration
    -   Custom theme settings
    -   Content paths configuration

## Documentation Structure 📖

### Current Pages

-   **Home** (`/`): Overview of @ying-web ecosystem
-   **Tools** (`/tools`)
    -   Overview
    -   Getting Started
    -   Storage Utilities

### Adding New Pages

1. Create `.mdx` file in `pages/`
2. Update `_meta.json` for navigation
3. Add content using MDX format
4. Include code examples and API references

## Contributing 🤝

1. Fork the repository
2. Create your feature branch
3. Make your changes
4. Run all linting and formatting checks
5. Submit a pull request

## License 📄

MIT © @ying-web
