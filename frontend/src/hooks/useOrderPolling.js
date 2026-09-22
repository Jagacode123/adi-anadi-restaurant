import { useEffect, useCallback } from 'react'
import { orderService } from '../services/orderService'
import { POLL_INTERVAL_MS } from '../utils/constants'

/**
 * Polls a single order every POLL_INTERVAL_MS milliseconds.
 * Calls onStatusChange(newOrder) when the status changes.
 *
 * Architecture note: to upgrade to WebSocket later, replace the setInterval
 * with a SockJS/STOMP subscription on /topic/orders/{orderId}.
 * The onStatusChange callback and the rest of the component code stay the same.
 */
export function useOrderPolling({ orderId, currentStatus, onStatusChange, enabled = true }) {
  const poll = useCallback(async () => {
    if (!orderId || !enabled) return
    try {
      const res = await orderService.getOrder(orderId)
      const latest = res.data.data
      if (latest && latest.status !== currentStatus) {
        onStatusChange(latest)
      }
    } catch {
      // silently ignore poll errors
    }
  }, [orderId, currentStatus, onStatusChange, enabled])

  useEffect(() => {
    if (!enabled) return
    const interval = setInterval(poll, POLL_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [poll, enabled])
}
