import { useState, useEffect } from 'react'

export default function ProjectForm({ initial = { title: '', description: '' }, onSubmit, submitting }) {
  const [title, setTitle] = useState(initial.title)
  const [description, setDescription] = useState(initial.description)

  useEffect(() => {
    setTitle(initial.title)
    setDescription(initial.description)
  }, [initial])

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit({ title: title.trim(), description: description.trim() })
  }

  return (
    <form className="project-form" onSubmit={handleSubmit}>
      <label>
        Title
        <input value={title} onChange={(e) => setTitle(e.target.value)} required />
      </label>
      <label>
        Description
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </label>
      <button type="submit" disabled={submitting}>{submitting ? 'Saving...' : 'Save'}</button>
    </form>
  )
}
