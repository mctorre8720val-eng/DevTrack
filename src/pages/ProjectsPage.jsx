import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'
import { useToast } from '../components/Toast.jsx'
import {
  createProject,
  getProjectsByOwner,
  updateProject,
  deleteProject,
  subscribeProjectsByOwner,
} from '../services/projectService'
import ShareModal from '../components/ShareModal'
import ShareManagerModal from '../components/ShareManagerModal'
import ProjectCard from '../components/ProjectCard'
import ProjectForm from '../components/ProjectForm'
import AppNav from '../components/AppNav'
import './PageStyles.css'

export default function ProjectsPage() {
  const { user } = useAuth()
  const { show } = useToast()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [shareOpen, setShareOpen] = useState(false)
  const [shareProjectId, setShareProjectId] = useState(null)
  const [manageOpen, setManageOpen] = useState(false)
  const [manageProjectId, setManageProjectId] = useState(null)

  useEffect(() => {
    let unsub
    if (!user) return
    setLoading(true)
    setError('')
    try {
      unsub = subscribeProjectsByOwner(
        user.uid,
        (items) => {
          setProjects(items)
          setLoading(false)
        },
        () => {
          setError('Failed to load projects.')
          setLoading(false)
        },
      )
    } catch (err) {
      console.error('Failed to subscribe to projects', err)
      setError('Failed to load projects.')
      setLoading(false)
    }
    return () => unsub && unsub()
  }, [user])

  async function handleCreate(data) {
    setSubmitting(true)
    try {
      await createProject({ ...data, ownerId: user.uid, createdAt: Date.now() })
      show('Project created')
    } catch (err) {
      console.error(err)
      show('Could not create project', { persistent: true })
    } finally {
      setSubmitting(false)
    }
  }

  async function handleUpdate(id, data) {
    setSubmitting(true)
    try {
      await updateProject(id, data)
      const items = await getProjectsByOwner(user.uid)
      setProjects(items)
      setEditing(null)
      show('Project updated')
    } catch (err) {
      console.error(err)
      show('Could not update project', { persistent: true })
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this project?')) return
    try {
      await deleteProject(id)
      setProjects((p) => p.filter((x) => x.id !== id))
      show('Project deleted')
    } catch (err) {
      console.error(err)
      show('Could not delete project', { persistent: true })
    }
  }

  return (
    <div className="app-layout">
      <AppNav />
      <main className="app-page">
        <header className="page-header">
          <div>
            <h1>Projects</h1>
            <p className="page-description">Create and manage your projects.</p>
          </div>
        </header>

        {error && <p className="form-error">{error}</p>}

        <section className="page-section">
          <h2>{editing ? 'Edit Project' : 'Create Project'}</h2>
          <ProjectForm
            onSubmit={editing ? (data) => handleUpdate(editing.id, data) : handleCreate}
            submitting={submitting}
            initial={editing ?? { title: '', description: '' }}
          />
          {editing && (
            <button type="button" className="secondary cancel-button" onClick={() => setEditing(null)}>
              Cancel edit
            </button>
          )}
        </section>

        <section className="page-section">
          <h2>Your Projects</h2>
          {loading ? (
            <p className="loading-state">Loading projects...</p>
          ) : projects.length === 0 ? (
            <div className="empty-state">
              <p>No projects yet. Create one above to get started.</p>
            </div>
          ) : (
            <div className="projects-list">
              {projects.map((project) => (
                <div key={project.id} className="project-row">
                  <ProjectCard project={project} onEdit={(p) => setEditing(p)} onDelete={handleDelete} />
                  <div className="project-actions">
                    <Link to={`/projects/${project.id}/tasks`} className="text-link">
                      Tasks
                    </Link>
                    <button type="button" onClick={() => { setShareProjectId(project.id); setShareOpen(true) }}>
                      Share
                    </button>
                    <button type="button" onClick={() => { setManageProjectId(project.id); setManageOpen(true) }}>
                      Manage
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <ShareModal
          open={shareOpen}
          onClose={() => setShareOpen(false)}
          projectId={shareProjectId}
          onShared={() => show('Project shared')}
        />
        <ShareManagerModal
          open={manageOpen}
          onClose={() => setManageOpen(false)}
          projectId={manageProjectId}
          onRevoked={() => show('Share revoked')}
        />
      </main>
    </div>
  )
}
