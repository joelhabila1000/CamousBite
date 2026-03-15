import FoodCard from "../components/FoodCard.jsx";
import RestaurantCard from "../components/RestaurantCard.jsx";
import { HERO_STATS, PROMOS, REVIEWS, RECENT_ORDERS, STEPS } from "../data.js";

export default function LandingPage({
  onNavigate,
  popularFoods,
  restPreview,
  onOpenFood,
  onAddFood,
  onToggleFav,
  onCopyPromo,
  onOpenRestaurant,
}) {
  return (
    <div className="page active" id="page-landing">
      <section className="hero">
        <div className="hero-glow" />
        <div className="hero-dots" />
        <div className="hero-inner">
          <div>
            <div className="hero-pill">🎓 Exclusive for Students & Staff</div>
            <h1>
              Fuel Your <em>Campus</em>
              <br />
              <span className="yl">Life, Delivered.</span>
            </h1>
            <p className="hero-desc">
              Hot meals from your favourite campus restaurants delivered right
              to your dorm, lecture hall, or anywhere on campus and out. Fast,
              Fresh, and Affordable.
            </p>
            <div className="hero-btns">
              <button
                className="btn btn-primary btn-lg"
                onClick={() => onNavigate("restaurants")}
              >
                🍔 Order Now
              </button>
              <button
                className="btn btn-ghost btn-lg"
                onClick={() => onNavigate("menu")}
              >
                🍽️ Browse Menu
              </button>
            </div>
            <div className="hero-stats">
              {HERO_STATS.map((stat) => (
                <div className="stat" key={stat.label}>
                  <h4>{stat.value}</h4>
                  <p>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="hero-card">
            <div className="hc-title">🔥 Recent Campus Orders</div>
            {RECENT_ORDERS.map((order) => (
              <div className="hc-item" key={order.name}>
                <div className="hc-emoji">{order.emoji}</div>
                <div>
                  <div className="hc-name">{order.name}</div>
                  <div className="hc-rest">{order.rest}</div>
                </div>
                <div className="hc-price">{order.price}</div>
              </div>
            ))}
            <div className="hc-total">
              <span>Subtotal</span>
              <span>₦7,800</span>
            </div>
            <div className="hc-status">
              <span className="hc-dot" />
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--bg2)" }}>
        <div className="section-inner">
          <div style={{ textAlign: "center", marginBottom: 0 }}>
            <div className="section-tag" style={{ textAlign: "center" }}>
              How It Works
            </div>
            <h2 className="section-title" style={{ textAlign: "center" }}>
              Order in 4 Simple Steps
            </h2>
          </div>
          <div className="steps-grid">
            {STEPS.map((step) => (
              <div className="step-card" key={step.num}>
                <div className={`step-num ${step.tone}`}>{step.num}</div>
                <h4>{step.title}</h4>
                <p>{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-inner">
          <div className="s-header">
            <div>
              <div className="section-tag">Trending Now</div>
              <h2 className="section-title">Popular on Campus</h2>
              <p className="section-sub">What students are ordering today</p>
            </div>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => onNavigate("menu")}
            >
              View All →
            </button>
          </div>
          <div className="food-grid" id="popularGrid">
            {popularFoods.map((food) => (
              <FoodCard
                key={food.id}
                food={food}
                onOpen={onOpenFood}
                onAdd={onAddFood}
                onToggleFav={onToggleFav}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--bg2)" }}>
        <div className="section-inner">
          <div className="s-header">
            <div>
              <div className="section-tag">Deals & Offers</div>
              <h2 className="section-title">Today's Hot Deals</h2>
            </div>
          </div>
          <div className="promo-grid">
            {PROMOS.map((promo) => (
              <div
                key={promo.code}
                className={`promo-card ${promo.tone}`}
                onClick={() => onCopyPromo(promo.code)}
              >
                <div className="promo-label">{promo.label}</div>
                <h3>{promo.title}</h3>
                <p>{promo.text}</p>
                <span className="promo-code">{promo.code}</span>
                <div className="promo-bg">{promo.emoji}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-inner">
          <div className="s-header">
            <div>
              <div className="section-tag">Campus Vendors</div>
              <h2 className="section-title">Our Partner Restaurants</h2>
            </div>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => onNavigate("restaurants")}
            >
              See All →
            </button>
          </div>
          <div className="rest-grid" id="restPreview">
            {restPreview.map((rest) => (
              <RestaurantCard
                key={rest.name}
                rest={rest}
                onOpen={onOpenRestaurant}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--bg2)" }}>
        <div className="section-inner">
          <div className="s-header">
            <div>
              <div className="section-tag">Testimonials</div>
              <h2 className="section-title">What Students Say</h2>
            </div>
          </div>
          <div className="rev-grid">
            {REVIEWS.map((review) => (
              <div className="rev-card" key={review.name}>
                <div className="rev-stars">{review.stars}</div>
                <p className="rev-text">"{review.text}"</p>
                <div className="reviewer">
                  <div
                    className="rev-avatar"
                    style={{ background: review.tone }}
                  >
                    {review.avatar}
                  </div>
                  <div>
                    <div className="rev-name">{review.name}</div>
                    <div className="rev-role">{review.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
