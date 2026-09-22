import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { menuService } from '../../services/menuService'
import { adminService } from '../../services/adminService'
import { formatCurrency } from '../../utils/formatters'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ConfirmModal from '../../components/common/ConfirmModal'
import toast from 'react-hot-toast'
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi'

export default function MenuManagementPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [itemModal, setItemModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  const [form, setForm] = useState({
    categoryId: '',
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    vegetarian: true,
    available: true,
    displayOrder: 0,
  })

  async function loadMenu() {
    try {
      const res = await menuService.getCategories()
      const data = res.data.data || []
      setCategories(data)
      if (data.length > 0 && !form.categoryId) {
        setForm(f => ({ ...f, categoryId: data[0].categoryId }))
      }
    } catch {
      toast.error('Failed to load menu.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMenu()
  }, [])

  function openCreateModal() {
    setEditingItem(null)
    setForm({
      categoryId: categories[0]?.categoryId || '',
      name: '',
      description: '',
      price: '',
      imageUrl: '',
      vegetarian: true,
      available: true,
      displayOrder: 0,
    })
    setItemModal(true)
  }

  function openEditModal(item) {
    setEditingItem(item)
    setForm({
      categoryId: item.categoryId,
      name: item.name,
      description: item.description || '',
      price: item.price,
      imageUrl: item.imageUrl || '',
      vegetarian: item.vegetarian,
      available: item.available,
      displayOrder: item.displayOrder || 0,
    })
    setItemModal(true)
  }

  async function handleSaveItem(e) {
    e.preventDefault()
    if (!form.name.trim() || !form.price || !form.categoryId) {
      toast.error('Name, category, and price are required.')
      return
    }

    try {
      const payload = {
        ...form,
        categoryId: Number(form.categoryId),
        price: parseFloat(form.price),
        displayOrder: Number(form.displayOrder) || 0,
      }

      if (editingItem) {
        await adminService.updateMenuItem(editingItem.id, payload)
        toast.success('Menu item updated!')
      } else {
        await adminService.createMenuItem(payload)
        toast.success('Menu item created!')
      }
      setItemModal(false)
      loadMenu()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save menu item.')
    }
  }

  async function handleDelete() {
    if (!deletingId) return
    try {
      await adminService.deleteMenuItem(deletingId)
      toast.success('Item deactivated.')
      setDeletingId(null)
      loadMenu()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to deactivate item.')
    }
  }

  if (loading) return <LoadingSpinner size="lg" className="py-32" />

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Menu Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage dishes, pricing, availability, and categories.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/admin/menu/categories" className="btn-secondary py-2 px-4 text-sm">
            Manage Categories
          </Link>
          <button onClick={openCreateModal} className="btn-primary py-2 px-4 text-sm flex items-center gap-2">
            <HiOutlinePlus className="w-4 h-4" /> Add New Dish
          </button>
        </div>
      </div>

      {/* Categorized Dishes */}
      <div className="space-y-8">
        {categories.map(category => (
          <div key={category.categoryId} className="card p-0 overflow-hidden">
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-gray-900 text-lg">{category.categoryName}</h2>
                {category.description && (
                  <p className="text-xs text-gray-500">{category.description}</p>
                )}
              </div>
              <span className="text-xs font-semibold bg-white border border-gray-200 px-2.5 py-1 rounded-full text-gray-600">
                {category.items?.length || 0} items
              </span>
            </div>

            <div className="divide-y divide-gray-100">
              {category.items?.length === 0 ? (
                <div className="p-6 text-center text-sm text-gray-400">
                  No dishes in this category yet.
                </div>
              ) : (
                category.items.map(item => (
                  <div key={item.id} className="p-4 sm:px-6 flex items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center gap-4 min-w-0">
                      <img
                        src={item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100'}
                        alt={item.name}
                        className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900 truncate">{item.name}</span>
                          <span className="text-xs">{item.vegetarian ? '🟢' : '🔴'}</span>
                          {!item.available && (
                            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-red-100 text-red-700">
                              Unavailable
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{item.description}</p>
                        <p className="text-sm font-bold text-primary-600 mt-1">{formatCurrency(item.price)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-2 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit Dish"
                      >
                        <HiOutlinePencil className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setDeletingId(item.id)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Deactivate Dish"
                      >
                        <HiOutlineTrash className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Item Modal (Create/Edit) */}
      {itemModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 my-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingItem ? 'Edit Dish' : 'Add New Dish'}
            </h2>
            <form onSubmit={handleSaveItem} className="space-y-4">
              <div>
                <label className="label text-xs">Category</label>
                <select
                  value={form.categoryId}
                  onChange={e => setForm({ ...form, categoryId: e.target.value })}
                  className="input-field text-sm"
                  required
                >
                  {categories.map(c => (
                    <option key={c.categoryId} value={c.categoryId}>
                      {c.categoryName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label text-xs">Dish Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Butter Naan"
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
                  placeholder="e.g. 180"
                  className="input-field text-sm"
                  required
                />
              </div>

              <div>
                <label className="label text-xs">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Ingredients, preparation, flavor..."
                  rows={2}
                  className="input-field text-sm resize-none"
                />
              </div>

              <div>
                <label className="label text-xs">Image URL</label>
                <input
                  type="url"
                  value={form.imageUrl}
                  onChange={e => setForm({ ...form, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="input-field text-sm"
                />
              </div>

              <div className="flex gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    checked={form.vegetarian}
                    onChange={e => setForm({ ...form, vegetarian: e.target.checked })}
                    className="rounded text-primary-600 focus:ring-primary-500 w-4 h-4"
                  />
                  <span>Vegetarian</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    checked={form.available}
                    onChange={e => setForm({ ...form, available: e.target.checked })}
                    className="rounded text-primary-600 focus:ring-primary-500 w-4 h-4"
                  />
                  <span>Available in Menu</span>
                </label>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setItemModal(false)}
                  className="btn-secondary py-2 px-4 text-sm"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary py-2 px-5 text-sm">
                  Save Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete / Deactivate Confirm */}
      <ConfirmModal
        open={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Deactivate Menu Item"
        message="Are you sure you want to mark this dish as unavailable in the menu?"
        confirmLabel="Deactivate"
        danger
      />
    </div>
  )
}