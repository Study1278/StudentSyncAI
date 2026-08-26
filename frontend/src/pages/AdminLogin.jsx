import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme'
import './Login.css'

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  )
}
function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}
function ShieldIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" />
    </svg>
  )
}
function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="11" width="16" height="9" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  )
}

function AdminLoginLogo() {
  return (
    <div className="login-logo">
      <svg className="login-logo-mark" viewBox="0 0 40 40" fill="none">
        <defs>
          <linearGradient id="adminLogoGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--accent-1)" />
            <stop offset="1" stopColor="var(--accent-2)" />
          </linearGradient>
        </defs>
        <circle cx="20" cy="20" r="18" fill="url(#adminLogoGrad)" opacity="0.15" />
        <path d="M20 6l10 5v7c0 6-4.3 10.5-10 12-5.7-1.5-10-6-10-12v-7l10-5z"
          fill="none" stroke="url(#adminLogoGrad)" strokeWidth="2" />
      </svg>
      <div className="login-logo-name">
        StudentSync<span className="gradient-text">AI</span> Admin
      </div>
    </div>
  )
}

function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const loginRes = await axios.post('http://127.0.0.1:8000/users/login', {
        email,
        password
      })

      const token = loginRes.data.access_token

      const meRes = await axios.get('http://127.0.0.1:8000/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (meRes.data.role !== 'admin') {
        setError('This account does not have admin access')
        setLoading(false)
        return
      }

      localStorage.setItem('token', token)
      navigate('/admin/dashboard')
    } catch (err) {
      setError('Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="blob blob-1" />
      <div className="blob blob-2" />

      <button
        className="login-theme-toggle"
        onClick={toggleTheme}
        aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      >
        {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
      </button>

      <div className="login-card">
        <AdminLoginLogo />

        <div style={{ textAlign: 'center' }}>
          <h1 className="login-welcome"><ShieldIcon /> Admin Access</h1>
          <p className="login-subtitle">Restricted area — authorized personnel only</p>
        </div>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit} style={{ marginTop: 24 }}>
          <div className="login-field">
            <ShieldIcon />
            <input
              type="email"
              placeholder="Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="login-field">
            <LockIcon />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-submit" disabled={loading} style={{ marginTop: 6 }}>
            {loading ? 'Verifying...' : <>→ Sign In</>}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminLogin