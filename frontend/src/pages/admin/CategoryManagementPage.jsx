import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { menuService } from '../../services/menuService'
import { adminService } from '../../services/adminService'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ConfirmModal from '../../components/common/ConfirmModal'
import toast from 'react-hot-toast'
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineArrowLeft } from 'react-icons/hi'

export default function CategoryManagementPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  const [form, setForm] = useState({
    name: '',
    description: '',
    displayOrder: 0,
  })

  async function loadCategories() {
    try {
      const res = await menuService.getCategories()
      setCategories(res.data.data || [])
    } catch {
      toast.error('Failed to load categories.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  function openCreate() {
    setEditingCategory(null)
    setForm({ name: '', description: '', displayOrder: categories.length + 1 })
    setModalOpen(true)
  }

  function openEdit(cat) {
    setEditingCategory(cat)
    setForm({
      name: cat.categoryName,
      description: cat.description || '',
      displayOrder: cat.displayOrder || 0,
    })
    setModalOpen(true)
  }

  async function handleSave(e) {
    e.preventDefault()
    if (!form.name.trim()) {
      toast.error('Category name is required.')
      return
    }

    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        displayOrder: Number(form.displayOrder) || 0,
      }

      if (editingCategory) {
        await adminService.updateCategory(editingCategory.categoryId, payload)
        toast.success('Category updated!')
      } else {
        await adminService.createCategory(payload)
        toast.success('Category created!')
      }
      setModalOpen(false)
      loadCategories()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save category.')
    }
  }

  async function handleDelete() {
    if (!deletingId) return
    try {
      await adminService.deleteCategory(deletingId)
      toast.success('Category deactivated.')
      setDeletingId(null)
      loadCategories()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to deactivate category.')
    }
  }

  if (loading) return <LoadingSpinner size="lg" className="py-32" />

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link to="/admin/menu" className="text-xs text-gray-500 hover:text-gray-800 font-medium mb-1 flex items-center gap-1">
            <HiOutlineArrowLeft className="w-3.5 h-3.5" /> Back to menu items
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Menu Categories</h1>
          <p className="text-sm text-gray-500 mt-1">Organize your restaurant food offerings into logical sections.</p>
        </div>
        <button onClick={openCreate} className="btn-primary py-2 px-4 text-sm flex items-center gap-2">
          <HiOutlinePlus className="w-4 h-4" /> Add Category
        </button>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="divide-y divide-gray-100">
          {categories.map(cat => (
            <div key={cat.categoryId} className="p-4 sm:px-6 flex items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-gray-900">{cat.categoryName}</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                    Order: {cat.displayOrder}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                    {cat.items?.length || 0} items
                  </span>
                </div>
                {cat.description && (
                  <p className="text-xs text-gray-500 mt-1">{cat.description}</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEdit(cat)}
                  className="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Edit Category"
                >
                  <HiOutlinePencil className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setDeletingId(cat.categoryId)}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Deactivate Category"
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
              {editingCategory ? 'Edit Category' : 'New Category'}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="label text-xs">Category Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Desserts"
                  className="input-field text-sm"
                  required
                />
              </div>

              <div>
                <label className="label text-xs">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Short description for guests..."
                  rows={2}
                  className="input-field text-sm resize-none"
                />
              </div>

              <div>
                <label className="label text-xs">Display Order</label>
                <input
                  type="number"
                  value={form.displayOrder}
                  onChange={e => setForm({ ...form, displayOrder: e.target.value })}
                  className="input-field text-sm"
                />
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
        title="Deactivate Category"
        message="Are you sure you want to deactivate this category?"
        confirmLabel="Deactivate"
        danger
      />
    </div>
  )
}