import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Activities from './components/Activities'
import Leaderboard from './components/Leaderboard'
import Teams from './components/Teams'
import Users from './components/Users'
import Workouts from './components/Workouts'

function App() {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
  const apiBaseUrl = codespaceName
    ? `https://${codespaceName}-8000.app.github.dev/api`
    : '/api'
  const usingFallback = !codespaceName

  return (
    <div className="container py-4">
      <header className="mb-4">
        <h1 className="display-6 mb-3">Octofit Tracker</h1>
        <p className="text-secondary mb-3">
          Activity tracking, teams, leaderboard, and workout suggestions.
        </p>

        {usingFallback ? (
          <div className="alert alert-warning" role="alert">
            <strong>VITE_CODESPACE_NAME is not set.</strong> Using fallback API base
            <code className="ms-1">/api</code>.
          </div>
        ) : null}

        <nav className="nav nav-pills flex-wrap gap-2">
          <NavLink
            to="/users"
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            Users
          </NavLink>
          <NavLink
            to="/teams"
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            Teams
          </NavLink>
          <NavLink
            to="/activities"
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            Activities
          </NavLink>
          <NavLink
            to="/leaderboard"
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            Leaderboard
          </NavLink>
          <NavLink
            to="/workouts"
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            Workouts
          </NavLink>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/users" replace />} />
          <Route path="/users" element={<Users apiBaseUrl={apiBaseUrl} />} />
          <Route path="/teams" element={<Teams apiBaseUrl={apiBaseUrl} />} />
          <Route
            path="/activities"
            element={<Activities apiBaseUrl={apiBaseUrl} />}
          />
          <Route
            path="/leaderboard"
            element={<Leaderboard apiBaseUrl={apiBaseUrl} />}
          />
          <Route path="/workouts" element={<Workouts apiBaseUrl={apiBaseUrl} />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
