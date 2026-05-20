import { useEffect, useMemo, useRef, useState } from "react";
import { formatNaira } from "../utils.js";

const STATUS_OPTIONS = [
  "New",
  "Preparing",
  "Ready",
  "Out for delivery",
  "Delivered",
];

const CSV_HEADERS = [
  "name",
  "price",
  "tag",
  "emoji",
  "desc",
  "time",
  "cals",
  "stock",
];

const parseCsvLine = (line) => {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
};

const toCsvRow = (values) =>
  values
    .map((value) => {
      const safe = String(value ?? "");
      if (safe.includes(",") || safe.includes('"') || safe.includes("\n")) {
        return `"${safe.replace(/"/g, '""')}"`;
      }
      return safe;
    })
    .join(",");

export default function VendorPage({
  vendors,
  currentVendor,
  onRegisterVendor,
  onLoginVendor,
  onLogoutVendor,
  products,
  orders,
  categories,
  onAddProduct,
  onUpdateProduct,
  onUpdateOrderStatus,
  onToggleVendorOpen,
  onNotify,
  onUpdateVendorProfile,
  onImportProducts,
}) {
  const [dashboardTab, setDashboardTab] = useState("overview");
  const [registerForm, setRegisterForm] = useState({
    storeName: "",
    ownerName: "",
    email: "",
    phone: "",
    campus: "",
    category: categories?.[1]?.key || "local",
    password: "",
  });
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [productForm, setProductForm] = useState({
    name: "",
    price: "",
    tag: categories?.[1]?.key || "local",
    emoji: "🍲",
    desc: "",
    time: "15 min",
    cals: "",
    stock: "",
  });
  const [profileForm, setProfileForm] = useState({
    storeName: "",
    emoji: "🏪",
    banner: "",
    hours: "",
    description: "",
  });
  const fileInputRef = useRef(null);

  const vendorProducts = useMemo(() => {
    if (!currentVendor) return [];
    return products.filter((product) => product.vendorId === currentVendor.id);
  }, [products, currentVendor]);

  const vendorOrders = useMemo(() => {
    if (!currentVendor) return [];
    return orders.filter((order) =>
      order.items.some((item) => item.vendorId === currentVendor.id),
    );
  }, [orders, currentVendor]);

  const vendorRevenue = useMemo(() => {
    if (!currentVendor) return 0;
    return vendorOrders.reduce((sum, order) => {
      const items = order.items.filter(
        (item) => item.vendorId === currentVendor.id,
      );
      const total = items.reduce(
        (itemSum, item) => itemSum + item.price * item.qty,
        0,
      );
      return sum + total;
    }, 0);
  }, [vendorOrders, currentVendor]);

  const availableProducts = vendorProducts.filter(
    (product) => product.available !== false && Number(product.stock || 0) > 0,
  );
  const pausedProducts = vendorProducts.filter(
    (product) => product.available === false || Number(product.stock || 0) === 0,
  );
  const lowStockProducts = vendorProducts.filter(
    (product) => Number(product.stock || 0) > 0 && Number(product.stock || 0) <= 5,
  );
  const pendingOrders = vendorOrders.filter(
    (order) => order.vendorStatus?.[currentVendor?.id] !== "Delivered",
  );
  const averagePrepTime =
    vendorProducts.find((product) => product.time)?.time ||
    currentVendor?.hours ||
    "15 min";

  const handleRegister = async () => {
    const { storeName, ownerName, email, phone, campus, password } =
      registerForm;
    if (!storeName || !ownerName || !email || !phone || !campus || !password) {
      onNotify("err", "Please complete all vendor registration fields");
      return;
    }
    const ok = await onRegisterVendor(registerForm);
    if (ok) {
      setRegisterForm({
        storeName: "",
        ownerName: "",
        email: "",
        phone: "",
        campus: "",
        category: categories?.[1]?.key || "local",
        password: "",
      });
    }
  };
  useEffect(() => {
    if (!currentVendor) return;
    setProfileForm({
      storeName: currentVendor.storeName || "",
      emoji: currentVendor.emoji || "🏪",
      banner: currentVendor.banner || "",
      hours: currentVendor.hours || "",
      description: currentVendor.description || "",
    });
  }, [currentVendor]);

  const handleLogin = async () => {
    if (!loginForm.email || !loginForm.password) {
      onNotify("err", "Enter your vendor email and password");
      return;
    }
    await onLoginVendor(loginForm.email, loginForm.password);
  };

  const handleAddProduct = async () => {
    if (!currentVendor) return;
    if (!productForm.name || !productForm.price || !productForm.desc) {
      onNotify("err", "Add a name, price, and description for the product");
      return;
    }
    await onAddProduct({
      ...productForm,
      price: Number(productForm.price),
      stock: Number(productForm.stock || 0),
    });
    setProductForm({
      name: "",
      price: "",
      tag: categories?.[1]?.key || "local",
      emoji: "🍲",
      desc: "",
      time: "15 min",
      cals: "",
      stock: "",
    });
  };

  const handleExport = () => {
    if (!currentVendor) return;
    const rows = [CSV_HEADERS.join(",")].concat(
      vendorProducts.map((product) =>
        toCsvRow(
          CSV_HEADERS.map((key) =>
            key === "price" || key === "stock"
              ? Number(product[key] || 0)
              : product[key] || "",
          ),
        ),
      ),
    );
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${currentVendor.storeName}-menu.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const text = String(reader.result || "");
      const lines = text.split(/\r?\n/).filter((line) => line.trim());
      if (lines.length < 2) {
        onNotify("err", "CSV file is empty or missing rows");
        return;
      }
      const headers = parseCsvLine(lines[0]).map((h) => h.toLowerCase());
      const rows = lines.slice(1).map((line) => parseCsvLine(line));
      const items = rows
        .map((row) => {
          const payload = {};
          headers.forEach((header, idx) => {
            payload[header] = row[idx] ?? "";
          });
          return payload;
        })
        .filter((row) => row.name && row.price && row.desc);

      if (!items.length) {
        onNotify("err", "No valid products found in CSV");
        return;
      }
      await onImportProducts(items);
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  const seedProfileForm = () => {
    if (!currentVendor) return;
    setProfileForm({
      storeName: currentVendor.storeName || "",
      emoji: currentVendor.emoji || "🏪",
      banner: currentVendor.banner || "",
      hours: currentVendor.hours || "",
      description: currentVendor.description || "",
    });
  };

  const handleProfileSave = async () => {
    if (!currentVendor) return;
    if (!profileForm.storeName || !profileForm.hours) {
      onNotify("err", "Store name and working hours are required");
      return;
    }
    await onUpdateVendorProfile({
      storeName: profileForm.storeName,
      emoji: profileForm.emoji,
      banner: profileForm.banner,
      hours: profileForm.hours,
      description: profileForm.description,
    });
  };

  return (
    <div className="page active" id="page-vendor">
      <section className="vendor-hero">
        <div>
          <span className="section-tag">Vendor Hub</span>
          <h1>Become a Vendor</h1>
          <p>
            Register your store, upload products, and track orders in real time.
            Build loyal campus customers with your own dashboard.
          </p>
        </div>
        <div className="vendor-hero-card vendor-preview-card">
          <div className="vendor-preview-top">
            <div>
              <span className="vendor-live-dot" />
              Live restaurant dashboard
            </div>
            <strong>Today</strong>
          </div>
          <div className="vendor-preview-metrics">
            <div>
              <span>Revenue</span>
              <strong>₦84k</strong>
            </div>
            <div>
              <span>Orders</span>
              <strong>42</strong>
            </div>
            <div>
              <span>Ready</span>
              <strong>9</strong>
            </div>
          </div>
          <div className="vendor-preview-queue">
            {["Jollof bowl", "Shawarma", "Grilled chicken"].map((item, index) => (
              <div key={item}>
                <span>{index + 1}</span>
                <p>{item}</p>
                <strong>{index === 0 ? "Preparing" : "Queued"}</strong>
              </div>
            ))}
          </div>
          <button className="vendor-preview-btn" onClick={() => onNotify("info", "Create or sign in to open the live dashboard")}>
            Open Dashboard
          </button>
        </div>
      </section>

      {!currentVendor && (
        <section className="vendor-grid">
          <div className="vendor-card">
            <h3>Create Vendor Account</h3>
            <p>Register your restaurant or shop to start selling today.</p>
            <div className="vendor-form">
              <input
                className="f-inp"
                placeholder="Store name"
                value={registerForm.storeName}
                onChange={(event) =>
                  setRegisterForm((prev) => ({
                    ...prev,
                    storeName: event.target.value,
                  }))
                }
              />
              <input
                className="f-inp"
                placeholder="Owner name"
                value={registerForm.ownerName}
                onChange={(event) =>
                  setRegisterForm((prev) => ({
                    ...prev,
                    ownerName: event.target.value,
                  }))
                }
              />
              <input
                className="f-inp"
                type="email"
                placeholder="Business email"
                value={registerForm.email}
                onChange={(event) =>
                  setRegisterForm((prev) => ({
                    ...prev,
                    email: event.target.value,
                  }))
                }
              />
              <input
                className="f-inp"
                placeholder="Phone number"
                value={registerForm.phone}
                onChange={(event) =>
                  setRegisterForm((prev) => ({
                    ...prev,
                    phone: event.target.value,
                  }))
                }
              />
              <input
                className="f-inp"
                placeholder="Campus / Location"
                value={registerForm.campus}
                onChange={(event) =>
                  setRegisterForm((prev) => ({
                    ...prev,
                    campus: event.target.value,
                  }))
                }
              />
              <select
                className="f-inp"
                value={registerForm.category}
                onChange={(event) =>
                  setRegisterForm((prev) => ({
                    ...prev,
                    category: event.target.value,
                  }))
                }
              >
                {categories
                  .filter((cat) => cat.key !== "all")
                  .map((cat) => (
                    <option key={cat.key} value={cat.key}>
                      {cat.label}
                    </option>
                  ))}
              </select>
              <input
                className="f-inp"
                type="password"
                placeholder="Create password"
                value={registerForm.password}
                onChange={(event) =>
                  setRegisterForm((prev) => ({
                    ...prev,
                    password: event.target.value,
                  }))
                }
              />
              <button className="btn btn-primary btn-full" onClick={handleRegister}>
                Create Vendor Account
              </button>
            </div>
          </div>

          <div className="vendor-card">
            <h3>Vendor Login</h3>
            <p>Access your dashboard and manage your store.</p>
            <div className="vendor-form">
              <input
                className="f-inp"
                type="email"
                placeholder="Vendor email"
                value={loginForm.email}
                onChange={(event) =>
                  setLoginForm((prev) => ({
                    ...prev,
                    email: event.target.value,
                  }))
                }
              />
              <input
                className="f-inp"
                type="password"
                placeholder="Password"
                value={loginForm.password}
                onChange={(event) =>
                  setLoginForm((prev) => ({
                    ...prev,
                    password: event.target.value,
                  }))
                }
              />
              <button className="btn btn-ghost btn-full" onClick={handleLogin}>
                Sign In
              </button>
              <p className="vendor-muted">
                New here? Create a vendor account to unlock your dashboard.
              </p>
            </div>
          </div>
        </section>
      )}

      {currentVendor && (
        <section className="vendor-dashboard">
          <div className="vendor-command">
            <div className="vendor-command-main">
              <span className="section-tag">Restaurant Dashboard</span>
              <h2>{currentVendor.storeName}</h2>
              <p>
                Manage orders, stock, menu availability, and your storefront from
                one place.
              </p>
              <div className="vendor-tags">
                <span>{currentVendor.category}</span>
                <span>{currentVendor.email}</span>
                <span>{currentVendor.campus}</span>
                {currentVendor.hours && <span>{currentVendor.hours}</span>}
              </div>
            </div>
            <div className="vendor-health-card">
              <div className="vendor-store-state">
                <span className={currentVendor.open ? "state-dot open" : "state-dot"} />
                <div>
                  <strong>{currentVendor.open ? "Accepting orders" : "Store closed"}</strong>
                  <p>{availableProducts.length} items available now</p>
                </div>
              </div>
              <div className="vendor-actions">
                <button className="btn btn-ghost" onClick={onToggleVendorOpen}>
                  {currentVendor.open ? "Mark Closed" : "Mark Open"}
                </button>
                <button className="btn btn-primary" onClick={onLogoutVendor}>
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          <div className="vendor-tabs" aria-label="Dashboard sections">
            {[
              ["overview", "Overview"],
              ["menu", "Menu & Stock"],
              ["orders", "Orders"],
              ["profile", "Profile"],
            ].map(([key, label]) => (
              <button
                key={key}
                className={dashboardTab === key ? "active" : ""}
                onClick={() => setDashboardTab(key)}
                type="button"
              >
                {label}
              </button>
            ))}
          </div>

          <div className="vendor-top">
            <div>
              <h2>Operations Snapshot</h2>
              <p>
                Owner: {currentVendor.ownerName} · {currentVendor.campus}
              </p>
            </div>
          </div>

          <div className="vendor-stats">
            <div>
              <h4>Total Revenue</h4>
              <p>{formatNaira(vendorRevenue)}</p>
            </div>
            <div>
              <h4>Available Items</h4>
              <p>{availableProducts.length}</p>
            </div>
            <div>
              <h4>Pending Orders</h4>
              <p>{pendingOrders.length}</p>
            </div>
            <div>
              <h4>Avg Prep Time</h4>
              <p>{averagePrepTime}</p>
            </div>
          </div>

          {(dashboardTab === "overview" || dashboardTab === "menu") && (
            <div className="vendor-ops-grid">
              <div className="vendor-panel vendor-attention-panel">
                <h3>Needs Attention</h3>
                <div className="vendor-attention-list">
                  <div>
                    <strong>{lowStockProducts.length}</strong>
                    <span>Low-stock items</span>
                  </div>
                  <div>
                    <strong>{pausedProducts.length}</strong>
                    <span>Paused or sold-out</span>
                  </div>
                  <div>
                    <strong>{pendingOrders.length}</strong>
                    <span>Orders in progress</span>
                  </div>
                </div>
              </div>
              <div className="vendor-panel vendor-quick-panel">
                <h3>Quick Actions</h3>
                <div className="vendor-actions-row">
                  <button className="btn btn-primary" onClick={onToggleVendorOpen}>
                    {currentVendor.open ? "Pause Store" : "Open Store"}
                  </button>
                  <button
                    className="btn btn-ghost"
                    onClick={() => setDashboardTab("menu")}
                  >
                    Update Food
                  </button>
                  <button
                    className="btn btn-ghost"
                    onClick={() => setDashboardTab("orders")}
                  >
                    View Orders
                  </button>
                </div>
              </div>
            </div>
          )}

          {(dashboardTab === "overview" || dashboardTab === "profile") && (
          <div className="vendor-columns">
            <div className="vendor-panel">
              <h3>Vendor Profile Settings</h3>
              <p className="vendor-muted">
                Update your store branding, banner color, and working hours.
              </p>
              <div className="vendor-form">
                <input
                  className="f-inp"
                  placeholder="Store name"
                  value={profileForm.storeName}
                  onChange={(event) =>
                    setProfileForm((prev) => ({
                      ...prev,
                      storeName: event.target.value,
                    }))
                  }
                  onFocus={seedProfileForm}
                />
                <input
                  className="f-inp"
                  placeholder="Logo emoji (e.g. 🍲)"
                  value={profileForm.emoji}
                  onChange={(event) =>
                    setProfileForm((prev) => ({
                      ...prev,
                      emoji: event.target.value,
                    }))
                  }
                />
                <input
                  className="f-inp"
                  placeholder="Banner gradient (CSS)"
                  value={profileForm.banner}
                  onChange={(event) =>
                    setProfileForm((prev) => ({
                      ...prev,
                      banner: event.target.value,
                    }))
                  }
                />
                <input
                  className="f-inp"
                  placeholder="Working hours (e.g. Mon–Sun 8AM–8PM)"
                  value={profileForm.hours}
                  onChange={(event) =>
                    setProfileForm((prev) => ({
                      ...prev,
                      hours: event.target.value,
                    }))
                  }
                />
                <textarea
                  className="f-inp"
                  rows={3}
                  placeholder="Short store description"
                  value={profileForm.description}
                  onChange={(event) =>
                    setProfileForm((prev) => ({
                      ...prev,
                      description: event.target.value,
                    }))
                  }
                />
                <button className="btn btn-primary btn-full" onClick={handleProfileSave}>
                  Save Profile
                </button>
              </div>
            </div>
          </div>
          )}

          {(dashboardTab === "overview" || dashboardTab === "menu") && (
          <div className="vendor-columns">
            <div className="vendor-panel">
              <h3>Add New Product</h3>
              <div className="vendor-form">
                <input
                  className="f-inp"
                  placeholder="Product name"
                  value={productForm.name}
                  onChange={(event) =>
                    setProductForm((prev) => ({
                      ...prev,
                      name: event.target.value,
                    }))
                  }
                />
                <input
                  className="f-inp"
                  placeholder="Emoji (e.g. 🍲)"
                  value={productForm.emoji}
                  onChange={(event) =>
                    setProductForm((prev) => ({
                      ...prev,
                      emoji: event.target.value,
                    }))
                  }
                />
                <input
                  className="f-inp"
                  placeholder="Price"
                  type="number"
                  value={productForm.price}
                  onChange={(event) =>
                    setProductForm((prev) => ({
                      ...prev,
                      price: event.target.value,
                    }))
                  }
                />
                <input
                  className="f-inp"
                  placeholder="Stock quantity"
                  type="number"
                  value={productForm.stock}
                  onChange={(event) =>
                    setProductForm((prev) => ({
                      ...prev,
                      stock: event.target.value,
                    }))
                  }
                />
                <select
                  className="f-inp"
                  value={productForm.tag}
                  onChange={(event) =>
                    setProductForm((prev) => ({
                      ...prev,
                      tag: event.target.value,
                    }))
                  }
                >
                  {categories
                    .filter((cat) => cat.key !== "all")
                    .map((cat) => (
                      <option key={cat.key} value={cat.key}>
                        {cat.label}
                      </option>
                    ))}
                </select>
                <input
                  className="f-inp"
                  placeholder="Prep time (e.g. 15 min)"
                  value={productForm.time}
                  onChange={(event) =>
                    setProductForm((prev) => ({
                      ...prev,
                      time: event.target.value,
                    }))
                  }
                />
                <input
                  className="f-inp"
                  placeholder="Calories (e.g. 320 kcal)"
                  value={productForm.cals}
                  onChange={(event) =>
                    setProductForm((prev) => ({
                      ...prev,
                      cals: event.target.value,
                    }))
                  }
                />
                <textarea
                  className="f-inp"
                  placeholder="Short description"
                  rows={3}
                  value={productForm.desc}
                  onChange={(event) =>
                    setProductForm((prev) => ({
                      ...prev,
                      desc: event.target.value,
                    }))
                  }
                />
                <button className="btn btn-primary btn-full" onClick={handleAddProduct}>
                  Add Product
                </button>
              </div>
            </div>
          </div>
          )}

          {(dashboardTab === "overview" || dashboardTab === "menu") && (
          <div className="vendor-columns">
            <div className="vendor-panel">
              <h3>Menu CSV Tools</h3>
              <p className="vendor-muted">
                Import or export your menu with columns: {CSV_HEADERS.join(", ")}.
              </p>
              <div className="vendor-actions-row">
                <button className="btn btn-ghost" onClick={handleExport}>
                  Export Menu CSV
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Import Menu CSV
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleImport}
                  style={{ display: "none" }}
                />
              </div>
            </div>

            <div className="vendor-panel">
              <h3>Your Products</h3>
              <div className="vendor-list">
                {vendorProducts.length === 0 && (
                  <p className="vendor-muted">No products yet.</p>
                )}
                {vendorProducts.map((product) => (
                  <div
                    className={`vendor-item ${
                      product.available === false || Number(product.stock || 0) === 0
                        ? "paused"
                        : ""
                    }`}
                    key={product.id}
                  >
                    <div>
                      <h4>
                        {product.emoji} {product.name}
                      </h4>
                      <p>{product.desc}</p>
                      <div className="vendor-meta">
                        <span>{formatNaira(product.price)}</span>
                        <span>{product.stock} in stock</span>
                        <span>{product.tag}</span>
                        <span>
                          {product.available === false || Number(product.stock || 0) === 0
                            ? "Unavailable"
                            : "Available"}
                        </span>
                      </div>
                    </div>
                    <div className="vendor-item-actions">
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() =>
                          onUpdateProduct(product.id, {
                            available: !product.available,
                          })
                        }
                      >
                        {product.available === false ? "Activate" : "Pause"}
                      </button>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() =>
                          onUpdateProduct(product.id, {
                            stock: (product.stock || 0) + 10,
                          })
                        }
                      >
                        Restock +10
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          )}

          {(dashboardTab === "overview" || dashboardTab === "orders") && (
          <div className="vendor-panel">
            <h3>Orders & Tracking</h3>
            {vendorOrders.length === 0 && (
              <p className="vendor-muted">No orders yet.</p>
            )}
            <div className="vendor-orders">
              {vendorOrders.map((order) => {
                const items = order.items.filter(
                  (item) => item.vendorId === currentVendor.id,
                );
                return (
                  <div className="vendor-order" key={order.id}>
                    <div className="vendor-order-head">
                      <div>
                        <strong>{order.code || order.id}</strong>
                        <span>{new Date(order.createdAt).toLocaleString()}</span>
                      </div>
                      <select
                        value={order.vendorStatus?.[currentVendor.id] || "New"}
                        onChange={(event) =>
                          onUpdateOrderStatus(
                            order.id,
                            currentVendor.id,
                            event.target.value,
                          )
                        }
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="vendor-order-body">
                      {items.map((item) => (
                        <div key={item.id}>
                          <span>
                            {item.emoji} {item.name} × {item.qty}
                          </span>
                          <span>{formatNaira(item.price * item.qty)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="vendor-order-foot">
                      <span>Customer: {order.customer?.name || "Guest"}</span>
                      <span>
                        {formatNaira(
                          items.reduce(
                            (sum, item) => sum + item.price * item.qty,
                            0,
                          ),
                        )}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          )}
        </section>
      )}

      {vendors.length > 0 && !currentVendor && (
        <section className="vendor-showcase">
          <h2>Recently Joined Vendors</h2>
          <div className="vendor-list-grid">
            {vendors.slice(0, 6).map((vendor) => (
              <div className="vendor-showcase-card" key={vendor.id}>
                <div className="vendor-badge">{vendor.emoji}</div>
                <h4>{vendor.storeName}</h4>
                <p>{vendor.campus}</p>
                <span>{vendor.category}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}





