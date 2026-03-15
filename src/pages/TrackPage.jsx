import { useState } from "react";

export default function TrackPage({ trackResult, onTrack }) {
  const [input, setInput] = useState("");

  return (
    <div className="page active" id="page-track">
      <section className="section" style={{ paddingTop: 100 }}>
        <div className="section-inner">
          <div className="section-tag">Live Tracking</div>
          <h2 className="section-title">Track Your Order</h2>
          <p className="section-sub" style={{ marginBottom: 28 }}>
            Enter your order ID to see real-time status
          </p>
          <div style={{ display: "flex", gap: 10, maxWidth: 500, marginBottom: 36 }}>
            <input
              className="f-inp"
              id="trackInp"
              placeholder="e.g. CB-2024-1234"
              style={{ flex: 1 }}
              value={input}
              onChange={(event) => setInput(event.target.value)}
            />
            <button className="btn btn-primary" onClick={() => onTrack(input)}>
              Track →
            </button>
          </div>
          {trackResult && (
            <div id="trackResult">
              <div
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border2)",
                  borderRadius: "var(--radius)",
                  padding: 24,
                  maxWidth: 620,
                  marginBottom: 36,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 14,
                    marginBottom: 18,
                  }}
                >
                  <div>
                    <p style={{ fontSize: ".72rem", color: "var(--text2)", marginBottom: 3 }}>ORDER ID</p>
                    <p style={{ fontWeight: 800, fontSize: "1.05rem" }} id="tOrderId">
                      {trackResult.orderId}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: ".72rem", color: "var(--text2)", marginBottom: 3 }}>EST. ARRIVAL</p>
                    <p style={{ fontWeight: 800, fontSize: "1.05rem", color: "var(--orange)" }} id="tETA">
                      {trackResult.eta}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: ".72rem", color: "var(--text2)", marginBottom: 3 }}>RESTAURANT</p>
                    <p style={{ fontWeight: 700 }} id="tRest">
                      {trackResult.rest}
                    </p>
                  </div>
                </div>
                <div
                  style={{
                    background: "rgba(255,92,0,.09)",
                    border: "1px solid rgba(255,92,0,.2)",
                    borderRadius: 12,
                    padding: 13,
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <span style={{ fontSize: "1.4rem" }}>🛵</span>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: ".88rem" }}>Your rider is on the way!</p>
                    <p style={{ fontSize: ".78rem", color: "var(--text2)" }}>
                      Rider: Emeka O. · ⭐ 4.8 · 📞 0801-234-5678
                    </p>
                  </div>
                </div>
              </div>
              <div className="track-steps">
                <div className="track-step done">
                  <div className="t-icon">✅</div>
                  <div className="t-label">Order Placed</div>
                  <div className="t-time" id="tt1">
                    {trackResult.times[0]}
                  </div>
                </div>
                <div className="track-step done">
                  <div className="t-icon">✅</div>
                  <div className="t-label">Confirmed</div>
                  <div className="t-time" id="tt2">
                    {trackResult.times[1]}
                  </div>
                </div>
                <div className="track-step done">
                  <div className="t-icon">👨‍🍳</div>
                  <div className="t-label">Preparing</div>
                  <div className="t-time" id="tt3">
                    {trackResult.times[2]}
                  </div>
                </div>
                <div className="track-step cur">
                  <div className="t-icon">🛵</div>
                  <div className="t-label">On the Way</div>
                  <div className="t-time" id="tt4">
                    {trackResult.times[3]}
                  </div>
                </div>
                <div className="track-step">
                  <div className="t-icon">📦</div>
                  <div className="t-label">Delivered</div>
                  <div className="t-time">—</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
