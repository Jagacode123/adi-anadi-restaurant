import { useEffect, useState, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { orderService } from '../../services/orderService'
import { formatCurrency, formatDateTime, formatDate, formatTime } from '../../utils/formatters'
import StatusBadge from '../../components/common/StatusBadge'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { POLL_INTERVAL_MS } from '../../utils/constants'
import toast from 'react-hot-toast'

export default function MyOrdersPage() {
  const [orders, setOrders]   = useState([])
  const [loading, setLoading] = useState(true)
  const prevStatusesRef       = useRef({})

  const fetchOrders = useCallback(async (showLoader = false) => {
    if (showLoader) setLoading(true)
    try {
      const res  = await orderService.getMyOrders()
      const data = res.data.data || []
      // Detect status changes and notify
      data.forEach(order => {
        const prev = prevStatusesRef.current[order.id]
        if (prev && prev !== order.status) {
          toast.success(`Order #${order.orderNumber} is now ${order.status}`)
        }
      })
      prevStatusesRef.current = Object.fromEntries(data.map(o => [o.id, o.status]))
      setOrders(data)
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchOrders(true) }, [])

  // Poll every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => fetchOrders(false), POLL_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [fetchOrders])

  if (loading) return <LoadingSpinner size="lg" className="py-32" />

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-bold text-gray-900">My Orders</h1>
        <Link to="/order/new" className="btn-primary py-2 px-5 text-sm">
          New Order
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🍽️</div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">No orders yet</h2>
          <p className="text-gray-500 mb-6">Place your first order and it will appear here.</p>
          <Link to="/order/new" className="btn-primary py-3 px-8">Book / Order Now</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="card hover:shadow-card-hover transition-shadow">
              {/* Header row */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                <div>
                  <span className="font-bold text-gray-900 text-lg">{order.orderNumber}</span>
                  <div className="text-xs text-gray-400 mt-0.5">
                    Requested {formatDateTime(order.createdAt)}
                  </div>
                </div>
                <StatusBadge status={order.status} />
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm mb-4">
                <div>
                  <p className="text-gray-400 text-xs mb-0.5">Booking Date</p>
                  <p className="font-medium text-gray-700">{formatDate(order.bookingDate)}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-0.5">Time</p>
                  <p className="font-medium text-gray-700">{formatTime(order.bookingTime)}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-0.5">Guests</p>
                  <p className="font-medium text-gray-700">{order.guestCount}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-0.5">Total</p>
                  <p className="font-bold text-primary-600">{formatCurrency(order.grandTotal)}</p>
                </div>
              </div>

              {/* Rejection reason */}
              {order.status === 'REJECTED' && order.rejectionReason && (
                <div className="bg-red-50 rounded-lg px-4 py-2 text-sm text-red-700 mb-4">
                  <strong>Reason:</strong> {order.rejectionReason}
                </div>
              )}

              <Link to={`/orders/${order.id}`} className="btn-secondary py-2 px-5 text-sm">
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
