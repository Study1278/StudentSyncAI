import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";
import "../pages/Dashboard.css";

function SunIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}
function MoonIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
function LogoutIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}

function DashLogo() {
  return (
    <div className="dash-logo">
      <svg className="dash-logo-mark" viewBox="0 0 40 40" fill="none">
        <defs>
          <linearGradient id="layoutLogoGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--accent-1)" />
            <stop offset="1" stopColor="var(--accent-2)" />
          </linearGradient>
        </defs>
        <circle
          cx="20"
          cy="20"
          r="18"
          fill="url(#layoutLogoGrad)"
          opacity="0.15"
        />
        <path
          d="M20 8c-4 0-7 3-7 7 0 2 1 3.5 2.5 4.5C14 21 13 23 13 25c0 3.5 3 6 7 6s7-2.5 7-6c0-2-1-4-2.5-5.5C26 18.5 27 17 27 15c0-4-3-7-7-7z"
          fill="none"
          stroke="url(#layoutLogoGrad)"
          strokeWidth="2"
        />
      </svg>
      StudentSync<span className="gradient-text">AI</span>
    </div>
  );
}

const NAV_ITEMS = [
  { path: "/dashboard", label: "📊 Dashboard" },
  { path: "/subjects", label: "📚 Subjects" },
  { path: "/assignments", label: "📝 Assignments" },
  { path: "/exams", label: "📅 Exams" },
  { path: "/skills", label: "🎯 Skills" },
  { path: "/internships", label: "💼 Internships" },
];

function DashboardLayout({ title, subtitle, user, children }) {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    navigate("/login");
  };

  const initials = user
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "..";

  return (
    <div className="dash">
      <aside className="dash-sidebar">
        <DashLogo />
        <nav className="dash-nav">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`dash-nav-item ${location.pathname === item.path ? "active" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="dash-sidebar-footer">
          <button className="dash-nav-item" onClick={handleLogout}>
            <LogoutIcon /> Logout
          </button>
        </div>
      </aside>

      <main className="dash-main">
        <div className="dash-topbar">
          <div className="dash-greeting">
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
          <div className="dash-topbar-actions">
            <button
              className="dash-icon-btn"
              onClick={toggleTheme}
              aria-label={
                theme === "dark"
                  ? "Switch to light theme"
                  : "Switch to dark theme"
              }
            >
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            </button>
            <Link
              to="/profile"
              className="dash-avatar"
              style={{ textDecoration: "none", overflow: "hidden" }}
            >
              {user?.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt="Profile"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                initials
              )}
            </Link>
          </div>
        </div>

        <div className="dash-content">{children}</div>
      </main>
    </div>
  );
}

export default DashboardLayout;
