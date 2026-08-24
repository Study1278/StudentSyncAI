import { useState, useEffect } from 'react'
import apiClient from '../api/client'
import DashboardLayout from '../components/DashboardLayout'
import './Dashboard.css'

function Dashboard() {
  const [user, setUser] = useState(null)
  const [subjects, setSubjects] = useState([])
  const [assignments, setAssignments] = useState([])
  const [exams, setExams] = useState([])
  const [skills, setSkills] = useState([])
  const [internships, setInternships] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const [userRes, subjectsRes, skillsRes, internshipsRes, assignmentsRes, examsRes] =
        await Promise.all([
          apiClient.get('/users/me'),
          apiClient.get('/subjects/'),
          apiClient.get('/skills/'),
          apiClient.get('/internships/'),
          apiClient.get('/assignments/'),
          apiClient.get('/exams/')
        ])

      setUser(userRes.data)
      setSubjects(subjectsRes.data)
      setSkills(skillsRes.data)
      setInternships(internshipsRes.data)
      setAssignments(assignmentsRes.data)
      setExams(examsRes.data)
    } finally {
      setLoading(false)
    }
  }

  const pendingAssignments = assignments.filter((a) => a.status !== 'completed')
  const subjectNameById = Object.fromEntries(subjects.map((s) => [s.id, s.name]))

  if (loading) {
    return (
      <DashboardLayout title="Dashboard" subtitle="Loading..." user={user}>
        <div className="loading-state">Loading your dashboard...</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      title={`Welcome back, ${user ? user.name.split(' ')[0] : 'Student'} 👋`}
      subtitle="Here's what's happening with your academics and career today."
      user={user}
    >
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-value">{subjects.length}</div>
          <div className="stat-label">Subjects</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-value">{pendingAssignments.length}</div>
          <div className="stat-label">Pending Assignments</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-value">{exams.length}</div>
          <div className="stat-label">Upcoming Exams</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💼</div>
          <div className="stat-value">{internships.length}</div>
          <div className="stat-label">Internship Applications</div>
        </div>
      </div>

      <div className="panel-grid">
        <div className="dash-panel">
          <div className="dash-panel-header">
            <h3>Pending Assignments</h3>
            <a href="#">View all →</a>
          </div>
          {pendingAssignments.length === 0 ? (
            <div className="empty-state">No pending assignments. You're all caught up! 🎉</div>
          ) : (
            pendingAssignments.slice(0, 5).map((a) => (
              <div className="list-item" key={a.id}>
                <div>
                  <div className="list-item-title">{a.title}</div>
                  <div className="list-item-sub">{subjectNameById[a.subject_id] || 'Subject'}</div>
                </div>
                <span className="badge-pill due-soon">{a.status}</span>
              </div>
            ))
          )}
        </div>

        <div className="dash-panel">
          <div className="dash-panel-header">
            <h3>Your Skills</h3>
            <a href="#">View all →</a>
          </div>
          {skills.length === 0 ? (
            <div className="empty-state">No skills added yet.</div>
          ) : (
            skills.slice(0, 6).map((s) => (
              <div className="list-item" key={s.id}>
                <div className="list-item-title">{s.name}</div>
                <span className="badge-pill">{s.proficiency}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Dashboard