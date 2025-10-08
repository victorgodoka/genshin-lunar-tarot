# Lunar Arcanum Tarot

A mystical online tarot reading application featuring 22 major arcana cards with interpretations inspired by Teyvat's elemental wisdom.

## 🌙 Features

- **Single Card Reading**: Get yes/no answers with context for love, family, and work
- **Three Card Spread**: Explore past, present, and future with detailed narratives
- **Card Gallery**: Browse all 22 Lunar Arcanum cards with full descriptions
- **Meditation Phase**: Optional reflection time before readings
- **Seeded Readings**: Consistent results with reading seeds
- **Export Functionality**: Save your readings as text files
- **Responsive Design**: Beautiful UI on all devices
- **Accessibility**: ARIA labels and semantic HTML

## 🎴 The Cards

All 22 major arcana cards reimagined with Genshin Impact's elemental system:
- **Electro**: The Magician, The Hierophant, The Tower, Judgment
- **Hydro**: The High Priestess, The Hanged Man, Temperance, The Star
- **Dendro**: The Empress
- **Geo**: The Emperor, Justice
- **Pyro**: The Lovers, Strength, The Devil, The Sun
- **Anemo**: The Chariot, Wheel of Fortune, The World, The Fool
- **Cryo**: The Hermit, Death, The Moon

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/lunar-arcanum-tarot.git

# Navigate to project directory
cd lunar-arcanum-tarot

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### Build for Production

```bash
pnpm build
```

## 📱 SEO & Performance

This project includes:
- Comprehensive meta tags (Open Graph, Twitter Cards)
- Structured data (JSON-LD)
- robots.txt and sitemap.xml
- PWA manifest
- Semantic HTML
- Accessibility features

## 🛠️ Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Iconify** for icons
- **Seeded RNG** for consistent readings

## 📄 License

MIT License - feel free to use this project for your own purposes.

---

## Original Vite Template Info

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
