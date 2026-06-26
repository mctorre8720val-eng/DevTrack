import { TASK_STATUS } from '../services/taskService'

export default function TaskItem({ task, onToggle, onEdit, onDelete, toggling }) {
  const completed = task.status === TASK_STATUS.COMPLETED

  return (
    <article className={`task-item${completed ? ' task-item--completed' : ''}`}>
      <label className="task-item__check">
        <input
          type="checkbox"
          checked={completed}
          disabled={toggling}
          onChange={() => onToggle(task)}
        />
        <span className="task-item__title">{task.title}</span>
      </label>
      <div className="task-item__actions">
        <button type="button" className="secondary" onClick={() => onEdit(task)}>
          Edit
        </button>
        <button type="button" className="danger" onClick={() => onDelete(task.id)}>
          Delete
        </button>
      </div>
    </article>
  )
}
