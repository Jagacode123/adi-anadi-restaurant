import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import PublicLayout   from '../layouts/PublicLayout'
import CustomerLayout from '../layouts/CustomerLayout'
import AdminLayout    from '../layouts/AdminLayout'
import ProtectedRoute from './ProtectedRoute'
import AdminRoute     from './AdminRoute'

// Public pages
import HomePage     from '../pages/public/HomePage'
import MenuPage     from '../pages/public/MenuPage'
import AboutPage    from '../pages/public/AboutPage'
import ContactPage  from '../pages/public/ContactPage'
import LoginPage    from '../pages/public/LoginPage'
import RegisterPage from '../pages/public/RegisterPage'
import ReviewsPage  from '../pages/public/ReviewsPage'

// Customer pages
import OrderWizard      from '../pages/customer/OrderWizard'
import MyOrdersPage     from '../pages/customer/MyOrdersPage'
import OrderDetailPage  from '../pages/customer/OrderDetailPage'
import ProfilePage      from '../pages/customer/ProfilePage'

// Admin pages
import AdminLoginPage            from '../pages/admin/AdminLoginPage'
import DashboardPage             from '../pages/admin/DashboardPage'
import PendingOrdersPage         from '../pages/admin/PendingOrdersPage'
import AllOrdersPage             from '../pages/admin/AllOrdersPage'
import AdminOrderDetailPage      from '../pages/admin/AdminOrderDetailPage'
import MenuManagementPage        from '../pages/admin/MenuManagementPage'
import CategoryManagementPage    from '../pages/admin/CategoryManagementPage'
import ExtraItemManagementPage   from '../pages/admin/ExtraItemManagementPage'
import CustomerManagementPage    from '../pages/admin/CustomerManagementPage'
import RestaurantSettingsPage    from '../pages/admin/RestaurantSettingsPage'

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route element={<PublicLayout />}>
          <Route path="/"           element={<HomePage />} />
          <Route path="/menu"       element={<MenuPage />} />
          <Route path="/about"      element={<AboutPage />} />
          <Route path="/contact"    element={<ContactPage />} />
          <Route path="/login"      element={<LoginPage />} />
          <Route path="/register"   element={<RegisterPage />} />
          <Route path="/order/new"  element={<OrderWizard />} />
          <Route path="/orders/:id" element={<OrderDetailPage />} />
          <Route path="/reviews"    element={<ReviewsPage />} />
        </Route>

        {/* Customer protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<CustomerLayout />}>
            <Route path="/orders"         element={<MyOrdersPage />} />
            <Route path="/profile"        element={<ProfilePage />} />
          </Route>
        </Route>

        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard"      element={<DashboardPage />} />
            <Route path="/admin/orders/pending" element={<PendingOrdersPage />} />
            <Route path="/admin/orders"         element={<AllOrdersPage />} />
            <Route path="/admin/orders/:id"     element={<AdminOrderDetailPage />} />
            <Route path="/admin/menu"           element={<MenuManagementPage />} />
            <Route path="/admin/menu/categories"element={<CategoryManagementPage />} />
            <Route path="/admin/extra-items"    element={<ExtraItemManagementPage />} />
            <Route path="/admin/customers"      element={<CustomerManagementPage />} />
            <Route path="/admin/settings"       element={<RestaurantSettingsPage />} />
          </Route>
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
