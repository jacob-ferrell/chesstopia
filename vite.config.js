import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

const defaultConfig = {
  //base: "/chesstopia",
  plugins: [react()],
};

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  const isDev = mode === "development";
  defaultConfig.base = isDev ? "/" : "/chesstopia"
  if (command !== "serve") {
    return defaultConfig;
  }
  return {
    ...defaultConfig,
    server: {
      port: 5175,
      proxy: {
        "/api": {
          target: process.env.VITE_SERVER,
          changeOrigin: isDev,
          secure: !isDev
        },
      },
    },
  };
});
