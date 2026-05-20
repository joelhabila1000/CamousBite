import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sql } from "@vercel/postgres";

const json = (res, status, data) => {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data));
};

const readJson = async (req) => {
  if (req.body && typeof req.body === "object") return req.body;
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const text = Buffer.concat(chunks).toString("utf8");
  if (!text) return {};
  return JSON.parse(text);
};

const requireAuth = (req) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
};

const pickVendor = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    storeName: row.store_name,
    ownerName: row.owner_name,
    email: row.email,
    phone: row.phone,
    campus: row.campus,
    category: row.category,
    open: row.open,
    emoji: row.emoji,
    banner: row.banner,
    hours: row.hours,
    description: row.description,
    createdAt: row.created_at,
  };
};

export {
  sql,
  bcrypt,
  jwt,
  json,
  readJson,
  requireAuth,
  pickVendor,
};
