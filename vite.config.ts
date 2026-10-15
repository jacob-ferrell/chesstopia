import { defineConfig, loadEnv, type HttpProxy } from "vite";
import react from "@vitejs/plugin-react";

const DEV_PORT = 5175;
// The backend's CORS allowlist includes this origin, so the dev proxy presents
// itself as it regardless of which machine the browser is on.
const DEV_ORIGIN = `http://localhost:${DEV_PORT}`;

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd());
  const isDev = mode === "development";

  const config = {
    base: isDev ? "/" : "/chesstopia",
    plugins: [react()],
  };

  if (command !== "serve") {
    return config;
  }

  // Dev server: when VITE_SERVER is empty the app talks to relative /api and
  // /websocket paths, and Vite proxies them to the backend. That keeps every
  // request same-origin, so the dev server can be opened from other machines
  // on the network without touching the backend's CORS config.
  const proxyTarget = env.VITE_PROXY_TARGET || env.VITE_SERVER || "http://localhost:8080";
  const rewriteOrigin = (proxy: HttpProxy.Server) => {
    proxy.on("proxyReq", (proxyReq) => proxyReq.setHeader("origin", DEV_ORIGIN));
    proxy.on("proxyReqWs", (proxyReq) => proxyReq.setHeader("origin", DEV_ORIGIN));
  };

  return {
    ...config,
    server: {
      port: DEV_PORT,
      proxy: {
        "/api": {
          target: proxyTarget,
          changeOrigin: true,
          secure: !isDev,
          configure: rewriteOrigin,
        },
        "/websocket": {
          target: proxyTarget,
          changeOrigin: true,
          secure: !isDev,
          ws: true,
          configure: rewriteOrigin,
        },
      },
    },
  };
});
