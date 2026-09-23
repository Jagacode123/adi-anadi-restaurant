import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../../services/authService'
import { useAuth } from '../../context/AuthContext'
import ErrorMessage from '../../components/common/ErrorMessage'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

export default function AdminLoginPage() {
  const [form, setForm]     = useState({ email: '', password: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const { login }           = useAuth()
  const navigate            = useNavigate()

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const res  = await authService.login(form)
      const data = res.data.data
      if (data.user.role !== 'ADMIN') {
        setError('Access denied. This login is for restaurant staff only.')
        return
      }
      login(data.token, data.user)
      toast.success('Welcome back!')
      navigate('/admin/dashboard')
    } catch (err) {
      if (!err.response) {
        setError('Server is starting up or taking a moment to respond. Please wait 10-20 seconds and click Sign In again.')
      } else {
        setError(err.response?.data?.message || 'Invalid credentials.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-5xl">🍛</span>
          <h1 className="font-display text-3xl font-bold text-white mt-4">Admin Portal</h1>
          <p className="text-gray-400 mt-1">Adi Anadi Restaurant</p>
        </div>
        <div className="bg-gray-800 rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
              <input
                type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="admin@adianadi.com"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white
                           placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500
                           focus:border-transparent transition-all"
                autoComplete="email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
              <input
                type="password" name="password" value={form.password} onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white
                           placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500
                           focus:border-transparent transition-all"
                autoComplete="current-password"
              />
            </div>
            {error && (
              <div className="bg-red-900/50 border border-red-700 rounded-lg px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}
            <button type="submit" disabled={loading}
              className="w-full btn-primary py-3">
              {loading ? <LoadingSpinner size="sm" /> : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
