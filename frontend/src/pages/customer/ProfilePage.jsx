import { useEffect, useState } from 'react'
import { orderService } from '../../services/orderService'
import { useAuth } from '../../context/AuthContext'
import { formatDateTime } from '../../utils/formatters'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'
import { HiOutlineUser, HiOutlinePhone, HiOutlineMail, HiOutlineLockClosed } from 'react-icons/hi'

export default function ProfilePage() {
  const { user: authUser, login, token } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    name: '',
    mobile: '',
    password: '',
    confirmPassword: '',
  })

  async function loadProfile() {
    try {
      const res = await orderService.getProfile()
      const data = res.data.data
      setProfile(data)
      setForm(f => ({
        ...f,
        name: data.name || '',
        mobile: data.mobile || '',
      }))
    } catch {
      toast.error('Failed to load profile.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProfile()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim() || !form.mobile.trim()) {
      toast.error('Name and mobile number are required.')
      return
    }

    if (form.password && form.password !== form.confirmPassword) {
      toast.error('Passwords do not match.')
      return
    }

    setSaving(true)
    try {
      const payload = {
        name: form.name.trim(),
        mobile: form.mobile.trim(),
      }
      if (form.password) payload.password = form.password

      const res = await orderService.updateProfile(payload)
      const updated = res.data.data
      setProfile(updated)
      login(token, updated)
      setForm(f => ({ ...f, password: '', confirmPassword: '' }))
      toast.success('Profile updated successfully!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingSpinner size="lg" className="py-32" />

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your personal information and contact details.</p>
      </div>

      {/* Profile Card */}
      <div className="card space-y-6">
        <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
          <div className="w-16 h-16 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-display text-2xl font-bold">
            {profile?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{profile?.name}</h2>
            <p className="text-sm text-gray-500">{profile?.email}</p>
            <span className="inline-block mt-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
              {profile?.role || 'CUSTOMER'}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label text-xs">Full Name</label>
            <div className="relative">
              <HiOutlineUser className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="input-field pl-10 text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="label text-xs">Mobile Number</label>
            <div className="relative">
              <HiOutlinePhone className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
              <input
                type="tel"
                value={form.mobile}
                onChange={e => setForm({ ...form, mobile: e.target.value })}
                className="input-field pl-10 text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="label text-xs">Email Address (Read-only)</label>
            <div className="relative">
              <HiOutlineMail className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
              <input
                type="email"
                value={profile?.email || ''}
                disabled
                className="input-field pl-10 text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <h3 className="text-sm font-bold text-gray-800 mb-3">Change Password (Optional)</h3>
            <div className="space-y-3">
              <div>
                <label className="label text-xs">New Password</label>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                  <input
                    type="password"
                    placeholder="Leave blank to keep unchanged"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    className="input-field pl-10 text-sm"
                  />
                </div>
              </div>

              {form.password && (
                <div>
                  <label className="label text-xs">Confirm New Password</label>
                  <div className="relative">
                    <HiOutlineLockClosed className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                    <input
                      type="password"
                      placeholder="Repeat new password"
                      value={form.confirmPassword}
                      onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                      className="input-field pl-10 text-sm"
                      required
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <span className="text-xs text-gray-400">
              Member since {formatDateTime(profile?.createdAt)}
            </span>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary py-2.5 px-6 text-sm"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}