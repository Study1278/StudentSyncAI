import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../api/client'
import { useTheme } from '../hooks/useTheme'
import './AdminDashboard.css'

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

function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        apiClient.get('/admin/stats'),
        apiClient.get('/admin/users')
      ])
      setStats(statsRes.data)
      setUsers(usersRes.data)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (userId, name) => {
    if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return
    try {
      await apiClient.delete(`/admin/users/${userId}`)
      await loadData()
    } catch (err) {
      alert(err.response?.data?.detail || 'Could not delete user')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    sessionStorage.removeItem('token')
    navigate('/admin')
  }

  if (loading) {
    return (
      <div className="admin-page">
        <div style={{ padding: 60, textAlign: 'center', color: 'var(--muted)' }}>Loading admin data...</div>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <div className="admin-topbar">
        <div className="admin-logo">
          StudentSync<span className="gradient-text">AI</span>
          <span className="admin-badge">ADMIN</span>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button className="admin-logout-btn" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
          <button className="admin-logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="admin-content">
        <div className="admin-stat-grid">
          <div className="admin-stat-card">
            <div className="admin-stat-value">{stats.total_users}</div>
            <div className="admin-stat-label">Users</div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-value">{stats.total_subjects}</div>
            <div className="admin-stat-label">Subjects</div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-value">{stats.total_assignments}</div>
            <div className="admin-stat-label">Assignments</div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-value">{stats.total_exams}</div>
            <div className="admin-stat-label">Exams</div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-value">{stats.total_skills}</div>
            <div className="admin-stat-label">Skills</div>
          </div>
          <div className="admin-stat-card">
            <div className="admin-stat-value">{stats.total_internships}</div>
            <div className="admin-stat-label">Internships</div>
          </div>
        </div>

        <div className="admin-table-wrap">
          <h3>All Users ({users.length})</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td><span className={`role-tag ${u.role}`}>{u.role}</span></td>
                  <td>{new Date(u.created_at).toLocaleDateString()}</td>
                  <td>
                    <button className="admin-delete-btn" onClick={() => handleDeleteUser(u.id, u.name)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard