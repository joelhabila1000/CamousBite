import { formatNaira } from "../utils.js";
import { PaystackButton } from "react-paystack";

export default function CheckoutPage({
  cart,
  totals,
  onPlaceOrder,
  onNavigate,
}) {
  const publicKey = "pk_test_4dce4a11b0ff3315473b4376dfe75a2713c8040a";

  const componentProps = {
    email: document.getElementById("co-email")?.value || "customer@email.com",
    amount: totals.total * 100,
    currency: "NGN",
    metadata: {
      name: document.getElementById("co-name")?.value,
      phone: document.getElementById("co-phone")?.value,
    },
    publicKey,
    text: "🛒 Pay & Place Order",
    onSuccess: (reference) => {
      alert("Payment successful! Ref: " + reference.reference);
      onPlaceOrder();
    },
    onClose: () => alert("Transaction cancelled"),
  };

  return (
    <div className="page active" id="page-checkout">
      <section className="section" style={{ paddingTop: 100 }}>
        <div className="section-inner">
          <div className="section-tag">Step 3 of 3</div>
          <h2 className="section-title" style={{ marginBottom: 8 }}>
            Checkout
          </h2>

          <p
            style={{
              color: "var(--text2)",
              fontSize: ".9rem",
              marginBottom: 32,
            }}
          >
            Fill in your delivery details and confirm your order
          </p>

          <div className="checkout-layout">
            <div>
              <div className="checkout-box">
                <h3>📍 Delivery Details</h3>

                <div className="form-grid">
                  <div className="f-group">
                    <label>Full Name</label>
                    <input
                      className="f-inp"
                      id="co-name"
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="f-group">
                    <label>Phone Number</label>
                    <input
                      className="f-inp"
                      id="co-phone"
                      placeholder="0801-234-5678"
                    />
                  </div>

                  <div className="f-group">
                    <label>Email</label>
                    <input
                      className="f-inp"
                      id="co-email"
                      placeholder="example@email.com"
                    />
                  </div>

                  <div className="f-group full">
                    <label>Hostel / Building / Office</label>
                    <input
                      className="f-inp"
                      id="co-addr"
                      placeholder="Room 5, Block A, Daniel Hall"
                    />
                  </div>

                  <div className="f-group full">
                    <label>Landmark / Note for Rider</label>
                    <input
                      className="f-inp"
                      id="co-note"
                      placeholder="Near the red gate, call on arrival"
                    />
                  </div>

                  <div className="f-group">
                    <label>Preferred Time</label>
                    <select className="f-inp" id="co-time">
                      <option>ASAP (~15–20 mins)</option>
                      <option>In 30 minutes</option>
                      <option>In 1 hour</option>
                      <option>Schedule for later</option>
                    </select>
                  </div>

                  <div className="f-group">
                    <label>Delivery Location</label>
                    <select className="f-inp">
                      <option>University Campus</option>
                      <option>Main Hostel Block</option>
                      <option>Faculty of Science</option>
                      <option>Faculty of Engineering</option>
                      <option>Faculty of Arts</option>
                      <option>Library / Study Hall</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="checkout-box">
                <h3>💳 Payment Method</h3>

                <div className="pay-opt">
                  <label className="pay-label">
                    <input
                      type="radio"
                      name="pay"
                      value="card"
                      defaultChecked
                    />
                    <span>💳 Pay with Card (Paystack)</span>
                  </label>

                  <label className="pay-label">
                    <input type="radio" name="pay" value="bank" />
                    <span>🏦 Bank Transfer</span>
                  </label>

                  <label className="pay-label">
                    <input type="radio" name="pay" value="cash" />
                    <span>💵 Pay on Delivery</span>
                  </label>

                  <label className="pay-label">
                    <input type="radio" name="pay" value="wallet" />
                    <span>👛 Campus Wallet</span>
                  </label>
                </div>
              </div>
            </div>

            <div>
              <div className="checkout-box">
                <h3>🧾 Order Summary</h3>

                <div style={{ marginBottom: 16 }}>
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "8px 0",
                        borderBottom: "1px solid var(--border)",
                        fontSize: ".84rem",
                      }}
                    >
                      <span>
                        {item.emoji} {item.name} × {item.qty}
                      </span>

                      <span style={{ fontWeight: 700 }}>
                        {formatNaira(item.price * item.qty)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="total-row">
                  <span>Subtotal</span>
                  <span>{formatNaira(totals.subtotal)}</span>
                </div>

                <div className="total-row">
                  <span>Delivery</span>
                  <span>{formatNaira(totals.delivery)}</span>
                </div>

                <div className="total-row">
                  <span>Discount</span>
                  <span style={{ color: "var(--green)" }}>
                    -{formatNaira(totals.discount)}
                  </span>
                </div>

                <div className="total-row grand">
                  <span>Total</span>
                  <span>{formatNaira(totals.total)}</span>
                </div>

                <PaystackButton
                  className="btn btn-primary btn-full"
                  style={{ marginTop: 18, padding: 15 }}
                  {...componentProps}
                />

                <button
                  className="btn btn-ghost btn-full btn-sm"
                  style={{ marginTop: 10 }}
                  onClick={() => onNavigate("menu")}
                >
                  ← Edit Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
