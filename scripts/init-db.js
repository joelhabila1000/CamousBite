import "dotenv/config";
import { readFile } from "node:fs/promises";
import { sql } from "@vercel/postgres";

const statements = (await readFile(new URL("../db/schema.sql", import.meta.url), "utf8"))
  .split(";")
  .map((statement) => statement.trim())
  .filter(Boolean);

if (!process.env.POSTGRES_URL && !process.env.DATABASE_URL) {
  throw new Error("Set POSTGRES_URL or DATABASE_URL before running db:init");
}

for (const statement of statements) {
  await sql.query(statement);
}

console.log(`Database initialized with ${statements.length} statements.`);
