import { useState, useEffect } from 'react'
import apiClient from '../api/client'
import DashboardLayout from '../components/DashboardLayout'
import './Subjects.css'

function Exams() {
  const [user, setUser] = useState(null)
  const [subjects, setSubjects] = useState([])
  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ subject_id: '', title: '', exam_date: '', syllabus: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [userRes, subjectsRes, examsRes] = await Promise.all([
        apiClient.get('/users/me'),
        apiClient.get('/subjects/'),
        apiClient.get('/exams/')
      ])
      setUser(userRes.data)
      setSubjects(subjectsRes.data)
      setExams(examsRes.data)
    } finally {
      setLoading(false)
    }
  }

  const subjectNameById = Object.fromEntries(subjects.map((s) => [s.id, s.name]))

  // Sort by exam date, soonest first
  const sortedExams = [...exams].sort((a, b) => new Date(a.exam_date) - new Date(b.exam_date))

  const daysUntil = (dateStr) => {
    const diff = new Date(dateStr) - new Date()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    if (days < 0) return 'Past'
    if (days === 0) return 'Today'
    if (days === 1) return 'Tomorrow'
    return `In ${days} days`
  }

  const openAddModal = () => {
    setEditingId(null)
    setForm({ subject_id: subjects[0]?.id || '', title: '', exam_date: '', syllabus: '' })
    setShowModal(true)
  }

  const openEditModal = (exam) => {
    setEditingId(exam.id)
    setForm({
      subject_id: exam.subject_id,
      title: exam.title,
      exam_date: exam.exam_date ? exam.exam_date.slice(0, 16) : '',
      syllabus: exam.syllabus || ''
    })
    setShowModal(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      if (editingId) {
        await apiClient.patch(`/exams/${editingId}`, {
          title: form.title,
          exam_date: form.exam_date,
          syllabus: form.syllabus || null
        })
      } else {
        await apiClient.post('/exams/', {
          subject_id: parseInt(form.subject_id),
          title: form.title,
          exam_date: form.exam_date,
          syllabus: form.syllabus || null
        })
      }
      setShowModal(false)
      await loadData()
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this exam?')) return
    await apiClient.delete(`/exams/${id}`)
    await loadData()
  }

  if (loading) {
    return (
      <DashboardLayout title="Exams" subtitle="Stay ahead of your exam schedule" user={user}>
        <div className="loading-state">Loading...</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Exams" subtitle="Stay ahead of your exam schedule" user={user}>
      <div className="page-header-row">
        <h2>{exams.length} Exam{exams.length !== 1 ? 's' : ''}</h2>
        <button className="btn-add" onClick={openAddModal} disabled={subjects.length === 0}>
          + Add Exam
        </button>
      </div>

      {subjects.length === 0 ? (
        <div className="empty-state">Add a subject first before scheduling exams.</div>
      ) : exams.length === 0 ? (
        <div className="empty-state">No exams scheduled yet.</div>
      ) : (
        <div className="card-grid">
          {sortedExams.map((ex) => {
            const untilLabel = daysUntil(ex.exam_date)
            const isUrgent = untilLabel === 'Today' || untilLabel === 'Tomorrow'
            return (
              <div className="item-card" key={ex.id}>
                <div className="item-actions">
                  <button className="icon-action-btn" onClick={() => openEditModal(ex)}>✎</button>
                  <button className="icon-action-btn danger" onClick={() => handleDelete(ex.id)}>🗑</button>
                </div>
                <h4>{ex.title}</h4>
                <div className="meta-row">
                  <span className="meta-tag">{subjectNameById[ex.subject_id] || 'Subject'}</span>
                  <span className="meta-tag">
                    {new Date(ex.exam_date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="meta-row">
                  <span
                    className="badge-pill"
                    style={isUrgent ? { background: 'rgba(239,68,68,0.12)', color: '#ef4444' } : {}}
                  >
                    {untilLabel}
                  </span>
                </div>
                {ex.syllabus && (
                  <div style={{ marginTop: 12, fontSize: '0.82rem', color: 'var(--muted)', lineHeight: 1.5 }}>
                    {ex.syllabus}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>{editingId ? 'Edit Exam' : 'Add Exam'}</h3>
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
                <label>Exam Title</label>
                <input
                  type="text"
                  placeholder="e.g. Mid-Semester Exam"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Exam Date &amp; Time</label>
                <input
                  type="datetime-local"
                  value={form.exam_date}
                  onChange={(e) => setForm({ ...form, exam_date: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Syllabus (optional)</label>
                <textarea
                  rows={3}
                  placeholder="Topics covered in this exam"
                  value={form.syllabus}
                  onChange={(e) => setForm({ ...form, syllabus: e.target.value })}
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

export default Exams