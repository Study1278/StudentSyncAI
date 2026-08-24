import { useState, useEffect } from 'react'
import apiClient from '../api/client'
import DashboardLayout from '../components/DashboardLayout'
import './Subjects.css'

const STATUS_OPTIONS = ['applied', 'interview', 'selected', 'rejected']

const STATUS_COLORS = {
  applied: 'var(--muted)',
  interview: '#f59e0b',
  selected: '#22c55e',
  rejected: '#ef4444'
}

function Internships() {
  const [user, setUser] = useState(null)
  const [internships, setInternships] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ company_name: '', role: '', status: 'applied' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [userRes, internshipsRes] = await Promise.all([
        apiClient.get('/users/me'),
        apiClient.get('/internships/')
      ])
      setUser(userRes.data)
      setInternships(internshipsRes.data)
    } finally {
      setLoading(false)
    }
  }

  const openAddModal = () => {
    setEditingId(null)
    setForm({ company_name: '', role: '', status: 'applied' })
    setShowModal(true)
  }

  const openEditModal = (internship) => {
    setEditingId(internship.id)
    setForm({
      company_name: internship.company_name,
      role: internship.role,
      status: internship.status
    })
    setShowModal(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      if (editingId) {
        await apiClient.patch(`/internships/${editingId}`, form)
      } else {
        await apiClient.post('/internships/', form)
      }
      setShowModal(false)
      await loadData()
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this internship application?')) return
    await apiClient.delete(`/internships/${id}`)
    await loadData()
  }

  const quickUpdateStatus = async (internship, newStatus) => {
    await apiClient.patch(`/internships/${internship.id}`, { status: newStatus })
    await loadData()
  }

  if (loading) {
    return (
      <DashboardLayout title="Internships" subtitle="Track your applications and their progress" user={user}>
        <div className="loading-state">Loading...</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Internships" subtitle="Track your applications and their progress" user={user}>
      <div className="page-header-row">
        <h2>{internships.length} Application{internships.length !== 1 ? 's' : ''}</h2>
        <button className="btn-add" onClick={openAddModal}>+ Add Application</button>
      </div>

      {internships.length === 0 ? (
        <div className="empty-state">No applications yet. Add one to start tracking.</div>
      ) : (
        <div className="card-grid">
          {internships.map((i) => (
            <div className="item-card" key={i.id}>
              <div className="item-actions">
                <button className="icon-action-btn" onClick={() => openEditModal(i)}>✎</button>
                <button className="icon-action-btn danger" onClick={() => handleDelete(i.id)}>🗑</button>
              </div>
              <h4>{i.company_name}</h4>
              <div className="meta-row">
                <span className="meta-tag">{i.role}</span>
              </div>
              <div className="meta-row">
                <select
                  value={i.status}
                  onChange={(e) => quickUpdateStatus(i, e.target.value)}
                  style={{
                    padding: '5px 10px',
                    borderRadius: 999,
                    border: `1px solid ${STATUS_COLORS[i.status]}`,
                    background: 'var(--bg)',
                    color: STATUS_COLORS[i.status],
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    textTransform: 'capitalize',
                    cursor: 'pointer'
                  }}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s} style={{ textTransform: 'capitalize' }}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>{editingId ? 'Edit Application' : 'Add Application'}</h3>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>Company Name</label>
                <input
                  type="text"
                  value={form.company_name}
                  onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Role</label>
                <input
                  type="text"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s} style={{ textTransform: 'capitalize' }}>{s}</option>
                  ))}
                </select>
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
    </DashboardLayout>
  )
}

export default Internships