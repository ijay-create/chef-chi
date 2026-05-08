const StatsCards = ({ bookings }) => {
  const total = bookings.length;
  const pending = bookings.filter(b => b.status === "pending").length;
  const confirmed = bookings.filter(b => b.status === "confirmed").length;

  return (
    <div className="stats-grid">
      <div className="stat-card">Total: {total}</div>
      <div className="stat-card">Pending: {pending}</div>
      <div className="stat-card">Confirmed: {confirmed}</div>
    </div>
  );
};

export default StatsCards;