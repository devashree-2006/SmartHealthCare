
function StatCard({ title, value, icon, color }) {
  return (
    <div className={`stat-card ${color}`}>
      <div className="stat-card-info">
        <p>{title}</p>
        <h2>{value}</h2>
        <span className="stat-card-caption">Hospital overview</span>
      </div>

      <div className="stat-card-icon">{icon}</div>
    </div>
  );
}

export default StatCard;
