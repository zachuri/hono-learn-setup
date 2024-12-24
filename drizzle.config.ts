import { defineConfig } from "drizzle-kit";

export default defineConfig({
	out: "./src/db/drizzle",
	schema: "./src/db/schema.ts",
	dialect: "postgresql",
	dbCredentials: {
		url: process.env.DATABASE_URL!,
	},
});
