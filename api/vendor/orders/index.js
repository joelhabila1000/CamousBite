import { json, requireAuth, sql } from "../../_utils.js";

const formatOrder = (order, items, status) => ({
  id: order.id,
  code: order.order_code,
  eta: order.eta,
  createdAt: order.created_at,
  customer: {
    name: order.customer_name,
    phone: order.customer_phone,
    address: order.customer_address,
  },
  totals: {
    subtotal: order.subtotal,
    discount: order.discount,
    delivery: order.delivery,
    total: order.total,
  },
  items,
  vendorStatus: status,
});

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return json(res, 405, { error: "Method not allowed" });
  }

  const payload = requireAuth(req);
  if (!payload) return json(res, 401, { error: "Unauthorized" });

  try {
    const ordersResult = await sql`
      select distinct o.*
      from orders o
      join order_items oi on oi.order_id = o.id
      where oi.vendor_id = ${payload.vendorId}
      order by o.created_at desc
    `;

    const orderIds = ordersResult.rows.map((row) => row.id);
    if (orderIds.length === 0) {
      return json(res, 200, { orders: [] });
    }

    const itemsResult = await sql`
      select * from order_items where order_id = any(${orderIds})
    `;

    const statusResult = await sql`
      select * from vendor_order_status where order_id = any(${orderIds})
    `;

    const itemsByOrder = new Map();
    itemsResult.rows.forEach((row) => {
      if (!itemsByOrder.has(row.order_id)) itemsByOrder.set(row.order_id, []);
      itemsByOrder.get(row.order_id).push({
        id: row.id,
        name: row.name,
        price: row.price,
        qty: row.qty,
        emoji: row.emoji,
        rest: row.rest,
        vendorId: row.vendor_id,
      });
    });

    const statusByOrder = new Map();
    statusResult.rows.forEach((row) => {
      if (!statusByOrder.has(row.order_id)) statusByOrder.set(row.order_id, {});
      statusByOrder.get(row.order_id)[row.vendor_id] = row.status;
    });

    const orders = ordersResult.rows.map((order) =>
      formatOrder(
        order,
        itemsByOrder.get(order.id) || [],
        statusByOrder.get(order.id) || {},
      ),
    );

    return json(res, 200, { orders });
  } catch (error) {
    return json(res, 500, { error: "Server error" });
  }
}
