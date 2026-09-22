import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { adminService } from '../../services/adminService'
import { formatCurrency, formatDate, formatDateTime, formatTime } from '../../utils/formatters'
import StatusBadge from '../../components/common/StatusBadge'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ConfirmModal from '../../components/common/ConfirmModal'
import toast from 'react-hot-toast'

export default function AdminOrderDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [rejectModal, setRejectModal] = useState(false)
  const [rejectReason, setRejectReason] = useState('')

  async function loadOrder() {
    try {
      const res = await adminService.getOrder(id)
      setOrder(res.data.data)
    } catch {
      toast.error('Failed to load order.')
      navigate('/admin/orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrder()
  }, [id])

  async function handleApprove() {
    setActionLoading(true)
    try {
      await adminService.approveOrder(id)
      toast.success('Order approved!')
      loadOrder()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Approval failed.')
    } finally {
      setActionLoading(false)
    }
  }

  async function handleReject() {
    setActionLoading(true)
    try {
      await adminService.rejectOrder(id, { reason: rejectReason })
      toast.success('Order rejected.')
      setRejectModal(false)
      loadOrder()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Rejection failed.')
    } finally {
      setActionLoading(false)
    }
  }

  async function handleComplete() {
    setActionLoading(true)
    try {
      await adminService.completeOrder(id)
      toast.success('Order marked as completed!')
      loadOrder()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Completion failed.')
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) return <LoadingSpinner size="lg" className="py-32" />
  if (!order) return null

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="text-xs text-gray-500 hover:text-gray-800 font-medium mb-1.5 flex items-center gap-1"
          >
            ← Back to orders
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900">{order.orderNumber}</h1>
            <StatusBadge status={order.status} />
          </div>
          <p className="text-xs text-gray-400 mt-1">Received {formatDateTime(order.createdAt)}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {order.status === 'PENDING' && (
            <>
              <button
                onClick={handleApprove}
                disabled={actionLoading}
                className="px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold shadow-sm transition-colors"
              >
                Approve Order
              </button>
              <button
                onClick={() => setRejectModal(true)}
                disabled={actionLoading}
                className="btn-danger py-2.5 px-4 text-sm"
              >
                Reject
              </button>
            </>
          )}
          {order.status === 'APPROVED' && (
            <button
              onClick={handleComplete}
              disabled={actionLoading}
              className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-sm transition-colors"
            >
              Mark Completed
            </button>
          )}
        </div>
      </div>

      {/* Customer & Reservation Grid */}
      <div className="card space-y-4">
        <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-2">
          Reservation & Guest Details
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-xs text-gray-400">Customer Name</p>
            <p className="font-semibold text-gray-800">{order.customer?.name}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Contact Number</p>
            <p className="font-semibold text-gray-800">{order.customer?.mobile}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Email Address</p>
            <p className="font-semibold text-gray-800">{order.customer?.email || 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Party Size</p>
            <p className="font-semibold text-gray-800">{order.guestCount} Guests</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Booking Date</p>
            <p className="font-semibold text-gray-800">{formatDate(order.bookingDate)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Booking Slot</p>
            <p className="font-semibold text-gray-800">{formatTime(order.bookingTime)}</p>
          </div>
        </div>

        {order.specialInstructions && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 mt-2">
            <strong>Customer Instructions:</strong> {order.specialInstructions}
          </div>
        )}
      </div>

      {/* Order Items & Pricing Table */}
      <div className="card space-y-4">
        <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-2">
          Ordered Dishes & Complements
        </h2>
        <div className="divide-y divide-gray-100 text-sm">
          {order.items?.map(item => (
            <div key={item.id} className="py-2.5 flex items-center justify-between">
              <div>
                <span className="font-medium text-gray-900">{item.itemName}</span>
                <span className="text-gray-400 ml-2">× {item.quantity}</span>
              </div>
              <span className="font-semibold text-gray-800">{formatCurrency(item.totalPrice)}</span>
            </div>
          ))}

          {order.extraItems?.length > 0 && (
            <div className="pt-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Extra Complements
              </p>
              {order.extraItems.map(extra => (
                <div key={extra.id} className="py-2 flex items-center justify-between">
                  <div>
                    <span className="text-gray-700">{extra.itemName}</span>
                    <span className="text-gray-400 ml-2">× {extra.quantity}</span>
                  </div>
                  <span className="font-medium text-gray-800">{formatCurrency(extra.totalPrice)}</span>
                </div>
              ))}
            </div>
          )}

          {/* Pricing Totals */}
          <div className="pt-4 space-y-1.5 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Food Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Extras Total</span>
              <span>{formatCurrency(order.extraTotal)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-200">
              <span>Grand Total</span>
              <span className="text-primary-600">{formatCurrency(order.grandTotal)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Rejection notice if rejected */}
      {order.status === 'REJECTED' && order.rejectionReason && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-800">
          <strong>Rejection Reason:</strong> {order.rejectionReason}
        </div>
      )}

      {/* Status History Timeline */}
      {order.statusHistory?.length > 0 && (
        <div className="card space-y-4">
          <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-2">
            Order Status Audit Trail
          </h2>
          <div className="space-y-3">
            {order.statusHistory.map((h, i) => (
              <div key={i} className="flex items-start gap-3 text-sm">
                <div className="w-2.5 h-2.5 rounded-full bg-primary-500 mt-1.5 flex-shrink-0" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900">{h.newStatus}</span>
                    {h.changedBy && (
                      <span className="text-xs text-gray-500">by {h.changedBy}</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{formatDateTime(h.changedAt)}</p>
                  {h.reason && <p className="text-xs text-gray-600 mt-1">Note: {h.reason}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reject Modal */}
      <ConfirmModal
        open={rejectModal}
        onClose={() => setRejectModal(false)}
        onConfirm={handleReject}
        title={`Reject Order #${order.orderNumber}`}
        message={
          <div>
            <p className="text-sm text-gray-600 mb-3">
              Please provide a reason to help the customer understand why:
            </p>
            <textarea
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder="e.g. Fully booked for this time slot."
              rows={3}
              className="input-field text-sm resize-none"
            />
          </div>
        }
        confirmLabel="Reject Order"
        danger
      />
    </div>
  )
}