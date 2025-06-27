import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'Burger Queen',
  webDir: 'www',
  server: {
    androidScheme: 'https',
  },
  plugins: {
      CapacitorHttp: {
        enabled: false
      }
  }

};

export default config;
