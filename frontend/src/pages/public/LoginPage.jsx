import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../../services/authService'
import { useAuth } from '../../context/AuthContext'
import ErrorMessage from '../../components/common/ErrorMessage'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

export default function LoginPage() {
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
    if (!form.email || !form.password) {
      setError('Please enter your email and password.')
      return
    }
    setLoading(true)
    try {
      const res  = await authService.login(form)
      const data = res.data.data
      login(data.token, data.user)
      toast.success(`Welcome back, ${data.user.name}!`)
      if (data.user.role === 'ADMIN') navigate('/admin/dashboard')
      else navigate('/orders')
    } catch (err) {
      if (!err.response) {
        setError('Cannot connect to backend server. Please ensure the backend is running on port 8080.')
      } else {
        setError(err.response?.data?.message || 'Invalid email or password.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream-100 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-5xl">🍛</span>
          <h1 className="font-display text-3xl font-bold text-gray-900 mt-4">Welcome Back</h1>
          <p className="text-gray-500 mt-1">Sign in to your account</p>
        </div>
        <div className="card">
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <div>
              <label className="label">Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="input-field"
                autoComplete="email"
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="input-field"
                autoComplete="current-password"
              />
            </div>
            <ErrorMessage message={error} />
            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading ? <LoadingSpinner size="sm" /> : 'Sign In'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 font-semibold hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
