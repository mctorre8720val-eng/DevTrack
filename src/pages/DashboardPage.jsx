import { useAuth } from '../hooks/useAuth.jsx'
import { Link } from 'react-router-dom'
import DashboardCard from '../components/DashboardCard'
import AppLayout from '../components/AppLayout'
import { useEffect, useState } from 'react'
import { getProjectsByOwner } from '../services/projectService'
import { getTaskStatsForOwner } from '../services/taskService'
import './PageStyles.css'

export default function DashboardPage() {
  const { user } = useAuth()
  const [projectsCount, setProjectsCount] = useState(0)
  const [taskStats, setTaskStats] = useState({ total: 0, completed: 0, pending: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      setError('')
      try {
        const [projects, stats] = await Promise.all([
          getProjectsByOwner(user.uid),
          getTaskStatsForOwner(user.uid),
        ])
        if (!mounted) return
        setProjectsCount(projects.length)
        setTaskStats(stats)
      } catch (err) {
        console.error('Failed to load dashboard', err)
        if (mounted) setError('Could not load dashboard data.')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    if (user) load()
    return () => {
      mounted = false
    }
  }, [user])

  const completion =
    taskStats.total === 0 ? '0%' : `${Math.round((taskStats.completed / taskStats.total) * 100)}%`

  return (
    <AppLayout>
      <main className="app-page dashboard-shell">
        <section className="dashboard-header">
          <div>
            <p className="dashboard-subtitle">Welcome back</p>
            <h1 className="dashboard-title">{user?.email ?? 'DevTrack user'}</h1>
            <p className="dashboard-description">
              Track projects and tasks with a clear overview of your progress.
            </p>
          </div>
          <Link to="/projects" className="primary-link">
            View projects
          </Link>
        </section>

        {error && <p className="form-error">{error}</p>}

        {loading ? (
          <p className="loading-state">Loading dashboard</p>
        ) : (
          <section className="dashboard-grid">
            <DashboardCard
              title="Projects"
              value={projectsCount}
              description={
                projectsCount === 0
                  ? 'No projects yet. Add your first project to begin tracking.'
                  : `${projectsCount} project(s) in your workspace`
              }
            />
            <DashboardCard
              title="Tasks"
              value={taskStats.total}
              accent
              description={
                taskStats.total === 0
                  ? 'No tasks yet. Create tasks inside a project to stay organized.'
                  : `${taskStats.completed} completed, ${taskStats.pending} pending`
              }
            />
            <DashboardCard
              title="Completion"
              value={completion}
              description="Share of tasks marked complete across all projects."
            />
          </section>
        )}
      </main>
    </AppLayout>
  )
}
