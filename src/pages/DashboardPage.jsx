import { useAuth } from '../hooks/useAuth.jsx'
import { Link } from 'react-router-dom'
import DashboardCard from '../components/DashboardCard'
import { useEffect, useState } from 'react'
import { getProjectsByOwner } from '../services/projectService'
import './PageStyles.css'

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const [projectsCount, setProjectsCount] = useState(0)

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const items = await getProjectsByOwner(user.uid)
        if (mounted) setProjectsCount(items.length)
      } catch (err) {
        console.error('Failed to load projects count', err)
      }
    }
    if (user) load()
    return () => (mounted = false)
  }, [user])

  return (
    <main className="dashboard-shell">
      <section className="dashboard-header">
        <div>
          <p className="dashboard-subtitle">Welcome back</p>
          <h1 className="dashboard-title">{user?.email ?? 'DevTrack user'}</h1>
          <p className="dashboard-description">
            Your productivity dashboard is ready. Start tracking your projects and tasks.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/projects" className="logout-button">Projects</Link>
          <button className="logout-button" type="button" onClick={logout}>
            Logout
          </button>
        </div>
      </section>

      <section className="dashboard-grid">
        <DashboardCard
          title="Projects"
          value={projectsCount}
          description={projectsCount === 0 ? 'No projects yet. Add your first project to begin tracking.' : `${projectsCount} project(s)`}
        />
        <DashboardCard
          title="Tasks"
          value="0"
          description="No tasks yet. Create tasks inside a project to stay organized."
        />
        <DashboardCard
          title="Active Users"
          value="1"
          description="Your current session is active and secure."
        />
      </section>
    </main>
  )
}
