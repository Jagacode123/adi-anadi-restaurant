import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { menuService } from '../../services/menuService'
import { formatCurrency } from '../../utils/formatters'
import LoadingSpinner from '../../components/common/LoadingSpinner'

export default function MenuPage() {
  const [categories, setCategories] = useState([])
  const [menuData, setMenuData]     = useState([]) // [{category, items[]}]
  const [activeTab, setActiveTab]   = useState(null)
  const [loading, setLoading]       = useState(true)

  useEffect(() => {
    menuService.getMenu()
      .then(res => {
        const data = res.data.data || []
        setMenuData(data)
        if (data.length > 0) setActiveTab(data[0].categoryId)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const activeSection = menuData.find(s => s.categoryId === activeTab)

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gray-900 text-white py-16 text-center">
        <h1 className="font-display text-5xl font-bold mb-3">Our Menu</h1>
        <p className="text-gray-400 text-lg">Fresh, flavourful, and made with love</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <LoadingSpinner size="lg" className="py-20" />
        ) : (
          <>
            {/* Category tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
              {menuData.map(section => (
                <button
                  key={section.categoryId}
                  onClick={() => setActiveTab(section.categoryId)}
                  className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold transition-colors
                    ${activeTab === section.categoryId
                      ? 'bg-primary-500 text-white'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300'
                    }`}
                >
                  {section.categoryName}
                </button>
              ))}
            </div>

            {/* Items grid */}
            {activeSection && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeSection.items.map(item => (
                  <div key={item.id} className="card overflow-hidden p-0 hover:shadow-card-hover transition-shadow group">
                    <div className="relative overflow-hidden">
                      <img
                        src={item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'}
                        alt={item.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {!item.available && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="text-white font-semibold text-sm bg-black/60 px-3 py-1 rounded-full">
                            Unavailable
                          </span>
                        </div>
                      )}
                      <span className={`absolute top-3 right-3 text-xs font-bold px-2 py-1 rounded-full
                                        ${item.vegetarian ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                        {item.vegetarian ? '🟢 Veg' : '🔴 Non-Veg'}
                      </span>
                    </div>
                    <div className="p-5">
                      <h3 className="font-semibold text-gray-900 text-lg mb-1">{item.name}</h3>
                      <p className="text-sm text-gray-500 mb-4 line-clamp-2">{item.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-primary-600 font-bold text-xl">{formatCurrency(item.price)}</span>
                        <Link to="/order/new" className="btn-primary text-sm py-2 px-4">
                          Add to Order
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Bottom CTA */}
            <div className="text-center mt-16 bg-primary-50 rounded-2xl p-10">
              <h2 className="font-display text-3xl font-bold text-gray-900 mb-3">
                Ready to place your order?
              </h2>
              <p className="text-gray-600 mb-6">Select your food, pick a date and time, and we'll take care of the rest.</p>
              <Link to="/order/new" className="btn-primary py-4 px-10 text-base">
                Book / Order Now
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
