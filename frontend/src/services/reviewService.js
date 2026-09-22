import api from './api'

export const reviewService = {
  getReviews: (params) => api.get('/reviews', { params }),
  getSummary: () => api.get('/reviews/summary'),
  createReview: (data) => api.post('/reviews', data),
  likeReview: (id) => api.post(`/reviews/${id}/like`),
}
