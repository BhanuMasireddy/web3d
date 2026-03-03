import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  // Use process.cwd() for compatibility with bundled output (esbuild)
  const distPath = path.resolve(process.cwd(), "dist", "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first with 'npm run build'`,
    );
  }

  app.use(express.static(distPath));

  // Fall through to index.html for any non-matched route (SPA fallback).
  // Use a pathless middleware for Express 5 compatibility.
  app.use((_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
