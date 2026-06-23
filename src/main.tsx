import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Em produção esta variável tem de estar definida no Vercel (deployment Convex cloud).
// O fallback evita que o site fique em branco caso ainda não esteja configurada —
// apenas as funcionalidades dependentes do Convex (ex.: adesão) ficam indisponíveis.
const convexUrl =
  (import.meta.env.VITE_CONVEX_URL as string | undefined) ??
  "https://placeholder.convex.cloud";

if (!import.meta.env.VITE_CONVEX_URL) {
  console.warn(
    "[Convex] VITE_CONVEX_URL não definida — funcionalidades de base de dados indisponíveis."
  );
}

const convex = new ConvexReactClient(convexUrl);

createRoot(document.getElementById("root")!).render(
  <ConvexAuthProvider client={convex}>
    <App />
  </ConvexAuthProvider>
);

// PWA: regista o service worker (instalável + leitura offline).
if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // sem service worker — a app funciona na mesma online
    });
  });
}
