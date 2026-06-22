import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// GitHub Pages serves the site from /<repo>/, so use that as the base for the
// production build only. Local dev (`npm run dev`) keeps serving from root.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/recuerda-me/' : '/',
  plugins: [react()],
}))
