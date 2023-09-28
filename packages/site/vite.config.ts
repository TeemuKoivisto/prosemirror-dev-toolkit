import reactRefresh from '@vitejs/plugin-react-refresh'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

const { GH_PAGES } = process.env

// https://vitejs.dev/config/
export default defineConfig({
  base: GH_PAGES ? '/prosemirror-dev-toolkit/' : undefined,
  plugins: [reactRefresh(), tsconfigPaths()],
  server: {
    port: parseInt(process.env.PORT || '3300'),
    strictPort: true
  },
  define: {
    'process.env': process.env
  }
})
