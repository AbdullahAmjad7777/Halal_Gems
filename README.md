## Halal Restaurant Finder Finland (Beginner Friendly)

This is a small **front-end only** React app.

It loads halal restaurant data from a **Google Sheet published as CSV** and shows:
- A **search + cuisine filter**
- A **list of restaurants**
- A **map with pins**
- A **details card** when you select a restaurant

### How the data flows

1. `useRestaurants()` (in `src/hooks/useRestaurants.ts`)
   - Fetches CSV text from Google Sheets
   - Uses `sheetParser()` to convert CSV text into JavaScript objects
   - Returns `{ restaurants, loading, error }`

2. `App.tsx`
   - Holds the UI state:
     - `search` (text)
     - `cuisine` (dropdown)
     - `selected` (the chosen restaurant)
     - `userLocation` (from the browser geolocation)
   - Creates easy-to-read derived lists:
     - `filteredRestaurants` = matches search + cuisine
     - `restaurantsWithDistance` = same list, plus distance if we have location

3. Map + cards
   - `MapView` shows pins for each restaurant.
   - `RestaurantCard` shows full details for the selected restaurant.

### Run locally

```bash
npm install
npm run dev
```

### Google Sheet link

The app expects the sheet to be published as CSV, like:

`https://docs.google.com/spreadsheets/d/e/.../pub?output=csv`

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

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
"# Halal_Gems" 
