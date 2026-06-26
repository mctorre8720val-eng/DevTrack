import { useState } from 'react'
import { useAuth } from '../hooks/useAuth.jsx'
import * as shareService from '../services/shareService'

export default function ShareModal({ open, onClose, projectId, onShared }) {
  const { user } = useAuth()
  const [targetUid, setTargetUid] = useState('')
  const [role, setRole] = useState('viewer')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (!open) return null

  async function submit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      await shareService.shareProject(projectId, user.uid, targetUid, role)
      setTargetUid('')
      setRole('viewer')
      onShared && onShared()
      onClose()
    } catch (err) {
      setError(err && err.message ? err.message : String(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="share-modal-overlay">
      <div className="share-modal">
        <h3>Share project</h3>
        <form onSubmit={submit}>
          <label>
            Target user UID
            <input value={targetUid} onChange={(e) => setTargetUid(e.target.value)} required />
          </label>
          <label>
            Role
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="viewer">Viewer</option>
              <option value="editor">Editor</option>
            </select>
          </label>
          {error && <div className="error">{error}</div>}
          <div className="actions">
            <button type="button" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" disabled={submitting}>{submitting ? 'Sharing...' : 'Share'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
