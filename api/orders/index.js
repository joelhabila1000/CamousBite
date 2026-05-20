import { json, readJson, sql } from "../_utils.js";

const buildOrderCode = () => {
  const year = new Date().getFullYear();
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `CB-${year}-${suffix}`;
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return json(res, 405, { error: "Method not allowed" });
  }

  try {
    const body = await readJson(req);
    const { customer, items, totals, eta } = body || {};
    if (!customer?.name || !customer?.phone || !customer?.address) {
      return json(res, 400, { error: "Missing customer info" });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return json(res, 400, { error: "Missing order items" });
    }

    const orderCode = buildOrderCode();
    const orderResult = await sql`
      insert into orders
        (order_code, eta, customer_name, customer_phone, customer_address, subtotal, discount, delivery, total)
      values
        (${orderCode}, ${eta || ""}, ${customer.name}, ${customer.phone}, ${customer.address},
         ${totals?.subtotal || 0}, ${totals?.discount || 0}, ${totals?.delivery || 0}, ${totals?.total || 0})
      returning *
    `;

    const order = orderResult.rows[0];
    const vendorStatus = {};

    for (const item of items) {
      await sql`
        insert into order_items
          (order_id, product_id, vendor_id, name, price, qty, emoji, rest)
        values
          (${order.id}, ${item.id}, ${item.vendorId || null}, ${item.name}, ${item.price}, ${item.qty}, ${item.emoji}, ${item.rest})
      `;

      if (item.vendorId) {
        vendorStatus[item.vendorId] = "New";
        await sql`
          update products
          set
            stock = greatest(stock - ${item.qty}, 0),
            sold = sold + ${item.qty},
            available = case when stock - ${item.qty} > 0 then true else false end
          where id = ${item.id}
        `;
      }
    }

    for (const vendorId of Object.keys(vendorStatus)) {
      await sql`
        insert into vendor_order_status (order_id, vendor_id, status)
        values (${order.id}, ${vendorId}, 'New')
        on conflict (order_id, vendor_id)
        do update set status = excluded.status, updated_at = now()
      `;
    }

    return json(res, 201, {
      order: {
        id: order.id,
        code: order.order_code,
        eta: order.eta,
        createdAt: order.created_at,
      },
    });
  } catch (error) {
    return json(res, 500, { error: "Server error" });
  }
}
