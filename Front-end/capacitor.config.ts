import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.slbl.erp",
  appName: "SLBL ERP",
  webDir: "dist",
  bundledWebRuntime: false,
  android: {
    backgroundColor: "#0B1915",
    allowMixedContent: true,
  },
  server: {
    androidScheme: "https",
  },
};

export default config;
