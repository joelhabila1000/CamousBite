import { json, sql } from "../_utils.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return json(res, 405, { error: "Method not allowed" });
  }

  try {
    const result = await sql`
      select id, store_name, campus, category, emoji, banner, hours, description, open
      from vendors
      order by created_at desc
    `;
    const vendors = result.rows.map((row) => ({
      id: row.id,
      storeName: row.store_name,
      campus: row.campus,
      category: row.category,
      emoji: row.emoji,
      banner: row.banner,
      hours: row.hours,
      description: row.description,
      open: row.open,
    }));
    return json(res, 200, { vendors });
  } catch (error) {
    return json(res, 500, { error: "Server error" });
  }
}
