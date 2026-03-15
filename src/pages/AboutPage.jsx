import { ABOUT_STATS, CONTACT_INFO } from "../data.js";

export default function AboutPage({ onSendMessage }) {
  return (
    <div className="page active" id="page-about">
      <section className="section" style={{ paddingTop: 100 }}>
        <div className="section-inner">
          <div className="section-tag">About Us</div>
          <h2 className="section-title">
            Fueling Campus Life
            <br />
            Since 2026
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
              gap: 36,
              marginTop: 40,
            }}
          >
            <div>
              <p
                style={{
                  color: "var(--text2)",
                  lineHeight: 1.85,
                  marginBottom: 18,
                }}
              >
                CampusBite was born out of a simple frustration, students
                spending too much time queuing for food when they could be
                studying, socialising, or resting. We partnered with every
                restaurant and food vendor on campus to bring all your options
                to one seamless platform.
              </p>
              <p style={{ color: "var(--text2)", lineHeight: 1.85 }}>
                Today we serve thousands of students and staff across the
                university, delivering meals in under 20 minutes on average, 7
                days a week.
              </p>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
              }}
            >
              {ABOUT_STATS.map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius)",
                    padding: 22,
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: "1.8rem",
                      fontWeight: 800,
                      color: stat.color,
                      fontFamily: "'Syne',sans-serif",
                    }}
                  >
                    {stat.value}
                  </div>
                  <div
                    style={{
                      fontSize: ".78rem",
                      color: "var(--text2)",
                      marginTop: 5,
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="section" style={{ background: "var(--bg2)" }}>
        <div className="section-inner">
          <div className="section-tag">Get In Touch</div>
          <h2 className="section-title" style={{ marginBottom: 32 }}>
            Contact Us
          </h2>
          <div className="contact-grid">
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {CONTACT_INFO.map((info) => (
                <div className="info-card" key={info.label}>
                  <span className="info-icon">{info.icon}</span>
                  <div>
                    <div className="info-label">{info.label}</div>
                    <div className="info-val">{info.value}</div>
                  </div>
                </div>
              ))}
            </div>
            <div
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                padding: 26,
              }}
            >
              <h4 style={{ marginBottom: 18, fontSize: "1rem" }}>
                Send us a message
              </h4>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                <input className="f-inp" placeholder="Your Name" />
                <input className="f-inp" placeholder="Your Email" />
                <input className="f-inp" placeholder="Subject" />
                <textarea
                  className="f-inp"
                  placeholder="Your message..."
                  style={{ minHeight: 90, resize: "vertical" }}
                />
                <button
                  className="btn btn-primary btn-full"
                  onClick={onSendMessage}
                >
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
