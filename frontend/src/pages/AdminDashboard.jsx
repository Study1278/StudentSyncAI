import { useState, useEffect } from 'react'
import apiClient from '../api/client'
import AdminLayout from '../components/AdminLayout'
import './AdminDashboard.css'

function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

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
      setUsers(usersRes.data.slice(0, 5))
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout title="Overview" subtitle="Platform-wide statistics">
        <div className="loading-state">Loading...</div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Overview" subtitle="Platform-wide statistics">
      <div className="admin-stat-grid">
        <div className="admin-stat-card"><div className="admin-stat-value">{stats.total_users}</div><div className="admin-stat-label">Users</div></div>
        <div className="admin-stat-card"><div className="admin-stat-value">{stats.total_subjects}</div><div className="admin-stat-label">Subjects</div></div>
        <div className="admin-stat-card"><div className="admin-stat-value">{stats.total_assignments}</div><div className="admin-stat-label">Assignments</div></div>
        <div className="admin-stat-card"><div className="admin-stat-value">{stats.total_exams}</div><div className="admin-stat-label">Exams</div></div>
        <div className="admin-stat-card"><div className="admin-stat-value">{stats.total_skills}</div><div className="admin-stat-label">Skills</div></div>
        <div className="admin-stat-card"><div className="admin-stat-value">{stats.total_internships}</div><div className="admin-stat-label">Internships</div></div>
      </div>

      <div className="admin-table-wrap">
        <h3>Recently Joined</h3>
        <table className="admin-table">
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th></tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td><span className={`role-tag ${u.role}`}>{u.role}</span></td>
                <td>{new Date(u.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard