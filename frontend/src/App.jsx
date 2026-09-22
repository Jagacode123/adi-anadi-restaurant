import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { NotificationProvider } from './context/NotificationContext'
import AppRoutes from './routes/AppRoutes'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <NotificationProvider>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
                borderRadius: '10px',
              },
              success: {
                style: { background: '#166534', color: '#fff' },
              },
              error: {
                style: { background: '#991b1b', color: '#fff' },
              },
            }}
          />
        </NotificationProvider>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
