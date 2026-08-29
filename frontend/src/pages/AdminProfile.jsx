import { useState, useEffect, useRef } from 'react'
import apiClient from '../api/client'
import AdminLayout from '../components/AdminLayout'
import './Profile.css'

function AdminProfile() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [savingName, setSavingName] = useState(false)
  const [nameSuccess, setNameSuccess] = useState(false)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)

  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    try {
      const res = await apiClient.get('/users/me')
      setUser(res.data)
      setName(res.data.name)
    } finally {
      setLoading(false)
    }
  }

  const handleNameSave = async (e) => {
    e.preventDefault()
    setSavingName(true)
    setNameSuccess(false)
    try {
      const res = await apiClient.patch('/users/me', { name })
      setUser(res.data)
      setNameSuccess(true)
      setTimeout(() => setNameSuccess(false), 3000)
    } finally {
      setSavingName(false)
    }
  }

  const handleAvatarClick = () => fileInputRef.current.click()

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 1024 * 1024) {
      alert('Please choose an image smaller than 1MB')
      return
    }
    setUploadingAvatar(true)
    const reader = new FileReader()
    reader.onload = async () => {
      try {
        const res = await apiClient.patch('/users/me', { avatar_url: reader.result })
        setUser(res.data)
      } finally {
        setUploadingAvatar(false)
      }
    }
    reader.readAsDataURL(file)
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setPasswordError('')
    setPasswordSuccess(false)

    if (newPassword !== confirmNewPassword) {
      setPasswordError('New passwords do not match')
      return
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters')
      return
    }

    setSavingPassword(true)
    try {
      await apiClient.post('/users/change-password', {
        current_password: currentPassword,
        new_password: newPassword
      })
      setPasswordSuccess(true)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmNewPassword('')
    } catch (err) {
      setPasswordError(err.response?.data?.detail || 'Something went wrong')
    } finally {
      setSavingPassword(false)
    }
  }

  const initials = user ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : '..'

  if (loading) {
    return (
      <AdminLayout title="My Profile" subtitle="Manage your admin account">
        <div className="loading-state">Loading...</div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="My Profile" subtitle="Manage your admin account">
      <div className="profile-grid">
        <div className="profile-card">
          <div className="avatar-wrap">
            <div className="avatar-large">
              {user.avatar_url ? <img src={user.avatar_url} alt="Profile" /> : initials}
            </div>
            <button className="avatar-upload-btn" onClick={handleAvatarClick} disabled={uploadingAvatar}>📷</button>
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleAvatarChange} style={{ display: 'none' }} />
          </div>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
          <div className="profile-role-badge">{user.role}</div>
        </div>

        <div>
          <div className="settings-section">
            <h3>Basic Information</h3>
            {nameSuccess && <div className="success-msg">Name updated successfully</div>}
            <form onSubmit={handleNameSave}>
              <div className="settings-row">
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <button type="submit" className="inline-save-btn" disabled={savingName}>
                  {savingName ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>

          <div className="settings-section">
            <h3>Change Password</h3>
            {!user.oauth_provider ? (
              <>
                {passwordError && <div className="error-msg">{passwordError}</div>}
                {passwordSuccess && <div className="success-msg">Password changed successfully</div>}
                <form onSubmit={handlePasswordChange}>
                  <div className="form-group">
                    <label>Current Password</label>
                    <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label>New Password</label>
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label>Confirm New Password</label>
                    <input type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} required />
                  </div>
                  <button type="submit" className="inline-save-btn" disabled={savingPassword}>
                    {savingPassword ? 'Changing...' : 'Change Password'}
                  </button>
                </form>
              </>
            ) : (
              <p style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>
                You signed in with Google, so there's no password to change here.
              </p>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminProfile