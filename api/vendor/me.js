import { json, pickVendor, requireAuth, sql } from "../_utils.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return json(res, 405, { error: "Method not allowed" });
  }

  const payload = requireAuth(req);
  if (!payload) return json(res, 401, { error: "Unauthorized" });

  try {
    const result = await sql`
      select * from vendors where id = ${payload.vendorId}
    `;
    if (result.rowCount === 0) {
      return json(res, 404, { error: "Vendor not found" });
    }
    return json(res, 200, { vendor: pickVendor(result.rows[0]) });
  } catch (error) {
    return json(res, 500, { error: "Server error" });
  }
}
