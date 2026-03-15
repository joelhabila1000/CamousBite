export default function RestaurantCard({ rest, onOpen }) {
  return (
    <div className="rest-card" onClick={() => onOpen(rest.name)}>
      <div className="rest-banner" style={{ background: rest.banner }}>
        {rest.emoji}
        <div className="rest-logo">{rest.emoji}</div>
      </div>
      <div className="rest-body">
        <div style={{ display: "flex", alignItems: "start", justifyContent: "space-between", gap: 8 }}>
          <div className="rest-name">{rest.name}</div>
          <span className={`rest-open ${rest.open ? "y" : "n"}`}>
            {rest.open ? "Open" : "Closed"}
          </span>
        </div>
        <div className="rest-tags">
          {rest.tags.map((tag) => (
            <span key={tag} className="rest-tag">
              {tag}
            </span>
          ))}
        </div>
        <div className="rest-row">
          <span className="rat">⭐ {rest.rating}</span>
          <span>🕐 {rest.time}</span>
          <span>📦 {rest.orders}</span>
        </div>
      </div>
    </div>
  );
}
