import api from './api'

export const menuService = {
  getMenu:         () => api.get('/menu'),
  getCategories:   () => api.get('/menu/categories'),
  getMenuItem:     (id) => api.get(`/menu/${id}`),
  getExtraItems:   () => api.get('/extra-items'),
  getRestaurant:   () => api.get('/restaurant'),
}
