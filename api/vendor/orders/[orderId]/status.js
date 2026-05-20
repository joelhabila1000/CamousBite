import { json, readJson, requireAuth, sql } from "../../../_utils.js";

export default async function handler(req, res) {
  if (req.method !== "PATCH") {
    res.setHeader("Allow", "PATCH");
    return json(res, 405, { error: "Method not allowed" });
  }

  const payload = requireAuth(req);
  if (!payload) return json(res, 401, { error: "Unauthorized" });

  const { orderId } = req.query || {};
  if (!orderId) return json(res, 400, { error: "Missing order id" });

  try {
    const body = await readJson(req);
    const { status } = body || {};
    if (!status) return json(res, 400, { error: "Missing status" });

    await sql`
      insert into vendor_order_status (order_id, vendor_id, status)
      values (${orderId}, ${payload.vendorId}, ${status})
      on conflict (order_id, vendor_id)
      do update set status = excluded.status, updated_at = now()
    `;

    return json(res, 200, { ok: true });
  } catch (error) {
    return json(res, 500, { error: "Server error" });
  }
}
