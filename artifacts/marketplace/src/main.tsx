import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

console.log("[v0] main.tsx loaded");

const rootElement = document.getElementById("root");
console.log("[v0] rootElement found:", !!rootElement);

if (!rootElement) {
  console.error("[v0] Root element not found!");
  throw new Error("Root element not found");
}

console.log("[v0] Creating root and rendering App");
createRoot(rootElement).render(<App />);
console.log("[v0] App rendered");
