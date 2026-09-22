import { createContext, useContext, useReducer, useCallback } from 'react'

const CartContext = createContext(null)

const initialState = {
  bookingInfo: {
    guestCount: 2,
    bookingDate: '',
    bookingTime: '',
    customerName: '',
    mobile: '',
    email: '',
    specialInstructions: '',
  },
  items: [],        // [{ menuItem, quantity }]
  extraItems: [],   // [{ extraItem, quantity }]
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'SET_BOOKING_INFO':
      return { ...state, bookingInfo: { ...state.bookingInfo, ...action.payload } }

    case 'ADD_ITEM': {
      const exists = state.items.find(i => i.menuItem.id === action.payload.id)
      if (exists) {
        return {
          ...state,
          items: state.items.map(i =>
            i.menuItem.id === action.payload.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        }
      }
      return { ...state, items: [...state.items, { menuItem: action.payload, quantity: 1 }] }
    }

    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.menuItem.id !== action.payload) }

    case 'UPDATE_ITEM_QTY':
      if (action.payload.quantity <= 0) {
        return { ...state, items: state.items.filter(i => i.menuItem.id !== action.payload.id) }
      }
      return {
        ...state,
        items: state.items.map(i =>
          i.menuItem.id === action.payload.id ? { ...i, quantity: action.payload.quantity } : i
        ),
      }

    case 'ADD_EXTRA': {
      const exists = state.extraItems.find(i => i.extraItem.id === action.payload.id)
      if (exists) return state
      return { ...state, extraItems: [...state.extraItems, { extraItem: action.payload, quantity: 1 }] }
    }

    case 'UPDATE_EXTRA_QTY':
      if (action.payload.quantity <= 0) {
        return { ...state, extraItems: state.extraItems.filter(i => i.extraItem.id !== action.payload.id) }
      }
      return {
        ...state,
        extraItems: state.extraItems.map(i =>
          i.extraItem.id === action.payload.id ? { ...i, quantity: action.payload.quantity } : i
        ),
      }

    case 'CLEAR_CART':
      return initialState

    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  const setBookingInfo   = useCallback(info => dispatch({ type: 'SET_BOOKING_INFO', payload: info }), [])
  const addItem          = useCallback(item => dispatch({ type: 'ADD_ITEM', payload: item }), [])
  const removeItem       = useCallback(id   => dispatch({ type: 'REMOVE_ITEM', payload: id }), [])
  const updateItemQty    = useCallback((id, quantity) => dispatch({ type: 'UPDATE_ITEM_QTY', payload: { id, quantity } }), [])
  const addExtraItem     = useCallback(item => dispatch({ type: 'ADD_EXTRA', payload: item }), [])
  const updateExtraQty   = useCallback((id, quantity) => dispatch({ type: 'UPDATE_EXTRA_QTY', payload: { id, quantity } }), [])
  const clearCart        = useCallback(() => dispatch({ type: 'CLEAR_CART' }), [])

  const subtotal   = state.items.reduce((sum, i) => sum + i.menuItem.price * i.quantity, 0)
  const extraTotal = state.extraItems.reduce((sum, i) => sum + i.extraItem.price * i.quantity, 0)
  const grandTotal = subtotal + extraTotal
  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0)

  const value = {
    ...state,
    subtotal, extraTotal, grandTotal, totalItems,
    setBookingInfo, addItem, removeItem, updateItemQty,
    addExtraItem, updateExtraQty, clearCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
