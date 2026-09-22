import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { menuService } from '../../services/menuService'
import { formatCurrency } from '../../utils/formatters'
import LoadingSpinner from '../../components/common/LoadingSpinner'

const features = [
  { icon: '🍛', title: 'Authentic Flavours', desc: 'Recipes passed down through generations of Odishan cooking tradition.' },
  { icon: '👨‍🍳', title: 'Master Chefs', desc: 'Our team of experienced chefs prepare every dish with love and skill.' },
  { icon: '🏡', title: 'Warm Ambience', desc: 'A welcoming space for families, friends, and celebrations.' },
  { icon: '📱', title: 'Easy Ordering', desc: 'Book your table and pre-order your meal in just a few taps.' },
]

export default function HomePage() {
  const [popularItems, setPopularItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    menuService.getMenu()
      .then(res => {
        const categories = res.data.data || []
        const allItems = categories.flatMap(cat => cat.items || [])
        setPopularItems(allItems.slice(0, 6))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      {/* ─── Hero ─── */}
      <section
        className="relative min-h-[80vh] sm:min-h-[90vh] lg:min-h-[95vh] flex flex-col justify-end items-center shadow-inner"
        style={{
          backgroundImage: 'url(/restaurant_hero.jpg)',
          backgroundPosition: 'top center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Soft bottom fade only so the entire restaurant banner, ice cream & Motu Patlu are 100% visible */}
        <div className="absolute inset-x-0 bottom-0 h-36 sm:h-40 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

        <div className="relative z-10 w-full max-w-xl mx-auto px-4 pb-8 sm:pb-12 text-center">
          <div className="flex flex-col sm:flex-row gap-3.5 justify-center">
            <Link
              to="/order/new"
              className="btn-primary text-base py-3.5 px-8 shadow-2xl hover:scale-105 transition-all text-center font-bold"
            >
              🍽️ Book / Order Now
            </Link>
            <Link
              to="/menu"
              className="btn-secondary text-base py-3.5 px-8 bg-white/95 text-gray-900 border-white hover:bg-white shadow-2xl hover:scale-105 transition-all text-center font-bold"
            >
              📜 View Menu
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Why choose us ─── */}
      <section className="py-20 bg-cream-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-display text-4xl font-bold text-gray-900 mb-3">Why Adi Anadi?</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              More than just food — we serve memories that last a lifetime.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(f => (
              <div key={f.title} className="card text-center hover:shadow-card-hover transition-shadow">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Popular Dishes ─── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-display text-4xl font-bold text-gray-900 mb-3">Popular Dishes</h2>
            <p className="text-gray-500">Our guests can't stop talking about these.</p>
          </div>
          {loading ? (
            <LoadingSpinner size="lg" className="py-20" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularItems.map(item => (
                <div key={item.id} className="card overflow-hidden p-0 hover:shadow-card-hover transition-shadow group">
                  <div className="relative overflow-hidden">
                    <img
                      src={item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'}
                      alt={item.name}
                      className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className={`absolute top-3 right-3 text-xs font-bold px-2 py-1 rounded-full
                                      ${item.vegetarian ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                      {item.vegetarian ? '🟢 Veg' : '🔴 Non-Veg'}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">{item.name}</h3>
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-primary-600 font-bold text-lg">{formatCurrency(item.price)}</span>
                      <Link to="/order/new" className="text-sm btn-primary py-1.5 px-4">
                        Order
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="text-center mt-10">
            <Link to="/menu" className="btn-secondary py-3 px-8">
              View Full Menu
            </Link>
          </div>
        </div>
      </section>

      {/* ─── About snippet ─── */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-primary-400 font-semibold text-sm uppercase tracking-widest block mb-4">Our Story</span>
              <h2 className="font-display text-4xl font-bold mb-6">
                A Taste of Odisha,<br />Straight from the Heart
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Adi Anadi Restaurant was founded with a simple mission: to bring the authentic, soul-warming
                flavours of Odishan cuisine to every table. Our recipes have been passed down through
                generations, and we take pride in preserving that culinary heritage.
              </p>
              <p className="text-gray-300 leading-relaxed mb-8">
                Whether you're celebrating a special occasion or simply craving a home-cooked meal,
                our team is here to make every visit memorable.
              </p>
              <Link to="/about" className="btn-primary py-3 px-8">
                Learn More
              </Link>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600"
                alt="Restaurant interior"
                className="rounded-2xl w-full h-80 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Hours & Contact ─── */}
      <section className="py-20 bg-cream-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Hours */}
            <div className="card">
              <div className="text-3xl mb-4">🕐</div>
              <h3 className="font-display font-bold text-xl text-gray-900 mb-4">Opening Hours</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex justify-between"><span>Monday – Friday</span><span className="font-medium">11:00 AM – 10:00 PM</span></li>
                <li className="flex justify-between"><span>Saturday</span><span className="font-medium">11:00 AM – 10:00 PM</span></li>
                <li className="flex justify-between"><span>Sunday</span><span className="font-medium">11:00 AM – 10:00 PM</span></li>
              </ul>
            </div>
            {/* Location */}
            <div className="card">
              <div className="text-3xl mb-4">📍</div>
              <h3 className="font-display font-bold text-xl text-gray-900 mb-4">Location</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Near State Bank of India<br />
                Gupti, Odisha 754225<br /><br />
                <a href="tel:+919348800297" className="text-primary-600 hover:underline font-medium">
                  +91-9348800297 / 8658027528
                </a>
              </p>
            </div>
            {/* CTA */}
            <div className="card bg-primary-500 text-white">
              <div className="text-3xl mb-4">🍽️</div>
              <h3 className="font-display font-bold text-xl mb-4">Ready to Order?</h3>
              <p className="text-sm text-primary-100 mb-6">
                Book your table and pre-order your favourite dishes in minutes.
              </p>
              <Link to="/order/new" className="inline-block bg-white text-primary-600 font-semibold
                                               py-3 px-6 rounded-lg hover:bg-primary-50 transition-colors">
                Book Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
