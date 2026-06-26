import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'

export default function AppNav() {
  const { logout } = useAuth()
  const location = useLocation()

  const links = [
    { to: '/', label: 'Dashboard' },
    { to: '/projects', label: 'Projects' },
  ]

  return (
    <header className="app-nav">
      <div className="app-nav__brand">
        <Link to="/">DevTrack</Link>
      </div>
      <nav className="app-nav__links">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={location.pathname === link.to ? 'active' : undefined}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <button type="button" className="app-nav__logout" onClick={logout}>
        Logout
      </button>
    </header>
  )
}
