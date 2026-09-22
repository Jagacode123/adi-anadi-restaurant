import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext'
import api from '../services/api'

const NotificationContext = createContext(null)

export function NotificationProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount]     = useState(0)

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return
    try {
      const res = await api.get('/notifications')
      setNotifications(res.data.data || [])
      setUnreadCount((res.data.data || []).filter(n => !n.isRead).length)
    } catch {
      // silently fail — notifications are non-critical
    }
  }, [isAuthenticated])

  // Poll every 15 seconds
  useEffect(() => {
    fetchNotifications()
    if (!isAuthenticated) return
    const interval = setInterval(fetchNotifications, 15000)
    return () => clearInterval(interval)
  }, [isAuthenticated, fetchNotifications])

  const markAsRead = useCallback(async (id) => {
    try {
      await api.put(`/notifications/${id}/read`)
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch { /* silent */ }
  }, [])

  const markAllRead = useCallback(async () => {
    try {
      await api.put('/notifications/read-all')
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
      setUnreadCount(0)
    } catch { /* silent */ }
  }, [])

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllRead, fetchNotifications }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotifications must be used inside NotificationProvider')
  return ctx
}
