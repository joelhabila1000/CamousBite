import { bcrypt, json, jwt, pickVendor, readJson, sql } from "../_utils.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return json(res, 405, { error: "Method not allowed" });
  }

  try {
    const body = await readJson(req);
    const {
      storeName,
      ownerName,
      email,
      phone,
      campus,
      category,
      password,
    } = body || {};

    if (!storeName || !ownerName || !email || !phone || !campus || !password) {
      return json(res, 400, { error: "Missing required fields" });
    }

    const existing = await sql`
      select id from vendors where email = ${email.toLowerCase()}
    `;
    if (existing.rowCount > 0) {
      return json(res, 409, { error: "Vendor already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const result = await sql`
      insert into vendors
        (store_name, owner_name, email, phone, campus, category, password_hash, open, emoji, banner, hours, description)
      values
        (${storeName}, ${ownerName}, ${email.toLowerCase()}, ${phone}, ${campus}, ${category || "local"}, ${hashed}, true,
         '🏪', 'linear-gradient(135deg,#6D28D9,#9333EA)', 'Mon–Sun 8AM–8PM', '')
      returning *
    `;

    const vendor = pickVendor(result.rows[0]);
    const token = jwt.sign(
      { vendorId: vendor.id, email: vendor.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    return json(res, 201, { vendor, token });
  } catch (error) {
    return json(res, 500, { error: "Server error" });
  }
}
