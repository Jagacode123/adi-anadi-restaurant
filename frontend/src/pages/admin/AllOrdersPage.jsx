import { useEffect, useState, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { adminService } from '../../services/adminService'
import { formatCurrency, formatDate, formatTime, formatDateTime } from '../../utils/formatters'
import StatusBadge from '../../components/common/StatusBadge'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import Pagination from '../../components/common/Pagination'
import toast from 'react-hot-toast'
import { HiOutlineSearch, HiOutlineFilter } from 'react-icons/hi'

export default function AllOrdersPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialStatus = searchParams.get('status') || ''

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [status, setStatus] = useState(initialStatus)
  const [date, setDate] = useState('')
  const [search, setSearch] = useState('')

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page, size: 10 }
      if (status) params.status = status
      if (date) params.date = date
      if (search.trim()) params.search = search.trim()

      const res = await adminService.getAllOrders(params)
      const paged = res.data.data
      setOrders(paged.content || [])
      setTotalPages(paged.totalPages || 1)
    } catch {
      toast.error('Failed to load orders.')
    } finally {
      setLoading(false)
    }
  }, [page, status, date, search])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  function handleFilterSubmit(e) {
    e.preventDefault()
    setPage(0)
    fetchOrders()
  }

  function handleReset() {
    setStatus('')
    setDate('')
    setSearch('')
    setPage(0)
    setSearchParams({})
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Reservations & Orders</h1>
          <p className="text-sm text-gray-500 mt-1">Search, filter, and inspect customer bookings and history.</p>
        </div>
      </div>

      {/* Filters Card */}
      <form onSubmit={handleFilterSubmit} className="card grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div>
          <label className="label text-xs">Search</label>
          <div className="relative">
            <HiOutlineSearch className="absolute left-3 top-3.5 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Order #, name, mobile..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field pl-9 py-2 text-sm"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <label className="label text-xs">Status</label>
          <select
            value={status}
            onChange={e => {
              setStatus(e.target.value)
              setPage(0)
            }}
            className="input-field py-2 text-sm"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="COMPLETED">Completed</option>
            <option value="REJECTED">Rejected</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        {/* Date Filter */}
        <div>
          <label className="label text-xs">Booking Date</label>
          <input
            type="date"
            value={date}
            onChange={e => {
              setDate(e.target.value)
              setPage(0)
            }}
            className="input-field py-2 text-sm"
          >
          </input>
        </div>

        {/* Action Buttons */}
        <div className="flex items-end gap-2">
          <button type="submit" className="btn-primary py-2 px-4 text-sm flex-1">
            Apply
          </button>
          <button type="button" onClick={handleReset} className="btn-secondary py-2 px-3 text-sm">
            Reset
          </button>
        </div>
      </form>

      {/* Table Card */}
      <div className="card overflow-hidden p-0">
        {loading ? (
          <LoadingSpinner size="lg" className="py-24" />
        ) : orders.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg font-medium text-gray-600">No orders found</p>
            <p className="text-xs text-gray-400 mt-1">Try adjusting your filters or search keywords.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Order #</th>
                  <th className="px-5 py-3.5">Customer</th>
                  <th className="px-5 py-3.5">Date & Time</th>
                  <th className="px-5 py-3.5">Guests</th>
                  <th className="px-5 py-3.5">Total</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-5 py-4 font-bold text-gray-900">
                      <Link to={`/admin/orders/${order.id}`} className="hover:text-primary-600">
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-medium text-gray-900">{order.customer?.name}</div>
                      <div className="text-xs text-gray-400">{order.customer?.mobile}</div>
                    </td>
                    <td className="px-5 py-4 text-gray-700">
                      <div>{formatDate(order.bookingDate)}</div>
                      <div className="text-xs text-gray-400">{formatTime(order.bookingTime)}</div>
                    </td>
                    <td className="px-5 py-4 text-gray-700 font-medium">
                      {order.guestCount}
                    </td>
                    <td className="px-5 py-4 font-bold text-primary-600">
                      {formatCurrency(order.grandTotal)}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        to={`/admin/orders/${order.id}`}
                        className="btn-secondary py-1.5 px-3 text-xs"
                      >
                        View Details
                      </Link>
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