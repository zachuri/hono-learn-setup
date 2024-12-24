import { User } from "better-auth";
// import type { Lucia, Session, User } from "lucia";

import { Database } from "../db";
// import { UserTable } from "../db/schema.js";
import type { Env } from "../types/env";
import { BetterAuth, Session } from "./auth";
// import { DatabaseUserAttributes, initializeLucia } from "./lucia.js";

type Variables = {
	db: Database;
	auth: BetterAuth;
	user: User | null;
	session: Session | null;
	// lucia: Lucia<DatabaseUserAttributes>;
};

export interface AppContext {
	Bindings: Env;
	Variables: Variables;
}

// declare module "lucia" {
// 	interface Register {
// 		// @ts-ignore
// 		Lucia: ReturnType<typeof initializeLucia>;
// 		DatabaseUserAttributes: UserTable;
// 	}
// }
