import { useEffect, useState, useCallback } from 'react'
import { adminService } from '../../services/adminService'
import { formatDateTime } from '../../utils/formatters'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import Pagination from '../../components/common/Pagination'
import toast from 'react-hot-toast'
import { HiOutlineSearch, HiOutlineUsers } from 'react-icons/hi'

export default function CustomerManagementPage() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')

  const fetchCustomers = useCallback(async () => {
    setLoading(true)
    try {
      const res = await adminService.getCustomers({ page, size: 10, search: search.trim() })
      const data = res.data.data
      setCustomers(data.content || [])
      setTotalPages(data.totalPages || 1)
    } catch {
      toast.error('Failed to load customers.')
    } finally {
      setLoading(false)
    }
  }, [page, search])

  useEffect(() => {
    fetchCustomers()
  }, [fetchCustomers])

  function handleSearch(e) {
    e.preventDefault()
    setPage(0)
    fetchCustomers()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Registered Customers</h1>
          <p className="text-sm text-gray-500 mt-1">Directory of registered guests, contact details, and account status.</p>
        </div>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="card p-4 flex gap-3">
        <div className="relative flex-1">
          <HiOutlineSearch className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by customer name, email, or mobile..."
            className="input-field pl-9 py-2 text-sm"
          />
        </div>
        <button type="submit" className="btn-primary py-2 px-5 text-sm">
          Search
        </button>
      </form>

      {/* Table */}
      <div className="card overflow-hidden p-0">
        {loading ? (
          <LoadingSpinner size="lg" className="py-24" />
        ) : customers.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <HiOutlineUsers className="w-12 h-12 mx-auto text-gray-300 mb-2" />
            <p className="font-medium text-gray-600">No customers found</p>
            <p className="text-xs text-gray-400 mt-1">Registered customers will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Customer</th>
                  <th className="px-6 py-3.5">Contact</th>
                  <th className="px-6 py-3.5">Role</th>
                  <th className="px-6 py-3.5">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {customers.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900">
                      {c.name}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900">{c.mobile}</div>
                      <div className="text-xs text-gray-400">{c.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                        {c.role || 'CUSTOMER'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">
                      {formatDateTime(c.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="p-4 border-t border-gray-100">
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>
    </div>
  )
}