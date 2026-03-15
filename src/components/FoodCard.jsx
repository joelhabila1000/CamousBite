import { formatNaira } from "../utils.js";

const badgeMap = {
  hot: "fb-hot 🔥 Hot",
  pop: "fb-pop ⭐ Popular",
  new: "fb-new 🆕 New",
  heal: "fb-heal 🌿 Healthy",
  des: "fb-des 🍰 Dessert",
};

export default function FoodCard({ food, onOpen, onAdd, onToggleFav }) {
  const badge = food.badge && badgeMap[food.badge] ? badgeMap[food.badge] : "";
  const badgeClass = badge ? badge.split(" ")[0] : "";
  const badgeLabel = badge ? badge.slice(badge.indexOf(" ") + 1) : "";

  return (
    <div className="food-card" data-tag={food.tag} data-id={food.id} onClick={() => onOpen(food.id)}>
      <div className="food-thumb">
        {food.emoji}
        {badge && <span className={`food-badge ${badgeClass}`}>{badgeLabel}</span>}
        <button
          className="fav-btn"
          onClick={(event) => {
            event.stopPropagation();
            onToggleFav(event.currentTarget);
          }}
        >
          🤍
        </button>
      </div>
      <div className="food-body">
        <div className="food-name">{food.name}</div>
        <div className="food-desc">{food.desc}</div>
        <div className="food-meta">
          <span>⭐ {food.rating}</span>
          <span>🕐 {food.time}</span>
          <span>🏪 {food.rest}</span>
        </div>
        <div className="food-footer">
          <div className="food-price">
            {formatNaira(food.price)}
            {food.oldPrice && <s>{formatNaira(food.oldPrice)}</s>}
          </div>
          <button
            className="add-btn"
            onClick={(event) => {
              event.stopPropagation();
              onAdd(food.id);
            }}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
