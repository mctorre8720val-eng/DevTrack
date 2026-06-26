import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth.jsx'
import { createProject, getProjectsByOwner, updateProject, deleteProject, subscribeProjectsByOwner } from '../services/projectService'
import ShareModal from '../components/ShareModal'
import ShareManagerModal from '../components/ShareManagerModal'
import ProjectCard from '../components/ProjectCard'
import ProjectForm from '../components/ProjectForm'
import './PageStyles.css'

export default function ProjectsPage() {
  const { user } = useAuth()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [shareOpen, setShareOpen] = useState(false)
  const [shareProjectId, setShareProjectId] = useState(null)
  const [manageOpen, setManageOpen] = useState(false)
  const [manageProjectId, setManageProjectId] = useState(null)

  useEffect(() => {
    let unsub
    if (!user) return
    setLoading(true)
    try {
      unsub = subscribeProjectsByOwner(user.uid, (items) => {
        setProjects(items)
        setLoading(false)
      })
    } catch (err) {
      console.error('Failed to subscribe to projects', err)
      setLoading(false)
    }
    return () => unsub && unsub()
  }, [user])

  async function handleCreate(data) {
    setSubmitting(true)
    try {
      await createProject({ ...data, ownerId: user.uid, createdAt: Date.now() })
      setMessage('Project created')
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      console.error(err)
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
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this project?')) return
    try {
      await deleteProject(id)
      setProjects((p) => p.filter((x) => x.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <main className="page-shell">
      <h1>Projects</h1>

      {message && <div className="toast">{message}</div>}

      <section>
        <h2>Create Project</h2>
        <ProjectForm onSubmit={editing ? (data) => handleUpdate(editing.id, data) : handleCreate} submitting={submitting} initial={editing ?? { title: '', description: '' }} />
      </section>

      <section>
        <h2>Your Projects</h2>
        {loading ? (
          <p>Loading...</p>
        ) : projects.length === 0 ? (
          <p>No projects yet.</p>
        ) : (
          <div className="projects-list">
            {projects.map((project) => (
              <div key={project.id} className="project-row">
                <ProjectCard project={project} onEdit={(p) => setEditing(p)} onDelete={handleDelete} />
                <div className="project-actions">
                  <button onClick={() => { setShareProjectId(project.id); setShareOpen(true) }}>Share</button>
                  <button onClick={() => { setManageProjectId(project.id); setManageOpen(true) }}>Manage</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <ShareModal open={shareOpen} onClose={() => setShareOpen(false)} projectId={shareProjectId} onShared={() => setMessage('Project shared')} />
      <ShareManagerModal open={manageOpen} onClose={() => setManageOpen(false)} projectId={manageProjectId} onRevoked={() => setMessage('Share revoked')} />
    </main>
  )
}
