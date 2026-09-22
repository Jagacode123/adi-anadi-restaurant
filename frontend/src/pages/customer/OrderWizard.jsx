import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { menuService } from '../../services/menuService'
import { orderService } from '../../services/orderService'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
import { formatCurrency } from '../../utils/formatters'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'
import toast from 'react-hot-toast'

const STEPS = ['Booking Info', 'Select Food', 'Extra Items', 'Review & Submit']

// ─── Step 1: Booking Info ────────────────────────────────────────────────────
function Step1({ bookingInfo, setBookingInfo, errors }) {
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      setBookingInfo({ customerName: user.name, mobile: user.mobile, email: user.email })
    }
  }, [user]) // eslint-disable-line

  function change(field, value) {
    setBookingInfo({ [field]: value })
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="space-y-5 max-w-lg mx-auto">
      <h2 className="font-display text-2xl font-bold text-gray-900">Booking Information</h2>

      {/* Guests */}
      <div>
        <label className="label">Number of Guests</label>
        <div className="flex items-center gap-4 mt-1">
          <button type="button"
            onClick={() => change('guestCount', Math.max(1, bookingInfo.guestCount - 1))}
            className="w-11 h-11 rounded-full border-2 border-gray-300 text-xl font-bold text-gray-600
                       hover:border-primary-400 hover:text-primary-600 transition-colors flex items-center justify-center">
            −
          </button>
          <span className="text-2xl font-bold text-gray-900 min-w-[3ch] text-center">
            {bookingInfo.guestCount}
          </span>
          <button type="button"
            onClick={() => change('guestCount', bookingInfo.guestCount + 1)}
            className="w-11 h-11 rounded-full border-2 border-gray-300 text-xl font-bold text-gray-600
                       hover:border-primary-400 hover:text-primary-600 transition-colors flex items-center justify-center">
            +
          </button>
        </div>
        {errors.guestCount && <p className="text-xs text-red-600 mt-1">{errors.guestCount}</p>}
      </div>

      {/* Date */}
      <div>
        <label className="label">Booking Date</label>
        <input type="date" min={today} value={bookingInfo.bookingDate}
          onChange={e => change('bookingDate', e.target.value)} className="input-field" />
        {errors.bookingDate && <p className="text-xs text-red-600 mt-1">{errors.bookingDate}</p>}
      </div>

      {/* Time */}
      <div>
        <label className="label">Preferred Time</label>
        <select value={bookingInfo.bookingTime} onChange={e => change('bookingTime', e.target.value)}
          className="input-field">
          <option value="">Select a time</option>
          {['11:00','11:30','12:00','12:30','13:00','13:30','14:00',
            '18:00','18:30','19:00','19:30','20:00','20:30','21:00','21:30','22:00'].map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        {errors.bookingTime && <p className="text-xs text-red-600 mt-1">{errors.bookingTime}</p>}
      </div>

      {/* Name */}
      <div>
        <label className="label">Your Name</label>
        <input value={bookingInfo.customerName} onChange={e => change('customerName', e.target.value)}
          placeholder="Full name" className="input-field" />
        {errors.customerName && <p className="text-xs text-red-600 mt-1">{errors.customerName}</p>}
      </div>

      {/* Mobile */}
      <div>
        <div className="flex items-center justify-between">
          <label className="label mb-1">
            Mobile Number <span className="text-red-500 font-bold">*</span>
          </label>
          <span className="text-xs font-semibold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
            Mandatory to Book
          </span>
        </div>
        <div className="relative mt-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500 text-sm font-medium">
            +91
          </div>
          <input
            type="tel"
            required
            value={bookingInfo.mobile || ''}
            onChange={e => {
              const val = e.target.value.replace(/\D/g, '').slice(0, 10)
              change('mobile', val)
            }}
            placeholder="10-digit mobile number"
            className={`input-field pl-12 ${errors.mobile ? 'border-red-500 focus:ring-red-500' : ''}`}
            inputMode="numeric"
            maxLength={10}
          />
        </div>
        {errors.mobile ? (
          <p className="text-xs text-red-600 mt-1 font-medium">{errors.mobile}</p>
        ) : (
          <p className="text-xs text-gray-400 mt-1">We will send booking confirmation & updates to this number.</p>
        )}
      </div>

      {/* Special instructions */}
      <div>
        <label className="label">Special Instructions (optional)</label>
        <textarea value={bookingInfo.specialInstructions}
          onChange={e => change('specialInstructions', e.target.value)}
          placeholder="Window seat, birthday decoration, dietary restrictions..."
          rows={3} className="input-field resize-none" />
      </div>
    </div>
  )
}

