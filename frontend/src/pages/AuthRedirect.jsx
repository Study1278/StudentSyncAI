import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMsal } from '@azure/msal-react'
import axios from 'axios'

function AuthRedirect() {
  const { instance } = useMsal()
  const navigate = useNavigate()
  const [status, setStatus] = useState('Signing you in...')

  useEffect(() => {
    instance.handleRedirectPromise()
      .then(async (response) => {
        if (response && response.accessToken) {
          try {
            const backendResponse = await axios.post('http://127.0.0.1:8000/users/microsoft-login', {
              token: response.accessToken
            })
            localStorage.setItem('token', backendResponse.data.access_token)
            navigate('/dashboard')
          } catch (err) {
            // Log the REAL reason instead of failing silently
            console.error('Microsoft login backend error:', err.response?.data || err.message)
            setStatus(
              'Login failed: ' + (err.response?.data?.detail || err.message)
            )
            setTimeout(() => navigate('/login'), 2000)
          }
        } else {
          console.warn('handleRedirectPromise() returned no response/accessToken:', response)
          setStatus('No sign-in response received. Redirecting...')
          setTimeout(() => navigate('/login'), 2000)
        }
      })
      .catch((err) => {
        // This catches errors from handleRedirectPromise() itself (MSAL-side failures)
        console.error('handleRedirectPromise() failed:', err)
        setStatus('Sign-in error: ' + err.message)
        setTimeout(() => navigate('/login'), 2000)
      })
  }, [instance, navigate])

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: '#888' }}>
      {status}
    </div>
  )
}

export default AuthRedirect