import { useState, useEffect } from 'react'

export default function TaskForm({ initial = { title: '' }, onSubmit, submitting, submitLabel = 'Save' }) {
  const [title, setTitle] = useState(initial.title)

  useEffect(() => {
    setTitle(initial.title)
  }, [initial])

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return
    onSubmit({ title: trimmed })
    if (!initial.title) setTitle('')
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <label>
        Task title
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          required
        />
      </label>
      <button type="submit" disabled={submitting}>
        {submitting ? 'Saving...' : submitLabel}
      </button>
    </form>
  )
}
