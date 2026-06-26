import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth.jsx'
import { getSharesByProject, revokeShareById } from '../services/shareService'

export default function ShareManagerModal({ open, onClose, projectId, onRevoked }) {
  const { user } = useAuth()
  const [shares, setShares] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open || !projectId) return
    let mounted = true
    setLoading(true)
    getSharesByProject(projectId)
      .then((s) => mounted && setShares(s))
      .catch((e) => mounted && setError(e && e.message ? e.message : String(e)))
      .finally(() => mounted && setLoading(false))
    return () => (mounted = false)
  }, [open, projectId])

  if (!open) return null

  async function handleRevoke(id) {
    try {
      await revokeShareById(id)
      setShares((s) => s.filter((x) => x.id !== id))
      onRevoked && onRevoked()
    } catch (err) {
      setError(err && err.message ? err.message : String(err))
    }
  }

  return (
    <div className="share-modal-overlay">
      <div className="share-modal">
        <h3>Manage Shares</h3>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <div className="error">{error}</div>
        ) : shares.length === 0 ? (
          <p>No shares for this project.</p>
        ) : (
          <ul className="share-list">
            {shares.map((s) => (
              <li key={s.id}>
                <strong>{s.uid}</strong> — {s.role}
                <button className="danger" onClick={() => handleRevoke(s.id)}>Revoke</button>
              </li>
            ))}
          </ul>
        )}
        <div style={{ textAlign: 'right', marginTop: 12 }}>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}
