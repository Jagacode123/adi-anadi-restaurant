import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { orderService } from '../../services/orderService'
import { useAuth } from '../../context/AuthContext'
import { formatCurrency, formatDate, formatDateTime, formatTime } from '../../utils/formatters'
import StatusBadge from '../../components/common/StatusBadge'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ConfirmModal from '../../components/common/ConfirmModal'
import { useOrderPolling } from '../../hooks/useOrderPolling'
import toast from 'react-hot-toast'

export default function OrderDetailPage() {
  const { id }              = useParams()
  const navigate            = useNavigate()
  const { isAuthenticated } = useAuth()
  const [order, setOrder]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [cancelModal, setCancelModal] = useState(false)
  const [cancelling, setCancelling]   = useState(false)

  const fetchOrder = useCallback(async () => {
    try {
      const res = await orderService.getOrder(id)
      setOrder(res.data.data)
    } catch {
      navigate(isAuthenticated ? '/orders' : '/')
    } finally {
      setLoading(false)
    }
  }, [id, navigate, isAuthenticated])

  useEffect(() => { fetchOrder() }, [fetchOrder])

  // Poll for status changes
  useOrderPolling({
    orderId: id,
    currentStatus: order?.status,
    enabled: order?.status === 'PENDING' || order?.status === 'APPROVED',
    onStatusChange: (updated) => {
      setOrder(updated)
      if (updated.status === 'APPROVED') {
        toast.success('🎉 Your order has been confirmed!')
      } else if (updated.status === 'REJECTED') {
        toast.error('Your order request was rejected.')
      }
    },
  })

  async function handleCancel() {
    setCancelling(true)
    try {
      await orderService.cancelOrder(id)
      toast.success('Order cancelled.')
      fetchOrder()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not cancel order.')
    } finally {
      setCancelling(false)
    }
  }

  if (loading) return <LoadingSpinner size="lg" className="py-32" />
  if (!order)  return null

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <button
              onClick={() => navigate(isAuthenticated ? '/orders' : '/')}
              className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1 font-medium transition-colors"
            >
              ← {isAuthenticated ? 'Back to Orders' : 'Back to Home'}
            </button>
            <span className="text-gray-300">|</span>
            <Link to="/order/new" className="text-xs text-primary-600 hover:text-primary-700 font-semibold">
              + Book Another
            </Link>
          </div>
          <h1 className="font-display text-3xl font-bold text-gray-900">{order.orderNumber}</h1>
          <p className="text-sm text-gray-400 mt-1">Requested {formatDateTime(order.createdAt)}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* Approved banner */}
      {order.status === 'APPROVED' && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-6 flex items-start gap-3">
          <span className="text-2xl">✅</span>
          <div>
            <p className="font-semibold text-green-800">Your order has been confirmed!</p>
            <p className="text-sm text-green-600 mt-0.5">
              See you on {formatDate(order.bookingDate)} at {formatTime(order.bookingTime)}.
            </p>
          </div>
        </div>
      )}

      {/* Rejected banner */}
      {order.status === 'REJECTED' && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-6">
          <p className="font-semibold text-red-800">Your order request was rejected.</p>
          {order.rejectionReason && (
            <p className="text-sm text-red-600 mt-1">Reason: {order.rejectionReason}</p>
          )}
        </div>
      )}

      {/* Booking Info */}
      <div className="card mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">Booking Details</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          {[
            ['Customer',   order.customer?.name],
            ['Mobile',     order.customer?.mobile],
            ['Date',       formatDate(order.bookingDate)],
            ['Time',       formatTime(order.bookingTime)],
            ['Guests',     order.guestCount],
          ].map(([label, value]) => (
            <div key={label}>
              <p className="text-gray-400 text-xs mb-0.5">{label}</p>
              <p className="font-medium text-gray-700">{value}</p>
            </div>
          ))}
        </div>
        {order.specialInstructions && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 mb-0.5">Special Instructions</p>
            <p className="text-sm text-gray-700">{order.specialInstructions}</p>
          </div>
        )}
      </div>

      {/* Order Items */}
      <div className="card mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">Food Items</h2>
        <div className="space-y-3">
          {order.items?.map(item => (
            <div key={item.id} className="flex items-center justify-between text-sm">
              <div>
                <span className="font-medium text-gray-800">{item.itemName}</span>
                <span className="text-gray-400 ml-2">× {item.quantity} plates</span>
              </div>
              <span className="font-medium text-gray-700">{formatCurrency(item.totalPrice)}</span>
            </div>
          ))}
        </div>
        {order.extraItems?.length > 0 && (
          <>
            <div className="border-t border-gray-100 my-4" />
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Extra Items</h3>
            <div className="space-y-3">
              {order.extraItems.map(item => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <div>
                    <span className="font-medium text-gray-800">{item.itemName}</span>
                    <span className="text-gray-400 ml-2">× {item.quantity}</span>
                  </div>
                  <span className="font-medium text-gray-700">{formatCurrency(item.totalPrice)}</span>
                </div>
              ))}
            </div>
          </>
        )}
        {/* Totals */}
        <div className="border-t border-gray-100 mt-4 pt-4 space-y-2 text-sm">
          <div className="flex justify-between text-gray-500">
            <span>Subtotal</span><span>{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>Extra Items</span><span>{formatCurrency(order.extraTotal)}</span>
          </div>
          <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t">
            <span>Grand Total</span><span className="text-primary-600">{formatCurrency(order.grandTotal)}</span>
          </div>
        </div>
      </div>

      {/* Status Timeline */}
      {order.statusHistory?.length > 0 && (
        <div className="card mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Status History</h2>
          <div className="space-y-3">
            {order.statusHistory.map((h, i) => (
              <div key={i} className="flex items-start gap-3 text-sm">
                <div className="w-2.5 h-2.5 rounded-full bg-primary-400 mt-1.5 flex-shrink-0" />
                <div>
                  <span className="font-medium text-gray-800">{h.newStatus}</span>
                  <span className="text-gray-400 ml-2">{formatDateTime(h.changedAt)}</span>
                  {h.reason && <p className="text-gray-500 mt-0.5">{h.reason}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cancel button */}
      {order.status === 'PENDING' && (
        <div className="flex justify-end">
          <button
            onClick={() => setCancelModal(true)}
            disabled={cancelling}
            className="btn-danger py-2 px-6 text-sm"
          >
            Cancel Order
          </button>
        </div>
      )}

      <ConfirmModal
        open={cancelModal}
        onClose={() => setCancelModal(false)}
        onConfirm={handleCancel}
        title="Cancel Order"
        message="Are you sure you want to cancel this order? This cannot be undone."
        confirmLabel="Yes, Cancel"
        danger
      />
    </div>
  )
}
