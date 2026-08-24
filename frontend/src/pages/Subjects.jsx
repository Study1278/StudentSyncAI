import { useState, useEffect } from 'react'
import apiClient from '../api/client'
import DashboardLayout from '../components/DashboardLayout'
import './Subjects.css'

function Subjects() {
  const [user, setUser] = useState(null)
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ name: '', code: '', credits: '', faculty_name: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [userRes, subjectsRes] = await Promise.all([
        apiClient.get('/users/me'),
        apiClient.get('/subjects/')
      ])
      setUser(userRes.data)
      setSubjects(subjectsRes.data)
    } finally {
      setLoading(false)
    }
  }

  const openAddModal = () => {
    setEditingId(null)
    setForm({ name: '', code: '', credits: '', faculty_name: '' })
    setShowModal(true)
  }

  const openEditModal = (subject) => {
    setEditingId(subject.id)
    setForm({
      name: subject.name,
      code: subject.code || '',
      credits: subject.credits || '',
      faculty_name: subject.faculty_name || ''
    })
    setShowModal(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)

    const payload = {
      name: form.name,
      code: form.code || null,
      credits: form.credits ? parseInt(form.credits) : null,
      faculty_name: form.faculty_name || null
    }

    try {
      if (editingId) {
        await apiClient.patch(`/subjects/${editingId}`, payload)
      } else {
        await apiClient.post('/subjects/', payload)
      }
      setShowModal(false)
      await loadData()
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this subject? Its assignments and exams will be deleted too.')) return
    await apiClient.delete(`/subjects/${id}`)
    await loadData()
  }

  if (loading) {
    return (
      <DashboardLayout title="Subjects" subtitle="Manage your enrolled subjects" user={user}>
        <div className="loading-state">Loading...</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Subjects" subtitle="Manage your enrolled subjects" user={user}>
      <div className="page-header-row">
        <h2>{subjects.length} Subject{subjects.length !== 1 ? 's' : ''}</h2>
        <button className="btn-add" onClick={openAddModal}>+ Add Subject</button>
      </div>

      {subjects.length === 0 ? (
        <div className="empty-state">No subjects yet. Add your first one to get started.</div>
      ) : (
        <div className="card-grid">
          {subjects.map((s) => (
            <div className="item-card" key={s.id}>
              <div className="item-actions">
                <button className="icon-action-btn" onClick={() => openEditModal(s)}>✎</button>
                <button className="icon-action-btn danger" onClick={() => handleDelete(s.id)}>🗑</button>
              </div>
              <h4>{s.name}</h4>
              <div className="meta-row">
                {s.code && <span className="meta-tag">{s.code}</span>}
                {s.credits && <span className="meta-tag">{s.credits} credits</span>}
                {s.faculty_name && <span className="meta-tag">{s.faculty_name}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>{editingId ? 'Edit Subject' : 'Add Subject'}</h3>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>Subject Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Code (optional)</label>
                <input
                  type="text"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Credits (optional)</label>
                <input
                  type="number"
                  value={form.credits}
                  onChange={(e) => setForm({ ...form, credits: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Faculty Name (optional)</label>
                <input
                  type="text"
                  value={form.faculty_name}
                  onChange={(e) => setForm({ ...form, faculty_name: e.target.value })}
                />
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

export default Subjects