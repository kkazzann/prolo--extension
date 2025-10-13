import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: 'src',
  modules: ['@wxt-dev/module-react'],
  manifest: {
    permissions: ['tabs', 'activeTab'],
    host_permissions: ['*://*.prologistics.info/*']
  },
  webExt: {
    openDevtools: true,
    startUrls: ['https://prologistics.info', 'https://prolodev.prologistics.info'],
    keepProfileChanges: true,
  },
});
