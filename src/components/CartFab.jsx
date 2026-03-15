export default function CartFab({ count, onOpen }) {
  return (
    <button
      className="cart-fab"
      id="cartFab"
      onClick={onOpen}
      style={{ display: count > 0 ? "flex" : "none" }}
    >
      🛒 Cart <span className="cart-badge" id="cartBadge">{count}</span>
    </button>
  );
}
