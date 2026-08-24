import { useState, useEffect } from 'react'
import apiClient from '../api/client'
import DashboardLayout from '../components/DashboardLayout'
import './Subjects.css'

const PROFICIENCY_LEVELS = ['beginner', 'intermediate', 'advanced']

function Skills() {
  const [user, setUser] = useState(null)
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ name: '', proficiency: 'beginner' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [userRes, skillsRes] = await Promise.all([
        apiClient.get('/users/me'),
        apiClient.get('/skills/')
      ])
      setUser(userRes.data)
      setSkills(skillsRes.data)
    } finally {
      setLoading(false)
    }
  }

  const openAddModal = () => {
    setEditingId(null)
    setForm({ name: '', proficiency: 'beginner' })
    setShowModal(true)
  }

  const openEditModal = (skill) => {
    setEditingId(skill.id)
    setForm({ name: skill.name, proficiency: skill.proficiency })
    setShowModal(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      if (editingId) {
        await apiClient.patch(`/skills/${editingId}`, form)
      } else {
        await apiClient.post('/skills/', form)
      }
      setShowModal(false)
      await loadData()
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this skill?')) return
    await apiClient.delete(`/skills/${id}`)
    await loadData()
  }

  if (loading) {
    return (
      <DashboardLayout title="Skills" subtitle="Track the skills you're building" user={user}>
        <div className="loading-state">Loading...</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Skills" subtitle="Track the skills you're building" user={user}>
      <div className="page-header-row">
        <h2>{skills.length} Skill{skills.length !== 1 ? 's' : ''}</h2>
        <button className="btn-add" onClick={openAddModal}>+ Add Skill</button>
      </div>

      {skills.length === 0 ? (
        <div className="empty-state">No skills yet. Add your first one to start tracking your progress.</div>
      ) : (
        <div className="card-grid">
          {skills.map((s) => (
            <div className="item-card" key={s.id}>
              <div className="item-actions">
                <button className="icon-action-btn" onClick={() => openEditModal(s)}>✎</button>
                <button className="icon-action-btn danger" onClick={() => handleDelete(s.id)}>🗑</button>
              </div>
              <h4>{s.name}</h4>
              <div className="meta-row">
                <span className="meta-tag" style={{ textTransform: 'capitalize' }}>{s.proficiency}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h3>{editingId ? 'Edit Skill' : 'Add Skill'}</h3>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>Skill Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Proficiency</label>
                <select
                  value={form.proficiency}
                  onChange={(e) => setForm({ ...form, proficiency: e.target.value })}
                >
                  {PROFICIENCY_LEVELS.map((level) => (
                    <option key={level} value={level} style={{ textTransform: 'capitalize' }}>
                      {level}
                    </option>
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

export default Skills