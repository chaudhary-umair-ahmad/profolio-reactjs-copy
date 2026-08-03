import react from '@vitejs/plugin-react';
import fs from 'fs/promises';
import { resolve } from 'path';
import { defineConfig, loadEnv } from 'vite';
import commonjs from 'vite-plugin-commonjs';
import vitePluginImp from 'vite-plugin-imp';
// import { tenants } from './src/tenant/theme';
// import { visualizer } from 'rollup-plugin-visualizer'
import { sentryVitePlugin } from '@sentry/vite-plugin';

const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self)',
};

export default async ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'REACT_APP');
  const tenantName = env.REACT_APP_TENANT;
  const customTheme = (await import(`./src/theme/index.js`)).default;

  const sourcemap = env.REACT_APP_GENERATE_SOURCEMAP === 'true';
  return defineConfig({
    define: {
      'process.env.REACT_APP_TENANT': JSON.stringify(tenantName),
      'process.env.REACT_APP_API_ENDPOINT': JSON.stringify(env.REACT_APP_API_ENDPOINT),
      'process.env.REACT_APP_ALGOLIA_LOCATION_INDEX': JSON.stringify(env.REACT_APP_ALGOLIA_LOCATION_INDEX),
      'process.env.REACT_APP_CLASSIFIED_URL': JSON.stringify(env.REACT_APP_CLASSIFIED_URL),
      'process.env.REACT_APP_BASE_URL': JSON.stringify(env.REACT_APP_BASE_URL),
      'process.env.REACT_APP_COOKIE_DOMAIN': JSON.stringify(env.REACT_APP_COOKIE_DOMAIN),
      'process.env.REACT_APP_ENVIRONMENT': JSON.stringify(env.REACT_APP_ENVIRONMENT),
      'process.env.REACT_APP_ALGOLIA_APP_ID': JSON.stringify(env.REACT_APP_ALGOLIA_APP_ID),
      'process.env.REACT_APP_ALGOLIA_KEY': JSON.stringify(env.REACT_APP_ALGOLIA_KEY),
      'process.env.REACT_APP_ALGOLIA_PROJECTS_INDEX': JSON.stringify(env.REACT_APP_ALGOLIA_PROJECTS_INDEX),
      'process.env.REACT_APP_LEGACY_API_ENDPOINT': JSON.stringify(env.REACT_APP_LEGACY_API_ENDPOINT),
      'process.env.REACT_APP_MAPBOX_ACCESS_TOKEN': JSON.stringify(env.REACT_APP_MAPBOX_ACCESS_TOKEN),
      'process.env.REACT_APP_CHECKOUT_ID': JSON.stringify(env.REACT_APP_CHECKOUT_ID),
      'process.env.REACT_APP_SENTRY_DSN': JSON.stringify(env.REACT_APP_SENTRY_DSN),
      'process.env.REACT_APP_ZENDESK': JSON.stringify(env.REACT_APP_ZENDESK),
      'process.env.REACT_APP_KEYCLOAK_BASE_URL': JSON.stringify(env.REACT_APP_KEYCLOAK_BASE_URL),
      'process.env.REACT_APP_KEYCLOAK_CLIENT_ID': JSON.stringify(env.REACT_APP_KEYCLOAK_CLIENT_ID),
      'process.env.REACT_APP_KEYCLOAK_REALM': JSON.stringify(env.REACT_APP_KEYCLOAK_REALM),
      'process.env.REACT_APP_BROADCAST_CHANNEL_NAME': JSON.stringify(env.REACT_APP_BROADCAST_CHANNEL_NAME),
      'process.env.REACT_APP_GA_MEASUREMENT_ID': JSON.stringify(env.REACT_APP_GA_MEASUREMENT_ID),
      'process.env.NODE_ENV': JSON.stringify(env.NODE_ENV),
      'process.env.REACT_APP_MOENGAGE_APP_ID': JSON.stringify(env.REACT_APP_MOENGAGE_APP_ID),
      'process.env.REACT_APP_GOOGLE_MAPS_API_KEY': JSON.stringify(env.REACT_APP_GOOGLE_MAPS_API_KEY),
      'process.env.REACT_APP_STRAT_RECAPTCHA_KEY': JSON.stringify(env.REACT_APP_STRAT_RECAPTCHA_KEY),
      'process.env.REACT_APP_HUMBUCKER_ENABLED': JSON.stringify(env.REACT_APP_HUMBUCKER_ENABLED),
      'process.env.REACT_APP_HUMBUCKER_SCRIPT_URL': JSON.stringify(env.REACT_APP_HUMBUCKER_SCRIPT_URL),
      'process.env.REACT_APP_HUMBUCKER_SCRIPT_VERSION': JSON.stringify(env.REACT_APP_HUMBUCKER_SCRIPT_VERSION),
      'process.env.REACT_APP_HUMBUCKER_CLIENT_NAME': JSON.stringify(env.REACT_APP_HUMBUCKER_CLIENT_NAME),
    },
    plugins: [
      commonjs(),
      react(),
      vitePluginImp({
        libList: [{ libName: 'antd', style: (name) => `antd/es/${name}/style` }],
      }),
      ...(sourcemap
        ? [
            sentryVitePlugin({
              authToken: env.REACT_APP_SENTRY_AUTH_TOKEN,
              org: 'dubizzlelab',
              project: 'profolio-reactjs',
            }),
          ]
        : []),
      // visualizer({ open: true }) // Opens the report in the browser
    ],
    css: { preprocessorOptions: { less: { javascriptEnabled: true, modifyVars: customTheme } } },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@variables': resolve(__dirname, `src/tenant/${tenantName}/variables`),
        '@tenantRoutes': resolve(__dirname, `src/tenant/${tenantName}/routes`),
        '@routes': resolve(__dirname, `src/tenant/common/routes`),
        '@constants': resolve(__dirname, `src/tenant/${tenantName}/constants`),
        '@tenantMenuList': resolve(__dirname, `src/tenant/${tenantName}/menuList`),
        '@menuList': resolve(__dirname, `src/tenant/common/menuList`),
        '@theme': resolve(__dirname, `src/theme`),
        '@tenantData': resolve(__dirname, `src/tenant/${tenantName}/data`),
        '@data': resolve(__dirname, `src/tenant/common/data`),
        '@api': resolve(__dirname, `src/tenant/${tenantName}/apis`),
        '@rtkApis': resolve(__dirname, `src/tenant/${tenantName}/apis`),
        '@tenantFilters': resolve(__dirname, `src/tenant/${tenantName}/filters`),
        '@filters': resolve(__dirname, `src/tenant/common/filters`),
        '@tenantUtils': resolve(__dirname, `src/tenant/${tenantName}/utils`),
        '@utils': resolve(__dirname, `src/tenant/common/utils`),
        '@tenantTransformers': resolve(__dirname, `src/tenant/${tenantName}/transformers`),
        '@transformers': resolve(__dirname, `src/tenant/common/transformers`),
        '@tenantPayloads': resolve(__dirname, `src/tenant/${tenantName}/payloads`),
        '@payloads': resolve(__dirname, `src/tenant/common/payloads`),
        '@tenantComponents': resolve(__dirname, `src/tenant/${tenantName}/components`),
        '@components': resolve(__dirname, `src/tenant/common/components`),
        '@store': resolve(__dirname, 'src/store'),
      },
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },

    build: {
      sourcemap,
      outDir: 'build',
      rollupOptions: {
        output: {
          manualChunks: { 'react-vendor': ['react', 'react-dom'] },
          assetFileNames: 'profolio-assets/build-assets/[name].[hash].[ext]',
          chunkFileNames: 'profolio-assets/build-assets/[name].[hash].js',
          entryFileNames: 'profolio-assets/build-assets/[name].[hash].js',
        },
      },
    },
    esbuild: { loader: 'jsx', include: /src\/.*\.jsx?$/, exclude: [] },
    optimizeDeps: {
      include: ['src'],
      esbuildOptions: {
        plugins: [
          {
            name: 'load-js-files-as-jsx',
            setup(build) {
              build.onLoad({ filter: /src\/.*\.js$/ }, async (args) => ({
                loader: 'jsx',
                contents: await fs.readFile(args.path, 'utf8'),
              }));
            },
          },
        ],
      },
    },
    // Baseline security headers. NOTE: for the production static build these MUST also be
    // set at the reverse-proxy / CDN (nginx, CloudFront) — Vite only serves dev & preview.
    // Recommended proxy config: add CSP + HSTS + `X-Frame-Options: DENY` (clickjacking)
    // since CSP `frame-ancestors` is ignored when delivered via a <meta> tag.
    server: { port: 3000, headers: securityHeaders },
    preview: { headers: securityHeaders },
  });
};
