import { Hono } from "hono";
import { AppContext } from "../lib/context";

const app = new Hono<AppContext>();

app.use("*", async (c, next) => {
	const session = await c
		.get("auth")
		.api.getSession({ headers: c.req.raw.headers });

	if (!session) {
		c.set("user", null);
		c.set("session", null);
		return next();
	}

	c.set("user", session.user);
	c.set("session", session.session);
	return next();
});

app.on(["POST", "GET"], "/api/auth/**", c => {
	return c.get("auth").handler(c.req.raw);
});
