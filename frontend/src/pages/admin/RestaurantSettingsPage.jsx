import { useEffect, useState } from 'react'
import { adminService } from '../../services/adminService'
import { formatTime } from '../../utils/formatters'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import toast from 'react-hot-toast'
import { HiOutlineSave, HiOutlineClock } from 'react-icons/hi'

export default function RestaurantSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [savingConfig, setSavingConfig] = useState(false)
  const [config, setConfig] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    openingTime: '11:00',
    closingTime: '23:00',
    minGuests: 1,
    maxGuests: 100,
    advancePaymentRequired: false,
    advancePaymentPercentage: 0,
  })

  const [slots, setSlots] = useState([])
  const [slotForm, setSlotForm] = useState({ slotTime: '12:00', maxGuests: 50 })
  const [savingSlot, setSavingSlot] = useState(false)

  async function loadSettings() {
    try {
      const [configRes, slotsRes] = await Promise.all([
        adminService.getRestaurantConfig(),
        adminService.getTimeSlots(),
      ])
      const c = configRes.data.data
      if (c) {
        setConfig({
          name: c.name || '',
          phone: c.phone || '',
          email: c.email || '',
          address: c.address || '',
          openingTime: c.openingTime || '11:00',
          closingTime: c.closingTime || '23:00',
          minGuests: c.minGuests || 1,
          maxGuests: c.maxGuests || 100,
          advancePaymentRequired: c.advancePaymentRequired || false,
          advancePaymentPercentage: c.advancePaymentPercentage || 0,
        })
      }
      setSlots(slotsRes.data.data || [])
    } catch {
      toast.error('Failed to load restaurant settings.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSettings()
  }, [])

  async function handleSaveConfig(e) {
    e.preventDefault()
    setSavingConfig(true)
    try {
      await adminService.updateRestaurantConfig(config)
      toast.success('Restaurant settings saved!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save settings.')
    } finally {
      setSavingConfig(false)
    }
  }

  async function handleSaveSlot(e) {
    e.preventDefault()
    setSavingSlot(true)
    try {
      // Ensure time string format HH:mm:00
      let t = slotForm.slotTime
      if (t.split(':').length === 2) t += ':00'
      await adminService.saveTimeSlot({
        slotTime: t,
        maxGuests: Number(slotForm.maxGuests) || 1,
      })
      toast.success('Slot capacity saved!')
      const slotsRes = await adminService.getTimeSlots()
      setSlots(slotsRes.data.data || [])
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update time slot.')
    } finally {
      setSavingSlot(false)
    }
  }

  if (loading) return <LoadingSpinner size="lg" className="py-32" />

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Restaurant Configuration</h1>
        <p className="text-sm text-gray-500 mt-1">Configure restaurant operating hours, reservation guest thresholds, and table capacities.</p>
      </div>

      {/* General Settings */}
      <form onSubmit={handleSaveConfig} className="card space-y-5">
        <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">
          General Details & Operating Timings
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label text-xs">Restaurant Name</label>
            <input
              type="text"
              value={config.name}
              onChange={e => setConfig({ ...config, name: e.target.value })}
              className="input-field text-sm"
              required
            />
          </div>

          <div>
            <label className="label text-xs">Contact Phone</label>
            <input
              type="text"
              value={config.phone}
              onChange={e => setConfig({ ...config, phone: e.target.value })}
              className="input-field text-sm"
            />
          </div>

          <div>
            <label className="label text-xs">Contact Email</label>
            <input
              type="email"
              value={config.email}
              onChange={e => setConfig({ ...config, email: e.target.value })}
              className="input-field text-sm"
            />
          </div>

          <div>
            <label className="label text-xs">Address</label>
            <input
              type="text"
              value={config.address}
              onChange={e => setConfig({ ...config, address: e.target.value })}
              className="input-field text-sm"
            />
          </div>

          <div>
            <label className="label text-xs">Opening Time</label>
            <input
              type="time"
              value={config.openingTime}
              onChange={e => setConfig({ ...config, openingTime: e.target.value })}
              className="input-field text-sm"
            />
          </div>

          <div>
            <label className="label text-xs">Closing Time</label>
            <input
              type="time"
              value={config.closingTime}
              onChange={e => setConfig({ ...config, closingTime: e.target.value })}
              className="input-field text-sm"
            />
          </div>

          <div>
            <label className="label text-xs">Minimum Party Size</label>
            <input
              type="number"
              min="1"
              value={config.minGuests}
              onChange={e => setConfig({ ...config, minGuests: Number(e.target.value) })}
              className="input-field text-sm"
            />
          </div>

          <div>
            <label className="label text-xs">Maximum Party Size</label>
            <input
              type="number"
              min="1"
              value={config.maxGuests}
              onChange={e => setConfig({ ...config, maxGuests: Number(e.target.value) })}
              className="input-field text-sm"
            />
          </div>
        </div>

        <div className="flex justify-end pt-3">
          <button type="submit" disabled={savingConfig} className="btn-primary py-2.5 px-6 text-sm flex items-center gap-2">
            <HiOutlineSave className="w-4 h-4" />
            {savingConfig ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </form>

      {/* Time Slot Capacity Management */}
      <div className="card space-y-5">
        <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">
          Time Slot Guest Capacities
        </h2>
        <p className="text-xs text-gray-500">
          Define the maximum concurrent guest count allowed per 30-minute reservation window to prevent kitchen overload.
        </p>

        {/* Add / Update Capacity Form */}
        <form onSubmit={handleSaveSlot} className="bg-gray-50 p-4 rounded-xl flex flex-col sm:flex-row items-end gap-3">
          <div className="flex-1 w-full">
            <label className="label text-xs">Time Slot</label>
            <input
              type="time"
              value={slotForm.slotTime}
              onChange={e => setSlotForm({ ...slotForm, slotTime: e.target.value })}
              className="input-field text-sm bg-white"
              required
            />
          </div>

          <div className="flex-1 w-full">
            <label className="label text-xs">Max Guests Capacity</label>
            <input
              type="number"
              min="1"
              value={slotForm.maxGuests}
              onChange={e => setSlotForm({ ...slotForm, maxGuests: e.target.value })}
              className="input-field text-sm bg-white"
              placeholder="e.g. 50"
              required
            />
          </div>

          <button type="submit" disabled={savingSlot} className="btn-primary py-2.5 px-5 text-sm w-full sm:w-auto">
            {savingSlot ? 'Updating...' : 'Set Capacity'}
          </button>
        </form>

        {/* Existing Slots Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {slots.map(s => (
            <div key={s.id || s.slotTime} className="p-3 border border-gray-200 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-800 font-medium">
                <HiOutlineClock className="w-4 h-4 text-gray-400" />
                {formatTime(s.slotTime)}
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-primary-50 text-primary-700">
                {s.maxGuests} seats
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}