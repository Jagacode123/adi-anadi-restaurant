import { useState } from 'react'
import toast from 'react-hot-toast'
import { HiOutlineLocationMarker, HiOutlinePhone, HiOutlineMail, HiOutlineClock } from 'react-icons/hi'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all required fields.')
      return
    }
    setSubmitted(true)
    toast.success('Thank you! Your message has been received.')
    setForm({ name: '', email: '', phone: '', message: '' })
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gray-900 text-white py-16 text-center px-4">
        <h1 className="font-display text-4xl sm:text-5xl font-bold mb-3">Contact Us</h1>
        <p className="text-gray-400 text-base sm:text-lg">We would love to hear from you. Get in touch with us.</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Details & Timings */}
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-3xl font-bold text-gray-900 mb-2">Visit Adi Anadi</h2>
              <p className="text-gray-500 text-sm">
                Located conveniently in the Near State Bank Of India main road of Gupti.
              </p>
            </div>

            <div className="space-y-4">
              <div className="card flex items-start gap-4 p-5">
                <HiOutlineLocationMarker className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Restaurant Address</h3>
                  <p className="text-sm text-gray-600 mt-0.5">
                    Near State Bank Of India, Gupti, Odisha 754225
                  </p>
                </div>
              </div>

              <div className="card flex items-start gap-4 p-5">
                <HiOutlinePhone className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Phone Inquiries & Reservations</h3>
                  <p className="text-sm text-gray-600 mt-0.5">
                    <a href="tel:+91-8658027528" className="hover:text-primary-600">+91-8658027528</a> / <a href="tel:+91-9348800297" className="hover:text-primary-600">+91-9348800297</a>
                  </p>
                </div>
              </div>

              <div className="card flex items-start gap-4 p-5">
                <HiOutlineMail className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Email</h3>
                  <p className="text-sm text-gray-600 mt-0.5">
                    <a href="mailto:achyutaswain2021@gmail.com" className="hover:text-primary-600">achyutaswain2021@gmail.com</a>
                  </p>
                </div>
              </div>

              <div className="card flex items-start gap-4 p-5">
                <HiOutlineClock className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">Service Hours</h3>
                  <p className="text-sm text-gray-600 mt-0.5">
                    Monday to Sunday: 11:00 AM – 10:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Message Form */}
          <div className="card p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Send Us a Message</h3>
            <p className="text-sm text-gray-500 mb-6">
              Have questions regarding party bookings, private catering, or special dietary requirements? Let us know.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label text-xs">Your Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Ramesh Mohapatra"
                  className="input-field text-sm"
                  required
                />
              </div>

              <div>
                <label className="label text-xs">Email Address</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className="input-field text-sm"
                  required
                />
              </div>

              <div>
                <label className="label text-xs">Mobile Number (Optional)</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  placeholder="10-digit mobile"
                  className="input-field text-sm"
                />
              </div>

              <div>
                <label className="label text-xs">Your Message</label>
                <textarea
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  placeholder="How can we assist you?"
                  rows={4}
                  className="input-field text-sm resize-none"
                  required
                />
              </div>

              <button type="submit" className="btn-primary w-full py-3 text-sm font-bold">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}