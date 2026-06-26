import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'
import { IconDashboard, IconLogout, IconMenu, IconProjects } from './icons'

const links = [
  { to: '/', label: 'Dashboard', icon: IconDashboard, exact: true },
  { to: '/projects', label: 'Projects', icon: IconProjects, exact: false },
]

function isActive(pathname, link) {
  if (link.exact) return pathname === link.to
  return pathname === link.to || pathname.startsWith(`${link.to}/`)
}

export default function AppNav() {
  const { logout, user } = useAuth()
  const location = useLocation()
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        className="sidebar-toggle"
        aria-label="Toggle navigation"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <IconMenu />
      </button>

      <aside className={`app-sidebar${open ? ' app-sidebar--open' : ''}`}>
        <div className="app-sidebar__brand">
          <Link to="/" onClick={() => setOpen(false)}>
            <span className="app-sidebar__logo">DT</span>
            <span>DevTrack</span>
          </Link>
        </div>

        <nav className="app-sidebar__nav" aria-label="Main navigation">
          {links.map((link) => {
            const Icon = link.icon
            const active = isActive(location.pathname, link)
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`app-sidebar__link${active ? ' app-sidebar__link--active' : ''}`}
                onClick={() => setOpen(false)}
              >
                <Icon className="app-sidebar__icon" />
                <span>{link.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="app-sidebar__footer">
          <p className="app-sidebar__user">{user?.email}</p>
          <button type="button" className="app-sidebar__logout" onClick={logout}>
            <IconLogout className="app-sidebar__icon" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {open && <button type="button" className="sidebar-backdrop" aria-label="Close navigation" onClick={() => setOpen(false)} />}
    </>
  )
}
