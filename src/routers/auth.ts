import { Hono } from "hono";
import { AppContext } from "../lib/context";

const authRouter = new Hono<AppContext>().post("/signup/email", async c => {
	const { email, password } = await c.req.json();
  const auth = c.get("auth");

  await auth.api.signUpEmail({ email, password });

});

export default authRouter;
