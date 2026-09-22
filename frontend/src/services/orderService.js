import api from './api'

export const orderService = {
  createOrder:  (data) => api.post('/orders', data),
  getMyOrders:  ()     => api.get('/orders/my-orders'),
  getOrder:     (id)   => api.get(`/orders/${id}`),
  cancelOrder:  (id)   => api.put(`/orders/${id}/cancel`),
  getProfile:   ()     => api.get('/customers/profile'),
  updateProfile:(data) => api.put('/customers/profile', data),
}
