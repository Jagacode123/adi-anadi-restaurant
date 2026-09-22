export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 0}
        className="px-3 py-1.5 rounded border text-sm disabled:opacity-40 hover:bg-gray-50"
      >
        ← Prev
      </button>
      <span className="text-sm text-gray-600">
        Page {page + 1} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages - 1}
        className="px-3 py-1.5 rounded border text-sm disabled:opacity-40 hover:bg-gray-50"
      >
        Next →
      </button>
    </div>
  )
}
