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

function Teams({ apiBaseUrl }) {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
  const endpointUrl = apiBaseUrl
    ? `${apiBaseUrl}/teams/`
    : codespaceName
      ? `https://${codespaceName}-8000.app.github.dev/api/teams/`
      : '/api/teams/'
  const [teams, setTeams] = useState([])
  const [meta, setMeta] = useState({ count: 0, page: null, totalPages: null })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const abortController = new AbortController()

    const loadTeams = async () => {
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
        setTeams(normalized.items)
        setMeta({
          count: normalized.count,
          page: normalized.page,
          totalPages: normalized.totalPages,
        })
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') {
          setError(fetchError.message || 'Unable to load teams')
        }
      } finally {
        setLoading(false)
      }
    }

    loadTeams()
    return () => abortController.abort()
  }, [endpointUrl])

  if (loading) {
    return <p>Loading teams...</p>
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>
  }

  return (
    <section>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="h4 mb-0">Teams</h2>
        <small className="text-secondary">Count: {meta.count}</small>
      </div>

      {meta.page && meta.totalPages ? (
        <p className="text-secondary small">Page {meta.page} of {meta.totalPages}</p>
      ) : null}

      {teams.length === 0 ? (
        <p>No teams found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered align-middle">
            <thead>
              <tr>
                <th>Name</th>
                <th>City</th>
                <th>Member Count</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team) => (
                <tr key={team._id || team.id || team.name}>
                  <td>{team.name || '-'}</td>
                  <td>{team.city || '-'}</td>
                  <td>{Array.isArray(team.members) ? team.members.length : 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default Teams