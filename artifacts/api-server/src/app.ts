import express, { type Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import router from "./routes/index.js";
import { seedDatabase } from "./lib/seed.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Express = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api", router);

// In production, serve the built frontend
if (process.env.NODE_ENV === "production") {
  const frontendDist = path.resolve(__dirname, "..", "..", "marketplace", "dist", "public");
  app.use(express.static(frontendDist));
  // SPA fallback — serve index.html for any non-API route
  app.get("*", (_req, res) => {
    res.sendFile(path.join(frontendDist, "index.html"));
  });
}

seedDatabase().catch(console.error);

export default app;
