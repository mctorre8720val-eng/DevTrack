export default function ProjectCard({ project, onEdit, onDelete }) {
  return (
    <article className="project-card">
      <h3>{project.title}</h3>
      <p>{project.description}</p>
      <div className="project-actions">
        <button onClick={() => onEdit(project)}>Edit</button>
        <button onClick={() => onDelete(project.id)}>Delete</button>
      </div>
    </article>
  )
}
