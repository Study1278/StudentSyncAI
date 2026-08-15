import { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme'
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
function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" />
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
function KeyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="8" cy="15" r="4" /><path d="M10.5 12.5L20 3M20 3v5M20 3h-5" />
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

function ForgotLogo() {
  return (
    <div className="login-logo">
      <svg className="login-logo-mark" viewBox="0 0 40 40" fill="none">
        <defs>
          <linearGradient id="fpLogoGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--accent-1)" />
            <stop offset="1" stopColor="var(--accent-2)" />
          </linearGradient>
        </defs>
        <circle cx="20" cy="20" r="18" fill="url(#fpLogoGrad)" opacity="0.15" />
        <path d="M20 8c-4 0-7 3-7 7 0 2 1 3.5 2.5 4.5C14 21 13 23 13 25c0 3.5 3 6 7 6s7-2.5 7-6c0-2-1-4-2.5-5.5C26 18.5 27 17 27 15c0-4-3-7-7-7z"
          fill="none" stroke="url(#fpLogoGrad)" strokeWidth="2" />
      </svg>
      <div className="login-logo-name">
        StudentSync<span className="gradient-text">AI</span>
      </div>
    </div>
  )
}

function ForgotPassword() {
  const [step, setStep] = useState('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

const handleSendOtp = async (e) => {
  e.preventDefault()
  setError('')
  setLoading(true)
  try {
    await axios.post('http://127.0.0.1:8000/users/forgot-password', { email })
    setStep('otp')
  } catch (err) {
    if (err.response && err.response.status === 404) {
      setError('This email is not registered')
    } else {
      setError('Something went wrong. Please try again.')
    }
  } finally {
    setLoading(false)
  }
}

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await axios.post('http://127.0.0.1:8000/users/verify-otp', { email, otp_code: otp })
      setStep('reset')
    } catch (err) {
      setError('Invalid or expired OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setError('')

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      await axios.post('http://127.0.0.1:8000/users/reset-password', {
        email,
        otp_code: otp,
        new_password: newPassword
      })
      setStep('done')
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setError('Something went wrong. Your OTP may have expired.')
    } finally {
      setLoading(false)
    }
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
        <ForgotLogo />

        {step === 'email' && (
          <>
            <div style={{ textAlign: 'center' }}>
              <h1 className="login-welcome">Forgot Password? 🔑</h1>
              <p className="login-subtitle">Enter your email and we'll send you a reset code</p>
            </div>
            {error && <div className="login-error">{error}</div>}
            <form onSubmit={handleSendOtp} style={{ marginTop: 24 }}>
              <div className="login-field">
                <MailIcon />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="login-submit" disabled={loading}>
                {loading ? 'Sending...' : <>→ Send OTP</>}
              </button>
            </form>
          </>
        )}

        {step === 'otp' && (
          <>
            <div style={{ textAlign: 'center' }}>
              <h1 className="login-welcome">Check Your Email 📩</h1>
              <p className="login-subtitle">Enter the 6-digit code sent to {email}</p>
            </div>
            {error && <div className="login-error">{error}</div>}
            <form onSubmit={handleVerifyOtp} style={{ marginTop: 24 }}>
              <div className="login-field">
                <KeyIcon />
                <input
                  type="text"
                  placeholder="6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  required
                />
              </div>
              <button type="submit" className="login-submit" disabled={loading}>
                {loading ? 'Verifying...' : <>→ Verify OTP</>}
              </button>
            </form>
          </>
        )}

        {step === 'reset' && (
          <>
            <div style={{ textAlign: 'center' }}>
              <h1 className="login-welcome">Set New Password 🔒</h1>
              <p className="login-subtitle">Choose a new password for your account</p>
            </div>
            {error && <div className="login-error">{error}</div>}
            <form onSubmit={handleResetPassword} style={{ marginTop: 24 }}>
              <div className="login-field">
                <LockIcon />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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
              <div className="login-field">
                <LockIcon />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="login-submit" disabled={loading}>
                {loading ? 'Resetting...' : <>→ Reset Password</>}
              </button>
            </form>
          </>
        )}

        {step === 'done' && (
          <div style={{ textAlign: 'center' }}>
            <h1 className="login-welcome">Password Reset! ✅</h1>
            <p className="login-subtitle">Redirecting you to login...</p>
          </div>
        )}

        <div className="login-footer" style={{ marginTop: 22 }}>
          Remember your password? <Link to="/login">Log in</Link>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword