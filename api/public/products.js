import { json, sql } from "../_utils.js";

const mapProduct = (row) => ({
  id: row.id,
  vendorId: row.vendor_id,
  name: row.name,
  price: Number(row.price),
  tag: row.tag,
  emoji: row.emoji,
  desc: row.description,
  time: row.time,
  cals: row.cals,
  stock: row.stock,
  available: row.available,
  sold: row.sold,
  rest: row.rest_name,
  badge: row.badge,
  rating: row.rating,
});

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return json(res, 405, { error: "Method not allowed" });
  }

  try {
    const result = await sql`
      select p.*, v.store_name as rest_name
      from products p
      join vendors v on v.id = p.vendor_id
      where (p.available = true or p.stock = 0)
      order by p.created_at desc
    `;
    return json(res, 200, { products: result.rows.map(mapProduct) });
  } catch (error) {
    return json(res, 500, { error: "Server error" });
  }
}

