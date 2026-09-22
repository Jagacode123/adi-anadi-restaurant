import api from './api'

export const adminService = {
  // Dashboard
  getDashboard:       ()           => api.get('/admin/dashboard'),

  // Orders
  getAllOrders:        (params)     => api.get('/admin/orders', { params }),
  getPendingOrders:   ()           => api.get('/admin/orders/pending'),
  getOrder:           (id)         => api.get(`/admin/orders/${id}`),
  approveOrder:       (id)         => api.put(`/admin/orders/${id}/approve`),
  rejectOrder:        (id, data)   => api.put(`/admin/orders/${id}/reject`, data),
  completeOrder:      (id)         => api.put(`/admin/orders/${id}/complete`),

  // Menu
  createMenuItem:     (data)       => api.post('/admin/menu', data),
  updateMenuItem:     (id, data)   => api.put(`/admin/menu/${id}`, data),
  deleteMenuItem:     (id)         => api.delete(`/admin/menu/${id}`),
  createCategory:     (data)       => api.post('/admin/menu/categories', data),
  updateCategory:     (id, data)   => api.put(`/admin/menu/categories/${id}`, data),
  deleteCategory:     (id)         => api.delete(`/admin/menu/categories/${id}`),

  // Extra items
  createExtraItem:    (data)       => api.post('/admin/extra-items', data),
  updateExtraItem:    (id, data)   => api.put(`/admin/extra-items/${id}`, data),
  deleteExtraItem:    (id)         => api.delete(`/admin/extra-items/${id}`),

  // Customers
  getCustomers:       (params)     => api.get('/admin/customers', { params }),

  // Restaurant config
  getRestaurantConfig:()           => api.get('/admin/restaurant'),
  updateRestaurantConfig:(data)    => api.put('/admin/restaurant', data),
  getTimeSlots:       ()           => api.get('/admin/restaurant/slots'),
  saveTimeSlot:       (data)       => api.post('/admin/restaurant/slots', data),
}
