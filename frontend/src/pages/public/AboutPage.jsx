import { Link } from 'react-router-dom'

export default function AboutPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gray-900 text-white py-20 text-center px-4">
        <span className="text-primary-400 text-sm font-semibold uppercase tracking-widest block mb-2">Our Culinary Heritage</span>
        <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">About Adi Anadi Restaurant</h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-base sm:text-lg">
          Celebrating the soul, spices, and centuries-old culinary traditions of Odisha.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <h2 className="font-display text-3xl font-bold text-gray-900">A Journey Through Flavours</h2>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              Founded in the heart of Bhitarkanika, Adi Anadi Restaurant was born out of deep reverence for traditional Odishan culinary art. From our signature Mati Handi Mutton Thali and Special Dum Biriyani to fresh Bhitarkanika crab and prawn delicacies and pure vegetarian thalis, every meal is prepared following age-old family recipes.
            </p>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              We source fresh local produce, hand-ground spices, and pure cow ghee to ensure every morsel delivers authentic flavours that remind you of home.
            </p>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800"
              alt="Restaurant Dining Area"
              className="rounded-2xl shadow-xl w-full h-80 sm:h-96 object-cover"
            />
          </div>
        </div>

        {/* Pillars / Values Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="card text-center space-y-3 p-8">
            <span className="text-4xl block">🌿</span>
            <h3 className="font-bold text-gray-900 text-lg">Pure & Natural</h3>
            <p className="text-sm text-gray-500">
              No artificial colorants or preservatives. We rely entirely on natural spices and wholesome ingredients.
            </p>
          </div>

          <div className="card text-center space-y-3 p-8">
            <span className="text-4xl block">🥘</span>
            <h3 className="font-bold text-gray-900 text-lg">Clay Oven & Tandoor</h3>
            <p className="text-sm text-gray-500">
              Freshly baked rotis and tandoori breads, straight from the oven to your table.
            </p>
          </div>

          <div className="card text-center space-y-3 p-8">
            <span className="text-4xl block">✨</span>
            <h3 className="font-bold text-gray-900 text-lg">Hygienic Kitchen</h3>
            <p className="text-sm text-gray-500">
              Adhering to the highest standards of food safety, preparation hygiene, and guest care.
            </p>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-primary-500 text-white rounded-2xl p-8 sm:p-12 text-center space-y-4">
          <h2 className="font-display text-3xl font-bold">Ready to Experience Adi Anadi?</h2>
          <p className="text-primary-100 max-w-xl mx-auto text-sm sm:text-base">
            Reserve your table and pre-order your favourite dishes online for a smooth, delightful dining experience.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <Link to="/order/new" className="bg-white text-primary-600 font-bold px-8 py-3.5 rounded-lg hover:bg-primary-50 transition-colors">
              Book / Order Now
            </Link>
            <Link to="/menu" className="bg-primary-600 text-white font-bold px-8 py-3.5 rounded-lg hover:bg-primary-700 transition-colors border border-white/20">
              Explore Menu
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}