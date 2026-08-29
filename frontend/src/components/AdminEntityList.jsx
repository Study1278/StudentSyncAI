import { useState, useEffect } from 'react'
import apiClient from '../api/client'
import '../pages/Subjects.css'

function AdminEntityList({ apiPath, columns, emptyText, deleteLabel }) {
  const [items, setItems] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    setLoading(true)
    try {
      const res = await apiClient.get(apiPath)
      setItems(res.data)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm(`Delete this ${deleteLabel}? This cannot be undone.`)) return
    await apiClient.delete(`${apiPath}/${id}`)
    await load()
  }

  const filteredItems = items.filter((item) =>
    columns.some((col) => {
      const value = col.render ? col.render(item) : item[col.key]
      return String(value ?? '').toLowerCase().includes(search.toLowerCase())
    })
  )

  if (loading) return <div className="loading-state">Loading...</div>

  return (
    <div className="admin-table-wrap">
      <div style={{ padding: '18px 22px 0' }}>
        <input
          type="text"
          placeholder={`Search ${filteredItems.length} of ${items.length}...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="admin-search-input"
        />
      </div>

      {items.length === 0 ? (
        <div className="empty-state" style={{ padding: '40px 22px' }}>{emptyText}</div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr key={item.id}>
                {columns.map((col) => (
                  <td key={col.key}>{col.render ? col.render(item) : item[col.key] ?? '—'}</td>
                ))}
                <td>
                  <button className="admin-delete-btn" onClick={() => handleDelete(item.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default AdminEntityList