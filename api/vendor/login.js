import { bcrypt, json, jwt, pickVendor, readJson, sql } from "../_utils.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return json(res, 405, { error: "Method not allowed" });
  }

  try {
    const body = await readJson(req);
    const { email, password } = body || {};
    if (!email || !password) {
      return json(res, 400, { error: "Missing credentials" });
    }

    const result = await sql`
      select * from vendors where email = ${email.toLowerCase()}
    `;
    if (result.rowCount === 0) {
      return json(res, 401, { error: "Invalid credentials" });
    }

    const vendorRow = result.rows[0];
    const ok = await bcrypt.compare(password, vendorRow.password_hash);
    if (!ok) {
      return json(res, 401, { error: "Invalid credentials" });
    }

    const vendor = pickVendor(vendorRow);
    const token = jwt.sign(
      { vendorId: vendor.id, email: vendor.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    return json(res, 200, { vendor, token });
  } catch (error) {
    return json(res, 500, { error: "Server error" });
  }
}
