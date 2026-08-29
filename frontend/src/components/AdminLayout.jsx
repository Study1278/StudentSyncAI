import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import apiClient from '../api/client'
import { useTheme } from '../hooks/useTheme'
import '../pages/AdminDashboard.css'

function SunIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  )
}
function MoonIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}
function LogoutIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17l5-5-5-5" /><path d="M21 12H9" />
    </svg>
  )
}

const NAV_ITEMS = [
  { path: '/admin/dashboard', label: '📊 Overview' },
  { path: '/admin/users', label: '👥 Users' },
  { path: '/admin/subjects', label: '📚 Subjects' },
  { path: '/admin/assignments', label: '📝 Assignments' },
  { path: '/admin/exams', label: '📅 Exams' },
  { path: '/admin/skills', label: '🎯 Skills' },
  { path: '/admin/internships', label: '💼 Internships' },
  { path: '/admin/profile', label: '⚙️ My Profile' },
]

function AdminLayout({ title, subtitle, children }) {
  const [admin, setAdmin] = useState(null)
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    apiClient.get('/users/me').then((res) => setAdmin(res.data))
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    sessionStorage.removeItem('token')
    navigate('/admin')
  }

  const initials = admin ? admin.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : '..'

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          StudentSync<span className="gradient-text">AI</span>
          <span className="admin-badge">ADMIN</span>
        </div>
        <nav className="admin-nav">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`admin-nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <button className="admin-nav-item" onClick={handleLogout}>
            <LogoutIcon /> Logout
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-topbar">
          <div>
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <button className="admin-icon-btn" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>
            <Link to="/admin/profile" className="admin-avatar">
              {admin?.avatar_url ? (
                <img src={admin.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                initials
              )}
            </Link>
          </div>
        </div>
        <div className="admin-content">{children}</div>
      </main>
    </div>
  )
}

export default AdminLayout