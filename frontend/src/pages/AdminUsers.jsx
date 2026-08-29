import { useState, useEffect } from 'react'
import apiClient from '../api/client'
import AdminLayout from '../components/AdminLayout'
import './Subjects.css'

function AdminUsers() {
  const [users, setUsers] = useState([])
  const [myId, setMyId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [form, setForm] = useState({ name: '', role: 'user' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [usersRes, meRes] = await Promise.all([
        apiClient.get('/admin/users'),
        apiClient.get('/users/me')
      ])
      setUsers(usersRes.data)
      setMyId(meRes.data.id)
    } finally {
      setLoading(false)
    }
  }

  const openEdit = (user) => {
    setEditingUser(user)
    setForm({ name: user.name, role: user.role })
    setShowModal(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await apiClient.patch(`/admin/users/${editingUser.id}`, form)
      setShowModal(false)
      await loadData()
    } catch (err) {
      alert(err.response?.data?.detail || 'Could not save changes')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (user) => {
    if (!window.confirm(`Delete user "${user.name}"? This will also delete all of their subjects, assignments, skills, and applications.`)) return
    try {
      await apiClient.delete(`/admin/users/${user.id}`)
      await loadData()
    } catch (err) {
      alert(err.response?.data?.detail || 'Could not delete user')
    }
  }

  if (loading) {
    return (
      <AdminLayout title="Users" subtitle="Manage all registered users">
        <div className="loading-state">Loading...</div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Users" subtitle={`${users.length} registered users`}>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th></th></tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>
                  {u.name}
                  {u.id === myId && <span className="role-tag admin" style={{ marginLeft: 8 }}>You</span>}
                </td>
                <td>{u.email}</td>
                <td><span className={`role-tag ${u.role}`}>{u.role}</span></td>
                <td>{new Date(u.created_at).toLocaleDateString()}</td>
                <td style={{ display: 'flex', gap: 8 }}>
                  <button className="icon-action-btn" onClick={() => openEdit(u)}>✎</button>
                  <button
                    className="admin-delete-btn"
                    onClick={() => handleDelete(u)}
                    disabled={u.id === myId}
                    style={u.id === myId ? { opacity: 0.4, cursor: 'not-allowed' } : {}}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>Edit User</h3>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  disabled={editingUser?.id === myId}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                {editingUser?.id === myId && (
                  <p style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: 6 }}>
                    You can't change your own role.
                  </p>
                )}
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-save" disabled={saving}>
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

export default AdminUsers