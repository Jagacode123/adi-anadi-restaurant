import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🍛</span>
              <span className="font-display font-bold text-white text-lg">Adi Anadi</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Authentic Indian cuisine served with love. Experience the rich flavors of Odisha.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {[['/', 'Home'], ['/menu', 'Menu'], ['/reviews', 'Reviews'], ['/about', 'About'], ['/contact', 'Contact']].map(([path, label]) => (
                <li key={path}>
                  <Link to={path} className="hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-white font-semibold mb-4">Opening Hours</h3>
            <ul className="space-y-1 text-sm">
              <li>Mon – Fri: 11:00 AM – 10:00 PM</li>
              <li>Sat – Sun: 11:00 AM – 10:00 PM</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li>📍 </li>
              <li>Near State Of India, Gupti, Odisha 754225</li>
              <li>📞 +91-8658027528 / 9348800297</li>
              <li>✉️ achyutaswain2021@gmail.com</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-800 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Adi Anadi Restaurant. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
