import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing in environment variables.");
}

export default defineConfig({
  schema: "./db/schema.js", // Changed from .ts to .js
  out: "./drizzle",
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
});