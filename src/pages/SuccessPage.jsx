export default function SuccessPage({ orderId, eta, onNavigate }) {
  return (
    <div className="page active" id="page-success">
      <div className="success-wrap">
        <div className="success-card">
          <div className="success-anim">🎉</div>
          <h2>Order Placed!</h2>
          <p>
            Your order has been received and the restaurant is already preparing your meal. You'll get a notification
            when your rider picks it up.
          </p>
          <div className="order-id-box">
            <div>
              <label>Order ID</label>
              <span id="successOrderId">{orderId || "CB-2024-0000"}</span>
            </div>
            <div style={{ textAlign: "right" }}>
              <label>Est. Arrival</label>
              <span
                id="successETA"
                style={{
                  fontFamily: "'Syne',sans-serif",
                  fontSize: "1.1rem",
                  fontWeight: 800,
                  color: "var(--green)",
                }}
              >
                {eta || "~18 min"}
              </span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button className="btn btn-primary btn-full btn-lg" onClick={() => onNavigate("track")}>
              📍 Track My Order
            </button>
            <button className="btn btn-ghost btn-full" onClick={() => onNavigate("menu")}>
              🍽️ Order More Food
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
