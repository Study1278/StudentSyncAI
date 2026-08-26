import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import apiClient from '../api/client'

function AdminProtectedRoute({ children }) {
  const [status, setStatus] = useState('checking')

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token')

    if (!token) {
      setStatus('denied')
      return
    }

    apiClient.get('/users/me')
      .then((res) => {
        setStatus(res.data.role === 'admin' ? 'ok' : 'denied')
      })
      .catch(() => setStatus('denied'))
  }, [])

  if (status === 'checking') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'var(--muted)' }}>
        Checking access...
      </div>
    )
  }

  if (status === 'denied') {
    return <Navigate to="/admin" replace />
  }

  return children
}

export default AdminProtectedRoute