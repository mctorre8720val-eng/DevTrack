import { Link } from 'react-router-dom'
import './PageStyles.css'

export default function NotFoundPage() {
  return (
    <main className="page-shell">
      <h1>Page Not Found</h1>
      <p>The route does not exist.</p>
      <Link to="/" className="text-link">
        Return to dashboard
      </Link>
    </main>
  )
}
