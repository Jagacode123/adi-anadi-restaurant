import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { adminService } from '../../services/adminService'
import { formatCurrency, formatDate, formatTime, formatDateTime } from '../../utils/formatters'
import StatusBadge from '../../components/common/StatusBadge'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ConfirmModal from '../../components/common/ConfirmModal'
import toast from 'react-hot-toast'

export default function PendingOrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [rejectingOrder, setRejectingOrder] = useState(null)
  const [rejectReason, setRejectReason] = useState('')
  const [processingId, setProcessingId] = useState(null)

  async function loadPending() {
    try {
      const res = await adminService.getPendingOrders()
      setOrders(res.data.data || [])
    } catch {
      toast.error('Failed to load pending orders.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPending()
  }, [])

  async function handleApprove(id) {
    setProcessingId(id)
    try {
      await adminService.approveOrder(id)
      toast.success('Order approved successfully!')
      loadPending()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to approve order.')
    } finally {
      setProcessingId(null)
    }
  }

  async function handleReject() {
    if (!rejectingOrder) return
    setProcessingId(rejectingOrder.id)
    try {
      await adminService.rejectOrder(rejectingOrder.id, { reason: rejectReason })
      toast.success('Order rejected.')
      setRejectingOrder(null)
      setRejectReason('')
      loadPending()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reject order.')
    } finally {
      setProcessingId(null)
    }
  }

  if (loading) return <LoadingSpinner size="lg" className="py-32" />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pending Order Requests</h1>
          <p className="text-sm text-gray-500 mt-1">Review table reservations and dish selections awaiting confirmation.</p>
        </div>
        <span className="badge-pending text-sm px-3 py-1 font-bold">
          {orders.length} Pending
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="card text-center py-20">
          <span className="text-5xl block mb-3">✨</span>
          <h2 className="text-lg font-bold text-gray-800">No Pending Orders</h2>
          <p className="text-sm text-gray-500 mt-1">All new orders have been reviewed and approved or rejected.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="card hover:shadow-card-hover transition-all space-y-4">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-gray-900">{order.orderNumber}</span>
                  <StatusBadge status={order.status} />
                  <span className="text-xs text-gray-400">
                    Requested {formatDateTime(order.createdAt)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleApprove(order.id)}
                    disabled={processingId === order.id}
                    className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold shadow-sm transition-colors disabled:opacity-50"
                  >
                    {processingId === order.id ? 'Processing...' : 'Approve Booking'}
                  </button>
                  <button
                    onClick={() => {
                      setRejectingOrder(order)
                      setRejectReason('')
                    }}
                    disabled={processingId === order.id}
                    className="btn-danger py-2 px-4 text-sm"
                  >
                    Reject
                  </button>
                  <Link
                    to={`/admin/orders/${order.id}`}
                    className="btn-secondary py-2 px-4 text-sm"
                  >
                    Details
                  </Link>
                </div>
              </div>

              {/* Reservation Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-xs text-gray-400">Customer</p>
                  <p className="font-semibold text-gray-800">{order.customer?.name}</p>
                  <p className="text-xs text-gray-500">{order.customer?.mobile}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Date & Slot</p>
                  <p className="font-semibold text-gray-800">{formatDate(order.bookingDate)}</p>
                  <p className="text-xs text-gray-500">{formatTime(order.bookingTime)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Party Size</p>
                  <p className="font-semibold text-gray-800">{order.guestCount} Guests</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Grand Total</p>
                  <p className="font-bold text-primary-600 text-base">{formatCurrency(order.grandTotal)}</p>
                </div>
              </div>

              {/* Special Instructions */}
              {order.specialInstructions && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900">
                  <strong>Special Instructions:</strong> {order.specialInstructions}
                </div>
              )}

              {/* Dishes Preview */}
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Ordered Items</p>
                <div className="flex flex-wrap gap-2 text-xs">
                  {order.items?.map(item => (
                    <span key={item.id} className="bg-white border border-gray-200 px-2.5 py-1 rounded-md text-gray-700 font-medium">
                      {item.itemName} × {item.quantity}
                    </span>
                  ))}
                  {order.extraItems?.map(extra => (
                    <span key={extra.id} className="bg-primary-50 border border-primary-200 px-2.5 py-1 rounded-md text-primary-800 font-medium">
                      + {extra.itemName} × {extra.quantity}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reject Order Modal */}
      {rejectingOrder && (
        <ConfirmModal
          open={!!rejectingOrder}
          onClose={() => setRejectingOrder(null)}
          onConfirm={handleReject}
          title={`Reject Order #${rejectingOrder.orderNumber}`}
          message={
            <div>
              <p className="text-sm text-gray-600 mb-3">
                Provide an optional reason for the customer:
              </p>
              <textarea
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                placeholder="e.g. Restaurant is fully booked for this time slot."
                rows={3}
                className="input-field text-sm resize-none"
              />
            </div>
          }
          confirmLabel="Reject Order"
          danger
        />
      )}
    </div>
  )
}