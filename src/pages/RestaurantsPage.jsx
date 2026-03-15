import RestaurantCard from "../components/RestaurantCard.jsx";

export default function RestaurantsPage({ rests, onOpenRestaurant }) {
  return (
    <div className="page active" id="page-restaurants">
      <section className="section" style={{ paddingTop: 100 }}>
        <div className="section-inner">
          <div className="section-tag">Step 1 of 3</div>
          <h2 className="section-title">Choose a Restaurant</h2>
          <p className="section-sub" style={{ marginBottom: 36 }}>
            Pick your favourite campus spot to start ordering
          </p>
          <div className="rest-grid" id="restGrid">
            {rests.map((rest) => (
              <RestaurantCard key={rest.name} rest={rest} onOpen={onOpenRestaurant} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
