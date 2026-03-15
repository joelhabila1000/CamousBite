export default function MobileDrawer({ open, onClose, onNavigate, onOpenLogin, onOpenSignup }) {
  return (
    <div className={`mobile-drawer ${open ? "open" : ""}`} id="mobileDrawer">
      <button className="drawer-close" onClick={onClose}>
        ✕
      </button>
      <a onClick={() => onNavigate("landing")}>🏠 Home</a>
      <a onClick={() => onNavigate("restaurants")}>🏪 Restaurants</a>
      <a onClick={() => onNavigate("menu")}>🍽️ Menu</a>
      <a onClick={() => onNavigate("track")}>📍 Track Order</a>
      <a onClick={() => onNavigate("about")}>ℹ️ About</a>
      <div className="mob-btns">
        <button className="btn btn-ghost" onClick={onOpenLogin}>
          Sign In
        </button>
        <button className="btn btn-primary" onClick={onOpenSignup}>
          Sign Up
        </button>
      </div>
    </div>
  );
}
