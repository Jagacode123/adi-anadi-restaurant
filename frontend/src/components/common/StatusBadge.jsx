const statusConfig = {
  PENDING:   { label: 'Pending',   className: 'badge-pending' },
  APPROVED:  { label: 'Approved',  className: 'badge-approved' },
  REJECTED:  { label: 'Rejected',  className: 'badge-rejected' },
  CANCELLED: { label: 'Cancelled', className: 'badge-cancelled' },
  COMPLETED: { label: 'Completed', className: 'badge-completed' },
}

export default function StatusBadge({ status }) {
  const config = statusConfig[status] || { label: status, className: 'badge-pending' }
  return <span className={config.className}>{config.label}</span>
}
