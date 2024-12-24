import { comments, posts, user } from "./schema";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

const sql = neon(process.env.DATABASE_URL);

const db = drizzle(sql, {
	schema,
});

const main = async () => {
	try {
		console.log("Seeding database");
		// Delete all data
		await db.delete(comments);
		await db.delete(posts);
		await db.delete(user);

		await db.insert(user).values([
			{
				id: "1", // Changed to string
				name: "Alice Johnson",
				email: "alice.johnson@example.com",
				emailVerified: false, // Added missing field
				createdAt: new Date(), // Added missing field
				updatedAt: new Date(), // Added missing field
			},
			{
				id: "2", // Changed to string
				name: "Bob Smith",
				email: "bob.smith@example.com",
				emailVerified: false, // Added missing field
				createdAt: new Date(), // Added missing field
				updatedAt: new Date(), // Added missing field
			},
		]);

		await db.insert(posts).values([
			{
				id: 1,
				userId: "1", // Changed to string
				title: "Introduction",
				content: "Hello, World! Excited to join this community.",
			},
			{
				id: 2,
				userId: "2", // Changed to string
				title: "Reply",
				content: "Hello, Alice! Welcome to the community!",
			},
			{
				id: 3,
				userId: "1", // Changed to string
				title: "Reply",
				content: "Thanks, Bob! Glad to be here.",
			},
		]);

		await db.insert(comments).values([
			{
				id: 1,
				text: "Welcome, Alice! Looking forward to your posts.",
				userId: "2", // Changed to string
				postId: 1,
			},
			{
				id: 2,
				text: "Thank you, Bob! Excited to be part of the conversation.",
				userId: "1", // Changed to string
				postId: 2,
			},
		]);
	} catch (error) {
		console.error(error);
		throw new Error("Failed to seed database");
	}
};

main();
