import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.blama.admin',
  appName: 'Blama Admin',
  webDir: 'public',
  server: {
    url: 'https://www.blama.shop/admin',
    cleartext: true
  }
};

export default config;
