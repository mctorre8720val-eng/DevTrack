export default function ProjectCard({ project, onEdit, onDelete }) {
  return (
    <article className="project-card">
      <h3>{project.title}</h3>
      <p>{project.description || 'No description provided.'}</p>
      <div className="project-card__actions">
        <button type="button" className="secondary" onClick={() => onEdit(project)}>
          Edit
        </button>
        <button type="button" className="danger" onClick={() => onDelete(project.id)}>
          Delete
        </button>
      </div>
    </article>
  )
}
