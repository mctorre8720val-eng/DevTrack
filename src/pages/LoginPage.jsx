import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../services/authService'
import './PageStyles.css'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await loginUser(email, password)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Unable to login. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="page-shell">
      <div className="auth-card">
        <h1>Welcome back</h1>
        <p>Sign in to continue managing your projects and tasks.</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              required
            />
          </label>
          {error && <p className="form-error">{error}</p>}
          <button type="submit" disabled={submitting}>
            {submitting ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="auth-footer">
          Need an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </main>
  )
}
