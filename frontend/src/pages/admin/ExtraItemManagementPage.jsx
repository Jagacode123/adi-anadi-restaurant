import { useEffect, useState } from 'react'
import { menuService } from '../../services/menuService'
import { adminService } from '../../services/adminService'
import { formatCurrency } from '../../utils/formatters'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ConfirmModal from '../../components/common/ConfirmModal'
import toast from 'react-hot-toast'
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi'

export default function ExtraItemManagementPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    available: true,
  })

  async function loadItems() {
    try {
      const res = await menuService.getExtraItems()
      setItems(res.data.data || [])
    } catch {
      toast.error('Failed to load extra items.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadItems()
  }, [])

  function openCreate() {
    setEditingItem(null)
    setForm({ name: '', description: '', price: '', available: true })
    setModalOpen(true)
  }

  function openEdit(item) {
    setEditingItem(item)
    setForm({
      name: item.name,
      description: item.description || '',
      price: item.price,
      available: item.available,
    })
    setModalOpen(true)
  }

  async function handleSave(e) {
    e.preventDefault()
    if (!form.name.trim() || !form.price) {
      toast.error('Name and price are required.')
      return
    }

    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: parseFloat(form.price),
        available: form.available,
      }

      if (editingItem) {
        await adminService.updateExtraItem(editingItem.id, payload)
        toast.success('Extra item updated!')
      } else {
        await adminService.createExtraItem(payload)
        toast.success('Extra item created!')
      }
      setModalOpen(false)
      loadItems()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save extra item.')
    }
  }

  async function handleDelete() {
    if (!deletingId) return
    try {
      await adminService.deleteExtraItem(deletingId)
      toast.success('Extra item deactivated.')
      setDeletingId(null)
      loadItems()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to deactivate item.')
    }
  }

  if (loading) return <LoadingSpinner size="lg" className="py-32" />

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Extra & Side Complements</h1>
          <p className="text-sm text-gray-500 mt-1">Manage optional additions like extra rice, breads, salads, and water bottles.</p>
        </div>
        <button onClick={openCreate} className="btn-primary py-2 px-4 text-sm flex items-center gap-2">
          <HiOutlinePlus className="w-4 h-4" /> Add Extra Item
        </button>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="divide-y divide-gray-100">
          {items.map(item => (
            <div key={item.id} className="p-4 sm:px-6 flex items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-gray-900">{item.name}</span>
                  <span className="text-sm font-bold text-primary-600">
                    {formatCurrency(item.price)}
                  </span>
                  {!item.available && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-red-100 text-red-700">
                      Unavailable
                    </span>
                  )}
                </div>
                {item.description && (
                  <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEdit(item)}
                  className="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Edit Item"
                >
                  <HiOutlinePencil className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setDeletingId(item.id)}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Deactivate Item"
                >
                  <HiOutlineTrash className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              {editingItem ? 'Edit Extra Item' : 'New Extra Item'}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="label text-xs">Item Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Extra Rice"
                  className="input-field text-sm"
                  required
                />
              </div>

              <div>
                <label className="label text-xs">Price (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.price}
                  onChange={e => setForm({ ...form, price: e.target.value })}
                  placeholder="e.g. 50"
                  className="input-field text-sm"
                  required
                />
              </div>

              <div>
                <label className="label text-xs">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Portion size or notes..."
                  rows={2}
                  className="input-field text-sm resize-none"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer text-sm pt-1">
                  <input
                    type="checkbox"
                    checked={form.available}
                    onChange={e => setForm({ ...form, available: e.target.checked })}
                    className="rounded text-primary-600 focus:ring-primary-500 w-4 h-4"
                  />
                  <span>Available for Orders</span>
                </label>
              </div>

              <div className="flex gap-3 justify-end pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn-secondary py-2 px-4 text-sm"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary py-2 px-5 text-sm">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Deactivate Confirm */}
      <ConfirmModal
        open={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Deactivate Extra Item"
        message="Are you sure you want to deactivate this extra item?"
        confirmLabel="Deactivate"
        danger
      />
    </div>
  )
}