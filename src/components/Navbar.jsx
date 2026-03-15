export default function Navbar({
  page,
  onNavigate,
  onToggleTheme,
  onOpenLogin,
  onOpenSignup,
  isLoggedIn,
  onLogout,
  onToggleDrawer,
}) {
  return (
    <nav id="nav">
      <div className="nav-logo" onClick={() => onNavigate("landing")}> 
        <span className="c1">Campus</span>
        <span className="c2">Bite</span> 🍕
      </div>
      <ul className="nav-links" id="navLinks">
        {["landing", "restaurants", "menu", "track", "about"].map((key) => (
          <li key={key}>
            <a
              className={page === key ? "active" : ""}
              onClick={() => onNavigate(key)}
              data-page={key}
            >
              {key === "landing"
                ? "Home"
                : key === "restaurants"
                ? "Restaurants"
                : key === "menu"
                ? "Menu"
                : key === "track"
                ? "Track Order"
                : "About"}
            </a>
          </li>
        ))}
      </ul>
      <div className="nav-right" id="navRight">
        {!isLoggedIn && (
          <button className="btn btn-ghost btn-sm" id="navSignIn" onClick={onOpenLogin}>
            Sign In
          </button>
        )}
        {!isLoggedIn && (
          <button className="btn btn-primary btn-sm" id="navSignUp" onClick={onOpenSignup}>
            Sign Up
          </button>
        )}
        {isLoggedIn && (
          <button className="btn btn-ghost btn-sm" id="navUser" onClick={onLogout}>
            👤 Sign Out
          </button>
        )}
        <button className="theme-btn" onClick={onToggleTheme} title="Toggle theme">
          <span className="toggle-track">
            <span className="toggle-thumb" />
            <span className="ti ti-moon">🌙</span>
            <span className="ti ti-sun">☀️</span>
          </span>
        </button>
      </div>
      <button className="hamburger" onClick={onToggleDrawer}>
        <span />
        <span />
        <span />
      </button>
    </nav>
  );
}
