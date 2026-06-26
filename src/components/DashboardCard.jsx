export default function DashboardCard({ title, value, description, accent = false, children }) {
  return (
    <article className={`dashboard-card${accent ? ' dashboard-card--accent' : ''}`}>
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
