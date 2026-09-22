import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../../services/authService'
import { useAuth } from '../../context/AuthContext'
import ErrorMessage from '../../components/common/ErrorMessage'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const [form, setForm]     = useState({ name: '', mobile: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const { login }           = useAuth()
  const navigate            = useNavigate()

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setErrors(prev => ({ ...prev, [e.target.name]: '' }))
  }

  function validate() {
    const errs = {}
    if (!form.name.trim())         errs.name = 'Name is required.'
    if (!/^\d{10}$/.test(form.mobile)) errs.mobile = 'Enter a valid 10-digit mobile number.'
    if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email address.'
    if (form.password.length < 8)  errs.password = 'Password must be at least 8 characters.'
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match.'
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setLoading(true)
    try {
      const res  = await authService.register(form)
      const data = res.data.data
      login(data.token, data.user)
      toast.success('Account created! Welcome.')
      navigate('/')
    } catch (err) {
      if (!err.response) {
        setErrors({ form: 'Cannot connect to backend server. Please ensure the backend is running on port 8080.' })
      } else {
        const msg = err.response?.data?.message || 'Registration failed.'
        setErrors({ form: msg })
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
          <h1 className="font-display text-3xl font-bold text-gray-900 mt-4">Create Account</h1>
          <p className="text-gray-500 mt-1">Join us and start ordering</p>
        </div>
        <div className="card">
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <input name="name" value={form.name} onChange={handleChange}
                placeholder="Jagannath Panda" className="input-field" />
              {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="label">Mobile Number</label>
              <input name="mobile" value={form.mobile} onChange={handleChange}
                placeholder="9876543210" className="input-field" inputMode="tel" />
              {errors.mobile && <p className="text-xs text-red-600 mt-1">{errors.mobile}</p>}
            </div>
            <div>
              <label className="label">Email Address</label>
              <input name="email" type="email" value={form.email} onChange={handleChange}
                placeholder="you@example.com" className="input-field" />
              {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="label">Password</label>
              <input name="password" type="password" value={form.password} onChange={handleChange}
                placeholder="Min 8 characters" className="input-field" />
              {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
            </div>
            <div>
              <label className="label">Confirm Password</label>
              <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange}
                placeholder="Repeat password" className="input-field" />
              {errors.confirmPassword && <p className="text-xs text-red-600 mt-1">{errors.confirmPassword}</p>}
            </div>
            {errors.form && <ErrorMessage message={errors.form} />}
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-2">
              {loading ? <LoadingSpinner size="sm" /> : 'Create Account'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
