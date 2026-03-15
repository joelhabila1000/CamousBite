import FoodCard from "../components/FoodCard.jsx";

export default function MenuPage({
  title,
  subtitle,
  foods,
  categories,
  activeFilter,
  search,
  onSearchChange,
  onSetFilter,
  onNavigate,
  onOpenFood,
  onAddFood,
  onToggleFav,
  onClearRestaurantFilter,
}) {
  return (
    <div className="page active" id="page-menu">
      <section className="section" style={{ paddingTop: 100 }}>
        <div className="section-inner">
          <div className="section-tag">Step 2 of 3</div>
          <h2 className="section-title" id="menuTitle">
            {title}
          </h2>
          <p className="section-sub" id="menuSub" style={{ marginBottom: 24 }}>
            {subtitle}
          </p>

          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", marginBottom: 12 }}>
            <div className="search-bar" style={{ flex: 1, maxWidth: "100%" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search food..."
                id="menuSearch"
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
              />
            </div>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => {
                onClearRestaurantFilter();
                onNavigate("restaurants");
              }}
              style={{ whiteSpace: "nowrap" }}
            >
              ← All Restaurants
            </button>
          </div>
          <div className="filter-row" id="menuFilters">
            {categories.map((cat) => (
              <button
                key={cat.key}
                className={`fchip ${activeFilter === cat.key ? "on" : ""}`}
                onClick={() => onSetFilter(cat.key)}
              >
                {cat.emoji ? `${cat.emoji} ${cat.label}` : cat.label}
              </button>
            ))}
          </div>
          <div style={{ marginTop: 28 }} className="food-grid" id="menuGrid">
            {foods.length ? (
              foods.map((food) => (
                <FoodCard
                  key={food.id}
                  food={food}
                  onOpen={onOpenFood}
                  onAdd={onAddFood}
                  onToggleFav={onToggleFav}
                />
              ))
            ) : (
              <div
                style={{
                  gridColumn: "1/-1",
                  textAlign: "center",
                  padding: 48,
                  color: "var(--text2)",
                }}
              >
                No items found.{" "}
                <a
                  href="#"
                  onClick={(event) => {
                    event.preventDefault();
                    onSetFilter("all");
                  }}
                  style={{ color: "var(--orange)" }}
                >
                  Clear filters
                </a>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
