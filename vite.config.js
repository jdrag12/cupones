import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    assetsDir: "assets",
  },
  define: {
    // Expose environment variables to the client
    "import.meta.env.VITE_BIRTHDAY_DDMMYYYY": JSON.stringify(
      process.env.BIRTHDAY_DDMMYYYY
    ),
  },
});
