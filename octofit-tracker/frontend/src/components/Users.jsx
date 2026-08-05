import { useEffect, useState } from 'react'

const normalizeResponse = (payload) => {
  if (Array.isArray(payload)) {
    return {
      items: payload,
      count: payload.length,
      page: null,
      totalPages: null,
    }
  }

  if (payload && typeof payload === 'object') {
    const items = Array.isArray(payload.items)
      ? payload.items
      : Array.isArray(payload.results)
        ? payload.results
        : Array.isArray(payload.data)
          ? payload.data
          : []

    return {
      items,
      count: payload.count ?? payload.total ?? items.length,
      page: payload.page ?? payload.currentPage ?? payload.pagination?.page ?? null,
      totalPages:
        payload.totalPages ??
        payload.pagination?.totalPages ??
        payload.pages ??
        null,
    }
  }

  return { items: [], count: 0, page: null, totalPages: null }
}

function Users({ apiBaseUrl }) {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
  const endpointUrl = apiBaseUrl
    ? `${apiBaseUrl}/users/`
    : codespaceName
      ? `https://${codespaceName}-8000.app.github.dev/api/users/`
      : '/api/users/'
  const [users, setUsers] = useState([])
  const [meta, setMeta] = useState({ count: 0, page: null, totalPages: null })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const abortController = new AbortController()

    const loadUsers = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(endpointUrl, {
          signal: abortController.signal,
        })

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }

        const payload = await response.json()
        const normalized = normalizeResponse(payload)
        setUsers(normalized.items)
        setMeta({
          count: normalized.count,
          page: normalized.page,
          totalPages: normalized.totalPages,
        })
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') {
          setError(fetchError.message || 'Unable to load users')
        }
      } finally {
        setLoading(false)
      }
    }

    loadUsers()
    return () => abortController.abort()
  }, [endpointUrl])

  if (loading) {
    return <p>Loading users...</p>
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>
  }

  return (
    <section>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="h4 mb-0">Users</h2>
        <small className="text-secondary">Count: {meta.count}</small>
      </div>

      {meta.page && meta.totalPages ? (
        <p className="text-secondary small">Page {meta.page} of {meta.totalPages}</p>
      ) : null}

      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered align-middle">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Fitness Level</th>
                <th>Team</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id || user.id || user.email}>
                  <td>{user.name || '-'}</td>
                  <td>{user.email || '-'}</td>
                  <td>{user.fitnessLevel || '-'}</td>
                  <td>{user.team?.name || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default Users