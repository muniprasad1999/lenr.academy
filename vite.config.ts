import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { sentryVitePlugin } from '@sentry/vite-plugin'
import path from 'path'
import { execSync } from 'child_process'

// Get version information at build time
function getVersion(): string {
  try {
    // Try to get git version
    const gitVersion = execSync('git describe --tags --always --dirty', {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore']
    }).trim()
    return gitVersion
  } catch (error) {
    // Fallback to package.json version if git is not available
    try {
      const packageJson = require('./package.json')
      return `v${packageJson.version}`
    } catch {
      return 'unknown'
    }
  }
}

function getBuildTime(): string {
  return new Date().toISOString()
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),

    // Sentry plugin for automatic source map upload
    // Only runs when SENTRY_AUTH_TOKEN is provided (production builds)
    sentryVitePlugin({
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,

      // Enable debug logging to help troubleshoot upload issues
      debug: true,

      // Specify the release name (uses git version)
      release: {
        name: getVersion(),
      },

      // Upload source maps but don't include them in the bundle
      sourcemaps: {
        // Match the build output directory structure
        assets: './dist/assets/**/*.js',
        ignore: ['node_modules/**'],
        filesToDeleteAfterUpload: ['./dist/**/*.map'],
      },

      // Only upload in production builds when auth token is present
      disable: !process.env.SENTRY_AUTH_TOKEN,

      // Tell Sentry where your source files are hosted
      // This helps Sentry match source maps with incoming errors
      urlPrefix: '~/assets',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    'import.meta.env.VITE_APP_VERSION': JSON.stringify(getVersion()),
    'import.meta.env.VITE_BUILD_TIME': JSON.stringify(getBuildTime()),
  },
  build: {
    // Generate source maps for production builds
    // This helps Sentry provide readable stack traces
    sourcemap: true,
  },
})
