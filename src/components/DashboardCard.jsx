export default function DashboardCard({ title, value, description, children }) {
  return (
    <article className="dashboard-card">
      <div className="card-header">
        <div>
          <p className="card-title">{title}</p>
          <p className="card-value">{value}</p>
        </div>
      </div>
      {description && <p className="card-description">{description}</p>}
      {children}
    </article>
  )
}