// ─── Step 2: Select Food ─────────────────────────────────────────────────────
function Step2({ menuData, items, onUpdateQty }) {
  const [activeCategory, setActiveCategory] = useState(menuData[0]?.categoryId)
  const activeSection = menuData.find(s => s.categoryId === activeCategory)
  const selectedCount = items.reduce((s, i) => s + i.quantity, 0)

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-2xl font-bold text-gray-900">Select Food Items</h2>
        {selectedCount > 0 && (
          <span className="badge-approved">{selectedCount} items selected</span>
        )}
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {menuData.map(section => (
          <button key={section.categoryId}
            onClick={() => setActiveCategory(section.categoryId)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-colors
              ${activeCategory === section.categoryId
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {section.categoryName}
          </button>
        ))}
      </div>

      {/* Items */}
      <div className="space-y-3">
        {activeSection?.items?.map(item => {
          const sel = items.find(i => i.menuItem.id === item.id)
          const qty = sel?.quantity || 0

          return (
            <div key={item.id}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all
                ${qty > 0 ? 'border-primary-300 bg-primary-50' : 'border-gray-200 bg-white'}`}>
              <img src={item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100'}
                alt={item.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900 truncate">{item.name}</span>
                  <span className={`text-xs ${item.vegetarian ? 'text-green-600' : 'text-orange-600'}`}>
                    {item.vegetarian ? '🟢' : '🔴'}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{item.description}</p>
                <p className="text-primary-600 font-bold mt-1">{formatCurrency(item.price)}<span className="text-xs text-gray-400 font-normal"> / plate</span></p>
              </div>
              {/* Quantity control */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {qty > 0 ? (
                  <>
                    <button onClick={() => onUpdateQty(item, qty - 1)}
                      className="w-8 h-8 rounded-full bg-white border border-gray-300 text-gray-700
                                 hover:border-primary-400 flex items-center justify-center font-bold">−</button>
                    <span className="w-6 text-center font-bold text-gray-900">{qty}</span>
                    <button onClick={() => onUpdateQty(item, qty + 1)}
                      className="w-8 h-8 rounded-full bg-primary-500 text-white
                                 hover:bg-primary-600 flex items-center justify-center font-bold">+</button>
                  </>
                ) : (
                  <button onClick={() => onUpdateQty(item, 1)}
                    className="px-4 py-1.5 rounded-full bg-primary-500 text-white text-sm font-semibold
                               hover:bg-primary-600 transition-colors">
                    Add
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Step 3: Extra Items ─────────────────────────────────────────────────────
function Step3({ extraItemsList, extraItems, onUpdateExtraQty }) {
  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-gray-900 mb-6">Extra Items</h2>
      <p className="text-gray-500 text-sm mb-6">Add complements to your meal.</p>
      <div className="space-y-3">
        {extraItemsList.map(extra => {
          const sel = extraItems.find(i => i.extraItem.id === extra.id)
          const qty = sel?.quantity || 0
          return (
            <div key={extra.id}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all
                ${qty > 0 ? 'border-primary-300 bg-primary-50' : 'border-gray-200 bg-white'}`}>
              <div>
                <p className="font-semibold text-gray-900">{extra.name}</p>
                <p className="text-primary-600 font-bold text-sm">{formatCurrency(extra.price)}</p>
              </div>
              <div className="flex items-center gap-2">
                {qty > 0 ? (
                  <>
                    <button onClick={() => onUpdateExtraQty(extra, qty - 1)}
                      className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center font-bold text-gray-700 hover:border-primary-400">−</button>
                    <span className="w-6 text-center font-bold">{qty}</span>
                    <button onClick={() => onUpdateExtraQty(extra, qty + 1)}
                      className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center font-bold hover:bg-primary-600">+</button>
                  </>
                ) : (
                  <button onClick={() => onUpdateExtraQty(extra, 1)}
                    className="px-4 py-1.5 rounded-full bg-primary-500 text-white text-sm font-semibold hover:bg-primary-600">
                    Add
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Step 4: Review & Submit ─────────────────────────────────────────────────
function Step4({ bookingInfo, items, extraItems, subtotal, extraTotal, grandTotal, onSubmit, submitting, error }) {
  return (
    <div className="max-w-lg mx-auto">
      <h2 className="font-display text-2xl font-bold text-gray-900 mb-6">Review Your Order</h2>

      {/* Booking summary */}
      <div className="card mb-5">
        <h3 className="font-semibold text-gray-800 mb-3">Booking Details</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div><p className="text-gray-400 text-xs">Name</p><p className="font-medium">{bookingInfo.customerName || 'Guest'}</p></div>
          <div><p className="text-gray-400 text-xs">Mobile (Mandatory)</p><p className="font-semibold text-primary-600">+91 {bookingInfo.mobile}</p></div>
          <div><p className="text-gray-400 text-xs">Guests</p><p className="font-medium">{bookingInfo.guestCount} {bookingInfo.guestCount === 1 ? 'Guest' : 'Guests'}</p></div>
          <div><p className="text-gray-400 text-xs">Date & Time</p><p className="font-medium">{bookingInfo.bookingDate} at {bookingInfo.bookingTime}</p></div>
        </div>
      </div>

      {/* Items */}
      <div className="card mb-5">
        <h3 className="font-semibold text-gray-800 mb-3">Food Items</h3>
        <div className="space-y-2">
          {items.map(i => (
            <div key={i.menuItem.id} className="flex justify-between text-sm">
              <span className="text-gray-700">{i.menuItem.name} × {i.quantity}</span>
              <span className="font-medium">{formatCurrency(i.menuItem.price * i.quantity)}</span>
            </div>
          ))}
        </div>
        {extraItems.length > 0 && (
          <>
            <div className="border-t my-3" />
            <h3 className="font-semibold text-gray-800 mb-3 text-sm">Extra Items</h3>
            <div className="space-y-2">
              {extraItems.map(i => (
                <div key={i.extraItem.id} className="flex justify-between text-sm">
                  <span className="text-gray-700">{i.extraItem.name} × {i.quantity}</span>
                  <span className="font-medium">{formatCurrency(i.extraItem.price * i.quantity)}</span>
                </div>
              ))}
            </div>
          </>
        )}
        <div className="border-t mt-3 pt-3 space-y-1.5 text-sm">
          <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
          <div className="flex justify-between text-gray-500"><span>Extras</span><span>{formatCurrency(extraTotal)}</span></div>
          <div className="flex justify-between font-bold text-gray-900 text-base pt-1 border-t">
            <span>Grand Total</span><span className="text-primary-600">{formatCurrency(grandTotal)}</span>
          </div>
        </div>
      </div>

      <ErrorMessage message={error} />

      <button onClick={onSubmit} disabled={submitting}
        className="btn-primary w-full py-4 text-base mt-2">
        {submitting ? <LoadingSpinner size="sm" /> : 'Submit Order Request'}
      </button>
      <p className="text-xs text-gray-400 text-center mt-3">
        The restaurant will review your request and confirm shortly.
      </p>
    </div>
  )
}

// ─── Main Wizard ─────────────────────────────────────────────────────────────
export default function OrderWizard() {
  const navigate = useNavigate()
  const {
    bookingInfo, setBookingInfo,
    items, addItem, updateItemQty,
    extraItems, addExtraItem, updateExtraQty,
    subtotal, extraTotal, grandTotal,
    clearCart,
  } = useCart()

  const [step, setStep]             = useState(0)
  const [menuData, setMenuData]     = useState([])
  const [extraList, setExtraList]   = useState([])
  const [loadingMenu, setLoadingMenu] = useState(true)
  const [errors, setErrors]         = useState({})
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    Promise.all([menuService.getMenu(), menuService.getExtraItems()])
      .then(([menuRes, extraRes]) => {
        setMenuData(menuRes.data.data || [])
        setExtraList(extraRes.data.data || [])
      })
      .finally(() => setLoadingMenu(false))
  }, [])

  function validateStep1() {
    const errs = {}
    if (bookingInfo.guestCount < 1)       errs.guestCount = 'At least 1 guest required.'
    if (!bookingInfo.bookingDate)          errs.bookingDate = 'Please select a date.'
    if (!bookingInfo.bookingTime)          errs.bookingTime = 'Please select a time.'
    if (!bookingInfo.customerName?.trim()) errs.customerName = 'Name is required.'

    const mob = (bookingInfo.mobile || '').trim()
    if (!mob) {
      errs.mobile = 'Mobile number is mandatory. You cannot book an order without entering a mobile number.'
    } else if (!/^\d{10}$/.test(mob)) {
      errs.mobile = 'Please enter a valid 10-digit mobile number.'
    }
    return errs
  }

  function handleNext() {
    if (step === 0) {
      const errs = validateStep1()
      if (Object.keys(errs).length) { setErrors(errs); return }
    }
    if (step === 1 && items.length === 0) {
      toast.error('Please select at least one food item.')
      return
    }
    setErrors({})
    setStep(s => s + 1)
  }

  async function handleSubmit() {
    const mob = (bookingInfo.mobile || '').trim()
    if (!mob || !/^\d{10}$/.test(mob)) {
      toast.error('Mobile number is mandatory to book the order.')
      setStep(0)
      setErrors(prev => ({
        ...prev,
        mobile: 'Mobile number is mandatory. You cannot book an order without a mobile number.',
      }))
      return
    }

    setSubmitting(true)
    setSubmitError('')
    try {
      const payload = {
        customerName:        bookingInfo.customerName?.trim() || 'Guest',
        mobile:              mob,
        email:               bookingInfo.email?.trim() || '',
        guestCount:          bookingInfo.guestCount,
        bookingDate:         bookingInfo.bookingDate,
        bookingTime:         bookingInfo.bookingTime,
        specialInstructions: bookingInfo.specialInstructions,
        items: items.map(i => ({ menuItemId: i.menuItem.id, quantity: i.quantity })),
        extraItems: extraItems.map(i => ({ extraItemId: i.extraItem.id, quantity: i.quantity })),
      }
      const res = await orderService.createOrder(payload)
      clearCart()
      toast.success('Order request submitted successfully!')
      navigate(`/orders/${res.data.data.id}`)
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to submit order. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loadingMenu) return <LoadingSpinner size="lg" className="py-32" />

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Step indicator */}
      <div className="mb-8">
        <div className="flex items-center">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center flex-1 last:flex-none">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold flex-shrink-0
                ${i < step ? 'bg-green-500 text-white' : i === step ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className={`ml-2 text-xs font-medium hidden sm:block
                ${i === step ? 'text-primary-600' : 'text-gray-400'}`}>
                {label}
              </span>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-3 ${i < step ? 'bg-green-400' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="min-h-[400px]">
        {step === 0 && <Step1 bookingInfo={bookingInfo} setBookingInfo={setBookingInfo} errors={errors} />}
        {step === 1 && (
          <Step2
            menuData={menuData}
            items={items}
            onUpdateQty={(item, qty) => {
              const exists = items.find(i => i.menuItem.id === item.id)
              if (exists) updateItemQty(item.id, qty)
              else addItem(item)
            }}
          />
        )}
        {step === 2 && (
          <Step3
            extraItemsList={extraList}
            extraItems={extraItems}
            onUpdateExtraQty={(extra, qty) => {
              const exists = extraItems.find(i => i.extraItem.id === extra.id)
              if (exists) updateExtraQty(extra.id, qty)
              else addExtraItem(extra)
            }}
          />
        )}
        {step === 3 && (
          <Step4
            bookingInfo={bookingInfo}
            items={items}
            extraItems={extraItems}
            subtotal={subtotal}
            extraTotal={extraTotal}
            grandTotal={grandTotal}
            onSubmit={handleSubmit}
            submitting={submitting}
            error={submitError}
          />
        )}
      </div>

      {/* Navigation */}
      {step < 3 && (
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
          <button
            onClick={() => setStep(s => s - 1)}
            disabled={step === 0}
            className="btn-secondary py-2.5 px-6 text-sm disabled:opacity-40"
          >
            ← Back
          </button>
          <div className="flex items-center gap-3">
            {step > 0 && (
              <span className="text-sm text-gray-500">
                {formatCurrency(grandTotal)} total
              </span>
            )}
            <button onClick={handleNext} className="btn-primary py-2.5 px-6 text-sm">
              {step === 2 ? 'Review Order' : 'Next →'}
            </button>
          </div>
        </div>
      )}

      {/* Mobile sticky cart summary for step 1 & 2 */}
      {step === 1 && items.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 sm:hidden z-30">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700 font-medium">
              {items.reduce((s, i) => s + i.quantity, 0)} items · {formatCurrency(subtotal)}
            </span>
            <button onClick={handleNext} className="btn-primary py-2 px-5 text-sm">
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
