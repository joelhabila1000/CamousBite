import { formatNaira } from "../utils.js";

export default function FoodModal({ open, food, qty, onClose, onAdjustQty, onAdd }) {
  if (!food) return null;
  return (
    <div
      className={`modal-overlay ${open ? "open" : ""}`}
      id="foodModal"
      onClick={(event) => {
        if (event.target.id === "foodModal") onClose();
      }}
    >
      <div className="modal" style={{ maxWidth: 540 }}>
        <div className="food-modal-img" id="fmImg">
          {food.emoji}
        </div>
        <div className="modal-body">
          <h2 id="fmName" style={{ marginBottom: 6 }}>
            {food.name}
          </h2>
          <p
            style={{ color: "var(--text2)", fontSize: ".875rem", lineHeight: 1.6, marginBottom: 0 }}
            id="fmDesc"
          >
            {food.desc}
          </p>
          <div className="meta-row">
            <div className="meta-chip">
              <label>Price</label>
              <span id="fmPrice" style={{ color: "var(--orange)" }}>
                {formatNaira(food.price)}
              </span>
            </div>
            <div className="meta-chip">
              <label>Time</label>
              <span id="fmTime">{food.time}</span>
            </div>
            <div className="meta-chip">
              <label>Rating</label>
              <span id="fmRating">{food.rating} ⭐</span>
            </div>
            <div className="meta-chip">
              <label>Cals</label>
              <span id="fmCals">{food.cals}</span>
            </div>
          </div>
          <div className="modal-qty-row">
            <label>Quantity:</label>
            <button className="qty-btn" onClick={() => onAdjustQty(-1)}>
              −
            </button>
            <span className="qty-val" id="mqVal">
              {qty}
            </span>
            <button className="qty-btn" onClick={() => onAdjustQty(1)}>
              +
            </button>
            <span className="modal-total" id="mqTotal">
              {formatNaira(food.price * qty)}
            </span>
          </div>
          <div className="modal-actions">
            <button className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={onAdd}>
              Add to Cart 🛒
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
