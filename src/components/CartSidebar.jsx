import { useState } from "react";
import { formatNaira } from "../utils.js";

export default function CartSidebar({
  open,
  cart,
  promoApplied,
  totals,
  onClose,
  onApplyPromo,
  onCheckout,
  onChangeQty,
  onRemove,
}) {
  const [promo, setPromo] = useState("");

  const handleApply = () => {
    onApplyPromo(promo);
    setPromo("");
  };

  return (
    <div
      className={`cart-overlay ${open ? "open" : ""}`}
      id="cartOverlay"
      onClick={(event) => {
        if (event.target.id === "cartOverlay") onClose();
      }}
    >
      <div className="cart-panel">
        <div className="cart-head">
          <h3>🛒 Your Order</h3>
          <button className="icon-btn" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="cart-body" id="cartBody">
          {!cart.length ? (
            <div className="cart-empty-msg">
              <div className="big">🍽️</div>
              <p>Your cart is empty</p>
              <p style={{ fontSize: ".8rem", marginTop: 6, color: "var(--text2)" }}>
                Add something delicious!
              </p>
            </div>
          ) : (
            cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <div className="ci-img">{item.emoji}</div>
                <div className="ci-info">
                  <div className="ci-name">{item.name}</div>
                  <div className="ci-price">{formatNaira(item.price * item.qty)}</div>
                  <div className="ci-row">
                    <button className="qty-btn" onClick={() => onChangeQty(item.id, -1)}>
                      −
                    </button>
                    <span className="qty-val">{item.qty}</span>
                    <button className="qty-btn" onClick={() => onChangeQty(item.id, 1)}>
                      +
                    </button>
                    <button className="ci-del" onClick={() => onRemove(item.id)}>
                      🗑
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="cart-foot" id="cartFoot" style={{ display: cart.length ? "block" : "none" }}>
          <div className="promo-row">
            <input
              className="promo-inp"
              id="promoInp"
              placeholder="Promo code"
              value={promo}
              onChange={(event) => setPromo(event.target.value)}
            />
            <button className="promo-apply" onClick={handleApply}>
              Apply
            </button>
          </div>
          <div className="total-row">
            <span>Subtotal</span>
            <span id="tSub">{formatNaira(totals.subtotal)}</span>
          </div>
          <div className="total-row">
            <span>Delivery</span>
            <span id="tDel">{formatNaira(totals.delivery)}</span>
          </div>
          <div className="total-row">
            <span>Discount</span>
            <span id="tDisc" style={{ color: "var(--green)" }}>
              -{formatNaira(totals.discount)}
            </span>
          </div>
          <div className="total-row grand">
            <span>Total</span>
            <span id="tTotal">{formatNaira(totals.total)}</span>
          </div>
          <button
            className="btn btn-primary btn-full"
            style={{ marginTop: 14 }}
            onClick={onCheckout}
          >
            Checkout →
          </button>
          {promoApplied && (
            <p style={{ fontSize: ".75rem", color: "var(--text2)", marginTop: 8 }}>
              Promo applied to this order.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
