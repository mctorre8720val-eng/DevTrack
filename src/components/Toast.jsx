import { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const show = useCallback((message, opts = {}) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2,8)}`
    const t = { id, message, ...opts }
    setToasts((s) => [...s, t])
    if (!opts.persistent) setTimeout(() => setToasts((s) => s.filter((x) => x.id !== id)), opts.duration || 3000)
    return id
  }, [])

  const remove = useCallback((id) => setToasts((s) => s.filter((t) => t.id !== id)), [])

  return (
    <ToastContext.Provider value={{ show, remove }}>
      {children}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className="toast">
            {t.message}
            <button className="toast-close" onClick={() => remove(t.id)}>×</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

export default ToastProvider
