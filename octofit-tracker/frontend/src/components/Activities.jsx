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

function Activities({ apiBaseUrl }) {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()
  const resolvedApiBaseUrl =
    apiBaseUrl ||
    (codespaceName
      ? `https://${codespaceName}-8000.app.github.dev/api`
      : '/api')
  const [activities, setActivities] = useState([])
  const [meta, setMeta] = useState({ count: 0, page: null, totalPages: null })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const abortController = new AbortController()

    const loadActivities = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(`${resolvedApiBaseUrl}/activities/`, {
          signal: abortController.signal,
        })

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }

        const payload = await response.json()
        const normalized = normalizeResponse(payload)
        setActivities(normalized.items)
        setMeta({
          count: normalized.count,
          page: normalized.page,
          totalPages: normalized.totalPages,
        })
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') {
          setError(fetchError.message || 'Unable to load activities')
        }
      } finally {
        setLoading(false)
      }
    }

    loadActivities()
    return () => abortController.abort()
  }, [resolvedApiBaseUrl])

  if (loading) {
    return <p>Loading activities...</p>
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>
  }

  return (
    <section>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="h4 mb-0">Activities</h2>
        <small className="text-secondary">Count: {meta.count}</small>
      </div>

      {meta.page && meta.totalPages ? (
        <p className="text-secondary small">Page {meta.page} of {meta.totalPages}</p>
      ) : null}

      {activities.length === 0 ? (
        <p>No activities found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered align-middle">
            <thead>
              <tr>
                <th>User</th>
                <th>Team</th>
                <th>Type</th>
                <th>Duration (min)</th>
                <th>Completed</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity) => (
                <tr key={activity._id || activity.id || `${activity.type}-${activity.completedAt}`}>
                  <td>{activity.user?.name || '-'}</td>
                  <td>{activity.team?.name || '-'}</td>
                  <td>{activity.type || '-'}</td>
                  <td>{activity.durationMinutes ?? '-'}</td>
                  <td>
                    {activity.completedAt
                      ? new Date(activity.completedAt).toLocaleString()
                      : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default Activities