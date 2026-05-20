import { json, readJson, requireAuth, sql } from "../../_utils.js";

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
  const payload = requireAuth(req);
  if (!payload) return json(res, 401, { error: "Unauthorized" });

  if (req.method === "GET") {
    try {
      const result = await sql`
        select p.*, v.store_name as rest_name
        from products p
        join vendors v on v.id = p.vendor_id
        where p.vendor_id = ${payload.vendorId}
        order by p.created_at desc
      `;
      return json(res, 200, { products: result.rows.map(mapProduct) });
    } catch (error) {
      return json(res, 500, { error: "Server error" });
    }
  }

  if (req.method === "POST") {
    try {
      const body = await readJson(req);
      const { name, price, tag, emoji, desc, time, cals, stock } = body || {};
      if (!name || !price || !desc) {
        return json(res, 400, { error: "Missing required fields" });
      }

      const result = await sql`
        insert into products
          (vendor_id, name, price, tag, emoji, description, time, cals, stock, available, sold, badge, rating)
        values
          (${payload.vendorId}, ${name}, ${price}, ${tag || "local"}, ${emoji || "🍲"}, ${desc},
           ${time || "15 min"}, ${cals || ""}, ${Number(stock || 0)}, true, 0, 'new', '5.0')
        returning *
      `;
      const row = result.rows[0];
      const vendor = await sql`
        select store_name from vendors where id = ${payload.vendorId}
      `;
      row.rest_name = vendor.rows[0]?.store_name || "";
      return json(res, 201, { product: mapProduct(row) });
    } catch (error) {
      return json(res, 500, { error: "Server error" });
    }
  }

  res.setHeader("Allow", "GET, POST");
  return json(res, 405, { error: "Method not allowed" });
}
