import { betterAuth, betterAuth as createBetterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { Context } from "hono";
import { AppContext } from "./context";

export const initializeBetterAuth = (c: Context<AppContext>) => {
	let db = c.get("db");
	if (!db) {
		return null;
	}

	let betterAuthInstance = c.get("auth");

	if (!betterAuthInstance) {
		betterAuthInstance = createBetterAuth({
			emailAndPassword: {
				enabled: true,
			},
			database: drizzleAdapter(db, {
				provider: "pg", // or "mysql", "sqlite"
			}),
		});
		c.set("auth", betterAuthInstance);
	}

	return betterAuthInstance;
};

export type BetterAuth = ReturnType<typeof createBetterAuth>;
export type User = BetterAuth["$Infer"]["Session"]["user"];
export type Session = BetterAuth["$Infer"]["Session"]["session"];
