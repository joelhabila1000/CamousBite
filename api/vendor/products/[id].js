import { json, readJson, requireAuth, sql } from "../../_utils.js";

export default async function handler(req, res) {
  if (req.method !== "PATCH") {
    res.setHeader("Allow", "PATCH");
    return json(res, 405, { error: "Method not allowed" });
  }

  const payload = requireAuth(req);
  if (!payload) return json(res, 401, { error: "Unauthorized" });

  const { id } = req.query || {};
  if (!id) return json(res, 400, { error: "Missing product id" });

  try {
    const body = await readJson(req);
    const fields = {
      name: body.name,
      price: body.price,
      tag: body.tag,
      emoji: body.emoji,
      description: body.desc,
      time: body.time,
      cals: body.cals,
      stock: body.stock,
      available: body.available,
      sold: body.sold,
      badge: body.badge,
      rating: body.rating,
    };

    const updates = Object.entries(fields).filter(([, value]) => value !== undefined);
    if (!updates.length) {
      return json(res, 400, { error: "No updates provided" });
    }

    const setFragments = updates.map(
      ([key], idx) => `"${key}" = $${idx + 1}`,
    );
    const values = updates.map(([, value]) => value);

    const query = `update products set ${setFragments.join(", ")} where id = $${updates.length + 1} and vendor_id = $${updates.length + 2} returning *`;

    const result = await sql.query(query, [...values, id, payload.vendorId]);

    if (result.rowCount === 0) {
      return json(res, 404, { error: "Product not found" });
    }

    return json(res, 200, { product: result.rows[0] });
  } catch (error) {
    return json(res, 500, { error: "Server error" });
  }
}

