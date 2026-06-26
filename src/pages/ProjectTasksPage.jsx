import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'
import { useToast } from '../components/Toast.jsx'
import { getProject } from '../services/projectService'
import {
  createTask,
  subscribeTasksByProject,
  updateTask,
  deleteTask,
  toggleTaskComplete,
} from '../services/taskService'
import TaskForm from '../components/TaskForm'
import TaskItem from '../components/TaskItem'
import AppNav from '../components/AppNav'
import './PageStyles.css'

export default function ProjectTasksPage() {
  const { projectId } = useParams()
  const { user } = useAuth()
  const { show } = useToast()
  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [projectLoading, setProjectLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [togglingId, setTogglingId] = useState(null)
  const [editing, setEditing] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    async function loadProject() {
      setProjectLoading(true)
      setError('')
      try {
        const data = await getProject(projectId)
        if (!mounted) return
        if (!data || data.ownerId !== user.uid) {
          setError('Project not found or you do not have access.')
          setProject(null)
        } else {
          setProject(data)
        }
      } catch (err) {
        console.error(err)
        if (mounted) setError('Failed to load project.')
      } finally {
        if (mounted) setProjectLoading(false)
      }
    }
    if (user && projectId) loadProject()
    return () => {
      mounted = false
    }
  }, [user, projectId])

  useEffect(() => {
    if (!project) return
    setLoading(true)
    const unsub = subscribeTasksByProject(
      projectId,
      (items) => {
        setTasks(items)
        setLoading(false)
      },
      () => {
        setError('Failed to load tasks.')
        setLoading(false)
      },
    )
    return () => unsub()
  }, [project, projectId])

  async function handleCreate(data) {
    setSubmitting(true)
    try {
      await createTask({ ...data, projectId })
      show('Task created')
    } catch (err) {
      console.error(err)
      show('Could not create task', { persistent: true })
    } finally {
      setSubmitting(false)
    }
  }

  async function handleUpdate(id, data) {
    setSubmitting(true)
    try {
      await updateTask(id, { ...data, updatedAt: Date.now() })
      setEditing(null)
      show('Task updated')
    } catch (err) {
      console.error(err)
      show('Could not update task', { persistent: true })
    } finally {
      setSubmitting(false)
    }
  }

  async function handleToggle(task) {
    setTogglingId(task.id)
    try {
      await toggleTaskComplete(task.id, task.status)
    } catch (err) {
      console.error(err)
      show('Could not update task status', { persistent: true })
    } finally {
      setTogglingId(null)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this task?')) return
    try {
      await deleteTask(id)
      show('Task deleted')
    } catch (err) {
      console.error(err)
      show('Could not delete task', { persistent: true })
    }
  }

  const completedCount = tasks.filter((t) => t.status === 'completed').length

  if (projectLoading) {
    return (
      <div className="app-layout">
        <AppNav />
        <main className="app-page">
          <p className="loading-state">Loading project...</p>
        </main>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="app-layout">
        <AppNav />
        <main className="app-page">
          <div className="empty-state">
            <p>{error || 'Project not found.'}</p>
            <Link to="/projects" className="text-link">
              Back to projects
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="app-layout">
      <AppNav />
      <main className="app-page">
        <header className="page-header">
          <div>
            <p className="page-eyebrow">
              <Link to="/projects" className="text-link">
                Projects
              </Link>{' '}
              / Tasks
            </p>
            <h1>{project.title}</h1>
            <p className="page-description">{project.description || 'Manage tasks for this project.'}</p>
          </div>
          <p className="task-summary">
            {completedCount} of {tasks.length} completed
          </p>
        </header>

        <section className="page-section">
          <h2>{editing ? 'Edit Task' : 'Add Task'}</h2>
          <TaskForm
            initial={editing ?? { title: '' }}
            onSubmit={editing ? (data) => handleUpdate(editing.id, data) : handleCreate}
            submitting={submitting}
            submitLabel={editing ? 'Update task' : 'Add task'}
          />
          {editing && (
            <button type="button" className="secondary cancel-button" onClick={() => setEditing(null)}>
              Cancel edit
            </button>
          )}
        </section>

        <section className="page-section">
          <h2>Tasks</h2>
          {loading ? (
            <p className="loading-state">Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <div className="empty-state">
              <p>No tasks yet. Add your first task above.</p>
            </div>
          ) : (
            <ul className="task-list">
              {tasks.map((task) => (
                <li key={task.id}>
                  <TaskItem
                    task={task}
                    onToggle={handleToggle}
                    onEdit={setEditing}
                    onDelete={handleDelete}
                    toggling={togglingId === task.id}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  )
}
