import { useState, useEffect } from 'react'
import apiClient from '../api/client'
import DashboardLayout from '../components/DashboardLayout'
import './Subjects.css'

function Assignments() {
  const [user, setUser] = useState(null)
  const [subjects, setSubjects] = useState([])
  const [assignments, setAssignments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ subject_id: '', title: '', description: '', due_date: '', status: 'pending' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [userRes, subjectsRes, assignmentsRes] = await Promise.all([
        apiClient.get('/users/me'),
        apiClient.get('/subjects/'),
        apiClient.get('/assignments/')
      ])
      setUser(userRes.data)
      setSubjects(subjectsRes.data)
      setAssignments(assignmentsRes.data)
    } finally {
      setLoading(false)
    }
  }

  const subjectNameById = Object.fromEntries(subjects.map((s) => [s.id, s.name]))

  const openAddModal = () => {
    setEditingId(null)
    setForm({ subject_id: subjects[0]?.id || '', title: '', description: '', due_date: '', status: 'pending' })
    setShowModal(true)
  }

  const openEditModal = (assignment) => {
    setEditingId(assignment.id)
    setForm({
      subject_id: assignment.subject_id,
      title: assignment.title,
      description: assignment.description || '',
      due_date: assignment.due_date ? assignment.due_date.slice(0, 16) : '',
      status: assignment.status
    })
    setShowModal(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      if (editingId) {
        await apiClient.patch(`/assignments/${editingId}`, {
          title: form.title,
          description: form.description || null,
          due_date: form.due_date || null,
          status: form.status
        })
      } else {
        await apiClient.post('/assignments/', {
          subject_id: parseInt(form.subject_id),
          title: form.title,
          description: form.description || null,
          due_date: form.due_date || null
        })
      }
      setShowModal(false)
      await loadData()
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this assignment?')) return
    await apiClient.delete(`/assignments/${id}`)
    await loadData()
  }

  const toggleComplete = async (assignment) => {
    const newStatus = assignment.status === 'completed' ? 'pending' : 'completed'
    await apiClient.patch(`/assignments/${assignment.id}`, { status: newStatus })
    await loadData()
  }

  if (loading) {
    return (
      <DashboardLayout title="Assignments" subtitle="Track your assignments across all subjects" user={user}>
        <div className="loading-state">Loading...</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Assignments" subtitle="Track your assignments across all subjects" user={user}>
      <div className="page-header-row">
        <h2>{assignments.length} Assignment{assignments.length !== 1 ? 's' : ''}</h2>
        <button className="btn-add" onClick={openAddModal} disabled={subjects.length === 0}>
          + Add Assignment
        </button>
      </div>

      {subjects.length === 0 ? (
        <div className="empty-state">Add a subject first before creating assignments.</div>
      ) : assignments.length === 0 ? (
        <div className="empty-state">No assignments yet.</div>
      ) : (
        <div className="card-grid">
          {assignments.map((a) => (
            <div className="item-card" key={a.id}>
              <div className="item-actions">
                <button className="icon-action-btn" onClick={() => openEditModal(a)}>✎</button>
                <button className="icon-action-btn danger" onClick={() => handleDelete(a.id)}>🗑</button>
              </div>
              <h4>{a.title}</h4>
              <div className="meta-row">
                <span className="meta-tag">{subjectNameById[a.subject_id] || 'Subject'}</span>
                {a.due_date && (
                  <span className="meta-tag">Due {new Date(a.due_date).toLocaleDateString()}</span>
                )}
              </div>
              <div className="meta-row">
                <button
                  className="meta-tag"
                  style={{
                    cursor: 'pointer',
                    border: 'none',
                    color: a.status === 'completed' ? 'var(--accent-1)' : 'var(--muted)',
                    fontWeight: 600
                  }}
                  onClick={() => toggleComplete(a)}
                >
                  {a.status === 'completed' ? '✓ Completed' : '○ Mark as done'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>{editingId ? 'Edit Assignment' : 'Add Assignment'}</h3>
            <form onSubmit={handleSave}>
              {!editingId && (
                <div className="form-group">
                  <label>Subject</label>
                  <select
                    value={form.subject_id}
                    onChange={(e) => setForm({ ...form, subject_id: e.target.value })}
                    required
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              )}
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description (optional)</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Due Date (optional)</label>
                <input
                  type="datetime-local"
                  value={form.due_date}
                  onChange={(e) => setForm({ ...form, due_date: e.target.value })}
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

export default Assignments