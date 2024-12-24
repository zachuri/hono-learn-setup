import { Hono } from "hono";
import { cors } from "hono/cors";
import { sentry } from "@hono/sentry";
import httpStatus from "http-status";
import { logger } from "hono/logger";
import { initializeDB } from "./db";
import { AppContext } from "./lib/context";
import { comments, hello } from "./routers";
import { initializeBetterAuth } from "./lib/auth";
import { ApiError } from "./utils/ApiError";
import { errorHandler } from "./middleware/error";

const app = new Hono<AppContext>();

app
	.use("*", sentry())
	.use("*", cors())
	.use("*", logger())
	.notFound(() => {
		throw new ApiError(httpStatus.NOT_FOUND, "Not found");
	})
	.onError(errorHandler)
	.use((c, next) => {
		initializeDB(c);
		initializeBetterAuth(c);
		// initializeLucia(c);
		return next();
	});
// .use(AuthMiddleware);

app.on(["POST", "GET"], "/auth/**", c => {
	return c.get("auth").handler(c.req.raw);
});

app.get("/session", async c => {
	const session = c.get("session");
	const user = c.get("user");

	if (!user) return c.body(null, 401);

	return c.json({
		session,
		user,
	});
});

const routes = app
	// .basePath("/api")
	.route("/hello", hello)
	.route("/comments", comments);

export type AppType = typeof routes;
export default app;
