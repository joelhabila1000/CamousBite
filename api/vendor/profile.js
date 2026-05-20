import { json, pickVendor, readJson, requireAuth, sql } from "../_utils.js";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    res.setHeader("Allow", "PUT");
    return json(res, 405, { error: "Method not allowed" });
  }

  const payload = requireAuth(req);
  if (!payload) return json(res, 401, { error: "Unauthorized" });

  try {
    const body = await readJson(req);
    const fields = {
      store_name: body.storeName,
      emoji: body.emoji,
      banner: body.banner,
      hours: body.hours,
      description: body.description,
      open: body.open,
    };

    const updates = Object.entries(fields).filter(([, value]) => value !== undefined);
    if (!updates.length) {
      return json(res, 400, { error: "No updates provided" });
    }

    const setFragments = updates.map(
      ([key], idx) => `"${key}" = $${idx + 1}`,
    );
    const values = updates.map(([, value]) => value);

    const query = `update vendors set ${setFragments.join(", ")} where id = $${updates.length + 1} returning *`;

    const result = await sql.query(query, [...values, payload.vendorId]);

    if (result.rowCount === 0) {
      return json(res, 404, { error: "Vendor not found" });
    }

    return json(res, 200, { vendor: pickVendor(result.rows[0]) });
  } catch (error) {
    return json(res, 500, { error: "Server error" });
  }
}
