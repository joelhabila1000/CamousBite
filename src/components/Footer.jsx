export default function Footer({ onNavigate }) {
  return (
    <footer>
      <div className="foot-grid">
        <div className="foot-logo">
          <div className="nav-logo" style={{ fontSize: "1.6rem" }}>
            <span className="c1">J</span>
            <span className="c2">ORDER</span> 🍕
          </div>
          <p>
            Your university's favourite food delivery platform. Fast, fresh, and
            always on campus time.
          </p>
          <div className="social-row">
            <a className="soc-btn" href="facebook.com">
              📘
            </a>
            <a className="soc-btn" href="instagram.com">
              📸
            </a>
            <a className="soc-btn" href="X.com">
              🐦
            </a>
            <a className="soc-btn" href="Youtube.com">
              ▶️
            </a>
          </div>
        </div>
        <div className="foot-col">
          <h5>Quick Links</h5>
          <ul>
            <li>
              <a onClick={() => onNavigate("landing")}>Home</a>
            </li>
            <li>
              <a onClick={() => onNavigate("restaurants")}>Restaurants</a>
            </li>
            <li>
              <a onClick={() => onNavigate("menu")}>Menu</a>
            </li>
            <li>
              <a onClick={() => onNavigate("track")}>Track Order</a>
            </li>
          </ul>
        </div>
        <div className="foot-col">
          <h5>Support</h5>
          <ul>
            <li>
              <a>FAQ</a>
            </li>
            <li>
              <a onClick={() => onNavigate("about")}>Contact Us</a>
            </li>
            <li>
              <a>Report Issue</a>
            </li>
            <li>
              <a>Refund Policy</a>
            </li>
          </ul>
        </div>
        <div className="foot-col">
          <h5>Partners</h5>
          <ul>
            <li>
              <a onClick={() => onNavigate("vendor")}>Become a Vendor</a>
            </li>
            <li>
              <a>Become a Rider</a>
            </li>
            <li>
              <a>Advertise</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="foot-bottom">
        <p>© 2026 CampusBite.</p>
        <p>Privacy Policy · Terms of Service</p>
      </div>
    </footer>
  );
}
