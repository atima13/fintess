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

function Leaderboard({ apiBaseUrl }) {
  const [entries, setEntries] = useState([])
  const [meta, setMeta] = useState({ count: 0, page: null, totalPages: null })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const abortController = new AbortController()

    const loadLeaderboard = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(`${apiBaseUrl}/leaderboard/`, {
          signal: abortController.signal,
        })

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }

        const payload = await response.json()
        const normalized = normalizeResponse(payload)
        setEntries(normalized.items)
        setMeta({
          count: normalized.count,
          page: normalized.page,
          totalPages: normalized.totalPages,
        })
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') {
          setError(fetchError.message || 'Unable to load leaderboard')
        }
      } finally {
        setLoading(false)
      }
    }

    loadLeaderboard()
    return () => abortController.abort()
  }, [apiBaseUrl])

  if (loading) {
    return <p>Loading leaderboard...</p>
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>
  }

  return (
    <section>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="h4 mb-0">Leaderboard</h2>
        <small className="text-secondary">Count: {meta.count}</small>
      </div>

      {meta.page && meta.totalPages ? (
        <p className="text-secondary small">Page {meta.page} of {meta.totalPages}</p>
      ) : null}

      {entries.length === 0 ? (
        <p>No leaderboard entries found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered align-middle">
            <thead>
              <tr>
                <th>Rank</th>
                <th>User</th>
                <th>Team</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry._id || entry.id || `${entry.rank}-${entry.user?.name}`}>
                  <td>{entry.rank ?? '-'}</td>
                  <td>{entry.user?.name || '-'}</td>
                  <td>{entry.team?.name || '-'}</td>
                  <td>{entry.points ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default Leaderboard