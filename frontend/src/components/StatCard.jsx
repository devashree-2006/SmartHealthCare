
function StatCard({ title, value, icon, color }) {
  return (
    <div className={`stat-card ${color}`}>
      <div className="stat-card-info">
        <p>{title}</p>
        <h2>{value}</h2>
        <span className="stat-card-caption">
          CareSync Hospital Overview
        </span>
      </div>

      <div className="stat-card-icon" aria-hidden="true">
        {icon}
      </div>
    </div>
  );
}

export default StatCard;
