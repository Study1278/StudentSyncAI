import { Link } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme'
import './Home.css'

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

function Logo() {
  return (
    <div className="logo">
      <svg className="logo-mark" viewBox="0 0 40 40" fill="none">
        <defs>
          <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--accent-1)" />
            <stop offset="1" stopColor="var(--accent-2)" />
          </linearGradient>
        </defs>
        <circle cx="20" cy="20" r="18" fill="url(#logoGrad)" opacity="0.15" />
        <path d="M20 8c-4 0-7 3-7 7 0 2 1 3.5 2.5 4.5C14 21 13 23 13 25c0 3.5 3 6 7 6s7-2.5 7-6c0-2-1-4-2.5-5.5C26 18.5 27 17 27 15c0-4-3-7-7-7z"
          fill="none" stroke="url(#logoGrad)" strokeWidth="2" />
      </svg>
      StudentSync<span className="gradient-text">AI</span>
    </div>
  )
}

function Home() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="home">
      <nav className="nav">
        <Logo />
        <div className="nav-links">
          <a href="#" className="active">Home</a>
          <a href="#features">Features</a>
          <a href="#how">How it Works</a>
          <a href="#pricing">Pricing</a>
          <a href="#about">About</a>
        </div>
        <div className="nav-actions">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
          <Link to="/login">
            <button className="login-btn">Login</button>
          </Link>
        </div>
      </nav>

 <section className="hero">
        <div className="hero-glow" />
        <div className="hero-inner">
          <div>
            <div className="badge">✨ AI-Powered · Student-Centered · Future-Focused</div>
            <h1>
              Your All-in-One<br />
              <span className="gradient-text">Academic &amp; Career</span> Partner
            </h1>
            <p className="sub">
              StudentSync AI helps you plan, track, and achieve more — from
              assignments and exams to skills and internships, all in one
              intelligent platform.
            </p>
            <div className="hero-ctas">
              <Link to="/login">
                <button className="btn-primary">Get Started Free →</button>
              </Link>
              <button className="btn-secondary">▶ Watch Demo</button>
            </div>
            <div className="trust-row">
              <span>✓ No credit card required</span>
              <span>✓ Free forever plan</span>
              <span>✓ Cancel anytime</span>
            </div>
          </div>

          <div className="hero-visual">
            <div className="panel panel-main">
              <div className="panel-label">📊 Academic Overview</div>
              <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
                <div className="ring"><div className="ring-inner">85%</div></div>
                <div className="panel-stat-row">
                  <div>
                    <div className="panel-stat-small">12</div>
                    <div className="panel-stat-small-label">Subjects</div>
                  </div>
                  <div>
                    <div className="panel-stat-small">8</div>
                    <div className="panel-stat-small-label">Assignments</div>
                  </div>
                  <div>
                    <div className="panel-stat-small">3</div>
                    <div className="panel-stat-small-label">Exams</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="panel panel-brain">
              <div className="panel-label">🧠 AI Brain</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Your Intelligent Study Companion</div>
              <div style={{ marginTop: 10, fontSize: '0.78rem', color: 'var(--accent-1)' }}>● Active</div>
            </div>

            <div className="panel panel-skill">
              <div className="panel-label">🎯 Skill Progress</div>
              <div className="panel-stat">76%</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--muted)', marginTop: 4 }}>Data Science Track</div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Features ---------- */}
      <section className="features" id="features">
        <div className="feature-card">
          <div className="feature-icon" />
          <h3>Academic Management</h3>
          <p>Organize subjects, assignments, exams and resources in one smart workspace.</p>
          <a href="#">Learn more →</a>
        </div>
        <div className="feature-card">
          <div className="feature-icon" />
          <h3>Career Tracking</h3>
          <p>Explore careers, build skills, track progress and prepare for your dream job.</p>
          <a href="#">Learn more →</a>
        </div>
        <div className="feature-card">
          <div className="feature-icon" />
          <h3>AI Assistant</h3>
          <p>Get personalized guidance, study help, and smart recommendations, instantly.</p>
          <a href="#">Learn more →</a>
        </div>
        <div className="feature-card">
          <div className="feature-icon" />
          <h3>Unified Dashboard</h3>
          <p>Visualize progress, set goals, and make data-driven decisions for success.</p>
          <a href="#">Learn more →</a>
        </div>
      </section>

      {/* ---------- How it Works ---------- */}
      <section className="how container" id="how">
        <div className="section-eyebrow">How it works</div>
        <h2 className="section-title">Three steps to staying on track</h2>
        <p className="section-sub">No complicated setup — just sign up and StudentSync AI starts working with you.</p>
        <div className="steps">
          <div className="step">
            <div className="step-num">01</div>
            <h3>Set up your profile</h3>
            <p>Add your subjects, career goal, and current skills — takes about two minutes.</p>
            <div className="step-connector" />
          </div>
          <div className="step">
            <div className="step-num">02</div>
            <h3>Track everything in one place</h3>
            <p>Assignments, exams, internships and skill progress, all synced to one dashboard.</p>
            <div className="step-connector" />
          </div>
          <div className="step">
            <div className="step-num">03</div>
            <h3>Let AI guide the way</h3>
            <p>Get personalized study plans and career suggestions based on your real progress.</p>
          </div>
        </div>
      </section>

      {/* ---------- Pricing ---------- */}
      <section className="pricing container" id="pricing">
        <div className="section-eyebrow">Pricing</div>
        <h2 className="section-title">Simple, honest pricing</h2>
        <p className="section-sub">Start free. Upgrade only if you want the AI features unlocked.</p>
        <div className="price-grid">
          <div className="price-card">
            <h3>Free</h3>
            <div className="price-amount">₹0<span>/forever</span></div>
            <ul>
              <li>Unlimited subjects &amp; assignments</li>
              <li>Exam &amp; deadline tracking</li>
              <li>Skill &amp; internship tracker</li>
              <li>Basic dashboard</li>
            </ul>
            <Link to="/login"><button className="btn-secondary">Get Started</button></Link>
          </div>
          <div className="price-card featured">
            <div className="price-tag">Most Popular</div>
            <h3>Pro</h3>
            <div className="price-amount">₹149<span>/month</span></div>
            <ul>
              <li>Everything in Free</li>
              <li>AI study planner</li>
              <li>AI career &amp; skill-gap analysis</li>
              <li>Priority support</li>
            </ul>
            <Link to="/login"><button className="btn-primary">Start Free Trial</button></Link>
          </div>
        </div>
      </section>

      {/* ---------- CTA banner ---------- */}
      <section className="cta-banner" id="about">
        <div className="cta-inner">
          <h2>Ready to get ahead of the semester?</h2>
          <p>Join students already using StudentSync AI to stay organized and career-ready.</p>
          <Link to="/login"><button className="btn-light">Get Started Free →</button></Link>
        </div>
      </section>

      {/* ---------- Footer ---------- */}
      <footer className="footer">
        <div className="footer-grid">
          <div className="footer-about">
            <Logo />
            <p>The all-in-one platform helping students plan their academics and build the career they want.</p>
          </div>
          <div className="footer-col">
            <h4>Product</h4>
            <a href="#features">Features</a>
            <a href="#how">How it Works</a>
            <a href="#pricing">Pricing</a>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <a href="#about">About</a>
            <a href="#">Contact</a>
            <a href="#">Careers</a>
          </div>
          <div className="footer-col">
            <h4>Legal</h4>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 StudentSync AI. Built as a student project.</span>
          <span>Made with FastAPI + React</span>
        </div>
      </footer>
    </div>
  )
}

export default Home