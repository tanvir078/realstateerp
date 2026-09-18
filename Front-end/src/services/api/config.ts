declare global {
  interface Window {
    ELECTRON_API_URL?: string;
  }
}

const productionApiUrl = 'https://api.slblerp.site/api/v1';

// API Configuration
export const API_CONFIG = {
  // Android emulators reach the host machine through 10.0.2.2; physical devices
  // should provide VITE_API_URL with the backend's LAN/HTTPS address at build time.
  baseURL: window.ELECTRON_API_URL || import.meta.env.VITE_API_URL ||
    productionApiUrl,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
};
