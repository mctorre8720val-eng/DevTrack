import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth.jsx'
import { createProject, getProjectsByOwner, updateProject, deleteProject } from '../services/projectService'
import ProjectCard from '../components/ProjectCard'
import ProjectForm from '../components/ProjectForm'
import './PageStyles.css'

export default function ProjectsPage() {
  const { user } = useAuth()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      try {
        const items = await getProjectsByOwner(user.uid)
        if (mounted) setProjects(items)
      } catch (err) {
        console.error('Failed to load projects', err)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    if (user) load()
    return () => (mounted = false)
  }, [user])

  async function handleCreate(data) {
    setSubmitting(true)
    try {
      await createProject({ ...data, ownerId: user.uid, createdAt: Date.now() })
      const items = await getProjectsByOwner(user.uid)
      setProjects(items)
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
              <ProjectCard key={project.id} project={project} onEdit={(p) => setEditing(p)} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
