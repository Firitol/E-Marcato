import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

console.log("[v0] Main.tsx loaded");
const rootEl = document.getElementById("root");
console.log("[v0] Root element:", rootEl);

if (rootEl) {
  createRoot(rootEl).render(<App />);
  console.log("[v0] App rendered");
} else {
  console.error("[v0] Root element not found");
}
