import { useState, useEffect, useCallback } from 'react'
import { reviewService } from '../../services/reviewService'
import { useAuth } from '../../context/AuthContext'
import { formatDate } from '../../utils/formatters'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'
import { HiStar, HiThumbUp, HiPencilAlt, HiFilter, HiCheckCircle } from 'react-icons/hi'
import toast from 'react-hot-toast'

const RATING_LABELS = {
  1: 'Disappointing',
  2: 'Fair',
  3: 'Good',
  4: 'Very Good',
  5: 'Exceptional! 🌟',
}

const VISIT_TYPES = ['Dine-in', 'Family Dinner', 'Celebration', 'Quick Bite', 'Business Lunch']

export default function ReviewsPage() {
  const { user } = useAuth()

  // Data states
  const [reviews, setReviews] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [likedReviews, setLikedReviews] = useState(new Set())

  // Filter & sort states
  const [ratingFilter, setRatingFilter] = useState('')
  const [sortBy, setSortBy] = useState('newest')

  // Form states
  const [formData, setFormData] = useState({
    customerName: user?.name || '',
    mobile: user?.mobile || '',
    rating: 5,
    title: '',
    comment: '',
    visitType: 'Dine-in',
  })
  const [hoverRating, setHoverRating] = useState(0)
  const [formErrors, setFormErrors] = useState({})

  // Update name if user logs in/out
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        customerName: prev.customerName || user.name,
        mobile: prev.mobile || user.mobile,
      }))
    }
  }, [user])

  // Load reviews and summary
  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      const params = {}
      if (ratingFilter) params.rating = parseInt(ratingFilter, 10)
      if (sortBy) params.sort = sortBy

      const [reviewsRes, summaryRes] = await Promise.all([
        reviewService.getReviews(params),
        reviewService.getSummary(),
      ])

      setReviews(reviewsRes.data.data || [])
      setSummary(summaryRes.data.data || null)
    } catch {
      toast.error('Failed to load reviews. Please refresh the page.')
    } finally {
      setLoading(false)
    }
  }, [ratingFilter, sortBy])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Form input handler
  function handleFormChange(field, value) {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  // Validate form
  function validateForm() {
    const errs = {}
    if (!formData.customerName.trim()) {
      errs.customerName = 'Your name is required.'
    }
    if (!formData.rating || formData.rating < 1 || formData.rating > 5) {
      errs.rating = 'Please choose a rating from 1 to 5 stars.'
    }
    if (!formData.comment.trim()) {
      errs.comment = 'Please share your review or dining experience.'
    } else if (formData.comment.trim().length < 10) {
      errs.comment = 'Review comment must be at least 10 characters long.'
    }
    return errs
  }

  // Submit review
  async function handleSubmitReview(e) {
    e.preventDefault()
    const errs = validateForm()
    if (Object.keys(errs).length > 0) {
      setFormErrors(errs)
      return
    }

    setSubmitting(true)
    try {
      await reviewService.createReview({
        customerName: formData.customerName.trim(),
        mobile: formData.mobile?.trim() || null,
        rating: formData.rating,
        title: formData.title?.trim() || null,
        comment: formData.comment.trim(),
        visitType: formData.visitType || 'Dine-in',
      })

      toast.success('🎉 Thank you! Your review has been submitted successfully.')
      setFormData({
        customerName: user?.name || '',
        mobile: user?.mobile || '',
        rating: 5,
        title: '',
        comment: '',
        visitType: 'Dine-in',
      })
      setFormOpen(false)
      loadData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // Like review handler
  async function handleLike(id) {
    if (likedReviews.has(id)) return
    try {
      setLikedReviews(prev => new Set(prev).add(id))
      setReviews(prev =>
        prev.map(r => (r.id === id ? { ...r, likes: r.likes + 1 } : r))
      )
      await reviewService.likeReview(id)
    } catch {
      // Revert if API fails
      setLikedReviews(prev => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
      setReviews(prev =>
        prev.map(r => (r.id === id ? { ...r, likes: Math.max(0, r.likes - 1) } : r))
      )
    }
  }

  // Calculate percentage for progress bars
  const totalCount = summary?.totalReviews || 0
  const avgRating = summary?.averageRating || 0

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ─── Breadcrumb & Title ─── */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-primary-600 bg-primary-50 px-3 py-1 rounded-full border border-primary-200">
            Guest Testimonials
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-gray-900 mt-3 mb-4 tracking-tight">
            Customer Reviews & Experiences
          </h1>
          <p className="text-gray-600 text-base leading-relaxed">
            See what our patrons love about our traditional Odishan recipes, warm hospitality, and dining ambiance.
          </p>
        </div>

        {/* ─── Overview Hero Card ─── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

            {/* Overall Score */}
            <div className="lg:col-span-4 text-center lg:border-r lg:border-gray-100 lg:pr-8">
              <div className="inline-flex items-baseline gap-1">
                <span className="text-6xl font-black text-gray-900 font-display">
                  {avgRating > 0 ? avgRating.toFixed(1) : '5.0'}
                </span>
                <span className="text-gray-400 text-xl font-medium">/ 5</span>
              </div>

              {/* Stars */}
              <div className="flex justify-center gap-1 text-amber-400 text-2xl my-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <HiStar
                    key={star}
                    className={star <= Math.round(avgRating || 5) ? 'text-amber-400' : 'text-gray-200'}
                  />
                ))}
              </div>
              <p className="text-sm font-medium text-gray-500">
                Based on <span className="font-bold text-gray-800">{totalCount}</span> verified guest reviews
              </p>
            </div>

            {/* Rating Breakdown Bars */}
            <div className="lg:col-span-5 space-y-2">
              {[5, 4, 3, 2, 1].map(stars => {
                const count = summary?.ratingCounts?.[stars] || 0
                const percent = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0
                return (
                  <button
                    key={stars}
                    onClick={() => setRatingFilter(ratingFilter === String(stars) ? '' : String(stars))}
                    className={`w-full flex items-center gap-3 text-sm py-1 px-2 rounded-lg transition-colors group text-left
                      ${ratingFilter === String(stars) ? 'bg-primary-50 text-primary-700 font-bold' : 'hover:bg-gray-50 text-gray-600'}`}
                  >
                    <div className="flex items-center gap-1 w-12 font-medium">
                      <span>{stars}</span>
                      <HiStar className="text-amber-400 text-sm" />
                    </div>
                    <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="w-10 text-right text-xs text-gray-400 group-hover:text-gray-700">
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Write Review CTA */}
            <div className="lg:col-span-3 text-center lg:text-right flex flex-col justify-center items-center lg:items-end">
              <p className="text-sm text-gray-500 mb-3 text-center lg:text-right">
                Dined with us recently? We would love to hear your feedback!
              </p>
              <button
                onClick={() => setFormOpen(prev => !prev)}
                className="btn-primary py-3 px-6 text-sm flex items-center gap-2 shadow-sm hover:shadow transition-all"
              >
                <HiPencilAlt className="text-lg" />
                {formOpen ? 'Close Review Form' : 'Write a Review'}
              </button>
            </div>

          </div>
        </div>

        {/* ─── Write Review Form (Expandable) ─── */}
        {formOpen && (
          <div className="bg-white rounded-2xl shadow-md border border-primary-200 p-6 sm:p-8 mb-10 animate-fadeIn">
            <div className="flex items-center justify-between border-b pb-4 mb-6">
              <div>
                <h2 className="font-display text-2xl font-bold text-gray-900">Share Your Experience</h2>
                <p className="text-sm text-gray-500 mt-0.5">Your honest review helps us serve you better.</p>
              </div>
              <button
                onClick={() => setFormOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-sm font-semibold"
              >
                ✕ Cancel
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-6">
              {/* Star Rating Picker */}
              <div>
                <label className="label mb-2">Overall Rating *</label>
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5 text-3xl cursor-pointer">
                    {[1, 2, 3, 4, 5].map(star => {
                      const active = star <= (hoverRating || formData.rating)
                      return (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => handleFormChange('rating', star)}
                          className="focus:outline-none transition-transform hover:scale-125"
                        >
                          <HiStar className={active ? 'text-amber-400' : 'text-gray-200'} />
                        </button>
                      )
                    })}
                  </div>
                  <span className="text-sm font-semibold text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                    {RATING_LABELS[hoverRating || formData.rating]}
                  </span>
                </div>
                {formErrors.rating && <p className="text-xs text-red-600 mt-1">{formErrors.rating}</p>}
              </div>

              {/* Name & Mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={e => handleFormChange('customerName', e.target.value)}
                    placeholder="e.g. Soumya Mohapatra"
                    className={`input-field ${formErrors.customerName ? 'border-red-500' : ''}`}
                  />
                  {formErrors.customerName && (
                    <p className="text-xs text-red-600 mt-1">{formErrors.customerName}</p>
                  )}
                </div>

                <div>
                  <label className="label">Mobile Number (Optional)</label>
                  <input
                    type="tel"
                    value={formData.mobile}
                    onChange={e => handleFormChange('mobile', e.target.value)}
                    placeholder="10-digit mobile number"
                    className="input-field"
                  />
                </div>
              </div>

              {/* Dining Occasion / Visit Type */}
              <div>
                <label className="label mb-2">Visit Occasion</label>
                <div className="flex flex-wrap gap-2">
                  {VISIT_TYPES.map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleFormChange('visitType', type)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors
                        ${formData.visitType === type
                          ? 'bg-primary-500 text-white shadow-sm'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="label">Review Headline (Optional)</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => handleFormChange('title', e.target.value)}
                  placeholder="e.g. Best Mati Handi Mutton in Bhubaneswar!"
                  className="input-field"
                />
              </div>

              {/* Comments */}
              <div>
                <label className="label">Your Review *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.comment}
                  onChange={e => handleFormChange('comment', e.target.value)}
                  placeholder="Tell us what you liked about the food, ambiance, service, or dishes you'd recommend..."
                  className={`input-field resize-none ${formErrors.comment ? 'border-red-500' : ''}`}
                />
                {formErrors.comment && (
                  <p className="text-xs text-red-600 mt-1">{formErrors.comment}</p>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="btn-secondary py-2.5 px-5 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary py-2.5 px-7 text-sm flex items-center gap-2"
                >
                  {submitting ? <LoadingSpinner size="sm" /> : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ─── Filter & Sort Toolbar ─── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-bold text-gray-500 flex items-center gap-1 mr-1">
              <HiFilter className="text-sm" /> Filter:
            </span>
            <button
              onClick={() => setRatingFilter('')}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors
                ${ratingFilter === '' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              All Stars ({totalCount})
            </button>
            {[5, 4, 3, 2, 1].map(stars => (
              <button
                key={stars}
                onClick={() => setRatingFilter(ratingFilter === String(stars) ? '' : String(stars))}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap flex items-center gap-1 transition-colors
                  ${ratingFilter === String(stars)
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                <span>{stars}</span>
                <HiStar className="text-amber-400" />
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-500">Sort by:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="text-xs font-medium text-gray-700 border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="newest">Newest First</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
              <option value="helpful">Most Helpful</option>
            </select>
          </div>
        </div>

        {/* ─── Reviews List ─── */}
        {loading ? (
          <LoadingSpinner size="lg" className="py-24" />
        ) : reviews.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center max-w-lg mx-auto">
            <span className="text-4xl mb-3 block">💬</span>
            <h3 className="font-display text-xl font-bold text-gray-800 mb-1">No reviews found</h3>
            <p className="text-gray-500 text-sm mb-6">
              {ratingFilter
                ? `There are no ${ratingFilter}-star reviews yet.`
                : 'Be the very first guest to leave a review!'}
            </p>
            <button
              onClick={() => {
                setRatingFilter('')
                setFormOpen(true)
              }}
              className="btn-primary py-2.5 px-6 text-sm"
            >
              Write First Review
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map(review => {
              const initials = review.customerName
                .split(' ')
                .map(n => n[0])
                .slice(0, 2)
                .join('')
                .toUpperCase()

              const isLiked = likedReviews.has(review.id)

              return (
                <div
                  key={review.id}
                  className="bg-white rounded-2xl p-6 sm:p-7 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className="w-11 h-11 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {initials || 'U'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-gray-900 text-base">{review.customerName}</h4>
                          <span className="inline-flex items-center gap-0.5 text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded-full font-medium">
                            <HiCheckCircle className="text-sm" /> Verified Guest
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">{formatDate(review.createdAt)}</p>
                      </div>
                    </div>

                    {/* Visit Type Badge */}
                    {review.visitType && (
                      <span className="text-xs font-medium text-gray-500 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full">
                        {review.visitType}
                      </span>
                    )}
                  </div>

                  {/* Stars */}
                  <div className="flex items-center gap-1 text-amber-400 text-lg mb-2">
                    {[1, 2, 3, 4, 5].map(s => (
                      <HiStar
                        key={s}
                        className={s <= review.rating ? 'text-amber-400' : 'text-gray-200'}
                      />
                    ))}
                    <span className="text-xs font-semibold text-gray-500 ml-1.5">
                      {RATING_LABELS[review.rating]}
                    </span>
                  </div>

                  {/* Title */}
                  {review.title && (
                    <h3 className="font-display font-bold text-gray-900 text-lg mb-2">
                      {review.title}
                    </h3>
                  )}

                  {/* Comment */}
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed mb-4">
                    {review.comment}
                  </p>

                  {/* Helpful Reaction */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-50 text-xs text-gray-500">
                    <span className="italic text-gray-400">Experience at Adi Anadi Restaurant</span>
                    <button
                      onClick={() => handleLike(review.id)}
                      disabled={isLiked}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all
                        ${isLiked
                          ? 'bg-primary-50 border-primary-200 text-primary-600 font-semibold'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                    >
                      <HiThumbUp className={isLiked ? 'text-primary-600' : 'text-gray-400'} />
                      <span>{isLiked ? 'Helpful' : 'Helpful'}</span>
                      {review.likes > 0 && <span className="font-bold">({review.likes})</span>}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

      </div>
    </div>
  )
}
