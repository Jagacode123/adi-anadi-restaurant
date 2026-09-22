import { format, parseISO } from 'date-fns'

export function formatCurrency(amount) {
  return `₹${Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
}

export function formatDate(dateStr) {
  if (!dateStr) return ''
  try {
    return format(typeof dateStr === 'string' ? parseISO(dateStr) : dateStr, 'dd MMM yyyy')
  } catch {
    return dateStr
  }
}

export function formatDateTime(dateStr) {
  if (!dateStr) return ''
  try {
    return format(typeof dateStr === 'string' ? parseISO(dateStr) : dateStr, 'dd MMM yyyy, hh:mm a')
  } catch {
    return dateStr
  }
}

export function formatTime(timeStr) {
  if (!timeStr) return ''
  // HH:mm:ss → h:mm AM/PM
  try {
    const [h, m] = timeStr.split(':').map(Number)
    const period = h >= 12 ? 'PM' : 'AM'
    const hour   = h % 12 || 12
    return `${hour}:${String(m).padStart(2, '0')} ${period}`
  } catch {
    return timeStr
  }
}

export function statusLabel(status) {
  const map = {
    PENDING:   'Pending',
    APPROVED:  'Approved',
    REJECTED:  'Rejected',
    CANCELLED: 'Cancelled',
    COMPLETED: 'Completed',
  }
  return map[status] || status
}
