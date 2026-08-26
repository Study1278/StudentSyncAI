import { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme'
import { GoogleLogin } from '@react-oauth/google'
import { useMsal } from '@azure/msal-react'
import { loginRequest } from '../authConfig'
import './Login.css'

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  )
}
function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}
function UserIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
    </svg>
  )
}
function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="11" width="16" height="9" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  )
}
function EyeIcon({ open }) {
  return open ? (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" /><circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a19.4 19.4 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <path d="M1 1l22 22" />
    </svg>
  )
}

function LoginLogo() {
  return (
    <div className="login-logo">
      <svg className="login-logo-mark" viewBox="0 0 40 40" fill="none">
        <defs>
          <linearGradient id="loginLogoGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--accent-1)" />
            <stop offset="1" stopColor="var(--accent-2)" />
          </linearGradient>
        </defs>
        <circle cx="20" cy="20" r="18" fill="url(#loginLogoGrad)" opacity="0.15" />
        <path d="M20 8c-4 0-7 3-7 7 0 2 1 3.5 2.5 4.5C14 21 13 23 13 25c0 3.5 3 6 7 6s7-2.5 7-6c0-2-1-4-2.5-5.5C26 18.5 27 17 27 15c0-4-3-7-7-7z"
          fill="none" stroke="url(#loginLogoGrad)" strokeWidth="2" />
      </svg>
      <div className="login-logo-name">
        StudentSync<span className="gradient-text">AI</span>
      </div>
    </div>
  )
}

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const { instance } = useMsal()

  const storeTokenAndRedirect = (token) => {
    if (rememberMe) {
      localStorage.setItem('token', token)
    } else {
      sessionStorage.setItem('token', token)
    }
    navigate('/dashboard')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await axios.post('http://127.0.0.1:8000/users/login', {
        email: email,
        password: password
      })

      storeTokenAndRedirect(response.data.access_token)
    } catch (err) {
      setError('Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('')
    try {
      const response = await axios.post('http://127.0.0.1:8000/users/google-login', {
        token: credentialResponse.credential
      })

      storeTokenAndRedirect(response.data.access_token)
    } catch (err) {
      setError('Google login failed. Please try again.')
    }
  }

const handleMicrosoftLogin = () => {
  instance.loginRedirect(loginRequest)
}

  return (
    <div className="login-page">
      <div className="blob blob-1" />
      <div className="blob blob-2" />

      <button
        className="login-theme-toggle"
        onClick={toggleTheme}
        aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      >
        {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
      </button>

      <div className="login-card">
        <LoginLogo />

        <div style={{ textAlign: 'center' }}>
          <h1 className="login-welcome">Welcome Back 👋</h1>
          <p className="login-subtitle">Sign in to continue to your dashboard</p>
        </div>



        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="login-field">
            <UserIcon />
            <input
              type="email"
              placeholder="Email or Username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="login-field">
            <LockIcon />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="eye-btn"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <EyeIcon open={showPassword} />
            </button>
          </div>

          <div className="login-row">
            <label className="remember-me">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>
            <Link to="/forgot-password" className="forgot-link">Forgot Password?</Link>
          </div>

          <button type="submit" className="login-submit" disabled={loading}>
            {loading ? 'Signing in...' : <>→ Login</>}
          </button>
        </form>

        <div className="login-divider">or continue with</div>

        <div className="social-row">
          <div className="google-btn-wrap">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google login failed')}
            />
          </div>
        </div>

        {/*<button
          type="button"
          className="social-btn"
          onClick={handleMicrosoftLogin}
          style={{ width: '100%', marginTop: 10 }}
        >
          🟦 Continue with Microsoft
        </button>*/}

        <div className="login-footer">
          Don't have an account? <Link to="/register">Sign up</Link>
        </div>
      </div>
    </div>
  )
}

export default Login