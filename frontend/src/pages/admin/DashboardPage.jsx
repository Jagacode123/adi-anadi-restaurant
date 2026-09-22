import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { adminService } from '../../services/adminService'
import { formatCurrency, formatDate, formatTime } from '../../utils/formatters'
import StatusBadge from '../../components/common/StatusBadge'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'
import {
  HiOutlineClipboardList,
  HiOutlineCheckCircle,
  HiOutlineUserGroup,
  HiOutlineCash,
  HiOutlineArrowRight,
} from 'react-icons/hi'

export default function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [recentPending, setRecentPending] = useState([])
  const [loading, setLoading] = useState(true)

  async function loadData() {
    try {
      const [dashRes, pendingRes] = await Promise.all([
        adminService.getDashboard(),
        adminService.getPendingOrders(),
      ])
      setStats(dashRes.data.data)
      setRecentPending(pendingRes.data.data || [])
    } catch {
      toast.error('Failed to load dashboard data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  async function handleQuickApprove(id) {
    try {
      await adminService.approveOrder(id)
      toast.success('Order approved!')
      loadData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to approve order.')
    }
  }

  if (loading) return <LoadingSpinner size="lg" className="py-32" />

  const kpis = [
    {
      title: 'Pending Requests',
      value: stats?.pendingOrders ?? 0,
      icon: HiOutlineClipboardList,
      color: 'bg-amber-500 text-white',
      link: '/admin/orders/pending',
      highlight: (stats?.pendingOrders || 0) > 0,
    },
    {
      title: 'Approved Bookings',
      value: stats?.approvedOrders ?? 0,
      icon: HiOutlineCheckCircle,
      color: 'bg-emerald-500 text-white',
      link: '/admin/orders?status=APPROVED',
    },
    {
      title: "Today's Guests",
      value: stats?.totalGuestsToday ?? 0,
      icon: HiOutlineUserGroup,
      color: 'bg-blue-500 text-white',
      link: '/admin/orders',
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders ?? 0,
      icon: HiOutlineCash,
      color: 'bg-purple-500 text-white',
      link: '/admin/orders',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Restaurant Overview</h1>
          <p className="text-sm text-gray-500 mt-1">Live metrics, reservations, and pending actions.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/admin/menu" className="btn-secondary py-2 px-4 text-sm">
            Manage Menu
          </Link>
          <Link to="/admin/orders/pending" className="btn-primary py-2 px-4 text-sm">
            View Pending ({stats?.pendingOrders || 0})
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon
          return (
            <Link
              key={idx}
              to={kpi.link}
              className="card hover:shadow-card-hover transition-all duration-200 flex items-center gap-4"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${kpi.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-400 font-medium">{kpi.title}</p>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl font-bold text-gray-900">{kpi.value}</span>
                  {kpi.highlight && (
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                  )}
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Orders Breakdown & Quick Pending Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Urgent Pending Queue */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Pending Requests Needing Action</h2>
              <p className="text-xs text-gray-500 mt-0.5">New reservations awaiting kitchen & table confirmation.</p>
            </div>
            <Link to="/admin/orders/pending" className="text-xs font-semibold text-primary-600 hover:underline flex items-center gap-1">
              All Pending <HiOutlineArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {recentPending.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <span className="text-4xl block mb-2">🎉</span>
              <p className="font-medium text-gray-600">All caught up!</p>
              <p className="text-xs mt-1">No orders are pending approval right now.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentPending.slice(0, 5).map(order => (
                <div key={order.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900">{order.orderNumber}</span>
                      <span className="text-xs text-gray-500 font-medium">({order.customer?.name})</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {formatDate(order.bookingDate)} at {formatTime(order.bookingTime)} • {order.guestCount} Guests • Total: <strong className="text-primary-600">{formatCurrency(order.grandTotal)}</strong>
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleQuickApprove(order.id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold shadow-sm transition-colors"
                    >
                      Approve
                    </button>
                    <Link
                      to={`/admin/orders/${order.id}`}
                      className="px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold transition-colors"
                    >
                      Review
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Status Distribution Breakdown */}
        <div className="card space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Order Status Summary</h2>
          <div className="space-y-3 pt-2 text-sm">
            <div className="flex items-center justify-between p-3 rounded-lg bg-amber-50">
              <span className="text-amber-800 font-medium">Pending Review</span>
              <span className="font-bold text-amber-900">{stats?.pendingOrders ?? 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50">
              <span className="text-emerald-800 font-medium">Approved / Confirmed</span>
              <span className="font-bold text-emerald-900">{stats?.approvedOrders ?? 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50">
              <span className="text-blue-800 font-medium">Completed</span>
              <span className="font-bold text-blue-900">{stats?.completedOrders ?? 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-red-50">
              <span className="text-red-800 font-medium">Rejected</span>
              <span className="font-bold text-red-900">{stats?.rejectedOrders ?? 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
              <span className="text-gray-700 font-medium">Cancelled</span>
              <span className="font-bold text-gray-900">{stats?.cancelledOrders ?? 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}